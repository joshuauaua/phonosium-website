const API_BASE_URL = import.meta.env.VITE_AZURE_FUNCTIONS_URL || '/api'

/**
 * Parse and validate retry configuration from environment variables
 * @internal Exported for testing only
 */
export function parseRetryConfig() {
  const maxRetries = parseInt(
    import.meta.env.VITE_UPLOAD_MAX_RETRIES || '3',
    10
  )
  const baseDelay = parseInt(
    import.meta.env.VITE_UPLOAD_BASE_DELAY || '1000',
    10
  )
  const maxDelay = parseInt(
    import.meta.env.VITE_UPLOAD_MAX_DELAY || '10000',
    10
  )

  // Validate ranges
  if (maxRetries < 0 || maxRetries > 10) {
    console.warn(
      `Invalid VITE_UPLOAD_MAX_RETRIES (${maxRetries}), using default: 3`
    )
    return { maxRetries: 3, baseDelay, maxDelay }
  }
  if (baseDelay < 100 || baseDelay > 60000) {
    console.warn(
      `Invalid VITE_UPLOAD_BASE_DELAY (${baseDelay}), using default: 1000`
    )
    return { maxRetries, baseDelay: 1000, maxDelay }
  }
  if (maxDelay < baseDelay || maxDelay > 300000) {
    console.warn(
      `Invalid VITE_UPLOAD_MAX_DELAY (${maxDelay}), using default: 10000`
    )
    return { maxRetries, baseDelay, maxDelay: 10000 }
  }

  return { maxRetries, baseDelay, maxDelay }
}

/**
 * Retry configuration for network operations
 */
const RETRY_CONFIG = parseRetryConfig()

/**
 * Check if an error is retryable
 */
function isRetryableError(error, statusCode) {
  // Network errors (no status code)
  if (!statusCode) return true

  // 5xx server errors
  if (statusCode >= 500 && statusCode < 600) return true

  // 429 rate limiting
  if (statusCode === 429) return true

  // 4xx client errors are not retryable
  return false
}

/**
 * Calculate exponential backoff delay with randomized jitter
 * Jitter adds ±20% variance to prevent thundering herd problems
 */
function getBackoffDelay(attemptNumber) {
  const baseDelay = RETRY_CONFIG.baseDelay * Math.pow(2, attemptNumber)
  // Apply jitter: random factor between 0.8 and 1.2 (±20%)
  const jitter = 0.8 + Math.random() * 0.4
  const delayWithJitter = baseDelay * jitter
  return Math.min(delayWithJitter, RETRY_CONFIG.maxDelay)
}

/**
 * Utility function to retry an async operation with exponential backoff
 */
async function withRetry(operation, operationName = 'operation') {
  let lastError

  for (let attempt = 0; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
    try {
      const result = await operation()
      if (attempt > 0) {
        console.log(
          `${operationName} succeeded on attempt ${attempt + 1}/${RETRY_CONFIG.maxRetries + 1}`
        )
      }
      return result
    } catch (error) {
      lastError = error
      const statusCode = error.statusCode || error.status

      // Check if we should retry
      if (
        attempt < RETRY_CONFIG.maxRetries &&
        isRetryableError(error, statusCode)
      ) {
        const delay = getBackoffDelay(attempt)
        console.warn(
          `${operationName} failed (attempt ${attempt + 1}/${RETRY_CONFIG.maxRetries + 1}):`,
          error.message,
          `- Retrying in ${delay}ms...`
        )
        await new Promise(resolve => setTimeout(resolve, delay))
      } else {
        // Either exhausted retries or non-retryable error
        if (isRetryableError(error, statusCode)) {
          console.error(
            `${operationName} failed after ${RETRY_CONFIG.maxRetries + 1} attempts:`,
            error.message
          )
          throw new Error(
            `${operationName} failed after ${RETRY_CONFIG.maxRetries + 1} attempts: ${error.message}`
          )
        } else {
          console.error(
            `${operationName} failed with non-retryable error:`,
            error.message
          )
          throw error
        }
      }
    }
  }

  throw lastError
}

export async function requestUploadUrl(
  fileName,
  fileType,
  fileSize,
  category,
  submissionId
) {
  return withRetry(async () => {
    let response
    try {
      response = await fetch(`${API_BASE_URL}/submissions/upload-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName,
          fileType,
          fileSize,
          category,
          submissionId,
        }),
      })
    } catch (networkError) {
      // Network error (no response received)
      const error = new Error(`Network error: ${networkError.message}`)
      error.statusCode = null
      throw error
    }

    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage = `Upload URL request failed: ${response.status}`

      try {
        const error = JSON.parse(errorText)
        errorMessage = error.error || errorMessage
      } catch {
        // If not JSON, use the text or status
        errorMessage = errorText || errorMessage
      }

      console.error('requestUploadUrl failed:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      })

      const error = new Error(errorMessage)
      error.statusCode = response.status
      throw error
    }

    return response.json()
  }, 'Upload URL request')
}

export async function uploadFileToBlob(file, sasUrl, onProgress) {
  return withRetry(async () => {
    // Reset progress to 0 on each retry attempt
    if (onProgress) {
      onProgress(0)
    }

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      xhr.upload.addEventListener('progress', event => {
        if (event.lengthComputable && onProgress) {
          onProgress(Math.round((event.loaded / event.total) * 100))
        }
      })

      xhr.addEventListener('error', () => {
        console.error('Upload XHR error:', {
          status: xhr.status,
          statusText: xhr.statusText,
          responseText: xhr.responseText,
        })
        const error = new Error('Upload failed: Network error')
        error.statusCode = null
        reject(error)
      })

      xhr.addEventListener('abort', () => {
        console.error('Upload XHR aborted')
        const error = new Error('Upload aborted')
        error.statusCode = null
        reject(error)
      })

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve()
        } else {
          console.error('Upload XHR failed:', {
            status: xhr.status,
            statusText: xhr.statusText,
            responseText: xhr.responseText,
          })
          const error = new Error(
            `Upload failed with status ${xhr.status}: ${xhr.statusText}`
          )
          error.statusCode = xhr.status
          reject(error)
        }
      })

      xhr.open('PUT', sasUrl)
      xhr.setRequestHeader('x-ms-blob-type', 'BlockBlob')
      xhr.setRequestHeader(
        'Content-Type',
        file.type || 'application/octet-stream'
      )
      xhr.send(file)
    })
  }, 'Blob upload')
}

export async function uploadFile(file, category, submissionId, onProgress) {
  const {
    uploadUrl,
    blobName,
    submissionId: id,
  } = await requestUploadUrl(
    file.name,
    file.type,
    file.size,
    category,
    submissionId
  )

  await uploadFileToBlob(file, uploadUrl, onProgress)

  return { blobName, submissionId: id }
}

export async function submitFormData(formData, blobReferences) {
  const response = await fetch(`${API_BASE_URL}/submissions/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...formData,
      blobReferences,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    let errorMessage = `Submission failed: ${response.status}`

    try {
      const error = JSON.parse(errorText)
      errorMessage = error.error || errorMessage
    } catch {
      errorMessage = errorText || errorMessage
    }

    console.error('submitFormData failed:', {
      status: response.status,
      statusText: response.statusText,
      body: errorText,
    })

    throw new Error(errorMessage)
  }

  return response.json()
}
