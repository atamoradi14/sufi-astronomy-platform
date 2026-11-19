"use client";
import { useEffect, useState } from "react";
import { useLanguage } from "@/components/language/Language";
import { LocalizedDigits } from "@/components/digits/DigitScript";
type User = {
  id: string;
  email: string;
  phone?: string | null;
  name: string;
  created_at: string;
  last_login_at: string;
  login_count: number;
};
export function AdminUsers() {
  const { t } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    fetch(`/api/admin/users?page=${page}&q=${encodeURIComponent(search)}`, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then(async (r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      })
      .then((d) => {
        setUsers(d.users);
        setTotal(d.total);
        setLoading(false);
      })
      .catch((e) => {
        if (e.name !== "AbortError") {
          setError(t("دریافت کاربران انجام نشد.", "Could not load users."));
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, [page, search, t]);
  return (
    <LocalizedDigits>
      <section className="mx-auto max-w-6xl space-y-6 px-4 py-10">
        <header className="space-y-2">
          <p className="study-kicker">FANOUS-E KHIAL / ADMIN</p>
          <h1 className="text-3xl text-[var(--gold-soft)]">
            {t("کاربران فانوس خیال", "Fanous-e Khial users")}
          </h1>
          <p className="text-sm text-[var(--muted)]">
            {t(
              "کاربرانی که با ایمیل تأییدشدهٔ گوگل وارد شده‌اند. دسترسی به صندوق Gmail درخواست نمی‌شود.",
              "Accounts registered through verified Google sign-in. Gmail inbox access is not requested.",
            )}
          </p>
        </header>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
            setSearch(query);
          }}
          className="flex flex-wrap gap-2"
        >
          <input
            aria-label={t("جست‌وجوی کاربران", "Search users")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("نام، ایمیل یا موبایل", "Name, email or mobile")}
            className="control-input max-w-sm"
          />
          <button className="rounded-lg bg-[var(--gold)] px-4 py-2 text-[var(--ink)]">
            {t("جست‌وجو", "Search")}
          </button>
        </form>
        <p aria-live="polite">
          {total} {t("کاربر", "users")}
        </p>
        {error && <p role="alert">{error}</p>}
        <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
          <table className="w-full text-start text-sm">
            <thead className="bg-[var(--panel)] text-[var(--muted)]">
              <tr>
                {[
                  t("نام", "Name"),
                  t("ایمیل یا موبایل", "Email or mobile"),
                  t("اولین ورود", "First sign-in"),
                  t("آخرین ورود", "Last sign-in"),
                  t("تعداد ورود", "Sign-ins"),
                ].map((x) => (
                  <th className="p-4 text-start" key={x}>
                    {x}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-[var(--border)]">
                  <td className="p-4">{u.name}</td>
                  <td className="p-4" dir="ltr">
                    {u.email || u.phone}
                  </td>
                  <td className="p-4 whitespace-nowrap" dir="ltr">
                    {u.created_at.replace("T", " ").slice(0, 16)} UTC
                  </td>
                  <td className="p-4 whitespace-nowrap" dir="ltr">
                    {u.last_login_at.replace("T", " ").slice(0, 16)} UTC
                  </td>
                  <td className="p-4">{u.login_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {loading ? (
          <p role="status">{t("در حال دریافت…", "Loading…")}</p>
        ) : (
          users.length === 0 &&
          !error && (
            <p>
              {t(
                "هنوز کاربری با این مشخصات ثبت نشده است.",
                "No matching users have registered yet.",
              )}
            </p>
          )
        )}
        <div className="flex gap-3">
          <button
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-lg border border-[var(--border)] px-4 py-2 disabled:opacity-30"
          >
            {t("قبل", "Previous")}
          </button>
          <span className="p-2">{page}</span>
          <button
            disabled={page * 50 >= total || loading}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-[var(--border)] px-4 py-2 disabled:opacity-30"
          >
            {t("بعد", "Next")}
          </button>
        </div>
      </section>
    </LocalizedDigits>
  );
}
