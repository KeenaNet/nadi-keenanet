import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export const FallbackWebGL: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#050B14] text-[#A7BBCB]">
      <div className="max-w-md w-full bg-[#07111F] border border-[#1C2533] p-6 rounded-lg text-center space-y-4 shadow-2xl">
        <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-tech font-bold text-white">WebGL Acceleration Required</h2>
        <p className="text-xs font-sans leading-relaxed text-[#8EA2B4]">
          NADI — The Intelligence Core of KeenaNet requires WebGL hardware acceleration to render the real-time 3D humanoid avatar, neural synapses, and ecosystem topology.
        </p>
        <div className="text-xs font-code text-left bg-[#050B14] p-3 rounded border border-[#1C2533] space-y-1">
          <div>• Check browser hardware acceleration settings</div>
          <div>• Ensure GPU drivers are up to date</div>
          <div>• Try accessing via Chrome, Edge, or Firefox</div>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="w-full py-2.5 bg-[#00D9FF] hover:bg-[#38BDF8] text-[#050B14] font-tech font-bold text-xs uppercase tracking-wider rounded transition-colors flex items-center justify-center space-x-2 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reload Experience</span>
        </button>
      </div>
    </div>
  );
};
