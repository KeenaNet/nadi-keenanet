import React from 'react';
import { EcosystemServiceData } from '../types';
import { ECOSYSTEM_SERVICES } from '../data/ecosystemData';
import { sound } from '../audio/soundSystem';
import { X, Server, Layers, Cpu, Shield, ChevronLeft, ChevronRight, Activity } from 'lucide-react';

interface EcosystemInspectorModalProps {
  selectedService: EcosystemServiceData | null;
  onSelectService: (service: EcosystemServiceData | null) => void;
}

export const EcosystemInspectorModal: React.FC<EcosystemInspectorModalProps> = ({
  selectedService,
  onSelectService
}) => {
  if (!selectedService) return null;

  const currentIndex = ECOSYSTEM_SERVICES.findIndex((s) => s.id === selectedService.id);
  const prevService = ECOSYSTEM_SERVICES[(currentIndex - 1 + ECOSYSTEM_SERVICES.length) % ECOSYSTEM_SERVICES.length];
  const nextService = ECOSYSTEM_SERVICES[(currentIndex + 1) % ECOSYSTEM_SERVICES.length];

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 pointer-events-auto bg-[#050B14]/75">
      <div className="w-full max-w-xl bg-[#07111F] border border-[#1677FF]/50 rounded-lg p-5 shadow-[0_0_30px_rgba(22,119,255,0.25)] relative hud-corner-tl hud-corner-tr hud-corner-bl hud-corner-br">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#1C2533] pb-3 mb-4">
          <div className="flex items-center space-x-3">
            <div
              className="p-2.5 rounded-sm"
              style={{ backgroundColor: `${selectedService.color}20`, border: `1px solid ${selectedService.color}` }}
            >
              <Server className="w-5 h-5" style={{ color: selectedService.color }} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-code text-[#00D9FF] uppercase tracking-widest">
                  {selectedService.category}
                </span>
                {selectedService.port && (
                  <span className="text-[10px] font-code bg-[#1C2533] text-[#A7BBCB] px-1.5 py-0.5 rounded">
                    Port {selectedService.port}
                  </span>
                )}
                <span className="text-[10px] font-code text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800">
                  {selectedService.status}
                </span>
              </div>
              <h2 className="text-xl font-tech font-bold text-white tracking-wide">
                {selectedService.name}
              </h2>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onSelectService(null);
            }}
            className="p-1.5 text-[#A7BBCB] hover:text-white bg-[#1C2533] hover:bg-[#2A3749] rounded transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Keterangan Singkat Callout */}
        <div className="bg-[#0C1B33] border-l-2 border-[#1677FF] px-3 py-2 rounded-r mb-3 text-xs font-code text-[#38BDF8]">
          {selectedService.shortDescription}
        </div>

        {/* Role & Tech */}
        <div className="bg-[#0F1722] p-3 rounded border border-[#1C2533] mb-4 space-y-2 text-xs font-code">
          <div className="flex items-center justify-between">
            <span className="text-[#62778A]">Operational Role:</span>
            <span className="text-white font-medium text-right">{selectedService.role}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#62778A]">Stack & Runtime:</span>
            <span className="text-[#00D9FF]">{selectedService.tech}</span>
          </div>
        </div>

        {/* Direct Relationship with NADI */}
        <div className="mb-4">
          <div className="flex items-center space-x-1.5 text-xs font-code text-[#00D9FF] uppercase tracking-wider mb-1.5">
            <Cpu className="w-3.5 h-3.5" />
            <span>Relationship with NADI Co-Pilot</span>
          </div>
          <p className="text-xs font-sans text-[#CBD5E1] bg-[#050B14] p-2.5 rounded border border-[#1C2533] leading-relaxed">
            {selectedService.relationToNadi}
          </p>
        </div>

        {/* Features Matrix */}
        <div className="mb-4">
          <div className="text-xs font-code text-[#A7BBCB] uppercase tracking-wider mb-2">
            Service Capabilities
          </div>
          <div className="grid grid-cols-2 gap-2">
            {selectedService.features.map((feat, i) => (
              <div key={i} className="text-[11px] font-code text-[#94A3B8] bg-[#0F1722] p-1.5 rounded border border-[#1C2533] flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 bg-[#1677FF] rounded-full shrink-0"></span>
                <span className="truncate">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-[#1C2533] text-xs font-code">
          <button
            onClick={() => {
              sound.playClick();
              onSelectService(prevService);
            }}
            className="flex items-center space-x-1 text-[#A7BBCB] hover:text-[#00D9FF] cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev Node</span>
          </button>
          <span className="text-[#62778A]">Node {currentIndex + 1} of {ECOSYSTEM_SERVICES.length}</span>
          <button
            onClick={() => {
              sound.playClick();
              onSelectService(nextService);
            }}
            className="flex items-center space-x-1 text-[#A7BBCB] hover:text-[#00D9FF] cursor-pointer"
          >
            <span>Next Node</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
