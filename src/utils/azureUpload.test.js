import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  requestUploadUrl,
  submitFormData,
  uploadFileToBlob,
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

    it(
      'exhausts retries and throws final error',
      async () => {
        // All 4 attempts fail (initial + 3 retries)
        globalThis.fetch.mockRejectedValue(new Error('Network failure'))

        await expect(
          requestUploadUrl('test.wav', 'audio/wav', 1024, 'audio', 'sub-123')
        ).rejects.toThrow('Upload URL request failed after 4 attempts')

        expect(globalThis.fetch).toHaveBeenCalledTimes(4)
      },
      10000
    )
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

    it(
      'retries on network error and succeeds',
      async () => {
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
      },
      10000
    )

    it(
      'retries on 500 error and succeeds',
      async () => {
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
      },
      10000
    )

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

    it(
      'exhausts retries on persistent network errors',
      async () => {
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
      },
      10000
    )
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
})
