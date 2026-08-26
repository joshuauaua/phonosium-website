import { describe, it, expect } from 'vite-plus/test'
import { toExternalHref, toDisplayUrl } from './urlUtils'

describe('urlUtils', () => {
  describe('toExternalHref', () => {
    it('adds https to a bare domain', () => {
      expect(toExternalHref('example.com')).toBe('https://example.com')
    })

    it('leaves an existing scheme untouched', () => {
      expect(toExternalHref('https://www.example.com/')).toBe(
        'https://www.example.com/'
      )
      expect(toExternalHref('http://example.com')).toBe('http://example.com')
    })

    it('returns null for a missing url', () => {
      expect(toExternalHref(undefined)).toBeNull()
      expect(toExternalHref('')).toBeNull()
      expect(toExternalHref('   ')).toBeNull()
    })
  })

  describe('toDisplayUrl', () => {
    it('strips the scheme and trailing slash', () => {
      expect(toDisplayUrl('https://www.example.com/')).toBe('www.example.com')
      expect(toDisplayUrl('http://example.com')).toBe('example.com')
    })

    it('leaves a bare domain untouched', () => {
      expect(toDisplayUrl('example.com')).toBe('example.com')
    })

    it('returns an empty string for a missing url', () => {
      expect(toDisplayUrl(undefined)).toBe('')
    })
  })
})
