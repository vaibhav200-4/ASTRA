import React from 'react';
import { Zap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050914] text-slate-400 border-t border-slate-800/80 text-xs py-4 px-6 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left identity */}
        <div className="flex items-center space-x-3">
          <span className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_#06b6d4]"></span>
          <div>
            <span className="font-extrabold text-white font-mono tracking-wider">ASTRA-PVT</span>
            <span className="text-slate-500 ml-2">
              Astronaut Protocol Tracking & Validation System
            </span>
          </div>
        </div>

        {/* Center Hackathon Details */}
        <div className="text-center font-mono text-[11px] text-slate-400 bg-slate-900/80 px-3 py-1 rounded-lg border border-slate-800 flex items-center space-x-1.5">
          <Zap size={11} className="text-amber-400" />
          <span>Smart India Hackathon 2026 | Problem Statement <strong className="text-amber-400 font-extrabold">PS174 (SIH26174)</strong></span>
        </div>

        {/* Right Disclaimer */}
        <div className="text-right text-[11px] text-slate-500 max-w-md">
          <p className="italic">
            "Experimental mission-control prototype designed for zero-cloud on-device astronaut experiment validation."
          </p>
        </div>
      </div>
    </footer>
  );
};
