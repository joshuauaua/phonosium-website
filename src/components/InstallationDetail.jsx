import { useMemo } from 'react'
import styles from './InstallationDetail.module.css'

const generateWaveformBars = installationId => {
  const bars = []
  for (let i = 0; i < 48; i++) {
    const seed = installationId * 1000 + i
    const pseudoRandom = Math.sin(seed) * 10000
    const randomValue = (pseudoRandom - Math.floor(pseudoRandom)) * 20

    bars.push({
      delay: (i * 0.07).toFixed(2),
      height: 20 + Math.sin(i * 0.6) * 60 + randomValue,
    })
  }
  return bars
}

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

  const waveformBars = useMemo(() => {
    if (!id) return []
    return generateWaveformBars(id)
  }, [id])

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
      <div className={styles.statusBadge}>
        <span className={styles.dot} />
        Now Playing
      </div>

      <div className={styles.titleBlock}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>

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

      <div className={styles.waveform} aria-hidden="true">
        {waveformBars.map((bar, i) => (
          <div
            key={i}
            className={styles.bar}
            style={{ '--delay': `${bar.delay}s`, '--height': `${bar.height}%` }}
          />
        ))}
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

      <div className={styles.divider} />

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
          {artist.website} ↗
        </a>
      </section>
    </article>
  )
}
