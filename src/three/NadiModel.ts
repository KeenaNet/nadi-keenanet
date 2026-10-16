import * as THREE from 'three';
import { MaterialLibrary } from './materials';

export class NadiHumanoidModel {
  public group: THREE.Group;
  public headGroup: THREE.Group;
  public torsoGroup: THREE.Group;
  public reactorGroup: THREE.Group;
  public reactorLight: THREE.PointLight;
  public leftEyeLight: THREE.PointLight;
  public rightEyeLight: THREE.PointLight;

  private outerRing!: THREE.Mesh;
  private middleRing!: THREE.Mesh;
  private innerCore!: THREE.Mesh;
  private leftEye!: THREE.Mesh;
  private rightEye!: THREE.Mesh;
  private materials: MaterialLibrary;

  // Reusable vector for look-at damping without GC
  private targetHeadRotation: THREE.Euler = new THREE.Euler();
  private pointerWorld: THREE.Vector3 = new THREE.Vector3();

  constructor(materials: MaterialLibrary) {
    this.materials = materials;
    this.group = new THREE.Group();
    this.group.name = 'nadi-character';

    // 1. TORSO GROUP
    this.torsoGroup = new THREE.Group();
    this.buildTorso();

    // 2. NECK & HEAD GROUP
    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 1.45, 0.05); // Pivot at base of neck/head
    this.buildHead();

    // 3. REACTOR CORE ON CHEST
    this.reactorGroup = new THREE.Group();
    this.reactorGroup.position.set(0, 0.85, 0.42); // Centered on upper chest
    this.reactorGroup.name = 'reactor-core';
    this.buildReactorCore();

    // 4. CYBER PEDESTAL & GROUND CONTACT
    this.buildGroundPedestal();

    // Assemble hierarchy
    this.torsoGroup.add(this.reactorGroup);
    this.group.add(this.torsoGroup);
    this.group.add(this.headGroup);

    // Initial position
    this.group.position.set(0, -0.6, 0);

    // Lights
    this.reactorLight = new THREE.PointLight('#00D9FF', 2.5, 4.0);
    this.reactorLight.position.set(0, 0.85, 0.6);
    this.torsoGroup.add(this.reactorLight);

    this.leftEyeLight = new THREE.PointLight('#00D9FF', 0.8, 1.2);
    this.leftEyeLight.position.set(-0.16, 0.22, 0.45);
    this.headGroup.add(this.leftEyeLight);

    this.rightEyeLight = new THREE.PointLight('#00D9FF', 0.8, 1.2);
    this.rightEyeLight.position.set(0.16, 0.22, 0.45);
    this.headGroup.add(this.rightEyeLight);
  }

  /**
   * Build masculine cyber torso, shoulders, clavicle, and mechanical spine
   */
  private buildTorso() {
    // Main Upper Chest Armor (Split Pectorals)
    const chestWidth = 0.95;
    const chestHeight = 0.65;
    const chestDepth = 0.55;

    // Left Pec Plate
    const leftChestGeo = new THREE.BoxGeometry(chestWidth * 0.46, chestHeight * 0.7, chestDepth * 0.4);
    const leftChestMesh = new THREE.Mesh(leftChestGeo, this.materials.titanium);
    leftChestMesh.position.set(-0.25, 0.85, 0.22);
    leftChestMesh.rotation.y = 0.08;
    leftChestMesh.castShadow = true;
    leftChestMesh.receiveShadow = true;
    this.torsoGroup.add(leftChestMesh);

    // Right Pec Plate
    const rightChestGeo = new THREE.BoxGeometry(chestWidth * 0.46, chestHeight * 0.7, chestDepth * 0.4);
    const rightChestMesh = new THREE.Mesh(rightChestGeo, this.materials.titanium);
    rightChestMesh.position.set(0.25, 0.85, 0.22);
    rightChestMesh.rotation.y = -0.08;
    rightChestMesh.castShadow = true;
    rightChestMesh.receiveShadow = true;
    this.torsoGroup.add(rightChestMesh);

    // Center sternum reinforcement bar
    const sternumGeo = new THREE.BoxGeometry(0.12, 0.75, 0.35);
    const sternumMesh = new THREE.Mesh(sternumGeo, this.materials.chrome);
    sternumMesh.position.set(0, 0.8, 0.26);
    this.torsoGroup.add(sternumMesh);

    // Clavicle Collar Bar (Dark Titanium)
    const clavicleGeo = new THREE.BoxGeometry(1.2, 0.15, 0.35);
    const clavicleMesh = new THREE.Mesh(clavicleGeo, this.materials.graphite);
    clavicleMesh.position.set(0, 1.22, 0.12);
    clavicleMesh.castShadow = true;
    this.torsoGroup.add(clavicleMesh);

    // Abdominal Rib Armor Segments
    for (let i = 0; i < 3; i++) {
      const ribGeo = new THREE.BoxGeometry(0.65 - i * 0.08, 0.12, 0.42 - i * 0.04);
      const ribMesh = new THREE.Mesh(ribGeo, this.materials.graphite);
      ribMesh.position.set(0, 0.45 - i * 0.16, 0.14);
      ribMesh.castShadow = true;
      this.torsoGroup.add(ribMesh);
    }

    // Spine Column (Chrome Vertebrae)
    for (let i = 0; i < 7; i++) {
      const vertGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.08, 8);
      const vertMesh = new THREE.Mesh(vertGeo, this.materials.chrome);
      vertMesh.rotation.x = Math.PI / 2;
      vertMesh.position.set(0, 0.2 + i * 0.16, -0.2);
      this.torsoGroup.add(vertMesh);
    }

    // Left & Right Shoulder Pauldrons (Angular, masculine silhouette)
    const pauldronGeo = new THREE.ConeGeometry(0.38, 0.55, 5);
    
    // Left Shoulder
    const leftPauldron = new THREE.Mesh(pauldronGeo, this.materials.titanium);
    leftPauldron.rotation.z = Math.PI / 2.6;
    leftPauldron.rotation.y = 0.2;
    leftPauldron.position.set(-0.75, 1.15, 0.05);
    leftPauldron.castShadow = true;
    this.torsoGroup.add(leftPauldron);

    // Right Shoulder
    const rightPauldron = new THREE.Mesh(pauldronGeo, this.materials.titanium);
    rightPauldron.rotation.z = -Math.PI / 2.6;
    rightPauldron.rotation.y = -0.2;
    rightPauldron.position.set(0.75, 1.15, 0.05);
    rightPauldron.castShadow = true;
    this.torsoGroup.add(rightPauldron);

    // Upper Arm Bicep Sockets (Cylinders)
    const armSocketGeo = new THREE.CylinderGeometry(0.14, 0.12, 0.65, 12);
    const leftArm = new THREE.Mesh(armSocketGeo, this.materials.graphite);
    leftArm.position.set(-0.78, 0.72, 0.05);
    leftArm.rotation.z = 0.12;
    this.torsoGroup.add(leftArm);

    const rightArm = new THREE.Mesh(armSocketGeo, this.materials.graphite);
    rightArm.position.set(0.78, 0.72, 0.05);
    rightArm.rotation.z = -0.12;
    this.torsoGroup.add(rightArm);

    // Cyan circuit conduits running from shoulders to chest
    const conduitGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.45, 8);
    const leftConduit = new THREE.Mesh(conduitGeo, this.materials.cyanGlow);
    leftConduit.position.set(-0.45, 1.05, 0.24);
    leftConduit.rotation.z = -0.6;
    this.torsoGroup.add(leftConduit);

    const rightConduit = new THREE.Mesh(conduitGeo, this.materials.cyanGlow);
    rightConduit.position.set(0.45, 1.05, 0.24);
    rightConduit.rotation.z = 0.6;
    this.torsoGroup.add(rightConduit);
  }

  /**
   * Build masculine humanoid robotic head with titanium chassis, chiselled jaw, glowing eyes
   */
  private buildHead() {
    // 1. Neck Vertebrae Column
    const neckBase = new THREE.CylinderGeometry(0.12, 0.16, 0.35, 12);
    const neckMesh = new THREE.Mesh(neckBase, this.materials.graphite);
    neckMesh.position.set(0, -0.15, 0);
    neckMesh.castShadow = true;
    this.headGroup.add(neckMesh);

    // Hydraulic neck pistons
    const pistonGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.28, 8);
    const leftPiston = new THREE.Mesh(pistonGeo, this.materials.chrome);
    leftPiston.position.set(-0.1, -0.15, 0.08);
    this.headGroup.add(leftPiston);

    const rightPiston = new THREE.Mesh(pistonGeo, this.materials.chrome);
    rightPiston.position.set(0.1, -0.15, 0.08);
    this.headGroup.add(rightPiston);

    // 2. Cranial Skull Chassis (Dark Titanium)
    // Tapered masculine head shape
    const skullGeo = new THREE.BoxGeometry(0.5, 0.52, 0.56);
    const skullMesh = new THREE.Mesh(skullGeo, this.materials.titanium);
    skullMesh.position.set(0, 0.24, 0.02);
    skullMesh.castShadow = true;
    this.headGroup.add(skullMesh);

    // Cranial Top Plate (Beveled crown)
    const crownGeo = new THREE.BoxGeometry(0.44, 0.12, 0.52);
    const crownMesh = new THREE.Mesh(crownGeo, this.materials.graphite);
    crownMesh.position.set(0, 0.52, 0.02);
    this.headGroup.add(crownMesh);

    // 3. Masculine Chiselled Jaw & Chin (Angular bevel)
    const jawGeo = new THREE.ConeGeometry(0.3, 0.38, 4);
    const jawMesh = new THREE.Mesh(jawGeo, this.materials.graphite);
    jawMesh.rotation.y = Math.PI / 4;
    jawMesh.rotation.x = Math.PI;
    jawMesh.scale.set(1.0, 0.7, 0.85);
    jawMesh.position.set(0, 0.04, 0.2);
    jawMesh.castShadow = true;
    this.headGroup.add(jawMesh);

    // Chin Tip (Plate)
    const chinTipGeo = new THREE.BoxGeometry(0.14, 0.1, 0.12);
    const chinTipMesh = new THREE.Mesh(chinTipGeo, this.materials.chrome);
    chinTipMesh.position.set(0, -0.06, 0.24);
    this.headGroup.add(chinTipMesh);

    // 4. Brow Visor & Orbital Rim
    const browGeo = new THREE.BoxGeometry(0.48, 0.08, 0.2);
    const browMesh = new THREE.Mesh(browGeo, this.materials.titanium);
    browMesh.position.set(0, 0.32, 0.26);
    this.headGroup.add(browMesh);

    // Cheekbones (Angular titanium cheek facets)
    const cheekGeo = new THREE.BoxGeometry(0.14, 0.18, 0.18);
    const leftCheek = new THREE.Mesh(cheekGeo, this.materials.titanium);
    leftCheek.position.set(-0.24, 0.12, 0.22);
    leftCheek.rotation.y = 0.2;
    this.headGroup.add(leftCheek);

    const rightCheek = new THREE.Mesh(cheekGeo, this.materials.titanium);
    rightCheek.position.set(0.24, 0.12, 0.22);
    rightCheek.rotation.y = -0.2;
    this.headGroup.add(rightCheek);

    // 5. Glowing Electric Cyan Optics (Eyes)
    const eyeGeo = new THREE.BoxGeometry(0.11, 0.035, 0.08);
    
    this.leftEye = new THREE.Mesh(eyeGeo, this.materials.cyanGlow);
    this.leftEye.position.set(-0.14, 0.23, 0.3);
    this.leftEye.rotation.z = 0.08;
    this.headGroup.add(this.leftEye);

    this.rightEye = new THREE.Mesh(eyeGeo, this.materials.cyanGlow);
    this.rightEye.position.set(0.14, 0.23, 0.3);
    this.rightEye.rotation.z = -0.08;
    this.headGroup.add(this.rightEye);

    // Visor Glass Lens overlay
    const visorLensGeo = new THREE.BoxGeometry(0.42, 0.09, 0.04);
    const visorLensMesh = new THREE.Mesh(visorLensGeo, this.materials.glass);
    visorLensMesh.position.set(0, 0.23, 0.33);
    this.headGroup.add(visorLensMesh);

    // 6. Temporal Audio Transducers / Ear Nodes
    const earGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.06, 16);
    
    const leftEar = new THREE.Mesh(earGeo, this.materials.chrome);
    leftEar.rotation.z = Math.PI / 2;
    leftEar.position.set(-0.28, 0.22, 0.02);
    this.headGroup.add(leftEar);

    const rightEar = new THREE.Mesh(earGeo, this.materials.chrome);
    rightEar.rotation.z = Math.PI / 2;
    rightEar.position.set(0.28, 0.22, 0.02);
    this.headGroup.add(rightEar);

    // Forehead Neural Circuit Node (Center forebrain)
    const forebrainGeo = new THREE.BoxGeometry(0.06, 0.14, 0.02);
    const forebrainMesh = new THREE.Mesh(forebrainGeo, this.materials.cyanGlow);
    forebrainMesh.position.set(0, 0.42, 0.29);
    this.headGroup.add(forebrainMesh);
  }

  /**
   * Build glowing Neural-Network Reactor on the chest with concentric counter-rotating rings
   */
  private buildReactorCore() {
    // Housing ring (Fixed outer collar)
    const housingGeo = new THREE.TorusGeometry(0.22, 0.035, 16, 32);
    const housingMesh = new THREE.Mesh(housingGeo, this.materials.titanium);
    housingMesh.castShadow = true;
    this.reactorGroup.add(housingMesh);

    // Outer rotating slotted ring (Cyan markers)
    const outerRingGeo = new THREE.TorusGeometry(0.18, 0.02, 12, 24);
    this.outerRing = new THREE.Mesh(outerRingGeo, this.materials.cyanGlow);
    this.reactorGroup.add(this.outerRing);

    // Middle mechanical ring (Chrome teeth)
    const middleRingGeo = new THREE.TorusGeometry(0.13, 0.015, 8, 16);
    this.middleRing = new THREE.Mesh(middleRingGeo, this.materials.chrome);
    this.reactorGroup.add(this.middleRing);

    // Inner Luminous Core Crystal (Glowing Octahedron / Core)
    const coreGeo = new THREE.OctahedronGeometry(0.09, 1);
    this.innerCore = new THREE.Mesh(coreGeo, this.materials.reactorCore);
    this.reactorGroup.add(this.innerCore);

    // Holographic glass protective dome
    const domeGeo = new THREE.SphereGeometry(0.23, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMesh = new THREE.Mesh(domeGeo, this.materials.glass);
    domeMesh.rotation.x = Math.PI / 2;
    this.reactorGroup.add(domeMesh);

    // Raycast target proxy for clicking/hovering reactor core
    const hitGeo = new THREE.SphereGeometry(0.32, 12, 12);
    const hitMat = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      depthWrite: false
    });
    const hitMesh = new THREE.Mesh(hitGeo, hitMat);
    hitMesh.name = 'reactor-core-hit';
    this.reactorGroup.add(hitMesh);
  }

  /**
   * Build floating cyber pedestal / holographic rings at the bottom
   */
  private buildGroundPedestal() {
    const ringGeo1 = new THREE.RingGeometry(0.8, 0.85, 48);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x00D9FF,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35
    });
    const ringMesh1 = new THREE.Mesh(ringGeo1, ringMat1);
    ringMesh1.rotation.x = -Math.PI / 2;
    ringMesh1.position.set(0, -0.4, 0);
    this.group.add(ringMesh1);

    const ringGeo2 = new THREE.RingGeometry(1.2, 1.24, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x1677FF,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.2
    });
    const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2);
    ringMesh2.rotation.x = -Math.PI / 2;
    ringMesh2.position.set(0, -0.42, 0);
    this.group.add(ringMesh2);
  }

  /**
   * Update frame animations: idle breathing, head tracking, eye glow pulse, reactor spin
   */
  public update(time: number, delta: number, normalizedPointerX: number, normalizedPointerY: number) {
    // 1. Smooth Head Tracking towards pointer with exponential damping
    const targetPitch = -normalizedPointerY * 0.35; // Look up/down
    const targetYaw = normalizedPointerX * 0.55;    // Turn left/right

    this.headGroup.rotation.x = THREE.MathUtils.damp(this.headGroup.rotation.x, targetPitch, 4.0, delta);
    this.headGroup.rotation.y = THREE.MathUtils.damp(this.headGroup.rotation.y, targetYaw, 4.0, delta);

    // 2. Subtle Idle Breathing Animation (Torso gently rises and expands)
    const breath = Math.sin(time * 1.5) * 0.015;
    this.torsoGroup.position.y = breath;
    this.torsoGroup.scale.set(1 + breath * 0.5, 1 + breath, 1 + breath * 0.5);

    // 3. Eye Glow Pulse
    const eyeIntensity = 2.8 + Math.sin(time * 3.0) * 0.8;
    this.leftEyeLight.intensity = 0.5 + Math.sin(time * 3.0) * 0.2;
    this.rightEyeLight.intensity = 0.5 + Math.sin(time * 3.0) * 0.2;
    (this.materials.cyanGlow as THREE.MeshStandardMaterial).emissiveIntensity = eyeIntensity;

    // 4. Chest Reactor Rings Rotation & Pulse
    if (this.outerRing) {
      this.outerRing.rotation.z += delta * 1.2;
      this.middleRing.rotation.z -= delta * 1.8;
      this.innerCore.rotation.x += delta * 2.0;
      this.innerCore.rotation.y += delta * 2.5;

      // Heartbeat pulse of the energy core
      const corePulse = 1.0 + Math.sin(time * 4.0) * 0.18;
      this.innerCore.scale.set(corePulse, corePulse, corePulse);
      this.reactorLight.intensity = 2.0 + Math.sin(time * 4.0) * 1.0;
    }
  }

  /**
   * Free resources when component is disposed
   */
  public dispose() {
    this.group.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
      }
    });
  }
}
