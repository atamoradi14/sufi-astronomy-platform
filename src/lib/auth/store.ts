import { DatabaseSync } from "node:sqlite";
import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

export type AccountUser = {
  id: string;
  google_sub: string;
  email: string;
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
  database = db;
  return db;
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
      "SELECT id,email,name,created_at,last_login_at,login_count FROM users WHERE email LIKE ? OR name LIKE ? ORDER BY last_login_at DESC LIMIT 50 OFFSET ?",
    )
    .all(query, query, offset);
  const total = userDatabase()
    .prepare(
      "SELECT COUNT(*) AS count FROM users WHERE email LIKE ? OR name LIKE ?",
    )
    .get(query, query) as { count: number };
  return { users, total: Number(total.count), page, pageSize: 50 };
}
