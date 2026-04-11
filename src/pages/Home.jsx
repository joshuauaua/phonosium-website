import { useState } from 'react'
import { installations } from '../data/installations'
import InstallationDetail from '../components/InstallationDetail'
import InstallationList from '../components/InstallationList'
import styles from './Home.module.css'

export default function Home() {
  const [selectedId, setSelectedId] = useState(installations[0].id)

  const current = installations.find(i => i.id === selectedId)

  return (
    <main className={styles.main}>
      <div className={styles.layout}>
        <section className={styles.detailPane}>
          <InstallationDetail installation={current} />
        </section>
        <section className={styles.listPane}>
          <InstallationList
            installations={installations}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </section>
      </div>
    </main>
  )
}
