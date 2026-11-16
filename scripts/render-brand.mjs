// Regenerate native vector icon exports and prepare the social card for browser capture.
// Run: node scripts/render-brand.mjs; capture .local/fanous-social.html at 1200x630.
import fs from "node:fs";
import sharp from "sharp";

(async () => {
  fs.copyFileSync("public/logo.svg", "public/icon.svg");
  for (const [file, size] of [
    ["icon-192.png", 192],
    ["icon-512.png", 512],
    ["apple-touch-icon.png", 180],
  ]) {
    await sharp("public/icon.svg")
      .resize(size, size)
      .png()
      .toFile("public/" + file);
  }
  const png = await sharp("public/icon.svg").resize(32, 32).png().toBuffer();
  const header = Buffer.alloc(22);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  header[6] = header[7] = 32;
  header.writeUInt16LE(1, 10);
  header.writeUInt16LE(32, 12);
  header.writeUInt32LE(png.length, 14);
  header.writeUInt32LE(22, 18);
  fs.writeFileSync("src/app/favicon.ico", Buffer.concat([header, png]));
  fs.mkdirSync(".local", { recursive: true });
  const logo = fs.readFileSync("public/logo.svg", "utf8");
  fs.writeFileSync(
    ".local/fanous-social.html",
    `<!doctype html><html lang="fa" dir="ltr"><meta charset="utf-8"><style>
  @font-face{font-family:Vazir;font-weight:100 900;src:url('../node_modules/@fontsource-variable/vazirmatn/files/vazirmatn-arabic-wght-normal.woff2');unicode-range:U+0600-06FF,U+200C-200F}
  @font-face{font-family:Vazir;font-weight:100 900;src:url('../node_modules/@fontsource-variable/vazirmatn/files/vazirmatn-latin-wght-normal.woff2');unicode-range:U+0000-00FF,U+2000-206F}
  *{box-sizing:border-box}body{margin:0;width:1200px;height:630px;overflow:hidden;background:#f6f3ec;color:#243631;font-family:Vazir,sans-serif}
  .frame{height:100%;padding:62px 78px;position:relative;background:none}
  .arc{position:absolute;border:1px solid #28675f25;width:680px;height:680px;border-radius:50%;left:-280px;top:-90px}
  .arc.two{width:560px;height:560px;left:-220px;top:-30px;border-color:#28675f15}
  .copy{position:relative;width:760px;direction:rtl;text-align:right;margin-left:auto}h1{font:650 64px/1.6 Vazir,sans-serif;margin:0}.english{font:400 28px Vazir,sans-serif;direction:ltr;text-align:right;color:#216358;margin:0 0 18px}
  blockquote{border-right:1px solid #965b3588;margin:22px 0;padding-right:22px;font:400 24px/1.9 Vazir,sans-serif;color:#58675f}blockquote p{margin:0}.credit{font:12px Vazir;color:#58675f;margin-top:6px}
  .tag{font-size:24px;color:#243631;margin:25px 0}.logo{position:absolute;left:78px;top:175px;width:230px;height:230px}.logo svg{width:100%;height:100%}
  footer{position:absolute;bottom:47px;left:78px;right:78px;border-top:1px solid #8ccfc52b;padding-top:19px;display:flex;direction:rtl;justify-content:space-between;font-size:16px;color:#58675f}.url{direction:ltr;font:16px Vazir,sans-serif}
  </style><div class="frame"><div class="arc"></div><div class="arc two"></div><div class="logo">${logo}</div><div class="copy"><h1>فانوس خیال</h1><p class="english">Fanous-e Khial</p><blockquote><p>این چرخِ فلک که ما در او حیرانیم</p><p>فانوس خیال از او مثالی دانیم</p><p class="credit">از رباعی منسوب به خیام</p></blockquote><p class="tag">نجوم، آسمان و میراث ایران</p></div><footer><span>آسمان تعاملی · حسگر ستاره · اطلس صوفی</span><span class="url">fanous.online</span></footer></div></html>`,
  );
  console.log(
    "Lantern icons exported; social-card source: .local/fanous-social.html",
  );
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
