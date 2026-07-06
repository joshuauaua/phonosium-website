import { useState, useCallback, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [stockholmTime, setStockholmTime] = useState('')

  const toggleMenu = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  const closeMenu = useCallback(() => {
    setIsOpen(false)
  }, [])

  useEffect(() => {
    const updateStockholmTime = () => {
      const now = new Date()
      const formatter = new Intl.DateTimeFormat('sv-SE', {
        timeZone: 'Europe/Stockholm',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
      const parts = formatter.formatToParts(now)
      const year = parts.find(p => p.type === 'year').value
      const month = parts.find(p => p.type === 'month').value
      const day = parts.find(p => p.type === 'day').value
      const hour = parts.find(p => p.type === 'hour').value
      const minute = parts.find(p => p.type === 'minute').value
      setStockholmTime(`${year}.${month}.${day} · ${hour}:${minute}`)
    }

    updateStockholmTime()
    const interval = setInterval(updateStockholmTime, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  return (
    <header className={styles.header}>
      <div className={styles.strip}>
        <span className={styles.stripLeft}>
          <span className={styles.dot} />
          PHONOSIUM · STOCKHOLM · {stockholmTime}
        </span>
        <span className={styles.stripRight}>
          A CROWDSOURCED SOUND INSTALLATION
        </span>
      </div>

      <nav className={styles.nav}>
        <NavLink to="/" className={styles.brand} onClick={closeMenu}>
          phon<span className={styles.brandO}>o</span>sium
        </NavLink>

        <button
          className={`${styles.hamburger} ${isOpen ? styles.open : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`${styles.links} ${isOpen ? styles.mobileOpen : ''}`}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
            onClick={closeMenu}
            end
          >
            Listen
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
            onClick={closeMenu}
          >
            About
          </NavLink>
          <NavLink
            to="/contribute"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
            onClick={closeMenu}
          >
            Submit
          </NavLink>
        </div>
      </nav>
    </header>
  )
}
