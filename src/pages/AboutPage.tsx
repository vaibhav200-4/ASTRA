import React from 'react';
import { Emblem } from '../components/Emblem';
import { ShieldAlert, CheckCircle2, Cpu, FileText, Info } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="bg-[#071B33] text-white p-8 rounded-lg shadow-md border border-navy-700 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <Emblem size={64} />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl md:text-3xl font-extrabold font-mono tracking-tight text-white">
                ASTRA-PVT
              </h1>
              <span className="bg-saffron-500 text-white font-mono text-xs font-bold px-2 py-0.5 rounded">
                SIH 2026 PS174
              </span>
            </div>
            <p className="text-sm text-slate-300 font-mono mt-1">
              Astronaut Protocol Tracking & Validation System
            </p>
          </div>
        </div>

        <div className="bg-navy-900 px-4 py-2 rounded border border-navy-700 font-mono text-xs text-right">
          <span className="text-slate-400 block text-[10px]">HACKATHON SPECIFICATION</span>
          <span className="font-bold text-saffron-400">SIH26174</span>
        </div>
      </div>

      {/* Overview & Problem Statement */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4 font-sans">
        <h2 className="font-bold font-mono text-sm text-navy-900 border-b pb-2 flex items-center space-x-2">
          <Info size={18} className="text-saffron-500" />
          <span>PROBLEM CONCEPT & RESEARCH OBJECTIVE</span>
        </h2>

        <p className="text-xs text-slate-700 leading-relaxed">
          In human spaceflight microgravity environments, astronauts perform complex scientific payloads under intense cognitive workloads. Manual checklist verification increases time overhead and introduces human error risks. ASTRA-PVT solves this challenge by delivering an <strong>On-Device Edge AI system</strong> that watches payload rack activities, tracks experiment step sequences, and provides immediate vocal and visual feedback when procedural deviations occur.
        </p>

        {/* 11 Core Capabilities */}
        <h3 className="font-bold font-mono text-xs text-navy-900 pt-2">
          ELEVEN CORE CAPABILITIES DEMONSTRATED IN THIS PROTOTYPE:
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
          {[
            "1. Real-Time Object Detection (YOLOv8-Nano)",
            "2. 3D Human Pose Estimation (MediaPipe)",
            "3. Rack-Relative 3D Pose ('No Fixed Up')",
            "4. Hand-Object Interaction (HOI Vector)",
            "5. Temporal Activity Recognition (HAR)",
            "6. Deterministic Sequence Validation (FSM)",
            "7. Next-Step Guidance Display",
            "8. Voice Alerts (Web Speech API)",
            "9. Blackbox Timestamped Audit Logging",
            "10. Local Video Monitoring & Upload",
            "11. Strictly Offline Edge Processing"
          ].map((cap, idx) => (
            <div key={idx} className="p-3 bg-space-bg rounded border border-slate-200 flex items-center space-x-2">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span className="text-navy-900 font-semibold">{cap}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Institutional Disclaimer */}
      <div className="bg-[#071B33] text-white p-6 rounded-lg border-l-4 border-saffron-500 space-y-2 font-mono text-xs">
        <div className="flex items-center space-x-2 text-saffron-400 font-bold">
          <ShieldAlert size={18} />
          <span>RESEARCH PROTOTYPE DISCLAMER</span>
        </div>
        <p className="text-slate-300 leading-relaxed font-sans text-xs">
          "Interface designed as an experimental mission-control research prototype for Smart India Hackathon 2026 (Problem Statement PS174 / SIH26174) and does not represent an official ISRO operational system or product."
        </p>
      </div>
    </div>
  );
};
