import { useState } from 'react'
import styles from './ContributionForm.module.css'

export default function ContributionForm({ onClose }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    aboutArtist: '',
    link: '',
    location: '',
    file: null
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, file: e.target.files[0] }))
  }

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3))
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1))

  const handleSubmit = (e) => {
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
              Thank you for contributing to Phonosium. Our curators will review 
              your submission and get in touch via the link provided.
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
                  file: null
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
          <span className={styles.stepIndicator}>Step {step} of 3</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '4px' }}>
              {[1, 2, 3].map(s => (
                <div 
                  key={s} 
                  style={{ 
                    width: '20px', 
                    height: '2px', 
                    background: s <= step ? 'var(--orange)' : 'var(--border)' 
                  }} 
                />
              ))}
            </div>
            <button className={styles.closeBtn} onClick={onClose}>×</button>
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
              <h2 className={styles.stepTitle}>Submission</h2>
              <div className={styles.field}>
                <label className={styles.label}>Audio or Logic Files</label>
                <div className={styles.fileInputWrapper}>
                  <input 
                    type="file" 
                    className={styles.fileInput} 
                    onChange={handleFileChange}
                    accept=".wav,.mp3,.pd,.cpp,.zip"
                  />
                  <div className={styles.fileHint}>
                    <strong>Click to upload</strong> or drag and drop<br />
                    WAV, MP3, PD, CPP, or ZIP
                  </div>
                  {formData.file && (
                    <div className={styles.fileName}>
                      Selected: {formData.file.name}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          {step > 1 ? (
            <button type="button" className={`${styles.btn} ${styles.btnPrev}`} onClick={prevStep}>
              Back
            </button>
          ) : <div />}
          
          {step < 3 ? (
            <button type="button" className={`${styles.btn} ${styles.btnNext}`} onClick={nextStep}>
              Next Step
            </button>
          ) : (
            <button type="submit" className={`${styles.btn} ${styles.btnNext}`}>
              Submit Contribution
            </button>
          )}
        </div>
      </form>
    </div>
  </div>
  )
}
