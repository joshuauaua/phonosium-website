import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { testAccessibility } from '../../test/axe-utils'
import ThemeToggle from './ThemeToggle'

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders theme toggle button', () => {
    render(<ThemeToggle />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('has no accessibility violations in light mode', async () => {
    localStorage.setItem('theme', 'light')
    const { container } = render(<ThemeToggle />)
    await testAccessibility(container)
  })

  it('has no accessibility violations in dark mode', async () => {
    localStorage.setItem('theme', 'dark')
    const { container } = render(<ThemeToggle />)
    await testAccessibility(container)
  })
})
