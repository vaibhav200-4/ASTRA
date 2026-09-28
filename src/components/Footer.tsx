import React from 'react';
import { ShieldCheck, Zap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-[#0A1A33] text-[#4A5568] dark:text-[#B8C4D6] border-t border-[#D5DCE6] dark:border-slate-800 text-xs font-sans select-none shrink-0">
      {/* Pitch Statement Row */}
      <div className="bg-[#EEF3FA] dark:bg-[#071326] py-1.5 px-4 text-center border-b border-[#D5DCE6] dark:border-slate-800/80">
        <p className="text-xs font-semibold text-[#123F8C] dark:text-[#7DD3FC] italic font-sans max-w-4xl mx-auto">
          "An offline space-grade AI assistant that does not just recognize an astronaut's action — it verifies the physical result, validates the experiment sequence, and responds locally."
        </p>
      </div>

      {/* Primary Footer Metadata Row */}
      <div className="w-full max-w-7xl mx-auto py-2 px-4 flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-[#138808] dark:bg-[#4ADE80] rounded-full" />
          <span className="font-bold text-[#1B2430] dark:text-[#F1F5F9]">ASTRA-PVT</span>
          <span className="text-[#4A5568] dark:text-[#B8C4D6] text-xs font-medium">
            ISRO &bull; Department of Space
          </span>
        </div>

        <div className="flex items-center space-x-1.5 text-xs text-[#123F8C] dark:text-[#7DD3FC] font-mono font-bold">
          <Zap size={13} className="text-[#F26B21] dark:text-[#FFA366]" />
          <span>SIH 2026 PS174 | SIH26174</span>
        </div>

        <div className="flex items-center space-x-1.5 text-xs font-mono text-[#4A5568] dark:text-[#B8C4D6] font-bold">
          <ShieldCheck size={13} className="text-[#0F6B06] dark:text-[#4ADE80]" />
          <span>DO-178C &bull; Local Offline</span>
        </div>
      </div>
    </footer>
  );
};
