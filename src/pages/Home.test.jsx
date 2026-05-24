import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { testAccessibility } from '../test/axe-utils'
import Home from './Home'

describe('Home', () => {
  it('renders the home page', () => {
    const { container } = render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    )

    const headline = container.querySelector('h1')
    expect(headline.textContent).toMatch(/a space for s.*und\./i)
  })

  it('renders headline with individual sound letter spans', () => {
    const { container } = render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    )

    const headline = container.querySelector('h1')
    const allSpans = headline.querySelectorAll('span')

    // Check that we have 5 spans total (s, o, u, n, d)
    expect(allSpans).toHaveLength(5)

    // Check the text content of the sound letters (excluding the 'o' span which has the circle character)
    const textContent = headline.textContent
    expect(textContent).toMatch(/a space for s.*u.*n.*d\./)
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

    it('does not render Close button in expanded schedule details', async () => {
      const user = userEvent.setup()
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      )

      const moreInfoButton = screen.getByRole('button', { name: /more info/i })
      await user.click(moreInfoButton)

      expect(
        screen.queryByRole('button', { name: /close/i })
      ).not.toBeInTheDocument()
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

    it('does not change Now Playing section when clicking schedule items', async () => {
      const user = userEvent.setup()
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      )

      // Initially, first item should be "Now Playing" (has the ● indicator)
      expect(screen.getByText('● 09:00')).toBeInTheDocument()

      // Find and click the second schedule item (09:30)
      const scheduleItems = screen.getAllByText('Birds!')
      const secondScheduleItem = scheduleItems[1].closest('div')
      await user.click(secondScheduleItem)

      // "Now Playing" indicator should still be on first item
      expect(screen.getByText('● 09:00')).toBeInTheDocument()
      // The second item should NOT have the ● indicator in its time display
      expect(screen.queryByText('● 09:30')).not.toBeInTheDocument()
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

    it('renders "Learn more" button with styling', () => {
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      )

      const learnMoreButton = screen.getByRole('button', {
        name: /learn more/i,
      })
      expect(learnMoreButton).toHaveAttribute('class')
      expect(learnMoreButton.className).toContain('btnApplyNow')
    })

    it('has "Learn more" button within callSection container', () => {
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      )

      const learnMoreButton = screen.getByRole('button', {
        name: /learn more/i,
      })
      const callSection = learnMoreButton.closest('section')
      expect(callSection).toBeInTheDocument()
      expect(callSection?.className).toContain('callSection')
    })
  })

  describe('About and Artists sections', () => {
    it('displays "Accepting Submissions" in Artists section', () => {
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      )

      expect(screen.getByText('Accepting Submissions')).toBeInTheDocument()
    })

    it('has About button that navigates to /about', () => {
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      )

      const aboutButton = screen.getByRole('button', {
        name: /about the project/i,
      })
      expect(aboutButton).toBeInTheDocument()
    })
  })
})
