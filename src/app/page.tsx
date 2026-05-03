import Link from "next/link";
import styles from "./home.module.css";

export default function HomePage() {
  return (
    <div>
      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroGrid} />
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeIcon}>✦</span>
            Digital Wardrobe Management
          </div>
          <h1 className={styles.heroTitle}>
            Your Smart{" "}
            <span className={styles.heroTitleAccent}>Wardrobe</span>
            <br />Starts Here
          </h1>
          <p className={styles.heroSubtitle}>
            Add your clothes, plan outfits, and dress smarter every single day — all in one place.
          </p>
          <div className={styles.heroCta}>
            <Link href="/register" className={styles.btnCta}>
              Get Started Free →
            </Link>
            <Link href="/about" className={styles.btnCtaOutline}>
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className={styles.features}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Features</span>
          <h2 className={styles.sectionTitle}>Everything you need</h2>
          <p className={styles.sectionSubtitle}>Manage your wardrobe the smart way</p>
        </div>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={`${styles.featureIcon} ${styles.featureIconBlue}`}>👗</div>
            <h3 className={styles.featureTitle}>Wardrobe Grid</h3>
            <p className={styles.featureDesc}>View all your clothes in a clean responsive grid layout with search and filters.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={`${styles.featureIcon} ${styles.featureIconAmber}`}>👔</div>
            <h3 className={styles.featureTitle}>Outfit Planner</h3>
            <p className={styles.featureDesc}>Mix and match items to build and save your perfect outfits for any occasion.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={`${styles.featureIcon} ${styles.featureIconGreen}`}>🔒</div>
            <h3 className={styles.featureTitle}>Secure & Private</h3>
            <p className={styles.featureDesc}>Your wardrobe data is encrypted and protected. Only you can access it.</p>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className={styles.statsStrip}>
        <div className={styles.statsGrid}>
          <div>
            <div className={styles.statNumber}>500+</div>
            <div className={styles.statLabel}>Items Tracked</div>
          </div>
          <div>
            <div className={styles.statNumber}>200+</div>
            <div className={styles.statLabel}>Outfits Created</div>
          </div>
          <div>
            <div className={styles.statNumber}>50+</div>
            <div className={styles.statLabel}>Happy Users</div>
          </div>
          <div>
            <div className={styles.statNumber}>100%</div>
            <div className={styles.statLabel}>Secure</div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Ready to organize your wardrobe?</h2>
          <p className={styles.ctaSubtitle}>Join and start managing your clothes digitally today.</p>
          <Link href="/register" className={styles.btnCtaWhite}>
            Create Free Account →
          </Link>
        </div>
      </section>
    </div>
  );
}