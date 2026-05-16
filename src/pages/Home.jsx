import { useState, useMemo } from 'react'
import { installations } from '../data/installations'
import InstallationDetail from '../components/InstallationDetail'
import Waves from '../components/Waves/Waves'
import styles from './Home.module.css'

export default function Home() {
  const [selectedId, setSelectedId] = useState(installations[0].id)
  const [isInfoExpanded, setIsInfoExpanded] = useState(false)

  const current = useMemo(
    () => installations.find(i => i.id === selectedId),
    [selectedId]
  )

  const START_TIME = 9 * 60 // 9:00 AM in minutes

  const formatTime = minutes => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
  }

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.sideRail}>Installation · 2026</div>
        <div className={styles.heroContent}>
          <h1 className={styles.headline}>
            a space for s<span className={styles.o}>&#9675;</span>und.
          </h1>
          <p className={styles.lead}>
            Phonosium is a crowdsourced interactive sound installation
            physically located in Stockholm. Six speakers, one structure. The{' '}
            <em>pipes answer</em>.
          </p>
          <div className={styles.ctaRow}>
            <button className={styles.btnAccent}>Explore library</button>
            <button className={styles.btnOutline}>About the project</button>
          </div>
        </div>
        <div className={styles.metaCol}>
          <div className={styles.metaItem}>
            <div className={styles.metaLabel}>Artists</div>
            <div className={styles.metaValue}>12+ contributors</div>
          </div>
          <div className={styles.metaItem}>
            <div className={styles.metaLabel}>Duration</div>
            <div className={styles.metaValue}>Continuous loop</div>
          </div>
          <div className={styles.metaItem}>
            <div className={styles.metaLabel}>Schedule</div>
            <div className={styles.metaValue}>30-min timeslots</div>
          </div>
          <div className={styles.metaItem}>
            <div className={styles.metaLabel}>Location</div>
            <div className={styles.metaValue}>Frihamnstorget, Stockholm</div>
          </div>
        </div>
      </section>

      <section
        className={`${styles.liveBand} ${isInfoExpanded ? styles.liveBandExpanded : ''}`}
      >
        <div className={styles.liveInfo}>
          <div className={styles.liveLabel}>
            <span className={styles.liveDot} />
            Now playing
          </div>
          <div className={styles.liveTitle}>{current?.title}</div>
          <div className={styles.liveSub}>
            {formatTime(START_TIME + (current?.id - 1) * 30)} ·{' '}
            {current?.duration} · {current?.artist?.name}
          </div>
        </div>
        {!isInfoExpanded && (
          <>
            <div className={styles.waveContainer}>
              <Waves
                lineColor="rgba(250, 247, 242, 0.06)"
                backgroundColor="transparent"
                waveSpeedX={0.015}
                waveSpeedY={0.008}
                waveAmpX={35}
                waveAmpY={15}
                friction={0.92}
                tension={0.005}
                xGap={15}
                yGap={35}
              />
            </div>
            <button
              className={styles.listenBtn}
              onClick={() => setIsInfoExpanded(true)}
            >
              More Info
            </button>
          </>
        )}
        {isInfoExpanded && (
          <>
            <div className={styles.trackImage}>
              <span>No Image Available</span>
            </div>
            <div className={styles.trackDetails}>
              <div className={styles.trackHeader}>
                <h3 className={styles.trackTitle}>{current?.title}</h3>
                <p className={styles.trackSubtitle}>{current?.subtitle}</p>
              </div>
              <div className={styles.trackArtist}>
                <div className={styles.trackArtistName}>
                  {current?.artist?.name}
                </div>
                <div className={styles.trackArtistOrigin}>
                  {current?.artist?.origin}
                </div>
              </div>
              <p className={styles.trackDescription}>{current?.description}</p>
              <div className={styles.trackMeta}>
                <div className={styles.trackMetaItem}>
                  <span className={styles.trackMetaLabel}>Year</span>
                  <span className={styles.trackMetaValue}>{current?.year}</span>
                </div>
                <div className={styles.trackMetaItem}>
                  <span className={styles.trackMetaLabel}>Duration</span>
                  <span className={styles.trackMetaValue}>
                    {current?.duration}
                  </span>
                </div>
                <div className={styles.trackMetaItem}>
                  <span className={styles.trackMetaLabel}>Medium</span>
                  <span className={styles.trackMetaValue}>
                    {current?.medium}
                  </span>
                </div>
              </div>
              <div className={styles.trackTags}>
                {current?.tags?.map(tag => (
                  <span key={tag} className={styles.trackTag}>
                    {tag}
                  </span>
                ))}
              </div>
              {current?.artist?.website && (
                <a
                  href={`https://${current.artist.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.trackLink}
                >
                  Visit artist website →
                </a>
              )}
            </div>
            <button
              className={styles.listenBtn}
              onClick={() => setIsInfoExpanded(false)}
            >
              Close
            </button>
          </>
        )}
      </section>

      <section className={styles.programme}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Schedule</h2>
          <span className={styles.sectionMeta}>{getCurrentDate()}</span>
        </div>
        <div className={styles.chList}>
          {installations.map(inst => (
            <div
              key={inst.id}
              className={`${styles.ch} ${inst.id === selectedId ? styles.chCur : ''}`}
              onClick={() => setSelectedId(inst.id)}
            >
              <div className={styles.chNum}>
                {inst.id === selectedId && '● '}
                {formatTime(START_TIME + (inst.id - 1) * 30)}
              </div>
              <div className={styles.chTitle}>{inst.title}</div>
              <div className={styles.chMeta}>{inst.artist.name}</div>
              <div className={styles.chTime}>{inst.duration}</div>
              <div className={styles.chArrow}>
                {inst.id === selectedId ? '●' : '→'}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.detailSection}>
        <InstallationDetail installation={current} />
      </section>
    </main>
  )
}
