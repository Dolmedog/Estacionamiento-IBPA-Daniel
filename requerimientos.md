Descripción
Aplicación web, en donde se pueda ingresar información de contacto de una
persona (Nombre y Teléfono); con esa información se tiene que generar una
encriptación (esta encriptación se deberá de poder desencriptar
posteriormente), con el texto resultante (cadena de texto ya encriptado) se
debe de generar un QR. El cual se debe de poder imprimir en una impresora
térmica de etiquetas.
La aplicación también debe de contar con un lector del código QR y
desencriptar la información y mostrar la información de contacto.
El formulario para ingresar la información del contacto debe de ir el
Nombre, teléfono y Placa (placas de carro). La placa servirá para
identificar la etiqueta, el numero de placa ira como texto crudo a un lado
del QR. La información para encriptar debe de estar en formato Json, al
desencriptar, el resultado será un json con la información del contacto.
Al desencriptar la información, el teléfono deberá estar en un link tipo
teléfono, para que al darle click, se pueda llamar directamente sin tener
que copiar y pegar el teléfono
En los settings, se deberá de poder ingresar una llave/contraseña para
poder encriptar y desencriptar el QR, el input debe de ser tipo password,
para que no se vea la contraseña.
El menú de la aplicación consistirá en 3 secciones
1. Generar QR
2. Leer QR y mostrar la información
3. Settings
Requerimientos:
1. Tiene que funcionar 100% offline
a. PWA
2. Debe poder desplegarse en github de forma gratuita

3. Se corrigen las ambigüedades y se genera la version final
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
