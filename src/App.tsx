import React, { useState, useEffect, useRef } from 'react';
import { SceneMode, NeuralNodeData, EcosystemServiceData } from './types';
import { sound } from './audio/soundSystem';
import { ThreeCanvas } from './three/ThreeCanvas';
import { HeaderHUD } from './components/HeaderHUD';
import { ControlDock } from './components/ControlDock';
import { AwakeningOverlay } from './components/AwakeningOverlay';
import { NeuralInspectorModal } from './components/NeuralInspectorModal';
import { EcosystemInspectorModal } from './components/EcosystemInspectorModal';
import { CommandInterfaceModal } from './components/CommandInterfaceModal';
import { AboutModal } from './components/AboutModal';
import { FallbackWebGL } from './components/FallbackWebGL';
import { QuickNodeDirectory } from './components/QuickNodeDirectory';
import { HoverTooltip, HoveredNodeInfo } from './components/HoverTooltip';

export default function App() {
  const [sceneMode, setSceneMode] = useState<SceneMode>('avatar');
  const [isAwakening, setIsAwakening] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);
  const [hoveredNode, setHoveredNode] = useState<HoveredNodeInfo | null>(null);

  // Inspection states
  const [selectedNeuralNode, setSelectedNeuralNode] = useState<NeuralNodeData | null>(null);
  const [selectedEcosystemService, setSelectedEcosystemService] = useState<EcosystemServiceData | null>(null);

  // Modals for Terminal and About
  const [isTerminalOpen, setIsTerminalOpen] = useState<boolean>(false);
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);

  // Camera reset callback holder
  const resetCameraRef = useRef<(() => void) | null>(null);

  // Test WebGL capability on mount
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
      }
    } catch {
      setHasWebGL(false);
    }
  }, []);

  // Keyboard shortcut ESC to dismiss modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedNeuralNode(null);
        setSelectedEcosystemService(null);
        setIsTerminalOpen(false);
        setIsAboutOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync mode with modals
  const handleSelectMode = (mode: SceneMode) => {
    setSceneMode(mode);
    if (mode === 'terminal') {
      setIsTerminalOpen(true);
      setIsAboutOpen(false);
    } else if (mode === 'about') {
      setIsAboutOpen(true);
      setIsTerminalOpen(false);
    } else {
      setIsTerminalOpen(false);
      setIsAboutOpen(false);
    }
  };

  const handleReactorClicked = () => {
    setSceneMode('neural');
    setSelectedNeuralNode(null);
  };

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMuted(next);
  };

  const handleResetCamera = () => {
    if (resetCameraRef.current) {
      resetCameraRef.current();
    }
  };

  const handleReplayAwakening = () => {
    setIsAwakening(true);
  };

  if (!hasWebGL) {
    return <FallbackWebGL />;
  }

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#050B14] text-[#A7BBCB] font-sans select-none">
      {/* 1. Fullscreen Interactive 3D Canvas */}
      <ThreeCanvas
        sceneMode={sceneMode}
        isAwakening={isAwakening}
        onReactorClicked={handleReactorClicked}
        onNeuralNodeSelected={(node) => setSelectedNeuralNode(node)}
        onEcosystemNodeSelected={(srv) => setSelectedEcosystemService(srv)}
        selectedNeuralId={selectedNeuralNode?.id ?? null}
        selectedEcosystemId={selectedEcosystemService?.id ?? null}
        onHoverNode={(info) => setHoveredNode(info)}
        onResetCameraReady={(fn) => {
          resetCameraRef.current = fn;
        }}
      />

      {/* Hover Tooltip displaying Node Name & Keterangan Singkat */}
      {!isAwakening && !selectedNeuralNode && !selectedEcosystemService && !isTerminalOpen && !isAboutOpen && (
        <HoverTooltip hoveredNode={hoveredNode} />
      )}

      {/* 2. Top Header HUD */}
      {!isAwakening && (
        <HeaderHUD
          sceneMode={sceneMode}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onResetCamera={handleResetCamera}
          onReplayAwakening={handleReplayAwakening}
        />
      )}

      {/* Persistent Node Quick Directory with Keterangan Singkat for Neural & Ecosystem tabs */}
      {!isAwakening && !selectedNeuralNode && !selectedEcosystemService && !isTerminalOpen && !isAboutOpen && (
        <QuickNodeDirectory
          sceneMode={sceneMode}
          selectedNeuralId={null}
          selectedEcosystemId={null}
          onSelectNeuralNode={(node) => setSelectedNeuralNode(node)}
          onSelectEcosystemNode={(srv) => setSelectedEcosystemService(srv)}
        />
      )}

      {/* 3. Collapsible Bottom Control Dock */}
      {!isAwakening && (
        <ControlDock
          currentMode={sceneMode}
          onSelectMode={handleSelectMode}
          onResetCamera={handleResetCamera}
        />
      )}

      {/* 4. Scene 1: Awakening Cinematic Intro Overlay */}
      {isAwakening && (
        <AwakeningOverlay onComplete={() => setIsAwakening(false)} />
      )}

      {/* 5. Scene 3: Neural Node Telemetry Inspector */}
      <NeuralInspectorModal
        selectedNode={selectedNeuralNode}
        onSelectNode={(node) => setSelectedNeuralNode(node)}
      />

      {/* 6. Scene 4: KeenaNet Ecosystem Service Inspector */}
      <EcosystemInspectorModal
        selectedService={selectedEcosystemService}
        onSelectService={(srv) => setSelectedEcosystemService(srv)}
      />

      {/* 7. Scene 5: AI Command Interface Console */}
      <CommandInterfaceModal
        isOpen={isTerminalOpen}
        onClose={() => {
          setIsTerminalOpen(false);
          if (sceneMode === 'terminal') setSceneMode('avatar');
        }}
      />

      {/* 8. Scene 6: About NADI Storytelling Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => {
          setIsAboutOpen(false);
          if (sceneMode === 'about') setSceneMode('avatar');
        }}
      />
    </main>
  );
}
