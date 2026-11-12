# صوفی‌آسمان (Sufi Astronomy)

وب‌اپلیکیشن فارسی برای آموزش **ریاضیات کروی** و نجوم رصدی، با الهام از عبدالرحمن صوفی و کتاب **صور الکواکب**. روی موبایل (اندروید) از GPS و قطب‌نما استفاده می‌کند؛ نصب APK لازم نیست.

## قابلیت‌ها

- **کرهٔ تعاملی** (`/lab`): pan/tilt، عظیمه/صغیره، مثلث، زیادی کروی E و مساحت Girard، فرمول‌های زنده
- **اثبات‌ها** (`/proofs`): Cosine، Sine، Area/Girard با صورت انگلیسی Smart
- **۱۷ درس** جامع (Smart I–II–VI + المپیاد) با دو زبانه
- **آسمان زنده** (`/sky`): ۱۵٬۵۴۴ ستاره تا قدر ۷ + خطوط IAU + اطلس صوفی
- مسائل با نمودار کروی در راه‌حل
- قبله، نقشه، نمودار زمان؛ API + اسکلت K8s

## اجرا

```bash
npm install
npm run dev
```

اپ روی پورت `3847` بالا می‌آید. برای حسگرها روی گوشی واقعی، صفحه را از طریق HTTPS یا localhost باز کنید و مجوز موقعیت/جهت‌گیری را بپذیرید.

```bash
npm run build
npm start
```

## APIها (BFF امروز / سرویس‌ها فردا)

| مسیر | سرویس هدف |
|------|-----------|
| `GET /api/astro/clock?lat=&lon=` | astro-time |
| `GET /api/astro/horizontal?ra=&dec=&lat=&lon=` | sphere-math |
| `GET /api/geo/qibla?lat=&lon=` | qibla |
| `GET /api/catalog/constellations` | catalog |

جزئیات استخراج: `services/README.md`  
مانیفست‌ها: `deploy/k8s/`

## تم

شب‌نامهٔ نیلی، طلای نسخه‌های مصور، تایپوگرافی Amiri + Vazirmatn، جهت RTL فارسی.
