import styles from './Contributor.module.css'

export default function Contributor() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Open Call</h1>
        <p className={styles.subtitle}>Apply with your sounds before June 15</p>
        <p className={styles.contact}>
          Email <a href="mailto:hej@sonicassembly.se">hej@sonicassembly.se</a> for more information
        </p>

        <div className={styles.criteriaBox}>
          <h2>Submission Requirements</h2>
          <ul className={styles.criteriaList}>
            <li>One loop (max 20 MB) — 44.1kHz, 16-bit, saved as "loop.wav"</li>
            <li>Up to 24 samples (1-6 seconds each) — balanced gain levels</li>
            <li>Demo audio: your loop with triggered samples (uploaded to Phonosium SoundCloud)</li>
            <li>Title and description of your piece</li>
            <li>Links to your work</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
