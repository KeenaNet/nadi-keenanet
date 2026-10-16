import React, { useState, useEffect } from 'react';
import { SceneMode } from '../types';
import { sound } from '../audio/soundSystem';
import { Bot, Network, Server, Terminal, Compass, ChevronDown, ChevronUp } from 'lucide-react';

interface ControlDockProps {
  currentMode: SceneMode;
  onSelectMode: (mode: SceneMode) => void;
  onResetCamera: () => void;
}

export const ControlDock: React.FC<ControlDockProps> = ({
  currentMode,
  onSelectMode,
  onResetCamera
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  // Keyboard shortcut 'H' to toggle HUD
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'h' || e.key === 'H') {
        // Only if not focused on an input element
        if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
        setIsCollapsed((prev) => !prev);
        sound.playClick();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems: { mode: SceneMode; label: string; icon: React.ReactNode; hint: string }[] = [
    {
      mode: 'avatar',
      label: 'Avatar Core',
      icon: <Bot className="w-4 h-4" />,
      hint: '3D Humanoid AI model with head tracking & chest reactor'
    },
    {
      mode: 'neural',
      label: 'Neural Synapses',
      icon: <Network className="w-4 h-4" />,
      hint: 'Cognitive disciplines & knowledge nodes'
    },
    {
      mode: 'ecosystem',
      label: 'KeenaNet Topology',
      icon: <Server className="w-4 h-4" />,
      hint: 'Homelab infrastructure, microservices & network matrix'
    },
    {
      mode: 'terminal',
      label: 'AI Command',
      icon: <Terminal className="w-4 h-4" />,
      hint: 'Interactive engineering command console'
    },
    {
      mode: 'about',
      label: 'Identity & Mission',
      icon: <Compass className="w-4 h-4" />,
      hint: 'Core principles, philosophy & engineering tenets'
    }
  ];

  return (
    <div
      className="fixed z-30 flex flex-col items-center transition-all duration-300 pointer-events-none"
      style={{
        bottom: '16px',
        left: '50%',
        transform: `translateX(-50%) translateY(${isCollapsed ? 'calc(100% - 30px)' : '0px'})`,
        maxWidth: 'min(940px, 94vw)',
        width: '100%'
      }}
    >
      {/* Collapse Toggle Tab */}
      <button
        onClick={() => {
          sound.playClick();
          setIsCollapsed(!isCollapsed);
        }}
        className="pointer-events-auto flex items-center space-x-1.5 px-3 py-1 bg-[#07111F] hover:bg-[#1C2533] border border-[#1C2533] border-b-0 rounded-t text-[11px] font-code text-[#A7BBCB] hover:text-[#00D9FF] cursor-pointer transition-colors shadow-lg"
      >
        {isCollapsed ? (
          <>
            <ChevronUp className="w-3.5 h-3.5 text-[#00D9FF]" />
            <span>SHOW HUD [H]</span>
          </>
        ) : (
          <>
            <ChevronDown className="w-3.5 h-3.5 text-[#00D9FF]" />
            <span>ZEN MODE [H]</span>
          </>
        )}
      </button>

      {/* Main Dock Container */}
      <div className="pointer-events-auto w-full bg-[#07111F]/95 border border-[#1C2533] rounded-lg p-2 sm:p-3 shadow-2xl hud-corner-bl hud-corner-br flex flex-col space-y-2">
        {/* Navigation Tabs */}
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
          {navItems.map((item) => {
            const isActive = currentMode === item.mode;
            return (
              <button
                key={item.mode}
                onClick={() => {
                  sound.playTransition();
                  onSelectMode(item.mode);
                }}
                className={`flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 py-2 px-2 rounded font-tech text-xs tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#00D9FF] text-[#050B14] font-bold shadow-[0_0_15px_rgba(0,217,255,0.4)]'
                    : 'bg-[#0F1722] text-[#A7BBCB] hover:text-white hover:bg-[#1C2533] border border-transparent hover:border-[#00D9FF]/30'
                }`}
              >
                <span>{item.icon}</span>
                <span className="text-[11px] sm:text-xs text-center truncate">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Viewport Control Instructions */}
        <div className="flex items-center justify-between text-[11px] font-code text-[#62778A] px-1 pt-1 border-t border-[#1C2533]/60">
          <div className="flex items-center space-x-3 overflow-hidden truncate">
            <span>🖱️ Drag: Rotate 3D</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">📜 Scroll: Zoom</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">⚡ Click Core: Activate Synapse</span>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onResetCamera();
            }}
            className="text-[#00D9FF] hover:underline cursor-pointer whitespace-nowrap ml-2"
          >
            [2x-Click] Reset View
          </button>
        </div>
      </div>
    </div>
  );
};
