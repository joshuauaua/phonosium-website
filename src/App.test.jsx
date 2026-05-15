import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { testAccessibility } from './test/axe-utils'
import App from './App'

describe('App', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )
    expect(screen.getAllByRole('main').length).toBeGreaterThan(0)
  })

  it('has no accessibility violations', async () => {
    const { container } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )
    await testAccessibility(container, {
      rules: {
        // Allow aside inside main for sidebar layout patterns
        'landmark-complementary-is-top-level': { enabled: false },
      },
    })
  })
})
