import * as THREE from 'three';

/**
 * Creates a procedural cyber micro-grid / brushed metal normal map
 */
function createCyberDetailTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Dark background
  ctx.fillStyle = '#111822';
  ctx.fillRect(0, 0, size, size);

  // Micro circuits and hex lines
  ctx.strokeStyle = '#22384D';
  ctx.lineWidth = 1;

  for (let i = 0; i < size; i += 32) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, size);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(size, i);
    ctx.stroke();
  }

  // Accent cyber circuit pads
  ctx.fillStyle = '#00D9FF';
  for (let x = 32; x < size; x += 64) {
    for (let y = 32; y < size; y += 64) {
      if ((x + y) % 128 === 0) {
        ctx.fillRect(x - 2, y - 2, 4, 4);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createPBRMaterials() {
  const detailTexture = createCyberDetailTexture();

  // Dark Titanium (Head chassis, shoulder joints, spine)
  const titaniumMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#1C2533'),
    metalness: 0.92,
    roughness: 0.22,
    clearcoat: 0.6,
    clearcoatRoughness: 0.15,
    map: detailTexture
  });

  // Matte Graphite (Torso armor plates, jaw armor, mechanical collar)
  const graphiteMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#0F1722'),
    metalness: 0.45,
    roughness: 0.65,
    map: detailTexture
  });

  // Chrome / Brushed Silver Accents (Vertebrae bolts, piston rings, trims)
  const chromeMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#94A3B8'),
    metalness: 0.98,
    roughness: 0.12
  });

  // Luminous Electric Cyan (Optic eyes, neural pathways, core glow)
  const cyanGlowMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#00D9FF'),
    emissive: new THREE.Color('#00D9FF'),
    emissiveIntensity: 3.5,
    roughness: 0.1,
    metalness: 0.2
  });

  // Neon Blue (Secondary conduits, secondary optical sensors)
  const blueGlowMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#1677FF'),
    emissive: new THREE.Color('#1677FF'),
    emissiveIntensity: 2.8,
    roughness: 0.2,
    metalness: 0.3
  });

  // Translucent Holographic Glass (Reactor dome, visor lens)
  const holographicGlassMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#00D9FF'),
    metalness: 0.1,
    roughness: 0.05,
    transmission: 0.85,
    thickness: 0.8,
    transparent: true,
    opacity: 0.65,
    depthWrite: false,
    ior: 1.52
  });

  // Inner Reactor Core Material
  const reactorCoreMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color('#00F0FF')
  });

  return {
    titanium: titaniumMaterial,
    graphite: graphiteMaterial,
    chrome: chromeMaterial,
    cyanGlow: cyanGlowMaterial,
    blueGlow: blueGlowMaterial,
    glass: holographicGlassMaterial,
    reactorCore: reactorCoreMaterial,
    detailTexture
  };
}

export type MaterialLibrary = ReturnType<typeof createPBRMaterials>;
