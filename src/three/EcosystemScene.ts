import * as THREE from 'three';
import { ECOSYSTEM_SERVICES } from '../data/ecosystemData';
import { EcosystemServiceData } from '../types';

export class EcosystemScene {
  public group: THREE.Group;
  public serviceMeshes: THREE.Mesh[] = [];
  private gridDisk!: THREE.Mesh;
  private orbitRings: THREE.Line[] = [];
  private trunkLines!: THREE.LineSegments;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'ecosystem-topology-layer';

    this.buildCyberGrid();
    this.buildServiceNodes();
    this.buildTopologyTrunks();
  }

  private buildCyberGrid() {
    // Holographic concentric rings defining Infrastructure, Services, Dev, Network zones
    const ringRadii = [2.2, 3.2, 4.0, 4.8];
    ringRadii.forEach((radius, i) => {
      const circleGeo = new THREE.BufferGeometry();
      const segments = 64;
      const pts: THREE.Vector3[] = [];
      for (let s = 0; s <= segments; s++) {
        const theta = (s / segments) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(theta) * radius, -0.4, Math.sin(theta) * radius));
      }
      circleGeo.setFromPoints(pts);

      const circleMat = new THREE.LineBasicMaterial({
        color: i % 2 === 0 ? 0x00D9FF : 0x1677FF,
        transparent: true,
        opacity: 0.25 - i * 0.04
      });

      const line = new THREE.Line(circleGeo, circleMat);
      this.orbitRings.push(line);
      this.group.add(line);
    });

    // Hexagonal cyber ground grid
    const diskGeo = new THREE.CircleGeometry(5.2, 6);
    const diskMat = new THREE.MeshBasicMaterial({
      color: 0x07111F,
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    this.gridDisk = new THREE.Mesh(diskGeo, diskMat);
    this.gridDisk.rotation.x = -Math.PI / 2;
    this.gridDisk.position.y = -0.45;
    this.group.add(this.gridDisk);
  }

  private buildServiceNodes() {
    // Shapes per category for quick visual identification
    const boxGeo = new THREE.BoxGeometry(0.24, 0.24, 0.24);
    const octGeo = new THREE.OctahedronGeometry(0.2, 0);
    const cylGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.24, 6);
    const torusGeo = new THREE.TorusGeometry(0.14, 0.04, 8, 16);

    ECOSYSTEM_SERVICES.forEach((service) => {
      let geo: THREE.BufferGeometry = boxGeo;
      if (service.category === 'Infrastructure') geo = boxGeo;
      else if (service.category === 'Services') geo = octGeo;
      else if (service.category === 'Development') geo = cylGeo;
      else if (service.category === 'Network') geo = torusGeo;

      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(service.color),
        emissive: new THREE.Color(service.color),
        emissiveIntensity: 1.8,
        metalness: 0.7,
        roughness: 0.2
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...service.position);
      mesh.userData = { isEcosystemNode: true, data: service };
      mesh.name = `eco-${service.id}`;

      // Floating holographic badge plate under each node
      const badgeGeo = new THREE.RingGeometry(0.25, 0.3, 16);
      const badgeMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(service.color),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4
      });
      const badgeMesh = new THREE.Mesh(badgeGeo, badgeMat);
      badgeMesh.rotation.x = Math.PI / 2;
      badgeMesh.position.y = -0.22;
      mesh.add(badgeMesh);

      // Generous raycast hit target proxy (0.45 radius sphere, transparent for reliable hover detection)
      const hitGeo = new THREE.SphereGeometry(0.45, 12, 12);
      const hitMat = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        depthWrite: false
      });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.userData = { isEcosystemNode: true, data: service };
      mesh.add(hitMesh);

      this.group.add(mesh);
      this.serviceMeshes.push(mesh);
    });
  }

  private buildTopologyTrunks() {
    const points: THREE.Vector3[] = [];
    const hubCenter = new THREE.Vector3(0, -0.4, 0);

    ECOSYSTEM_SERVICES.forEach((service) => {
      const nodePos = new THREE.Vector3(...service.position);
      // Route line to ground level hub center
      const groundNodePos = new THREE.Vector3(nodePos.x, -0.4, nodePos.z);
      points.push(nodePos, groundNodePos);
      points.push(groundNodePos, hubCenter);
    });

    const linesGeo = new THREE.BufferGeometry().setFromPoints(points);
    const linesMat = new THREE.LineBasicMaterial({
      color: 0x1677FF,
      transparent: true,
      opacity: 0.25
    });

    this.trunkLines = new THREE.LineSegments(linesGeo, linesMat);
    this.group.add(this.trunkLines);
  }

  public update(time: number, delta: number, selectedServiceId?: string | null) {
    // Gentle rotation of ground grid
    if (this.gridDisk) {
      this.gridDisk.rotation.z += delta * 0.05;
    }

    // Node micro-movement and selection feedback
    this.serviceMeshes.forEach((mesh, idx) => {
      const data = mesh.userData.data as EcosystemServiceData;
      const isSelected = selectedServiceId === data.id;

      // Slow orbital bobbing
      mesh.position.y = data.position[1] + Math.sin(time * 1.8 + idx * 0.6) * 0.05;
      mesh.rotation.y += delta * 0.6;
      mesh.rotation.x += delta * 0.3;

      const targetScale = isSelected ? 1.5 : 1.0;
      mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.12);

      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = isSelected ? 4.0 : 1.8 + Math.sin(time * 2.5 + idx) * 0.4;
    });
  }

  public setVisible(visible: boolean) {
    this.group.visible = visible;
  }

  public dispose() {
    this.serviceMeshes.forEach((mesh) => {
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
    });
    this.gridDisk.geometry.dispose();
    (this.gridDisk.material as THREE.Material).dispose();
    this.trunkLines.geometry.dispose();
    (this.trunkLines.material as THREE.Material).dispose();
  }
}
