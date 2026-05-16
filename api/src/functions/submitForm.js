import { app } from '@azure/functions'
import { BlobServiceClient } from '@azure/storage-blob'
import { v4 as uuidv4 } from 'uuid'

const METADATA_CONTAINER = 'submissions-metadata'

const REQUIRED_FIELDS = ['artistName', 'artistEmail', 'pieceName']

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

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function submitFormHandler(request, context) {
  const corsHeaders = getCorsHeaders(request)

  if (request.method === 'OPTIONS') {
    return { status: 204, headers: corsHeaders }
  }

  try {
    const body = await request.json()
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
    } = body

    const missingFields = REQUIRED_FIELDS.filter(field => !body[field])
    if (missingFields.length > 0) {
      return {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: `Missing required fields: ${missingFields.join(', ')}`,
        }),
      }
    }

    if (!validateEmail(artistEmail)) {
      return {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Invalid email address' }),
      }
    }

    if (!agreedToTerms) {
      return {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'You must agree to the terms before submitting',
        }),
      }
    }

    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING
    if (!connectionString) {
      context.error('AZURE_STORAGE_CONNECTION_STRING not configured')
      return {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Storage not configured' }),
      }
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

    context.log(`Submission ${id} saved successfully`)

    return {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        submissionId: id,
        status: 'received',
        message: 'Your submission has been received successfully',
      }),
    }
  } catch (error) {
    context.error('submitForm error:', error)
    return {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error' }),
    }
  }
}

app.http('submitForm', {
  methods: ['POST', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'submissions/submit',
  handler: submitFormHandler,
})
