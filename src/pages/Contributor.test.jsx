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
    expect(screen.getByText('1. The Installation')).toBeInTheDocument()
    expect(screen.getByText('2. The Submission')).toBeInTheDocument()
    expect(screen.getByText('3. The Creative Challenge')).toBeInTheDocument()
  })

  it('displays expandable sections with chevron icons', () => {
    render(
      <BrowserRouter>
        <Contributor />
      </BrowserRouter>
    )

    const expandButtons = screen.getAllByRole('button', {
      name: /The Installation|The Submission|The Creative Challenge/,
    })
    expect(expandButtons).toHaveLength(3)

    expandButtons.forEach(button => {
      expect(button).toHaveAttribute('aria-expanded', 'false')
    })
  })

  it('expands and collapses sections when clicked', async () => {
    const user = userEvent.setup()
    render(
      <BrowserRouter>
        <Contributor />
      </BrowserRouter>
    )

    const installationButton = screen.getByRole('button', {
      name: /1\. The Installation/,
    })

    expect(installationButton).toHaveAttribute('aria-expanded', 'false')

    await user.click(installationButton)

    await waitFor(() => {
      expect(installationButton).toHaveAttribute('aria-expanded', 'true')
    })

    expect(screen.getByText(/3 electret microphones/)).toBeInTheDocument()

    await user.click(installationButton)

    await waitFor(() => {
      expect(installationButton).toHaveAttribute('aria-expanded', 'false')
    })
  })

  it('allows multiple sections to be expanded simultaneously', async () => {
    const user = userEvent.setup()
    render(
      <BrowserRouter>
        <Contributor />
      </BrowserRouter>
    )

    const installationButton = screen.getByRole('button', {
      name: /1\. The Installation/,
    })
    const submissionButton = screen.getByRole('button', {
      name: /2\. The Submission/,
    })

    await user.click(installationButton)
    await user.click(submissionButton)

    await waitFor(() => {
      expect(installationButton).toHaveAttribute('aria-expanded', 'true')
      expect(submissionButton).toHaveAttribute('aria-expanded', 'true')
    })
  })

  it('supports keyboard navigation for expandable sections', async () => {
    const user = userEvent.setup()
    render(
      <BrowserRouter>
        <Contributor />
      </BrowserRouter>
    )

    const installationButton = screen.getByRole('button', {
      name: /1\. The Installation/,
    })

    installationButton.focus()
    await user.keyboard('{Enter}')

    await waitFor(() => {
      expect(installationButton).toHaveAttribute('aria-expanded', 'true')
    })

    await user.keyboard(' ')

    await waitFor(() => {
      expect(installationButton).toHaveAttribute('aria-expanded', 'false')
    })
  })

  it('displays submission requirements section', () => {
    render(
      <BrowserRouter>
        <Contributor />
      </BrowserRouter>
    )

    expect(screen.getByText('What to Submit')).toBeInTheDocument()
    expect(screen.getByText('Submission Criteria')).toBeInTheDocument()

    const whatToSubmitList = screen
      .getByText('What to Submit')
      .closest('div')
      .querySelector('ul')
    const listItems = Array.from(whatToSubmitList.querySelectorAll('li'))

    expect(listItems[0]).toHaveTextContent(/Title and description/)
    expect(listItems[1]).toHaveTextContent(/Cover image/)
    expect(listItems[2]).toHaveTextContent(/Loop file \(loop\.wav\)/)
    expect(listItems[3]).toHaveTextContent(/Sample files \(up to 24 allowed\)/)
    expect(listItems[4]).toHaveTextContent(
      /Demo audio: Please provide a recording that demonstrates how your piece sounds/
    )
    expect(listItems[4]).toHaveTextContent(/uploaded to our SoundCloud/)
    expect(listItems[5]).toHaveTextContent(/Links to your work/)

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
