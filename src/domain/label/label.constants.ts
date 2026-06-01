/**
 * Constantes de configuración para etiquetas y encriptación
 */

export const LABEL_SIZE = {
  widthInches: 3,
  heightInches: 2,
  // Conversión a milímetros (25.4 mm = 1 inch)
  get widthMm(): number {
    return this.widthInches * 25.4
  },
  get heightMm(): number {
    return this.heightInches * 25.4
  }
}

export const ENCRYPTION_CONFIG = {
  // PBKDF2 configuration
  algorithm: 'PBKDF2',
  hash: 'SHA-256',
  iterations: 100000,
  saltLength: 16,
  
  // AES-GCM configuration
  cipherAlgorithm: 'AES-GCM',
  keyLength: 256,
  ivLength: 12,
  
  // Payload format version
  payloadVersion: 'v1'
}

export const STORAGE_CONFIG = {
  // IndexedDB
  dbName: 'EncryptionKeyStore',
  dbVersion: 1,
  storeName: 'keys',
  keyPath: 'id',
  
  // LocalStorage
  storageKey: 'encryption_key_backup'
}

export const QR_CONFIG = {
  errorCorrectionLevel: 'H',
  type: 'image/png',
  quality: 0.95,
  margin: 1,
  width: 300
}
