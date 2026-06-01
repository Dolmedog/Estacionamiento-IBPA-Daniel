import React, { useState, useEffect } from 'react'
import { Alert } from '@/shared/components/Alert'
import { useKeyManagement } from '@/shared/hooks/useKeyManagement'
import { useAppStore } from '@/app/store'
import { WarningMessages } from '@/shared/utils/errorMessages'
import './SettingsPage.css'

export const SettingsPage: React.FC = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const [isPendingUpdate, setIsPendingUpdate] = useState(false)
  const [pendingPassword, setPendingPassword] = useState('')

  const { saveKey, updateKey, loadKey, isLoading, successMessage, clearSuccessMessage } =
    useKeyManagement()
  const { error, setError, clearError, isKeySet } = useAppStore()

  // Cargar llave existente al montar el componente
  useEffect(() => {
    loadKey()
  }, [loadKey])

  // Limpiar mensaje de éxito después de 3 segundos
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        clearSuccessMessage()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [successMessage, clearSuccessMessage])

  // Limpiar mensaje de error después de 5 segundos
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, clearError])

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    clearError()
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value)
    clearError()
  }

  const validatePasswords = (): boolean => {
    if (!password) {
      setError('La contraseña es requerida')
      return false
    }

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return false
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return false
    }

    return true
  }

  const handleSaveKey = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validatePasswords()) {
      return
    }

    // Si ya hay una llave configurada, mostrar advertencia
    if (isKeySet) {
      setIsPendingUpdate(true)
      setPendingPassword(password)
      setShowWarning(true)
      return
    }

    // Si no hay llave, guardar directamente
    const success = await saveKey(password)
    if (success) {
      setPassword('')
      setConfirmPassword('')
    }
  }

  const handleConfirmUpdate = async () => {
    setShowWarning(false)
    const success = await updateKey(pendingPassword)
    if (success) {
      setPassword('')
      setConfirmPassword('')
      setIsPendingUpdate(false)
      setPendingPassword('')
    }
  }

  const handleCancel = () => {
    setShowWarning(false)
    setIsPendingUpdate(false)
    setPendingPassword('')
  }

  return (
    <div className="settings-page">
      <div className="settings-container">
        <div className="settings-header">
          <h1 className="settings-title">Configuración de Seguridad</h1>
          <p className="settings-subtitle">
            Establece tu llave de encriptación para proteger tus datos
          </p>
        </div>

        {/* Alertas */}
        {error && (
          <Alert type="error" message={error} onClose={clearError} dismissible={true} />
        )}

        {successMessage && (
          <Alert type="success" message={successMessage} dismissible={false} />
        )}

        {/* Estado actual */}
        {isKeySet && (
          <div className="status-card">
            <div className="status-icon">✓</div>
            <div className="status-content">
              <h3>Llave configurada</h3>
              <p>Tu contraseña está guardada de forma segura en tu dispositivo</p>
            </div>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSaveKey} className="settings-form" noValidate>
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Contraseña <span className="required">*</span>
            </label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                placeholder="Ingresa tu contraseña (mínimo 8 caracteres)"
                className="form-input"
                required
                disabled={isLoading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            <p className="form-hint">Usa al menos 8 caracteres para mayor seguridad</p>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirmar contraseña <span className="required">*</span>
            </label>
            <div className="password-input-wrapper">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder="Repite tu contraseña"
                className="form-input"
                required
                disabled={isLoading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* Indicador de fortaleza */}
          {password && (
            <div className="strength-indicator">
              <div className="strength-bar">
                <div className={`strength-fill strength-${getPasswordStrength(password)}`}></div>
              </div>
              <p className={`strength-text strength-text-${getPasswordStrength(password)}`}>
                {getPasswordStrengthText(password)}
              </p>
            </div>
          )}

          {/* Información de seguridad */}
          <div className="security-info">
            <h4>Información de seguridad:</h4>
            <ul className="security-list">
              <li>Tu contraseña se almacena localmente en tu dispositivo</li>
              <li>Nunca compartimos tu contraseña con servidores</li>
              <li>La contraseña se usa solo para encriptar/desencriptar QRs</li>
              {isKeySet && <li className="warning">⚠️ Cambiar la contraseña invalidará QRs anteriores</li>}
            </ul>
          </div>

          <button type="submit" className="btn btn--primary btn--lg" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Guardando...
              </>
            ) : isKeySet ? (
              'Actualizar contraseña'
            ) : (
              'Guardar contraseña'
            )}
          </button>
        </form>

        {/* Modal de confirmación */}
        {showWarning && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>Confirmar cambio de contraseña</h2>
              </div>
              <div className="modal-body">
                <div className="warning-icon">⚠️</div>
                <h3>¡Atención!</h3>
                <p>{WarningMessages.KEY_CHANGE_WARNING}</p>
                <p className="modal-question">¿Deseas continuar?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn--danger"
                  onClick={handleConfirmUpdate}
                  disabled={isLoading}
                >
                  {isLoading ? 'Actualizando...' : 'Actualizar contraseña'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
  let strength = 0

  if (password.length >= 8) strength++
  if (password.length >= 12) strength++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^a-zA-Z0-9]/.test(password)) strength++

  if (strength < 2) return 'weak'
  if (strength < 4) return 'medium'
  return 'strong'
}

function getPasswordStrengthText(password: string): string {
  const strength = getPasswordStrength(password)
  switch (strength) {
    case 'weak':
      return 'Contraseña débil'
    case 'medium':
      return 'Contraseña regular'
    case 'strong':
      return 'Contraseña fuerte'
  }
}
