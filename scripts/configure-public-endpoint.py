#!/usr/bin/env python3
"""Back up the shared gateway and configure the Fanous public endpoint."""
import argparse
from datetime import datetime, timezone
import hashlib
import io
import json
import os
from pathlib import Path
import subprocess
import tarfile
import urllib.parse
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
KUBE = ['kubectl', '--context', 'ravand', '-n', 'hamafarin-apps']
HOST = 'fanous.online'
WORKER_IP = '2.29.120.138'
START, END = '# BEGIN MANDERIA PUBLIC ENDPOINT', '# END MANDERIA PUBLIC ENDPOINT'

def command(args, data=None):
    result = subprocess.run(args, input=data, capture_output=True)
    if result.returncode:
        raise RuntimeError(f'{Path(args[0]).name} operation failed; private output withheld')
    return result.stdout

def gateway_cli(action, data, adapter=True):
    args = KUBE + ['exec', '-i', 'deployment/caddy', '--', 'caddy', action, '--config', '-']
    if adapter:
        args += ['--adapter', 'caddyfile']
    return command(args, data)

def active_config():
    return command(KUBE + ['exec', 'deployment/caddy', '--', 'wget', '-qO-', 'http://127.0.0.1:2019/config/'])

def env_token(path):
    token = os.getenv('CLOUDFLARE_API_TOKEN')
    if token:
        return token
    if path:
        for line in path.read_text(encoding='utf-8-sig').splitlines():
            if line.strip().startswith('CLOUDFLARE_API_TOKEN='):
                return line.strip().split('=', 1)[1].strip().strip('"').strip("'")
    raise RuntimeError('Set CLOUDFLARE_API_TOKEN or pass --env-file with the existing operator credentials')

def private_write(path, value):
    path.write_bytes(value)
    path.chmod(0o600)

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--apply', action='store_true')
    parser.add_argument('--env-file', type=Path)
    parser.add_argument('--gateway-repo', type=Path, default=ROOT.parent / 'hamafarin-cluster')
    args = parser.parse_args()
    token = env_token(args.env_file)
    def cloudflare(path, method='GET', data=None):
        request = urllib.request.Request('https://api.cloudflare.com/client/v4/' + path, method=method, data=json.dumps(data).encode() if data is not None else None, headers={'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json'})
        with urllib.request.urlopen(request, timeout=40) as response:
            value = json.load(response)
        if not value.get('success'):
            raise RuntimeError('Cloudflare operation rejected; private response withheld')
        return value['result']
    zones = cloudflare('zones?name=fanous.online')
    if len(zones) != 1:
        raise RuntimeError('Expected one accessible fanous.online zone')
    zone = zones[0]['id']
    records = cloudflare(f'zones/{zone}/dns_records?name={HOST}')
    if records and not (len(records) == 1 and records[0]['type'] == 'A' and records[0]['content'] == WORKER_IP):
        raise RuntimeError('Target hostname already has an unexpected DNS record')
    before = json.loads(command(KUBE + ['get', 'configmap', 'caddy-config', '-o', 'json']))
    original = before['data']['Caddyfile']
    snippet = (ROOT / 'deploy/caddy/manderia.Caddyfile').read_text(encoding='utf-8-sig').strip() + '\n'
    if START in original:
        prefix, remainder = original.split(START, 1)
        _, suffix = remainder.split(END, 1)
        updated = prefix + snippet.rstrip() + suffix
    else:
        if HOST in original:
            raise RuntimeError('Target hostname exists outside the managed Manderia block')
        updated = original.rstrip() + '\n\n' + snippet
    source_path = args.gateway_repo / 'manifests/apps.json'
    caddy_path = args.gateway_repo / 'manifests/Caddyfile'
    source = json.loads(source_path.read_text(encoding='utf-8-sig'))
    source_config = next(item for item in source['items'] if item['kind'] == 'ConfigMap' and item['metadata']['name'] == 'caddy-config')
    if source_config['data']['Caddyfile'] != original or caddy_path.read_text(encoding='utf-8-sig') != original:
        raise RuntimeError('Owning gateway desired-state files differ from live ConfigMap; reconcile before proceeding')
    runtime = active_config()
    adapted = gateway_cli('adapt', original.encode())
    if json.loads(adapted) != json.loads(runtime):
        raise RuntimeError('Active gateway differs from its ConfigMap; refusing to overwrite runtime drift')
    gateway_cli('validate', updated.encode())
    print('Validated combined Caddyfile. Existing route blocks are preserved.')
    if not args.apply:
        print('Plan: private local + worker backups, one DNS A record, guarded ConfigMap patch, in-place reload, owning-source update.')
        return
    stamp = datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')
    backup = ROOT / '.local' / 'gateway-backups' / stamp
    backup.mkdir(parents=True, mode=0o700)
    private_write(backup / 'caddy-config.before.json', json.dumps(before).encode())
    private_write(backup / 'caddy-runtime.before.json', runtime)
    private_write(backup / 'Caddyfile.before', original.encode())
    private_write(backup / 'apps.before.json', source_path.read_bytes())
    private_write(backup / 'dns.before.json', json.dumps(records).encode())
    private_write(backup / 'recovery.txt', b'ConfigMap is mounted with subPath. Restore both desired-state files and ConfigMap, then reload saved runtime JSON through Caddy stdin without --adapter. Do not restart or replace shared Caddy. DNS snapshot covers Manderia only.\n')
    archive = io.BytesIO()
    with tarfile.open(fileobj=archive, mode='w') as tar:
        for path in backup.iterdir():
            tar.add(path, arcname=path.name)
    remote = '/var/backups/manderia/caddy/' + stamp
    command(['ssh', '-o', 'BatchMode=yes', '-o', 'ConnectTimeout=15', 'ravand-worker-01', f'umask 077; mkdir -p {remote} && chmod 700 {remote} && tar -xf - -C {remote} && chmod 600 {remote}/*'], archive.getvalue())
    print('Caddy backups:', backup, 'and ravand-worker-01:' + remote)
    if json.loads(active_config()) != json.loads(runtime):
        raise RuntimeError('Active gateway changed during backup; no gateway changes applied')
    data = {'type': 'A', 'name': HOST, 'content': WORKER_IP, 'proxied': True, 'ttl': 1}
    if not records:
        record = cloudflare(f'zones/{zone}/dns_records', 'POST', data)
    elif not records[0].get('proxied'):
        record = cloudflare(f'zones/{zone}/dns_records/{records[0]["id"]}', 'PATCH', {'proxied': True})
    else:
        record = records[0]
    private_write(backup / 'dns.after.json', json.dumps(record).encode())
    patch = [{'op':'test','path':'/metadata/resourceVersion','value':before['metadata']['resourceVersion']}, {'op':'replace','path':'/data/Caddyfile','value':updated}]
    command(KUBE + ['patch', 'configmap', 'caddy-config', '--type=json', '--patch', json.dumps(patch)])
    try:
        gateway_cli('reload', updated.encode())
    except RuntimeError:
        latest = json.loads(command(KUBE + ['get','configmap','caddy-config','-o','json']))
        if latest['data']['Caddyfile'] == updated:
            undo = [{'op':'test','path':'/metadata/resourceVersion','value':latest['metadata']['resourceVersion']},{'op':'replace','path':'/data/Caddyfile','value':original}]
            command(KUBE + ['patch','configmap','caddy-config','--type=json','--patch',json.dumps(undo)])
            gateway_cli('reload', runtime, adapter=False)
        raise
    source_config['data']['Caddyfile'] = updated
    source_path.write_text(json.dumps(source, indent=2, ensure_ascii=False) + '\n', encoding='utf-8', newline='\n')
    caddy_path.write_text(updated, encoding='utf-8', newline='\n')
    after = active_config()
    private_write(backup / 'caddy-runtime.after.json', after)
    private_write(backup / 'Caddyfile.after', updated.encode())
    report = {'hostname':HOST,'namespace':'astronomy','worker':WORKER_IP,'backupLocal':str(backup),'backupWorker':remote,'originalCaddySha256':hashlib.sha256(original.encode()).hexdigest(),'updatedCaddySha256':hashlib.sha256(updated.encode()).hexdigest(),'activeConfigSha256':hashlib.sha256(after).hexdigest()}
    (ROOT / '.local/public-endpoint.json').write_text(json.dumps(report, indent=2)+'\n',encoding='utf-8')
    print('Fanous DNS and shared Caddy route applied; owning gateway source files updated.')

if __name__ == '__main__':
    try:
        main()
    except Exception as error:
        print(str(error) if isinstance(error, RuntimeError) else 'Endpoint operation failed: ' + type(error).__name__, file=__import__('sys').stderr)
        raise SystemExit(1)
