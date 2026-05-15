import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { testAccessibility } from '../test/axe-utils'
import Footer from './Footer'

describe('Footer', () => {
  it('renders footer element', () => {
    render(<Footer />)
    const footer = screen.getByRole('contentinfo')
    expect(footer).toBeInTheDocument()
  })

  it('displays description text on single line', () => {
    render(<Footer />)
    const description = screen.getByText(
      /Phonosium is a crowdsourced interactive sound installation/
    )
    expect(description).toBeInTheDocument()
    expect(description).toHaveTextContent(
      'Phonosium is a crowdsourced interactive sound installation physically located in Stockholm'
    )
  })

  it('renders Instagram link', () => {
    render(<Footer />)
    const instagramLink = screen.getByLabelText('Instagram')
    expect(instagramLink).toBeInTheDocument()
    expect(instagramLink).toHaveAttribute(
      'href',
      'https://instagram.com/phonosium'
    )
    expect(instagramLink).toHaveAttribute('target', '_blank')
    expect(instagramLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders GitHub link', () => {
    render(<Footer />)
    const githubLink = screen.getByLabelText('GitHub')
    expect(githubLink).toBeInTheDocument()
    expect(githubLink).toHaveAttribute('href', 'https://github.com/phonosium')
    expect(githubLink).toHaveAttribute('target', '_blank')
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders SoundCloud link', () => {
    render(<Footer />)
    const soundcloudLink = screen.getByLabelText('SoundCloud')
    expect(soundcloudLink).toBeInTheDocument()
    expect(soundcloudLink).toHaveAttribute(
      'href',
      'https://soundcloud.com/phonosium'
    )
    expect(soundcloudLink).toHaveAttribute('target', '_blank')
    expect(soundcloudLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders Sonic Assembly credit link', () => {
    render(<Footer />)
    const creditLink = screen.getByRole('link', { name: /Sonic Assembly/i })
    expect(creditLink).toBeInTheDocument()
    expect(creditLink).toHaveAttribute('href', 'https://sonicassembly.com')
    expect(creditLink).toHaveAttribute('target', '_blank')
    expect(creditLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('displays credits text', () => {
    render(<Footer />)
    const credits = screen.getByText(/Project by/i)
    expect(credits).toBeInTheDocument()
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<Footer />)
    await testAccessibility(container)
  })
})
