"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./forgot.module.css";

export default function ForgotPasswordPage() {
  const [email, setEmail]       = useState("");
  const [sent, setSent]         = useState(false);
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.icon}>🔑</div>
        <h1 className={styles.title}>Forgot Password?</h1>
        <p className={styles.subtitle}>
          Enter your email and we'll send you a link to reset your password.
        </p>

        {sent ? (
          <>
            <div className={styles.successBox}>
              ✓ Reset link sent! Check your email inbox.
            </div>
            <Link href="/login" className={styles.backLink}>← Back to Login</Link>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label className={styles.label}>Email Address</label>
              <input
                type="email"
                className={styles.input}
                placeholder="you@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
            <Link href="/login" className={styles.backLink}>← Back to Login</Link>
          </form>
        )}
      </div>
    </div>
  );
}