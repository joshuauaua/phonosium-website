import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { testAccessibility } from '../test/axe-utils'
import Home from './Home'

describe('Home', () => {
  it('renders the home page', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    )

    expect(screen.getByText(/a space for s/i)).toBeInTheDocument()
  })

  it('has no accessibility violations', async () => {
    const { container } = render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    )
    await testAccessibility(container)
  })

  describe('Track Info Expansion', () => {
    it('shows "More Info" button initially', () => {
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      )

      expect(
        screen.getByRole('button', { name: /more info/i })
      ).toBeInTheDocument()
    })

    it('expands track info when "More Info" button is clicked', async () => {
      const user = userEvent.setup()
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      )

      const moreInfoButton = screen.getByRole('button', { name: /more info/i })
      await user.click(moreInfoButton)

      expect(screen.getByText('No Image Available')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument()
    })

    it('displays track details when expanded', async () => {
      const user = userEvent.setup()
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      )

      const moreInfoButton = screen.getByRole('button', { name: /more info/i })
      await user.click(moreInfoButton)

      expect(
        screen.getAllByText(/Algorithmic avian composition/i).length
      ).toBeGreaterThan(0)
      expect(screen.getAllByText(/Joshua Ng/i).length).toBeGreaterThan(0)
      expect(
        screen.getAllByText(/Stockholm\/Sheffield/i).length
      ).toBeGreaterThan(0)
      expect(screen.getAllByText(/Year/i).length).toBeGreaterThan(0)
      expect(screen.getAllByText(/2025/).length).toBeGreaterThan(0)
      expect(screen.getAllByText(/Duration/i).length).toBeGreaterThan(0)
      expect(screen.getAllByText(/Medium/i).length).toBeGreaterThan(0)
    })

    it('displays tags when expanded', async () => {
      const user = userEvent.setup()
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      )

      const moreInfoButton = screen.getByRole('button', { name: /more info/i })
      await user.click(moreInfoButton)

      expect(screen.getAllByText('generative').length).toBeGreaterThan(0)
      expect(screen.getAllByText('birdsong').length).toBeGreaterThan(0)
      expect(screen.getAllByText('algorithm').length).toBeGreaterThan(0)
      expect(screen.getAllByText('field recording').length).toBeGreaterThan(0)
    })

    it('displays artist website link when expanded', async () => {
      const user = userEvent.setup()
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      )

      const moreInfoButton = screen.getByRole('button', { name: /more info/i })
      await user.click(moreInfoButton)

      const websiteLink = screen.getByRole('link', {
        name: /visit artist website/i,
      })
      expect(websiteLink).toBeInTheDocument()
      expect(websiteLink).toHaveAttribute(
        'href',
        'https://joshuauaua.github.io'
      )
      expect(websiteLink).toHaveAttribute('target', '_blank')
    })

    it('collapses track info when "Close" button is clicked', async () => {
      const user = userEvent.setup()
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      )

      const moreInfoButton = screen.getByRole('button', { name: /more info/i })
      await user.click(moreInfoButton)

      const closeButton = screen.getByRole('button', { name: /close/i })
      await user.click(closeButton)

      expect(screen.queryByText('No Image Available')).not.toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /more info/i })
      ).toBeInTheDocument()
    })
  })

  describe('Schedule Section', () => {
    it('displays day and date in schedule header', () => {
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      )

      const dateText = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      })

      expect(screen.getByText(dateText)).toBeInTheDocument()
    })

    it('displays time format instead of slot numbers', () => {
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      )

      expect(screen.getByText('● 09:00')).toBeInTheDocument()
      expect(screen.getByText('09:30')).toBeInTheDocument()
      expect(screen.queryByText(/Slot 01/)).not.toBeInTheDocument()
      expect(screen.queryByText(/Slot 02/)).not.toBeInTheDocument()
    })
  })
})
