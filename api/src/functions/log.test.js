import { describe, it, expect, vi, beforeEach } from 'vitest'
import { logHandler } from './log.js'

describe('log endpoint', () => {
  let mockContext

  beforeEach(() => {
    mockContext = {
      log: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    }
  })

  const createRequest = (method, body = null, headers = {}) => ({
    method,
    headers: {
      get: key => headers[key] || null,
    },
    json: async () => body,
  })

  describe('CORS', () => {
    it('handles OPTIONS preflight request', async () => {
      const request = createRequest('OPTIONS', null, {
        origin: 'http://localhost:5173',
      })

      const response = await logHandler(request, mockContext)

      expect(response.status).toBe(204)
      expect(response.headers['Access-Control-Allow-Origin']).toBeDefined()
      expect(response.headers['Access-Control-Allow-Methods']).toBe(
        'POST, OPTIONS',
      )
      expect(response.headers['Access-Control-Allow-Headers']).toBe(
        'Content-Type',
      )
    })
  })

  describe('validation', () => {
    it('returns 400 when category is missing', async () => {
      const request = createRequest('POST', {
        message: 'Test message',
      })

      const response = await logHandler(request, mockContext)

      expect(response.status).toBe(400)
      const body = JSON.parse(response.body)
      expect(body.error).toContain('Missing required fields')
    })

    it('returns 400 when message is missing', async () => {
      const request = createRequest('POST', {
        category: 'test_error',
      })

      const response = await logHandler(request, mockContext)

      expect(response.status).toBe(400)
      const body = JSON.parse(response.body)
      expect(body.error).toContain('Missing required fields')
    })
  })

  describe('logging', () => {
    it('logs structured JSON via context.log()', async () => {
      const request = createRequest('POST', {
        category: 'upload_xhr_error',
        message: 'Network error during upload',
        metadata: {
          status: 0,
          fileName: 'test.wav',
          fileSize: 1024,
        },
      })

      const response = await logHandler(request, mockContext)

      expect(response.status).toBe(204)
      expect(mockContext.log).toHaveBeenCalledTimes(1)

      const loggedData = JSON.parse(mockContext.log.mock.calls[0][0])
      expect(loggedData.level).toBe('error')
      expect(loggedData.category).toBe('upload_xhr_error')
      expect(loggedData.message).toBe('Network error during upload')
      expect(loggedData.metadata.status).toBe(0)
      expect(loggedData.metadata.fileName).toBe('test.wav')
      expect(loggedData.metadata.fileSize).toBe(1024)
      expect(loggedData.timestamp).toBeDefined()
      expect(loggedData.source).toBe('client')
    })

    it('returns 204 No Content on success', async () => {
      const request = createRequest('POST', {
        category: 'test_error',
        message: 'Test message',
      })

      const response = await logHandler(request, mockContext)

      expect(response.status).toBe(204)
      expect(response.body).toBeUndefined()
    })
  })

  describe('rate limiting', () => {
    it('enforces rate limit after 100 requests', async () => {
      const request = createRequest(
        'POST',
        {
          category: 'test_error',
          message: 'Test message',
        },
        {
          'x-forwarded-for': '192.168.1.1',
        },
      )

      // Send 100 requests (should all succeed)
      for (let i = 0; i < 100; i++) {
        const response = await logHandler(request, mockContext)
        expect(response.status).toBe(204)
      }

      // 101st request should be rate limited
      const response = await logHandler(request, mockContext)
      expect(response.status).toBe(429)
      expect(mockContext.warn).toHaveBeenCalledWith(
        'Rate limit exceeded for client:',
        '192.168.1.1',
      )
    })

    it('uses first IP from x-forwarded-for header', async () => {
      const request = createRequest(
        'POST',
        {
          category: 'test_error',
          message: 'Test message',
        },
        {
          'x-forwarded-for': '192.168.1.1, 10.0.0.1, 172.16.0.1',
        },
      )

      await logHandler(request, mockContext)

      // Send 100 more requests to trigger rate limit
      for (let i = 0; i < 100; i++) {
        await logHandler(request, mockContext)
      }

      const response = await logHandler(request, mockContext)
      expect(response.status).toBe(429)
      expect(mockContext.warn).toHaveBeenCalledWith(
        'Rate limit exceeded for client:',
        '192.168.1.1',
      )
    })

    it('handles missing x-forwarded-for header', async () => {
      const request = createRequest('POST', {
        category: 'test_error',
        message: 'Test message',
      })

      const response = await logHandler(request, mockContext)
      expect(response.status).toBe(204)
    })
  })

  describe('error handling', () => {
    it('returns 500 on unexpected errors', async () => {
      const request = {
        method: 'POST',
        headers: {
          get: () => null,
        },
        json: async () => {
          throw new Error('JSON parse error')
        },
      }

      const response = await logHandler(request, mockContext)

      expect(response.status).toBe(500)
      expect(mockContext.error).toHaveBeenCalledWith(
        'Log endpoint error:',
        expect.any(Error),
      )
    })
  })
})
