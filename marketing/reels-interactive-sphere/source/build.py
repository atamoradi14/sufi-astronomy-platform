#!/usr/bin/env python3
"""Builds Persian Instagram reels + covers for the Fanous-e Khial interactive sphere (/lab).

Stage 1 (overlays): writes overlay/cover HTML specs and renders them with Chromium.
Stage 2 (video): assembles real captured sphere frames + overlays with ffmpeg.
"""
import base64, json, os, shutil, subprocess, sys
from pathlib import Path

CAP = Path(__file__).resolve().parent
REPO = Path("/home/user/sufi-astronomy-platform")
FR = CAP / "frames"
OUT = CAP / "out"
WORK = CAP / "work"
FPS = 30
CLIP_Y = 500          # where the 1080-wide sphere clip sits in the 1080x1920 frame
CLIP_H = 1026

FA = str.maketrans("0123456789.", "۰۱۲۳۴۵۶۷۸۹٫")
def fa(s: str) -> str:
    return s.translate(FA)

def b64(path: Path, mime: str) -> str:
    return f"data:{mime};base64," + base64.b64encode(path.read_bytes()).decode()

FONT_DIR = REPO / "node_modules/@fontsource-variable/vazirmatn/files"
CSS = f"""
@font-face {{ font-family: Vz; font-weight: 100 900; src: url({b64(FONT_DIR/'vazirmatn-arabic-wght-normal.woff2','font/woff2')}) format('woff2');
  unicode-range: U+0600-06FF, U+0750-077F, U+200C-200E, U+2010-2011, U+204F, U+2E41, U+FB50-FDFF, U+FE70-FEFC; }}
@font-face {{ font-family: Vz; font-weight: 100 900; src: url({b64(FONT_DIR/'vazirmatn-latin-wght-normal.woff2','font/woff2')}) format('woff2'); }}
* {{ box-sizing: border-box; margin: 0; padding: 0; }}
html, body {{ width: 1080px; height: 1920px; background: transparent; font-family: Vz, sans-serif; color: #eee5d6; overflow: hidden; }}
body.solid {{ background: #081322; }}
.abs {{ position: absolute; }}
.stars {{ position:absolute; inset:0; background-image:
  radial-gradient(1.6px 1.6px at 12% 8%, #f1ddb1cc 50%, transparent 51%), radial-gradient(1.2px 1.2px at 30% 15%, #ffffff99 50%, transparent 51%),
  radial-gradient(2px 2px at 78% 6%, #f1ddb1 50%, transparent 51%), radial-gradient(1.2px 1.2px at 88% 18%, #ffffffaa 50%, transparent 51%),
  radial-gradient(1.4px 1.4px at 55% 4%, #ffffff88 50%, transparent 51%), radial-gradient(1.2px 1.2px at 6% 22%, #ffffff77 50%, transparent 51%),
  radial-gradient(1.6px 1.6px at 64% 20%, #84c8bf99 50%, transparent 51%), radial-gradient(1.2px 1.2px at 42% 24%, #ffffff66 50%, transparent 51%),
  radial-gradient(1.4px 1.4px at 18% 88%, #ffffff77 50%, transparent 51%), radial-gradient(1.8px 1.8px at 84% 92%, #f1ddb1aa 50%, transparent 51%),
  radial-gradient(1.2px 1.2px at 50% 96%, #ffffff66 50%, transparent 51%), radial-gradient(1.2px 1.2px at 94% 82%, #ffffff66 50%, transparent 51%); }}
.topfade {{ position:absolute; left:0; right:0; top:0; height:{CLIP_Y+110}px;
  background: linear-gradient(#081322 0, #081322 {CLIP_Y-20}px, #08132200 {CLIP_Y+110}px); }}
.botfade {{ position:absolute; left:0; right:0; top:{CLIP_Y+CLIP_H-150}px; bottom:0;
  background: linear-gradient(#08132200 0, #081322 150px, #081322 100%); }}
.head {{ position:absolute; top:128px; right:70px; left:150px; }}
.chip {{ display:inline-flex; align-items:center; gap:14px; font-size:30px; font-weight:600; color:#84c8bf;
  border:2px solid #84c8bf55; background:#84c8bf14; border-radius:999px; padding:6px 24px; }}
.title {{ margin-top:22px; font-size:68px; line-height:1.3; font-weight:800; color:#f1ddb1; text-shadow:0 4px 24px #000a; }}
.title .g {{ color:#d4ab67; }}
.body {{ margin-top:18px; font-size:37px; line-height:1.75; font-weight:400; color:#eee5d6; text-shadow:0 2px 12px #000c; }}
.body b {{ color:#f1ddb1; font-weight:700; }}
.pill {{ position:absolute; left:70px; right:70px; top:{CLIP_Y+CLIP_H-40}px; display:flex; justify-content:center; }}
.pill > div {{ border:2px solid #d4ab6766; background:#0c1424ee; border-radius:28px; padding:20px 34px; font-size:40px; font-weight:600;
  color:#f1ddb1; box-shadow:0 10px 40px #000a; text-align:center; line-height:1.5; }}
.ltr {{ direction:ltr; unicode-bidi:isolate; display:inline-block; font-family: "DejaVu Serif", Georgia, serif; font-style: italic; }}
.ltr .n {{ font-family: Vz; font-style: normal; }}
.brand {{ position:absolute; bottom:70px; left:0; right:0; display:flex; justify-content:center; align-items:center; gap:16px;
  font-size:28px; color:#9aa6b8; }}
.brand img {{ width:46px; height:46px; border-radius:12px; }}
.hook .title {{ font-size:84px; }}
.dim {{ position:absolute; inset:0; background:#081322d9; }}
.cta {{ position:absolute; left:80px; right:80px; top:430px; text-align:center; }}
.cta .logo {{ width:150px; height:150px; border-radius:36px; box-shadow:0 0 80px #d4ab6755; }}
.cta h1 {{ margin-top:46px; font-size:92px; line-height:1.3; font-weight:900; color:#f1ddb1; }}
.cta h1 .g {{ color:#d4ab67; }}
.cta p {{ margin-top:30px; font-size:40px; line-height:1.7; color:#eee5d6; }}
.cta .url {{ margin-top:46px; display:inline-block; direction:ltr; font-size:42px; font-weight:700; color:#081322; background:#d4ab67;
  border-radius:999px; padding:18px 44px; }}
.cta .save {{ margin-top:40px; font-size:34px; color:#84c8bf; }}
.metric {{ position:absolute; left:70px; right:70px; top:{CLIP_Y+CLIP_H-60}px; display:flex; gap:22px; justify-content:center; }}
.metric > div {{ flex:1; border:2px solid #d4ab6766; background:#0c1424f0; border-radius:26px; padding:14px 22px; text-align:center; box-shadow:0 10px 40px #000a; }}
.metric small {{ display:block; font-size:28px; color:#9aa6b8; }}
.metric span {{ display:block; font-size:50px; font-weight:800; color:#f1ddb1; direction:ltr; }}
.metric .hi span {{ color:#84c8bf; }}
.plate {{ position:absolute; left:290px; top:{CLIP_Y+150}px; width:500px; border-radius:18px; border:3px solid #d4ab67aa;
  box-shadow:0 20px 80px #000d, 0 0 0 12px #0c1424; transform:rotate(-2deg); }}
.platecap {{ position:absolute; left:0; right:0; top:{CLIP_Y+880}px; text-align:center; font-size:28px; color:#9aa6b8; }}
/* cover */
.cover .bgplate {{ position:absolute; inset:0; background-size:cover; background-position:center; opacity:.13; filter:sepia(.6) blur(2px); }}
.cover .vig {{ position:absolute; inset:0; background: radial-gradient(ellipse at 50% 52%, #08132200 30%, #081322 72%); }}
.cover .series {{ position:absolute; top:300px; left:0; right:0; display:flex; justify-content:center; }}
.cover .series div {{ font-size:34px; font-weight:700; color:#081322; background:#d4ab67; border-radius:999px; padding:8px 34px; }}
.cover .ct {{ position:absolute; top:390px; left:60px; right:60px; text-align:center; font-size:104px; line-height:1.22; font-weight:900; color:#f1ddb1;
  text-shadow:0 6px 30px #000; }}
.cover .ct .g {{ color:#d4ab67; }}
.cover .sph {{ position:absolute; left:110px; top:690px; width:860px; border-radius:50%;
  -webkit-mask-image: radial-gradient(circle at 50% 50%, #000 58%, transparent 71%); }}
.cover .glow {{ position:absolute; left:190px; top:740px; width:700px; height:700px; border-radius:50%; box-shadow:0 0 180px 40px #d4ab6726; }}
.cover .tag {{ position:absolute; top:1440px; left:60px; right:60px; text-align:center; font-size:60px; font-weight:800; color:#84c8bf; }}
.cover .sub {{ position:absolute; top:1540px; left:0; right:0; display:flex; justify-content:center; align-items:center; gap:18px; font-size:32px; color:#eee5d6; }}
.cover .sub img {{ width:54px; height:54px; border-radius:14px; }}
.cover .badge {{ position:absolute; top:1180px; right:120px; font-size:30px; font-weight:700; color:#f1ddb1; background:#0c1424ee;
  border:2px solid #d4ab6788; border-radius:22px; padding:10px 24px; transform:rotate(4deg); }}
"""

LOGO = b64(REPO / "public/logo.svg", "image/svg+xml")
BRAND = f'<div class="brand"><img src="{LOGO}"><span>فانوس خیال · آزمایشگاه کرهٔ تعاملی</span></div>'

def L(s: str) -> str:
    """Isolated LTR math run; digits rendered Persian in the UI font."""
    import re
    s = re.sub(r"(\d+(?:\.\d+)?)", lambda m: f'<span class="n">{fa(m.group(1))}</span>', s)
    return f'<span class="ltr">{s}</span>'

def scene_html(chip, title, body, pill=None, extra="", hook=False):
    return (f'<div class="stars"></div><div class="topfade"></div><div class="botfade"></div>{extra}'
            f'<div class="head{" hook" if hook else ""}">'
            f'{f"<span class=chip>{chip}</span>" if chip else ""}'
            f'<div class="title">{title}</div>'
            f'{f"<div class=body>{body}</div>" if body else ""}</div>'
            f'{f"<div class=pill><div>{pill}</div></div>" if pill else ""}{BRAND}')

def outro_html():
    return (f'<div class="dim"></div><div class="stars"></div><div class="cta"><img class="logo" src="{LOGO}">'
            f'<h1>نجوم کروی رو<br><span class="g">تعاملی</span> یاد بگیر</h1>'
            f'<p>کره را بچرخان، رأس‌ها را جابه‌جا کن<br>و اندازه‌ها را زنده ببین.</p>'
            f'<div class="url">fanous.online/lab</div>'
            f'<div class="save">ذخیره کن و برای هم‌تیمی المپیادی‌ات بفرست</div></div>')

# ---------------------------------------------------------------- reels
rng = lambda clip, a, b: [FR / clip / f"{i:04d}.png" for i in range(a, b)]
rev = lambda seq: list(reversed(seq))
def count(clip): return len(list((FR / clip).glob("*.png")))

PLATE = b64(REPO / "public/atlas/plates/orion-globe.webp", "image/webp")

def reels():
    nC, nCe, nS, nE = count("circles"), count("celestial"), count("smallsweep"), count("ecliptic")
    nT, nTs, nA = count("triangle"), count("trisweep"), count("area")
    nP, nH, nL = count("pzx"), count("horizon"), count("latsweep")
    return {
      "reel1-azime-saghire": {
        "cover": dict(series="نجوم کروی · قسمت ۱", title='عظیمه یا <span class="g">صغیره</span>؟',
                      still=("circles", 0), badge="کوتاه‌ترین مسیر روی کره"),
        "scenes": [
          dict(frames=rng("circles", 0, 75), hook=True, html=scene_html(None,
               'روی کره، کوتاه‌ترین مسیر <span class="g">خط راست نیست!</span>', "بیا روی کرهٔ تعاملی فانوس خیال ببینیم چرا…", hook=True)),
          dict(frames=rng("circles", 75, nC) + rev(rng("circles", nC - 75, nC)), html=scene_html("۱ · عظیمه",
               'دایرهٔ <span class="g">عظیمه</span>',
               "صفحه‌اش از <b>مرکز کره</b> می‌گذرد. استوا و همهٔ نصف‌النهارها عظیمه‌اند؛ کوتاه‌ترین مسیر بین دو نقطه، کمانی از عظیمه است.",
               "عظیمه = بزرگ‌ترین دایرهٔ ممکن روی کره")),
          dict(frames=rng("smallsweep", 0, nS), html=scene_html("۲ · صغیره",
               'دایرهٔ <span class="g">صغیره</span>',
               f"صفحه‌اش از مرکز <b>نمی‌گذرد</b>، مثل مدارهای عرض. فاصلهٔ قطبی θ را تغییر بده: در <b>{L('θ = 90°')}</b> صغیره خودش عظیمه می‌شود.",
               f"شعاع صغیره = {L('R sin θ')}")),
          dict(frames=rng("celestial", 0, nCe), html=scene_html("۳ · کرهٔ سماوی",
               'استوای سماوی و <span class="g">دایرةالبروج</span>',
               "هر دو عظیمه‌اند و یکدیگر را در دو نقطه قطع می‌کنند: <b>اعتدال بهاری و پاییزی</b>.",
               f"زاویهٔ میل دایرةالبروج {L('ε ≈ 23.44°')}")),
          dict(frames=rev(rng("circles", 0, nC)), html=scene_html("۴ · قاعدهٔ اسمارت",
               'کمان روی <span class="g">مدار عرض</span>',
               f"کمانی از مدار عرض {L('φ')}، از کمان متناظر روی استوا کوتاه‌تر است؛ به اندازهٔ ضریب {L('cos φ')}.",
               f"{L('arc(φ) = arc(equator) × cos φ')}")),
          dict(frames=rev(rng("celestial", nCe - 105, nCe)), outro=True, html=outro_html()),
        ]},
      "reel2-mosalas-koravi": {
        "cover": dict(series="نجوم کروی · قسمت ۲", title='جمع زوایای مثلث<br><span class="g">۱۸۰° نیست!</span>',
                      still=("triangle", 0), badge='<span style="direction:ltr;unicode-bidi:isolate">A + B + C > ۱۸۰°</span>'),
        "scenes": [
          dict(frames=rng("triangle", 0, 75), hook=True, html=scene_html(None,
               'جمع زوایای مثلث همیشه ۱۸۰°؟ <span class="g">روی کره نه!</span>', "این مثلث را در آزمایشگاه کره بساز و اندازه بگیر…", hook=True)),
          dict(frames=rng("triangle", 75, nT) + rev(rng("triangle", nT - 75, nT)), html=scene_html("۱ · تعریف",
               '<span class="g">مثلث کروی</span> چیست؟',
               "سه رأس روی کره که با <b>کمان‌هایی از سه عظیمه</b> به هم وصل شده‌اند. ضلع‌ها هم مثل زاویه‌ها با <b>درجه</b> اندازه گرفته می‌شوند.",
               f"اضلاع {L('a, b, c')} · زوایا {L('A, B, C')}")),
          dict(frames=rng("trisweep", 0, nTs), metrics=True, html=scene_html("۲ · آزمایش زنده",
               'رأس <span class="g">A</span> را جابه‌جا کن',
               "اعداد پایین مستقیم از آزمایشگاه‌اند. هر شکلی بسازی، جمع زوایا <b>بیشتر از ۱۸۰°</b> می‌ماند.", None)),
          dict(frames=rng("area", 0, nA), html=scene_html("۳ · قضیهٔ ژیرار",
               'مساحت = <span class="g">زیادی کروی</span>',
               f"زیادی کروی {L('E = A + B + C − 180°')}. مثلاً مثلثی با سه زاویهٔ قائمه، دقیقاً <b>یک‌هشتم کره</b> را می‌پوشاند.",
               f"{L('S = R²(A + B + C − π)')}")),
          dict(frames=rev(rng("triangle", 0, nT)), html=scene_html("۴ · فرمول (A) اسمارت",
               'فرمول <span class="g">کسینوس</span>',
               "مهم‌ترین رابطهٔ فصل اول: با دو ضلع و زاویهٔ بینشان، ضلع سوم به دست می‌آید؛ همان فاصلهٔ زاویه‌ای دو ستاره.",
               f"{L('cos a = cos b cos c + sin b sin c cos A')}")),
          dict(frames=rev(rng("area", nA - 105, nA)), outro=True, html=outro_html()),
        ]},
      "reel3-mosalas-nojumi": {
        "cover": dict(series="نجوم کروی · قسمت ۳", title='مثلث نجومی<br><span class="g">PZX</span>',
                      still=("pzx", 75), badge="قطب · سمت‌الرأس · ستاره"),
        "scenes": [
          dict(frames=rng("pzx", 0, 75), hook=True, html=scene_html(None,
               'ارتفاع قطب سماوی = <span class="g">عرض جغرافیایی تو</span>', "یک مثلث کوچک که کل نجوم کروی را به هم وصل می‌کند…", hook=True)),
          dict(frames=rng("latsweep", 0, nL), html=scene_html("۱ · افق ناظر",
               'عرض ناظر <span class="g">φ</span> را تغییر بده',
               "در قطب، قطب سماوی درست بالای سر است و در استوا روی افق. ارتفاع قطب همیشه برابر عرض جغرافیایی است.",
               f"ارتفاع قطب = {L('φ')}")),
          dict(frames=rng("pzx", 40, 115) + rev(rng("pzx", 40, 115)), html=scene_html("۲ · سه رأس",
               'مثلث <span class="g">PZX</span>',
               f"<b>P</b> قطب سماوی، <b>Z</b> سمت‌الرأس ناظر و <b>X</b> ستاره. در این پیش‌نمایش ناظر در تهران است ({L('φ ≈ 35.7°')}).",
               L('PZ = 90° − φ &nbsp;&nbsp; PX = 90° − δ<br>ZX = 90° − h = z'))),
          dict(frames=rng("pzx", 115, nP) + rev(rng("pzx", 70, nP)), html=scene_html("۳ · رابطهٔ اصلی",
               'از <span class="g">میل</span> تا <span class="g">ارتفاع</span>',
               "زاویه در P همان <b>زاویهٔ ساعتی H</b> است و زاویه در Z، <b>سمت</b> ستاره. فرمول کسینوس روی PZX:",
               f"{L('sin h = sin φ sin δ + cos φ cos δ cos H')}")),
          dict(frames=rng("ecliptic", 0, nE) + rev(rng("ecliptic", nE - 35, nE)), html=scene_html("۴ · میراث صوفی",
               'صوفی و <span class="g">کرهٔ سماوی</span>',
               "عبدالرحمن صوفی حدود ۹۶۴ میلادی در «صورالکواکب» هر صورت فلکی را دو بار کشید: روی کره و در آسمان.",
               None, extra=f'<div class="dim" style="background:#081322b3"></div><img class="plate" src="{PLATE}">'
                           f'<div class="platecap">صورت جبار (شکارچی) روی کره · نسخهٔ خطی صورالکواکب</div>')),
          dict(frames=rev(rng("pzx", nP - 105, nP)), outro=True, html=outro_html()),
        ]},
    }

# ---------------------------------------------------------------- stage helpers
def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode:
        print(r.stderr[-3000:]); raise SystemExit(r.returncode)

def render(specs, name):
    import re
    for sp in specs:  # keep "۱۸۰°" in visual order inside RTL text
        sp["html"] = re.sub(r"([۰-۹٫]+°)", r'<span style="unicode-bidi:isolate;direction:ltr">\1</span>', sp["html"])
    WORK.mkdir(exist_ok=True)
    (WORK / f"{name}.json").write_text(json.dumps(specs))
    (WORK / "style.css").write_text(CSS)
    run(["node", str(CAP / "render.cjs"), str(WORK / f"{name}.json"), str(WORK / "style.css")])

def cover_html(c):
    clip, idx = c["still"]
    from PIL import Image, ImageDraw
    im = Image.open(FR / clip / f"{idx:04d}.png").convert("RGB")
    ImageDraw.Draw(im).rectangle((725, 24, 1000, 106), fill="#081322")
    p = WORK / f"still-{clip}.png"; im.save(p)
    still = b64(p, "image/png")
    plate = b64(REPO / "public/atlas/plates/ursa-major-globe.webp", "image/webp")
    return (f'<div class="cover"><div class="bgplate" style="background-image:url({plate})"></div><div class="vig"></div><div class="stars"></div>'
            f'<div class="series"><div>{c["series"]}</div></div><div class="ct">{c["title"]}</div>'
            f'<div class="glow"></div><img class="sph" src="{still}"><div class="badge">{c["badge"]}</div>'
            f'<div class="tag">نجوم کروی رو تعاملی یاد بگیر</div>'
            f'<div class="sub"><img src="{LOGO}"><span>فانوس خیال · آزمایشگاه کرهٔ تعاملی</span></div></div>')

def metric_specs(reel, si, frames):
    specs = []
    for k, f in enumerate(frames):
        m = json.loads(Path(str(f).replace(".png", ".json")).read_text())
        def num(key):
            v = m.get(key, "0").replace("°", "").translate(str.maketrans("۰۱۲۳۴۵۶۷۸۹٫", "0123456789."))
            return float(v)
        A, B, C, E = num("A"), num("B"), num("C"), num("زیادی کروی · E")
        html = (f'<div class="metric"><div><small>A + B + C</small><span>{fa(f"{A+B+C:.1f}")}°</span></div>'
                f'<div class="hi"><small>زیادی کروی E</small><span>{fa(f"{E:.1f}")}°</span></div></div>')
        specs.append(dict(out=str(WORK / reel / f"m{si}_{k:04d}.png"), html=html, transparent=True,
                          clip=dict(x=0, y=CLIP_Y + CLIP_H - 80, width=1080, height=220)))
    return specs

def stage_overlays(only=None):
    specs = []
    for reel, r in reels().items():
        if only and reel not in only: continue
        (WORK / reel).mkdir(parents=True, exist_ok=True); OUT.mkdir(exist_ok=True)
        specs.append(dict(out=str(OUT / f"{reel}-cover.png"), html=cover_html(r["cover"]), cls="solid"))
        for si, s in enumerate(r["scenes"]):
            specs.append(dict(out=str(WORK / reel / f"o{si}.png"), html=s["html"], transparent=True))
            if s.get("metrics"): specs += metric_specs(reel, si, s["frames"])
    render(specs, "specs")

def seq_dir(reel, si, frames, prefix=""):
    d = WORK / reel / f"{prefix}seq{si}"
    shutil.rmtree(d, ignore_errors=True); d.mkdir(parents=True)
    for k, f in enumerate(frames):
        os.symlink(f, d / f"{k:04d}.png")
    return d

def stage_video(only=None):
    for reel, r in reels().items():
        if only and reel not in only: continue
        segs = []
        for si, s in enumerate(r["scenes"]):
            n = len(s["frames"]); sd = seq_dir(reel, si, s["frames"])
            seg = WORK / reel / f"seg{si}.mp4"
            inputs = ["-f", "lavfi", "-i", f"color=c=0x081322:s=1080x1920:r={FPS}",
                      "-framerate", str(FPS), "-i", str(sd / "%04d.png"),
                      "-loop", "1", "-framerate", str(FPS), "-i", str(WORK / reel / f"o{si}.png")]
            zoom = "scale=1080:-2" if not s.get("outro") else "scale=1080:-2"
            fc = (f"[1:v]drawbox=x=725:y=24:w=275:h=82:color=0x081322:t=fill,{zoom},setsar=1[c];[0:v][c]overlay=0:{CLIP_Y}:shortest=1[b];"
                  f"[2:v]format=rgba,fade=in:st=0:d={0.25 if s.get('hook') else 0.45}:alpha=1[o];[b][o]overlay=0:0[v0]")
            last = "v0"
            if s.get("metrics"):
                md = WORK / reel / f"mseq{si}"; shutil.rmtree(md, ignore_errors=True); md.mkdir()
                for k in range(n): os.symlink(WORK / reel / f"m{si}_{k:04d}.png", md / f"{k:04d}.png")
                inputs += ["-framerate", str(FPS), "-i", str(md / "%04d.png")]
                fc += f";[v0][3:v]overlay=0:{CLIP_Y + CLIP_H - 80}[v1]"; last = "v1"
            run(["ffmpeg", "-y", *inputs, "-filter_complex", fc, "-map", f"[{last}]", "-frames:v", str(n),
                 "-c:v", "libx264", "-preset", "medium", "-crf", "17", "-pix_fmt", "yuv420p", "-r", str(FPS), str(seg)])
            segs.append((seg, n / FPS))
        # chain with crossfades
        X = 0.35
        inputs, fc, prev, t = [], "", "0:v", segs[0][1]
        for i, (seg, d) in enumerate(segs):
            inputs += ["-i", str(seg)]
        for i in range(1, len(segs)):
            out = f"x{i}"
            fc += f"[{prev}][{i}:v]xfade=transition=fade:duration={X}:offset={t - X:.3f}[{out}];"
            prev = out; t += segs[i][1] - X
        fc += f"[{prev}]fade=out:st={t-0.4:.3f}:d=0.4[v]"
        dst = OUT / f"{reel}.mp4"
        run(["ffmpeg", "-y", *inputs, "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo", "-filter_complex", fc,
             "-map", "[v]", "-map", f"{len(segs)}:a", "-shortest", "-c:v", "libx264", "-preset", "slow", "-crf", "18",
             "-profile:v", "high", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", str(dst)])
        print("built", dst, f"{t:.1f}s")

if __name__ == "__main__":
    stage, *only = sys.argv[1:]
    {"overlays": stage_overlays, "video": stage_video}[stage](only or None)
