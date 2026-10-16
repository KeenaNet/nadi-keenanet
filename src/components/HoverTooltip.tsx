import React from 'react';
import { NeuralNodeData, EcosystemServiceData } from '../types';

export interface HoveredNodeInfo {
  type: 'neural' | 'ecosystem';
  data: NeuralNodeData | EcosystemServiceData;
  x: number;
  y: number;
}

interface HoverTooltipProps {
  hoveredNode: HoveredNodeInfo | null;
}

export const HoverTooltip: React.FC<HoverTooltipProps> = ({ hoveredNode }) => {
  if (!hoveredNode) return null;

  const { data, type, x, y } = hoveredNode;
  const isNeural = type === 'neural';

  // Position tooltip safely within screen bounds
  const screenW = typeof window !== 'undefined' ? window.innerWidth : 1000;
  const screenH = typeof window !== 'undefined' ? window.innerHeight : 800;

  const tooltipWidth = 290;
  const tooltipHeight = 135;

  // Center horizontally or offset to right of pointer
  let posX = x + 16;
  let posY = y - 65;

  if (posX + tooltipWidth > screenW - 14) {
    posX = x - tooltipWidth - 16;
  }
  if (posY < 14) {
    posY = y + 16;
  } else if (posY + tooltipHeight > screenH - 14) {
    posY = screenH - tooltipHeight - 14;
  }

  // Strict viewport clamp: NEVER allow negative or off-screen coordinates
  posX = Math.max(14, Math.min(posX, Math.max(14, screenW - tooltipWidth - 14)));
  posY = Math.max(14, Math.min(posY, Math.max(14, screenH - tooltipHeight - 14)));

  return (
    <div
      className="fixed z-[100] pointer-events-none transition-all duration-75"
      style={{
        left: `${posX}px`,
        top: `${posY}px`,
        width: `${tooltipWidth}px`
      }}
    >
      <div className="bg-[#07111F]/95 border border-[#00D9FF]/70 rounded-md p-3 shadow-[0_0_25px_rgba(0,217,255,0.4)] hud-corner-tl hud-corner-br">
        {/* Category & Badge */}
        <div className="flex items-center justify-between mb-1.5">
          <span
            className="text-[9px] font-code uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded"
            style={{
              backgroundColor: isNeural ? '#00D9FF25' : '#1677FF25',
              color: isNeural ? '#00D9FF' : '#38BDF8',
              border: `1px solid ${isNeural ? '#00D9FF60' : '#1677FF60'}`
            }}
          >
            {data.category}
          </span>
          <span className="text-[9px] font-code text-emerald-400 bg-emerald-950/60 px-1 py-0.2 rounded border border-emerald-900">
            {'status' in data ? (data as EcosystemServiceData).status : 'Active Synapse'}
          </span>
        </div>

        {/* Node Name */}
        <h4 className="text-xs font-tech font-bold text-white tracking-wide mb-1 flex items-center justify-between">
          <span>{data.name}</span>
          <span className="text-[10px] text-[#00D9FF]">◈</span>
        </h4>

        {/* Keterangan Singkat */}
        <p className="text-[11px] font-sans text-[#E0F2FE] leading-relaxed mb-2 font-medium">
          {data.shortDescription}
        </p>

        {/* Prompt hint */}
        <div className="pt-1.5 border-t border-[#1C2533] flex items-center justify-between text-[9px] font-code text-[#00D9FF]">
          <span>KLIK UNTUK TELEMETRI</span>
          <span>ENTER ↵</span>
        </div>
      </div>
    </div>
  );
};
