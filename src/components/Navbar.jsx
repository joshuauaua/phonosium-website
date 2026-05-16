import { useState, useCallback } from 'react'
import { NavLink } from 'react-router-dom'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  const closeMenu = useCallback(() => {
    setIsOpen(false)
  }, [])

  const now = new Date()
  const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`

  return (
    <header className={styles.header}>
      <div className={styles.strip}>
        <span className={styles.stripLeft}>
          <span className={styles.dot} />
          PHONOSIUM · STOCKHOLM · {dateStr}
        </span>
        <span className={styles.stripRight}>
          CROWDSOURCED SOUND INSTALLATION
        </span>
      </div>

      <nav className={styles.nav}>
        <NavLink to="/" className={styles.brand} onClick={closeMenu}>
          phon
          <span className={styles.brandDot}>
            <span className={styles.stem} />
            <span className={styles.ring} />
          </span>
          sium
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
            to="/contributor"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
            onClick={closeMenu}
          >
            Open Call
          </NavLink>
        </div>
      </nav>
    </header>
  )
}
