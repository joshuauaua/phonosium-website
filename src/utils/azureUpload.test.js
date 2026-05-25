import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { requestUploadUrl, submitFormData } from './azureUpload'
import * as errorTracking from './errorTracking'

describe('azureUpload utilities', () => {
  let logErrorSpy

  beforeEach(() => {
    globalThis.fetch = vi.fn()
    logErrorSpy = vi
      .spyOn(errorTracking, 'logError')
      .mockImplementation(() => {})
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

    it('logs error when upload URL request fails', async () => {
      globalThis.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: () => Promise.resolve('Server error'),
      })

      await expect(
        requestUploadUrl('test.wav', 'audio/wav', 1024, 'audio', 'sub-123')
      ).rejects.toThrow()

      expect(logErrorSpy).toHaveBeenCalledWith(
        'upload_url_request_failed',
        'Server error',
        expect.objectContaining({
          status: 500,
          statusText: 'Internal Server Error',
          responseBody: 'Server error',
          fileName: 'test.wav',
          fileType: 'audio/wav',
          fileSize: 1024,
          category: 'audio',
          submissionId: 'sub-123',
        })
      )
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

    it('logs error when submission fails', async () => {
      globalThis.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        text: () =>
          Promise.resolve(JSON.stringify({ error: 'Missing fields' })),
      })

      const formData = { submissionId: 'sub-123' }
      const blobRefs = [{ category: 'audio', blobName: 'test.wav' }]

      await expect(submitFormData(formData, blobRefs)).rejects.toThrow()

      expect(logErrorSpy).toHaveBeenCalledWith(
        'submission_failed',
        expect.stringContaining('Missing fields'),
        expect.objectContaining({
          status: 400,
          statusText: 'Bad Request',
          submissionId: 'sub-123',
          blobCount: 1,
        })
      )
    })
  })
})
