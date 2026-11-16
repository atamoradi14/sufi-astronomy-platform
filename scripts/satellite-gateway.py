#!/usr/bin/env python3
"""Guarded gateway-only satellite route update; DNS and other host routes remain unchanged."""
import importlib.util
import io
import json
import tarfile
from datetime import datetime, timezone
from pathlib import Path
spec = importlib.util.spec_from_file_location('gateway', Path(__file__).with_name('configure-public-endpoint.py'))
g = importlib.util.module_from_spec(spec)
spec.loader.exec_module(g)

def main():
    before = json.loads(g.command(g.KUBE + ['get', 'configmap', 'caddy-config', '-o', 'json']))
    original = before['data']['Caddyfile']
    prefix, rest = original.split(g.START, 1)
    _, suffix = rest.split(g.END, 1)
    snippet = (g.ROOT / 'deploy/caddy/manderia.Caddyfile').read_text(encoding='utf-8').strip()
    updated = prefix + snippet + suffix
    owner = g.ROOT.parent / 'hamafarin-cluster/manifests'
    source = json.loads((owner / 'apps.json').read_text(encoding='utf-8-sig'))
    config = next(x for x in source['items'] if x['kind']=='ConfigMap' and x['metadata']['name']=='caddy-config')
    if config['data']['Caddyfile'] != original or (owner / 'Caddyfile').read_text(encoding='utf-8-sig') != original:
        raise RuntimeError('Gateway source differs from live config; reconcile drift before updating')
    runtime = g.active_config()
    if json.loads(runtime) != json.loads(g.gateway_cli('adapt', original.encode())):
        raise RuntimeError('Gateway runtime differs from config')
    g.gateway_cli('validate', updated.encode())
    stamp = datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')
    backup = g.ROOT / '.local/gateway-backups' / ('satellite-' + stamp)
    backup.mkdir(parents=True)
    for name,data in [('config.before.json',json.dumps(before).encode()),('runtime.before.json',runtime),('Caddyfile.before',original.encode()),('apps.before.json',(owner / 'apps.json').read_bytes())]:
        g.private_write(backup/name,data)
    archive = io.BytesIO()
    with tarfile.open(fileobj=archive,mode='w') as tar:
        for p in backup.iterdir():tar.add(p,arcname=p.name)
    remote = '/var/backups/manderia/caddy/satellite-' + stamp
    g.command(['ssh','-o','BatchMode=yes','-o','ConnectTimeout=15','ravand-worker-01',f'umask 077; mkdir -p {remote} && tar -xf - -C {remote}'],archive.getvalue())
    if json.loads(g.active_config()) != json.loads(runtime):raise RuntimeError('Gateway changed during backup')
    patch = [{'op':'test','path':'/metadata/resourceVersion','value':before['metadata']['resourceVersion']},{'op':'replace','path':'/data/Caddyfile','value':updated}]
    g.command(g.KUBE+['patch','configmap','caddy-config','--type=json','--patch',json.dumps(patch)])
    try:g.gateway_cli('reload',updated.encode())
    except RuntimeError:
        latest=json.loads(g.command(g.KUBE+['get','configmap','caddy-config','-o','json']))
        if latest['data']['Caddyfile']==updated:
            g.command(g.KUBE+['patch','configmap','caddy-config','--type=json','--patch',json.dumps([{'op':'test','path':'/metadata/resourceVersion','value':latest['metadata']['resourceVersion']},{'op':'replace','path':'/data/Caddyfile','value':original}])])
            g.gateway_cli('reload',runtime,adapter=False)
        raise
    config['data']['Caddyfile']=updated
    (owner/'apps.json').write_text(json.dumps(source,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
    (owner/'Caddyfile').write_text(updated,encoding='utf-8',newline='\n')
    if json.loads(g.active_config()) != json.loads(g.gateway_cli('adapt',updated.encode())):raise RuntimeError('Reload verification failed')
    print('Satellite route verified. Backups:',backup,'and ravand-worker-01:'+remote)

if __name__=='__main__':main()
