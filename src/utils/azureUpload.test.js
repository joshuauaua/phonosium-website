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

    it('throws on non-ok response', async () => {
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
    })
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
})
