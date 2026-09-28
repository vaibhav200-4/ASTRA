import React from 'react';
import { useMission } from '../context/MissionContext';
import { ShieldCheck, Zap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-[#0A1A33] text-[#5B6675] dark:text-slate-300 border-t border-[#D5DCE6] dark:border-slate-800 text-xs font-sans select-none shrink-0">
      {/* Pitch Statement Row */}
      <div className="bg-[#EEF3FA] dark:bg-[#071326] py-1.5 px-4 text-center border-b border-[#D5DCE6] dark:border-slate-800/80">
        <p className="text-xs font-medium text-[#123F8C] dark:text-cyan-300 italic font-sans max-w-4xl mx-auto">
          "An offline space-grade AI assistant that does not just recognize an astronaut's action — it verifies the physical result, validates the experiment sequence, and responds locally."
        </p>
      </div>

      {/* Primary Footer Metadata Row */}
      <div className="w-full max-w-7xl mx-auto py-2 px-4 flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-[#138808] rounded-full" />
          <span className="font-bold text-[#0B2A5B] dark:text-white">ASTRA-PVT</span>
          <span className="text-[#5B6675] dark:text-slate-400 text-xs">
            ISRO • Department of Space
          </span>
        </div>

        <div className="flex items-center space-x-1.5 text-xs text-[#123F8C] dark:text-cyan-300 font-mono">
          <Zap size={13} className="text-[#F26B21]" />
          <span>SIH 2026 PS174 | SIH26174</span>
        </div>

        <div className="flex items-center space-x-1.5 text-xs font-mono text-slate-400">
          <ShieldCheck size={13} className="text-[#138808]" />
          <span>DO-178C • Local Offline</span>
        </div>
      </div>
    </footer>
  );
};
