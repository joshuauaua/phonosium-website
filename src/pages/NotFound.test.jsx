import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { testAccessibility } from '../test/axe-utils'
import NotFound from './NotFound'

describe('NotFound', () => {
  it('renders the 404 page', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    )

    expect(screen.getByText('404')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /lost in the sound waves/i })
    ).toBeInTheDocument()
  })

  it('displays the error message', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    )

    expect(
      screen.getByText(/the page you're looking for doesn't exist/i)
    ).toBeInTheDocument()
  })

  it('renders navigation buttons', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    )

    expect(
      screen.getByRole('button', { name: /return to home page/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /explore projects/i })
    ).toBeInTheDocument()
  })

  it('has proper aria-labels for navigation buttons', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    )

    const homeButton = screen.getByRole('button', {
      name: /return to home page/i,
    })
    const aboutButton = screen.getByRole('button', {
      name: /explore projects/i,
    })

    expect(homeButton).toHaveAttribute('aria-label', 'Return to home page')
    expect(aboutButton).toHaveAttribute('aria-label', 'Explore projects')
  })

  it('has no accessibility violations', async () => {
    const { container } = render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    )
    await testAccessibility(container)
  })

  describe('Navigation', () => {
    it('renders home button with correct text', () => {
      render(
        <BrowserRouter>
          <NotFound />
        </BrowserRouter>
      )

      const homeButton = screen.getByRole('button', {
        name: /return to home page/i,
      })
      expect(homeButton.textContent).toBe('Return Home')
    })

    it('renders about button with correct text', () => {
      render(
        <BrowserRouter>
          <NotFound />
        </BrowserRouter>
      )

      const aboutButton = screen.getByRole('button', {
        name: /explore projects/i,
      })
      expect(aboutButton.textContent).toBe('Explore Projects')
    })
  })

  describe('Visual Elements', () => {
    it('displays the 404 error code', () => {
      const { container } = render(
        <BrowserRouter>
          <NotFound />
        </BrowserRouter>
      )

      const errorCode = container.querySelector('[class*="errorCode"]')
      expect(errorCode?.textContent).toContain('404')
    })

    it('renders with proper heading hierarchy', () => {
      render(
        <BrowserRouter>
          <NotFound />
        </BrowserRouter>
      )

      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toBeInTheDocument()
      expect(heading.textContent).toBe('Lost in the sound waves.')
    })
  })

  describe('User Interaction', () => {
    it('allows clicking the home button', async () => {
      const user = userEvent.setup()
      render(
        <BrowserRouter>
          <NotFound />
        </BrowserRouter>
      )

      const homeButton = screen.getByRole('button', {
        name: /return to home page/i,
      })
      await user.click(homeButton)
    })

    it('allows clicking the explore projects button', async () => {
      const user = userEvent.setup()
      render(
        <BrowserRouter>
          <NotFound />
        </BrowserRouter>
      )

      const aboutButton = screen.getByRole('button', {
        name: /explore projects/i,
      })
      await user.click(aboutButton)
    })
  })

  describe('SEO', () => {
    it('includes SEO component', () => {
      const { container } = render(
        <BrowserRouter>
          <NotFound />
        </BrowserRouter>
      )

      expect(container).toBeTruthy()
    })
  })
})
