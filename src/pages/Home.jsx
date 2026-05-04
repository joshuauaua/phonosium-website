import { useState } from 'react'
import { installations } from '../data/installations'
import InstallationDetail from '../components/InstallationDetail'
import InstallationList from '../components/InstallationList'
import Waves from '../components/Waves/Waves'
import styles from './Home.module.css'

export default function Home() {
  const [selectedId, setSelectedId] = useState(installations[0].id)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const current = installations.find(i => i.id === selectedId)

  return (
    <main className={styles.main}>
      <div className={`${styles.layout} ${!isSidebarOpen ? styles.sidebarClosed : ''}`}>
        <section className={styles.detailPane}>
          <Waves 
            lineColor="rgba(255, 120, 0, 0.15)"
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
          <InstallationDetail installation={current} />
        </section>

        <section className={styles.listPane}>
          <button 
            className={styles.sidebarToggle}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            <span className={styles.toggleText}>Library</span>
            <span className={styles.toggleIcon}>{isSidebarOpen ? '›' : '‹'}</span>
          </button>
          
          <div className={styles.listContent}>
            <InstallationList
              installations={installations}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>
        </section>
      </div>
    </main>
  )
}
