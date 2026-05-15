import { useState, useEffect, useCallback } from 'react';
import styles from './ThemeToggle.module.css';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first, fall back to system preference
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') return stored;
    return 'system';
  });

  const cycleTheme = useCallback(() => {
    setTheme(current => {
      if (current === 'light') return 'dark';
      if (current === 'dark') return 'system';
      return 'light';
    });
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    if (theme === 'system') {
      root.removeAttribute('data-theme');
      localStorage.removeItem('theme');
    } else {
      root.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'T') {
        event.preventDefault();
        cycleTheme();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cycleTheme]);

  const getIcon = () => {
    if (theme === 'light') return '☀️';
    if (theme === 'dark') return '🌙';
    return '🔄';
  };

  const getLabel = () => {
    if (theme === 'light') return 'Light';
    if (theme === 'dark') return 'Dark';
    return 'System';
  };

  return (
    <button
      onClick={cycleTheme}
      className={styles.toggle}
      aria-label={`Theme: ${getLabel()}. Click or press Ctrl+Shift+T to cycle themes.`}
      title={`Current: ${getLabel()} (Ctrl+Shift+T)`}
    >
      <span className={styles.icon} aria-hidden="true">{getIcon()}</span>
      <span className={styles.label}>{getLabel()}</span>
    </button>
  );
}
