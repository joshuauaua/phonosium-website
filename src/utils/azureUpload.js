const API_BASE_URL = import.meta.env.VITE_AZURE_FUNCTIONS_URL || '/api'

export async function requestUploadUrl(
  fileName,
  fileType,
  fileSize,
  category,
  submissionId
) {
  const response = await fetch(`${API_BASE_URL}/submissions/upload-url`, {
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

    throw new Error(errorMessage)
  }

  return response.json()
}

export async function uploadFileToBlob(file, sasUrl, onProgress) {
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
      reject(new Error('Upload failed: Network error'))
    })

    xhr.addEventListener('abort', () => {
      console.error('Upload XHR aborted')
      reject(new Error('Upload aborted'))
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
        reject(new Error(`Upload failed with status ${xhr.status}: ${xhr.statusText}`))
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
