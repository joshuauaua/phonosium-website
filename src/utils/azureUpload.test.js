import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  requestUploadUrl,
  submitFormData,
  uploadFileToBlob,
  uploadFile,
} from './azureUpload'

describe('azureUpload utilities', () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('requestUploadUrl', () => {
    it('sends correct request body', async () => {
      globalThis.fetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            uploadUrl: 'https://storage.blob.core.windows.net/test?sas=token',
            blobName: 'id/test.wav',
            submissionId: 'id',
          }),
      })

      const result = await requestUploadUrl(
        'test.wav',
        'audio/wav',
        1024,
        'audio',
        'sub-123'
      )

      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/submissions/upload-url'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: 'test.wav',
            fileType: 'audio/wav',
            fileSize: 1024,
            category: 'audio',
            submissionId: 'sub-123',
          }),
        })
      )
      expect(result.uploadUrl).toContain('storage.blob.core.windows.net')
    })

    it('throws on non-retryable 400 error without retry', async () => {
      globalThis.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        text: () =>
          Promise.resolve(JSON.stringify({ error: 'Invalid file type' })),
      })

      await expect(
        requestUploadUrl('test.exe', 'application/x-executable', 100, 'audio')
      ).rejects.toThrow('Invalid file type')

      // Should not retry 4xx errors (except 429)
      expect(globalThis.fetch).toHaveBeenCalledTimes(1)
    })

    it('retries on network error and succeeds', async () => {
      // First attempt: network error
      globalThis.fetch.mockRejectedValueOnce(new Error('Network failure'))

      // Second attempt: success
      globalThis.fetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            uploadUrl: 'https://storage.blob.core.windows.net/test?sas=token',
            blobName: 'id/test.wav',
            submissionId: 'id',
          }),
      })

      const result = await requestUploadUrl(
        'test.wav',
        'audio/wav',
        1024,
        'audio',
        'sub-123'
      )

      expect(result.uploadUrl).toContain('storage.blob.core.windows.net')
      expect(globalThis.fetch).toHaveBeenCalledTimes(2)
    })

    it('retries on 500 error and succeeds', async () => {
      // First attempt: 500 error
      globalThis.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: () => Promise.resolve(JSON.stringify({ error: 'Server error' })),
      })

      // Second attempt: success
      globalThis.fetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            uploadUrl: 'https://storage.blob.core.windows.net/test?sas=token',
            blobName: 'id/test.wav',
            submissionId: 'id',
          }),
      })

      const result = await requestUploadUrl(
        'test.wav',
        'audio/wav',
        1024,
        'audio',
        'sub-123'
      )

      expect(result.uploadUrl).toContain('storage.blob.core.windows.net')
      expect(globalThis.fetch).toHaveBeenCalledTimes(2)
    })

    it('retries on 429 rate limit error', async () => {
      // First attempt: 429 error
      globalThis.fetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
        text: () => Promise.resolve(JSON.stringify({ error: 'Rate limited' })),
      })

      // Second attempt: success
      globalThis.fetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            uploadUrl: 'https://storage.blob.core.windows.net/test?sas=token',
            blobName: 'id/test.wav',
            submissionId: 'id',
          }),
      })

      const result = await requestUploadUrl(
        'test.wav',
        'audio/wav',
        1024,
        'audio',
        'sub-123'
      )

      expect(result.uploadUrl).toContain('storage.blob.core.windows.net')
      expect(globalThis.fetch).toHaveBeenCalledTimes(2)
    })

    it('exhausts retries and throws final error', async () => {
      // All 4 attempts fail (initial + 3 retries)
      globalThis.fetch.mockRejectedValue(new Error('Network failure'))

      await expect(
        requestUploadUrl('test.wav', 'audio/wav', 1024, 'audio', 'sub-123')
      ).rejects.toThrow('Upload URL request failed after 4 attempts')

      expect(globalThis.fetch).toHaveBeenCalledTimes(4)
    }, 10000)
  })

  describe('uploadFileToBlob', () => {
    let mockXHR

    beforeEach(() => {
      mockXHR = {
        open: vi.fn(),
        send: vi.fn(),
        setRequestHeader: vi.fn(),
        upload: {
          addEventListener: vi.fn(),
        },
        addEventListener: vi.fn(),
        status: 0,
        statusText: '',
        responseText: '',
      }

      globalThis.XMLHttpRequest = vi.fn(function () {
        return mockXHR
      })
    })

    it('uploads file successfully on first attempt', async () => {
      const file = new File(['test content'], 'test.wav', { type: 'audio/wav' })
      const onProgress = vi.fn()

      const uploadPromise = uploadFileToBlob(
        file,
        'https://storage.blob.core.windows.net/test?sas=token',
        onProgress
      )

      // Wait for async operation to register handlers
      await new Promise(resolve => setTimeout(resolve, 0))

      // Simulate successful upload
      const loadHandler = mockXHR.addEventListener.mock.calls.find(
        call => call[0] === 'load'
      )[1]
      mockXHR.status = 201
      loadHandler()

      await uploadPromise

      expect(mockXHR.open).toHaveBeenCalledWith(
        'PUT',
        'https://storage.blob.core.windows.net/test?sas=token'
      )
      expect(mockXHR.setRequestHeader).toHaveBeenCalledWith(
        'x-ms-blob-type',
        'BlockBlob'
      )
      expect(mockXHR.send).toHaveBeenCalledWith(file)
    })

    it('retries on network error and succeeds', async () => {
      const file = new File(['test content'], 'test.wav', {
        type: 'audio/wav',
      })
      const onProgress = vi.fn()

      let attemptCount = 0
      globalThis.XMLHttpRequest = vi.fn(function () {
        const xhr = {
          open: vi.fn(),
          send: vi.fn(),
          setRequestHeader: vi.fn(),
          upload: {
            addEventListener: vi.fn(),
          },
          addEventListener: vi.fn(),
          status: 0,
          statusText: '',
          responseText: '',
        }

        // Trigger handlers after send is called
        xhr.send.mockImplementation(() => {
          attemptCount++
          if (attemptCount === 1) {
            // First attempt: network error
            const errorHandler = xhr.addEventListener.mock.calls.find(
              call => call[0] === 'error'
            )[1]
            errorHandler()
          } else {
            // Second attempt: success
            const loadHandler = xhr.addEventListener.mock.calls.find(
              call => call[0] === 'load'
            )[1]
            xhr.status = 201
            loadHandler()
          }
        })

        return xhr
      })

      await uploadFileToBlob(
        file,
        'https://storage.blob.core.windows.net/test?sas=token',
        onProgress
      )

      expect(attemptCount).toBe(2)
      expect(onProgress).toHaveBeenCalledWith(0) // Progress reset on retry
    }, 10000)

    it('retries on 500 error and succeeds', async () => {
      const file = new File(['test content'], 'test.wav', {
        type: 'audio/wav',
      })

      let attemptCount = 0
      globalThis.XMLHttpRequest = vi.fn(function () {
        const xhr = {
          open: vi.fn(),
          send: vi.fn(),
          setRequestHeader: vi.fn(),
          upload: {
            addEventListener: vi.fn(),
          },
          addEventListener: vi.fn(),
          status: 0,
          statusText: '',
          responseText: '',
        }

        xhr.send.mockImplementation(() => {
          attemptCount++
          const loadHandler = xhr.addEventListener.mock.calls.find(
            call => call[0] === 'load'
          )[1]

          if (attemptCount === 1) {
            // First attempt: 500 error
            xhr.status = 500
            xhr.statusText = 'Internal Server Error'
            loadHandler()
          } else {
            // Second attempt: success
            xhr.status = 201
            loadHandler()
          }
        })

        return xhr
      })

      await uploadFileToBlob(
        file,
        'https://storage.blob.core.windows.net/test?sas=token'
      )

      expect(attemptCount).toBe(2)
    }, 10000)

    it('does not retry on 403 error (invalid SAS token)', async () => {
      const file = new File(['test content'], 'test.wav', { type: 'audio/wav' })

      const uploadPromise = uploadFileToBlob(
        file,
        'https://storage.blob.core.windows.net/test?sas=token'
      )

      // Wait for async operation to register handlers
      await new Promise(resolve => setTimeout(resolve, 0))

      const loadHandler = mockXHR.addEventListener.mock.calls.find(
        call => call[0] === 'load'
      )[1]
      mockXHR.status = 403
      mockXHR.statusText = 'Forbidden'
      loadHandler()

      await expect(uploadPromise).rejects.toThrow(
        'Upload failed with status 403'
      )
      expect(mockXHR.send).toHaveBeenCalledTimes(1)
    })

    it('exhausts retries on persistent network errors', async () => {
      const file = new File(['test content'], 'test.wav', {
        type: 'audio/wav',
      })

      let attemptCount = 0
      globalThis.XMLHttpRequest = vi.fn(function () {
        const xhr = {
          open: vi.fn(),
          send: vi.fn(),
          setRequestHeader: vi.fn(),
          upload: {
            addEventListener: vi.fn(),
          },
          addEventListener: vi.fn(),
          status: 0,
          statusText: '',
          responseText: '',
        }

        xhr.send.mockImplementation(() => {
          attemptCount++
          const errorHandler = xhr.addEventListener.mock.calls.find(
            call => call[0] === 'error'
          )[1]
          errorHandler()
        })

        return xhr
      })

      await expect(
        uploadFileToBlob(
          file,
          'https://storage.blob.core.windows.net/test?sas=token'
        )
      ).rejects.toThrow('Blob upload failed after 4 attempts')

      expect(attemptCount).toBe(4) // initial + 3 retries
    }, 10000)
  })

  describe('submitFormData', () => {
    it('sends form data with blob references', async () => {
      globalThis.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ submissionId: 'id', status: 'received' }),
      })

      const formData = {
        artistName: 'Test',
        artistEmail: 'test@test.com',
        pieceName: 'Piece',
      }
      const blobRefs = { loop: 'id/loop.wav' }

      const result = await submitFormData(formData, blobRefs)

      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/submissions/submit'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ ...formData, blobReferences: blobRefs }),
        })
      )
      expect(result.status).toBe('received')
    })

    it('throws on server error', async () => {
      globalThis.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: () =>
          Promise.resolve(JSON.stringify({ error: 'Internal server error' })),
      })

      await expect(submitFormData({}, {})).rejects.toThrow(
        'Internal server error'
      )
    })
  })

  describe('uploadFileToBlob', () => {
    let mockXHR

    function createMockXHR(overrides = {}) {
      return {
        upload: { addEventListener: vi.fn() },
        addEventListener: vi.fn(),
        open: vi.fn(),
        setRequestHeader: vi.fn(),
        send: vi.fn(),
        status: 200,
        statusText: 'OK',
        responseText: '',
        ...overrides,
      }
    }

    beforeEach(() => {
      mockXHR = createMockXHR()
      globalThis.XMLHttpRequest = vi.fn(function () {
        return mockXHR
      })
    })

    it('rejects with network error when XHR error event fires', async () => {
      mockXHR.addEventListener.mockImplementation((event, handler) => {
        if (event === 'error') {
          setTimeout(() => handler(), 0)
        }
      })

      const file = new File(['test'], 'test.wav', { type: 'audio/wav' })
      const sasUrl = 'https://storage.blob.core.windows.net/test?sas=token'

      await expect(uploadFileToBlob(file, sasUrl)).rejects.toThrow(
        'Upload failed: Network error'
      )
    })

    it('rejects with abort message when XHR abort event fires', async () => {
      mockXHR.addEventListener.mockImplementation((event, handler) => {
        if (event === 'abort') {
          setTimeout(() => handler(), 0)
        }
      })

      const file = new File(['test'], 'test.wav', { type: 'audio/wav' })
      const sasUrl = 'https://storage.blob.core.windows.net/test?sas=token'

      await expect(uploadFileToBlob(file, sasUrl)).rejects.toThrow(
        'Upload aborted'
      )
    })

    it('rejects when Azure returns 403 (expired SAS)', async () => {
      mockXHR.status = 403
      mockXHR.statusText = 'Forbidden'
      mockXHR.addEventListener.mockImplementation((event, handler) => {
        if (event === 'load') {
          setTimeout(() => handler(), 0)
        }
      })

      const file = new File(['test'], 'test.wav', { type: 'audio/wav' })
      const sasUrl = 'https://storage.blob.core.windows.net/test?sas=expired'

      await expect(uploadFileToBlob(file, sasUrl)).rejects.toThrow(
        'Upload failed with status 403: Forbidden'
      )
    })

    it('rejects when Azure returns 404 (blob not found)', async () => {
      mockXHR.status = 404
      mockXHR.statusText = 'Not Found'
      mockXHR.addEventListener.mockImplementation((event, handler) => {
        if (event === 'load') {
          setTimeout(() => handler(), 0)
        }
      })

      const file = new File(['test'], 'test.wav', { type: 'audio/wav' })
      const sasUrl = 'https://storage.blob.core.windows.net/test?sas=token'

      await expect(uploadFileToBlob(file, sasUrl)).rejects.toThrow(
        'Upload failed with status 404: Not Found'
      )
    })

    it('rejects when Azure returns 500 (server error)', async () => {
      mockXHR.status = 500
      mockXHR.statusText = 'Internal Server Error'
      mockXHR.addEventListener.mockImplementation((event, handler) => {
        if (event === 'load') {
          setTimeout(() => handler(), 0)
        }
      })

      const file = new File(['test'], 'test.wav', { type: 'audio/wav' })
      const sasUrl = 'https://storage.blob.core.windows.net/test?sas=token'

      await expect(uploadFileToBlob(file, sasUrl)).rejects.toThrow(
        'Upload failed with status 500: Internal Server Error'
      )
    })

    it('calls onProgress callback with upload progress', async () => {
      const onProgress = vi.fn()
      let progressHandler

      mockXHR.upload.addEventListener.mockImplementation((event, handler) => {
        if (event === 'progress') {
          progressHandler = handler
        }
      })

      mockXHR.addEventListener.mockImplementation((event, handler) => {
        if (event === 'load') {
          setTimeout(() => {
            // Simulate progress events before load
            if (progressHandler) {
              progressHandler({
                lengthComputable: true,
                loaded: 512,
                total: 1024,
              })
              progressHandler({
                lengthComputable: true,
                loaded: 1024,
                total: 1024,
              })
            }
            handler()
          }, 0)
        }
      })

      const file = new File(['test'], 'test.wav', { type: 'audio/wav' })
      const sasUrl = 'https://storage.blob.core.windows.net/test?sas=token'

      await uploadFileToBlob(file, sasUrl, onProgress)

      expect(onProgress).toHaveBeenCalledWith(50)
      expect(onProgress).toHaveBeenCalledWith(100)
    })

    it('handles progress callback when lengthComputable is false', async () => {
      const onProgress = vi.fn()
      let progressHandler

      mockXHR.upload.addEventListener.mockImplementation((event, handler) => {
        if (event === 'progress') {
          progressHandler = handler
        }
      })

      mockXHR.addEventListener.mockImplementation((event, handler) => {
        if (event === 'load') {
          setTimeout(() => {
            // Simulate progress event with lengthComputable=false
            if (progressHandler) {
              progressHandler({
                lengthComputable: false,
                loaded: 512,
                total: 0,
              })
            }
            handler()
          }, 0)
        }
      })

      const file = new File(['test'], 'test.wav', { type: 'audio/wav' })
      const sasUrl = 'https://storage.blob.core.windows.net/test?sas=token'

      await uploadFileToBlob(file, sasUrl, onProgress)

      expect(onProgress).not.toHaveBeenCalled()
    })

    it('resolves successfully on 2xx status', async () => {
      mockXHR.status = 201
      mockXHR.statusText = 'Created'
      mockXHR.addEventListener.mockImplementation((event, handler) => {
        if (event === 'load') {
          setTimeout(() => handler(), 0)
        }
      })

      const file = new File(['test'], 'test.wav', { type: 'audio/wav' })
      const sasUrl = 'https://storage.blob.core.windows.net/test?sas=token'

      await expect(uploadFileToBlob(file, sasUrl)).resolves.toBeUndefined()
    })
  })

  describe('uploadFile integration', () => {
    let mockXHR

    beforeEach(() => {
      mockXHR = {
        upload: { addEventListener: vi.fn() },
        addEventListener: vi.fn(),
        open: vi.fn(),
        setRequestHeader: vi.fn(),
        send: vi.fn(),
        status: 200,
        statusText: 'OK',
        responseText: '',
      }
      globalThis.XMLHttpRequest = vi.fn(function () {
        return mockXHR
      })
    })

    it('propagates network errors from uploadFileToBlob', async () => {
      // Mock requestUploadUrl to succeed
      globalThis.fetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            uploadUrl: 'https://storage.blob.core.windows.net/test?sas=token',
            blobName: 'id/test.wav',
            submissionId: 'id',
          }),
      })

      // Mock XHR to fail with network error
      mockXHR.addEventListener.mockImplementation((event, handler) => {
        if (event === 'error') {
          setTimeout(() => handler(), 0)
        }
      })

      const file = new File(['test'], 'test.wav', { type: 'audio/wav' })

      await expect(uploadFile(file, 'audio', 'sub-123')).rejects.toThrow(
        'Upload failed: Network error'
      )
    })
  })

  describe('RETRY_CONFIG environment variable parsing', () => {
    const originalEnv = { ...import.meta.env }
    const consoleWarnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => {})

    afterEach(() => {
      // Restore original environment
      Object.keys(import.meta.env).forEach(key => {
        if (!originalEnv[key]) {
          delete import.meta.env[key]
        } else {
          import.meta.env[key] = originalEnv[key]
        }
      })
      consoleWarnSpy.mockClear()
    })

    it('uses defaults when environment variables are not set', async () => {
      // Clear any existing env vars
      delete import.meta.env.VITE_UPLOAD_MAX_RETRIES
      delete import.meta.env.VITE_UPLOAD_BASE_DELAY
      delete import.meta.env.VITE_UPLOAD_MAX_DELAY

      // Re-import to trigger parseRetryConfig
      vi.resetModules()
      const module = await import('./azureUpload')

      // Test that defaults are used by checking retry behavior
      globalThis.fetch.mockRejectedValue(new Error('Network failure'))

      await expect(
        module.requestUploadUrl('test.wav', 'audio/wav', 1024, 'audio')
      ).rejects.toThrow('Upload URL request failed after 4 attempts')

      // 1 initial + 3 retries = 4 calls
      expect(globalThis.fetch).toHaveBeenCalledTimes(4)
    })

    it('parses valid environment variables correctly', async () => {
      import.meta.env.VITE_UPLOAD_MAX_RETRIES = '5'
      import.meta.env.VITE_UPLOAD_BASE_DELAY = '2000'
      import.meta.env.VITE_UPLOAD_MAX_DELAY = '30000'

      vi.resetModules()
      const module = await import('./azureUpload')

      // Test maxRetries by exhausting them
      globalThis.fetch.mockRejectedValue(new Error('Network failure'))

      await expect(
        module.requestUploadUrl('test.wav', 'audio/wav', 1024, 'audio')
      ).rejects.toThrow('Upload URL request failed after 6 attempts')

      // 1 initial + 5 retries = 6 calls
      expect(globalThis.fetch).toHaveBeenCalledTimes(6)
      expect(consoleWarnSpy).not.toHaveBeenCalled()
    })

    it('falls back to default for maxRetries < 0', async () => {
      import.meta.env.VITE_UPLOAD_MAX_RETRIES = '-1'

      vi.resetModules()
      await import('./azureUpload')

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Invalid VITE_UPLOAD_MAX_RETRIES (-1), using default: 3'
      )
    })

    it('falls back to default for maxRetries > 10', async () => {
      import.meta.env.VITE_UPLOAD_MAX_RETRIES = '15'

      vi.resetModules()
      await import('./azureUpload')

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Invalid VITE_UPLOAD_MAX_RETRIES (15), using default: 3'
      )
    })

    it('accepts maxRetries = 0 (no retries)', async () => {
      import.meta.env.VITE_UPLOAD_MAX_RETRIES = '0'

      vi.resetModules()
      const module = await import('./azureUpload')

      globalThis.fetch.mockRejectedValue(new Error('Network failure'))

      await expect(
        module.requestUploadUrl('test.wav', 'audio/wav', 1024, 'audio')
      ).rejects.toThrow('Upload URL request failed after 1 attempts')

      // Only 1 call (initial attempt, no retries)
      expect(globalThis.fetch).toHaveBeenCalledTimes(1)
      expect(consoleWarnSpy).not.toHaveBeenCalled()
    })

    it('falls back to default for baseDelay < 100', async () => {
      import.meta.env.VITE_UPLOAD_BASE_DELAY = '50'

      vi.resetModules()
      await import('./azureUpload')

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Invalid VITE_UPLOAD_BASE_DELAY (50), using default: 1000'
      )
    })

    it('falls back to default for baseDelay > 60000', async () => {
      import.meta.env.VITE_UPLOAD_BASE_DELAY = '70000'

      vi.resetModules()
      await import('./azureUpload')

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Invalid VITE_UPLOAD_BASE_DELAY (70000), using default: 1000'
      )
    })

    it('falls back to default for maxDelay < baseDelay', async () => {
      import.meta.env.VITE_UPLOAD_BASE_DELAY = '5000'
      import.meta.env.VITE_UPLOAD_MAX_DELAY = '3000'

      vi.resetModules()
      await import('./azureUpload')

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Invalid VITE_UPLOAD_MAX_DELAY (3000), using default: 10000'
      )
    })

    it('falls back to default for maxDelay > 300000', async () => {
      import.meta.env.VITE_UPLOAD_MAX_DELAY = '400000'

      vi.resetModules()
      await import('./azureUpload')

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Invalid VITE_UPLOAD_MAX_DELAY (400000), using default: 10000'
      )
    })

    it('handles non-numeric values gracefully', async () => {
      import.meta.env.VITE_UPLOAD_MAX_RETRIES = 'abc'
      import.meta.env.VITE_UPLOAD_BASE_DELAY = 'xyz'

      vi.resetModules()
      await import('./azureUpload')

      // parseInt returns NaN for non-numeric strings, which fails validation
      expect(consoleWarnSpy).toHaveBeenCalled()
    })
  })
})
