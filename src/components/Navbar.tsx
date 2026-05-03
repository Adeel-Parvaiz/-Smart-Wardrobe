"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Shirt, Menu, X, ChevronDown, User, LogOut, Shield } from "lucide-react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const userRole = (session?.user as any)?.role as string | undefined;
  const isAdmin  = userRole === "ADMIN";
  const isLoggedIn = status === "authenticated";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    if (profileOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const linkClass = (path: string) =>
    pathname === path
      ? `${styles.navLink} ${styles.navLinkActive}`
      : styles.navLink;

  const mobileLinkClass = (path: string) =>
    pathname === path
      ? `${styles.mobileLink} ${styles.mobileLinkActive}`
      : styles.mobileLink;

  const userInitial = session?.user?.name?.[0]?.toUpperCase() ?? "?";

  return (
    <nav className={styles.nav}>
      <div className={styles.navInner}>

        {/* Brand */}
        <Link href="/" className={styles.brand}>
          <Shirt className={styles.brandIcon} aria-hidden="true" />
          Smart Wardrobe
        </Link>

        {/* Desktop Links */}
        <nav className={styles.desktopLinks}>
          <Link href="/"        className={linkClass("/")}>Home</Link>
          <Link href="/about"   className={linkClass("/about")}>About</Link>
          <Link href="/contact" className={linkClass("/contact")}>Contact</Link>

          {isLoggedIn && (
            <>
              <Link href="/wardrobe" className={linkClass("/wardrobe")}>My Wardrobe</Link>
              <Link href="/outfits"  className={linkClass("/outfits")}>Outfits</Link>
            </>
          )}

          {isAdmin && (
            <Link href="/admin" className={styles.adminLink}>
              <Shield aria-hidden="true" style={{ width: 14, height: 14 }} />
              Admin
            </Link>
          )}
        </nav>

        {/* Auth Buttons */}
        <div className={styles.authButtons}>
          {!isLoggedIn ? (
            <>
              <Link href="/login"    className={styles.btnGhost}>Log In</Link>
              <Link href="/register" className={styles.btnPrimary}>Sign Up</Link>
            </>
          ) : (
            <div className={styles.profileWrapper} ref={profileRef}>
              <button
                className={styles.profileBtn}
                onClick={() => setProfileOpen(!profileOpen)}
                aria-expanded={profileOpen}
                aria-label="Open profile menu"
              >
                <div className={styles.avatar}>{userInitial}</div>
                <span className={styles.profileName}>{session?.user?.name}</span>
                <ChevronDown
                  className={`${styles.chevron} ${profileOpen ? styles.chevronOpen : ""}`}
                />
              </button>

              {profileOpen && (
                <div className={styles.dropdown} role="menu">
                  <div className={styles.dropdownHeader}>
                    <p className={styles.dropdownEmail}>{session?.user?.email}</p>
                    <span className={`${styles.roleBadge} ${isAdmin ? styles.roleBadgeAdmin : styles.roleBadgeUser}`}>
                      {userRole}
                    </span>
                  </div>

                  <Link href="/profile" className={styles.dropdownItem} onClick={() => setProfileOpen(false)}>
                    <User style={{ width: 14, height: 14 }} />
                    My Profile
                  </Link>

                  <div className={styles.dropdownDivider} />

                  <button
                    className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    <LogOut style={{ width: 14, height: 14 }} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hamburger */}
        <button
          className={styles.hamburger}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen
            ? <X style={{ width: 22, height: 22 }} />
            : <Menu style={{ width: 22, height: 22 }} />
          }
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className={styles.mobileMenu}>
          <Link href="/"        className={mobileLinkClass("/")}>Home</Link>
          <Link href="/about"   className={mobileLinkClass("/about")}>About</Link>
          <Link href="/contact" className={mobileLinkClass("/contact")}>Contact</Link>

          {isLoggedIn && (
            <>
              <Link href="/wardrobe" className={mobileLinkClass("/wardrobe")}>My Wardrobe</Link>
              <Link href="/outfits"  className={mobileLinkClass("/outfits")}>Outfits</Link>
            </>
          )}

          {isAdmin && (
            <Link href="/admin" className={mobileLinkClass("/admin")}>🛡️ Admin</Link>
          )}

          {!isLoggedIn ? (
            <div className={styles.mobileAuthRow}>
              <Link href="/login"    className={styles.btnGhost}>Log In</Link>
              <Link href="/register" className={styles.btnPrimary}>Sign Up</Link>
            </div>
          ) : (
            <button className={styles.mobileSignOut} onClick={() => signOut({ callbackUrl: "/" })}>
              Sign Out
            </button>
          )}
        </div>
      )}
    </nav>
  );
}