export type ExifInfo = {
  date: Date | null;
  lat: number | null;
  lon: number | null;
  alt: number | null;
};

/** Read the capture time and GPS fix from a JPEG EXIF block, when present. */
export function readExif(buffer: ArrayBuffer): ExifInfo {
  const empty: ExifInfo = { date: null, lat: null, lon: null, alt: null };
  try {
    const view = new DataView(buffer);
    if (view.byteLength < 4 || view.getUint16(0) !== 0xffd8) return empty;
    let offset = 2;
    while (offset + 4 < view.byteLength) {
      const marker = view.getUint16(offset);
      if (marker === 0xffda || marker === 0xffd9) break;
      const size = view.getUint16(offset + 2);
      if (marker === 0xffe1 && size > 16) {
        const start = offset + 4;
        if (view.getUint32(start) === 0x45786966) {
          return parseTiff(view, start + 6) ?? empty;
        }
      }
      if (size < 2) break;
      offset += 2 + size;
    }
  } catch {
    return empty;
  }
  return empty;
}

function parseTiff(view: DataView, tiff: number): ExifInfo | null {
  const endian = view.getUint16(tiff);
  const le = endian === 0x4949;
  if (!le && endian !== 0x4d4d) return null;
  const u16 = (p: number) => view.getUint16(p, le);
  const u32 = (p: number) => view.getUint32(p, le);
  if (u16(tiff + 2) !== 42) return null;
  const ifd0 = tiff + u32(tiff + 4);
  const tags = readIfd(view, ifd0, tiff, le);
  const exifPtr = tags.get(0x8769);
  const gpsPtr = tags.get(0x8825);
  const exif = exifPtr ? readIfd(view, tiff + exifPtr.int, tiff, le) : new Map();
  const gps = gpsPtr ? readIfd(view, tiff + gpsPtr.int, tiff, le) : new Map();
  const date = parseExifDate(exif.get(0x9003)?.text ?? exif.get(0x0132)?.text ?? null);
  let lat = gpsRatio(gps.get(0x0002));
  let lon = gpsRatio(gps.get(0x0004));
  const latRef = gps.get(0x0001)?.text;
  const lonRef = gps.get(0x0003)?.text;
  if (lat != null && latRef === "S") lat = -lat;
  if (lon != null && lonRef === "W") lon = -lon;
  let alt = gps.get(0x0006)?.num ?? null;
  if (alt != null && gps.get(0x0005)?.int === 1) alt = -alt;
  return { date, lat, lon, alt };
}

type Tag = { int: number; num: number | null; text: string | null; rats: number[] | null };

function readIfd(view: DataView, ifd: number, tiff: number, le: boolean) {
  const u16 = (p: number) => view.getUint16(p, le);
  const u32 = (p: number) => view.getUint32(p, le);
  const map = new Map<number, Tag>();
  const count = u16(ifd);
  for (let i = 0; i < count; i++) {
    const e = ifd + 2 + i * 12;
    if (e + 12 > view.byteLength) break;
    const tag = u16(e);
    const type = u16(e + 2);
    const n = u32(e + 4);
    const unit = type === 3 ? 2 : type === 5 || type === 10 ? 8 : type === 2 ? 1 : 4;
    let data = e + 8;
    if (n * unit > 4) data = tiff + u32(e + 8);
    let text: string | null = null;
    let num: number | null = null;
    let int = 0;
    let rats: number[] | null = null;
    if (type === 2 && data + n <= view.byteLength) {
      let s = "";
      for (let k = 0; k < n - 1; k++) s += String.fromCharCode(view.getUint8(data + k));
      text = s;
    } else if (type === 3) int = u16(data);
    else if (type === 4) int = u32(data);
    else if ((type === 5 || type === 10) && n >= 1) {
      rats = [];
      for (let k = 0; k < n; k++) {
        const a = u32(data + k * 8);
        const b = u32(data + k * 8 + 4) || 1;
        rats.push(a / b);
      }
      num = rats[0];
    }
    map.set(tag, { int, num, text, rats });
  }
  return map;
}

function gpsRatio(tag: Tag | undefined) {
  if (!tag?.rats || tag.rats.length < 3) return null;
  return tag.rats[0] + tag.rats[1] / 60 + tag.rats[2] / 3600;
}

function parseExifDate(text: string | null) {
  if (!text) return null;
  const m = text.match(/^(\d{4}):(\d{2}):(\d{2})[ T](\d{2}):(\d{2}):(\d{2})/);
  if (!m) return null;
  return new Date(
    Number(m[1]),
    Number(m[2]) - 1,
    Number(m[3]),
    Number(m[4]),
    Number(m[5]),
    Number(m[6]),
  );
}
