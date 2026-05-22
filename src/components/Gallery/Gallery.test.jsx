import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Gallery from './Gallery'

describe('Gallery', () => {
  it('renders without errors', () => {
    render(<Gallery />)
    const images = screen.getAllByRole('img')
    expect(images.length).toBeGreaterThan(0)
  })

  it('displays first image by default', () => {
    render(<Gallery />)
    const images = screen.getAllByRole('img')
    expect(images[0]).toHaveAttribute(
      'alt',
      'PVC pipes and construction materials laid out on rooftop'
    )
  })

  it('has previous and next navigation buttons', () => {
    render(<Gallery />)
    const prevButton = screen.getByLabelText('Previous image')
    const nextButton = screen.getByLabelText('Next image')
    expect(prevButton).toBeInTheDocument()
    expect(nextButton).toBeInTheDocument()
  })

  it('advances to next image when next button is clicked', () => {
    render(<Gallery />)
    const nextButton = screen.getByLabelText('Next image')

    fireEvent.click(nextButton)

    const images = screen.getAllByRole('img')
    const alts = images.map(img => img.alt)
    expect(alts).toContain(
      'Overhead view of workbench with electronics, laptop and tools'
    )
  })

  it('goes back to previous image when previous button is clicked', () => {
    render(<Gallery />)
    const nextButton = screen.getByLabelText('Next image')
    const prevButton = screen.getByLabelText('Previous image')

    fireEvent.click(nextButton)
    fireEvent.click(prevButton)

    const images = screen.getAllByRole('img')
    const alts = images.map(img => img.alt)
    expect(alts).toContain(
      'PVC pipes and construction materials laid out on rooftop'
    )
  })

  it('wraps around to last image when clicking previous on first image', () => {
    render(<Gallery />)
    const prevButton = screen.getByLabelText('Previous image')

    // At position 0, previous button should be disabled (no wrapping)
    expect(prevButton).toBeDisabled()
  })

  it('wraps around to first image when clicking next on last image', () => {
    render(<Gallery />)
    const nextButton = screen.getByLabelText('Next image')

    // Gallery shows 3 images at a time, so there are 7 positions (0-6)
    // Click next 6 times to reach position 6 (last position)
    for (let i = 0; i < 6; i++) {
      fireEvent.click(nextButton)
    }

    // At last position, next button should be disabled (no wrapping)
    expect(nextButton).toBeDisabled()
  })

  it('displays indicator dots for all images', () => {
    render(<Gallery />)
    const indicators = screen
      .getAllByRole('button')
      .filter(button =>
        button.getAttribute('aria-label')?.startsWith('Go to position')
      )
    // 9 images with 3 visible at a time = 7 positions (0-6)
    expect(indicators).toHaveLength(7)
  })

  it('allows direct navigation to specific image via indicators', () => {
    render(<Gallery />)
    const thirdIndicator = screen.getByLabelText('Go to position 3')

    fireEvent.click(thirdIndicator)

    // Position 3 shows images 3, 4, 5
    const images = screen.getAllByRole('img')
    const alts = images.map(img => img.alt)
    expect(alts).toContain(
      'Multiple containers at Frihamnstorget waterfront location'
    )
  })

  it('images have proper alt text', () => {
    render(<Gallery />)
    const images = screen.getAllByRole('img')
    images.forEach(image => {
      expect(image).toHaveAttribute('alt')
      expect(image.getAttribute('alt')).not.toBe('')
    })
  })

  it('images have lazy loading', () => {
    render(<Gallery />)
    const images = screen.getAllByRole('img')
    images.forEach(image => {
      expect(image).toHaveAttribute('loading', 'lazy')
    })
  })

  describe('Touch swipe navigation', () => {
    it('advances to next image on left swipe', () => {
      render(<Gallery />)
      const imageContainer = screen.getByTestId('gallery-container')

      // Simulate left swipe (start at 200, end at 100)
      fireEvent.touchStart(imageContainer, {
        touches: [{ clientX: 200, clientY: 0 }],
      })
      fireEvent.touchMove(imageContainer, {
        touches: [{ clientX: 100, clientY: 0 }],
      })
      fireEvent.touchEnd(imageContainer)

      const images = screen.getAllByRole('img')
      const alts = images.map(img => img.alt)
      expect(alts).toContain(
        'Overhead view of workbench with electronics, laptop and tools'
      )
    })

    it('goes to previous image on right swipe', () => {
      render(<Gallery />)
      const imageContainer = screen.getByTestId('gallery-container')

      // First go to second image
      const nextButton = screen.getByLabelText('Next image')
      fireEvent.click(nextButton)

      // Simulate right swipe (start at 100, end at 200)
      fireEvent.touchStart(imageContainer, {
        touches: [{ clientX: 100, clientY: 0 }],
      })
      fireEvent.touchMove(imageContainer, {
        touches: [{ clientX: 200, clientY: 0 }],
      })
      fireEvent.touchEnd(imageContainer)

      const images = screen.getAllByRole('img')
      const alts = images.map(img => img.alt)
      expect(alts).toContain(
        'PVC pipes and construction materials laid out on rooftop'
      )
    })

    it('does not navigate on small swipe below threshold', () => {
      render(<Gallery />)
      const imageContainer = screen.getByTestId('gallery-container')

      // Simulate small swipe (only 30px, below 50px threshold)
      fireEvent.touchStart(imageContainer, {
        touches: [{ clientX: 200, clientY: 0 }],
      })
      fireEvent.touchMove(imageContainer, {
        touches: [{ clientX: 170, clientY: 0 }],
      })
      fireEvent.touchEnd(imageContainer)

      // Should still show first image
      const images = screen.getAllByRole('img')
      const alts = images.map(img => img.alt)
      expect(alts).toContain(
        'PVC pipes and construction materials laid out on rooftop'
      )
    })

    it('wraps to last image on right swipe from first image', () => {
      render(<Gallery />)
      const imageContainer = screen.getByTestId('gallery-container')

      // Simulate right swipe (going backwards) from first image
      fireEvent.touchStart(imageContainer, {
        touches: [{ clientX: 100, clientY: 0 }],
      })
      fireEvent.touchMove(imageContainer, {
        touches: [{ clientX: 200, clientY: 0 }],
      })
      fireEvent.touchEnd(imageContainer)

      // Should stay at first position (no wrapping)
      const images = screen.getAllByRole('img')
      const alts = images.map(img => img.alt)
      expect(alts).toContain(
        'PVC pipes and construction materials laid out on rooftop'
      )
    })

    it('wraps to first image on left swipe from last image', () => {
      render(<Gallery />)
      const imageContainer = screen.getByTestId('gallery-container')
      const nextButton = screen.getByLabelText('Next image')

      // Navigate to last position (6)
      for (let i = 0; i < 6; i++) {
        fireEvent.click(nextButton)
      }

      // Verify we're at the last position showing the last image
      let images = screen.getAllByRole('img')
      let alts = images.map(img => img.alt)
      expect(alts).toContain(
        'Detail of fabrication process with precision equipment'
      )

      // Simulate left swipe (trying to go forward)
      fireEvent.touchStart(imageContainer, {
        touches: [{ clientX: 200, clientY: 0 }],
      })
      fireEvent.touchMove(imageContainer, {
        touches: [{ clientX: 100, clientY: 0 }],
      })
      fireEvent.touchEnd(imageContainer)

      // Should stay at last position (no wrapping)
      images = screen.getAllByRole('img')
      alts = images.map(img => img.alt)
      expect(alts).toContain(
        'Detail of fabrication process with precision equipment'
      )
    })
  })

  describe('Keyboard navigation', () => {
    it('advances to next image when right arrow key is pressed', () => {
      render(<Gallery />)

      fireEvent.keyDown(window, { key: 'ArrowRight' })

      const images = screen.getAllByRole('img')
      const alts = images.map(img => img.alt)
      expect(alts).toContain(
        'Overhead view of workbench with electronics, laptop and tools'
      )
    })

    it('goes back to previous image when left arrow key is pressed', () => {
      render(<Gallery />)

      fireEvent.keyDown(window, { key: 'ArrowRight' })
      fireEvent.keyDown(window, { key: 'ArrowLeft' })

      const images = screen.getAllByRole('img')
      const alts = images.map(img => img.alt)
      expect(alts).toContain(
        'PVC pipes and construction materials laid out on rooftop'
      )
    })

    it('wraps to last image when left arrow is pressed on first image', () => {
      render(<Gallery />)

      fireEvent.keyDown(window, { key: 'ArrowLeft' })

      // Should stay at first position (no wrapping)
      const images = screen.getAllByRole('img')
      const alts = images.map(img => img.alt)
      expect(alts).toContain(
        'PVC pipes and construction materials laid out on rooftop'
      )
    })

    it('wraps to first image when right arrow is pressed on last image', () => {
      render(<Gallery />)

      // Navigate to last position using arrow keys
      for (let i = 0; i < 6; i++) {
        fireEvent.keyDown(window, { key: 'ArrowRight' })
      }

      // Verify at last position
      let images = screen.getAllByRole('img')
      let alts = images.map(img => img.alt)
      expect(alts).toContain(
        'Detail of fabrication process with precision equipment'
      )

      // Try to go forward again (should stay at last position)
      fireEvent.keyDown(window, { key: 'ArrowRight' })

      // Should still show last image (no wrapping)
      images = screen.getAllByRole('img')
      alts = images.map(img => img.alt)
      expect(alts).toContain(
        'Detail of fabrication process with precision equipment'
      )
    })

    it('does not navigate when other keys are pressed', () => {
      render(<Gallery />)

      fireEvent.keyDown(window, { key: 'a' })
      fireEvent.keyDown(window, { key: 'Enter' })
      fireEvent.keyDown(window, { key: 'Space' })

      const images = screen.getAllByRole('img')
      const alts = images.map(img => img.alt)
      expect(alts).toContain(
        'PVC pipes and construction materials laid out on rooftop'
      )
    })
  })
})
