import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@azure/functions', () => ({
  app: { http: vi.fn() },
}))

vi.mock('@azure/storage-blob', () => {
  const mockBlockBlobClient = {
    url: 'https://storage.blob.core.windows.net/submissions-audio/test-id/test.wav',
  }
  const mockContainerClient = {
    createIfNotExists: vi.fn(),
    getBlockBlobClient: vi.fn(() => mockBlockBlobClient),
  }
  return {
    BlobServiceClient: {
      fromConnectionString: vi.fn(() => ({
        getContainerClient: vi.fn(() => mockContainerClient),
      })),
    },
    generateBlobSASQueryParameters: vi.fn(() => ({
      toString: () => 'sas-token',
    })),
    BlobSASPermissions: { parse: vi.fn(() => ({})) },
    StorageSharedKeyCredential: vi.fn(),
  }
})

vi.mock('uuid', () => ({ v4: () => 'test-uuid-1234' }))

function makeRequest(body, method = 'POST') {
  return {
    method,
    headers: new Map([['origin', 'http://localhost:5173']]),
    json: async () => body,
  }
}

const context = { error: vi.fn(), log: vi.fn() }

describe('uploadUrl handler', () => {
  beforeEach(() => {
    process.env.AZURE_STORAGE_CONNECTION_STRING = 'UseDevelopmentStorage=true'
    process.env.AZURE_STORAGE_ACCOUNT_NAME = 'devstoreaccount1'
    process.env.AZURE_STORAGE_ACCOUNT_KEY = 'dGVzdGtleQ=='
    process.env.ALLOWED_ORIGINS = 'http://localhost:5173'
  })

  it('rejects requests with missing fields', async () => {
    const { uploadUrlHandler } = await import('./uploadUrl.js')
    const request = makeRequest({ fileName: 'test.wav' })

    const response = await uploadUrlHandler(request, context)
    expect(response.status).toBe(400)
    expect(JSON.parse(response.body)).toHaveProperty('error')
  })

  it('rejects invalid category', async () => {
    const { uploadUrlHandler } = await import('./uploadUrl.js')
    const request = makeRequest({
      fileName: 'test.wav',
      fileType: 'audio/wav',
      category: 'invalid',
    })

    const response = await uploadUrlHandler(request, context)
    expect(response.status).toBe(400)
  })

  it('rejects invalid file types', async () => {
    const { uploadUrlHandler } = await import('./uploadUrl.js')
    const request = makeRequest({
      fileName: 'test.exe',
      fileType: 'application/x-executable',
      category: 'audio',
    })

    const response = await uploadUrlHandler(request, context)
    expect(response.status).toBe(400)
    expect(JSON.parse(response.body).error).toContain('Invalid file type')
  })

  it('rejects oversized files', async () => {
    const { uploadUrlHandler } = await import('./uploadUrl.js')
    const request = makeRequest({
      fileName: 'test.wav',
      fileType: 'audio/wav',
      fileSize: 30 * 1024 * 1024,
      category: 'audio',
    })

    const response = await uploadUrlHandler(request, context)
    expect(response.status).toBe(400)
    expect(JSON.parse(response.body).error).toContain('exceeds maximum')
  })

  it('handles OPTIONS for CORS preflight', async () => {
    const { uploadUrlHandler } = await import('./uploadUrl.js')
    const request = makeRequest({}, 'OPTIONS')

    const response = await uploadUrlHandler(request, context)
    expect(response.status).toBe(204)
  })

  it('returns upload URL on valid request', async () => {
    const { uploadUrlHandler } = await import('./uploadUrl.js')
    const request = makeRequest({
      fileName: 'loop.wav',
      fileType: 'audio/wav',
      fileSize: 1024,
      category: 'audio',
    })

    const response = await uploadUrlHandler(request, context)
    expect(response.status).toBe(200)
    const body = JSON.parse(response.body)
    expect(body.uploadUrl).toContain('sas-token')
    expect(body.submissionId).toBe('test-uuid-1234')
    expect(body.blobName).toContain('loop.wav')
  })
})
