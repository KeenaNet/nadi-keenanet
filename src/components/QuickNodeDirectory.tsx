import React, { useState } from 'react';
import { SceneMode, NeuralNodeData, EcosystemServiceData } from '../types';
import { NEURAL_NODES } from '../data/neuralNetworkData';
import { ECOSYSTEM_SERVICES } from '../data/ecosystemData';
import { sound } from '../audio/soundSystem';
import { Network, Server, Layers, Cpu, Shield, ExternalLink, ChevronDown, ChevronUp, Eye } from 'lucide-react';

interface QuickNodeDirectoryProps {
  sceneMode: SceneMode;
  selectedNeuralId: string | null;
  selectedEcosystemId: string | null;
  onSelectNeuralNode: (node: NeuralNodeData) => void;
  onSelectEcosystemNode: (service: EcosystemServiceData) => void;
}

export const QuickNodeDirectory: React.FC<QuickNodeDirectoryProps> = ({
  sceneMode,
  selectedNeuralId,
  selectedEcosystemId,
  onSelectNeuralNode,
  onSelectEcosystemNode
}) => {
  // Default to minimized as requested
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [ecosystemCategory, setEcosystemCategory] = useState<'All' | 'Infrastructure' | 'Services' | 'Development' | 'Network'>('All');

  // Whenever switching to or entering neural/ecosystem, ensure it is minimized by default
  React.useEffect(() => {
    setIsOpen(false);
  }, [sceneMode]);

  // Only render when in neural or ecosystem mode
  if (sceneMode !== 'neural' && sceneMode !== 'ecosystem') {
    return null;
  }

  const filteredEcosystem = ecosystemCategory === 'All'
    ? ECOSYSTEM_SERVICES
    : ECOSYSTEM_SERVICES.filter((s) => s.category === ecosystemCategory);

  return (
    <div
      className="fixed z-20 pointer-events-none transition-all duration-300"
      style={{
        bottom: '105px',
        left: '50%',
        transform: 'translateX(-50%)',
        maxWidth: 'min(980px, 95vw)',
        width: '100%'
      }}
    >
      {/* Header Bar with Toggle */}
      <div className="flex items-center justify-between mb-1.5 px-1">
        <div
          onClick={() => {
            sound.playClick();
            setIsOpen(!isOpen);
          }}
          className="pointer-events-auto flex items-center space-x-2 bg-[#07111F]/90 hover:bg-[#0D1C2F] border border-[#1C2533] hover:border-[#00D9FF]/40 px-3 py-1.5 rounded text-xs font-code text-[#A7BBCB] cursor-pointer transition-colors shadow-md"
        >
          {sceneMode === 'neural' ? (
            <>
              <Network className="w-3.5 h-3.5 text-[#00D9FF]" />
              <span className="text-[#00D9FF] font-semibold">RINGKASAN SYNAPSE ({NEURAL_NODES.length})</span>
              <span className="hidden sm:inline text-[#62778A]">— Keterangan singkat setiap node</span>
            </>
          ) : (
            <>
              <Server className="w-3.5 h-3.5 text-[#1677FF]" />
              <span className="text-[#00D9FF] font-semibold">RINGKASAN SERVICE ({ECOSYSTEM_SERVICES.length})</span>
              <span className="hidden sm:inline text-[#62778A]">— Keterangan singkat setiap node</span>
            </>
          )}
        </div>

        <button
          onClick={() => {
            sound.playClick();
            setIsOpen(!isOpen);
          }}
          className="pointer-events-auto flex items-center space-x-1.5 px-3 py-1.5 bg-[#07111F]/95 hover:bg-[#1C2533] border border-[#1C2533] hover:border-[#00D9FF]/50 rounded text-[11px] font-code text-[#A7BBCB] hover:text-[#00D9FF] cursor-pointer transition-colors shadow-md"
        >
          {isOpen ? (
            <>
              <ChevronDown className="w-3.5 h-3.5 text-[#00D9FF]" />
              <span>Sembunyikan Ringkasan</span>
            </>
          ) : (
            <>
              <ChevronUp className="w-3.5 h-3.5 text-[#00D9FF]" />
              <span className="font-semibold text-white">Lihat Ringkasan Node</span>
            </>
          )}
        </button>
      </div>

      {/* Main Collapsible Panel */}
      {isOpen && (
        <div className="pointer-events-auto bg-[#07111F]/95 border border-[#1C2533] rounded-lg p-2.5 sm:p-3 shadow-2xl hud-corner-tl hud-corner-tr max-h-[38vh] sm:max-h-[32vh] overflow-y-auto">
          {/* NEURAL SYNAPSES CARDS */}
          {sceneMode === 'neural' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {NEURAL_NODES.map((node) => {
                const isSelected = selectedNeuralId === node.id;
                return (
                  <div
                    key={node.id}
                    onClick={() => {
                      sound.playClick();
                      onSelectNeuralNode(node);
                    }}
                    onMouseEnter={() => sound.playHover()}
                    className={`p-2.5 rounded border transition-all cursor-pointer flex flex-col justify-between group ${
                      isSelected
                        ? 'bg-[#0E2038] border-[#00D9FF] shadow-[0_0_12px_rgba(0,217,255,0.3)]'
                        : 'bg-[#091424] border-[#1C2533] hover:border-[#00D9FF]/50 hover:bg-[#0D1C30]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-code text-[#00D9FF] uppercase tracking-wider font-semibold">
                          {node.category}
                        </span>
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: node.color }}
                        ></span>
                      </div>
                      <h4 className="font-tech font-bold text-xs text-white group-hover:text-[#00D9FF] transition-colors mb-1">
                        {node.name}
                      </h4>
                      {/* Keterangan Singkat */}
                      <p className="text-[11px] font-sans text-[#A7BBCB] leading-relaxed line-clamp-2">
                        {node.shortDescription}
                      </p>
                    </div>

                    <div className="mt-2 pt-1.5 border-t border-[#1C2533]/60 flex items-center justify-between text-[10px] font-code text-[#62778A]">
                      <span>{node.metrics[0].label}: {node.metrics[0].value}</span>
                      <span className="text-[#00D9FF] group-hover:underline flex items-center space-x-1">
                        <span>Buka Detail</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* KEENANET TOPOLOGY CARDS */}
          {sceneMode === 'ecosystem' && (
            <div className="space-y-2">
              {/* Category Filter Tabs */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs font-code">
                {(['All', 'Infrastructure', 'Services', 'Development', 'Network'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      sound.playClick();
                      setEcosystemCategory(cat);
                    }}
                    className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap cursor-pointer ${
                      ecosystemCategory === cat
                        ? 'bg-[#1677FF] text-white font-bold'
                        : 'bg-[#0F1B2C] text-[#A7BBCB] hover:text-white hover:bg-[#1C293D]'
                    }`}
                  >
                    {cat} {cat === 'All' ? `(${ECOSYSTEM_SERVICES.length})` : ''}
                  </button>
                ))}
              </div>

              {/* Service Cards Grid with Keterangan Singkat */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {filteredEcosystem.map((service) => {
                  const isSelected = selectedEcosystemId === service.id;
                  return (
                    <div
                      key={service.id}
                      onClick={() => {
                        sound.playClick();
                        onSelectEcosystemNode(service);
                      }}
                      onMouseEnter={() => sound.playHover()}
                      className={`p-2.5 rounded border transition-all cursor-pointer flex flex-col justify-between group ${
                        isSelected
                          ? 'bg-[#0C1B33] border-[#1677FF] shadow-[0_0_12px_rgba(22,119,255,0.4)]'
                          : 'bg-[#091424] border-[#1C2533] hover:border-[#1677FF]/50 hover:bg-[#0D1C30]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-code text-[#38BDF8] uppercase tracking-wider font-semibold">
                            {service.category}
                          </span>
                          <span className="text-[9px] font-code text-emerald-400 bg-emerald-950/60 px-1 py-0.2 rounded border border-emerald-900">
                            {service.status}
                          </span>
                        </div>
                        <h4 className="font-tech font-bold text-xs text-white group-hover:text-[#38BDF8] transition-colors mb-1">
                          {service.name}
                        </h4>
                        {/* Keterangan Singkat */}
                        <p className="text-[11px] font-sans text-[#A7BBCB] leading-relaxed line-clamp-2">
                          {service.shortDescription}
                        </p>
                      </div>

                      <div className="mt-2 pt-1.5 border-t border-[#1C2533]/60 flex items-center justify-between text-[10px] font-code text-[#62778A]">
                        <span className="truncate max-w-[150px]">{service.tech.split('/')[0]}</span>
                        <span className="text-[#38BDF8] group-hover:underline flex items-center space-x-1">
                          <span>Buka Detail</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
