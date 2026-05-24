import { useState } from 'react'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'
import styles from './ExpandableSection.module.css'

export default function ExpandableSection({ number, title, children }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  const handleKeyDown = e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggleExpanded()
    }
  }

  return (
    <div className={styles.expandableSection}>
      <button
        className={styles.header}
        onClick={toggleExpanded}
        onKeyDown={handleKeyDown}
        aria-expanded={isExpanded}
        type="button"
      >
        <h3 className={styles.title}>
          {number}. {title}
        </h3>
        <span className={styles.icon}>
          {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
        </span>
      </button>
      <div
        className={`${styles.content} ${isExpanded ? styles.expanded : ''}`}
        aria-hidden={!isExpanded}
      >
        <div className={styles.contentInner}>{children}</div>
      </div>
    </div>
  )
}
