import React from 'react';
import { NeuralNodeData } from '../types';
import { NEURAL_NODES } from '../data/neuralNetworkData';
import { sound } from '../audio/soundSystem';
import { X, Network, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';

interface NeuralInspectorModalProps {
  selectedNode: NeuralNodeData | null;
  onSelectNode: (node: NeuralNodeData | null) => void;
}

export const NeuralInspectorModal: React.FC<NeuralInspectorModalProps> = ({
  selectedNode,
  onSelectNode
}) => {
  if (!selectedNode) return null;

  const currentIndex = NEURAL_NODES.findIndex((n) => n.id === selectedNode.id);
  const prevNode = NEURAL_NODES[(currentIndex - 1 + NEURAL_NODES.length) % NEURAL_NODES.length];
  const nextNode = NEURAL_NODES[(currentIndex + 1) % NEURAL_NODES.length];

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 pointer-events-auto bg-[#050B14]/75">
      <div className="w-full max-w-xl bg-[#07111F] border border-[#00D9FF]/40 rounded-lg p-5 shadow-[0_0_30px_rgba(0,217,255,0.25)] relative hud-corner-tl hud-corner-tr hud-corner-bl hud-corner-br">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#1C2533] pb-3 mb-4">
          <div className="flex items-center space-x-3">
            <div
              className="p-2.5 rounded-sm"
              style={{ backgroundColor: `${selectedNode.color}20`, border: `1px solid ${selectedNode.color}` }}
            >
              <Network className="w-5 h-5" style={{ color: selectedNode.color }} />
            </div>
            <div>
              <div className="text-[10px] font-code text-[#00D9FF] uppercase tracking-widest">
                {selectedNode.category}
              </div>
              <h2 className="text-xl font-tech font-bold text-white tracking-wide">
                {selectedNode.name}
              </h2>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onSelectNode(null);
            }}
            className="p-1.5 text-[#A7BBCB] hover:text-white bg-[#1C2533] hover:bg-[#2A3749] rounded transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Keterangan Singkat Callout */}
        <div className="bg-[#0D1C2F] border-l-2 border-[#00D9FF] px-3 py-2 rounded-r mb-3 text-xs font-code text-[#00D9FF]">
          {selectedNode.shortDescription}
        </div>

        {/* Description */}
        <p className="text-sm font-sans text-[#A7BBCB] leading-relaxed mb-4">
          {selectedNode.description}
        </p>

        {/* Capabilities */}
        <div className="mb-4">
          <div className="text-xs font-code text-[#00D9FF] uppercase tracking-wider mb-2">
            Engineered Capabilities
          </div>
          <div className="space-y-1.5">
            {selectedNode.capabilities.map((cap, i) => (
              <div key={i} className="flex items-center space-x-2 text-xs font-code text-[#CCD8E2] bg-[#0F1722] p-2 rounded border border-[#1C2533]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00D9FF] shrink-0" />
                <span>{cap}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Subsystem Telemetry Metrics */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#1C2533] mb-4">
          {selectedNode.metrics.map((m, idx) => (
            <div key={idx} className="bg-[#050B14] p-2 rounded border border-[#1C2533] text-center">
              <div className="text-[10px] font-code text-[#62778A]">{m.label}</div>
              <div className="text-xs font-tech font-bold text-[#00D9FF]">{m.value}</div>
            </div>
          ))}
        </div>

        {/* Next / Previous Navigator */}
        <div className="flex items-center justify-between pt-2 border-t border-[#1C2533] text-xs font-code">
          <button
            onClick={() => {
              sound.playClick();
              onSelectNode(prevNode);
            }}
            className="flex items-center space-x-1 text-[#A7BBCB] hover:text-[#00D9FF] cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev Synapse</span>
          </button>
          <span className="text-[#62778A]">Node {currentIndex + 1} of {NEURAL_NODES.length}</span>
          <button
            onClick={() => {
              sound.playClick();
              onSelectNode(nextNode);
            }}
            className="flex items-center space-x-1 text-[#A7BBCB] hover:text-[#00D9FF] cursor-pointer"
          >
            <span>Next Synapse</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
