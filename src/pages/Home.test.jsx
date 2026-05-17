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

  describe('Schedule Item Expansion', () => {
    it('shows "More Info" button in black section', () => {
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      )

      expect(
        screen.getByRole('button', { name: /more info/i })
      ).toBeInTheDocument()
    })

    it('expands schedule item when "More Info" button in black section is clicked', async () => {
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

    it('expands schedule item when clicked directly', async () => {
      const user = userEvent.setup()
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      )

      const scheduleItems = screen.getAllByText('Birds!')
      const scheduleItemRow = scheduleItems[1].closest('div')
      await user.click(scheduleItemRow)

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

    it('collapses schedule item when "Close" button is clicked', async () => {
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
    })

    it('collapses when clicking the same schedule item again', async () => {
      const user = userEvent.setup()
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      )

      const scheduleItems = screen.getAllByText('Birds!')
      const scheduleItemRow = scheduleItems[1].closest('div')
      await user.click(scheduleItemRow)

      expect(screen.getByText('No Image Available')).toBeInTheDocument()

      await user.click(scheduleItemRow)

      expect(screen.queryByText('No Image Available')).not.toBeInTheDocument()
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

  describe('Call for Submissions Section', () => {
    it('displays Call for Submissions section at bottom of page', () => {
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      )

      expect(screen.getByText('Call for Submissions')).toBeInTheDocument()
      expect(
        screen.getByText(
          /We are accepting submissions for the installation from anywhere in the world until June 15, 2026/
        )
      ).toBeInTheDocument()
    })

    it('does not display inline submission requirements', () => {
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      )

      expect(
        screen.queryByText('Submission Requirements')
      ).not.toBeInTheDocument()
      expect(
        screen.queryByText(/One loop \(max 20 MB\)/)
      ).not.toBeInTheDocument()
    })

    it('does not display contact email on home page', () => {
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      )

      expect(
        screen.queryByRole('link', { name: /hej@sonicassembly\.se/i })
      ).not.toBeInTheDocument()
    })

    it('displays "Learn more" button', () => {
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      )

      const learnMoreButton = screen.getByRole('button', {
        name: /learn more/i,
      })
      expect(learnMoreButton).toBeInTheDocument()
    })

    it('does not open submission form when button is clicked', async () => {
      const user = userEvent.setup()
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      )

      const learnMoreButton = screen.getByRole('button', {
        name: /learn more/i,
      })
      await user.click(learnMoreButton)

      expect(screen.queryByText('Artist Information')).not.toBeInTheDocument()
    })

    it('renders "Learn more" button with correct CSS classes', () => {
      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      )

      const learnMoreButton = screen.getByRole('button', {
        name: /learn more/i,
      })
      expect(learnMoreButton).toHaveClass('btnApplyNow')
    })

    it('has "Learn more" button within callSection container', () => {
      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      )

      const learnMoreButton = screen.getByRole('button', {
        name: /learn more/i,
      })
      const callSection = learnMoreButton.closest('section')
      expect(callSection).toBeInTheDocument()
      expect(callSection).toHaveClass('callSection')
    })
  })
})
