import * as THREE from 'three';
import { NEURAL_NODES } from '../data/neuralNetworkData';
import { NeuralNodeData } from '../types';

export class NeuralNetworkScene {
  public group: THREE.Group;
  public nodeMeshes: THREE.Mesh[] = [];
  private connectionLines!: THREE.LineSegments;
  private pulsePoints!: THREE.Points;
  private pulsePositions!: Float32Array;
  private pulseProgress!: number[];
  private pulseRoutes: { from: THREE.Vector3; to: THREE.Vector3; speed: number }[] = [];

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'neural-network-layer';

    this.buildNodes();
    this.buildConnections();
    this.buildDataPulses();
  }

  private buildNodes() {
    const nodeGeometry = new THREE.IcosahedronGeometry(0.18, 1);

    NEURAL_NODES.forEach((nodeData) => {
      const nodeMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(nodeData.color),
        emissive: new THREE.Color(nodeData.color),
        emissiveIntensity: 2.2,
        roughness: 0.2,
        metalness: 0.8
      });

      const mesh = new THREE.Mesh(nodeGeometry, nodeMaterial);
      mesh.position.set(...nodeData.position);
      mesh.userData = { isNeuralNode: true, data: nodeData };
      mesh.name = `node-${nodeData.id}`;

      // Outer glowing ring
      const ringGeo = new THREE.RingGeometry(0.24, 0.27, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(nodeData.color),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.lookAt(0, 0, 0);
      mesh.add(ringMesh);

      // Generous raycast hit target proxy (0.42 radius sphere, transparent for reliable hover detection)
      const hitGeo = new THREE.SphereGeometry(0.42, 12, 12);
      const hitMat = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        depthWrite: false
      });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.userData = { isNeuralNode: true, data: nodeData };
      mesh.add(hitMesh);

      this.group.add(mesh);
      this.nodeMeshes.push(mesh);
    });
  }

  private buildConnections() {
    const points: THREE.Vector3[] = [];
    const corePos = new THREE.Vector3(0, 0.85, 0.42); // NADI reactor position

    // 1. Connect every node to the NADI core
    NEURAL_NODES.forEach((node) => {
      const nodePos = new THREE.Vector3(...node.position);
      points.push(corePos, nodePos);
    });

    // 2. Interconnect adjacent neighbor nodes
    for (let i = 0; i < NEURAL_NODES.length; i++) {
      const nextIdx = (i + 1) % NEURAL_NODES.length;
      const posA = new THREE.Vector3(...NEURAL_NODES[i].position);
      const posB = new THREE.Vector3(...NEURAL_NODES[nextIdx].position);
      points.push(posA, posB);

      // Save routes for traveling pulses
      this.pulseRoutes.push({ from: posA, to: posB, speed: 0.3 + Math.random() * 0.4 });
      this.pulseRoutes.push({ from: corePos.clone(), to: posA.clone(), speed: 0.5 + Math.random() * 0.5 });
    }

    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x00D9FF,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });

    this.connectionLines = new THREE.LineSegments(lineGeometry, lineMaterial);
    this.group.add(this.connectionLines);
  }

  private buildDataPulses() {
    const pulseCount = this.pulseRoutes.length;
    this.pulsePositions = new Float32Array(pulseCount * 3);
    this.pulseProgress = new Array(pulseCount).fill(0).map(() => Math.random());

    const pulseGeometry = new THREE.BufferGeometry();
    pulseGeometry.setAttribute('position', new THREE.BufferAttribute(this.pulsePositions, 3));

    const pulseMaterial = new THREE.PointsMaterial({
      color: 0x00F0FF,
      size: 0.08,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });

    this.pulsePoints = new THREE.Points(pulseGeometry, pulseMaterial);
    this.group.add(this.pulsePoints);
  }

  public update(time: number, delta: number, selectedNodeId?: string | null) {
    // 1. Gently float and rotate nodes
    this.nodeMeshes.forEach((mesh, idx) => {
      const nodeData = mesh.userData.data as NeuralNodeData;
      const isSelected = selectedNodeId === nodeData.id;

      // Micro levitation
      const floatOffset = Math.sin(time * 2.0 + idx * 0.8) * 0.04;
      mesh.position.y = nodeData.position[1] + floatOffset;
      mesh.rotation.y += delta * 0.8;

      // Scale up if selected
      const targetScale = isSelected ? 1.4 : 1.0;
      mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = isSelected ? 4.5 : 2.0 + Math.sin(time * 3 + idx) * 0.5;
    });

    // 2. Animate traveling data pulses along routes
    const posAttr = this.pulsePoints.geometry.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < this.pulseRoutes.length; i++) {
      const route = this.pulseRoutes[i];
      this.pulseProgress[i] = (this.pulseProgress[i] + delta * route.speed) % 1.0;
      const p = this.pulseProgress[i];

      const x = route.from.x + (route.to.x - route.from.x) * p;
      const y = route.from.y + (route.to.y - route.from.y) * p;
      const z = route.from.z + (route.to.z - route.from.z) * p;

      array[i * 3] = x;
      array[i * 3 + 1] = y;
      array[i * 3 + 2] = z;
    }
    posAttr.needsUpdate = true;
  }

  public setVisible(visible: boolean) {
    this.group.visible = visible;
  }

  public dispose() {
    this.nodeMeshes.forEach((mesh) => {
      mesh.geometry.dispose();
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((m) => m.dispose());
      } else {
        mesh.material.dispose();
      }
    });
    this.connectionLines.geometry.dispose();
    (this.connectionLines.material as THREE.Material).dispose();
    this.pulsePoints.geometry.dispose();
    (this.pulsePoints.material as THREE.Material).dispose();
  }
}
