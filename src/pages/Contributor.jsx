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
        path="/contributor"
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
          <h2 className={styles.descriptionTitle}>About the Installation</h2>
          <p className={styles.descriptionText}>
            Phonosium is a crowdsourced interactive sound installation where
            visitors can experience a dynamic soundscape built from
            contributions around the world. Each contributor provides audio
            loops and samples that are played through our 6-speaker system,
            creating a unique sonic environment shaped by the community.
          </p>
          <p className={styles.descriptionText}>
            Your submission becomes part of the living installation, triggered
            and layered with other contributions to form an ever-evolving
            composition. This is an opportunity to share your sonic perspective
            and contribute to a collective auditory experience.
          </p>
        </section>

        <section className={styles.criteria}>
          <h2 className={styles.criteriaTitle}>Submission Requirements</h2>
          <ul className={styles.criteriaList}>
            <li>
              One loop (max 20 MB) — 44.1 kHz · 16-bit · saved as loop.wav
            </li>
            <li>Up to 24 samples (1–6 seconds each) — balanced gain levels</li>
            <li>
              Demo audio: your loop with triggered samples (uploaded to
              Phonosium Soundcloud)
            </li>
            <li>Cover image for your piece</li>
            <li>Title and description of your piece</li>
            <li>Links to your work</li>
          </ul>
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
