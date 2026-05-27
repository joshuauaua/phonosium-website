import SEO from '../components/SEO'
import styles from './About.module.css'
import Gallery from '../components/Gallery/Gallery'

export default function About() {
  // Calculate days since project launch
  const calculateDaysPlayed = () => {
    const launchDate = new Date('2026-05-14')
    const today = new Date()
    const diffTime = Math.abs(today - launchDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <>
      <SEO
        title="About"
        description="Wrapped around a shipping container at Frihamnstorget, this network of PVC pipes is your portal to sonic exploration. Phonosium is a crowdsourced, interactive sound installation powered by Bela.io, continuously looping 24/7 submissions from sound artists, explorers, and tinkerers worldwide."
        path="/about"
      />
      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.title}>About.</h1>
          <p className={styles.lead}>
            Wrapped around a shipping container at{' '}
            <a
              href="https://www.frihamnstorget.se/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              Frihamnstorget
            </a>
            , this network of PVC pipes is your portal to sonic exploration.
            Phonosium is a crowdsourced, interactive sound installation powered
            by{' '}
            <a
              href="https://bela.io/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              Bela.io
            </a>
            , continuously looping 24/7 submissions from sound artists,
            explorers, and tinkerers worldwide.
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
            Stockholm. Powered by{' '}
            <a
              href="https://bela.io/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              Bela
            </a>
            , the installation uses three microphones to capture local
            interactions while four speakers broadcast a continuous programme.
            Each installation plays in 30-minute scheduled timeslots. Experience
            it in person, or listen to recordings online.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Behind the Scenes</h2>
          <Gallery />
        </section>

        <section className={styles.quote}>
          <div className={styles.quoteInner}>
            <blockquote className={styles.blockquote}>
              Interactive sounds, crowdsourced from around the world. Always looping.
            </blockquote>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Contribute</h2>
          <p className={styles.body}>
            Submissions are now open — contribute your sounds via our{' '}
            <a href="/contribute" className={styles.link}>
              open call
            </a>
            , or contribute code to the{' '}
            <a
              href="https://github.com/joshuauaua/phonosium"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              GitHub repository
            </a>
            .
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Credits</h2>
          <p className={styles.body}>
            A project by{' '}
            <a
              href="https://sonicassembly.se"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              Sonic Assembly
            </a>{' '}
            with support from{' '}
            <a
              href="https://www.frihamnstorget.se/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              Frihamnstorget Kulturförening
            </a>
            . All sounds and recordings remain the property of their respective
            artists.
          </p>
        </section>

        <div className={styles.statRow}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>1+</span>
            <span className={styles.statLabel}>Artists</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>25</span>
            <span className={styles.statLabel}>Sound Files</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>2026</span>
            <span className={styles.statLabel}>Year Launched</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{calculateDaysPlayed()}</span>
            <span className={styles.statLabel}>Days Played</span>
          </div>
        </div>
      </main>
    </>
  )
}
