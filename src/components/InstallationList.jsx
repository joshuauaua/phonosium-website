import styles from './InstallationList.module.css'

export default function InstallationList({ installations, selectedId, onSelect }) {
  return (
    <aside className={styles.aside}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Library</h2>
        <span className={styles.count}>{installations.length}</span>
      </div>
      <ul className={styles.list}>
        {installations.map((inst) => {
          const isSelected = inst.id === selectedId
          return (
            <li key={inst.id}>
              <button
                className={`${styles.item} ${isSelected ? styles.selected : ''}`}
                onClick={() => onSelect(inst.id)}
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
        })}
      </ul>
    </aside>
  )
}
