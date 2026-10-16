import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createPBRMaterials } from './materials';
import { NadiHumanoidModel } from './NadiModel';
import { NeuralNetworkScene } from './NeuralNetworkScene';
import { EcosystemScene } from './EcosystemScene';
import { setupEnvironment } from './EnvironmentSetup';
import { SceneMode, NeuralNodeData, EcosystemServiceData } from '../types';
import { sound } from '../audio/soundSystem';
import { HoveredNodeInfo } from '../components/HoverTooltip';

interface ThreeCanvasProps {
  sceneMode: SceneMode;
  isAwakening: boolean;
  onReactorClicked: () => void;
  onNeuralNodeSelected: (node: NeuralNodeData) => void;
  onEcosystemNodeSelected: (service: EcosystemServiceData) => void;
  selectedNeuralId: string | null;
  selectedEcosystemId: string | null;
  onHoverNode?: (hovered: HoveredNodeInfo | null) => void;
  onResetCameraReady?: (resetFn: () => void) => void;
}

// Module-scope scratch objects to prevent GC
const _raycaster = new THREE.Raycaster();
const _mouse = new THREE.Vector2();
const _camTarget = new THREE.Vector3();
const _camPos = new THREE.Vector3();

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  sceneMode,
  isAwakening,
  onReactorClicked,
  onNeuralNodeSelected,
  onEcosystemNodeSelected,
  selectedNeuralId,
  selectedEcosystemId,
  onHoverNode,
  onResetCameraReady
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // References to keep callbacks current without re-initializing WebGL
  const propsRef = useRef({
    sceneMode,
    isAwakening,
    onReactorClicked,
    onNeuralNodeSelected,
    onEcosystemNodeSelected,
    selectedNeuralId,
    selectedEcosystemId,
    onHoverNode
  });

  useEffect(() => {
    propsRef.current = {
      sceneMode,
      isAwakening,
      onReactorClicked,
      onNeuralNodeSelected,
      onEcosystemNodeSelected,
      selectedNeuralId,
      selectedEcosystemId,
      onHoverNode
    };
  }, [
    sceneMode,
    isAwakening,
    onReactorClicked,
    onNeuralNodeSelected,
    onEcosystemNodeSelected,
    selectedNeuralId,
    selectedEcosystemId,
    onHoverNode
  ]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      50
    );
    camera.position.set(0, 0.4, 3.2);

    // 2. Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: true
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 3. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1.4;
    controls.maxDistance = 7.5;
    controls.maxPolarAngle = Math.PI / 1.7; // Prevent looking up from under floor
    controls.target.set(0, 0.3, 0);

    // Camera target positions per mode
    const cameraPresets: Record<SceneMode, { pos: THREE.Vector3; target: THREE.Vector3 }> = {
      avatar: { pos: new THREE.Vector3(0, 0.3, 2.7), target: new THREE.Vector3(0, 0.35, 0) },
      neural: { pos: new THREE.Vector3(0, 0.4, 4.0), target: new THREE.Vector3(0, 0.3, 0) },
      ecosystem: { pos: new THREE.Vector3(0, 3.0, 4.6), target: new THREE.Vector3(0, -0.2, 0) },
      terminal: { pos: new THREE.Vector3(1.1, 0.5, 2.5), target: new THREE.Vector3(0, 0.4, 0) },
      about: { pos: new THREE.Vector3(-0.9, 0.5, 2.6), target: new THREE.Vector3(0, 0.35, 0) }
    };

    const resetCamera = () => {
      const preset = cameraPresets[propsRef.current.sceneMode] || cameraPresets.avatar;
      camera.position.copy(preset.pos);
      controls.target.copy(preset.target);
      controls.update();
      sound.playClick();
    };

    if (onResetCameraReady) {
      onResetCameraReady(resetCamera);
    }

    // 4. Environment & Lighting
    const materials = createPBRMaterials();
    const env = setupEnvironment(scene, renderer);

    // 5. 3D Models
    const nadiModel = new NadiHumanoidModel(materials);
    scene.add(nadiModel.group);

    const neuralScene = new NeuralNetworkScene();
    scene.add(neuralScene.group);

    const ecosystemScene = new EcosystemScene();
    scene.add(ecosystemScene.group);

    // Pre-warm shaders
    renderer.compile(scene, camera);

    // 6. Interaction & Pointer tracking
    let pointerX = 0;
    let pointerY = 0;
    let lastHoveredId: string | null = null;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      pointerX = x;
      pointerY = y;
      _mouse.set(x, y);

      // Raycast hover detection for 3D nodes
      _raycaster.setFromCamera(_mouse, camera);

      let foundNode = false;

      // 1. Check Neural nodes
      if (propsRef.current.sceneMode === 'neural') {
        const neuralHits = _raycaster.intersectObjects(neuralScene.nodeMeshes, true);
        if (neuralHits.length > 0) {
          let targetObj: THREE.Object3D | null = neuralHits[0].object;
          while (targetObj && !targetObj.userData?.isNeuralNode) {
            targetObj = targetObj.parent;
          }
          if (targetObj && targetObj.userData?.data) {
            foundNode = true;
            container.style.cursor = 'pointer';
            const data = targetObj.userData.data as NeuralNodeData;
            if (lastHoveredId !== data.id) {
              sound.playHover();
              lastHoveredId = data.id;
            }
            propsRef.current.onHoverNode?.({
              type: 'neural',
              data,
              x: e.clientX,
              y: e.clientY
            });
          }
        }
      }

      // 2. Check Ecosystem nodes
      if (!foundNode && propsRef.current.sceneMode === 'ecosystem') {
        const ecoHits = _raycaster.intersectObjects(ecosystemScene.serviceMeshes, true);
        if (ecoHits.length > 0) {
          let targetObj: THREE.Object3D | null = ecoHits[0].object;
          while (targetObj && !targetObj.userData?.isEcosystemNode) {
            targetObj = targetObj.parent;
          }
          if (targetObj && targetObj.userData?.data) {
            foundNode = true;
            container.style.cursor = 'pointer';
            const data = targetObj.userData.data as EcosystemServiceData;
            if (lastHoveredId !== data.id) {
              sound.playHover();
              lastHoveredId = data.id;
            }
            propsRef.current.onHoverNode?.({
              type: 'ecosystem',
              data,
              x: e.clientX,
              y: e.clientY
            });
          }
        }
      }

      // 3. Check Reactor Core
      if (!foundNode) {
        const reactorHits = _raycaster.intersectObjects(nadiModel.reactorGroup.children, true);
        if (reactorHits.length > 0) {
          container.style.cursor = 'pointer';
        } else {
          container.style.cursor = 'grab';
        }

        if (lastHoveredId !== null) {
          lastHoveredId = null;
          propsRef.current.onHoverNode?.(null);
        }
      }
    };

    const handleClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      _mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      _mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      _raycaster.setFromCamera(_mouse, camera);

      // 1. Check reactor core click
      const reactorHits = _raycaster.intersectObjects(nadiModel.reactorGroup.children, true);
      if (reactorHits.length > 0) {
        sound.playCorePulse();
        propsRef.current.onReactorClicked();
        return;
      }

      // 2. Check Neural network node clicks
      if (propsRef.current.sceneMode === 'neural') {
        const neuralHits = _raycaster.intersectObjects(neuralScene.nodeMeshes, true);
        if (neuralHits.length > 0) {
          let targetObj: THREE.Object3D | null = neuralHits[0].object;
          while (targetObj && !targetObj.userData?.isNeuralNode) {
            targetObj = targetObj.parent;
          }
          if (targetObj && targetObj.userData?.data) {
            sound.playClick();
            propsRef.current.onNeuralNodeSelected(targetObj.userData.data);
            return;
          }
        }
      }

      // 3. Check Ecosystem service node clicks
      if (propsRef.current.sceneMode === 'ecosystem') {
        const ecoHits = _raycaster.intersectObjects(ecosystemScene.serviceMeshes, true);
        if (ecoHits.length > 0) {
          let targetObj: THREE.Object3D | null = ecoHits[0].object;
          while (targetObj && !targetObj.userData?.isEcosystemNode) {
            targetObj = targetObj.parent;
          }
          if (targetObj && targetObj.userData?.data) {
            sound.playClick();
            propsRef.current.onEcosystemNodeSelected(targetObj.userData.data);
            return;
          }
        }
      }
    };

    const handleDoubleClick = () => {
      resetCamera();
    };

    const domElement = renderer.domElement;

    const handlePointerLeave = () => {
      lastHoveredId = null;
      propsRef.current.onHoverNode?.(null);
      container.style.cursor = 'grab';
    };

    domElement.addEventListener('pointermove', handlePointerMove, { passive: true });
    domElement.addEventListener('mousemove', handlePointerMove, { passive: true });
    domElement.addEventListener('pointerleave', handlePointerLeave);
    domElement.addEventListener('mouseleave', handlePointerLeave);
    domElement.addEventListener('click', handleClick);
    domElement.addEventListener('dblclick', handleDoubleClick);

    // 7. Resize Observer
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // 8. Animation Render Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsedTime = clock.getElapsedTime();

      const { sceneMode: currentMode, isAwakening: inIntro, selectedNeuralId, selectedEcosystemId } = propsRef.current;

      // Handle visibility of layers based on mode
      neuralScene.setVisible(currentMode === 'neural');
      ecosystemScene.setVisible(currentMode === 'ecosystem');

      // Awakening intro camera fly-in
      if (inIntro) {
        // Dramatic entrance sweep
        camera.position.z = THREE.MathUtils.damp(camera.position.z, 2.7, 1.2, delta);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, 0.35, 1.2, delta);
      } else {
        // Smoothly interpolate camera target toward preset
        const currentPreset = cameraPresets[currentMode] || cameraPresets.avatar;
        camera.position.lerp(currentPreset.pos, 0.04);
        controls.target.lerp(currentPreset.target, 0.04);
      }

      controls.update();

      // Update 3D Character
      nadiModel.update(elapsedTime, delta, pointerX, pointerY);

      // Update Sub-Scenes
      if (currentMode === 'neural') {
        neuralScene.update(elapsedTime, delta, selectedNeuralId);
      } else if (currentMode === 'ecosystem') {
        ecosystemScene.update(elapsedTime, delta, selectedEcosystemId);
      }

      // Update environment particles
      env.updateParticles(elapsedTime);

      renderer.render(scene, camera);
    };

    animate();

    // 9. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('pointermove', handlePointerMove);
      domElement.removeEventListener('mousemove', handlePointerMove);
      domElement.removeEventListener('pointerleave', handlePointerLeave);
      domElement.removeEventListener('mouseleave', handlePointerLeave);
      domElement.removeEventListener('click', handleClick);
      domElement.removeEventListener('dblclick', handleDoubleClick);

      controls.dispose();
      nadiModel.dispose();
      neuralScene.dispose();
      ecosystemScene.dispose();
      materials.detailTexture.dispose();
      renderer.dispose();

      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full overflow-hidden cursor-grab active:cursor-grabbing"
      style={{ touchAction: 'none' }}
    />
  );
};
