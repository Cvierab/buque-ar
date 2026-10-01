import * as THREE from 'three';
import { ARButton } from 'three/addons/webxr/ARButton.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';

let camera, scene, renderer;
let controller;
let reticle;
let model = null;
let hitTestSource = null;
let hitTestSourceRequested = false;
let isAR = false;
let controls;
let transformControls = null;
let isTransformActive = false;

const info = document.getElementById('info');
const arButton = document.getElementById('ar-button');
const instructions = document.getElementById('instructions');

init();
animate();

function init() {
  const container = document.createElement('div');
  document.body.appendChild(container);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 50);

  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 4);
  light.position.set(0.5, 1, 0.25);
  scene.add(light);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(1, 4, 2);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.target.set(0, 0, -2);
  camera.position.set(0, 1.5, 2.5);

  const reticleGeometry = new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2);
  const reticleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  reticle = new THREE.Mesh(reticleGeometry, reticleMaterial);
  reticle.matrixAutoUpdate = false;
  reticle.visible = false;
  scene.add(reticle);

  const loader = new GLTFLoader();
  loader.load(
    './ALMT_BLANCO.glb',
    (gltf) => {
      model = gltf.scene;
      model.visible = false;
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            child.material.metalness = 0.1;
            child.material.roughness = 0.8;
          }
        }
      });
      scene.add(model);
      info.textContent = 'Modelo cargado correctamente. Pulsa "Ver en Realidad Aumentada" para comenzar.';
      arButton.classList.add('visible');
    },
    (xhr) => {
      if (xhr.total > 0) {
        const percent = Math.round((xhr.loaded / xhr.total) * 100);
        info.textContent = `Cargando modelo... ${percent}%`;
      }
    },
    (error) => {
      console.error('Error cargando GLB:', error);
      info.textContent = 'Error al cargar el modelo. Verifica que ALMT_BLANCO.glb esté en la carpeta.';
    }
  );

  controller = renderer.xr.getController(0);
  controller.addEventListener('select', onSelect);
  scene.add(controller);

  transformControls = new TransformControls(camera, renderer.domElement);
  transformControls.size = 0.5;
  transformControls.addEventListener('dragging-changed', (event) => {
    controls.enabled = !event.value;
    isTransformActive = event.value;
  });
  transformControls.attach(model);
  transformControls.visible = false;
  scene.add(transformControls);

  window.addEventListener('resize', onWindowResize);

  arButton.addEventListener('click', () => {
    if (renderer.xr.isPresenting) {
      const session = renderer.xr.getSession();
      if (session) session.end();
    } else {
      startAR();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (!model || !model.visible) return;
    switch (event.key) {
      case 't':
      case 'T':
        toggleTransform('translate');
        break;
      case 'r':
      case 'R':
        toggleTransform('rotate');
        break;
      case 's':
      case 'S':
        toggleTransform('scale');
        break;
      case 'x':
      case 'X':
        toggleTransformMode();
        break;
      case 'Escape':
        disableTransform();
        break;
    }
  });
}

function toggleTransform(mode) {
  if (!model || !model.visible) return;
  if (transformControls.visible && transformControls.mode === mode) {
    disableTransform();
    return;
  }
  transformControls.attach(model);
  transformControls.mode = mode;
  transformControls.visible = true;
  controls.enabled = false;
  info.textContent = `Modo: ${mode === 'translate' ? 'Mover' : mode === 'rotate' ? 'Rotar' : 'Escalar'}. Pulsa Esc para salir.`;
}

function toggleTransformMode() {
  if (!transformControls.visible) return;
  const modes = ['translate', 'rotate', 'scale'];
  const current = modes.indexOf(transformControls.mode);
  const next = (current + 1) % modes.length;
  transformControls.mode = modes[next];
  info.textContent = `Modo: ${modes[next] === 'translate' ? 'Mover' : modes[next] === 'rotate' ? 'Rotar' : 'Escalar'}. Pulsa Esc para salir.`;
}

function disableTransform() {
  transformControls.visible = false;
  controls.enabled = !isAR;
  if (model && model.visible) {
    info.textContent = isAR ? 'Buque colocado. Puedes mover/rotar/escalar con gestos o teclas T/R/S.' : 'Vista previa. Usa ratón para orbitar.';
  }
}

function startAR() {
  isAR = true;
  controls.enabled = false;
  disableTransform();
  if (model) {
    model.visible = false;
  }
  reticle.visible = false;
  renderer.xr.setReferenceSpaceType('local');
  const sessionInit = {
    requiredFeatures: ['hit-test'],
    optionalFeatures: ['dom-overlay', 'hand-tracking'],
    domOverlay: { root: document.body }
  };
  navigator.xr.requestSession('immersive-ar', sessionInit).then(onSessionStart).catch((err) => {
    console.error('Error iniciando AR:', err);
    info.textContent = 'No se pudo iniciar AR. Verifica que tu navegador/dispositivo soporte WebXR AR.';
    isAR = false;
    controls.enabled = true;
  });
}

function onSessionStart(session) {
  session.addEventListener('end', onSessionEnd);
  renderer.xr.setSession(session);
  arButton.innerHTML = `
    <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 6h12v12H6V6z"/>
    </svg>
    Salir de AR
  `;
  info.textContent = 'Mueve tu dispositivo para detectar superficies horizontales...';
  instructions.classList.add('visible');
  hitTestSourceRequested = false;
  hitTestSource = null;
}

function onSessionEnd() {
  isAR = false;
  controls.enabled = true;
  arButton.innerHTML = `
    <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 4.5A1.5 1.5 0 014.5 3h3A1.5 1.5 0 019 4.5V5h6v-.5A1.5 1.5 0 0116.5 3h3A1.5 1.5 0 0121 4.5v3A1.5 1.5 0 0119.5 9H19v6h.5a1.5 1.5 0 011.5 1.5v3a1.5 1.5 0 01-1.5 1.5h-3a1.5 1.5 0 01-1.5-1.5V19H9v.5A1.5 1.5 0 017.5 21h-3A1.5 1.5 0 013 19.5v-3A1.5 1.5 0 014.5 15H5V9h-.5A1.5 1.5 0 013 7.5v-3zM5 7v2h2V7H5zm12 0v2h2V7h-2zM7 5H5v2h2V5zm10 0h-2v2h2V5zM5 15v2h2v-2H5zm12 0v2h2v-2h-2zm-8-4h6v6H9V9zm2 2v2h2v-2h-2z"/>
    </svg>
    Ver en Realidad Aumentada
  `;
  instructions.classList.remove('visible');
  disableTransform();
  if (model) {
    model.visible = false;
  }
  reticle.visible = false;
  info.textContent = 'Modelo listo. Pulsa para volver a entrar en AR.';
}

function onSelect() {
  if (reticle.visible && model && !isTransformActive) {
    model.position.setFromMatrixPosition(reticle.matrix);
    model.quaternion.setFromRotationMatrix(reticle.matrix);
    model.visible = true;
    reticle.visible = false;
    info.textContent = '¡Buque colocado! Toca y arrastra para mover/rotar/escalar (o usa T/R/S en PC)';
    setTimeout(() => {
      if (isAR) {
        info.textContent = 'Puedes ajustar posición, rotación y escala con gestos';
      }
    }, 3000);
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  renderer.setAnimationLoop(render);
}

function render(timestamp, frame) {
  if (isAR && frame) {
    const referenceSpace = renderer.xr.getReferenceSpace();
    const session = renderer.xr.getSession();

    if (hitTestSourceRequested === false) {
      session.requestReferenceSpace('viewer').then((referenceSpace) => {
        session.requestHitTestSource({ space: referenceSpace }).then((source) => {
          hitTestSource = source;
        });
      });
      session.addEventListener('end', () => {
        hitTestSourceRequested = false;
        hitTestSource = null;
      });
      hitTestSourceRequested = true;
    }

    if (hitTestSource && referenceSpace) {
      const hitTestResults = frame.getHitTestResults(hitTestSource);
      if (hitTestResults.length > 0) {
        const hit = hitTestResults[0];
        const pose = hit.getPose(referenceSpace);
        if (pose) {
          reticle.visible = true;
          reticle.matrix.fromArray(pose.transform.matrix);
        }
      } else {
        reticle.visible = false;
      }
    }
  }

  controls.update();
  renderer.render(scene, camera);
}
