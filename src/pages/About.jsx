import styles from './About.module.css'
import Gallery from '../components/Gallery/Gallery'

export default function About() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <h1 className={styles.title}>About.</h1>
        <p className={styles.lead}>
          A living, breathing sound installation that bridges the physical and
          digital. Wrapped around a shipping container at{' '}
          <a
            href="https://www.frihamnstorget.se/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            Frihamnstorget
          </a>
          , this network of PVC pipes serves as an interactive interface for
          sonic exploration.
        </p>
      </section>

      <section className={styles.imageSection}>
        <img
          src="/images/phonosium-pipes-angle.jpg"
          alt="Phonosium installation PVC pipes from below showing construction details"
          className={styles.heroImage}
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>The Installation</h2>
        <p className={styles.body}>
          Phonosium is a collaborative sonic experiment at Frihamnstorget in
          Stockholm. Powered by Bela.io, four microphones capture local
          interactions while four speakers broadcast generative soundscapes.
          Listen live online or experience it in person.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Behind the Scenes</h2>
        <Gallery />
      </section>

      <section className={styles.quote}>
        <div className={styles.quoteInner}>
          <div className={styles.quoteLabel}>About</div>
          <blockquote className={styles.blockquote}>
            &ldquo;It is not a concert. It is a structure{' '}
            <em>thinking out loud</em>, and we happen to be near it.&rdquo;
          </blockquote>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Contribute</h2>
        <p className={styles.body}>
          Submit audio or code via our contributor portal to influence the
          installation. All contributions are reviewed by the collective.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Credits</h2>
        <p className={styles.body}>
          A project by Joshua Ng (Sonic Assembly) with support from
          Frihamnstorgets Kulturf&ouml;rening.
        </p>
      </section>

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
    </main>
  )
}
