import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
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

    expect(screen.getByText('About the Installation')).toBeInTheDocument()
    expect(
      screen.getByText(/Phonosium is a crowdsourced interactive sound installation/)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/6-speaker system/)
    ).toBeInTheDocument()
  })

  it('displays submission requirements section', () => {
    render(
      <BrowserRouter>
        <Contributor />
      </BrowserRouter>
    )

    expect(screen.getByText('Submission Requirements')).toBeInTheDocument()
    expect(screen.getByText(/One loop \(max 20 MB\)/)).toBeInTheDocument()
    expect(screen.getByText(/Up to 24 samples/)).toBeInTheDocument()
    expect(screen.getByText(/Demo audio/)).toBeInTheDocument()
    expect(screen.getByText(/Title and description/)).toBeInTheDocument()
    expect(screen.getByText(/Links to your work/)).toBeInTheDocument()
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

    expect(screen.queryByText('Artist Information')).not.toBeInTheDocument()
  })
})
