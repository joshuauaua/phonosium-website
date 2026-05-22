import { useState, useCallback } from 'react'
import styles from './ContributionForm.module.css'
import { uploadFile, submitFormData } from '../utils/azureUpload'

export default function ContributionForm({ onClose }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Artist Info
    artistName: '',
    artistEmail: '',
    links: [{ url: '', type: '' }],
    location: '',
    artistDescription: '',
    // Piece Info
    pieceName: '',
    subtitle: '',
    pieceDescription: '',
    tags: [],
    loopFile: null,
    samplesFiles: [],
    coverImage: null,
    medium: [],
    // Terms
    agreedToTerms: false,
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [uploadProgress, setUploadProgress] = useState({})

  // Predefined options
  const availableTags = [
    'generative',
    'birdsong',
    'algorithm',
    'field recording',
    'spatial audio',
    'industrial',
    'drone',
    'hydrophone',
    'underwater',
    'ambient',
    'feedback',
    'noise',
    'electronics',
    'live',
    'contact mic',
    'ecology',
    'slow listening',
    'nature',
    'radio',
    'archive',
    'west africa',
    'transmission',
  ]

  const availableMediums = [
    'Algorithmic composition',
    'field recording',
    '8-channel spatial audio',
    'Stereo + subwoofer',
    'Live electronics',
    '4-channel audio',
    'Contact microphones',
    'binaural audio',
    'Archival audio',
    'radio transmission',
  ]

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = e => {
    setFormData(prev => ({ ...prev, agreedToTerms: e.target.checked }))
  }

  const handleLinkChange = (index, field, value) => {
    setFormData(prev => {
      const newLinks = [...prev.links]
      newLinks[index] = { ...newLinks[index], [field]: value }
      return { ...prev, links: newLinks }
    })
  }

  const addLink = () => {
    setFormData(prev => ({
      ...prev,
      links: [...prev.links, { url: '', type: '' }],
    }))
  }

  const removeLink = index => {
    setFormData(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index),
    }))
  }

  const toggleTag = tag => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag],
    }))
  }

  const toggleMedium = medium => {
    setFormData(prev => ({
      ...prev,
      medium: prev.medium.includes(medium)
        ? prev.medium.filter(m => m !== medium)
        : [...prev.medium, medium],
    }))
  }

  const handleLoopFileChange = e => {
    const file = e.target.files[0]
    if (file) {
      if (!file.name.endsWith('.wav')) {
        alert('Loop file must be a WAV file')
        return
      }
      if (file.size > 20 * 1024 * 1024) {
        alert('Loop file must be under 20MB')
        return
      }
      setFormData(prev => ({ ...prev, loopFile: file }))
    }
  }

  const handleSamplesChange = e => {
    const files = Array.from(e.target.files)
    const validFiles = files.filter(file => {
      if (
        !file.name.endsWith('.wav') &&
        !file.name.endsWith('.zip') &&
        !file.name.endsWith('.WAV') &&
        !file.name.endsWith('.ZIP')
      ) {
        alert(`${file.name}: Must be WAV or ZIP file`)
        return false
      }
      return true
    })
    setFormData(prev => ({
      ...prev,
      samplesFiles: [...prev.samplesFiles, ...validFiles],
    }))
  }

  const removeSampleFile = index => {
    setFormData(prev => ({
      ...prev,
      samplesFiles: prev.samplesFiles.filter((_, i) => i !== index),
    }))
  }

  const handleCoverImageChange = e => {
    const file = e.target.files[0]
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!validTypes.includes(file.type)) {
        alert('Cover image must be JPG, PNG, or WebP')
        return
      }
      setFormData(prev => ({ ...prev, coverImage: file }))
    }
  }

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3))
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1))

  const handleSubmit = useCallback(
    async e => {
      e.preventDefault()
      setIsSubmitting(true)
      setSubmitError(null)
      setUploadProgress({})

      try {
        let submissionId = null
        const blobReferences = { loop: null, samples: [], cover: null }

        if (formData.loopFile) {
          setUploadProgress(prev => ({ ...prev, loop: 0 }))
          const result = await uploadFile(
            formData.loopFile,
            'audio',
            submissionId,
            progress => setUploadProgress(prev => ({ ...prev, loop: progress }))
          )
          submissionId = result.submissionId
          blobReferences.loop = result.blobName
        }

        for (let i = 0; i < formData.samplesFiles.length; i++) {
          const file = formData.samplesFiles[i]
          const key = `sample-${i}`
          setUploadProgress(prev => ({ ...prev, [key]: 0 }))
          const result = await uploadFile(
            file,
            'audio',
            submissionId,
            progress =>
              setUploadProgress(prev => ({ ...prev, [key]: progress }))
          )
          submissionId = submissionId || result.submissionId
          blobReferences.samples.push(result.blobName)
        }

        if (formData.coverImage) {
          setUploadProgress(prev => ({ ...prev, cover: 0 }))
          const result = await uploadFile(
            formData.coverImage,
            'image',
            submissionId,
            progress =>
              setUploadProgress(prev => ({ ...prev, cover: progress }))
          )
          submissionId = submissionId || result.submissionId
          blobReferences.cover = result.blobName
        }

        await submitFormData(
          {
            submissionId,
            artistName: formData.artistName,
            artistEmail: formData.artistEmail,
            links: formData.links.filter(l => l),
            location: formData.location,
            artistDescription: formData.artistDescription,
            pieceName: formData.pieceName,
            subtitle: formData.subtitle,
            pieceDescription: formData.pieceDescription,
            tags: formData.tags,
            medium: formData.medium,
            agreedToTerms: formData.agreedToTerms,
          },
          blobReferences
        )

        setIsSubmitted(true)
      } catch (error) {
        setSubmitError(
          error.message || 'Something went wrong. Please try again.'
        )
      } finally {
        setIsSubmitting(false)
      }
    },
    [formData]
  )

  if (isSubmitted) {
    return (
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.formWrapper} onClick={e => e.stopPropagation()}>
          <div className={styles.content}>
            <div className={styles.successMessage}>
              <div className={styles.successIcon}>✓</div>
              <h2 className={styles.stepTitle}>Submission Received</h2>
              <p style={{ color: 'var(--ph-stone)' }}>
                Thank you for submitting to Phonosium. Our curators will review
                your work and contact you via email.
              </p>
              <button
                className={`${styles.btn} ${styles.btnNext}`}
                style={{ marginTop: '2rem' }}
                onClick={onClose}
              >
                Close
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
                    width: '16px',
                    height: '2px',
                    background:
                      s <= step ? 'var(--ph-orange)' : 'var(--ph-ink)',
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
                <h2 className={styles.stepTitle}>Artist Information</h2>
                <div className={styles.field}>
                  <label className={styles.label}>Your Name</label>
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
                  <label className={styles.label}>Your Email</label>
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
                  <label className={styles.label}>Links</label>
                  {formData.links.map((link, index) => (
                    <div key={index} className={styles.linkRow}>
                      <input
                        type="url"
                        className={styles.input}
                        placeholder="https://..."
                        value={link.url}
                        onChange={e =>
                          handleLinkChange(index, 'url', e.target.value)
                        }
                      />
                      <select
                        className={styles.linkTypeSelect}
                        value={link.type}
                        onChange={e =>
                          handleLinkChange(index, 'type', e.target.value)
                        }
                        aria-label={`Link type for link ${index + 1}`}
                      >
                        <option value="">Type</option>
                        <option value="Portfolio">Portfolio</option>
                        <option value="Instagram">Instagram</option>
                        <option value="SoundCloud">SoundCloud</option>
                        <option value="Bandcamp">Bandcamp</option>
                        <option value="YouTube">YouTube</option>
                        <option value="Spotify">Spotify</option>
                        <option value="Other">Other</option>
                      </select>
                      {formData.links.length > 1 && (
                        <button
                          type="button"
                          className={styles.btnRemoveLink}
                          onClick={() => removeLink(index)}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className={styles.btnAddLink}
                    onClick={addLink}
                  >
                    + Add Link
                  </button>
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
                <div className={styles.field}>
                  <label className={styles.label}>Artist Description</label>
                  <textarea
                    name="artistDescription"
                    className={styles.textarea}
                    placeholder="Tell us about yourself..."
                    value={formData.artistDescription}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className={styles.stepContent}>
                <h2 className={styles.stepTitle}>Piece Information</h2>
                <div className={styles.field}>
                  <label className={styles.label}>Name of Piece</label>
                  <input
                    type="text"
                    name="pieceName"
                    className={styles.input}
                    placeholder="e.g. Mechanical Echoes"
                    value={formData.pieceName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Subtitle</label>
                  <input
                    type="text"
                    name="subtitle"
                    className={styles.input}
                    placeholder="Optional subtitle"
                    value={formData.subtitle}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Short Description</label>
                  <textarea
                    name="pieceDescription"
                    className={styles.textarea}
                    placeholder="Describe your piece..."
                    value={formData.pieceDescription}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Tags</label>
                  <div className={styles.tagGrid}>
                    {availableTags.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        className={`${styles.tagButton} ${formData.tags.includes(tag) ? styles.tagButtonActive : ''}`}
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>
                    Loop File Input (WAV, max 20MB)
                  </label>
                  <div className={styles.fileInputWrapper}>
                    <input
                      type="file"
                      className={styles.fileInput}
                      onChange={handleLoopFileChange}
                      accept=".wav"
                    />
                    <div className={styles.fileHint}>
                      {formData.loopFile ? (
                        <span style={{ color: 'var(--ph-orange)' }}>
                          Selected: {formData.loopFile.name}
                        </span>
                      ) : (
                        <strong>Upload Loop (WAV)</strong>
                      )}
                    </div>
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>
                    Samples File Input (WAV or ZIP)
                  </label>
                  <div className={styles.fileInputWrapper}>
                    <input
                      type="file"
                      className={styles.fileInput}
                      onChange={handleSamplesChange}
                      multiple
                      accept=".wav,.zip"
                    />
                    <div className={styles.fileHint}>
                      <strong>Add Samples (Multiple)</strong>
                    </div>
                  </div>
                  {formData.samplesFiles.length > 0 && (
                    <div className={styles.fileList}>
                      {formData.samplesFiles.map((file, idx) => (
                        <div key={idx} className={styles.fileListItem}>
                          <span>{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeSampleFile(idx)}
                            className={styles.btnRemoveFile}
                          >
                            remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Image of Piece (Cover)</label>
                  <div className={styles.fileInputWrapper}>
                    <input
                      type="file"
                      className={styles.fileInput}
                      onChange={handleCoverImageChange}
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                    />
                    <div className={styles.fileHint}>
                      {formData.coverImage ? (
                        <span style={{ color: 'var(--ph-orange)' }}>
                          Selected: {formData.coverImage.name}
                        </span>
                      ) : (
                        <strong>Upload Cover Image</strong>
                      )}
                    </div>
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Medium</label>
                  <div className={styles.tagGrid}>
                    {availableMediums.map(medium => (
                      <button
                        key={medium}
                        type="button"
                        className={`${styles.tagButton} ${formData.medium.includes(medium) ? styles.tagButtonActive : ''}`}
                        onClick={() => toggleMedium(medium)}
                      >
                        {medium}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className={styles.stepContent}>
                <h2 className={styles.stepTitle}>Review and Terms</h2>
                <p style={{ color: 'var(--ph-stone)', marginBottom: '2rem' }}>
                  Please review your submission details before submitting.
                </p>
                <div className={styles.reviewBox}>
                  <div className={styles.reviewSection}>
                    <span className={styles.reviewLabel}>Artist</span>
                    <span className={styles.reviewValue}>
                      {formData.artistName || 'Not provided'}
                    </span>
                  </div>
                  <div className={styles.reviewSection}>
                    <span className={styles.reviewLabel}>Email</span>
                    <span className={styles.reviewValue}>
                      {formData.artistEmail || 'Not provided'}
                    </span>
                  </div>
                  {formData.links.filter(l => l.url).length > 0 && (
                    <div className={styles.reviewSection}>
                      <span className={styles.reviewLabel}>Links</span>
                      <span className={styles.reviewValue}>
                        {formData.links
                          .filter(l => l.url)
                          .map(l => `${l.url}${l.type ? ` (${l.type})` : ''}`)
                          .join(', ')}
                      </span>
                    </div>
                  )}
                  {formData.location && (
                    <div className={styles.reviewSection}>
                      <span className={styles.reviewLabel}>Location</span>
                      <span className={styles.reviewValue}>
                        {formData.location}
                      </span>
                    </div>
                  )}
                  <div className={styles.reviewSection}>
                    <span className={styles.reviewLabel}>Piece Name</span>
                    <span className={styles.reviewValue}>
                      {formData.pieceName || 'Not provided'}
                    </span>
                  </div>
                  {formData.subtitle && (
                    <div className={styles.reviewSection}>
                      <span className={styles.reviewLabel}>Subtitle</span>
                      <span className={styles.reviewValue}>
                        {formData.subtitle}
                      </span>
                    </div>
                  )}
                  {formData.tags.length > 0 && (
                    <div className={styles.reviewSection}>
                      <span className={styles.reviewLabel}>Tags</span>
                      <span className={styles.reviewValue}>
                        {formData.tags.join(', ')}
                      </span>
                    </div>
                  )}
                  {formData.medium.length > 0 && (
                    <div className={styles.reviewSection}>
                      <span className={styles.reviewLabel}>Medium</span>
                      <span className={styles.reviewValue}>
                        {formData.medium.join(', ')}
                      </span>
                    </div>
                  )}
                  <div className={styles.reviewSection}>
                    <span className={styles.reviewLabel}>Files</span>
                    <span className={styles.reviewValue}>
                      {formData.loopFile ? '1 Loop, ' : 'No Loop, '}
                      {formData.samplesFiles.length} Sample
                      {formData.samplesFiles.length !== 1 ? 's' : ''},{' '}
                      {formData.coverImage ? '1 Image' : 'No Image'}
                    </span>
                  </div>
                </div>

                <div className={styles.termsBox}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={formData.agreedToTerms}
                      onChange={handleCheckboxChange}
                      className={styles.checkbox}
                    />
                    <span className={styles.termsText}>
                      I agree that by submitting this work, I retain full
                      ownership and rights to my recordings. However, if
                      accepted, the piece will be performed in a public space
                      installation at a scheduled time. I understand that I have
                      the right to withdraw my recordings at any time by
                      contacting the organizers.
                    </span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {submitError && (
            <div className={styles.errorMessage}>{submitError}</div>
          )}

          {isSubmitting && Object.keys(uploadProgress).length > 0 && (
            <div className={styles.progressSection}>
              {uploadProgress.loop !== undefined && (
                <div className={styles.progressItem}>
                  <span>Loop file</span>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${uploadProgress.loop}%` }}
                    />
                  </div>
                </div>
              )}
              {Object.entries(uploadProgress)
                .filter(([key]) => key.startsWith('sample-'))
                .map(([key, progress]) => (
                  <div key={key} className={styles.progressItem}>
                    <span>Sample {parseInt(key.split('-')[1]) + 1}</span>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              {uploadProgress.cover !== undefined && (
                <div className={styles.progressItem}>
                  <span>Cover image</span>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${uploadProgress.cover}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <div className={styles.footer}>
            {step > 1 ? (
              <button
                type="button"
                className={`${styles.btn} ${styles.btnPrev}`}
                onClick={prevStep}
                disabled={isSubmitting}
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
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
                disabled={!formData.agreedToTerms || isSubmitting}
              >
                {isSubmitting ? 'Uploading...' : 'Submit'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
