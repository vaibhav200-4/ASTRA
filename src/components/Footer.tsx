import React from 'react';
import { useMission } from '../context/MissionContext';
import { Zap, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-[#0A1A33] text-[#5B6675] dark:text-slate-300 border-t border-[#D5DCE6] dark:border-slate-800 text-xs py-2 px-4 font-sans select-none shrink-0">
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        {/* Left: Branding & Status */}
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-[#138808] rounded-full" />
          <span className="font-bold text-[#0B2A5B] dark:text-white">ASTRA-PVT</span>
          <span className="text-[#5B6675] dark:text-slate-400 text-xs">
            ISRO • Department of Space
          </span>
        </div>

        {/* Center: Small One-Line Pitch */}
        <div className="text-center text-[11px] text-[#123F8C] dark:text-cyan-300 italic font-sans max-w-2xl">
          "An offline space-grade AI assistant that verifies physical results, validates experiment sequences, and responds locally."
        </div>

        {/* Right: Technical Compliance Tag */}
        <div className="flex items-center space-x-1.5 text-[10px] font-mono text-slate-400">
          <ShieldCheck size={12} className="text-[#138808]" />
          <span>DO-178C • Local Offline</span>
        </div>
      </div>
    </footer>
  );
};
