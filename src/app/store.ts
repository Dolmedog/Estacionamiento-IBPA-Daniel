/**
 * Store global de la aplicación con Zustand
 * Gestiona el estado de la llave de encriptación
 */

import { create } from 'zustand'
import { keyStore } from '@/infrastructure/storage/keyStore'

interface AppStore {
  isKeySet: boolean
  isLoading: boolean
  error: string | null

  // Actions
  setIsKeySet: (value: boolean) => void
  setIsLoading: (value: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void

  // Key management
  loadKey: () => Promise<boolean>
}

export const useAppStore = create<AppStore>((set) => ({
  isKeySet: false,
  isLoading: false,
  error: null,

  setIsKeySet: (value) => set({ isKeySet: value }),
  setIsLoading: (value) => set({ isLoading: value }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  loadKey: async () => {
    set({ isLoading: true })
    try {
      const key = await keyStore.loadKey()
      const hasKey = key !== null
      set({ isKeySet: hasKey, isLoading: false })
      return hasKey
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al cargar la llave',
        isLoading: false
      })
      return false
    }
  }
}))
