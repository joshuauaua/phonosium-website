import { useState } from 'react'
import SEO from '../components/SEO'
import styles from './Contributor.module.css'
import ContributionForm from '../components/ContributionForm'
import ExpandableSection from '../components/ExpandableSection'

export default function Contributor() {
  const [showSubmissionForm, setShowSubmissionForm] = useState(false)

  return (
    <>
      <SEO
        title="Call for Submissions"
        description="Submit your sound to Phonosium. We are accepting submissions for the installation from anywhere in the world on an ongoing basis."
        path="/contribute"
      />
      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.title}>Call for Submissions</h1>
          <p className={styles.subtitle}>
            We are accepting submissions for the installation from anywhere in
            the world on an ongoing basis
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
            from PVC pipes wrapped around a shipping container. As a brain, it
            has the Bela IO Microcontroller to process audio, playing a
            continuous loop while triggering samples on demand by public
            interaction. We invite sound artists, music producers, and audio
            tinkerers worldwide to shape its sonic landscape. Selected works
            will receive a dedicated, recurring live slot on our seasonal
            schedule.
          </p>

          <div className={styles.howItWorksSection}>
            <ExpandableSection number={1} title="The Installation">
              <ul className={styles.detailList}>
                <li>
                  <strong>Inputs:</strong> 3 electret microphones that capture
                  live audience interaction and environmental sounds.
                </li>
                <li>
                  <strong>Brain:</strong> A Bela IO Microcontroller that
                  processes audio and triggers sounds with ultra-low latency.
                </li>
                <li>
                  <strong>Outputs:</strong> 4 outdoor speakers that project the
                  experience back into the space.
                </li>
              </ul>
            </ExpandableSection>

            <ExpandableSection number={2} title="The Submission">
              <p className={styles.descriptionText}>
                Your submission must consist of:
              </p>
              <ul className={styles.detailList}>
                <li>
                  <strong>An Ambient Loop:</strong> A continuous, foundational
                  loop that will continuously loop from the beginning to the end
                  of your slot
                </li>
                <li>
                  <strong>Interactive Sample Bank:</strong> Up to 24 individual
                  sounds that get triggered when the public interacts with the
                  physical structure. 1-6 seconds each.
                </li>
              </ul>
            </ExpandableSection>

            <ExpandableSection number={3} title="The Creative Challenge">
              <p className={styles.descriptionText}>
                We are looking for conceptual, intentional pieces. The artistic
                challenge lies in how your interactive samples converse with
                your foundational loop, balancing your compositional design with
                unpredictable, real-world public interaction.
              </p>
            </ExpandableSection>
          </div>
        </section>

        <section className={styles.requirementsContainer}>
          <div className={styles.requirementsGrid}>
            <div className={styles.requirementCard}>
              <h2 className={styles.cardTitle}>What to Submit</h2>
              <ul className={styles.cardList}>
                <li>Title and description</li>
                <li>Cover image for your piece</li>
                <li>Loop file (loop.wav)</li>
                <li>Sample files (up to 24 allowed)</li>
                <li>
                  Demo audio: Please provide a recording that demonstrates how
                  your piece sounds, including both the loop layer and the top
                  samples. This will be uploaded to our SoundCloud.
                </li>
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
