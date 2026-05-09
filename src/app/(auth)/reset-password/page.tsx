"use client";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./reset.module.css";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token") ?? "", [searchParams]);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!token) {
      setError("Reset token is missing. Please request a new reset link.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Failed to reset password.");
        return;
      }
      setSuccess(true);
    } catch {
      setError("Failed to reset password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.icon}>🔐</div>
      <h1 className={styles.title}>Reset Password</h1>
      <p className={styles.subtitle}>Set a new password for your account.</p>
      {error && <div className={styles.errorBox}>⚠ {error}</div>}
      {success ? (
        <>
          <div className={styles.successBox}>✓ Password updated successfully.</div>
          <Link href="/login" className={styles.backLink}>Go to Login →</Link>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>New Password</label>
            <input
              type="password"
              className={styles.input}
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Confirm Password</label>
            <input
              type="password"
              className={styles.input}
              placeholder="Repeat your password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
          <Link href="/login" className={styles.backLink}>← Back to Login</Link>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className={styles.page}>
      <Suspense fallback={<div className={styles.card}>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
