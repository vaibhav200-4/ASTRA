import React from 'react';
import { useMission } from '../context/MissionContext';
import { Zap } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language } = useMission();

  return (
    <footer className="bg-white dark:bg-[#0A1A33] text-[#5B6675] dark:text-slate-300 border-t border-[#D5DCE6] dark:border-slate-800 text-xs py-3 px-4 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left identity */}
        <div className="flex items-center space-x-2.5">
          <span className="w-2 h-2 bg-[#138808] rounded-full"></span>
          <div>
            <span className="font-bold text-[#0B2A5B] dark:text-white">ASTRA-PVT</span>
            <span className="text-[#5B6675] dark:text-slate-400 ml-2 text-xs">
              ISRO • Department of Space
            </span>
          </div>
        </div>

        {/* Center Hackathon Details */}
        <div className="text-center font-mono text-xs text-[#123F8C] dark:text-cyan-300 bg-[#EEF3FA] dark:bg-slate-900 px-3 py-1 rounded border border-[#D5DCE6] dark:border-slate-800 flex items-center space-x-1.5">
          <Zap size={12} className="text-[#F26B21]" />
          <span>Smart India Hackathon 2026 | PS174 (SIH26174)</span>
        </div>

        {/* Right Disclaimer */}
        <div className="text-right text-[11px] text-[#5B6675] dark:text-slate-400">
          <p className="italic">
            DO-178C-aligned traceability • Strictly local offline execution
          </p>
        </div>
      </div>
    </footer>
  );
};
