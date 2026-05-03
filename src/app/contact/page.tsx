import styles from "./contact.module.css";

export default function ContactPage() {
  return (
    <div className={styles.page}>

      {/* Hero */}
      <section className={styles.hero}>
        <span className={styles.badge}>Contact</span>
        <h1 className={styles.title}>Get In Touch</h1>
        <p className={styles.subtitle}>Questions, feedback, or just want to say hello?</p>
      </section>

      <section className={styles.body}>
        <div className={styles.bodyInner}>
          <div className={styles.grid}>

            {/* Contact Info Cards */}
            <div className={styles.infoCol}>
              <h2 className={styles.colTitle}>Contact Information</h2>

              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>✉</div>
                <div>
                  <div className={styles.infoLabel}>Email</div>
                  <div className={styles.infoValue}>adeel@wardrobe.com</div>
                </div>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>📞</div>
                <div>
                  <div className={styles.infoLabel}>Phone</div>
                  <div className={styles.infoValue}>+92 300 0000000</div>
                </div>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>📍</div>
                <div>
                  <div className={styles.infoLabel}>Location</div>
                  <div className={styles.infoValue}>NUCES, Islamabad, Pakistan</div>
                </div>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>🎓</div>
                <div>
                  <div className={styles.infoLabel}>Student Info</div>
                  <div className={styles.infoValue}>Muhammad Adeel — 23i-0739, CS-A</div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className={styles.formCol}>
              <h2 className={styles.colTitle}>Send a Message</h2>
              <form className={styles.form}>
                <div className={styles.field}>
                  <label className={styles.label}>Full Name</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Your name"
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Email Address</label>
                  <input
                    type="email"
                    className={styles.input}
                    placeholder="your@email.com"
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Subject</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="What is this about?"
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Message</label>
                  <textarea
                    className={styles.textarea}
                    rows={5}
                    placeholder="Write your message here..."
                  />
                </div>
                <button type="submit" className={styles.submitBtn}>
                  Send Message →
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}