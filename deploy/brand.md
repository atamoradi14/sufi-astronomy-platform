# Fanous-e Khial — فانوس خیال

Public name: **فانوس خیال** in Persian, **Fanous-e Khial** in English. The public site is **https://fanous.online**; the former address redirects with the path preserved. Kubernetes resource names, the image repository, account storage and saved browser preferences retain their existing identifiers for continuity.

The identity combines a lantern frame, a central four-point light and a small turquoise star. `public/logo.svg` is the vector source; `public/icon.svg`, PNG touch/install icons and `src/app/favicon.ico` share that mark. Gold `#d4ab67`, warm ivory `#f1ddb1`, turquoise `#84c8bf` and midnight blue form the palette. The homepage lantern drawing is a symbolic illustration, not a claim to reproduce a documented historical artifact.

The header carries the line «فانوس خیال از او مثالی دانیم». The homepage shows the first couplet in a smaller block beneath the name. About includes the full quatrain and explains the name. Persian follows [Ganjoor's text of Hedayat's selection](https://ganjoor.net/khayyam/tarane/tkh7/sh5); the attribution is explicitly «منسوب به خیام». English is our own rendering, selected with the content language. Poetry is not embedded in the small icon.

Every page defaults to the same dark palette. A persistent header toggle switches the whole interface to warm ivory, dark ink and turquoise. Vazirmatn Variable is the single interface type family for both Persian and English, including the poem. KaTeX retains its specialised equation fonts. See [experience.md](experience.md) for the surface and sky-projection rules.

Regenerate icons with `node scripts/render-brand.mjs`. It also prepares `.local/fanous-social.html`; open this file in a browser at exactly **1200 × 630**, wait for `document.fonts.ready`, and capture the viewport to `public/social-card.png`. The local source uses the installed Vazirmatn Arabic and Latin subsets. Commit the generated assets with the source.

Earlier Instagram campaign files under ignored `output/instagram-manderia/` retain the preceding identity as delivered; they are not consumed by the website.
