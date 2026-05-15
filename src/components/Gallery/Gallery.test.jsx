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
    const indicators = screen.getAllByRole('button').filter(button =>
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
})
