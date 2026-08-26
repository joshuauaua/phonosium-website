import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { installations } from '../data/installations'
import { getCurrentInstallation, timeToMinutes } from '../utils/scheduleUtils'
import { toExternalHref } from '../utils/urlUtils'
import Waves from '../components/Waves/Waves'
import ContributionForm from '../components/ContributionForm'
import SEO from '../components/SEO'
import styles from './Home.module.css'

// Covers only mount once a row is expanded, so the fetch would otherwise start
// on click. Warming the cache first makes the image appear with the row.
function warmCover(inst) {
  if (!inst?.image) return
  const img = new Image()
  if (inst.imageSrcSet) img.srcset = inst.imageSrcSet
  img.src = inst.image
}

export default function Home() {
  const navigate = useNavigate()
  const [expandedScheduleId, setExpandedScheduleId] = useState(null)
  const [showSubmissionForm, setShowSubmissionForm] = useState(false)
  const [selectedDay, setSelectedDay] = useState(new Date())
  const [updateTrigger, setUpdateTrigger] = useState(0)

  const isTest = import.meta.env.MODE === 'test'

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setUpdateTrigger(n => n + 1)
    }, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  // Recalculate current installation (updateTrigger forces re-render every minute)
  const current =
    updateTrigger >= 0 ? getCurrentInstallation(installations) : null

  const selectedId = current?.id

  // The now-playing cover is what "More Info" opens, so fetch it up front
  useEffect(() => {
    warmCover(current)
  }, [current?.id])

  // Schedule lists pieces chronologically, so the day's last start sits at the bottom
  const scheduled = [...installations].sort(
    (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
  )

  return (
    <>
      <SEO
        description="A crowdsourced interactive sound installation physically located at Frihamnstorget in Stockholm, digitally connected to the world. Experience sonic art 24/7."
        path="/"
      />
      <main className={styles.main}>
        <section className={styles.hero}>
          {!isTest && (
            <video
              autoPlay
              muted
              loop
              playsInline
              poster="/phonosium-hero-poster.jpg"
              className={styles.videoBg}
            >
              <source src="/phonosium-hero.mp4" type="video/mp4" />
            </video>
          )}
          <div className={styles.videoOverlay} />

          <div className={styles.heroContent}>
            <h1 className={styles.headline}>
              a space for <span className={styles.soundLetter}>s</span>
              <span className={styles.soundLetter}>o</span>
              <span className={styles.soundLetter}>u</span>
              <span className={styles.soundLetter}>n</span>
              <span className={styles.soundLetter}>d</span>.
            </h1>
            <p className={styles.lead}>
              Phonosium is a crowdsourced interactive sound installation
              physically located in Stockholm and digitally connected to the
              world.
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
              <div className={styles.metaValue}>24-hour cycle</div>
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
              {current?.timeSlot} · {current?.artist?.name}
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
            {scheduled.map(inst => {
              const isExpanded = expandedScheduleId === inst.id
              return (
                <div
                  key={inst.id}
                  className={`${styles.ch} ${inst.id === selectedId ? styles.chCur : ''} ${isExpanded ? styles.chExpanded : ''}`}
                >
                  <div
                    className={styles.chRow}
                    onPointerEnter={() => warmCover(inst)}
                    onClick={() => {
                      setExpandedScheduleId(isExpanded ? null : inst.id)
                    }}
                  >
                    <div className={styles.chNum}>{inst.timeSlot}</div>
                    <div className={styles.chTitle}>{inst.title}</div>
                    <div className={styles.chMeta}>{inst.artist.name}</div>
                    <div className={styles.chArrow}>
                      {isExpanded ? '×' : inst.id === selectedId ? '●' : '→'}
                    </div>
                  </div>
                  {isExpanded && (
                    <div className={styles.scheduleItemDetails}>
                      <div className={styles.trackImage}>
                        {inst.image ? (
                          <img
                            src={inst.image}
                            srcSet={inst.imageSrcSet}
                            width={300}
                            height={300}
                            decoding="async"
                            alt={inst.title}
                            className={styles.coverImg}
                          />
                        ) : (
                          <span>No Image Available</span>
                        )}
                      </div>
                      <div className={styles.trackDetails}>
                        <div className={styles.trackHeader}>
                          <h3 className={styles.trackTitle}>{inst.title}</h3>
                          <p className={styles.trackSubtitle}>
                            {inst.subtitle}
                          </p>
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
                            href={toExternalHref(inst.artist.website)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.trackLink}
                          >
                            Visit artist website →
                          </a>
                        )}
                        {inst.artist.instagram && (
                          <a
                            href={inst.artist.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.trackLink}
                          >
                            Follow on Instagram →
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
            We are accepting submissions for the installation from anywhere in
            the world on an ongoing basis
          </p>

          <button
            className={styles.btnApplyNow}
            onClick={() => navigate('/contribute')}
          >
            Learn more
          </button>
        </section>

        {showSubmissionForm && (
          <ContributionForm onClose={() => setShowSubmissionForm(false)} />
        )}
      </main>
    </>
  )
}
