import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Gallery from './Gallery'

describe('Gallery', () => {
  it('renders without errors', () => {
    render(<Gallery />)
    const galleryElement = screen.getByRole('img')
    expect(galleryElement).toBeInTheDocument()
  })

  it('displays first image by default', () => {
    render(<Gallery />)
    const firstImage = screen.getByAltText(
      'PVC pipes and construction materials laid out on rooftop'
    )
    expect(firstImage).toBeInTheDocument()
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

    const secondImage = screen.getByAltText(
      'Overhead view of workbench with electronics, laptop and tools'
    )
    expect(secondImage).toBeInTheDocument()
  })

  it('goes back to previous image when previous button is clicked', () => {
    render(<Gallery />)
    const nextButton = screen.getByLabelText('Next image')
    const prevButton = screen.getByLabelText('Previous image')

    fireEvent.click(nextButton)
    fireEvent.click(prevButton)

    const firstImage = screen.getByAltText(
      'PVC pipes and construction materials laid out on rooftop'
    )
    expect(firstImage).toBeInTheDocument()
  })

  it('wraps around to last image when clicking previous on first image', () => {
    render(<Gallery />)
    const prevButton = screen.getByLabelText('Previous image')

    fireEvent.click(prevButton)

    const lastImage = screen.getByAltText(
      'Detail of fabrication process with precision equipment'
    )
    expect(lastImage).toBeInTheDocument()
  })

  it('wraps around to first image when clicking next on last image', () => {
    render(<Gallery />)
    const nextButton = screen.getByLabelText('Next image')

    // Click next 9 times to get to last image and wrap around
    for (let i = 0; i < 9; i++) {
      fireEvent.click(nextButton)
    }

    const firstImage = screen.getByAltText(
      'PVC pipes and construction materials laid out on rooftop'
    )
    expect(firstImage).toBeInTheDocument()
  })

  it('displays indicator dots for all images', () => {
    render(<Gallery />)
    const indicators = screen
      .getAllByRole('button')
      .filter(button =>
        button.getAttribute('aria-label')?.startsWith('Go to image')
      )
    expect(indicators).toHaveLength(9)
  })

  it('allows direct navigation to specific image via indicators', () => {
    render(<Gallery />)
    const thirdIndicator = screen.getByLabelText('Go to image 3')

    fireEvent.click(thirdIndicator)

    const thirdImage = screen.getByAltText(
      'Red shipping container at Frihamnstorget construction site'
    )
    expect(thirdImage).toBeInTheDocument()
  })

  it('images have proper alt text', () => {
    render(<Gallery />)
    const image = screen.getByRole('img')
    expect(image).toHaveAttribute('alt')
    expect(image.getAttribute('alt')).not.toBe('')
  })

  it('images have lazy loading', () => {
    render(<Gallery />)
    const image = screen.getByRole('img')
    expect(image).toHaveAttribute('loading', 'lazy')
  })

  describe('Touch swipe navigation', () => {
    it('advances to next image on left swipe', () => {
      render(<Gallery />)
      const imageContainer = screen.getByRole('img').parentElement

      // Simulate left swipe (start at 200, end at 100)
      fireEvent.touchStart(imageContainer, {
        touches: [{ clientX: 200, clientY: 0 }],
      })
      fireEvent.touchMove(imageContainer, {
        touches: [{ clientX: 100, clientY: 0 }],
      })
      fireEvent.touchEnd(imageContainer)

      const secondImage = screen.getByAltText(
        'Overhead view of workbench with electronics, laptop and tools'
      )
      expect(secondImage).toBeInTheDocument()
    })

    it('goes to previous image on right swipe', () => {
      render(<Gallery />)
      const imageContainer = screen.getByRole('img').parentElement

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

      const firstImage = screen.getByAltText(
        'PVC pipes and construction materials laid out on rooftop'
      )
      expect(firstImage).toBeInTheDocument()
    })

    it('does not navigate on small swipe below threshold', () => {
      render(<Gallery />)
      const imageContainer = screen.getByRole('img').parentElement

      // Simulate small swipe (only 30px, below 50px threshold)
      fireEvent.touchStart(imageContainer, {
        touches: [{ clientX: 200, clientY: 0 }],
      })
      fireEvent.touchMove(imageContainer, {
        touches: [{ clientX: 170, clientY: 0 }],
      })
      fireEvent.touchEnd(imageContainer)

      // Should still show first image
      const firstImage = screen.getByAltText(
        'PVC pipes and construction materials laid out on rooftop'
      )
      expect(firstImage).toBeInTheDocument()
    })

    it('wraps to last image on right swipe from first image', () => {
      render(<Gallery />)
      const imageContainer = screen.getByRole('img').parentElement

      // Simulate right swipe from first image
      fireEvent.touchStart(imageContainer, {
        touches: [{ clientX: 100, clientY: 0 }],
      })
      fireEvent.touchMove(imageContainer, {
        touches: [{ clientX: 200, clientY: 0 }],
      })
      fireEvent.touchEnd(imageContainer)

      const lastImage = screen.getByAltText(
        'Detail of fabrication process with precision equipment'
      )
      expect(lastImage).toBeInTheDocument()
    })

    it('wraps to first image on left swipe from last image', () => {
      render(<Gallery />)
      const imageContainer = screen.getByRole('img').parentElement
      const nextButton = screen.getByLabelText('Next image')

      // Navigate to last image (9th image, index 8)
      for (let i = 0; i < 8; i++) {
        fireEvent.click(nextButton)
      }

      // Verify we're on the last image
      const lastImage = screen.getByAltText(
        'Detail of fabrication process with precision equipment'
      )
      expect(lastImage).toBeInTheDocument()

      // Simulate left swipe
      fireEvent.touchStart(imageContainer, {
        touches: [{ clientX: 200, clientY: 0 }],
      })
      fireEvent.touchMove(imageContainer, {
        touches: [{ clientX: 100, clientY: 0 }],
      })
      fireEvent.touchEnd(imageContainer)

      // Should wrap to first image
      const firstImage = screen.getByAltText(
        'PVC pipes and construction materials laid out on rooftop'
      )
      expect(firstImage).toBeInTheDocument()
    })
  })

  describe('Keyboard navigation', () => {
    it('advances to next image when right arrow key is pressed', () => {
      render(<Gallery />)

      fireEvent.keyDown(window, { key: 'ArrowRight' })

      const secondImage = screen.getByAltText(
        'Overhead view of workbench with electronics, laptop and tools'
      )
      expect(secondImage).toBeInTheDocument()
    })

    it('goes back to previous image when left arrow key is pressed', () => {
      render(<Gallery />)

      fireEvent.keyDown(window, { key: 'ArrowRight' })
      fireEvent.keyDown(window, { key: 'ArrowLeft' })

      const firstImage = screen.getByAltText(
        'PVC pipes and construction materials laid out on rooftop'
      )
      expect(firstImage).toBeInTheDocument()
    })

    it('wraps to last image when left arrow is pressed on first image', () => {
      render(<Gallery />)

      fireEvent.keyDown(window, { key: 'ArrowLeft' })

      const lastImage = screen.getByAltText(
        'Detail of fabrication process with precision equipment'
      )
      expect(lastImage).toBeInTheDocument()
    })

    it('wraps to first image when right arrow is pressed on last image', () => {
      render(<Gallery />)

      // Navigate to last image using arrow keys
      for (let i = 0; i < 9; i++) {
        fireEvent.keyDown(window, { key: 'ArrowRight' })
      }

      const firstImage = screen.getByAltText(
        'PVC pipes and construction materials laid out on rooftop'
      )
      expect(firstImage).toBeInTheDocument()
    })

    it('does not navigate when other keys are pressed', () => {
      render(<Gallery />)

      fireEvent.keyDown(window, { key: 'a' })
      fireEvent.keyDown(window, { key: 'Enter' })
      fireEvent.keyDown(window, { key: 'Space' })

      const firstImage = screen.getByAltText(
        'PVC pipes and construction materials laid out on rooftop'
      )
      expect(firstImage).toBeInTheDocument()
    })
  })
})
