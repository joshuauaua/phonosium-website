import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { testAccessibility } from '../test/axe-utils'
import Contributor from './Contributor'

describe('Contributor', () => {
  it('renders the page title "Call for Submissions"', () => {
    render(
      <BrowserRouter>
        <Contributor />
      </BrowserRouter>
    )

    expect(screen.getByText('Call for Submissions')).toBeInTheDocument()
  })

  it('displays the subtitle with deadline information', () => {
    render(
      <BrowserRouter>
        <Contributor />
      </BrowserRouter>
    )

    expect(
      screen.getByText(
        /We are accepting submissions for the installation from anywhere in the world until June 15, 2026/
      )
    ).toBeInTheDocument()
  })

  it('displays the description section before criteria', () => {
    render(
      <BrowserRouter>
        <Contributor />
      </BrowserRouter>
    )

    expect(screen.getByText('How it Works')).toBeInTheDocument()
    expect(
      screen.getByText(
        /Phonosium is a crowdsourced, interactive sound installation/
      )
    ).toBeInTheDocument()
    expect(screen.getByText('1. The Instrument')).toBeInTheDocument()
    expect(screen.getByText('2. Submission Structure')).toBeInTheDocument()
    expect(screen.getByText('3. The Creative Challenge')).toBeInTheDocument()
  })

  it('displays submission requirements section', () => {
    render(
      <BrowserRouter>
        <Contributor />
      </BrowserRouter>
    )

    expect(screen.getByText('What to Submit')).toBeInTheDocument()
    expect(screen.getByText('Submission Criteria')).toBeInTheDocument()
    expect(screen.getByText(/One loop file/)).toBeInTheDocument()
    expect(screen.getByText(/Up to 24 sample files/)).toBeInTheDocument()
    expect(screen.getByText(/Demo audio link/)).toBeInTheDocument()
    expect(screen.getByText(/Title and description/)).toBeInTheDocument()
    expect(screen.getByText(/Links to your work/)).toBeInTheDocument()
    expect(screen.getByText(/Audio format: 44\.1 kHz/)).toBeInTheDocument()
    expect(screen.getByText(/Loop file: max 20 MB/)).toBeInTheDocument()
  })

  it('displays "Apply now" button', () => {
    render(
      <BrowserRouter>
        <Contributor />
      </BrowserRouter>
    )

    const applyButton = screen.getByRole('button', { name: /apply now/i })
    expect(applyButton).toBeInTheDocument()
  })

  it('displays contact email link', () => {
    render(
      <BrowserRouter>
        <Contributor />
      </BrowserRouter>
    )

    const emailLink = screen.getByRole('link', {
      name: /hej@sonicassembly\.se/i,
    })
    expect(emailLink).toBeInTheDocument()
    expect(emailLink).toHaveAttribute('href', 'mailto:hej@sonicassembly.se')
  })

  it('opens submission form modal when "Apply now" button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <BrowserRouter>
        <Contributor />
      </BrowserRouter>
    )

    const applyButton = screen.getByRole('button', { name: /apply now/i })
    await user.click(applyButton)

    expect(screen.getByText('Artist Information')).toBeInTheDocument()
    expect(screen.getByText(/step 1 of 3/i)).toBeInTheDocument()
  })

  it('closes submission form modal when close button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <BrowserRouter>
        <Contributor />
      </BrowserRouter>
    )

    const applyButton = screen.getByRole('button', { name: /apply now/i })
    await user.click(applyButton)

    const closeButton = screen.getByRole('button', { name: '×' })
    await user.click(closeButton)

    await waitFor(
      () => {
        expect(screen.queryByText('Artist Information')).not.toBeInTheDocument()
      },
      { timeout: 300 }
    )
  })

  it('has no accessibility violations', async () => {
    const { container } = render(
      <BrowserRouter>
        <Contributor />
      </BrowserRouter>
    )
    await testAccessibility(container)
  })
})
