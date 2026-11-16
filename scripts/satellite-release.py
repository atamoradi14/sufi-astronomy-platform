#!/usr/bin/env python3
"""Build and deploy the isolated satellite service, leaving the web release independent."""
import argparse
import hashlib
import json
import re
import tarfile
import tempfile
from datetime import datetime, timezone
from pathlib import Path
import release

ROOT = release.ROOT
KUBE = release.KUBE
REPO = 'docker.io/atamoradi/fanous-satellite'

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('action', choices=['build-and-push', 'deploy'])
    parser.add_argument('--tag', required=True)
    args = parser.parse_args()
    if not re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9_.-]{0,100}', args.tag) or args.tag == 'latest':
        raise RuntimeError('Use a unique release tag')
    record = ROOT / '.releases' / ('satellite-' + args.tag + '.json')
    run = release.run
    if args.action == 'build-and-push':
        if record.exists() or run(['git', 'status', '--porcelain']).strip():
            raise RuntimeError('Use a new tag and a clean committed checkout')
        sha = run(['git', 'rev-parse', 'HEAD']).decode().strip()
        image = REPO + ':' + args.tag
        with tempfile.TemporaryDirectory(prefix='fanous-satellite-') as temp:
            archive, source = Path(temp) / 'source.tar', Path(temp) / 'source'
            source.mkdir()
            run(['git', 'archive', '--format=tar', '--output', str(archive), sha])
            with tarfile.open(archive) as tar:
                tar.extractall(source, filter='data')
            run(['docker', 'build', '--platform', 'linux/amd64', '--build-arg', 'SOURCE_REVISION=' + sha, '-f', str(source / 'services/satellite/Dockerfile'), '-t', image, str(source)], capture=False)
        run(['docker', 'push', image], capture=False)
        info = run(['docker', 'buildx', 'imagetools', 'inspect', image]).decode()
        digest = re.search(r'^Digest:\s+(sha256:[a-f0-9]{64})$', info, re.M)[1]
        release.save(record, {'tag': args.tag, 'sourceRevision': sha, 'digest': REPO + '@' + digest, 'builtAt': datetime.now(timezone.utc).isoformat()})
        print('Pushed:', REPO + '@' + digest)
        return
    value = json.loads(record.read_text(encoding='utf-8'))
    settings = release.auth_settings()
    config = {'SATELLITE_SHARED_SECRET': settings['SATELLITE_SHARED_SECRET'], 'PUBLIC_ORIGIN': 'https://fanous.online'}
    manifest = (ROOT / 'deploy/k8s/satellite.yaml').read_text(encoding='utf-8').replace('IMAGE_REF', value['digest']).replace('SOURCE_REVISION', value['sourceRevision']).replace('CONFIG_SHA', hashlib.sha256(json.dumps(config, sort_keys=True).encode()).hexdigest()).encode()
    stamp = datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')
    before = run(KUBE + ['get', 'deployment', 'fanous-satellite', '--ignore-not-found', '-o', 'json'])
    release.save(ROOT / '.local/deployment-backups' / ('satellite-' + stamp + '.json'), json.loads(before or b'null'))
    if before.strip():
        code = "const{DatabaseSync}=require('node:sqlite'),fs=require('fs');fs.mkdirSync('/data/backups',{recursive:true});const db=new DatabaseSync('/data/satellite.sqlite');if(db.prepare('PRAGMA quick_check').get().quick_check!=='ok')process.exit(2);db.prepare('VACUUM INTO ?').run('/data/backups/" + stamp + ".sqlite');db.close()"
        run(KUBE + ['exec', 'deployment/fanous-satellite', '--', 'node', '-e', code], private=True)
    secret = {'apiVersion': 'v1', 'kind': 'Secret', 'metadata': {'name': 'fanous-satellite-config', 'namespace': 'astronomy'}, 'type': 'Opaque', 'stringData': config}
    run(KUBE + ['apply', '-f', '-'], json.dumps(secret).encode(), private=True)
    print(run(KUBE + ['apply', '--dry-run=server', '-f', '-'], manifest).decode())
    print(run(KUBE + ['apply', '-f', '-'], manifest).decode())
    run(KUBE + ['rollout', 'status', 'deployment/fanous-satellite', '--timeout=300s'], capture=False)
    pods = json.loads(run(KUBE + ['get', 'pods', '-l', 'app.kubernetes.io/name=fanous-satellite', '-o', 'json']))['items']
    ready = [p for p in pods if not p['metadata'].get('deletionTimestamp') and p['spec']['nodeName'] == 'ravand-worker-01' and p['spec']['containers'][0]['image'] == value['digest'] and p['status'].get('containerStatuses') and all(c['ready'] for c in p['status']['containerStatuses'])]
    if not ready:
        raise RuntimeError('Satellite placement/image/readiness verification failed')
    run(KUBE + ['exec', 'deployment/fanous-satellite', '--', 'node', '-e', "fetch('http://127.0.0.1:3860/health').then(async r=>{if(!r.ok)process.exit(2);console.log(await r.text())})"], capture=False)
    value.update(deployedAt=datetime.now(timezone.utc).isoformat(), pods=[p['metadata']['name'] for p in ready])
    release.save(record, value)

if __name__ == '__main__':
    main()
