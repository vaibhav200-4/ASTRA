import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#071B33] text-slate-300 border-t border-navy-800 text-xs py-4 px-6 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left identity */}
        <div className="flex items-center space-x-3">
          <div className="w-2.5 h-2.5 bg-saffron-500 rounded-full"></div>
          <div>
            <span className="font-bold text-white font-mono">ASTRA-PVT</span>
            <span className="text-slate-400 ml-2">
              Astronaut Protocol Tracking & Validation System
            </span>
          </div>
        </div>

        {/* Center Hackathon Details */}
        <div className="text-center font-mono text-[11px] text-slate-400 bg-navy-900 px-3 py-1 rounded border border-navy-800">
          Smart India Hackathon 2026 | Problem Statement <span className="text-saffron-400 font-bold">PS174 (SIH26174)</span>
        </div>

        {/* Right Disclaimer */}
        <div className="text-right text-[11px] text-slate-400 max-w-md">
          <p className="italic">
            "Interface designed as an experimental mission-control prototype and does not represent an official ISRO operational system."
          </p>
        </div>
      </div>
    </footer>
  );
};
