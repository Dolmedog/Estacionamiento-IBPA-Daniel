/**
 * Mensajes de error centralizados para la aplicación
 */

export const ErrorMessages = {
  // Settings errors
  KEY_REQUIRED: 'La llave de encriptación es requerida',
  KEY_TOO_SHORT: 'La llave debe tener al menos 8 caracteres',
  KEY_UPDATE_FAILED: 'Error al actualizar la llave',
  KEY_SAVE_FAILED: 'Error al guardar la llave',
  KEY_LOAD_FAILED: 'Error al cargar la llave',

  // Validation errors
  INVALID_FORM: 'Por favor completa todos los campos correctamente',
  PHONE_INVALID: 'El teléfono debe tener exactamente 10 dígitos',
  NAME_REQUIRED: 'El nombre es requerido',

  // Encryption errors
  ENCRYPTION_FAILED: 'Error durante la encriptación',
  DECRYPTION_FAILED: 'Error durante la desencriptación',
  INVALID_PAYLOAD: 'El payload encriptado es inválido',

  // Storage errors
  STORAGE_ERROR: 'Error al acceder al almacenamiento del dispositivo',
  IINDEXEDDB_UNAVAILABLE: 'IndexedDB no disponible en este dispositivo',

  // General errors
  UNKNOWN_ERROR: 'Ocurrió un error inesperado',
  NO_KEY_CONFIGURED: 'No hay llave de encriptación configurada'
}

export const SuccessMessages = {
  KEY_SAVED: 'Llave guardada correctamente',
  KEY_UPDATED: 'Llave actualizada correctamente',
  LABEL_GENERATED: 'Etiqueta generada correctamente',
  LABEL_PRINTED: 'Etiqueta enviada a imprimir'
}

export const WarningMessages = {
  KEY_CHANGE_WARNING:
    'Advertencia: Los códigos QR generados con la contraseña anterior ya no se podrán desencriptar. Por favor ten cuidado al cambiar la llave.',
  UNSAVED_CHANGES: 'Tienes cambios sin guardar'
}
