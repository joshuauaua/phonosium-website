import { describe, it, expect } from 'vite-plus/test'
import { render } from '@testing-library/react'
import { testAccessibility } from './axe-utils'

describe('testAccessibility', () => {
  it('passes for accessible content', async () => {
    const { container } = render(
      <div>
        <button aria-label="Click me">Click</button>
      </div>
    )

    await expect(testAccessibility(container)).resolves.not.toThrow()
  })

  it('detects accessibility violations', async () => {
    const { container } = render(
      <div>
        <button aria-label="">
          <span aria-hidden="true">×</span>
        </button>
      </div>
    )

    // This button has an empty aria-label and hidden content, should fail
    await expect(testAccessibility(container)).rejects.toThrow()
  })

  it('accepts custom axe-core options', async () => {
    const { container } = render(
      <div>
        <button>No label</button>
      </div>
    )

    // Disable button-name rule, should pass
    await expect(
      testAccessibility(container, {
        rules: {
          'button-name': { enabled: false },
        },
      })
    ).resolves.not.toThrow()
  })
})
