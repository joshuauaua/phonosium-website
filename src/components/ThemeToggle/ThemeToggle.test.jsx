import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ThemeToggle from './ThemeToggle'

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('renders with initial system theme', () => {
    render(<ThemeToggle />)
    expect(screen.getByText('System')).toBeInTheDocument()
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Theme: System. Click or press Ctrl+Shift+T to cycle themes.')
  })

  it('cycles through themes on button click', () => {
    render(<ThemeToggle />)
    const button = screen.getByRole('button')

    expect(screen.getByText('System')).toBeInTheDocument()

    fireEvent.click(button)
    expect(screen.getByText('Light')).toBeInTheDocument()

    fireEvent.click(button)
    expect(screen.getByText('Dark')).toBeInTheDocument()

    fireEvent.click(button)
    expect(screen.getByText('System')).toBeInTheDocument()
  })

  it('toggles theme with Ctrl+Shift+T keyboard shortcut', () => {
    render(<ThemeToggle />)

    expect(screen.getByText('System')).toBeInTheDocument()

    fireEvent.keyDown(window, { ctrlKey: true, shiftKey: true, key: 'T' })
    expect(screen.getByText('Light')).toBeInTheDocument()

    fireEvent.keyDown(window, { ctrlKey: true, shiftKey: true, key: 'T' })
    expect(screen.getByText('Dark')).toBeInTheDocument()

    fireEvent.keyDown(window, { ctrlKey: true, shiftKey: true, key: 'T' })
    expect(screen.getByText('System')).toBeInTheDocument()
  })

  it('toggles theme with Cmd+Shift+T keyboard shortcut (macOS)', () => {
    render(<ThemeToggle />)

    expect(screen.getByText('System')).toBeInTheDocument()

    fireEvent.keyDown(window, { metaKey: true, shiftKey: true, key: 'T' })
    expect(screen.getByText('Light')).toBeInTheDocument()

    fireEvent.keyDown(window, { metaKey: true, shiftKey: true, key: 'T' })
    expect(screen.getByText('Dark')).toBeInTheDocument()

    fireEvent.keyDown(window, { metaKey: true, shiftKey: true, key: 'T' })
    expect(screen.getByText('System')).toBeInTheDocument()
  })

  it('does not toggle theme with incorrect key combinations', () => {
    render(<ThemeToggle />)

    expect(screen.getByText('System')).toBeInTheDocument()

    fireEvent.keyDown(window, { ctrlKey: true, key: 'T' })
    expect(screen.getByText('System')).toBeInTheDocument()

    fireEvent.keyDown(window, { shiftKey: true, key: 'T' })
    expect(screen.getByText('System')).toBeInTheDocument()

    fireEvent.keyDown(window, { ctrlKey: true, shiftKey: true, key: 'A' })
    expect(screen.getByText('System')).toBeInTheDocument()
  })

  it('prevents default browser behavior on keyboard shortcut', () => {
    render(<ThemeToggle />)

    const event = new KeyboardEvent('keydown', {
      ctrlKey: true,
      shiftKey: true,
      key: 'T',
      bubbles: true,
      cancelable: true
    })
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault')

    window.dispatchEvent(event)

    expect(preventDefaultSpy).toHaveBeenCalled()
  })

  it('updates localStorage when theme changes', () => {
    render(<ThemeToggle />)

    expect(localStorage.getItem('theme')).toBeNull()

    fireEvent.keyDown(window, { ctrlKey: true, shiftKey: true, key: 'T' })
    expect(localStorage.getItem('theme')).toBe('light')

    fireEvent.keyDown(window, { ctrlKey: true, shiftKey: true, key: 'T' })
    expect(localStorage.getItem('theme')).toBe('dark')

    fireEvent.keyDown(window, { ctrlKey: true, shiftKey: true, key: 'T' })
    expect(localStorage.getItem('theme')).toBeNull()
  })

  it('removes event listener on component unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
    const { unmount } = render(<ThemeToggle />)

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
    removeEventListenerSpy.mockRestore()
  })
})
