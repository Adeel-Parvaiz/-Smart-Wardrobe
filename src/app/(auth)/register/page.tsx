"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./register.module.css";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm]       = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  function strength(pw: string) {
    let s = 0;
    if (pw.length >= 6)           s++;
    if (pw.length >= 10)          s++;
    if (/[A-Z]/.test(pw))        s++;
    if (/[0-9]/.test(pw))        s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  }

  const pwStrength    = strength(form.password);
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"][pwStrength];
  const strengthColor = ["", "#e74c3c", "#e67e22", "#f1c40f", "#2ecc71", "#27ae60"][pwStrength];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password)
      { setError("All fields are required"); return; }
    if (!/\S+@\S+\.\S+/.test(form.email))
      { setError("Enter a valid email"); return; }
    if (form.password.length < 6)
      { setError("Password must be at least 6 characters"); return; }
    if (form.password !== form.confirm)
      { setError("Passwords do not match"); return; }

    setLoading(true);
    const res = await fetch("/api/register", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        name:     form.name,
        email:    form.email,
        password: form.password,
      }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) { setError(data.error); return; }
    router.push("/login");
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.logoIcon}>👗</div>
          <h1 className={styles.cardTitle}>Create Account</h1>
          <p className={styles.cardSubtitle}>Join Smart Wardrobe today</p>
        </div>

        {error && <div className={styles.errorAlert}>⚠ {error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Full Name</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Muhammad Adeel"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Email Address</label>
            <input
              type="email"
              className={styles.input}
              placeholder="you@email.com"
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              className={styles.input}
              placeholder="Min 6 characters"
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
            />
            {form.password && (
              <>
                <div className={styles.strengthBar}>
                  <div
                    className={styles.strengthFill}
                    style={{
                      width:      `${(pwStrength / 5) * 100}%`,
                      background: strengthColor,
                    }}
                  />
                </div>
                <p className={styles.strengthLabel} style={{ color: strengthColor }}>
                  {strengthLabel}
                </p>
              </>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Confirm Password</label>
            <input
              type="password"
              className={styles.input}
              placeholder="Repeat your password"
              value={form.confirm}
              onChange={e => setForm({...form, confirm: e.target.value})}
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Creating account..." : "Create Account →"}
          </button>
        </form>

        <p className={styles.cardFooter}>
          Already have an account?{" "}
          <Link href="/login" className={styles.registerLink}>Log in</Link>
        </p>
      </div>
    </div>
  );
}