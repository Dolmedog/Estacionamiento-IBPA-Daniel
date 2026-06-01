/**
 * Utilidades para codificación/decodificación Base64URL
 */

export function arrayToBase64Url(buffer: Uint8Array): string {
  const binary = String.fromCharCode(...buffer)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

export function base64UrlToArray(str: string): Uint8Array {
  // Añadir padding si es necesario
  const padded = str + '='.repeat((4 - (str.length % 4)) % 4)
  const binary = atob(padded.replace(/-/g, '+').replace(/_/g, '/'))
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}
