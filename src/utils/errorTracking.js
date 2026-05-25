const API_BASE_URL = import.meta.env.VITE_AZURE_FUNCTIONS_URL || '/api'

/**
 * Log structured error to monitoring system
 * @param {string} category - Error category (e.g., 'upload_url_request_failed', 'upload_xhr_error')
 * @param {string} message - Human-readable error message
 * @param {object} metadata - Additional context (status codes, file info, etc.)
 */
export function logError(category, message, metadata = {}) {
  const errorData = {
    category,
    message,
    metadata: {
      ...metadata,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      url: window.location.href,
    },
  }

  // Use sendBeacon for reliability (works even if page is unloading)
  if (navigator.sendBeacon) {
    const blob = new Blob([JSON.stringify(errorData)], {
      type: 'application/json',
    })
    const sent = navigator.sendBeacon(`${API_BASE_URL}/log`, blob)

    // Fallback to fetch if sendBeacon fails
    if (!sent) {
      fallbackToFetch(errorData)
    }
  } else {
    // Fallback for browsers without sendBeacon
    fallbackToFetch(errorData)
  }
}

function fallbackToFetch(errorData) {
  // Fire and forget - don't block on errors
  fetch(`${API_BASE_URL}/log`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(errorData),
    keepalive: true,
  }).catch(() => {
    // Silently fail - we don't want error tracking to break the app
  })
}
