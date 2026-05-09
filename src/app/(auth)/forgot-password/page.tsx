"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./forgot.module.css";

export default function ForgotPasswordPage() {
  const [email, setEmail]       = useState("");
  const [sent, setSent]         = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [devResetPath, setDevResetPath] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setDevResetPath(null);

    if (!email) {
      setError("Email is required.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data?.error ?? "Failed to request password reset.");
        return;
      }

      setSent(true);
      if (typeof data?.resetPath === "string") {
        setDevResetPath(data.resetPath);
      }
    } catch {
      setError("Failed to request password reset.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.icon}>🔑</div>
        <h1 className={styles.title}>Forgot Password?</h1>
        <p className={styles.subtitle}>
          Enter your email and we&apos;ll send you a link to reset your password.
        </p>

        {error && <div className={styles.errorBox}>⚠ {error}</div>}

        {sent ? (
          <>
            <div className={styles.successBox}>
              ✓ If your account exists, a reset link has been generated.
            </div>

            {devResetPath && (
              <div className={styles.devBox}>
                <strong>Development only:</strong>{" "}
                <Link href={devResetPath}>Open your reset page</Link>
              </div>
            )}

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