import React from 'react';
import { SceneMode } from '../types';
import { sound } from '../audio/soundSystem';
import { Volume2, VolumeX, RotateCcw, PlaySquare, Shield, Activity } from 'lucide-react';

interface HeaderHUDProps {
  sceneMode: SceneMode;
  isMuted: boolean;
  onToggleMute: () => void;
  onResetCamera: () => void;
  onReplayAwakening: () => void;
}

const MODE_LABELS: Record<SceneMode, string> = {
  avatar: 'AVATAR CORE // 3D MATRIX',
  neural: 'NEURAL SYNAPSE // INTELLIGENCE',
  ecosystem: 'KEENANET TOPOLOGY // HOMELAB',
  terminal: 'AI COMMAND // CO-PILOT TERMINAL',
  about: 'NADI IDENTITY // PHILOSOPHY'
};

export const HeaderHUD: React.FC<HeaderHUDProps> = ({
  sceneMode,
  isMuted,
  onToggleMute,
  onResetCamera,
  onReplayAwakening
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 pointer-events-none p-3 sm:p-5 flex items-start justify-between">
      {/* Left Branding & Homelab Info */}
      <div className="pointer-events-auto flex items-center space-x-3 bg-[#07111F]/90 border border-[#1C2533] px-3.5 py-2 rounded-sm shadow-md hud-corner-tl">
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <span className="font-tech font-bold text-white text-base tracking-wider">NADI</span>
            <span className="text-[10px] font-code bg-[#1C2533] text-[#00D9FF] px-1.5 py-0.5 rounded">
              CO-PILOT
            </span>
          </div>
          <span className="text-[11px] font-code text-[#62778A] hidden sm:inline">
            KeenaNet Homelab • Dell OptiPlex 3050 • OpenClaw
          </span>
        </div>
      </div>

      {/* Center Scene Mode Badge */}
      <div className="pointer-events-auto hidden md:flex items-center space-x-2 bg-[#07111F]/90 border border-[#00D9FF]/30 px-3 py-1.5 rounded text-xs font-code text-[#00D9FF] tracking-wider uppercase">
        <Activity className="w-3.5 h-3.5 text-[#00D9FF]" />
        <span>{MODE_LABELS[sceneMode]}</span>
      </div>

      {/* Right Quick Actions (Sound, Reset Camera, Replay Intro) */}
      <div className="pointer-events-auto flex items-center space-x-2 bg-[#07111F]/90 border border-[#1C2533] p-1.5 rounded-sm shadow-md hud-corner-tr">
        {/* Reset Camera */}
        <button
          onClick={() => {
            sound.playClick();
            onResetCamera();
          }}
          title="Reset Camera View [Double-click canvas]"
          className="p-1.5 text-[#A7BBCB] hover:text-[#00D9FF] hover:bg-[#1C2533] rounded transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Audio Mute/Unmute */}
        <button
          onClick={() => {
            sound.playClick();
            onToggleMute();
          }}
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          className="p-1.5 text-[#A7BBCB] hover:text-[#00D9FF] hover:bg-[#1C2533] rounded transition-colors cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-[#00D9FF]" />}
        </button>

        {/* Replay Awakening */}
        <button
          onClick={() => {
            sound.playClick();
            onReplayAwakening();
          }}
          title="Replay Awakening Sequence"
          className="p-1.5 text-[#A7BBCB] hover:text-[#00D9FF] hover:bg-[#1C2533] rounded transition-colors cursor-pointer"
        >
          <PlaySquare className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
