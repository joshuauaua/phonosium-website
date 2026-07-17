import { describe, it, expect } from 'vite-plus/test'
import { render } from '@testing-library/react'
import Waves from './Waves'

describe('Waves', () => {
  it('renders without crashing', () => {
    const { container } = render(<Waves />)
    expect(container.querySelector('.waves')).toBeInTheDocument()
  })

  it('handles null canvas context gracefully', () => {
    // Test that the component doesn't throw when canvas context is unavailable
    const { container } = render(<Waves />)
    expect(container.querySelector('canvas')).toBeInTheDocument()
    // No error should be thrown during render or animation frames
  })

  it('renders with custom props', () => {
    const { container } = render(
      <Waves
        lineColor="rgba(255, 0, 0, 0.5)"
        backgroundColor="blue"
        waveSpeedX={0.02}
        waveSpeedY={0.01}
        className="custom-waves"
      />
    )
    expect(container.querySelector('.waves')).toBeInTheDocument()
    expect(container.querySelector('.custom-waves')).toBeInTheDocument()
  })
})
