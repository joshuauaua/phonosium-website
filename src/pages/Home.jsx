import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { installations } from '../data/installations'
import Waves from '../components/Waves/Waves'
import ContributionForm from '../components/ContributionForm'
import styles from './Home.module.css'

export default function Home() {
  const navigate = useNavigate()
  const [selectedId] = useState(installations[0].id)
  const [expandedScheduleId, setExpandedScheduleId] = useState(null)
  const [showSubmissionForm, setShowSubmissionForm] = useState(false)
  const [selectedDay, setSelectedDay] = useState(new Date())

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
            physically located at Frihamnstorget in Stockholm.
          </p>
          <div className={styles.ctaRow}>
            <button
              className={styles.btnAccent}
              onClick={() =>
                document
                  .getElementById('schedule-section')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Explore library
            </button>
            <button
              className={styles.btnOutline}
              onClick={() => {
                navigate('/about')
                setTimeout(() => {
                  window.scrollTo(0, 0)
                }, 0)
              }}
            >
              About the project
            </button>
          </div>
        </div>
        <div className={styles.metaCol}>
          <div className={styles.metaItem}>
            <div className={styles.metaLabel}>Artists</div>
            <div className={styles.metaValue}>Accepting Submissions</div>
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

      <section className={styles.programme} id="schedule-section">
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Schedule</h2>
          <div className={styles.dayToggle}>
            <button
              className={styles.dayButton}
              onClick={() => {
                const prev = new Date(selectedDay)
                prev.setDate(prev.getDate() - 1)
                setSelectedDay(prev)
              }}
            >
              ←
            </button>
            <span className={styles.sectionMeta}>
              {selectedDay.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <button
              className={styles.dayButton}
              onClick={() => {
                const next = new Date(selectedDay)
                next.setDate(next.getDate() + 1)
                setSelectedDay(next)
              }}
            >
              →
            </button>
          </div>
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
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      <section className={styles.callSection}>
        <h2 className={styles.callTitle}>Call for Submissions</h2>
        <p className={styles.callSubtitle}>
          We are accepting submissions for the installation from anywhere in the
          world until June 15, 2026
        </p>

        <button
          className={styles.btnApplyNow}
          onClick={() => navigate('/contributor')}
        >
          Learn more
        </button>
      </section>

      {showSubmissionForm && (
        <ContributionForm onClose={() => setShowSubmissionForm(false)} />
      )}
    </main>
  )
}
