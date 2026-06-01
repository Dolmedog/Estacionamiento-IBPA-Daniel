/**
 * Servicio de almacenamiento para llaves de encriptación
 * Usa IndexedDB como fuente principal y LocalStorage como respaldo
 */

import { STORAGE_CONFIG } from '@/domain/label/label.constants'
import { StorageError } from '@/domain/crypto/crypto.types'

interface StoredKey {
  id: string
  keyData: string // Base64 encoded key
  salt: string // Base64 encoded salt
  timestamp: number
}

export class KeyStore {
  private dbPromise: Promise<IDBDatabase> | null = null

  private initDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(STORAGE_CONFIG.dbName, STORAGE_CONFIG.dbVersion)

      request.onerror = () => {
        this.dbPromise = null
        reject(new StorageError('Failed to open IndexedDB'))
      }

      request.onsuccess = () => {
        resolve(request.result)
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(STORAGE_CONFIG.storeName)) {
          db.createObjectStore(STORAGE_CONFIG.storeName, {
            keyPath: STORAGE_CONFIG.keyPath
          })
        }
      }
    })

    return this.dbPromise
  }

  async saveKey(keyData: string, salt: string): Promise<void> {
    try {
      const db = await this.initDB()
      const transaction = db.transaction([STORAGE_CONFIG.storeName], 'readwrite')
      const store = transaction.objectStore(STORAGE_CONFIG.storeName)

      const storedKey: StoredKey = {
        id: 'primary_key',
        keyData,
        salt,
        timestamp: Date.now()
      }

      return new Promise((resolve, reject) => {
        const request = store.put(storedKey)
        request.onsuccess = () => {
          // También guardar en LocalStorage como respaldo
          this.saveToLocalStorageBackup(keyData, salt)
          resolve()
        }
        request.onerror = () => reject(new StorageError('Failed to save key in IndexedDB'))
      })
    } catch (error) {
      // Si IndexedDB falla, usar LocalStorage
      this.saveToLocalStorageBackup(keyData, salt)
      throw new StorageError(`Failed to save key: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async loadKey(): Promise<{ keyData: string; salt: string } | null> {
    try {
      const db = await this.initDB()
      const transaction = db.transaction([STORAGE_CONFIG.storeName], 'readonly')
      const store = transaction.objectStore(STORAGE_CONFIG.storeName)

      return new Promise((resolve, reject) => {
        const request = store.get('primary_key')
        request.onsuccess = () => {
          const result = request.result as StoredKey | undefined
          if (result) {
            resolve({ keyData: result.keyData, salt: result.salt })
          } else {
            resolve(null)
          }
        }
        request.onerror = () => reject(new StorageError('Failed to load key from IndexedDB'))
      })
    } catch (error) {
      // Si IndexedDB falla, intentar cargar desde LocalStorage
      const backupKey = this.loadFromLocalStorageBackup()
      if (!backupKey) {
        throw new StorageError(`Failed to load key: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
      return backupKey
    }
  }

  async deleteKey(): Promise<void> {
    try {
      const db = await this.initDB()
      const transaction = db.transaction([STORAGE_CONFIG.storeName], 'readwrite')
      const store = transaction.objectStore(STORAGE_CONFIG.storeName)

      return new Promise((resolve, reject) => {
        const request = store.delete('primary_key')
        request.onsuccess = () => {
          localStorage.removeItem(STORAGE_CONFIG.storageKey)
          resolve()
        }
        request.onerror = () => reject(new StorageError('Failed to delete key'))
      })
    } catch (error) {
      localStorage.removeItem(STORAGE_CONFIG.storageKey)
      throw new StorageError(`Failed to delete key: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  private saveToLocalStorageBackup(keyData: string, salt: string): void {
    try {
      const backup = { keyData, salt, timestamp: Date.now() }
      localStorage.setItem(STORAGE_CONFIG.storageKey, JSON.stringify(backup))
    } catch (error) {
      console.error('Failed to save backup to LocalStorage:', error)
    }
  }

  private loadFromLocalStorageBackup(): { keyData: string; salt: string } | null {
    try {
      const backup = localStorage.getItem(STORAGE_CONFIG.storageKey)
      if (!backup) return null
      const parsed = JSON.parse(backup)
      return { keyData: parsed.keyData, salt: parsed.salt }
    } catch (error) {
      console.error('Failed to load backup from LocalStorage:', error)
      return null
    }
  }
}

export const keyStore = new KeyStore()
