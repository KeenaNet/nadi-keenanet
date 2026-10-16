import React, { useState } from 'react';
import { ABOUT_NADI, CorePrinciple } from '../data/aboutData';
import { sound } from '../audio/soundSystem';
import { X, ShieldCheck, Cpu, HardDrive, Compass, BookOpen, CheckCircle } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  const [selectedPrinciple, setSelectedPrinciple] = useState<CorePrinciple>(ABOUT_NADI.principles[0]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-6 pointer-events-auto bg-[#050B14]/80">
      <div className="w-full max-w-4xl max-h-[85vh] bg-[#07111F] border border-[#00D9FF]/40 rounded-lg shadow-[0_0_40px_rgba(0,217,255,0.25)] flex flex-col overflow-hidden hud-corner-tl hud-corner-tr hud-corner-bl hud-corner-br">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#091322] border-b border-[#1C2533]">
          <div className="flex items-center space-x-2">
            <Compass className="w-5 h-5 text-[#00D9FF]" />
            <div>
              <h2 className="font-tech font-bold text-base text-white tracking-wider">
                ABOUT NADI // IDENTITY & CORE TENETS
              </h2>
              <div className="text-[11px] font-code text-[#00D9FF]">
                The Intelligence Core of KeenaNet
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 text-[#A7BBCB] hover:text-white hover:bg-[#1C2533] rounded transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Identity & Mission Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Identity Card */}
            <div className="bg-[#0B1726] border border-[#1C2533] p-4 rounded">
              <div className="text-[10px] font-code text-[#00D9FF] uppercase tracking-widest mb-1">
                SYSTEM IDENTITY
              </div>
              <h3 className="text-xl font-tech font-bold text-white mb-1">
                {ABOUT_NADI.fullName}
              </h3>
              <p className="text-xs text-[#A7BBCB] font-sans leading-relaxed mb-3">
                {ABOUT_NADI.role}. Engineered as an autonomous technical partner for homelab infrastructure, system hardening, and reactive automations.
              </p>
              <div className="border-t border-[#1C2533] pt-2 text-[11px] font-code text-[#62778A]">
                MANDATE: {ABOUT_NADI.mission}
              </div>
            </div>

            {/* Philosophy Card */}
            <div className="bg-[#0B1726] border border-[#1C2533] p-4 rounded flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-code text-[#1677FF] uppercase tracking-widest mb-1">
                  CORE PHILOSOPHY
                </div>
                <blockquote className="text-base font-tech italic text-[#E0F2FE] border-l-2 border-[#00D9FF] pl-3 py-1 mb-3">
                  "{ABOUT_NADI.philosophy}"
                </blockquote>
                <p className="text-xs text-[#8EA2B4] leading-relaxed">
                  Every decision prioritizes mathematical certainty and rigorous testing before introducing novelty.
                </p>
              </div>

              {/* Homelab Spec Pill */}
              <div className="bg-[#050B14] p-2 rounded border border-[#1C2533] mt-3 text-[10px] font-code text-[#62778A] flex items-center justify-between">
                <span>HOST: {ABOUT_NADI.hostArchitecture.hardware}</span>
                <span className="text-[#00D9FF]">OPTIMIZED 8GB RAM</span>
              </div>
            </div>
          </div>

          {/* 6 Core Principles Section */}
          <div>
            <div className="flex items-center space-x-2 text-xs font-code text-[#00D9FF] uppercase tracking-widest mb-3">
              <BookOpen className="w-4 h-4" />
              <span>THE 6 CORE PRINCIPLES OF NADI</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              {ABOUT_NADI.principles.map((p) => {
                const isSelected = selectedPrinciple.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedPrinciple(p);
                    }}
                    className={`text-left p-3 rounded border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0E2038] border-[#00D9FF] shadow-[0_0_15px_rgba(0,217,255,0.2)]'
                        : 'bg-[#071322] border-[#1C2533] hover:border-[#00D9FF]/40 text-[#A7BBCB]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-code text-[#00D9FF] font-bold">
                        {p.number}
                      </span>
                      {isSelected && <CheckCircle className="w-3.5 h-3.5 text-[#00D9FF]" />}
                    </div>
                    <div className="font-tech font-bold text-sm text-white mb-1">
                      {p.title}
                    </div>
                    <div className="text-[11px] font-code text-[#8EA2B4] line-clamp-2">
                      {p.tagline}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Principle Deep Dive Card */}
            <div className="bg-[#0A1628] border border-[#00D9FF]/30 p-4 rounded">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-code text-[#00D9FF]">
                  PRINCIPLE DETAIL // {selectedPrinciple.number}
                </span>
                <span className="text-xs font-tech font-bold text-white">
                  {selectedPrinciple.title}
                </span>
              </div>
              <p className="text-sm font-sans text-[#CBD5E1] leading-relaxed mb-3">
                {selectedPrinciple.explanation}
              </p>
              <div className="bg-[#050B14] p-2.5 rounded border border-[#1C2533] flex items-center space-x-2 text-xs font-code text-[#00D9FF]">
                <ShieldCheck className="w-4 h-4 text-[#00D9FF] shrink-0" />
                <span>TECHNICAL RULE: {selectedPrinciple.technicalRule}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
