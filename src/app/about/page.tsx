import styles from "./about.module.css";

export default function AboutPage() {
  return (
    <div className={styles.page}>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.badge}>About Us</span>
          <h1 className={styles.title}>The Story Behind<br />Smart Wardrobe</h1>
          <p className={styles.subtitle}>
            A web project built for NUCES Islamabad — helping people manage their clothes digitally and plan outfits smarter.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.missionGrid}>
            <div>
              <span className={styles.sectionLabel}>Our Mission</span>
              <h2 className={styles.sectionTitle}>Why Smart Wardrobe?</h2>
              <p className={styles.sectionText}>
                Most people wear only 20% of their wardrobe 80% of the time. Smart Wardrobe solves this by giving you a clear digital view of everything you own — so you can dress better, waste less, and feel more organized every day.
              </p>
              <p className={styles.sectionText}>
                Built with modern web technologies including Next.js, Prisma, and NextAuth — this project demonstrates full-stack development with secure authentication and role-based access control.
              </p>
            </div>
            <div className={styles.statsBox}>
              <div className={styles.statItem}>
                <div className={styles.statNum}>500+</div>
                <div className={styles.statLabel}>Wardrobe Items Tracked</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNum}>200+</div>
                <div className={styles.statLabel}>Outfits Created</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNum}>100%</div>
                <div className={styles.statLabel}>Secure & Private</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className={styles.techSection}>
        <div className={styles.sectionInner}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <span className={styles.sectionLabel}>Tech Stack</span>
            <h2 className={styles.sectionTitle}>Built With</h2>
          </div>
          <div className={styles.techGrid}>
            {[
              { name: "Next.js 14", desc: "React framework with App Router", icon: "▲" },
              { name: "TypeScript", desc: "Type-safe JavaScript", icon: "TS" },
              { name: "Prisma ORM", desc: "Database management", icon: "◆" },
              { name: "NextAuth", desc: "Authentication & sessions", icon: "🔒" },
              { name: "CSS Modules", desc: "Scoped component styling", icon: "#" },
              { name: "bcrypt", desc: "Password hashing & security", icon: "⚡" },
            ].map((tech) => (
              <div key={tech.name} className={styles.techCard}>
                <div className={styles.techIcon}>{tech.icon}</div>
                <div className={styles.techName}>{tech.name}</div>
                <div className={styles.techDesc}>{tech.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Developer */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <span className={styles.sectionLabel}>Developer</span>
            <h2 className={styles.sectionTitle}>Meet the Builder</h2>
          </div>
          <div className={styles.devCard}>
            <div className={styles.devAvatar}>MA</div>
            <div>
              <div className={styles.devName}>Muhammad Adeel</div>
              <div className={styles.devRole}>Student — CS-A, 23i-0739</div>
              <div className={styles.devUni}>National University of Computer & Emerging Sciences, Islamabad</div>
              <div className={styles.devTags}>
                <span className={styles.tag}>Web Programming</span>
                <span className={styles.tag}>Semester 6</span>
                <span className={styles.tag}>Full Stack</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}