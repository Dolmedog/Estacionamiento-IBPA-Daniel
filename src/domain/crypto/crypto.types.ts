/**
 * Tipos relacionados con encriptación y gestión de llaves
 */

export interface EncryptionKey {
  key: CryptoKey
  salt: Uint8Array
}

export interface EncryptedPayload {
  salt: Uint8Array
  iv: Uint8Array
  ciphertext: Uint8Array
}

export class EncryptionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'EncryptionError'
  }
}

export class StorageError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'StorageError'
  }
}
