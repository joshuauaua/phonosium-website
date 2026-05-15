import { useState } from 'react'
import styles from './ContributionForm.module.css'

export default function ContributionForm({ onClose }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    artistName: '',
    artistEmail: '',
    loopAudio: null,
    samples: [],
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleLoopAudioChange = e => {
    setFormData(prev => ({ ...prev, loopAudio: e.target.files[0] }))
  }

  const handleSamplesChange = e => {
    const files = Array.from(e.target.files)
    setFormData(prev => ({ ...prev, samples: [...prev.samples, ...files] }))
  }

  const removeSample = index => {
    setFormData(prev => ({
      ...prev,
      samples: prev.samples.filter((_, i) => i !== index),
    }))
  }

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4))
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1))

  const handleSubmit = e => {
    e.preventDefault()
    // In a real app, you'd send this to an API
    console.log('Form submitted:', formData)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.formWrapper} onClick={e => e.stopPropagation()}>
          <div className={styles.content}>
            <div className={styles.successMessage}>
              <div className={styles.successIcon}>✓</div>
              <h2 className={styles.stepTitle}>Contribution Received</h2>
              <p style={{ color: 'var(--white-muted)' }}>
                Thank you for contributing to Phonosium. Our curators will
                review your submission and get in touch via the link provided.
              </p>
              <button
                className={`${styles.btn} ${styles.btnNext}`}
                style={{ marginTop: '2rem' }}
                onClick={() => {
                  setIsSubmitted(false)
                  setStep(1)
                  setFormData({
                    title: '',
                    description: '',
                    aboutArtist: '',
                    link: '',
                    location: '',
                    artistName: '',
                    artistEmail: '',
                    loopAudio: null,
                    samples: [],
                  })
                }}
              >
                Submit Another
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.formWrapper} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <span className={styles.stepIndicator}>Step {step} of 4</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '4px' }}>
              {[1, 2, 3, 4].map(s => (
                <div
                  key={s}
                  style={{
                    width: '16px',
                    height: '2px',
                    background: s <= step ? 'var(--orange)' : 'var(--border)',
                  }}
                />
              ))}
            </div>
            <button className={styles.closeBtn} onClick={onClose}>
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.content}>
            {step === 1 && (
              <div className={styles.stepContent}>
                <h2 className={styles.stepTitle}>The Piece</h2>
                <div className={styles.field}>
                  <label className={styles.label}>Title of Piece</label>
                  <input
                    type="text"
                    name="title"
                    className={styles.input}
                    placeholder="e.g. Mechanical Echoes"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Description</label>
                  <textarea
                    name="description"
                    className={styles.textarea}
                    placeholder="Tell us about the sonic concept..."
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className={styles.stepContent}>
                <h2 className={styles.stepTitle}>The Artist</h2>
                <div className={styles.field}>
                  <label className={styles.label}>Full Name</label>
                  <input
                    type="text"
                    name="artistName"
                    className={styles.input}
                    placeholder="Your name or alias"
                    value={formData.artistName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Contact Email</label>
                  <input
                    type="email"
                    name="artistEmail"
                    className={styles.input}
                    placeholder="email@example.com"
                    value={formData.artistEmail}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>About Artist</label>
                  <textarea
                    name="aboutArtist"
                    className={styles.textarea}
                    placeholder="Brief biography..."
                    value={formData.aboutArtist}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>External Link</label>
                  <input
                    type="url"
                    name="link"
                    className={styles.input}
                    placeholder="Portfolio, SoundCloud, or GitHub"
                    value={formData.link}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Location</label>
                  <input
                    type="text"
                    name="location"
                    className={styles.input}
                    placeholder="City, Country"
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className={styles.stepContent}>
                <h2 className={styles.stepTitle}>Audio Assets</h2>

                <div className={styles.field}>
                  <label className={styles.label}>Main Loop Audio</label>
                  <div
                    className={styles.fileInputWrapper}
                    style={{ padding: '1.5rem' }}
                  >
                    <input
                      type="file"
                      className={styles.fileInput}
                      onChange={handleLoopAudioChange}
                      accept=".wav,.mp3"
                    />
                    <div className={styles.fileHint}>
                      {formData.loopAudio ? (
                        <span style={{ color: 'var(--orange)' }}>
                          Selected: {formData.loopAudio.name}
                        </span>
                      ) : (
                        <>
                          <strong>Upload Loop</strong> (WAV/MP3)
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Additional Samples</label>
                  <div
                    className={styles.fileInputWrapper}
                    style={{ padding: '1.5rem' }}
                  >
                    <input
                      type="file"
                      className={styles.fileInput}
                      onChange={handleSamplesChange}
                      multiple
                      accept=".wav,.mp3"
                    />
                    <div className={styles.fileHint}>
                      <strong>Add Samples</strong> (Multiple)
                    </div>
                  </div>

                  {formData.samples.length > 0 && (
                    <div
                      style={{
                        marginTop: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}
                    >
                      {formData.samples.map((file, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '0.8rem',
                            background: 'rgba(255,255,255,0.03)',
                            padding: '6px 10px',
                            borderRadius: '4px',
                          }}
                        >
                          <span style={{ color: 'var(--white-dim)' }}>
                            {file.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeSample(idx)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--orange)',
                              cursor: 'pointer',
                            }}
                          >
                            remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className={styles.stepContent}>
                <h2 className={styles.stepTitle}>Finalize</h2>
                <p
                  style={{ color: 'var(--white-muted)', marginBottom: '2rem' }}
                >
                  Please review your submission details. By clicking submit,
                  your work will be sent to the Phonosium collective for review.
                </p>
                <div
                  style={{
                    background: 'rgba(0,0,0,0.2)',
                    padding: '1.5rem',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                  }}
                >
                  <div style={{ marginBottom: '1rem' }}>
                    <span
                      style={{
                        color: 'var(--orange)',
                        fontSize: '0.7rem',
                        display: 'block',
                        textTransform: 'uppercase',
                      }}
                    >
                      Piece
                    </span>
                    <span style={{ color: 'var(--white)' }}>
                      {formData.title || 'Untitled'}
                    </span>
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <span
                      style={{
                        color: 'var(--orange)',
                        fontSize: '0.7rem',
                        display: 'block',
                        textTransform: 'uppercase',
                      }}
                    >
                      Artist
                    </span>
                    <span style={{ color: 'var(--white)' }}>
                      {formData.artistName || 'Anonymous'} (
                      {formData.location || 'Unknown Location'})
                    </span>
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <span
                      style={{
                        color: 'var(--orange)',
                        fontSize: '0.7rem',
                        display: 'block',
                        textTransform: 'uppercase',
                      }}
                    >
                      Contact
                    </span>
                    <span style={{ color: 'var(--white)' }}>
                      {formData.artistEmail || 'No email provided'}
                    </span>
                  </div>
                  <div>
                    <span
                      style={{
                        color: 'var(--orange)',
                        fontSize: '0.7rem',
                        display: 'block',
                        textTransform: 'uppercase',
                      }}
                    >
                      Assets
                    </span>
                    <span style={{ color: 'var(--white)' }}>
                      {formData.loopAudio ? '1 Loop' : 'No Loop'},{' '}
                      {formData.samples.length} Samples
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={styles.footer}>
            {step > 1 ? (
              <button
                type="button"
                className={`${styles.btn} ${styles.btnPrev}`}
                onClick={prevStep}
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                className={`${styles.btn} ${styles.btnNext}`}
                onClick={nextStep}
              >
                Next Step
              </button>
            ) : (
              <button
                type="submit"
                className={`${styles.btn} ${styles.btnNext}`}
              >
                Submit Contribution
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
