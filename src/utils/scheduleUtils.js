// Utility functions for schedule and time calculations

/**
 * Get the current time in Stockholm timezone
 */
export function getStockholmTime() {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Stockholm' }))
}

/**
 * Parse a time string (HH:MM) into minutes since midnight
 */
function timeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number)
  return hours * 60 + minutes
}

/**
 * Determine which installation is currently playing based on Stockholm time
 * @param {Array} installations - Array of installation objects with startTime and duration
 * @returns {Object} - The currently playing installation
 */
export function getCurrentInstallation(installations) {
  const now = getStockholmTime()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  // Sort installations by start time
  const sorted = [...installations].sort((a, b) =>
    timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
  )

  // Find which piece should be playing
  for (let i = 0; i < sorted.length; i++) {
    const current = sorted[i]
    const next = sorted[(i + 1) % sorted.length]

    const startMinutes = timeToMinutes(current.startTime)
    const nextStartMinutes = timeToMinutes(next.startTime)

    // Handle wrap-around midnight
    if (nextStartMinutes > startMinutes) {
      // Normal case: both times are on the same day
      if (currentMinutes >= startMinutes && currentMinutes < nextStartMinutes) {
        return current
      }
    } else {
      // Wrap-around case: current piece spans midnight
      if (currentMinutes >= startMinutes || currentMinutes < nextStartMinutes) {
        return current
      }
    }
  }

  // Fallback to first installation
  return sorted[0]
}
