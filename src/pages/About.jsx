import styles from './About.module.css'

export default function About() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.eyebrow}>About</div>
        <h1 className={styles.title}>About Phonosium</h1>

        <div className={styles.grid}>
          <div className={styles.lead}>
            <p>
              Phonosium is a living, breathing sound installation that bridges the gap between the physical and the digital. 
              Wrapped around a shipping container at Frihamnstorget like a mechanical octopus, this network of PVC pipes serves 
              as an interactive interface for sonic exploration.
            </p>
            <p>
              Whether you are standing in front of the installation in Stockholm or tuning in from across the globe, 
              Phonosium invites you to listen, interact, and contribute.
            </p>
          </div>

          <div className={styles.body}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>How It Works</h2>
              <p>
                The installation is powered by a Bela.io microcontroller, known for its ultra-low latency and 
                high-performance audio processing.
              </p>
              <p>
                <strong>The Interface:</strong> Four electret microphones are embedded within the PVC pipe structure, 
                capturing local interactions and environmental textures.
              </p>
              <p>
                <strong>The Output:</strong> Four high-fidelity speakers mounted on the container broadcast a mix 
                of generative soundscapes and sensor-triggered events.
              </p>
              <p>
                <strong>The Experience:</strong> By default, the system runs a generative background loop that 
                reacts in real-time to input from the physical sensors, creating an ever-evolving dialogue between 
                the structure and its surroundings.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>A Crowdsourced Sonic Canvas</h2>
              <p>
                At its heart, Phonosium is a collaborative experiment. We believe that public art should be shaped by the public.
              </p>
              <p>
                While the "default" state of the installation provides a continuous sonic backdrop, the platform is 
                designed to be crowdsourced. We invite sound artists, coders, and enthusiasts to contribute their own 
                samples and installation logic.
              </p>
              <p>
                <strong>Listen Live:</strong> Our website acts as a digital mirror to the physical site. Much like a 
                web radio station, you can check in at any time to hear what is currently playing at Frihamnstorget.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Get Involved</h2>
              <p>
                Want to hear your sounds echoing through the pipes at Frihamnstorget? We’ve made it possible for 
                anyone to contribute to the Phonosium project via GitHub.
              </p>
              <p>
                <strong>Contribute:</strong> Submit your own audio material or code to influence the installation’s behavior.
              </p>
              <p>
                <strong>Documentation:</strong> Visit our{' '}
                <a href="https://docs.phonosium.org" target="_blank" rel="noopener noreferrer" className={styles.link}>
                  dedicated documentation site
                </a>{' '}
                for step-by-step instructions on how to format your samples and submit your work.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Credits</h2>
              <p>
                Phonosium is a project by <strong>Joshua Ng</strong> of <strong>Sonic Assembly</strong>.
              </p>
              <p>
                This project was made possible with the generous support of <strong>FRIHAMNSTORGETS KULTURFÖRENING</strong>, 
                located in the vibrant heart of Stockholm’s Frihamnen district.
              </p>
            </section>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.statRow}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>4</span>
            <span className={styles.statLabel}>Sensors</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>4</span>
            <span className={styles.statLabel}>Output Channels</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>2026</span>
            <span className={styles.statLabel}>Launched</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>∞</span>
            <span className={styles.statLabel}>Sonic Dialogue</span>
          </div>
        </div>
      </div>
    </main>
  )
}
