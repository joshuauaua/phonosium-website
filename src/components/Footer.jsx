import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span className={styles.left}>Phonosium 2026 · Stockholm</span>
      <div className={styles.center}>
        <img
          src="/octopus-logo.svg"
          alt="Phonosium Logo"
          className={styles.logo}
        />
      </div>
      <span className={styles.right}>
        <a
          href="https://www.instagram.com/sonicassembly"
          target="_blank"
          rel="noopener noreferrer"
        >
          Instagram
        </a>
        <a
          href="https://github.com/joshuauaua/phonosium"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        <a
          href="https://sonicassembly.se"
          target="_blank"
          rel="noopener noreferrer"
        >
          Sonic Assembly
        </a>
      </span>
    </footer>
  )
}
