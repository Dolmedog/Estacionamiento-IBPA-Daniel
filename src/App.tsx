import React, { useState, useEffect } from 'react'
import { Navigation } from '@/app/components/Navigation'
import { SettingsPage } from '@/features/settings/components/SettingsPage'
import { useAppStore } from '@/app/store'
import './App.css'

type CurrentPage = 'generate' | 'scan' | 'settings'

function App() {
  const [currentPage, setCurrentPage] = useState<CurrentPage>('settings')
  const { loadKey } = useAppStore()

  // Cargar llave al montar la aplicación
  useEffect(() => {
    loadKey()
  }, [loadKey])

  return (
    <div className="app">
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="main-content">
        {currentPage === 'settings' && <SettingsPage />}
        {currentPage === 'generate' && (
          <div className="page-placeholder">
            <h2>Generar QR</h2>
            <p>Próximamente</p>
          </div>
        )}
        {currentPage === 'scan' && (
          <div className="page-placeholder">
            <h2>Leer QR</h2>
            <p>Próximamente</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
