import { useMemo } from 'react'
import styles from './InstallationDetail.module.css'

export default function InstallationDetail({ installation }) {
  const {
    title,
    subtitle,
    year,
    duration,
    artist,
    description,
    medium,
    tags,
    id,
  } = installation || {}

  const artistInitials = useMemo(() => {
    if (!artist?.name) return ''
    return artist.name
      .split(' ')
      .map(n => n[0])
      .join('')
  }, [artist])

  if (!installation) return null

  return (
    <article className={styles.wrapper}>
      <div className={styles.eyebrow}>
        <span className={styles.dot} />
        Now Playing · Ch. {String(id).padStart(2, '0')}
      </div>

      <h1 className={styles.title}>{title}</h1>
      <p className={styles.subtitle}>{subtitle}</p>

      <div className={styles.meta}>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Year</span>
          <span className={styles.metaValue}>{year}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Duration</span>
          <span className={styles.metaValue}>{duration}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Medium</span>
          <span className={styles.metaValue}>{medium}</span>
        </div>
      </div>

      <div className={styles.description}>
        <p>{description}</p>
      </div>

      <div className={styles.tags}>
        {tags.map(tag => (
          <span key={tag} className={styles.tag}>
            {tag}
          </span>
        ))}
      </div>

      <hr className={styles.rule} />

      <section className={styles.artistSection}>
        <h2 className={styles.artistHeading}>Artist</h2>
        <div className={styles.artistCard}>
          <div className={styles.artistAvatar}>{artistInitials}</div>
          <div className={styles.artistInfo}>
            <h3 className={styles.artistName}>{artist.name}</h3>
            <p className={styles.artistOrigin}>{artist.origin}</p>
          </div>
        </div>
        <p className={styles.artistBio}>{artist.bio}</p>
        <a
          href={`https://${artist.website}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.artistLink}
        >
          {artist.website} &#8599;
        </a>
      </section>
    </article>
  )
}
