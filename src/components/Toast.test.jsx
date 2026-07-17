import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vite-plus/test'
import Toast from './Toast'

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders with correct message and description', () => {
    render(
      <Toast
        message="Test message"
        description="Test description"
        type="info"
      />
    )

    expect(screen.getByText('Test message')).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()
  })

  it('renders without description when not provided', () => {
    render(<Toast message="Test message" type="info" />)

    expect(screen.getByText('Test message')).toBeInTheDocument()
    expect(screen.queryByText('Test description')).not.toBeInTheDocument()
  })

  it('shows correct styling for info type', () => {
    render(<Toast message="Info message" type="info" />)
    const toast = screen.getByTestId('toast')
    expect(toast).toHaveAttribute('data-type', 'info')
  })

  it('shows correct styling for warning type', () => {
    render(<Toast message="Warning message" type="warning" />)
    const toast = screen.getByTestId('toast')
    expect(toast).toHaveAttribute('data-type', 'warning')
  })

  it('shows correct styling for success type', () => {
    render(<Toast message="Success message" type="success" />)
    const toast = screen.getByTestId('toast')
    expect(toast).toHaveAttribute('data-type', 'success')
  })

  it('shows correct styling for error type', () => {
    render(<Toast message="Error message" type="error" />)
    const toast = screen.getByTestId('toast')
    expect(toast).toHaveAttribute('data-type', 'error')
  })

  it('calls onDismiss when dismiss button clicked', () => {
    const onDismiss = vi.fn()
    render(<Toast message="Test message" type="info" onDismiss={onDismiss} />)

    const dismissButton = screen.getByLabelText('Dismiss notification')
    fireEvent.click(dismissButton)

    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('does not show dismiss button when onDismiss is not provided', () => {
    render(<Toast message="Test message" type="info" />)

    expect(
      screen.queryByLabelText('Dismiss notification')
    ).not.toBeInTheDocument()
  })

  it('auto-dismisses after specified delay', () => {
    const onDismiss = vi.fn()
    render(
      <Toast
        message="Test message"
        type="success"
        onDismiss={onDismiss}
        autoDismissDelay={2000}
      />
    )

    expect(onDismiss).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('does not auto-dismiss when autoDismissDelay is 0', () => {
    const onDismiss = vi.fn()
    render(
      <Toast
        message="Test message"
        type="info"
        onDismiss={onDismiss}
        autoDismissDelay={0}
      />
    )

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(onDismiss).not.toHaveBeenCalled()
  })

  it('cleans up timer on unmount', () => {
    const onDismiss = vi.fn()
    const { unmount } = render(
      <Toast
        message="Test message"
        type="info"
        onDismiss={onDismiss}
        autoDismissDelay={2000}
      />
    )

    unmount()

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    expect(onDismiss).not.toHaveBeenCalled()
  })

  it('has correct icon for each type', () => {
    const { rerender } = render(<Toast message="Test" type="info" />)
    expect(screen.getByTestId('toast-icon')).toHaveTextContent('ℹ️')

    rerender(<Toast message="Test" type="warning" />)
    expect(screen.getByTestId('toast-icon')).toHaveTextContent('⚠️')

    rerender(<Toast message="Test" type="success" />)
    expect(screen.getByTestId('toast-icon')).toHaveTextContent('✓')

    rerender(<Toast message="Test" type="error" />)
    expect(screen.getByTestId('toast-icon')).toHaveTextContent('✗')
  })

  it('has proper ARIA attributes', () => {
    render(<Toast message="Test message" type="info" />)

    const toast = screen.getByRole('alert')
    expect(toast).toHaveAttribute('aria-live', 'polite')
  })
})
