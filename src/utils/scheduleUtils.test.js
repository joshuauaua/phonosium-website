import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getCurrentInstallation, getStockholmTime } from './scheduleUtils'

describe('scheduleUtils', () => {
  describe('getStockholmTime', () => {
    it('returns a Date object', () => {
      const result = getStockholmTime()
      expect(result).toBeInstanceOf(Date)
    })
  })

  describe('getCurrentInstallation', () => {
    const mockInstallations = [
      {
        id: 1,
        title: 'Night Piece',
        startTime: '20:00',
      },
      {
        id: 2,
        title: 'Morning Piece',
        startTime: '06:40',
      },
      {
        id: 3,
        title: 'Afternoon Piece',
        startTime: '11:00',
      },
      {
        id: 4,
        title: 'Evening Piece',
        startTime: '16:00',
      },
    ]

    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('returns the correct installation for morning time (08:00 Stockholm)', () => {
      // Set system time to 08:00 Stockholm time (06:00 UTC in summer, 07:00 UTC in winter)
      // Using a summer date: 2026-07-06 08:00 Stockholm = 2026-07-06 06:00 UTC
      vi.setSystemTime(new Date('2026-07-06T06:00:00.000Z'))

      const result = getCurrentInstallation(mockInstallations)
      expect(result.id).toBe(2) // Morning Piece (starts at 06:40)
    })

    it('returns the correct installation for afternoon time (13:00 Stockholm)', () => {
      // 2026-07-06 13:00 Stockholm = 2026-07-06 11:00 UTC
      vi.setSystemTime(new Date('2026-07-06T11:00:00.000Z'))

      const result = getCurrentInstallation(mockInstallations)
      expect(result.id).toBe(3) // Afternoon Piece (starts at 11:00)
    })

    it('returns the correct installation for evening time (18:00 Stockholm)', () => {
      // 2026-07-06 18:00 Stockholm = 2026-07-06 16:00 UTC
      vi.setSystemTime(new Date('2026-07-06T16:00:00.000Z'))

      const result = getCurrentInstallation(mockInstallations)
      expect(result.id).toBe(4) // Evening Piece (starts at 16:00)
    })

    it('returns the correct installation for night time (22:00 Stockholm)', () => {
      // 2026-07-06 22:00 Stockholm = 2026-07-06 20:00 UTC
      vi.setSystemTime(new Date('2026-07-06T20:00:00.000Z'))

      const result = getCurrentInstallation(mockInstallations)
      expect(result.id).toBe(1) // Night Piece (starts at 20:00)
    })

    it('handles wrap-around midnight correctly (02:00 Stockholm)', () => {
      // 2026-07-06 02:00 Stockholm = 2026-07-06 00:00 UTC
      vi.setSystemTime(new Date('2026-07-06T00:00:00.000Z'))

      const result = getCurrentInstallation(mockInstallations)
      expect(result.id).toBe(1) // Night Piece (wraps from 20:00 to 06:40)
    })

    it('handles exact start time (11:00 Stockholm)', () => {
      // 2026-07-06 11:00 Stockholm = 2026-07-06 09:00 UTC
      vi.setSystemTime(new Date('2026-07-06T09:00:00.000Z'))

      const result = getCurrentInstallation(mockInstallations)
      expect(result.id).toBe(3) // Afternoon Piece (starts exactly at 11:00)
    })
  })
})
