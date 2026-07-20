import { useState, useCallback, useRef, useEffect } from 'react'
import styles from './ContributionForm.module.css'
import { uploadFile, submitFormData } from '../utils/azureUpload'
import Toast from './Toast'

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
    // Terms
    agreedToTerms: false,
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [uploadProgress, setUploadProgress] = useState({})
  const [retryNotifications, setRetryNotifications] = useState({})
  const [fieldErrors, setFieldErrors] = useState({})
  const [isExiting, setIsExiting] = useState(false)
  const [customTagInput, setCustomTagInput] = useState('')

  const step1Ref = useRef(null)
  const step2Ref = useRef(null)
  const step3Ref = useRef(null)
  const closeTimeoutRef = useRef(null)

  useEffect(() => {
    if (step === 1 && step1Ref.current) {
      step1Ref.current.focus()
    } else if (step === 2 && step2Ref.current) {
      step2Ref.current.focus()
    } else if (step === 3 && step3Ref.current) {
      step3Ref.current.focus()
    }
  }, [step])

  const handleClose = useCallback(() => {
    setIsExiting(true)
    closeTimeoutRef.current = setTimeout(() => {
      onClose()
    }, 200)
  }, [onClose])

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
      }
    }
  }, [])

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

  const validateEmail = email => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const validateStep = currentStep => {
    const errors = {}

    if (currentStep === 1) {
      if (!formData.artistName.trim()) {
        errors.artistName = 'Artist name is required'
      }
      if (!formData.artistEmail.trim()) {
        errors.artistEmail = 'Email is required'
      } else if (!validateEmail(formData.artistEmail)) {
        errors.artistEmail = 'Please enter a valid email address'
      }
    }

    if (currentStep === 2) {
      if (!formData.pieceName.trim()) {
        errors.pieceName = 'Piece name is required'
      }
      if (!formData.pieceDescription.trim()) {
        errors.pieceDescription = 'Piece description is required'
      }
    }

    return errors
  }

  const formatFileSize = bytes => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleEmailBlur = () => {
    if (formData.artistEmail && !validateEmail(formData.artistEmail)) {
      setFieldErrors(prev => ({
        ...prev,
        artistEmail: 'Please enter a valid email address',
      }))
    } else if (fieldErrors.artistEmail) {
      setFieldErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.artistEmail
        return newErrors
      })
    }
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

  const handleCustomTagInputChange = e => {
    setCustomTagInput(e.target.value)
  }

  const addCustomTag = () => {
    const trimmedTag = customTagInput.trim().toLowerCase()

    if (!trimmedTag) {
      return
    }

    // Check for duplicates (case-insensitive)
    if (formData.tags.some(tag => tag.toLowerCase() === trimmedTag)) {
      setCustomTagInput('')
      return
    }

    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, trimmedTag],
    }))
    setCustomTagInput('')
  }

  const handleCustomTagKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addCustomTag()
    }
  }

  const handleLoopFileChange = e => {
    const file = e.target.files[0]
    if (file) {
      if (!file.name.endsWith('.wav')) {
        setFieldErrors(prev => ({
          ...prev,
          loopFile: 'Loop file must be a WAV file',
        }))
        return
      }
      if (file.size > 20 * 1024 * 1024) {
        setFieldErrors(prev => ({
          ...prev,
          loopFile: `Loop file must be under 20MB (current: ${formatFileSize(file.size)})`,
        }))
        return
      }
      setFieldErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.loopFile
        return newErrors
      })
      setFormData(prev => ({ ...prev, loopFile: file }))
    }
  }

  const handleSamplesChange = e => {
    const files = Array.from(e.target.files)
    const invalidFiles = []
    const validFiles = files.filter(file => {
      if (
        !file.name.endsWith('.wav') &&
        !file.name.endsWith('.zip') &&
        !file.name.endsWith('.WAV') &&
        !file.name.endsWith('.ZIP')
      ) {
        invalidFiles.push(file.name)
        return false
      }
      return true
    })

    if (invalidFiles.length > 0) {
      setFieldErrors(prev => ({
        ...prev,
        samplesFiles: `Invalid file type: ${invalidFiles.join(', ')}. Must be WAV or ZIP files.`,
      }))
    } else if (fieldErrors.samplesFiles) {
      setFieldErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.samplesFiles
        return newErrors
      })
    }

    if (validFiles.length > 0) {
      setFormData(prev => ({
        ...prev,
        samplesFiles: [...prev.samplesFiles, ...validFiles],
      }))
    }
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
        setFieldErrors(prev => ({
          ...prev,
          coverImage: 'Cover image must be JPG, PNG, or WebP',
        }))
        return
      }
      setFieldErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.coverImage
        return newErrors
      })
      setFormData(prev => ({ ...prev, coverImage: file }))
    }
  }

  const nextStep = () => {
    const errors = validateStep(step)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    setFieldErrors({})
    setStep(prev => Math.min(prev + 1, 3))
  }
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1))

  const handleSubmit = useCallback(
    async e => {
      e.preventDefault()
      setIsSubmitting(true)
      setSubmitError(null)
      setUploadProgress({})
      setRetryNotifications({})

      const createRetryHandler = fileKey => retryInfo => {
        const { attempt, maxAttempts, delay, error } = retryInfo
        setRetryNotifications(prev => ({
          ...prev,
          [fileKey]: {
            message: `Upload retry ${attempt} of ${maxAttempts} - Retrying in ${Math.round(delay / 1000)}s...`,
            description: error,
            type: attempt > 2 ? 'warning' : 'info',
            timestamp: Date.now(),
          },
        }))
      }

      const createRetrySuccessHandler = fileKey => () => {
        setRetryNotifications(prev => ({
          ...prev,
          [fileKey]: {
            message: 'Upload succeeded after retry',
            description: null,
            type: 'success',
            timestamp: Date.now(),
          },
        }))
        setTimeout(() => {
          setRetryNotifications(prev => {
            const next = { ...prev }
            delete next[fileKey]
            return next
          })
        }, 2000)
      }

      try {
        let submissionId = null
        const blobReferences = { loop: null, samples: [], cover: null }

        if (formData.loopFile) {
          setUploadProgress(prev => ({ ...prev, loop: 0 }))
          const result = await uploadFile(
            formData.loopFile,
            'audio',
            submissionId,
            progress =>
              setUploadProgress(prev => ({ ...prev, loop: progress })),
            createRetryHandler('loop'),
            createRetrySuccessHandler('loop')
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
              setUploadProgress(prev => ({ ...prev, [key]: progress })),
            createRetryHandler(key),
            createRetrySuccessHandler(key)
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
              setUploadProgress(prev => ({ ...prev, cover: progress })),
            createRetryHandler('cover'),
            createRetrySuccessHandler('cover')
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
            agreedToTerms: formData.agreedToTerms,
          },
          blobReferences
        )

        setIsSubmitted(true)
        setRetryNotifications({})
      } catch (error) {
        setSubmitError(
          error.message || 'Something went wrong. Please try again.'
        )
        setRetryNotifications({})
      } finally {
        setIsSubmitting(false)
      }
    },
    [formData]
  )

  if (isSubmitted) {
    return (
      <div
        className={`${styles.overlay} ${isExiting ? styles.overlayExit : ''}`}
        onClick={handleClose}
      >
        <div
          className={`${styles.formWrapper} ${isExiting ? styles.formWrapperExit : ''}`}
          onClick={e => e.stopPropagation()}
        >
          <div className={styles.content}>
            <div className={styles.successMessage}>
              <div className={styles.successIcon}>✓</div>
              <h2 className={styles.stepTitle}>Submission Received</h2>
              <p style={{ color: 'var(--ph-stone-dark)' }}>
                Thank you for submitting to Phonosium. Our curators will review
                your work and contact you via email.
              </p>
              <button
                className={`${styles.btn} ${styles.btnNext}`}
                style={{ marginTop: '2rem' }}
                onClick={handleClose}
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
    <div
      className={`${styles.overlay} ${isExiting ? styles.overlayExit : ''}`}
      onClick={handleClose}
    >
      <div
        className={`${styles.formWrapper} ${isExiting ? styles.formWrapperExit : ''}`}
        onClick={e => e.stopPropagation()}
      >
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
            <button className={styles.closeBtn} onClick={handleClose}>
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.content}>
            {step === 1 && (
              <div className={styles.stepContent}>
                <h2 className={styles.stepTitle} ref={step1Ref} tabIndex={-1}>
                  Artist Information
                </h2>
                <div className={styles.field}>
                  <label className={styles.label}>
                    Your Name{' '}
                    <span style={{ color: 'var(--ph-orange)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="artistName"
                    className={`${styles.input} ${fieldErrors.artistName ? styles.error : ''}`}
                    placeholder="Your name or alias"
                    value={formData.artistName}
                    onChange={handleInputChange}
                    required
                  />
                  {fieldErrors.artistName && (
                    <div className={styles.fieldError}>
                      {fieldErrors.artistName}
                    </div>
                  )}
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>
                    Your Email{' '}
                    <span style={{ color: 'var(--ph-orange)' }}>*</span>
                  </label>
                  <input
                    type="email"
                    name="artistEmail"
                    className={`${styles.input} ${fieldErrors.artistEmail ? styles.error : ''}`}
                    placeholder="email@example.com"
                    value={formData.artistEmail}
                    onChange={handleInputChange}
                    onBlur={handleEmailBlur}
                    required
                  />
                  {fieldErrors.artistEmail && (
                    <div className={styles.fieldError}>
                      {fieldErrors.artistEmail}
                    </div>
                  )}
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
                <h2 className={styles.stepTitle} ref={step2Ref} tabIndex={-1}>
                  Piece Information
                </h2>
                <div className={styles.field}>
                  <label className={styles.label}>
                    Name of Piece{' '}
                    <span style={{ color: 'var(--ph-orange)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="pieceName"
                    className={`${styles.input} ${fieldErrors.pieceName ? styles.error : ''}`}
                    placeholder="e.g. Mechanical Echoes"
                    value={formData.pieceName}
                    onChange={handleInputChange}
                    required
                  />
                  {fieldErrors.pieceName && (
                    <div className={styles.fieldError}>
                      {fieldErrors.pieceName}
                    </div>
                  )}
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
                  <label className={styles.label}>
                    Short Description{' '}
                    <span style={{ color: 'var(--ph-orange)' }}>*</span>
                  </label>
                  <textarea
                    name="pieceDescription"
                    className={`${styles.textarea} ${fieldErrors.pieceDescription ? styles.error : ''}`}
                    placeholder="Describe your piece..."
                    value={formData.pieceDescription}
                    onChange={handleInputChange}
                    required
                  />
                  {fieldErrors.pieceDescription && (
                    <div className={styles.fieldError}>
                      {fieldErrors.pieceDescription}
                    </div>
                  )}
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
                    {formData.tags
                      .filter(tag => !availableTags.includes(tag))
                      .map(tag => (
                        <button
                          key={tag}
                          type="button"
                          className={`${styles.tagButton} ${styles.tagButtonCustom} ${styles.tagButtonActive}`}
                          onClick={() => toggleTag(tag)}
                        >
                          {tag}
                        </button>
                      ))}
                  </div>
                  <div className={styles.customTagInputWrapper}>
                    <input
                      type="text"
                      className={styles.customTagInput}
                      placeholder="Type custom tag and press Enter"
                      value={customTagInput}
                      onChange={handleCustomTagInputChange}
                      onKeyDown={handleCustomTagKeyDown}
                    />
                    <button
                      type="button"
                      className={styles.btnAddCustomTag}
                      onClick={addCustomTag}
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>
                    Loop File Input (WAV, max 20MB)
                  </label>
                  <div
                    className={`${styles.fileInputWrapper} ${fieldErrors.loopFile ? styles.error : ''}`}
                  >
                    <input
                      type="file"
                      className={styles.fileInput}
                      onChange={handleLoopFileChange}
                      accept=".wav"
                    />
                    <div className={styles.fileHint}>
                      {formData.loopFile ? (
                        <span style={{ color: 'var(--ph-orange)' }}>
                          Selected: {formData.loopFile.name} (
                          {formatFileSize(formData.loopFile.size)})
                        </span>
                      ) : (
                        <strong>Upload Loop (WAV)</strong>
                      )}
                    </div>
                  </div>
                  {fieldErrors.loopFile && (
                    <div className={styles.fieldError}>
                      {fieldErrors.loopFile}
                    </div>
                  )}
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>
                    Samples File Input (WAV or ZIP)
                  </label>
                  <div
                    className={`${styles.fileInputWrapper} ${fieldErrors.samplesFiles ? styles.error : ''}`}
                  >
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
                  {fieldErrors.samplesFiles && (
                    <div className={styles.fieldError}>
                      {fieldErrors.samplesFiles}
                    </div>
                  )}
                  {formData.samplesFiles.length > 0 && (
                    <div className={styles.fileList}>
                      {formData.samplesFiles.map((file, idx) => (
                        <div key={idx} className={styles.fileListItem}>
                          <span>
                            {file.name} ({formatFileSize(file.size)})
                          </span>
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
                  <div
                    className={`${styles.fileInputWrapper} ${fieldErrors.coverImage ? styles.error : ''}`}
                  >
                    <input
                      type="file"
                      className={styles.fileInput}
                      onChange={handleCoverImageChange}
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                    />
                    <div className={styles.fileHint}>
                      {formData.coverImage ? (
                        <span style={{ color: 'var(--ph-orange)' }}>
                          Selected: {formData.coverImage.name} (
                          {formatFileSize(formData.coverImage.size)})
                        </span>
                      ) : (
                        <strong>Upload Cover Image</strong>
                      )}
                    </div>
                  </div>
                  {fieldErrors.coverImage && (
                    <div className={styles.fieldError}>
                      {fieldErrors.coverImage}
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className={styles.stepContent}>
                <h2 className={styles.stepTitle} ref={step3Ref} tabIndex={-1}>
                  Review and Terms
                </h2>
                <p
                  style={{
                    color: 'var(--ph-stone-dark)',
                    marginBottom: '2rem',
                  }}
                >
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
                      style={{
                        transform: `scaleX(${uploadProgress.loop / 100})`,
                      }}
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
                        style={{ transform: `scaleX(${progress / 100})` }}
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
                      style={{
                        transform: `scaleX(${uploadProgress.cover / 100})`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {Object.entries(retryNotifications).map(([key, notification]) => (
            <Toast
              key={key}
              message={notification.message}
              description={notification.description}
              type={notification.type}
              onDismiss={() => {
                setRetryNotifications(prev => {
                  const next = { ...prev }
                  delete next[key]
                  return next
                })
              }}
            />
          ))}

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
