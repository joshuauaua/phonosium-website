import styles from './About.module.css'

export default function About() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.eyebrow}>About</div>
        <h1 className={styles.title}>About Phonosium</h1>
        <p className={styles.subtitle}>
          A living, breathing sound installation that bridges the physical and
          digital. Wrapped around a shipping container at Frihamnstorget, this
          network of PVC pipes serves as an interactive interface for sonic
          exploration.
        </p>

        <img
          src="/images/phonosium-pipes-angle.jpg"
          alt="Phonosium installation PVC pipes from below showing construction details"
          className={styles.heroImage}
        />

        <section className={styles.gallerySection}>
          <h2 className={styles.sectionTitle}>Building Process</h2>
          <div className={styles.gallery}>
            <img
              src="/images/gallery/aerial-view-1.jpg"
              alt="Aerial view of Phonosium installation construction"
              loading="lazy"
            />
            <img
              src="/images/gallery/aerial-view-2.jpg"
              alt="Aerial view of PVC pipe structure"
              loading="lazy"
            />
            <img
              src="/images/gallery/detail-1.jpg"
              alt="Detail of pipe connections and mounting"
              loading="lazy"
            />
            <img
              src="/images/gallery/detail-2.jpg"
              alt="Close-up of installation structure"
              loading="lazy"
            />
            <img
              src="/images/gallery/detail-3.jpg"
              alt="Construction detail showing pipe assembly"
              loading="lazy"
            />
            <img
              src="/images/gallery/construction-1.jpg"
              alt="Installation construction progress"
              loading="lazy"
            />
            <img
              src="/images/gallery/construction-2.jpg"
              alt="Behind-the-scenes construction work"
              loading="lazy"
            />
            <img
              src="/images/gallery/construction-3.jpg"
              alt="Final construction details"
              loading="lazy"
            />
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>About the Installation</h2>
          <p>
            Phonosium is a collaborative sonic experiment at Frihamnstorget in
            Stockholm. Powered by Bela.io, four microphones capture local
            interactions while four speakers broadcast generative soundscapes.
            Listen live online or experience it in person.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Contribute</h2>
          <p>
            Submit audio or code via our{' '}
            <a
              href="https://docs.phonosium.org"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              contributor portal
            </a>{' '}
            to influence the installation.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Credits</h2>
          <p>
            A project by Joshua Ng (Sonic Assembly) with support from
            Frihamnstorgets Kulturförening.
          </p>
        </section>

        <div className={styles.divider} />

        <div className={styles.statRow}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>12+</span>
            <span className={styles.statLabel}>Artists</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>380</span>
            <span className={styles.statLabel}>Sound Files</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>2026</span>
            <span className={styles.statLabel}>Year Launched</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>14,400+</span>
            <span className={styles.statLabel}>Minutes Played</span>
          </div>
        </div>
      </div>
    </main>
  )
}
