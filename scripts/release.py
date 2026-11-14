#!/usr/bin/env python3
"""Manderia release driver: committed source -> Docker Hub digest -> astronomy namespace."""
import argparse
import base64
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
    value = {'application': 'Manderia', 'namespace': 'astronomy', 'context': 'ravand', 'tag': args.tag, 'sourceRevision': sha, 'image': image, 'digest': f'{REPOSITORY}@{digest}', 'platformDigest': platform_digest, 'builtAt': datetime.now(timezone.utc).isoformat()}
    save(path, value)
    print('Pushed:', value['digest'])
    print('Release record:', path)

def load_release(tag):
    release = json.loads(record_path(tag).read_text(encoding='utf-8'))
    if release['namespace'] != 'astronomy' or release['context'] != 'ravand' or not re.fullmatch(re.escape(REPOSITORY) + r'@sha256:[a-f0-9]{64}', release['digest']) or not re.fullmatch('[a-f0-9]{40}', release['sourceRevision']):
        raise RuntimeError('Invalid release provenance or deployment target')
    return release

def deploy(args):
    release = load_release(args.tag)
    manifest = (ROOT / 'deploy/k8s/manderia.yaml').read_text(encoding='utf-8-sig').replace('IMAGE_REF', release['digest']).replace('SOURCE_REVISION', release['sourceRevision']).encode()
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
    namespace = json.dumps({'apiVersion':'v1','kind':'Namespace','metadata':{'name':'astronomy','labels':{'app.kubernetes.io/part-of':'manderia'}}}).encode()
    run(KUBE + ['apply', '-f', '-'], namespace)
    secret = {'apiVersion': 'v1', 'kind': 'Secret', 'metadata': {'name': 'manderia-registry', 'namespace': 'astronomy'}, 'type': 'kubernetes.io/dockerconfigjson', 'data': {'.dockerconfigjson': base64.b64encode(json.dumps(credentials).encode()).decode()}}
    run(KUBE + ['apply', '-f', '-'], json.dumps(secret).encode(), private=True)
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
