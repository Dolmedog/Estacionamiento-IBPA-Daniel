# Estacionamiento IBPA Daniel - Etiquetas QR con Encriptación

Una aplicación web PWA offline-first que permite generar, imprimir y escanear etiquetas con código QR encriptados para asociar información de contacto a placas vehiculares.

## 🎯 Descripción General

Esta aplicación web tipo PWA funciona 100% offline y permite:

1. **Generar etiquetas** con código QR que contiene información de contacto encriptada
2. **Imprimir etiquetas** en impresoras térmicas de etiquetas (tamaño: 2 x 3 pulgadas)
3. **Leer y desencriptar** códigos QR usando la cámara del dispositivo
4. **Persistir llaves de encriptación** de forma segura en el dispositivo

La aplicación se puede desplegar gratuitamente en GitHub Pages u otro hosting estático.

---

## 🚀 Características Principales

### 1. Generar Etiqueta QR
- Captura datos del contacto: **nombre**, **teléfono** y **placa del vehículo**
- Selector de país para el teléfono (Estados Unidos +1 o México +52)
- Validación: teléfono debe tener 10 dígitos
- Encriptación automática de datos de contacto en formato JSON
- Generación de código QR con payload compacto
- Visualización de placa en texto plano junto al QR
- Vista previa de etiqueta antes de imprimir

### 2. Leer Etiqueta QR
- Acceso a cámara del dispositivo para escanear QR
- Desencriptación automática usando la llave configurada
- Visualización clara de información desencriptada:
  - **Nombre**
  - **Teléfono** como enlace `tel:` (clickeable para llamar)
- Manejo de errores: llave incorrecta, QR inválido, etc.

### 3. Configuración (Settings)
- Configuración segura de la llave de encriptación
- Campo de tipo `password` (no muestra el texto)
- Persistencia automática en IndexedDB con respaldo en LocalStorage
- Posibilidad de actualizar la llave con advertencia sobre etiquetas previas

### 4. Impresión Térmica
- Diseño optimizado para impresoras térmicas
- Tamaño inicial: **2 x 3 pulgadas** (configurable)
- Incluye: código QR + placa en texto plano
- CSS específico con `@media print` para calidad de impresión
- Vista previa antes de enviar a imprimir

### 5. Operación Offline
- Funciona completamente sin internet después de primera carga
- Service Worker para caché de archivos estáticos
- Manifest web para instalación como PWA
- Todas las operaciones (generar, leer, encriptar, imprimir) funcionan offline

---

## 🛠️ Stack Técnico

| Componente | Tecnología |
|-----------|------------|
| Framework Frontend | React + Vite |
| Lenguaje | TypeScript (estricto) |
| PWA | Vite PWA Plugin |
| Encriptación | Web Crypto API (AES-GCM) |
| Derivación de llave | PBKDF2 |
| QR | Librería cliente (generación y lectura) |
| Persistencia | IndexedDB + LocalStorage |
| Impresión | CSS @media print |
| Hosting | GitHub Pages (estático) |

---

## 📋 Requerimientos Funcionales

### Generar QR

```json
{
  "nombre": "Juan Pérez",
  "telefono": "+526641234567"
}
```

**Flujo:**
1. Capturar nombre, teléfono (10 dígitos) y placa
2. Seleccionar país (Estados Unidos +1 o México +52)
3. Concatenar automáticamente código de país
4. Crear JSON con **solo datos de contacto** (sin placa)
5. Encriptar con llave configurada
6. Generar QR con payload compacto: `v1.<payloadBase64Url>`
7. Mostrar QR + placa en texto plano
8. Permitir impresión

**Formato de Payload Compacto:**
```
v1.<base64url(salt + iv + ciphertext)>
```

Internamente: `[salt][iv][ciphertext]`

### Leer QR

**Flujo:**
1. Solicitar acceso a cámara
2. Leer contenido del QR
3. Interpretar payload según versión (v1)
4. Separar salt, iv y ciphertext
5. Desencriptar con llave configurada
6. Convertir resultado a JSON
7. Validar estructura esperada
8. Mostrar nombre y teléfono (como link `tel:`)

### Settings

**Requerimientos:**
- Input de tipo `password` para la llave
- Persistencia en IndexedDB (principal)
- Respaldo en LocalStorage (secundario)
- Servicio de recuperación automática si una fuente falla
- Posibilidad de actualizar llave con advertencia

### Offline

**Requisitos PWA:**
- ✅ Service Worker registrado
- ✅ Caché de assets estáticos
- ✅ Manifest web (`manifest.webmanifest`)
- ✅ Soporte para instalación en dispositivo
- ✅ Operación offline para: generar QR, leer QR, encriptar, desencriptar, imprimir

---

## 🔒 Seguridad

**Consideraciones mínimas:**

- ✅ Información de contacto **no se almacena** de ninguna forma
- ✅ Llave **no se muestra en pantalla** (input type="password")
- ✅ Encriptación con **AES-GCM** + derivación **PBKDF2**
- ✅ **Placa NO incluida** en contenido encriptado
- ⚠️ **Nota importante:** La llave se guarda localmente para persistencia, por lo que no es completamente secreta si alguien accede al dispositivo. Esta decisión ha sido aceptada en requerimientos.

**Lo que NO se hace:**
- No se guardan contactos desencriptados
- No se loguean datos sensibles
- No se incluyen datos sensibles en URLs
- No se persisten JSONs desencriptados
- No se incluyen metadatos descriptivos en QR

---

## ✅ Criterios de Aceptación

### Generar QR
- [ ] Encriptar información de contacto
- [ ] Generar QR válido con payload compacto
- [ ] Mostrar placa en texto plano
- [ ] Permitir impresión en tamaño 2 x 3 pulgadas
- [ ] Validar: nombre, teléfono 10 dígitos, placa, país

### Leer QR
- [ ] Escanear código QR desde cámara
- [ ] Desencriptar con llave configurada
- [ ] Mostrar información claramente
- [ ] Teléfono como link clickeable
- [ ] Manejar errores (llave incorrecta, QR inválido, JSON corrupto)

### Settings
- [ ] Capturar llave de encriptación
- [ ] Guardar de forma persistente (IndexedDB + LocalStorage)
- [ ] Disponible al cerrar/reabrir aplicación
- [ ] Campo de tipo password
- [ ] Posibilidad de actualizar llave con advertencia

### Offline
- [ ] Funciona sin internet después de carga inicial
- [ ] Generar, leer, encriptar, desencriptar e imprimir offline
- [ ] PWA instalable en dispositivo

---

## 🏗️ Arquitectura

Se recomienda una arquitectura **orientada al dominio** con "Screaming Architecture":

```
src/
├── app/
│   ├── router/
│   ├── providers/
│   └── pwa/
├── features/
│   ├── generate-label/
│   ├── scan-label/
│   └── settings/
├── domain/
│   ├── contact/
│   ├── label/
│   └── crypto/
├── infrastructure/
│   ├── crypto/
│   ├── storage/
│   ├── qr/
│   └── printing/
└── shared/
    ├── components/
    ├── hooks/
    ├── utils/
    └── errors/
```

**Principios:**
- Separar lógica de negocio de componentes UI
- Usar servicios para: QR, Crypto, Storage, Printing
- Centralizar validaciones y constantes configurables
- Manejar errores con tipos específicos

---

## 📦 Casos de Uso Principales

1. **GenerateEncryptedQrLabel** - Generar etiqueta QR encriptada
2. **ReadEncryptedQrLabel** - Leer y desencriptar QR
3. **SaveEncryptionKey** - Guardar llave de encriptación
4. **LoadEncryptionKey** - Cargar llave persistida
5. **UpdateEncryptionKey** - Actualizar llave con recuperación de respaldo
6. **PrintLabel** - Imprimir etiqueta
7. **ValidateContactInput** - Validar datos de entrada
8. **RecoverStoredKey** - Recuperar llave desde respaldo si falla principal

---

## ⚙️ Configuración

### Tamaño de Etiqueta

Definido como constante configurable:

```typescript
const LABEL_SIZE = {
  widthInches: 3,
  heightInches: 2
};
```

Se puede cambiar fácilmente para futuros ajustes de tamaño.

### CSS para Impresión

```css
@media print {
  @page {
    size: 3in 2in;
    margin: 0;
  }
}
```

---

## 🚦 Decisiones Técnicas Aceptadas

✅ La llave se guarda localmente (no completamente secreta si acceso al dispositivo)  
✅ No se almacenan contactos  
✅ No se mantiene compatibilidad con llaves anteriores  
✅ No se requiere backend  
✅ GitHub Pages como destino de despliegue válido  
✅ Payload compacto versionado en lugar de JSON descriptivo  
✅ Prioriza baja densidad de QR sobre legibilidad humana

---

## 📱 Requisitos del Sistema

- **Navegadores:** Modernos (Chrome, Firefox, Safari, Edge)
- **Dispositivos:** Desktop y Mobile
- **Acceso:** Cámara (para lectura de QR)
- **Almacenamiento:** IndexedDB + LocalStorage disponibles

---

## 🔄 Buenas Prácticas Obligatorias

### Código
- ✅ TypeScript estricto
- ✅ Separar lógica de componentes
- ✅ Evitar lógica criptográfica en React
- ✅ Servicios centralizados
- ✅ Manejo de errores específicos

### Seguridad
- ✅ No guardar contactos
- ✅ No mostrar llave en texto claro
- ✅ No loguear datos sensibles
- ✅ Limpiar estados sensibles
- ✅ Errores sin exponer detalles internos

### UX
- ✅ Mensajes claros cuando falte llave
- ✅ Deshabilitar generación si formulario es inválido
- ✅ Vista previa antes de imprimir
- ✅ Advertencias al cambiar llave
- ✅ Informar sobre impacto en etiquetas previas

---

## 📝 Validaciones

- ✅ Teléfono: exactamente 10 dígitos
- ✅ Construcción correcta con código de país (+1 o +52)
- ✅ Encriptación y desencriptación con misma llave
- ✅ Fallar claramente con llave incorrecta
- ✅ Validar JSON en desencriptación
- ✅ Validar estructura esperada de contacto

---

## 🎓 Próximas Fases de Desarrollo

- Soportar más países (agregar códigos telefónicos)
- Cambiar tamaño de etiqueta dinámicamente
- Actualizar algoritmo de encriptación
- Agregar temas de diseño
- Integración con sistemas de gestión de estacionamiento

---

## 📄 Documentación Adicional

- [Requerimientos Generales](requerimientos.md)
- [Requerimientos Técnicos](requerimientos_tecnicos.md)

---

## 👤 Autor

Daniel - IBPA

---

**Última actualización:** 2026-06-01
