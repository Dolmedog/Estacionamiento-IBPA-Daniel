/**
 * Hook personalizado para gestión de llaves de encriptación
 */

import { useState, useCallback } from 'react'
import { keyStore } from '@/infrastructure/storage/keyStore'
import { useAppStore } from '@/app/store'
import { ErrorMessages, SuccessMessages } from '@/shared/utils/errorMessages'
import { arrayToBase64Url } from '@/shared/utils/base64Url'

export function useKeyManagement() {
  const { setIsKeySet, setError, clearError } = useAppStore()
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const saveKey = useCallback(
    async (password: string): Promise<boolean> => {
      if (!password || password.length < 8) {
        setError(ErrorMessages.KEY_TOO_SHORT)
        return false
      }

      setIsLoading(true)
      clearError()
      setSuccessMessage(null)

      try {
        // Generar salt aleatorio
        const salt = crypto.getRandomValues(new Uint8Array(16))
        const saltBase64 = arrayToBase64Url(salt)

        // Guardar la llave como hash SHA-256 del password para verificación sin exponer
        const encoder = new TextEncoder()
        const passwordHash = await crypto.subtle.digest('SHA-256', encoder.encode(password))
        const passwordHashBase64 = arrayToBase64Url(new Uint8Array(passwordHash))

        await keyStore.saveKey(passwordHashBase64, saltBase64)

        setIsKeySet(true)
        setSuccessMessage(SuccessMessages.KEY_SAVED)
        setIsLoading(false)
        return true
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : ErrorMessages.KEY_SAVE_FAILED
        setError(errorMsg)
        setIsLoading(false)
        return false
      }
    },
    [setIsKeySet, setError, clearError]
  )

  const updateKey = useCallback(
    async (newPassword: string): Promise<boolean> => {
      return saveKey(newPassword)
    },
    [saveKey]
  )

  const loadKey = useCallback(async (): Promise<boolean> => {
    setIsLoading(true)
    try {
      const key = await keyStore.loadKey()
      const hasKey = key !== null
      setIsKeySet(hasKey)
      setIsLoading(false)
      return hasKey
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : ErrorMessages.KEY_LOAD_FAILED
      setError(errorMsg)
      setIsLoading(false)
      return false
    }
  }, [setIsKeySet, setError])

  const clearSuccessMessage = useCallback(() => {
    setSuccessMessage(null)
  }, [])

  return {
    saveKey,
    updateKey,
    loadKey,
    isLoading,
    successMessage,
    clearSuccessMessage
  }
}
