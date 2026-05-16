import {
  BlobServiceClient,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
  StorageSharedKeyCredential,
} from '@azure/storage-blob'
import { v4 as uuidv4 } from 'uuid'

const CONTAINERS = {
  audio: 'submissions-audio',
  image: 'submissions-images',
}

const ALLOWED_AUDIO_TYPES = [
  'audio/wav',
  'audio/x-wav',
  'audio/wave',
  'application/zip',
  'application/x-zip-compressed',
]
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_AUDIO_SIZE = 20 * 1024 * 1024
const MAX_IMAGE_SIZE = 10 * 1024 * 1024

function sanitizeFileName(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').substring(0, 100)
}

function getCorsHeaders(req) {
  const origin = req.headers.origin || req.headers.referer || ''
  const allowedOrigins = (
    process.env.ALLOWED_ORIGINS || 'http://localhost:5173'
  ).split(',')
  const isAllowed =
    allowedOrigins.includes(origin) || allowedOrigins.includes('*')

  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigins[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

export default async function handler(req, res) {
  const corsHeaders = getCorsHeaders(req)
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value)
  })

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { fileName, fileType, fileSize, category, submissionId } = req.body

    if (!fileName || !fileType || !category) {
      return res.status(400).json({
        error: 'Missing required fields: fileName, fileType, category',
      })
    }

    if (!CONTAINERS[category]) {
      return res.status(400).json({
        error: 'Invalid category. Must be "audio" or "image"',
      })
    }

    const allowedTypes =
      category === 'audio' ? ALLOWED_AUDIO_TYPES : ALLOWED_IMAGE_TYPES
    if (!allowedTypes.includes(fileType)) {
      return res.status(400).json({
        error: `Invalid file type "${fileType}" for category "${category}"`,
      })
    }

    const maxSize = category === 'audio' ? MAX_AUDIO_SIZE : MAX_IMAGE_SIZE
    if (fileSize && fileSize > maxSize) {
      return res.status(400).json({
        error: `File size exceeds maximum of ${maxSize / (1024 * 1024)}MB`,
      })
    }

    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING
    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME
    const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY

    if (!connectionString) {
      console.error('AZURE_STORAGE_CONNECTION_STRING not configured')
      return res.status(500).json({ error: 'Storage not configured' })
    }

    const id = submissionId || uuidv4()
    const safeName = sanitizeFileName(fileName)
    const containerName = CONTAINERS[category]
    const blobName = `${id}/${safeName}`

    const blobServiceClient =
      BlobServiceClient.fromConnectionString(connectionString)
    const containerClient = blobServiceClient.getContainerClient(containerName)
    await containerClient.createIfNotExists()

    let uploadUrl
    if (accountKey && accountName) {
      const credential = new StorageSharedKeyCredential(accountName, accountKey)
      const blockBlobClient = containerClient.getBlockBlobClient(blobName)
      const startsOn = new Date()
      const expiresOn = new Date(startsOn.getTime() + 15 * 60 * 1000)

      const sasToken = generateBlobSASQueryParameters(
        {
          containerName,
          blobName,
          permissions: BlobSASPermissions.parse('cw'),
          startsOn,
          expiresOn,
          contentType: fileType,
        },
        credential,
      ).toString()

      uploadUrl = `${blockBlobClient.url}?${sasToken}`
    } else {
      const blockBlobClient = containerClient.getBlockBlobClient(blobName)
      uploadUrl = blockBlobClient.url
    }

    return res.status(200).json({
      uploadUrl,
      blobName,
      containerName,
      submissionId: id,
    })
  } catch (error) {
    console.error('uploadUrl error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
