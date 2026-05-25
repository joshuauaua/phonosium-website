import { useNavigate } from 'react-router-dom'
import SEO from '../components/SEO'
import Waves from '../components/Waves/Waves'
import styles from './NotFound.module.css'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <>
      <SEO
        title="404 - Page Not Found"
        description="The page you're looking for doesn't exist. Return to Phonosium to explore our sound installation in Stockholm."
        path="/404"
      />
      <main className={styles.main}>
        <div className={styles.waveBackground}>
          <Waves
            lineColor="rgba(250, 247, 242, 0.04)"
            backgroundColor="transparent"
            waveSpeedX={0.01}
            waveSpeedY={0.006}
            waveAmpX={25}
            waveAmpY={12}
            friction={0.94}
            tension={0.004}
            xGap={18}
            yGap={40}
          />
        </div>
        <section className={styles.hero}>
          <div className={styles.errorCode}>404</div>
          <h1 className={styles.title}>Lost in the sound waves.</h1>
          <p className={styles.description}>
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className={styles.actions}>
            <button
              className={styles.btnPrimary}
              onClick={() => navigate('/')}
              aria-label="Return to home page"
            >
              Return Home
            </button>
            <button
              className={styles.btnSecondary}
              onClick={() => navigate('/about')}
              aria-label="Explore projects"
            >
              Explore Projects
            </button>
          </div>
        </section>
      </main>
    </>
  )
}
