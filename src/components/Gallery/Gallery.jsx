import { useState } from 'react'
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

  const goToPrevious = () => {
    setCurrentIndex(prevIndex =>
      prevIndex === 0 ? GALLERY_IMAGES.length - 1 : prevIndex - 1
    )
  }

  const goToNext = () => {
    setCurrentIndex(prevIndex =>
      prevIndex === GALLERY_IMAGES.length - 1 ? 0 : prevIndex + 1
    )
  }

  const currentImage = GALLERY_IMAGES[currentIndex]

  return (
    <div className={styles.gallery}>
      <button
        onClick={goToPrevious}
        className={`${styles.navButton} ${styles.navButtonPrev}`}
        aria-label="Previous image"
      >
        ‹
      </button>

      <div className={styles.imageContainer}>
        <img
          src={currentImage.src}
          alt={currentImage.alt}
          className={styles.image}
          loading="lazy"
        />
      </div>

      <button
        onClick={goToNext}
        className={`${styles.navButton} ${styles.navButtonNext}`}
        aria-label="Next image"
      >
        ›
      </button>

      <div className={styles.indicators}>
        {GALLERY_IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`${styles.indicator} ${
              index === currentIndex ? styles.indicatorActive : ''
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
