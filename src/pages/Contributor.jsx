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
          <h2 className={styles.descriptionTitle}>How it Works</h2>
          <p className={styles.descriptionText}>
            Phonosium is a crowdsourced, interactive sound installation built
            from PVC pipes wrapped around a shipping container. We invite sound
            artists, music producers, and audio tinkerers worldwide to shape its
            sonic landscape. Selected works will receive a dedicated, recurring
            live slot on our seasonal schedule.
          </p>

          <div className={styles.howItWorksSection}>
            <h3 className={styles.sectionNumber}>1. The Instrument</h3>
            <ul className={styles.detailList}>
              <li>
                <strong>Inputs:</strong> 3 electret microphones that capture
                live audience interaction and environmental sounds.
              </li>
              <li>
                <strong>Brain:</strong> A Bela IO Microcontroller that processes
                audio and triggers sounds with ultra-low latency.
              </li>
              <li>
                <strong>Outputs:</strong> 4 outdoor speakers that project the
                experience back into the space.
              </li>
            </ul>

            <h3 className={styles.sectionNumber}>2. Submission Structure</h3>
            <p className={styles.descriptionText}>
              Your audio package must consist of:
            </p>
            <ul className={styles.detailList}>
              <li>
                <strong>The Ambient Loop:</strong> A continuous, foundational
                audio bed that sets the mood for your slot.
              </li>
              <li>
                <strong>Interactive Samples (Up to 24):</strong> Individual
                sounds triggered via the microphones when the public interacts
                with the physical structure.
              </li>
            </ul>

            <h3 className={styles.sectionNumber}>3. The Creative Challenge</h3>
            <p className={styles.descriptionText}>
              We are looking for conceptual, intentional pieces. The artistic
              challenge lies in how your 24 interactive samples converse with
              your foundational loop, balancing your compositional design with
              unpredictable, real-world public interaction.
            </p>
          </div>
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
