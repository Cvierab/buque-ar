# Buque AR - ALMT BLANCO

El proyecto mantiene **ambas experiencias** de Realidad Aumentada, sin perder la que ya funcionaba perfectamente.

## URLs

Con el selector en `index.html`, tienes estas rutas:

| Ruta | Descripción |
|---|---|
| **`/`** o **index.html** | Pantalla de selección (elige experiencia) |
| **`/universal.html`** | **Experiencia Universal (RECOMENDADA)** - Scene Viewer (Android) / Quick Look (iOS). Funciona en TODOS los dispositivos. Sin instalar nada. |
| **`/ar-inpage.html`** | **AR en Página** - Cámara + modelo 3D dentro del mismo navegador (como el ejemplo de Snap Lens). Solo funciona donde WebXR AR esté soportado (mejor Android Chrome/Edge). |

## URL para QR (pública)

Con GitHub Pages activo: **https://cvierab.github.io/buque-ar/**

Esta URL te llevará directamente a la **pantalla de selección**. Ahí puedes elegir la experiencia.

Si quieres que el QR vaya **directamente** a una experiencia concreta (sin selector):

- Universal (más estable, recomendado para QR público): `https://cvierab.github.io/buque-ar/universal.html`
- In-page (cámara + 3D dentro de web): `https://cvierab.github.io/buque-ar/ar-inpage.html`

**Mi recomendación para QR:** Usa `universal.html` directamente. Es la que te funciona perfecta en todos los dispositivos.

## ¿Cuándo usar cada una?

- **Universal**: QR público, eventos, mostrar a cualquier persona (iOS + Android + todos). **Esta es la segura**.
- **In-page**: Quieres el efecto "solo cámara + 3D" dentro de la web (sin saltar a otra app), pruebas en Android moderno.

## Activar GitHub Pages

1. Ir a [Settings > Pages](https://github.com/Cvierab/buque-ar/settings/pages)
2. Source: `Deploy from a branch` → Branch: `main` → `/ (root)`
3. Guardar (espera 1-2 minutos)

Una vez desplegado, ambas URLS funcionarán.
