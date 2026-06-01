import React, { useState } from 'react'
import './Navigation.css'

interface NavigationProps {
  currentPage: 'generate' | 'scan' | 'settings'
  onPageChange: (page: 'generate' | 'scan' | 'settings') => void
}

export const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleNavClick = (page: 'generate' | 'scan' | 'settings') => {
    onPageChange(page)
    setMobileMenuOpen(false)
  }

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-logo">
          <span className="nav-logo-icon">🏷️</span>
          <span className="nav-logo-text">QR Etiquetas</span>
        </div>

        <button
          className="nav-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        <ul className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <li>
            <button
              className={`nav-link ${currentPage === 'generate' ? 'active' : ''}`}
              onClick={() => handleNavClick('generate')}
            >
              <span className="nav-link-icon">➕</span>
              <span className="nav-link-text">Generar</span>
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${currentPage === 'scan' ? 'active' : ''}`}
              onClick={() => handleNavClick('scan')}
            >
              <span className="nav-link-icon">📱</span>
              <span className="nav-link-text">Leer</span>
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${currentPage === 'settings' ? 'active' : ''}`}
              onClick={() => handleNavClick('settings')}
            >
              <span className="nav-link-icon">⚙️</span>
              <span className="nav-link-text">Configurar</span>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}
