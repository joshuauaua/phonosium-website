import { useState, useMemo } from 'react'
import { installations } from '../data/installations'
import InstallationDetail from '../components/InstallationDetail'
import Waves from '../components/Waves/Waves'
import styles from './Home.module.css'

export default function Home() {
  const [selectedId, setSelectedId] = useState(installations[0].id)

  const current = useMemo(
    () => installations.find(i => i.id === selectedId),
    [selectedId]
  )

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
            Slot {String(current?.id).padStart(2, '0')} · {current?.duration} ·{' '}
            {current?.artist?.name}
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
        <button className={styles.listenBtn}>Listen live</button>
      </section>

      <section className={styles.programme}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Schedule</h2>
          <span className={styles.sectionMeta}>
            {installations.length} timeslots · 30 min each
          </span>
        </div>
        <div className={styles.chList}>
          {installations.map(inst => (
            <div
              key={inst.id}
              className={`${styles.ch} ${inst.id === selectedId ? styles.chCur : ''}`}
              onClick={() => setSelectedId(inst.id)}
            >
              <div className={styles.chNum}>
                {inst.id === selectedId && '● '}Slot{' '}
                {String(inst.id).padStart(2, '0')}
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
