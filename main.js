import * as THREE from 'three';
import { ARButton } from 'three/addons/webxr/ARButton.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let container;
let camera, scene, renderer;
let controller;
let reticle;
let model = null;
let hitTestSource = null;
let hitTestSourceRequested = false;
let isAR = false;
let controls;

const info = document.getElementById('info');
const arButton = document.getElementById('ar-button');

init();
animate();

function init() {
  container = document.createElement('div');
  document.body.appendChild(container);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 3);
  light.position.set(0.5, 1, 0.25);
  scene.add(light);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  container.appendChild(renderer.domElement);

  // Controles para modo no AR (vista previa)
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.target.set(0, 0, -2);
  camera.position.set(0, 1, 2);

  // Reticle para hit-test
  const reticleGeometry = new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2);
  const reticleMaterial = new THREE.MeshBasicMaterial();
  reticle = new THREE.Mesh(reticleGeometry, reticleMaterial);
  reticle.matrixAutoUpdate = false;
  reticle.visible = false;
  scene.add(reticle);

  // Cargar modelo GLB
  const loader = new GLTFLoader();
  loader.load(
    './ALMT_BLANCO.glb',
    (gltf) => {
      model = gltf.scene;
      // Escalar y centrar modelo
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3()).length();
      const center = box.getCenter(new THREE.Vector3());
      model.position.x += (model.position.x - center.x);
      model.position.y += (model.position.y - center.y);
      model.position.z += (model.position.z - center.z);
      // Escala razonable para AR
      const scale = 0.5 / size;
      model.scale.set(scale, scale, scale);
      model.visible = false;
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      scene.add(model);
      info.textContent = 'Modelo cargado. Haz clic en "Entrar a AR" para colocarlo en superficies.';
      arButton.classList.add('visible');
    },
    (xhr) => {
      const percent = (xhr.loaded / xhr.total) * 100;
      if (xhr.total > 0) {
        info.textContent = `Cargando modelo... ${Math.round(percent)}%`;
      }
    },
    (error) => {
      console.error('Error cargando GLB:', error);
      info.textContent = 'Error al cargar el modelo GLB. Verifica que ALMT_BLANCO.glb esté en la misma carpeta.';
    }
  );

  // Controller
  controller = renderer.xr.getController(0);
  controller.addEventListener('select', onSelect);
  scene.add(controller);

  // AR Button
  arButton.addEventListener('click', () => {
    if (renderer.xr.isPresenting) {
      renderer.xr.getSession().end();
    } else {
      startAR();
    }
  });

  window.addEventListener('resize', onWindowResize);
}

function startAR() {
  isAR = true;
  controls.enabled = false;
  if (model) {
    model.visible = false;
  }
  reticle.visible = false;
  renderer.xr.setReferenceSpaceType('local');
  const sessionInit = {
    requiredFeatures: ['hit-test'],
    optionalFeatures: ['dom-overlay'],
    domOverlay: { root: document.body }
  };
  navigator.xr.requestSession('immersive-ar', sessionInit).then(onSessionStart);
}

function onSessionStart(session) {
  session.addEventListener('end', onSessionEnd);
  renderer.xr.setSession(session);
  arButton.textContent = 'Salir de AR';
  info.textContent = 'Mueve tu dispositivo para detectar superficies. Toca para colocar el buque.';
  hitTestSourceRequested = false;
  hitTestSource = null;
}

function onSessionEnd() {
  isAR = false;
  controls.enabled = true;
  arButton.textContent = 'Entrar a AR';
  if (model) {
    model.visible = false;
  }
  reticle.visible = false;
  info.textContent = 'Modelo listo. Haz clic en "Entrar a AR" para colocarlo en superficies.';
}

function onSelect() {
  if (reticle.visible && model) {
    model.position.setFromMatrixPosition(reticle.matrix);
    model.visible = true;
    info.textContent = 'Buque colocado. Usa gestos para mover/rotar/escalar.';
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

    if (hitTestSource) {
      const hitTestResults = frame.getHitTestResults(hitTestSource);
      if (hitTestResults.length) {
        const hit = hitTestResults[0];
        const pose = hit.getPose(referenceSpace);
        reticle.visible = true;
        reticle.matrix.fromArray(pose.transform.matrix);
      } else {
        reticle.visible = false;
      }
    }
  }

  controls.update();
  renderer.render(scene, camera);
}
