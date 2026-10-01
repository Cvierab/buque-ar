# Buque AR - ALMT BLANCO

Visor del buque en Realidad Aumentada con WebXR. **Listo para escanear con QR** y visualizar directamente en el móvil.

## Demo / URL para QR

1. Activa GitHub Pages en: `Settings > Pages > Source: Deploy from a branch > Branch: main > / (root)`
2. URL pública: [https://cvierab.github.io/buque-ar/](https://cvierab.github.io/buque-ar/)
3. Genera un código QR con esa URL (puedes usar [QRCode Monkey](https://qrcode-monkey.com/es), [QR Code Generator](https://es.qr-code-generator.com/) o [qr.tec-it.com](https://qr.tec-it.com/es/qrcode))
4. Escanea el QR desde tu móvil - ¡se abrirá directamente en AR!

## Características

- **Realidad Aumentada**: WebXR Hit Test para detectar superficies y colocar el modelo.
- **Mover, Rotar y Escalar**: Control total sobre la posición del buque tras colocarlo.
- **Interacción táctil**: Soporta gestos nativos en AR (pinch, drag, rotate según dispositivo).
- **Controles por teclado** (modo vista previa/PC): `T` = Mover, `R` = Rotar, `S` = Escalar, `X` = Cambiar modo, `Esc` = Salir
- **Vista previa 3D**: Controles orbitales cuando no estás en AR.
- **Optimizado para móvil**: UI adaptada para escaneo con QR.

## Instrucciones de uso

1. Escanea el QR con tu teléfono móvil
2. Pulsa "Ver en Realidad Aumentada"
3. Mueve el dispositivo para detectar superficies (suelo/paredes)
4. Toca la pantalla para colocar el buque
5. Usa gestos para mover, rotar o escalar el modelo

## Uso local (desarrollo)

WebXR requiere HTTPS o `localhost`. Usa un servidor local:

```bash
# Con Python
python -m http.server 8000

# Con npm
npm start
```

Abre `http://localhost:8000` en un dispositivo compatible.

## Compatibilidad

- **Android**: Chrome, Edge, Samsung Internet (recomendado - requiere ARCore)
- **iOS**: WebXR AR tiene soporte limitado. Se recomienda Android para mejor experiencia.
- **PC**: Vista previa 3D únicamente (sin AR).

## Despliegue recomendado

- [GitHub Pages](https://pages.github.com/) - Ideal para QR (HTTPS automático, gratis)
- [Netlify](https://www.netlify.com/) - Excelente para WebXR, HTTPS automático
- [Vercel](https://vercel.com/) - También muy recomendado

## Archivos

- `index.html` - Interfaz web
- `main.js` - Lógica Three.js, WebXR, Hit Test y TransformControls
- `ALMT_BLANCO.glb` - Modelo 3D del buque (25.4 MB)
- `README.md` - Documentación

## Tecnologías

- [Three.js](https://threejs.org/) v0.160.0
- [WebXR API](https://immersive-web.github.io/webxr/)
- [GLTFLoader](https://threejs.org/docs/#examples/en/loaders/GLTFLoader)
- [TransformControls](https://threejs.org/docs/#examples/en/controls/TransformControls)
