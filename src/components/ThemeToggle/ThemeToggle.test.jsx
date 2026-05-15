import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ThemeToggle from './ThemeToggle'

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  afterEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  it('renders with system theme by default', () => {
    render(<ThemeToggle />)
    const button = screen.getByRole('button', { name: /Theme: System/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('System')
    expect(button).toHaveTextContent('🔄')
  })

  it('loads light theme from localStorage', () => {
    localStorage.setItem('theme', 'light')
    render(<ThemeToggle />)
    const button = screen.getByRole('button', { name: /Theme: Light/i })
    expect(button).toHaveTextContent('Light')
    expect(button).toHaveTextContent('☀️')
  })

  it('loads dark theme from localStorage', () => {
    localStorage.setItem('theme', 'dark')
    render(<ThemeToggle />)
    const button = screen.getByRole('button', { name: /Theme: Dark/i })
    expect(button).toHaveTextContent('Dark')
    expect(button).toHaveTextContent('🌙')
  })

  it('cycles from light to dark to system to light', async () => {
    localStorage.setItem('theme', 'light')
    const user = userEvent.setup()
    render(<ThemeToggle />)

    // Start: Light
    let button = screen.getByRole('button', { name: /Theme: Light/i })
    expect(button).toHaveTextContent('Light')

    // Click: Light → Dark
    await user.click(button)
    button = screen.getByRole('button', { name: /Theme: Dark/i })
    expect(button).toHaveTextContent('Dark')

    // Click: Dark → System
    await user.click(button)
    button = screen.getByRole('button', { name: /Theme: System/i })
    expect(button).toHaveTextContent('System')

    // Click: System → Light
    await user.click(button)
    button = screen.getByRole('button', { name: /Theme: Light/i })
    expect(button).toHaveTextContent('Light')
  })

  it('updates localStorage when theme changes to light', async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)

    const button = screen.getByRole('button')
    await user.click(button) // System → Light

    expect(localStorage.getItem('theme')).toBe('light')
  })

  it('updates localStorage when theme changes to dark', async () => {
    const user = userEvent.setup()
    localStorage.setItem('theme', 'light')
    render(<ThemeToggle />)

    const button = screen.getByRole('button')
    await user.click(button) // Light → Dark

    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it('removes localStorage when theme changes to system', async () => {
    const user = userEvent.setup()
    localStorage.setItem('theme', 'dark')
    render(<ThemeToggle />)

    const button = screen.getByRole('button')
    await user.click(button) // Dark → System

    expect(localStorage.getItem('theme')).toBeNull()
  })

  it('sets data-theme attribute on documentElement for light theme', async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)

    const button = screen.getByRole('button')
    await user.click(button) // System → Light

    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })

  it('sets data-theme attribute on documentElement for dark theme', async () => {
    const user = userEvent.setup()
    localStorage.setItem('theme', 'light')
    render(<ThemeToggle />)

    const button = screen.getByRole('button')
    await user.click(button) // Light → Dark

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  it('removes data-theme attribute on documentElement for system theme', async () => {
    const user = userEvent.setup()
    localStorage.setItem('theme', 'dark')
    render(<ThemeToggle />)

    // Initially dark, so data-theme should be set
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')

    const button = screen.getByRole('button')
    await user.click(button) // Dark → System

    expect(document.documentElement.hasAttribute('data-theme')).toBe(false)
  })

  it('displays correct icon for light theme', () => {
    localStorage.setItem('theme', 'light')
    render(<ThemeToggle />)
    expect(screen.getByRole('button')).toHaveTextContent('☀️')
  })

  it('displays correct icon for dark theme', () => {
    localStorage.setItem('theme', 'dark')
    render(<ThemeToggle />)
    expect(screen.getByRole('button')).toHaveTextContent('🌙')
  })

  it('displays correct icon for system theme', () => {
    render(<ThemeToggle />)
    expect(screen.getByRole('button')).toHaveTextContent('🔄')
  })

  it('has accessible aria-label', () => {
    render(<ThemeToggle />)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label')
    expect(button.getAttribute('aria-label')).toMatch(/Theme:.*Click to cycle themes/)
  })
})
