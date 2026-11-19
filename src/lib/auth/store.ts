import { DatabaseSync } from "node:sqlite";
import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

export type AccountUser = {
  id: string;
  /** Google subject for Google accounts; "email:<address>" or "phone:<E.164>" for one-time-code accounts. */
  google_sub: string;
  email: string;
  phone: string | null;
  name: string;
  image: string | null;
  created_at: string;
  last_login_at: string;
  login_count: number;
};
let database: DatabaseSync | undefined;
export function userDatabase() {
  if (database) return database;
  const path = resolve(process.env.AUTH_DB_PATH || ".local/data/users.sqlite");
  mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec(
    "PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000; CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, google_sub TEXT UNIQUE NOT NULL, email TEXT NOT NULL, name TEXT NOT NULL, image TEXT, created_at TEXT NOT NULL, last_login_at TEXT NOT NULL, login_count INTEGER NOT NULL DEFAULT 1); CREATE INDEX IF NOT EXISTS users_last_login ON users(last_login_at DESC);",
  );
  const columns = db.prepare("PRAGMA table_info(users)").all() as {
    name: string;
  }[];
  if (!columns.some((c) => c.name === "phone"))
    db.exec("ALTER TABLE users ADD COLUMN phone TEXT");
  db.exec(
    "CREATE UNIQUE INDEX IF NOT EXISTS users_phone ON users(phone) WHERE phone IS NOT NULL; CREATE INDEX IF NOT EXISTS users_email ON users(email);",
  );
  database = db;
  return db;
}
function touchLogin(id: string) {
  userDatabase()
    .prepare(
      "UPDATE users SET last_login_at=?, login_count=login_count+1 WHERE id=?",
    )
    .run(new Date().toISOString(), id);
  return findUser(id) as AccountUser;
}
/**
 * Sign-in with a verified email one-time code. An existing account with the same
 * (verified) email, including a Google account, is reused so people keep one account.
 */
export function recordEmailOtpLogin(email: string) {
  const address = email.toLowerCase();
  const existing = userDatabase()
    .prepare(
      "SELECT id FROM users WHERE email=? ORDER BY (google_sub LIKE 'email:%') ASC, last_login_at DESC LIMIT 1",
    )
    .get(address) as { id: string } | undefined;
  if (existing) return touchLogin(existing.id);
  const now = new Date().toISOString();
  const id = randomUUID();
  userDatabase()
    .prepare(
      "INSERT INTO users (id,google_sub,email,name,image,created_at,last_login_at) VALUES (?,?,?,?,NULL,?,?)",
    )
    .run(id, "email:" + address, address, address.split("@")[0], now, now);
  return findUser(id) as AccountUser;
}
export function maskPhone(phone: string) {
  return phone.length > 7
    ? phone.slice(0, 4) + "•••" + phone.slice(-4)
    : phone;
}
/** Sign-in with a verified phone one-time code; the E.164 number is the account key. */
export function recordPhoneOtpLogin(phone: string) {
  const existing = userDatabase()
    .prepare("SELECT id FROM users WHERE phone=?")
    .get(phone) as { id: string } | undefined;
  if (existing) return touchLogin(existing.id);
  const now = new Date().toISOString();
  const id = randomUUID();
  userDatabase()
    .prepare(
      "INSERT INTO users (id,google_sub,email,name,image,created_at,last_login_at,phone) VALUES (?,?,'',?,NULL,?,?,?)",
    )
    .run(id, "phone:" + phone, maskPhone(phone), now, now, phone);
  return findUser(id) as AccountUser;
}
export function recordGoogleLogin(profile: {
  sub: string;
  email: string;
  name?: string;
  picture?: string;
}) {
  const now = new Date().toISOString();
  userDatabase()
    .prepare(
      "INSERT INTO users (id,google_sub,email,name,image,created_at,last_login_at) VALUES (?,?,?,?,?,?,?) ON CONFLICT(google_sub) DO UPDATE SET email=excluded.email,name=excluded.name,image=excluded.image,last_login_at=excluded.last_login_at,login_count=users.login_count+1",
    )
    .run(
      randomUUID(),
      profile.sub,
      profile.email.toLowerCase(),
      profile.name || profile.email,
      profile.picture || null,
      now,
      now,
    );
  return userDatabase()
    .prepare("SELECT * FROM users WHERE google_sub=?")
    .get(profile.sub) as AccountUser;
}
export function findUser(id: string) {
  return userDatabase().prepare("SELECT * FROM users WHERE id=?").get(id) as
    AccountUser | undefined;
}
export function listUsers(page = 1, search = "") {
  const query = `%${search.replace(/[\%_]/g, "").slice(0, 120)}%`;
  const offset = (Math.max(1, Math.floor(page)) - 1) * 50;
  const users = userDatabase()
    .prepare(
      "SELECT id,email,phone,name,created_at,last_login_at,login_count FROM users WHERE email LIKE ? OR name LIKE ? OR phone LIKE ? ORDER BY last_login_at DESC LIMIT 50 OFFSET ?",
    )
    .all(query, query, query, offset);
  const total = userDatabase()
    .prepare(
      "SELECT COUNT(*) AS count FROM users WHERE email LIKE ? OR name LIKE ? OR phone LIKE ?",
    )
    .get(query, query, query) as { count: number };
  return { users, total: Number(total.count), page, pageSize: 50 };
}
