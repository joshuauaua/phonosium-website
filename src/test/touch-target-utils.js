/**
 * Touch target size validation utilities for WCAG 2.5.5 compliance
 * Minimum touch target size: 44x44px (WCAG 2.1 Level AAA)
 */

/**
 * Asserts that an element meets minimum touch target size requirements
 * @param {HTMLElement} element - The element to check
 * @param {number} minSize - Minimum size in pixels (default: 44)
 * @throws {Error} If touch target is too small
 */
export function assertTouchTargetSize(element, minSize = 44) {
  const rect = element.getBoundingClientRect()

  const width = rect.width
  const height = rect.height

  if (width < minSize || height < minSize) {
    throw new Error(
      `Touch target too small: ${width}x${height}px (minimum: ${minSize}x${minSize}px)`
    )
  }
}

/**
 * Validates that all interactive elements in a container meet touch target requirements
 * @param {HTMLElement} container - The container to search for interactive elements
 * @param {number} minSize - Minimum size in pixels (default: 44)
 * @throws {Error} If any visible interactive element is too small
 */
export function assertAllTouchTargetsAccessible(container, minSize = 44) {
  const interactiveElements = container.querySelectorAll(
    'button, a, input, select, textarea, [role="button"], [role="link"], [tabindex="0"]'
  )

  interactiveElements.forEach(el => {
    // Skip explicitly hidden elements
    const computedStyle = window.getComputedStyle(el)
    const isHidden =
      computedStyle.display === 'none' || computedStyle.visibility === 'hidden'

    if (!isHidden) {
      assertTouchTargetSize(el, minSize)
    }
  })
}
