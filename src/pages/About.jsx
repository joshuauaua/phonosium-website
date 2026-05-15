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
          src="/images/phonosium-installation.jpg"
          alt="Phonosium installation showing PVC pipes around shipping container"
          className={styles.heroImage}
        />

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>About the Installation</h2>
          <p>
            Phonosium is a collaborative sonic experiment powered by a Bela.io
            microcontroller. Four electret microphones embedded in the PVC
            structure capture local interactions, while four high-fidelity
            speakers broadcast generative soundscapes that react in real-time to
            the environment.
          </p>
          <p>
            Whether you're standing in front of the installation in Stockholm or
            tuning in online, you can listen live and experience what's
            currently playing at Frihamnstorget.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Contribute</h2>
          <p>
            Want to hear your sounds echoing through the pipes? Submit your own
            audio material or code via our{' '}
            <a
              href="https://docs.phonosium.org"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              contributor portal
            </a>{' '}
            to influence the installation&apos;s behavior.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Credits</h2>
          <p>
            Phonosium is a project by <strong>Joshua Ng</strong> of{' '}
            <strong>Sonic Assembly</strong>, made possible with support from{' '}
            <strong>FRIHAMNSTORGETS KULTURFÖRENING</strong> in Stockholm's
            Frihamnen district.
          </p>
        </section>

        {/* Future: Add gallery section with WIP/behind-the-scenes images */}

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
