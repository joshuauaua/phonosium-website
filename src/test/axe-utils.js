import { axe } from 'vitest-axe'
import { expect } from 'vite-plus/test'

/**
 * Runs comprehensive axe accessibility tests on a rendered component
 * Enforces WCAG 2.1 Level AA compliance for:
 * - Color contrast (1.4.3)
 * - Button/link accessible names (4.1.2)
 * - Form labels (3.3.2)
 * - ARIA attributes (4.1.2)
 * - Landmark regions (1.3.1)
 *
 * @param {HTMLElement} container - The container element to test
 * @param {Object} options - axe-core configuration options
 * @returns {Promise<void>}
 */
export async function testAccessibility(container, options = {}) {
  const results = await axe(container, {
    rules: {
      // Color contrast (WCAG 1.4.3 Level AA)
      'color-contrast': { enabled: true },
      // Interactive elements must have accessible names (WCAG 4.1.2)
      'button-name': { enabled: true },
      'link-name': { enabled: true },
      // Form inputs must have labels (WCAG 3.3.2)
      label: { enabled: true },
      // ARIA attributes must be valid (WCAG 4.1.2)
      'aria-required-attr': { enabled: true },
      'aria-valid-attr': { enabled: true },
      'aria-valid-attr-value': { enabled: true },
      'aria-allowed-attr': { enabled: true },
      // Page structure and landmarks (WCAG 1.3.1)
      'landmark-one-main': { enabled: true },
      region: { enabled: true },
    },
    ...options,
  })

  expect(results).toHaveNoViolations()
}
