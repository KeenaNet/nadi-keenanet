import React, { useState, useEffect } from 'react';
import { sound } from '../audio/soundSystem';
import { Cpu, ShieldCheck, Zap, Terminal, FastForward } from 'lucide-react';

interface AwakeningOverlayProps {
  onComplete: () => void;
}

export const AwakeningOverlay: React.FC<AwakeningOverlayProps> = ({ onComplete }) => {
  const [bootStep, setBootStep] = useState<number>(0);
  const [bootLogs, setBootLogs] = useState<string[]>([]);

  useEffect(() => {
    sound.playAwakeningBoot();

    const sequence = [
      { text: '[INIT] Powering up Dell OptiPlex 3050 Micro homelab unit...', step: 1, delay: 500 },
      { text: '[KERNEL] Ubuntu Server 24.04 LTS loaded. Low-latency profile active.', step: 2, delay: 1100 },
      { text: '[BRIDGE] OpenClaw FastMCP Agent Interconnect established on :8080.', step: 3, delay: 1700 },
      { text: '[NEURAL] Luminous chest arc reactor initialized. 100% capacity.', step: 4, delay: 2400 },
      { text: '[OPTICS] Electric cyan optical matrices calibrated. Head tracking online.', step: 5, delay: 3000 },
      { text: '[READY] NADI AI Engineering Guardian fully awakened.', step: 6, delay: 3600 }
    ];

    const timeouts = sequence.map((item) =>
      setTimeout(() => {
        setBootLogs((prev) => [...prev, item.text]);
        setBootStep(item.step);
        sound.playTypeTick();
      }, item.delay)
    );

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, []);

  const handleStart = () => {
    sound.playCorePulse();
    sound.startAmbient();
    onComplete();
  };

  const handleSkip = () => {
    sound.playClick();
    sound.startAmbient();
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 sm:p-10 pointer-events-auto bg-[#050B14]/90">
      {/* Top Bar with Skip */}
      <div className="w-full flex items-center justify-between max-w-5xl">
        <div className="flex items-center space-x-2 text-xs font-code tracking-widest text-[#00D9FF]">
          <span className="inline-block w-2 h-2 bg-[#00D9FF]"></span>
          <span>SYSTEM_BOOT // KEENANET_CORE</span>
        </div>
        <button
          onClick={handleSkip}
          className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-code text-[#A7BBCB] hover:text-[#00D9FF] bg-[#07111F] hover:bg-[#1C2533] border border-[#1C2533] hover:border-[#00D9FF]/40 rounded cursor-pointer transition-colors"
        >
          <span>SKIP SEQUENCE</span>
          <FastForward className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Center Cinematic Card */}
      <div className="max-w-2xl w-full text-center my-auto flex flex-col items-center">
        {/* Holographic Badge */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 mb-4 rounded-full bg-[#07111F] border border-[#00D9FF]/40 text-[#00D9FF] text-xs font-code tracking-widest uppercase">
          <Zap className="w-3.5 h-3.5" />
          <span>The Intelligence Core of KeenaNet</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-tech font-bold tracking-wider text-white mb-2">
          NADI <span className="text-[#00D9FF]">AI</span>
        </h1>
        <p className="text-sm sm:text-base font-code text-[#A7BBCB] mb-6 tracking-wide">
          Network • Automation • Development • Intelligence
        </p>

        {/* Philosophy Creed */}
        <div className="italic text-xs sm:text-sm text-[#8EA2B4] max-w-lg mb-8 border-l-2 border-[#00D9FF] pl-3 py-1 text-left bg-[#07111F]/60">
          "Think critically. Build deliberately. Automate responsibly."
        </div>

        {/* Boot Logs Terminal */}
        <div className="w-full bg-[#07111F] border border-[#1C2533] rounded p-3 mb-8 text-left font-code text-xs space-y-1 max-h-36 overflow-y-auto">
          {bootLogs.map((log, idx) => (
            <div key={idx} className="text-[#00D9FF]/90">
              {log}
            </div>
          ))}
          {bootStep < 6 && (
            <div className="text-[#A7BBCB] flex items-center space-x-2">
              <span className="inline-block w-1.5 h-3 bg-[#00D9FF]"></span>
              <span>Synchronizing neural synapses...</span>
            </div>
          )}
        </div>

        {/* Initialize Button */}
        <button
          onClick={handleStart}
          className="group relative inline-flex items-center justify-center space-x-3 px-8 py-3.5 bg-[#00D9FF] hover:bg-[#38BDF8] text-[#050B14] font-tech font-bold text-base tracking-widest uppercase rounded cursor-pointer transition-all shadow-[0_0_25px_rgba(0,217,255,0.4)] hover:shadow-[0_0_35px_rgba(0,217,255,0.7)]"
        >
          <Cpu className="w-5 h-5" />
          <span>INITIALIZE NADI EXPERIENCE</span>
        </button>

        <p className="text-[11px] font-code text-[#62778A] mt-3">
          Interactive 3D WebGL • Real-time Head Tracking • KeenaNet Homelab
        </p>
      </div>

      {/* Footer Specs */}
      <div className="w-full max-w-5xl flex flex-wrap items-center justify-between text-[11px] font-code text-[#62778A] border-t border-[#1C2533] pt-4">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00D9FF]" />
            <span>Zero-Trust Architecture</span>
          </span>
          <span className="flex items-center space-x-1">
            <Terminal className="w-3.5 h-3.5 text-[#1677FF]" />
            <span>OpenClaw Runtime</span>
          </span>
        </div>
        <span>Dell OptiPlex 3050 Micro • Ubuntu 24.04</span>
      </div>
    </div>
  );
};
