import { useEffect } from 'react'
import styles from './Toast.module.css'

/**
 * Lightweight toast notification component for displaying retry status
 *
 * @param {Object} props
 * @param {string} props.message - Primary message to display
 * @param {string} [props.description] - Optional secondary description
 * @param {'info'|'warning'|'success'|'error'} [props.type='info'] - Toast severity type
 * @param {Function} [props.onDismiss] - Callback when toast is dismissed
 * @param {number} [props.autoDismissDelay] - Auto-dismiss after N milliseconds (0 = no auto-dismiss)
 */
export default function Toast({
  message,
  description,
  type = 'info',
  onDismiss,
  autoDismissDelay = 0,
}) {
  useEffect(() => {
    if (autoDismissDelay > 0 && onDismiss) {
      const timer = setTimeout(() => {
        onDismiss()
      }, autoDismissDelay)
      return () => clearTimeout(timer)
    }
  }, [autoDismissDelay, onDismiss])

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓'
      case 'warning':
        return '⚠️'
      case 'error':
        return '✗'
      case 'info':
      default:
        return 'ℹ️'
    }
  }

  return (
    <div
      className={`${styles.toast} ${styles[type]}`}
      role="alert"
      aria-live="polite"
      data-type={type}
      data-testid="toast"
    >
      <div className={styles.content}>
        <span className={styles.icon} data-testid="toast-icon">
          {getIcon()}
        </span>
        <div className={styles.text}>
          <div className={styles.message}>{message}</div>
          {description && (
            <div className={styles.description}>{description}</div>
          )}
        </div>
      </div>
      {onDismiss && (
        <button
          className={styles.dismissButton}
          onClick={onDismiss}
          aria-label="Dismiss notification"
        >
          ×
        </button>
      )}
    </div>
  )
}
