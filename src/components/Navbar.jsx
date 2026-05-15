import { useState, useCallback } from 'react'
import { NavLink } from 'react-router-dom'
import styles from './Navbar.module.css'
import ThemeToggle from './ThemeToggle/ThemeToggle'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  const closeMenu = useCallback(() => {
    setIsOpen(false)
  }, [])

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <NavLink to="/" className={styles.logo} onClick={closeMenu}>
          <span className={styles.logoMark}>◉</span>
          <span className={styles.logoText}>PHONOSIUM</span>
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
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
