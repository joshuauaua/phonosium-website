import { useState, useRef, useEffect } from 'react'
import styles from './Gallery.module.css'

const GALLERY_IMAGES = [
  {
    src: '/images/gallery/materials-roof.jpg',
    alt: 'PVC pipes and construction materials laid out on rooftop',
  },
  {
    src: '/images/gallery/workspace-overhead.jpg',
    alt: 'Overhead view of workbench with electronics, laptop and tools',
  },
  {
    src: '/images/gallery/container-exterior.jpg',
    alt: 'Red shipping container at Frihamnstorget construction site',
  },
  {
    src: '/images/gallery/frihamnstorget-containers.jpg',
    alt: 'Multiple containers at Frihamnstorget waterfront location',
  },
  {
    src: '/images/gallery/site-view-deck.jpg',
    alt: 'Wide view of installation site with wooden deck and water',
  },
  {
    src: '/images/gallery/workbench-electronics.jpg',
    alt: 'Electronics workbench with circuit boards and testing equipment',
  },
  {
    src: '/images/gallery/equipment-foam-box.jpg',
    alt: 'Equipment storage with foam-lined protective case',
  },
  {
    src: '/images/gallery/workbench-fabrication.jpg',
    alt: 'Fabrication workbench with tools and materials',
  },
  {
    src: '/images/gallery/fabrication-tool.jpg',
    alt: 'Detail of fabrication process with precision equipment',
  },
]

export default function Gallery() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const [imagesPerView, setImagesPerView] = useState(3)
  const SWIPE_THRESHOLD = 50 // minimum distance in pixels to trigger swipe

  // Determine how many images to show based on viewport
  useEffect(() => {
    const updateImagesPerView = () => {
      if (window.innerWidth < 640) {
        setImagesPerView(1) // Mobile: 1 image
      } else if (window.innerWidth < 1024) {
        setImagesPerView(2) // Tablet: 2 images
      } else {
        setImagesPerView(3) // Desktop: 3 images
      }
    }

    updateImagesPerView()
    window.addEventListener('resize', updateImagesPerView)
    return () => window.removeEventListener('resize', updateImagesPerView)
  }, [])

  const maxIndex = Math.max(0, GALLERY_IMAGES.length - imagesPerView)

  const goToPrevious = () => {
    setCurrentIndex(prevIndex => Math.max(0, prevIndex - 1))
  }

  const goToNext = () => {
    setCurrentIndex(prevIndex => Math.min(maxIndex, prevIndex + 1))
  }

  const handleTouchStart = e => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = e => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    const swipeDistance = touchStartX.current - touchEndX.current

    if (Math.abs(swipeDistance) >= SWIPE_THRESHOLD) {
      if (swipeDistance > 0) {
        // Swiped left - go to next
        goToNext()
      } else {
        // Swiped right - go to previous
        goToPrevious()
      }
    }

    // Reset values
    touchStartX.current = 0
    touchEndX.current = 0
  }

  useEffect(() => {
    const handleKeyDown = event => {
      if (event.key === 'ArrowLeft') {
        goToPrevious()
      } else if (event.key === 'ArrowRight') {
        goToNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [maxIndex])

  const visibleImages = GALLERY_IMAGES.slice(
    currentIndex,
    currentIndex + imagesPerView
  )

  return (
    <div className={styles.gallery}>
      <button
        onClick={goToPrevious}
        className={`${styles.navButton} ${styles.navButtonPrev}`}
        aria-label="Previous image"
        disabled={currentIndex === 0}
        style={{ opacity: currentIndex === 0 ? 0.3 : 1 }}
      >
        ‹
      </button>

      <div
        className={styles.imageContainer}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {visibleImages.map((image, idx) => (
          <img
            key={currentIndex + idx}
            src={image.src}
            alt={image.alt}
            className={styles.image}
            loading="lazy"
          />
        ))}
      </div>

      <button
        onClick={goToNext}
        className={`${styles.navButton} ${styles.navButtonNext}`}
        aria-label="Next image"
        disabled={currentIndex >= maxIndex}
        style={{ opacity: currentIndex >= maxIndex ? 0.3 : 1 }}
      >
        ›
      </button>

      <div className={styles.indicators}>
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`${styles.indicator} ${
              index === currentIndex ? styles.indicatorActive : ''
            }`}
            aria-label={`Go to position ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
