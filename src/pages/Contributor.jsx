import { useState } from 'react'
import SEO from '../components/SEO'
import styles from './Contributor.module.css'
import ContributionForm from '../components/ContributionForm'

export default function Contributor() {
  const [showSubmissionForm, setShowSubmissionForm] = useState(false)

  return (
    <>
      <SEO
        title="Call for Submissions"
        description="Submit your sound to Phonosium. We are accepting submissions for the installation from anywhere in the world until June 15, 2026."
        path="/contribute"
      />
      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.title}>Call for Submissions</h1>
          <p className={styles.subtitle}>
            We are accepting submissions for the installation from anywhere in
            the world until June 15, 2026
          </p>
          <p className={styles.contact}>
            Email{' '}
            <a href="mailto:hej@sonicassembly.se" className={styles.link}>
              hej@sonicassembly.se
            </a>{' '}
            for more information
          </p>
        </section>

        <section className={styles.description}>
          <h2 className={styles.descriptionTitle}>What to Submit</h2>
          <p className={styles.descriptionText}>
            Submitting a piece to Phonosium involves sending at least 1 loop
            (20MB max) and up to 24 individual samples. Accepted submissions
            will be added to a schedule and played consistently as part of the
            interactive Phonosium sound installation at Frihamnstorget in
            Stockholm.
          </p>
          <p className={styles.descriptionText}>
            Your submission becomes part of the living installation, triggered
            and layered with other contributions to form an ever-evolving
            composition. This is an opportunity to share your sonic perspective
            and contribute to a collective auditory experience.
          </p>
        </section>

        <section className={styles.requirementsContainer}>
          <div className={styles.requirementsGrid}>
            <div className={styles.requirementCard}>
              <h2 className={styles.cardTitle}>What to Submit</h2>
              <ul className={styles.cardList}>
                <li>Cover image for your piece</li>
                <li>One loop file (loop.wav)</li>
                <li>Up to 24 sample files</li>
                <li>Demo audio link (Soundcloud)</li>
                <li>Title and description</li>
                <li>Links to your work</li>
              </ul>
            </div>

            <div className={styles.requirementCard}>
              <h2 className={styles.cardTitle}>Submission Criteria</h2>
              <ul className={styles.cardList}>
                <li>Audio format: 44.1 kHz, 16-bit WAV</li>
                <li>Loop file: max 20 MB</li>
                <li>Sample files: 1–6 seconds each</li>
                <li>Balanced gain levels across all files</li>
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.applySection}>
          <button
            className={styles.btnApplyNow}
            onClick={() => setShowSubmissionForm(true)}
          >
            Apply now
          </button>
        </section>

        {showSubmissionForm && (
          <ContributionForm onClose={() => setShowSubmissionForm(false)} />
        )}
      </main>
    </>
  )
}
