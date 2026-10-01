# Buque AR - ALMT BLANCO

Visor del buque en Realidad Aumentada con WebXR. Ideal para escanear con QR y visualizar el modelo directamente desde el móvil.

## Demo / Uso con QR

Puedes desplegarlo en GitHub Pages para accederlo por URL y generar un QR:

1. Activa GitHub Pages: Settings > Pages > Source: Deploy from a branch > Branch: main > Folder: / (root)
2. La URL será: `https://cvierab.github.io/buque-ar/`
3. Genera un QR con esa URL (Google QR, qrcode-monkey.com, qr.tec-it.com, etc.)
4. Escanea el QR desde un móvil compatible con AR.

## Características

- **Realidad Aumentada**: Usa WebXR Hit Test para detectar superficies y colocar el modelo.
- **Interacción**: Permite mover, rotar y escalar el modelo con gestos.
- **Vista previa 3D**: En navegador sin AR, modo orbital.
- **Listo para QR**: Optimizado para abrir directamente en móvil.

## Uso local

Requiere servidor HTTP (WebXR no funciona con `file://`).

```bash
python -m http.server 8000
```

O con npm:

```bash
npm start
```

Abrir `http://localhost:8000` en dispositivo compatible.

## Compatibilidad

- **Android**: Chrome, Edge, Samsung Internet (recomendado, con ARCore)
- **iOS**: Soporte WebXR AR limitado. Recomendado Android.
- **Requisitos**: Dispositivo con seguimiento de superficies (ARCore/ARKit según plataforma)

## Despliegue

- **GitHub Pages**: Gratis, ideal para QR (HTTPS automático)
- **Netlify/Vercel**: También recomendados (HTTPS + CDN)

## Archivos

- `index.html` - Página principal
- `main.js` - Lógica Three.js + WebXR + Hit Test
- `ALMT_BLANCO.glb` - Modelo 3D del buque

## Tecnologías

- [Three.js](https://threejs.org/) r160
- [WebXR](https://immersive-web.github.io/webxr/)
