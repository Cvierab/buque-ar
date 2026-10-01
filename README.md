# Buque AR - ALMT BLANCO

Visor del buque en Realidad Aumentada con WebXR. Permite colocar el modelo `ALMT_BLANCO.glb` en superficies detectadas, así como mover, rotar y escalar el modelo.

## Características

- **Realidad Aumentada**: Usa WebXR Hit Test para detectar superficies y colocar el modelo.
- **Interacción**: Permite mover, rotar y escalar el modelo (gestos soportados según dispositivo).
- **Vista previa 3D**: En navegador sin AR, se puede visualizar con controles orbitales.
- **Compatible**: Requiere navegador con WebXR (Chrome, Android ARCore, Edge, Safari con soporte limitado).

## Uso

1. Clona este repositorio
2. Sirve los archivos con un servidor HTTP (WebXR requiere HTTPS o localhost)

### Servidor local

Usando Python:

```bash
python -m http.server 8000
```

Usando Node.js (http-server):

```bash
npx http-server -p 8000
```

3. Abre `http://localhost:8000` en un dispositivo compatible con AR (Android recomendado)
4. Pulsa "Entrar a AR", mueve el dispositivo para detectar superficies y toca para colocar el buque
5. Usa gestos para mover/rotar/escalar el modelo

## Archivos

- `index.html` - Página principal con importmap y ARButton
- `main.js` - Lógica Three.js + WebXR + Hit Test + controles
- `ALMT_BLANCO.glb` - Modelo 3D del buque

## Tecnologías

- [Three.js](https://threejs.org/) r160
- [WebXR](https://immersive-web.github.io/webxr/)
- [GLTFLoader](https://threejs.org/docs/#examples/en/loaders/GLTFLoader)

## Notas

- Para probar AR en móvil Android, se recomienda usar HTTPS (puedes usar ngrok, GitHub Pages, Netlify, etc.)
- En iOS, WebXR AR tiene soporte limitado; se recomienda probar en Android
