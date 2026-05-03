import Link from "next/link";
import { Shirt, Mail, Phone, MapPin, Github, Instagram, Twitter } from "lucide-react";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerGrid}>

        {/* Brand Column */}
        <div>
          <div className={styles.footerLogo}>
            <Shirt className={styles.footerLogoIcon} />
            Smart Wardrobe
          </div>
          <p className={styles.footerTagline}>
            Your digital wardrobe companion. Organize clothes, plan outfits, and dress smarter every day.
          </p>
          <div className={styles.socialRow}>
            <a href="#" className={`${styles.socialBtn} ${styles.socialBtnGithub}`} aria-label="GitHub">
              <Github className={styles.socialIcon} />
            </a>
            <a href="#" className={`${styles.socialBtn} ${styles.socialBtnInstagram}`} aria-label="Instagram">
              <Instagram className={styles.socialIcon} />
            </a>
            <a href="#" className={`${styles.socialBtn} ${styles.socialBtnTwitter}`} aria-label="Twitter">
              <Twitter className={styles.socialIcon} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <p className={styles.colHeading}>Navigation</p>
          <ul className={styles.linkList}>
            <li><Link href="/"         className={styles.footerLink}>Home</Link></li>
            <li><Link href="/about"    className={styles.footerLink}>About</Link></li>
            <li><Link href="/wardrobe" className={styles.footerLink}>My Wardrobe</Link></li>
            <li><Link href="/outfits"  className={styles.footerLink}>Outfits</Link></li>
            <li><Link href="/contact"  className={styles.footerLink}>Contact</Link></li>
          </ul>
        </div>

        {/* Account Links */}
        <div>
          <p className={styles.colHeading}>Account</p>
          <ul className={styles.linkList}>
            <li><Link href="/login"           className={styles.footerLink}>Log In</Link></li>
            <li><Link href="/register"        className={styles.footerLink}>Sign Up</Link></li>
            <li><Link href="/forgot-password" className={styles.footerLink}>Forgot Password</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <p className={styles.colHeading}>Contact</p>
          <ul className={styles.contactList}>
            <li className={styles.contactItem}>
              <Mail className={styles.contactIcon} />
              adeel@wardrobe.com
            </li>
            <li className={styles.contactItem}>
              <Phone className={styles.contactIcon} />
              +92 300 0000000
            </li>
            <li className={styles.contactItem}>
              <MapPin className={styles.contactIcon} />
              NUCES, Islamabad, Pakistan
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p className={styles.copyright}>
          © {new Date().getFullYear()} Smart Wardrobe — Muhammad Adeel (23i-0739)
        </p>
        <div className={styles.legalLinks}>
          <a href="#" className={styles.legalLink}>Privacy Policy</a>
          <a href="#" className={styles.legalLink}>Terms of Use</a>
        </div>
      </div>
    </footer>
  );
}