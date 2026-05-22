import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@azure/functions', () => ({
  app: { http: vi.fn() },
}))

vi.mock('@azure/storage-blob', () => {
  const mockBlobClient = { upload: vi.fn() }
  const mockContainerClient = {
    createIfNotExists: vi.fn(),
    getBlockBlobClient: vi.fn(() => mockBlobClient),
  }
  return {
    BlobServiceClient: {
      fromConnectionString: vi.fn(() => ({
        getContainerClient: vi.fn(() => mockContainerClient),
      })),
    },
  }
})

vi.mock('uuid', () => ({ v4: () => 'test-uuid-5678' }))

function makeRequest(body, method = 'POST') {
  return {
    method,
    headers: new Map([['origin', 'http://localhost:5173']]),
    json: async () => body,
  }
}

const context = { error: vi.fn(), log: vi.fn() }

describe('submitForm handler', () => {
  beforeEach(() => {
    process.env.AZURE_STORAGE_CONNECTION_STRING = 'UseDevelopmentStorage=true'
    process.env.ALLOWED_ORIGINS = 'http://localhost:5173'
  })

  it('rejects submissions with missing required fields', async () => {
    const { submitFormHandler } = await import('./submitForm.js')
    const request = makeRequest({ artistName: 'Test' })

    const response = await submitFormHandler(request, context)
    expect(response.status).toBe(400)
    expect(JSON.parse(response.body).error).toContain('Missing required fields')
  })

  it('rejects invalid email addresses', async () => {
    const { submitFormHandler } = await import('./submitForm.js')
    const request = makeRequest({
      artistName: 'Test Artist',
      artistEmail: 'not-an-email',
      pieceName: 'Test Piece',
      agreedToTerms: true,
    })

    const response = await submitFormHandler(request, context)
    expect(response.status).toBe(400)
    expect(JSON.parse(response.body).error).toContain('Invalid email')
  })

  it('rejects submissions without agreed terms', async () => {
    const { submitFormHandler } = await import('./submitForm.js')
    const request = makeRequest({
      artistName: 'Test Artist',
      artistEmail: 'test@example.com',
      pieceName: 'Test Piece',
      agreedToTerms: false,
    })

    const response = await submitFormHandler(request, context)
    expect(response.status).toBe(400)
    expect(JSON.parse(response.body).error).toContain('agree to the terms')
  })

  it('successfully saves submission metadata', async () => {
    const { submitFormHandler } = await import('./submitForm.js')
    const request = makeRequest({
      artistName: 'Test Artist',
      artistEmail: 'test@example.com',
      pieceName: 'Test Piece',
      pieceDescription: 'A test piece',
      tags: ['ambient'],
      medium: ['field recording'],
      agreedToTerms: true,
      blobReferences: { loop: 'test-id/loop.wav' },
    })

    const response = await submitFormHandler(request, context)
    expect(response.status).toBe(200)
    const body = JSON.parse(response.body)
    expect(body.submissionId).toBe('test-uuid-5678')
    expect(body.status).toBe('received')
  })

  it('handles OPTIONS for CORS preflight', async () => {
    const { submitFormHandler } = await import('./submitForm.js')
    const request = makeRequest({}, 'OPTIONS')

    const response = await submitFormHandler(request, context)
    expect(response.status).toBe(204)
  })

  it('accepts valid link objects with url and type', async () => {
    const { submitFormHandler } = await import('./submitForm.js')
    const request = makeRequest({
      artistName: 'Test Artist',
      artistEmail: 'test@example.com',
      pieceName: 'Test Piece',
      links: [
        { url: 'https://instagram.com/artist', type: 'Instagram' },
        { url: 'https://soundcloud.com/artist', type: 'SoundCloud' },
      ],
      agreedToTerms: true,
    })

    const response = await submitFormHandler(request, context)
    expect(response.status).toBe(200)
  })

  it('rejects plain string links (old format)', async () => {
    const { submitFormHandler } = await import('./submitForm.js')
    const request = makeRequest({
      artistName: 'Test Artist',
      artistEmail: 'test@example.com',
      pieceName: 'Test Piece',
      links: ['https://instagram.com/artist'],
      agreedToTerms: true,
    })

    const response = await submitFormHandler(request, context)
    expect(response.status).toBe(400)
    expect(JSON.parse(response.body).error).toContain('must be an object')
  })

  it('rejects link objects missing url field', async () => {
    const { submitFormHandler } = await import('./submitForm.js')
    const request = makeRequest({
      artistName: 'Test Artist',
      artistEmail: 'test@example.com',
      pieceName: 'Test Piece',
      links: [{ type: 'Instagram' }],
      agreedToTerms: true,
    })

    const response = await submitFormHandler(request, context)
    expect(response.status).toBe(400)
    expect(JSON.parse(response.body).error).toContain('missing or invalid url')
  })

  it('rejects link objects missing type field', async () => {
    const { submitFormHandler } = await import('./submitForm.js')
    const request = makeRequest({
      artistName: 'Test Artist',
      artistEmail: 'test@example.com',
      pieceName: 'Test Piece',
      links: [{ url: 'https://instagram.com/artist' }],
      agreedToTerms: true,
    })

    const response = await submitFormHandler(request, context)
    expect(response.status).toBe(400)
    expect(JSON.parse(response.body).error).toContain('missing or invalid type')
  })

  it('accepts empty links array', async () => {
    const { submitFormHandler } = await import('./submitForm.js')
    const request = makeRequest({
      artistName: 'Test Artist',
      artistEmail: 'test@example.com',
      pieceName: 'Test Piece',
      links: [],
      agreedToTerms: true,
    })

    const response = await submitFormHandler(request, context)
    expect(response.status).toBe(200)
  })
})
