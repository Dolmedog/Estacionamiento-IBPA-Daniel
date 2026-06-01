import React from 'react'
import './Alert.css'

type AlertType = 'error' | 'success' | 'warning' | 'info'

interface AlertProps {
  type: AlertType
  message: string
  onClose?: () => void
  dismissible?: boolean
}

export const Alert: React.FC<AlertProps> = ({ type, message, onClose, dismissible = true }) => {
  return (
    <div className={`alert alert--${type}`} role="alert">
      <div className="alert__content">
        <span className="alert__icon">{getAlertIcon(type)}</span>
        <span className="alert__message">{message}</span>
      </div>
      {dismissible && onClose && (
        <button className="alert__close" onClick={onClose} aria-label="Cerrar alerta">
          ✕
        </button>
      )}
    </div>
  )
}

function getAlertIcon(type: AlertType): string {
  switch (type) {
    case 'error':
      return '✕'
    case 'success':
      return '✓'
    case 'warning':
      return '⚠'
    case 'info':
      return 'ℹ'
  }
}
