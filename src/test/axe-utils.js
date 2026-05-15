import { axe } from 'vitest-axe'

/**
 * Runs axe accessibility tests on a rendered component
 * @param {HTMLElement} container - The container element to test
 * @param {Object} options - axe-core configuration options
 * @returns {Promise<void>}
 */
export async function testAccessibility(container, options = {}) {
  const results = await axe(container, {
    rules: {
      // Enforce contrast checks at WCAG AA level
      'color-contrast': { enabled: true },
    },
    ...options,
  })

  expect(results).toHaveNoViolations()
}
