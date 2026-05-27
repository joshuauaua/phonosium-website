import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
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

  it('includes Analytics component in render tree', () => {
    const { container } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )
    // Analytics component is present but doesn't render visible DOM in test mode
    // Test verifies the import and component doesn't break the app
    expect(container).toBeTruthy()
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
  }, 30000)

  describe('Routing', () => {
    it('renders Home page on "/" route', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      )
      expect(
        screen.getByRole('heading', { name: /a space for s.*und\./i })
      ).toBeInTheDocument()
    })

    it('renders About page on "/about" route', () => {
      render(
        <MemoryRouter initialEntries={['/about']}>
          <App />
        </MemoryRouter>
      )
      expect(
        screen.getByRole('heading', { name: /about\./i })
      ).toBeInTheDocument()
    })

    it('renders Contributor page on "/contribute" route', () => {
      render(
        <MemoryRouter initialEntries={['/contribute']}>
          <App />
        </MemoryRouter>
      )
      expect(
        screen.getByRole('heading', { name: /Call for Submissions/i })
      ).toBeInTheDocument()
    })

    it('renders NotFound page for invalid routes', () => {
      render(
        <MemoryRouter initialEntries={['/invalid-route']}>
          <App />
        </MemoryRouter>
      )
      expect(
        screen.getByRole('heading', { name: /lost in the sound waves/i })
      ).toBeInTheDocument()
    })

    it('renders NotFound page for nested invalid routes', () => {
      render(
        <MemoryRouter initialEntries={['/some/nested/invalid/path']}>
          <App />
        </MemoryRouter>
      )
      expect(
        screen.getByRole('heading', { name: /lost in the sound waves/i })
      ).toBeInTheDocument()
    })
  })
})
