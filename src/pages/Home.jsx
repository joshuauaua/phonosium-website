import { useState, useMemo } from 'react'
import { installations } from '../data/installations'
import Waves from '../components/Waves/Waves'
import ContributionForm from '../components/ContributionForm'
import styles from './Home.module.css'

export default function Home() {
  const [selectedId, setSelectedId] = useState(installations[0].id)
  const [expandedScheduleId, setExpandedScheduleId] = useState(null)
  const [showSubmissionForm, setShowSubmissionForm] = useState(false)

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

      <section className={styles.liveBand}>
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
          onClick={() => setExpandedScheduleId(selectedId)}
        >
          More Info
        </button>
      </section>

      <section className={styles.programme}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Schedule</h2>
          <span className={styles.sectionMeta}>{getCurrentDate()}</span>
        </div>
        <div className={styles.chList}>
          {installations.map(inst => {
            const isExpanded = expandedScheduleId === inst.id
            return (
              <div
                key={inst.id}
                className={`${styles.ch} ${inst.id === selectedId ? styles.chCur : ''} ${isExpanded ? styles.chExpanded : ''}`}
              >
                <div
                  className={styles.chRow}
                  onClick={() => {
                    setSelectedId(inst.id)
                    setExpandedScheduleId(isExpanded ? null : inst.id)
                  }}
                >
                  <div className={styles.chNum}>
                    {inst.id === selectedId && '● '}
                    {formatTime(START_TIME + (inst.id - 1) * 30)}
                  </div>
                  <div className={styles.chTitle}>{inst.title}</div>
                  <div className={styles.chMeta}>{inst.artist.name}</div>
                  <div className={styles.chTime}>{inst.duration}</div>
                  <div className={styles.chArrow}>
                    {isExpanded ? '×' : inst.id === selectedId ? '●' : '→'}
                  </div>
                </div>
                {isExpanded && (
                  <div className={styles.scheduleItemDetails}>
                    <div className={styles.trackImage}>
                      <span>No Image Available</span>
                    </div>
                    <div className={styles.trackDetails}>
                      <div className={styles.trackHeader}>
                        <h3 className={styles.trackTitle}>{inst.title}</h3>
                        <p className={styles.trackSubtitle}>{inst.subtitle}</p>
                      </div>
                      <div className={styles.trackArtist}>
                        <div className={styles.trackArtistName}>
                          {inst.artist.name}
                        </div>
                        <div className={styles.trackArtistOrigin}>
                          {inst.artist.origin}
                        </div>
                      </div>
                      <p className={styles.trackDescription}>
                        {inst.description}
                      </p>
                      <div className={styles.trackMeta}>
                        <div className={styles.trackMetaItem}>
                          <span className={styles.trackMetaLabel}>Year</span>
                          <span className={styles.trackMetaValue}>
                            {inst.year}
                          </span>
                        </div>
                        <div className={styles.trackMetaItem}>
                          <span className={styles.trackMetaLabel}>
                            Duration
                          </span>
                          <span className={styles.trackMetaValue}>
                            {inst.duration}
                          </span>
                        </div>
                        <div className={styles.trackMetaItem}>
                          <span className={styles.trackMetaLabel}>Medium</span>
                          <span className={styles.trackMetaValue}>
                            {inst.medium}
                          </span>
                        </div>
                      </div>
                      <div className={styles.trackTags}>
                        {inst.tags?.map(tag => (
                          <span key={tag} className={styles.trackTag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                      {inst.artist.website && (
                        <a
                          href={`https://${inst.artist.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.trackLink}
                        >
                          Visit artist website →
                        </a>
                      )}
                    </div>
                    <button
                      className={styles.closeBtn}
                      onClick={e => {
                        e.stopPropagation()
                        setExpandedScheduleId(null)
                      }}
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      <section className={styles.callSection}>
        <h2 className={styles.callTitle}>Open Call</h2>
        <p className={styles.callSubtitle}>Submit your sounds</p>
        <p className={styles.callContact}>
          Email <a href="mailto:hej@sonicassembly.se">hej@sonicassembly.se</a>{' '}
          for more information
        </p>

        <div className={styles.callCriteria}>
          <h3 className={styles.callCriteriaTitle}>Submission Requirements</h3>
          <ul className={styles.callCriteriaList}>
            <li>
              One loop (max 20 MB) — 44.1 kHz · 16-bit · saved as loop.wav
            </li>
            <li>Up to 24 samples (1–6 seconds each) — balanced gain levels</li>
            <li>Demo audio: your loop with triggered samples</li>
            <li>Title and description of your piece</li>
            <li>Links to your work</li>
          </ul>
        </div>

        <button
          className={styles.btnApplyNow}
          onClick={() => setShowSubmissionForm(true)}
        >
          Apply now
        </button>
      </section>

      {showSubmissionForm && (
        <ContributionForm onClose={() => setShowSubmissionForm(false)} />
      )}
    </main>
  )
}
