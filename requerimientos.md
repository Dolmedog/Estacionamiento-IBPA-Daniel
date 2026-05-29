Requerimientos de la aplicación
1. Descripción general
Se requiere desarrollar una aplicación web tipo PWA que funcione 100% offline. La
aplicación permitirá generar etiquetas con código QR a partir de información de contacto
encriptada, imprimirlas en una impresora térmica de etiquetas y posteriormente leerlas para
desencriptar y mostrar la información.
La aplicación deberá poder desplegarse gratuitamente en GitHub Pages u otro hosting
estático compatible.

2. Objetivo
Permitir que un usuario capture información básica de contacto asociada a una placa
vehicular, genere un código QR con la información sensible encriptada y pueda imprimir
una etiqueta física que contenga:

Posteriormente, la aplicación deberá permitir escanear el QR, desencriptar la información y
mostrar los datos del contacto.

3. Menú principal
La aplicación tendrá tres secciones:
3. Generar QR con la información encriptada del contacto
4. Leer y desencriptar la información del QR

Consideraciones: la llave para encriptar y desencriptar, tiene que ser
persistente, esto quiere decir que aunque el usuario cierre la aplicación,
la contraseña no se perderá, por lo cual tiene que estar guardada con
cierta redundancia. Usa IdexedDB con una opción para este proposito

Código QR con la información encriptada.
Número de placa visible en texto plano.

1. Generar QR
2. Leer QR

4. Generar QR
Campos del formulario
El formulario deberá solicitar:

Reglas
La información que se encriptará será únicamente la información de contacto sin la placa,
estructurada en formato JSON.
El teléfono ingresado deberá ser de 10 dígitos.
La aplicación deberá incluir un Toggle Switch para indicar si el teléfono corresponde a:

Dependiendo de la opción seleccionada, la aplicación deberá concatenar automáticamente
el código de país al teléfono capturado antes de generar el JSON.
Ejemplo:

El JSON deberá ser encriptado usando la llave configurada en Settings.
Con la cadena encriptada resultante se generará un código QR.
La placa deberá mostrarse como texto plano junto al QR en la etiqueta, para facilitar su
identificación visual sin necesidad de escanear el código.
3. Settings

Nombre
Teléfono
Placa del vehículo
Selector de país para teléfono mediante Toggle Switch

Estados Unidos: +1
México: +52

{
"nombre": "Juan Pérez",
"telefono": "+526641234567"
}

5. Impresión de etiqueta
La aplicación deberá permitir imprimir la etiqueta generada en una impresora térmica de
etiquetas.
La etiqueta deberá incluir:

El tamaño inicial de la etiqueta será de 2 x 3 pulgadas.
Este tamaño deberá considerarse configurable o fácilmente ajustable en el futuro, ya que
podría cambiar posteriormente.
Se deberá contemplar una vista previa antes de imprimir.

6. Leer QR
La aplicación deberá contar con una sección para leer códigos QR usando la cámara del
dispositivo.
Al leer un QR:

Visualización del resultado
La información desencriptada deberá mostrarse de forma clara:

El teléfono deberá mostrarse como enlace tipo tel: para permitir llamar directamente
desde dispositivos compatibles.
Ejemplo:
Código QR legible.
Placa en texto claro.
Diseño optimizado para impresión térmica.

1. Obtener la cadena encriptada.
2. Desencriptarla usando la llave configurada.
3. Convertir el resultado a JSON.
4. Mostrar la información del contacto.

Nombre
Teléfono

7. Settings
La sección Settings permitirá configurar la llave o contraseña utilizada para encriptar y
desencriptar la información.

Requerimientos

8. Funcionamiento offline
La aplicación deberá funcionar completamente sin conexión a internet después de su
primera carga.
Para ello deberá implementarse como PWA con:
<a href="tel:+526641234567">+52 664 123 4567</a>

El campo de contraseña deberá ser de tipo password .
La llave deberá persistir aunque el usuario cierre la aplicación.
La llave deberá almacenarse localmente.
Se deberá usar IndexedDB para persistencia.
La contraseña o llave deberá poder ser actualizada desde Settings.
Si la contraseña es actualizada, las etiquetas generadas anteriormente podrían dejar de
funcionar.
No será necesario mantener compatibilidad con etiquetas generadas con contraseñas
anteriores.
En caso de cambio de contraseña, se asume que las etiquetas anteriores serán
reemplazadas si esto llegara a ocurrir.
Se recomienda agregar redundancia de almacenamiento, por ejemplo:
IndexedDB como fuente principal.
LocalStorage como respaldo secundario.
Mecanismo de recuperación si una fuente falla.

Service Worker.
Cache de archivos estáticos.
Manifest web.
Soporte para instalación en dispositivo.
Operación offline para:
Generar QR.

9. Seguridad
La información de contacto no deberá almacenarse de ninguna forma.
Consideraciones mínimas:

Nota técnica importante: la llave se guarda localmente para persistencia, por lo cual no
puede considerarse completamente secreta ante alguien con acceso al dispositivo. Esto
está aceptado como una decisión de producto.

10. Criterios de aceptación
Generar QR
Encriptar información.
Leer QR.
Desencriptar información.
Consultar Settings.
Actualizar contraseña o llave.
Imprimir etiquetas.

La información del contacto deberá encriptarse antes de generar el QR.
La llave no deberá mostrarse en pantalla.
El input de llave deberá ser tipo password .
La contraseña o llave podrá actualizarse desde Settings.
Al actualizar la contraseña, los QR generados con una contraseña anterior podrían no
poder desencriptarse.
La aplicación deberá manejar errores cuando:
No exista llave configurada.
La llave sea incorrecta.
El QR no contenga información válida.
El contenido desencriptado no sea JSON válido.
El teléfono ingresado no tenga 10 dígitos.
No se haya seleccionado correctamente el país del teléfono.

El usuario puede capturar nombre, teléfono y placa.
El usuario puede seleccionar si el teléfono es americano +1 o mexicano +52 mediante
un Toggle Switch.
El teléfono ingresado debe ser de 10 dígitos.

Leer QR

Settings

Offline

11. Recomendaciones técnicas
La aplicación concatena automáticamente el código de país seleccionado al teléfono.
La aplicación genera un JSON con la información.
El JSON se encripta usando la llave configurada.
Se genera un QR con la cadena encriptada.
La placa se muestra en texto plano junto al QR.
La etiqueta puede imprimirse.
La etiqueta se genera inicialmente en tamaño 2 x 3 pulgadas.

El usuario puede escanear un QR desde la cámara.
La aplicación desencripta el contenido usando la llave configurada.
La información se muestra correctamente.
El teléfono aparece como link clickeable para llamar.
Si la llave es incorrecta, se muestra un error claro.

El usuario puede capturar una llave de encriptación.
La llave se guarda de forma persistente.
La llave sigue disponible al cerrar y volver a abrir la aplicación.
El campo de la llave no muestra el texto en claro.
El usuario puede actualizar la contraseña o llave.
Al actualizar la contraseña, se acepta que las etiquetas anteriores puedan dejar de
funcionar.

La aplicación funciona sin internet después de haber sido cargada o instalada.
Se puede generar, leer, desencriptar, actualizar Settings e imprimir sin conexión.

Frontend: React + Vite.
PWA: Vite PWA Plugin.
QR: librería cliente para generar y leer QR.
Encriptación: Web Crypto API.

Github
1. Crear una cuenta
2. Crear un repositorio nuevo
El nombre del repositorio es de su elección
El proyecto tiene que ser publico
Nota el README es la descripción del proyecto, aquí usualmente se agrega la documentación
para el uso de la aplicación o software que se haga
4. Crear los requerimientos
Dentro del repositorio de git hub crear un nuevo archivo

en ese archivo agregar los requerimientos
Persistencia: IndexedDB.
Hosting: GitHub Pages.
Impresión: CSS específico para impresión térmica con @media print .
Tamaño de etiqueta inicial: 2 x 3 pulgadas, definido en constantes o configuración para
facilitar cambios futuros.
