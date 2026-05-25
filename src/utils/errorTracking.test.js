import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { logError } from './errorTracking.js'

describe('errorTracking', () => {
  beforeEach(() => {
    // Mock fetch
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 204,
      }),
    )

    // Mock navigator.sendBeacon
    global.navigator.sendBeacon = vi.fn(() => true)

    // Mock window.location
    delete global.window.location
    global.window.location = { href: 'http://localhost:5173/contribute' }
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('logError', () => {
    it('sends POST to /api/log with correct payload using sendBeacon', () => {
      logError('test_error', 'Test error message', {
        status: 500,
        fileName: 'test.wav',
      })

      expect(navigator.sendBeacon).toHaveBeenCalledTimes(1)
      expect(navigator.sendBeacon).toHaveBeenCalledWith(
        '/api/log',
        expect.any(Blob),
      )

      // Verify blob content
      const call = navigator.sendBeacon.mock.calls[0]
      const blob = call[1]
      expect(blob.type).toBe('application/json')

      // Read blob content
      const reader = new FileReader()
      reader.onload = () => {
        const data = JSON.parse(reader.result)
        expect(data.category).toBe('test_error')
        expect(data.message).toBe('Test error message')
        expect(data.metadata.status).toBe(500)
        expect(data.metadata.fileName).toBe('test.wav')
        expect(data.metadata.userAgent).toBeDefined()
        expect(data.metadata.timestamp).toBeDefined()
        expect(data.metadata.url).toBe('http://localhost:5173/contribute')
      }
      reader.readAsText(blob)
    })

    it('falls back to fetch when sendBeacon returns false', async () => {
      navigator.sendBeacon = vi.fn(() => false)

      logError('test_error', 'Test error message', { status: 500 })

      expect(navigator.sendBeacon).toHaveBeenCalledTimes(1)

      // Give fetch time to be called (it's async)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch).toHaveBeenCalledWith(
        '/api/log',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          keepalive: true,
        }),
      )
    })

    it('uses fetch when sendBeacon is unavailable', async () => {
      delete navigator.sendBeacon

      logError('test_error', 'Test error message', { status: 500 })

      // Give fetch time to be called (it's async)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch).toHaveBeenCalledWith(
        '/api/log',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          keepalive: true,
        }),
      )
    })

    it('handles fetch network errors gracefully', async () => {
      delete navigator.sendBeacon
      global.fetch = vi.fn(() => Promise.reject(new Error('Network error')))

      // Should not throw
      expect(() => {
        logError('test_error', 'Test error message')
      }).not.toThrow()

      await new Promise(resolve => setTimeout(resolve, 10))
      expect(fetch).toHaveBeenCalledTimes(1)
    })

    it('includes user agent and timestamp in metadata', () => {
      const userAgent = 'Mozilla/5.0 Test Browser'
      Object.defineProperty(navigator, 'userAgent', {
        value: userAgent,
        configurable: true,
      })

      logError('test_error', 'Test message')

      const call = navigator.sendBeacon.mock.calls[0]
      const blob = call[1]
      const reader = new FileReader()
      reader.onload = () => {
        const data = JSON.parse(reader.result)
        expect(data.metadata.userAgent).toBe(userAgent)
        expect(data.metadata.timestamp).toMatch(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/,
        )
      }
      reader.readAsText(blob)
    })

    it('merges custom metadata with system metadata', () => {
      logError('test_error', 'Test message', {
        customField: 'custom value',
        status: 404,
      })

      const call = navigator.sendBeacon.mock.calls[0]
      const blob = call[1]
      const reader = new FileReader()
      reader.onload = () => {
        const data = JSON.parse(reader.result)
        expect(data.metadata.customField).toBe('custom value')
        expect(data.metadata.status).toBe(404)
        expect(data.metadata.userAgent).toBeDefined()
        expect(data.metadata.timestamp).toBeDefined()
        expect(data.metadata.url).toBeDefined()
      }
      reader.readAsText(blob)
    })
  })
})
