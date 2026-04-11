import styles from './About.module.css'

export default function About() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.eyebrow}>About</div>
        <h1 className={styles.title}>What is Phonosium?</h1>

        <div className={styles.grid}>
          <div className={styles.lead}>
            <p>
              Phonosium is an online space dedicated to sound art as a continuous, living practice.
              It exists as both archive and broadcast — a place where sound installations are not
              preserved behind glass, but kept active, turning, and listenable.
            </p>
          </div>

          <div className={styles.body}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>The Premise</h2>
              <p>
                Sound installations are among the most ephemeral forms of contemporary art.
                They depend on physical space, duration, and presence — conditions that resist
                documentation. Phonosium is an attempt to hold these works in a different way:
                not as recordings of something past, but as ongoing transmissions that can be
                tuned into.
              </p>
              <p>
                Each installation on this platform is presented as a current piece — something
                that can be encountered now. The artists remain identified and reachable.
                The works remain listenable.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>How It Works</h2>
              <p>
                The platform maintains a rotating roster of sound installations, each selected
                through an open call process. Works are presented with full artist context —
                not just names and dates, but the conditions under which the work was made,
                the materials and methodologies involved, and the ideas driving it.
              </p>
              <p>
                Visitors can browse installations freely and move between them. One installation
                is always marked as &ldquo;Now Playing&rdquo; — the current featured work.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Who We Are</h2>
              <p>
                Phonosium is an independent initiative founded in 2025. We are not affiliated
                with any gallery, label, or institution. Our operating costs are covered by
                annual memberships and occasional grant support. We do not sell advertising.
              </p>
              <p>
                If you are a sound artist interested in submitting work, or an institution
                interested in partnership, you can reach us at{' '}
                <a href="mailto:hello@phonosium.org" className={styles.link}>
                  hello@phonosium.org
                </a>
                .
              </p>
            </section>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.statRow}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>5</span>
            <span className={styles.statLabel}>Active Installations</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>5</span>
            <span className={styles.statLabel}>Featured Artists</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>2025</span>
            <span className={styles.statLabel}>Founded</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>∞</span>
            <span className={styles.statLabel}>Hours of Listening</span>
          </div>
        </div>
      </div>
    </main>
  )
}
