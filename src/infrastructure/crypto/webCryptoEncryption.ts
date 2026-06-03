/**
 * Servicio de encriptación usando Web Crypto API
 * Implementa AES-GCM con derivación de llave PBKDF2
 */

import { ENCRYPTION_CONFIG } from '@/domain/label/label.constants'
import { EncryptionError, EncryptedPayload } from '@/domain/crypto/crypto.types'

export class WebCryptoEncryption {
  /**
   * Derivar una llave criptográfica desde una contraseña
   */
  async deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    try {
      const encoder = new TextEncoder()
      const passwordKey = await crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        { name: ENCRYPTION_CONFIG.algorithm },
        false,
        ['deriveBits', 'deriveKey']
      )

      return await crypto.subtle.deriveKey(
        {
          name: ENCRYPTION_CONFIG.algorithm,
          salt,
          iterations: ENCRYPTION_CONFIG.iterations,
          hash: ENCRYPTION_CONFIG.hash
        },
        passwordKey,
        { name: ENCRYPTION_CONFIG.cipherAlgorithm, length: ENCRYPTION_CONFIG.keyLength },
        false,
        ['encrypt', 'decrypt']
      )
    } catch (error) {
      throw new EncryptionError(
        `Failed to derive key: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Encriptar datos JSON
   */
  async encrypt(data: Record<string, unknown>, password: string): Promise<EncryptedPayload> {
    try {
      const salt = crypto.getRandomValues(new Uint8Array(ENCRYPTION_CONFIG.saltLength))
      const iv = crypto.getRandomValues(new Uint8Array(ENCRYPTION_CONFIG.ivLength))

      const key = await this.deriveKey(password, salt)
      const encoder = new TextEncoder()
      const plaintext = encoder.encode(JSON.stringify(data))

      const ciphertext = await crypto.subtle.encrypt(
        { name: ENCRYPTION_CONFIG.cipherAlgorithm, iv },
        key,
        plaintext
      )

      return {
        salt,
        iv,
        ciphertext: new Uint8Array(ciphertext)
      }
    } catch (error) {
      throw new EncryptionError(
        `Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Desencriptar datos
   */
  async decrypt(payload: EncryptedPayload, password: string): Promise<Record<string, unknown>> {
    try {
      const key = await this.deriveKey(password, payload.salt)

      const plaintext = await crypto.subtle.decrypt(
        { name: ENCRYPTION_CONFIG.cipherAlgorithm, iv: payload.iv as any },
        key,
        payload.ciphertext
      )

      const decoder = new TextDecoder()
      const jsonString = decoder.decode(plaintext)

      try {
        return JSON.parse(jsonString)
      } catch {
        throw new EncryptionError('Decrypted data is not valid JSON')
      }
    } catch (error) {
      if (error instanceof EncryptionError) throw error
      throw new EncryptionError(
        `Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }
}

export const webCryptoEncryption = new WebCryptoEncryption()
