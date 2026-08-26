// Utility functions for handling external links

/**
 * Build a safe href from a website value that may or may not include a scheme
 * @param {string} url - e.g. 'example.com' or 'https://example.com/'
 * @returns {string|null} - An absolute https URL, or null if there is no url
 */
export function toExternalHref(url) {
  if (!url) return null
  const trimmed = url.trim()
  if (!trimmed) return null
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

/**
 * Format a website value for display by dropping the scheme and trailing slash
 * @param {string} url - e.g. 'https://example.com/'
 * @returns {string} - e.g. 'example.com'
 */
export function toDisplayUrl(url) {
  if (!url) return ''
  return url
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/\/$/, '')
}
