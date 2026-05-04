import styles from './Contributor.module.css'

export default function Contributor() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.eyebrow}>Contributor</div>
        <h1 className={styles.title}>Contributor Guide</h1>

        <div className={styles.grid}>
          <aside className={styles.sidebar}>
            <span className={styles.sidebarTitle}>On this page</span>
            <ul className={styles.sidebarList}>
              <li><a href="#overview" className={styles.sidebarLink}>Overview</a></li>
              <li><a href="#audio-format" className={styles.sidebarLink}>Audio Formats</a></li>
              <li><a href="#submitting" className={styles.sidebarLink}>Submitting via GitHub</a></li>
              <li><a href="#logic" className={styles.sidebarLink}>Installation Logic</a></li>
            </ul>
          </aside>

          <div className={styles.content}>
            <section id="overview" className={styles.section}>
              <span className={styles.sectionTitle}>01 / Overview</span>
              <h2>Welcome to the Collective</h2>
              <p>
                Phonosium is built on the contributions of sound artists and developers. 
                Whether you want to add a single field recording or design an entirely new 
                generative logic for the installation, this guide will help you get started.
              </p>
              <p>
                The installation environment is currently a <strong>Bela.io</strong> system 
                running a custom C++ and Pure Data (Pd) wrapper.
              </p>
            </section>

            <section id="audio-format" className={styles.section}>
              <span className={styles.sectionTitle}>02 / Audio Formats</span>
              <h2>Preparing Your Samples</h2>
              <p>
                To ensure compatibility with our low-latency buffer system, please follow 
                these technical specifications:
              </p>
              <div className={styles.codeBlock}>
                Format: WAV (Uncompressed)<br />
                Bit Depth: 16-bit or 24-bit<br />
                Sample Rate: 44.1 kHz or 48 kHz<br />
                Channels: Mono (Preferred for spatialization)
              </div>
              <p>
                Samples should be named using lowercase alphanumeric characters and hyphens only 
                (e.g., <code>industrial-drone-01.wav</code>).
              </p>
            </section>

            <section id="submitting" className={styles.section}>
              <span className={styles.sectionTitle}>03 / GitHub</span>
              <h2>How to Contribute</h2>
              <p>
                Our workflow is managed through GitHub. To contribute audio or code:
              </p>
              <p>
                1. <strong>Fork</strong> the Phonosium-Assets repository.<br />
                2. <strong>Upload</strong> your files to the <code>/contributions</code> folder.<br />
                3. <strong>Submit</strong> a Pull Request with a brief description of your work.
              </p>
              <p>
                Once submitted, our team will review the material for technical compatibility 
                and move it into the active installation rotation.
              </p>
            </section>

            <section id="logic" className={styles.section}>
              <span className={styles.sectionTitle}>04 / Logic</span>
              <h2>Custom Installation Logic</h2>
              <p>
                If you are a coder or Pure Data user, you can influence how the installation 
                reacts to its environment.
              </p>
              <p>
                The system provides four real-time microphone streams and several environmental 
                sensors. You can submit <code>.pd</code> patches or <code>.cpp</code> files 
                that interact with these streams.
              </p>
              <p>
                Check the{' '}
                <a href="https://github.com/phonosium/core" target="_blank" rel="noopener noreferrer" className={styles.link}>
                  Phonosium Core
                </a>{' '}
                repository for API documentation and examples.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}
