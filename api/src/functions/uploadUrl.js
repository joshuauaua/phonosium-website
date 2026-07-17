import { app } from '@azure/functions'
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

function getCorsHeaders(request) {
  const origin = request.headers.get('origin') || ''
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

export async function uploadUrlHandler(request, context) {
  const corsHeaders = getCorsHeaders(request)

  if (request.method === 'OPTIONS') {
    return { status: 204, headers: corsHeaders }
  }

  try {
    const body = await request.json()
    const { fileName, fileType, fileSize, category, submissionId } = body

    if (!fileName || !fileType || !category) {
      return {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'Missing required fields: fileName, fileType, category',
        }),
      }
    }

    if (!CONTAINERS[category]) {
      return {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'Invalid category. Must be "audio" or "image"',
        }),
      }
    }

    const allowedTypes =
      category === 'audio' ? ALLOWED_AUDIO_TYPES : ALLOWED_IMAGE_TYPES
    if (!allowedTypes.includes(fileType)) {
      return {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: `Invalid file type "${fileType}" for category "${category}"`,
        }),
      }
    }

    const maxSize = category === 'audio' ? MAX_AUDIO_SIZE : MAX_IMAGE_SIZE
    if (fileSize && fileSize > maxSize) {
      return {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: `File size exceeds maximum of ${maxSize / (1024 * 1024)}MB`,
        }),
      }
    }

    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING
    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME
    const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY

    if (!connectionString) {
      context.error('AZURE_STORAGE_CONNECTION_STRING not configured')
      return {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Storage not configured' }),
      }
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
        credential
      ).toString()

      uploadUrl = `${blockBlobClient.url}?${sasToken}`
    } else {
      const blockBlobClient = containerClient.getBlockBlobClient(blobName)
      uploadUrl = blockBlobClient.url
    }

    return {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uploadUrl,
        blobName,
        containerName,
        submissionId: id,
      }),
    }
  } catch (error) {
    context.error('uploadUrl error:', error)
    return {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error' }),
    }
  }
}

app.http('uploadUrl', {
  methods: ['POST', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'submissions/upload-url',
  handler: uploadUrlHandler,
})
