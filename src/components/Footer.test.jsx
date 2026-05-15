import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { testAccessibility } from '../test/axe-utils'
import Footer from './Footer'

describe('Footer', () => {
  it('renders footer content', () => {
    render(<Footer />)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<Footer />)
    await testAccessibility(container)
  })
})
