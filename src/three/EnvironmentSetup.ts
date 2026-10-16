import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export function setupEnvironment(scene: THREE.Scene, renderer: THREE.WebGLRenderer) {
  // 1. Mandatory Studio Environment Reflection via RoomEnvironment
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();
  const roomEnv = new RoomEnvironment();
  scene.environment = pmremGenerator.fromScene(roomEnv, 0.04).texture;
  pmremGenerator.dispose();

  // 2. Scene Fog matching background #050B14
  scene.background = new THREE.Color('#050B14');
  scene.fog = new THREE.FogExp2('#050B14', 0.12);

  // 3. Balanced Studio Lighting Rig (≤ 3 Shadow Casters)
  // Cool Hemisphere Light fill
  const hemiLight = new THREE.HemisphereLight('#00D9FF', '#07111F', 0.85);
  hemiLight.position.set(0, 20, 0);
  scene.add(hemiLight);

  // Warm Directional Key Light with tight shadow frustum
  const keyLight = new THREE.DirectionalLight('#E0F2FE', 2.2);
  keyLight.position.set(3.5, 4.5, 4.0);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 1024;
  keyLight.shadow.mapSize.height = 1024;
  keyLight.shadow.bias = -0.0005;
  keyLight.shadow.normalBias = 0.02;
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 15;
  keyLight.shadow.camera.left = -2.5;
  keyLight.shadow.camera.right = 2.5;
  keyLight.shadow.camera.top = 2.5;
  keyLight.shadow.camera.bottom = -2.5;
  scene.add(keyLight);

  // Electric Cyan Rim/Backlight for striking silhouette separation
  const rimLight = new THREE.DirectionalLight('#00D9FF', 3.0);
  rimLight.position.set(-3.5, 3.0, -3.5);
  scene.add(rimLight);

  // Subtle bottom up-light
  const floorGlow = new THREE.PointLight('#1677FF', 1.2, 5.0);
  floorGlow.position.set(0, -0.6, 0);
  scene.add(floorGlow);

  // 4. Ground Contact Shadow Plane beneath NADI
  const contactCanvas = document.createElement('canvas');
  contactCanvas.width = 256;
  contactCanvas.height = 256;
  const ctx = contactCanvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(128, 128, 10, 128, 128, 120);
  gradient.addColorStop(0, 'rgba(0, 217, 255, 0.45)');
  gradient.addColorStop(0.3, 'rgba(7, 17, 31, 0.7)');
  gradient.addColorStop(0.8, 'rgba(5, 11, 20, 0.3)');
  gradient.addColorStop(1, 'rgba(5, 11, 20, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);

  const contactTex = new THREE.CanvasTexture(contactCanvas);
  contactTex.colorSpace = THREE.SRGBColorSpace;

  const shadowGeo = new THREE.PlaneGeometry(3.5, 3.5);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: contactTex,
    transparent: true,
    opacity: 0.7,
    depthWrite: false
  });
  const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.position.y = -0.44;
  scene.add(shadowMesh);

  // 5. Floating Cyber Dust Particles
  const particleCount = 280;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    particlePositions[i] = (Math.random() - 0.5) * 12;
    particlePositions[i + 1] = (Math.random() - 0.2) * 8;
    particlePositions[i + 2] = (Math.random() - 0.5) * 10;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

  const particleMat = new THREE.PointsMaterial({
    color: 0x00D9FF,
    size: 0.035,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending
  });

  const dustParticles = new THREE.Points(particleGeo, particleMat);
  scene.add(dustParticles);

  return {
    keyLight,
    rimLight,
    dustParticles,
    updateParticles: (time: number) => {
      dustParticles.rotation.y = time * 0.02;
    }
  };
}
