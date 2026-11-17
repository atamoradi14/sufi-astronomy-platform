"""Reuse authorised Darvazeh merchant configuration privately and import Fanous webhook settings."""
import json
import urllib.request
import urllib.parse
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'.local/darvazeh-billing-reuse.json'
TARGET=ROOT/'.local/satellite-billing-config.json'
def main():
    source=json.loads(SOURCE.read_text(encoding='utf-8'))
    config=json.loads(TARGET.read_text(encoding='utf-8')) if TARGET.exists() else {}
    for new,old in {'SATELLITE_STRIPE_KEY':'Billing__StripeSecretKey','SATELLITE_RELAY_URL':'Billing__PaymentRelayEndpoint','SATELLITE_RELAY_KEY':'Billing__PaymentRelayApiKey','SATELLITE_WALLET_PHONE':'Billing__DefaultWalletPhone'}.items():
        if not source.get(old):raise RuntimeError('Required Darvazeh payment setting is missing: '+old)
        config[new]=source[old]
    config['SATELLITE_BILLING_ADMIN']='atamoradi8@gmail.com'
    key=config['SATELLITE_STRIPE_KEY']
    def stripe(path,form=None):
        req=urllib.request.Request('https://api.stripe.com/v1/'+path,data=urllib.parse.urlencode(form).encode() if form else None,headers={'Authorization':'Bearer '+key,'Stripe-Version':'2026-10-28.endive','Idempotency-Key':'fanous-satellite-webhook-v1'})
        with urllib.request.urlopen(req,timeout=40) as r:return json.load(r)
    endpoint='https://fanous.online/satellite-api/billing/stripe/webhook'
    env_values={}
    for line in (ROOT/'.env').read_text(encoding='utf-8-sig').splitlines():
        if '=' in line and not line.startswith('#'):
            k,v=line.split('=',1);env_values[k.strip()]=v.strip().strip('"').strip("'")
    if env_values.get('SATELLITE_STRIPE_WEBHOOK_SECRET'):
        config['SATELLITE_STRIPE_WEBHOOK_SECRET']=env_values['SATELLITE_STRIPE_WEBHOOK_SECRET']
    TARGET.write_text(json.dumps(config),encoding='utf-8');TARGET.chmod(0o600)
    account={}
    request=urllib.request.Request(config['SATELLITE_RELAY_URL'].rstrip('/')+'/broker/wallet/'+urllib.parse.quote(config['SATELLITE_WALLET_PHONE'])+'/status',headers={'x-api-key':config['SATELLITE_RELAY_KEY'],'User-Agent':'Fanous-release-check'})
    with urllib.request.urlopen(request,timeout=40) as response:wallet=json.load(response)
    print(json.dumps({'stripeLive': '_live_' in key,'stripeChargesEnabled':account.get('charges_enabled'),'webhookConfigured':bool(config.get('SATELLITE_STRIPE_WEBHOOK_SECRET')),'ezpayAccess':wallet.get('access'),'ezpayIdentityVerified':wallet.get('identityVerified')}))

if __name__=='__main__':
    try:main()
    except Exception as e:
        print(str(e) if isinstance(e,RuntimeError) else 'Private billing setup failed: '+type(e).__name__)
        raise SystemExit(1)
