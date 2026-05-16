import { BlobServiceClient } from '@azure/storage-blob'
import { v4 as uuidv4 } from 'uuid'

const METADATA_CONTAINER = 'submissions-metadata'
const REQUIRED_FIELDS = ['artistName', 'artistEmail', 'pieceName']

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

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
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
    const {
      submissionId,
      artistName,
      artistEmail,
      links,
      location,
      artistDescription,
      pieceName,
      subtitle,
      pieceDescription,
      tags,
      medium,
      blobReferences,
      agreedToTerms,
    } = req.body

    const missingFields = REQUIRED_FIELDS.filter(field => !req.body[field])
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(', ')}`,
      })
    }

    if (!validateEmail(artistEmail)) {
      return res.status(400).json({ error: 'Invalid email address' })
    }

    if (!agreedToTerms) {
      return res.status(400).json({
        error: 'You must agree to the terms before submitting',
      })
    }

    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING
    if (!connectionString) {
      console.error('AZURE_STORAGE_CONNECTION_STRING not configured')
      return res.status(500).json({ error: 'Storage not configured' })
    }

    const id = submissionId || uuidv4()
    const metadata = {
      submissionId: id,
      submittedAt: new Date().toISOString(),
      artist: {
        name: artistName,
        email: artistEmail,
        links: links || [],
        location: location || '',
        description: artistDescription || '',
      },
      piece: {
        name: pieceName,
        subtitle: subtitle || '',
        description: pieceDescription || '',
        tags: tags || [],
        medium: medium || [],
      },
      files: blobReferences || {},
      agreedToTerms: true,
      status: 'received',
    }

    const blobServiceClient =
      BlobServiceClient.fromConnectionString(connectionString)
    const containerClient =
      blobServiceClient.getContainerClient(METADATA_CONTAINER)
    await containerClient.createIfNotExists()

    const blobClient = containerClient.getBlockBlobClient(`${id}.json`)
    const content = JSON.stringify(metadata, null, 2)
    await blobClient.upload(content, content.length, {
      blobHTTPHeaders: { blobContentType: 'application/json' },
    })

    console.log(`Submission ${id} saved successfully`)

    return res.status(200).json({
      submissionId: id,
      status: 'received',
      message: 'Your submission has been received successfully',
    })
  } catch (error) {
    console.error('submitForm error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
