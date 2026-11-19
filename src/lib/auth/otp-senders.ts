import { createHash, createHmac } from "node:crypto";

/*
 * Delivery reuses existing services unchanged:
 *  - SMS: Ravand's isolated SMS relay (services/sms-test) and its approved
 *    Melipayamak OTP pattern, POST {OTP_SMS_URL}/v1/patterns/otp.
 *  - Email: the Azure Communication Services resource and verified sender
 *    Darvazeh already uses, through the ACS Email REST API.
 */

export function smsConfigured() {
  return !!(process.env.OTP_SMS_URL && process.env.OTP_SMS_API_KEY);
}
export function emailConfigured() {
  return !!(parseConnectionString(process.env.ACS_CONNECTION_STRING) && process.env.ACS_SENDER_ADDRESS);
}

export async function sendSmsCode(phone: string, code: string) {
  const base = (process.env.OTP_SMS_URL || "").replace(/\/+$/, "");
  // The relay requires Content-Length (no chunked bodies); a string body provides it.
  const response = await fetch(base + "/v1/patterns/otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "X-SMS-API-Key": process.env.OTP_SMS_API_KEY || "",
    },
    body: JSON.stringify({ to: phone, code }),
    signal: AbortSignal.timeout(15000),
    cache: "no-store",
  });
  if (response.status !== 202) {
    console.warn(`event=otp_sms_rejected status=${response.status}`);
    return false;
  }
  return true;
}

export function parseConnectionString(value?: string) {
  if (!value) return null;
  const parts = Object.fromEntries(
    value.split(";").filter(Boolean).map((part) => {
      const index = part.indexOf("=");
      return [part.slice(0, index).trim().toLowerCase(), part.slice(index + 1).trim()];
    }),
  );
  if (!parts.endpoint || !parts.accesskey) return null;
  try {
    return { endpoint: new URL(parts.endpoint), accessKey: parts.accesskey as string };
  } catch {
    return null;
  }
}

/** ACS HMAC-SHA256 request signature (documented "HMAC-SHA256" scheme). */
export function signAcsRequest(method: string, url: URL, body: string, accessKey: string, date = new Date()) {
  const contentHash = createHash("sha256").update(body, "utf8").digest("base64");
  const xmsDate = date.toUTCString();
  const pathAndQuery = url.pathname + url.search;
  const toSign = `${method.toUpperCase()}\n${pathAndQuery}\n${xmsDate};${url.host};${contentHash}`;
  const signature = createHmac("sha256", Buffer.from(accessKey, "base64")).update(toSign, "utf8").digest("base64");
  return {
    "x-ms-date": xmsDate,
    "x-ms-content-sha256": contentHash,
    Authorization: `HMAC-SHA256 SignedHeaders=x-ms-date;host;x-ms-content-sha256&Signature=${signature}`,
  };
}

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export function otpEmail(code: string) {
  const persian = code.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
  const subject = `کد ورود فانوس خیال: ${code}`;
  const plainText = `کد ورود شما به فانوس خیال: ${code}\nاین کد تا ۱۰ دقیقه معتبر است. اگر شما درخواست نداده‌اید، این ایمیل را نادیده بگیرید.\n\nYour Fanous-e Khial sign-in code: ${code}\nIt expires in 10 minutes. If you did not request it, ignore this email.\n\nhttps://fanous.online`;
  const html = `<!doctype html><html lang="fa" dir="rtl"><body style="margin:0;background:#0f1a2b;font-family:Tahoma,Arial,sans-serif;color:#efe6d2">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" style="max-width:480px;background:#142238;border:1px solid #2c3d58;border-radius:16px" cellpadding="0" cellspacing="0"><tr><td style="padding:28px">
<p style="margin:0 0 4px;color:#7fc7b8;font-size:12px;letter-spacing:2px">FANOUS-E KHIAL</p>
<h1 style="margin:0 0 16px;font-size:20px;color:#e6c98a">فانوس خیال</h1>
<p style="margin:0 0 12px;font-size:14px;line-height:1.9">کد ورود شما:</p>
<p style="margin:0 0 16px;font-size:32px;letter-spacing:8px;font-weight:bold;color:#ffffff;direction:ltr;text-align:center">${escapeHtml(code)}</p>
<p style="margin:0 0 4px;font-size:13px;color:#b8b0a0;text-align:center">${escapeHtml(persian)}</p>
<p style="margin:16px 0 0;font-size:13px;line-height:1.9;color:#b8b0a0">این کد تا ۱۰ دقیقه معتبر است. اگر شما درخواست نداده‌اید، این ایمیل را نادیده بگیرید.</p>
<p dir="ltr" style="margin:16px 0 0;font-size:12px;line-height:1.7;color:#8d8778;text-align:left">Your Fanous-e Khial sign-in code. It expires in 10 minutes. If you did not request it, ignore this email.</p>
</td></tr></table>
<p style="margin:16px 0 0;font-size:11px;color:#6f7a8c"><a href="https://fanous.online" style="color:#7fc7b8">fanous.online</a></p>
</td></tr></table></body></html>`;
  return { subject, plainText, html };
}

export async function sendEmailCode(email: string, code: string) {
  const connection = parseConnectionString(process.env.ACS_CONNECTION_STRING);
  if (!connection) return false;
  const url = new URL("/emails:send?api-version=2023-03-31", connection.endpoint);
  const content = otpEmail(code);
  const body = JSON.stringify({
    senderAddress: process.env.ACS_SENDER_ADDRESS,
    recipients: { to: [{ address: email }] },
    content,
    userEngagementTrackingDisabled: true,
  });
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...signAcsRequest("POST", url, body, connection.accessKey) },
    body,
    signal: AbortSignal.timeout(15000),
    cache: "no-store",
  });
  if (response.status !== 202) {
    console.warn(`event=otp_email_rejected status=${response.status}`);
    return false;
  }
  return true;
}
