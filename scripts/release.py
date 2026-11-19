#!/usr/bin/env python3
"""Fanous-e Khial release driver: committed source -> Docker Hub digest -> astronomy namespace."""
import argparse
import base64
import hashlib
from datetime import datetime, timezone
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import tarfile
import tempfile

ROOT = Path(__file__).resolve().parents[1]
KUBE = ['kubectl', '--context', 'ravand', '--namespace', 'astronomy']
REPOSITORY = 'docker.io/atamoradi/manderia'

def run(args, data=None, capture=True, private=False):
    result = subprocess.run(args, input=data, capture_output=capture, cwd=ROOT)
    if result.returncode:
        if not private and capture:
            print(result.stderr.decode(errors='replace'), file=__import__('sys').stderr)
        raise RuntimeError(f'{args[0]} operation failed (exit {result.returncode})')
    return result.stdout if capture else b''

def save(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2) + '\n', encoding='utf-8')

def record_path(tag):
    if not re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9_.-]{0,100}', tag):
        raise RuntimeError('Supply a unique valid release tag; latest is not a release identifier')
    if tag == 'latest':
        raise RuntimeError('Use a unique release tag, not latest')
    return ROOT / '.releases' / f'{tag}.json'

def registry_auth():
    username, token = os.getenv('DOCKERHUB_USERNAME'), os.getenv('DOCKERHUB_TOKEN')
    if not (username and token):
        config_path = Path(os.getenv('DOCKER_CONFIG', str(Path.home() / '.docker'))) / 'config.json'
        config = json.loads(config_path.read_text())
        server = 'https://index.docker.io/v1/'
        helper = config.get('credHelpers', {}).get(server, config.get('credsStore'))
        if helper:
            command = shutil.which('docker-credential-' + helper)
            if not command:
                raise RuntimeError('Docker credential helper is unavailable; run docker login or set Docker Hub credentials')
            credentials = json.loads(run([command, 'get'], (server + '\n').encode(), private=True))
            username, token = credentials['Username'], credentials['Secret']
        else:
            auth = config.get('auths', {}).get(server, {}).get('auth')
            if auth:
                username, token = base64.b64decode(auth).decode().split(':', 1)
    if not (username and token) or username == '<token>':
        raise RuntimeError('Docker Hub username/password credentials are required for namespace-local image pulls')
    return {'auths': {'https://index.docker.io/v1/': {'auth': base64.b64encode(f'{username}:{token}'.encode()).decode()}}}

def build_push(args):
    path = record_path(args.tag)
    if path.exists():
        raise RuntimeError('Release record already exists. Use a fresh tag.')
    if run(['git', 'status', '--porcelain']).strip():
        raise RuntimeError('Commit source changes before building; images are built from a clean Git archive')
    sha = run(['git', 'rev-parse', 'HEAD']).decode().strip()
    image = f'{REPOSITORY}:{args.tag}'
    with tempfile.TemporaryDirectory(prefix='manderia-build-') as temp:
        archive = Path(temp) / 'source.tar'
        source = Path(temp) / 'source'
        source.mkdir()
        run(['git', 'archive', '--format=tar', '--output', str(archive), sha])
        with tarfile.open(archive) as tar:
            tar.extractall(source, filter='data')
        run(['docker', 'build', '--platform', 'linux/amd64', '--build-arg', f'SOURCE_REVISION={sha}', '-t', image, str(source)], capture=False)
    run(['docker', 'push', image], capture=False)
    manifest = run(['docker', 'buildx', 'imagetools', 'inspect', image]).decode()
    digest_match = re.search(r'^Digest:\s+(sha256:[a-f0-9]{64})$', manifest, re.M)
    if not digest_match:
        raise RuntimeError('Registry did not return a valid pushed image digest')
    digest = digest_match[1]
    raw = json.loads(run(['docker', 'buildx', 'imagetools', 'inspect', '--raw', image]))
    platform_digest = next((m['digest'] for m in raw.get('manifests', []) if m.get('platform', {}).get('os') == 'linux' and m.get('platform', {}).get('architecture') == 'amd64'), digest)
    value = {'application': 'Fanous-e Khial', 'namespace': 'astronomy', 'context': 'ravand', 'tag': args.tag, 'sourceRevision': sha, 'image': image, 'digest': f'{REPOSITORY}@{digest}', 'platformDigest': platform_digest, 'authSchema': 1, 'builtAt': datetime.now(timezone.utc).isoformat()}
    save(path, value)
    print('Pushed:', value['digest'])
    print('Release record:', path)

def load_release(tag):
    release = json.loads(record_path(tag).read_text(encoding='utf-8'))
    if release.get('authSchema') != 1:
        raise RuntimeError('This release predates account protection; deploy an authenticated release instead')
    if release['namespace'] != 'astronomy' or release['context'] != 'ravand' or not re.fullmatch(re.escape(REPOSITORY) + r'@sha256:[a-f0-9]{64}', release['digest']) or not re.fullmatch('[a-f0-9]{40}', release['sourceRevision']):
        raise RuntimeError('Invalid release provenance or deployment target')
    return release

def auth_settings():
    path = ROOT / '.env'
    values = {}
    if path.exists():
        for line in path.read_text(encoding='utf-8-sig').splitlines():
            if '=' in line and not line.lstrip().startswith('#'):
                key, value = line.split('=', 1)
                values[key.strip()] = value.strip().strip('"').strip("'")
    keys = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'NEXTAUTH_SECRET', 'NEXTAUTH_URL', 'ADMIN_EMAILS', 'SATELLITE_SHARED_SECRET', 'SATELLITE_SERVICE_URL']
    settings = {key: os.getenv(key) or values.get(key, '') for key in keys}
    if any(not value for value in settings.values()) or len(settings['NEXTAUTH_SECRET']) < 32 or settings['NEXTAUTH_URL'] != 'https://fanous.online':
        raise RuntimeError('Complete the private .env auth settings for https://fanous.online before deployment')
    # Optional one-time-code sign-in. Phone codes use Ravand's SMS relay (in-cluster, approved OTP
    # pattern); email codes use the Azure Communication Services resource Darvazeh already uses.
    # Each channel is enabled only when its complete settings are present.
    for group in (('OTP_SMS_URL', 'OTP_SMS_API_KEY'), ('ACS_CONNECTION_STRING', 'ACS_SENDER_ADDRESS')):
        optional = {key: os.getenv(key) or values.get(key, '') for key in group}
        if all(optional.values()):
            settings.update(optional)
    return settings

def backup_users(before, stamp):
    if not before:
        return
    backup = '/data/backups/users-' + stamp + '.sqlite'
    code = "const fs=require('node:fs'),{DatabaseSync}=require('node:sqlite');const path=process.env.AUTH_DB_PATH||'/data/users.sqlite';if(!fs.existsSync(path)){console.log('No existing account database');process.exit(0)}fs.mkdirSync('/data/backups',{recursive:true});const db=new DatabaseSync(path);if(db.prepare('PRAGMA quick_check').get().quick_check!=='ok')process.exit(2);db.prepare('VACUUM INTO ?').run(" + json.dumps(backup) + ");db.close();"
    run(KUBE + ['exec','deployment/manderia','--','node','-e',code], private=True)
    local = ROOT / '.local' / 'user-backups' / ('users-' + stamp + '.sqlite')
    local.parent.mkdir(parents=True, exist_ok=True)
    result = subprocess.run(KUBE + ['exec','deployment/manderia','--','cat',backup], capture_output=True)
    if result.returncode:
        raise RuntimeError('Account database backup was not readable; deployment stopped')
    remote_hash = run(KUBE + ['exec','deployment/manderia','--','node','-e',"console.log(require('node:crypto').createHash('sha256').update(require('node:fs').readFileSync(" + json.dumps(backup) + ")).digest('hex'))"], private=True).decode().strip()
    if hashlib.sha256(result.stdout).hexdigest() != remote_hash:
        raise RuntimeError('Database backup checksum verification failed')
    local.write_bytes(result.stdout)
    local.chmod(0o600)
    import sqlite3
    with sqlite3.connect(str(local)) as db:
        if db.execute('PRAGMA quick_check').fetchone()[0] != 'ok':
            raise RuntimeError('Local account database backup failed integrity verification')
    print('Account database backed up locally and on its volume before deployment.')

def deploy(args):
    release = load_release(args.tag)
    settings = auth_settings()
    config_sha = hashlib.sha256(json.dumps(settings, sort_keys=True).encode()).hexdigest()
    manifest = (ROOT / 'deploy/k8s/manderia.yaml').read_text(encoding='utf-8-sig').replace('IMAGE_REF', release['digest']).replace('SOURCE_REVISION', release['sourceRevision']).replace('AUTH_CONFIG_SHA', config_sha).encode()
    if args.dry_run:
        result = run(KUBE + ['apply', '--dry-run=client', '-f', '-'], manifest)
        print(result.decode(), end='')
        print('Target: context=ravand namespace=astronomy node=ravand-worker-01 image=' + release['digest'])
        return
    run(['kubectl', '--context', 'ravand', 'get', 'node', 'ravand-worker-01'])
    credentials = registry_auth()
    before = json.loads(run(KUBE + ['get', 'deployment', 'manderia', '--ignore-not-found', '-o', 'json']) or b'null')
    stamp = datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')
    save(ROOT / '.local' / 'deployment-backups' / f'{stamp}-{args.tag}.json', before)
    backup_users(before, stamp)
    namespace = json.dumps({'apiVersion':'v1','kind':'Namespace','metadata':{'name':'astronomy','labels':{'app.kubernetes.io/part-of':'manderia'}}}).encode()
    run(KUBE + ['apply', '-f', '-'], namespace)
    secret = {'apiVersion': 'v1', 'kind': 'Secret', 'metadata': {'name': 'manderia-registry', 'namespace': 'astronomy'}, 'type': 'kubernetes.io/dockerconfigjson', 'data': {'.dockerconfigjson': base64.b64encode(json.dumps(credentials).encode()).decode()}}
    run(KUBE + ['apply', '-f', '-'], json.dumps(secret).encode(), private=True)
    auth_secret = {'apiVersion':'v1','kind':'Secret','metadata':{'name':'manderia-auth','namespace':'astronomy'},'type':'Opaque','stringData':settings}
    run(KUBE + ['apply','-f','-'], json.dumps(auth_secret).encode(), private=True)
    print(run(KUBE + ['apply', '--dry-run=server', '-f', '-'], manifest).decode(), end='')
    print(run(KUBE + ['apply', '-f', '-'], manifest).decode(), end='')
    run(KUBE + ['rollout', 'status', 'deployment/manderia', '--timeout=300s'], capture=False)
    deployment = json.loads(run(KUBE + ['get', 'deployment', 'manderia', '-o', 'json']))
    podspec = deployment['spec']['template']['spec']
    pods = json.loads(run(KUBE + ['get', 'pods', '-l', 'app.kubernetes.io/name=manderia', '-o', 'json']))['items']
    healthy = [p for p in pods if not p['metadata'].get('deletionTimestamp') and p['status'].get('phase') == 'Running' and all(c.get('ready') for c in p['status'].get('containerStatuses', []))]
    if podspec['nodeSelector']['kubernetes.io/hostname'] != 'ravand-worker-01' or podspec['containers'][0]['image'] != release['digest'] or not healthy:
        raise RuntimeError('Post-rollout placement/image/readiness validation failed')
    statuses = []
    for pod in healthy:
        if pod['spec']['nodeName'] != 'ravand-worker-01':
            raise RuntimeError('Pod is scheduled on the wrong node')
        container = pod['status']['containerStatuses'][0]
        if not any(d in container['imageID'] for d in [release['digest'].split('@')[1], release.get('platformDigest', release['digest'].split('@')[1])]):
            raise RuntimeError('Running image digest differs from pushed image')
        statuses.append({'pod': pod['metadata']['name'], 'node': pod['spec']['nodeName'], 'imageID': container['imageID'], 'restarts': container['restartCount']})
    release['deployedAt'] = datetime.now(timezone.utc).isoformat()
    release['pods'] = statuses
    save(record_path(args.tag), release)
    print(json.dumps(statuses, indent=2))
    print('Rollout verified by digest. Configure the shared gateway separately with configure-public-endpoint.py.')

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('action', choices=['build-and-push', 'deploy', 'status'])
    parser.add_argument('--tag', default=os.getenv('IMAGE_TAG'))
    parser.add_argument('--dry-run', action='store_true')
    args = parser.parse_args()
    if args.action == 'status':
        run(KUBE + ['get', 'deployment,service,pods', '-o', 'wide'], capture=False)
        return
    if not args.tag:
        raise RuntimeError('Supply --tag or IMAGE_TAG')
    if args.action == 'build-and-push':
        if args.dry_run:
            raise RuntimeError('--dry-run is supported only for deployment')
        build_push(args)
    else:
        deploy(args)

if __name__ == '__main__':
    try:
        main()
    except (RuntimeError, OSError, ValueError, KeyError) as error:
        print('Release failed: ' + (str(error) if isinstance(error, RuntimeError) else type(error).__name__), file=__import__('sys').stderr)
        raise SystemExit(1)
