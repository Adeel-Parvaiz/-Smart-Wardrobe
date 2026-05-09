"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "2rem 1.5rem" }}>
        <p style={{ color: "#9e9690", fontSize: "0.875rem" }}>Loading profile...</p>
      </div>
    );
  }

  if (status !== "authenticated") {
    return (
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "2rem 1.5rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.5rem" }}>Profile</h1>
        <p style={{ color: "#9e9690", marginBottom: "1rem" }}>
          Please log in to view your profile.
        </p>
        <Link href="/login" style={{ color: "#2e4057", fontWeight: 600, textDecoration: "underline" }}>
          Go to login
        </Link>
      </div>
    );
  }

  const user = session.user;

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.25rem", color: "#262220" }}>
        My Profile
      </h1>
      <p style={{ color: "#9e9690", marginBottom: "1.5rem" }}>
        Account details for Smart Wardrobe.
      </p>

      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e2ddd6",
          borderRadius: "1.25rem",
          padding: "1.25rem",
          display: "grid",
          gap: "0.75rem",
          maxWidth: 560,
        }}
      >
        <div>
          <div style={{ fontSize: "0.75rem", color: "#9e9690", fontWeight: 600, textTransform: "uppercase" }}>
            Name
          </div>
          <div style={{ fontSize: "1rem", color: "#262220", fontWeight: 650 }}>{user.name}</div>
        </div>

        <div>
          <div style={{ fontSize: "0.75rem", color: "#9e9690", fontWeight: 600, textTransform: "uppercase" }}>
            Email
          </div>
          <div style={{ fontSize: "1rem", color: "#262220", fontWeight: 650 }}>{user.email}</div>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.375rem 0.75rem",
              borderRadius: 9999,
              background: "#f0ede8",
              color: "#514b45",
              fontWeight: 650,
              fontSize: "0.875rem",
            }}
          >
            Role: {user.role}
          </div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.375rem 0.75rem",
              borderRadius: 9999,
              background: user.status === "ACTIVE" ? "#ecfdf5" : "#fef2f2",
              color: user.status === "ACTIVE" ? "#047857" : "#b91c1c",
              fontWeight: 650,
              fontSize: "0.875rem",
            }}
          >
            Status: {user.status}
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
          <Link
            href="/wardrobe"
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "0.75rem",
              background: "#2e4057",
              color: "#fff",
              fontWeight: 700,
            }}
          >
            Go to Wardrobe
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "0.75rem",
              background: "#f0ede8",
              border: "1px solid #e2ddd6",
              color: "#514b45",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}

