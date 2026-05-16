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
    const error = await response.json().catch(() => ({}))
    throw new Error(
      error.error || `Upload URL request failed: ${response.status}`
    )
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

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve()
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`))
      }
    })

    xhr.addEventListener('error', () => reject(new Error('Upload failed')))
    xhr.addEventListener('abort', () => reject(new Error('Upload aborted')))

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
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error || `Submission failed: ${response.status}`)
  }

  return response.json()
}
