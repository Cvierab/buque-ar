# Buque AR - ALMT BLANCO

Visor del buque en **Realidad Aumentada universal**. Funciona directamente desde el navegador, **sin instalar nada**. Solo necesitas escanear un QR y abrir la URL.

## URL para QR

La página está lista para GitHub Pages:

**https://cvierab.github.io/buque-ar/**

Genera un QR con esa URL ([QRCode Monkey](https://qrcode-monkey.com/es), [QR Code Generator](https://es.qr-code-generator.com/), etc.) y escanéalo desde cualquier móvil.

## Compatibilidad (todos los dispositivos)

| Dispositivo | Experiencia AR | Notas |
|---|---|---|
| **iPhone / iPad (iOS 13+)** | **AR Quick Look** (nativo) | Se abre con la app nativa de iOS. No requiere instalación. |
| **Android 7.0+** | **Scene Viewer / Google AR** | Usa Google Scene Viewer si está disponible. Muy estable y sin instalación. |
| **Android (Chrome/Edge)** | **WebXR** | Fallback automático si Scene Viewer no está disponible. |
| **Ordenador/PC/Mac** | **Visor 3D** | Solo vista interactiva (sin AR). |
| **Tablets** | **3D o AR** | Detecta automáticamente lo mejor disponible. |

**Importante:** No pide instalar apps. Funciona con solo abrir el enlace.

## ¿Cómo usarlo?

1. Escanea el QR con la cámara de tu móvil
2. Toca el enlace para abrirlo en el navegador
3. Pulsa **"Ver en Realidad Aumentada"**
4. El dispositivo abrirá la experiencia AR nativa (Quick Look en iOS / Scene Viewer en Android)
5. Mueve el móvil para detectar superficies y coloca el buque
6. Puedes mover, rotar y ampliar con gestos naturales

## Características

- **100% compatible multi-plataforma**: Gracias a [model-viewer](https://modelviewer.dev/), elige automáticamente el mejor modo AR para cada dispositivo.
- **Cero instalación**: Solo web. No solicita permisos extra innecesarios.
- **Carga optimizada**: Se carga rápido incluso desde móvil con datos.
- **Interfaz limpia y minimalista**: Pensada para mostrar al escanear QR.
- **Auto-rotación**: Vista previa 3D atractiva mientras carga/visualiza.

## Activar GitHub Pages

Para que el QR funcione con la URL pública:

1. Ve a [Settings > Pages](https://github.com/Cvierab/buque-ar/settings/pages) del repositorio
2. En **Source** selecciona `Deploy from a branch`
3. Branch: `main` / Folder: `/ (root)`
4. Guarda. La URL `https://cvierab.github.io/buque-ar/` estará activa en ~1-2 minutos

## Archivos

- `index.html` - Página con model-viewer (universal, sin dependencias locales)
- `ALMT_BLANCO.glb` - Modelo 3D
- `main.js` (versión anterior, opcional) - No se usa en esta versión universal
- `README.md` - Instrucciones

## Tecnologías

- [@google/model-viewer](https://modelviewer.dev/) v4.0.0 - Visor 3D + AR universal
