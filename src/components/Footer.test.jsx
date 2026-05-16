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

  it('displays copyright text', () => {
    render(<Footer />)
    expect(screen.getByText(/Phonosium 2026/)).toBeInTheDocument()
  })

  it('renders Instagram link', () => {
    render(<Footer />)
    const link = screen.getByRole('link', { name: /Instagram/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://www.instagram.com/sonicassembly')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders GitHub link', () => {
    render(<Footer />)
    const link = screen.getByRole('link', { name: /GitHub/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute(
      'href',
      'https://github.com/joshuauaua/phonosium'
    )
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders Sonic Assembly link', () => {
    render(<Footer />)
    const link = screen.getByRole('link', { name: /Sonic Assembly/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://sonicassembly.se')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<Footer />)
    await testAccessibility(container)
  })
})
