import { memo, useCallback } from 'react'
import styles from './InstallationList.module.css'

const InstallationItem = memo(function InstallationItem({
  inst,
  isSelected,
  onSelect,
}) {
  const handleClick = useCallback(() => {
    onSelect(inst.id)
  }, [inst.id, onSelect])

  return (
    <li>
      <button
        className={`${styles.item} ${isSelected ? styles.selected : ''}`}
        onClick={handleClick}
        aria-label={`Select ${inst.title}`}
        aria-pressed={isSelected}
      >
        <div className={styles.itemTop}>
          <span className={styles.itemNumber}>
            {String(inst.id).padStart(2, '0')}
          </span>
          {isSelected && <span className={styles.playingTag}>Playing</span>}
        </div>
        <div className={styles.itemTitle}>{inst.title}</div>
        <div className={styles.itemMeta}>
          <span>{inst.artist.name}</span>
          <span className={styles.dot}>·</span>
          <span>{inst.year}</span>
          <span className={styles.dot}>·</span>
          <span>{inst.duration}</span>
        </div>
      </button>
    </li>
  )
})

export default function InstallationList({
  installations,
  selectedId,
  onSelect,
}) {
  return (
    <aside className={styles.aside}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Library</h2>
        <span className={styles.count}>{installations.length}</span>
      </div>
      <ul className={styles.list}>
        {installations.map(inst => (
          <InstallationItem
            key={inst.id}
            inst={inst}
            isSelected={inst.id === selectedId}
            onSelect={onSelect}
          />
        ))}
      </ul>
    </aside>
  )
}
