import React from 'react';
import { Emblem } from '../components/Emblem';
import { ShieldAlert, CheckCircle2, Cpu, FileText, Info, Zap } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-5 font-sans">
      {/* Header Banner */}
      <div className="glass-card bg-gradient-to-r from-slate-900 to-[#0d162a] text-white p-6 md:p-8 rounded-2xl shadow-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <Emblem size={64} />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl md:text-3xl font-extrabold font-mono tracking-tight text-white">
                ASTRA-PVT
              </h1>
              <span className="bg-amber-500 text-slate-950 font-mono text-xs font-bold px-2.5 py-0.5 rounded-md">
                SIH 2026 PS174
              </span>
            </div>
            <p className="text-sm text-cyan-400 font-mono mt-1">
              Astronaut Protocol Tracking & Validation System
            </p>
          </div>
        </div>

        <div className="bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800 font-mono text-xs text-right">
          <span className="text-slate-400 block text-[10px]">HACKATHON SPECIFICATION</span>
          <span className="font-bold text-amber-400">SIH26174</span>
        </div>
      </div>

      {/* Overview & Problem Statement */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4 font-sans">
        <h2 className="font-bold font-mono text-sm text-white border-b border-slate-800 pb-2 flex items-center space-x-2">
          <Info size={18} className="text-amber-400" />
          <span>PROBLEM CONCEPT & RESEARCH OBJECTIVE</span>
        </h2>

        <p className="text-xs text-slate-300 leading-relaxed font-mono">
          In human spaceflight microgravity environments, astronauts perform complex scientific payloads under intense cognitive workloads. Manual checklist verification increases time overhead and introduces human error risks. ASTRA-PVT solves this challenge by delivering an <strong className="text-cyan-400">On-Device Edge AI system</strong> that watches payload rack activities, tracks experiment step sequences, and provides immediate vocal and visual feedback when procedural deviations occur.
        </p>

        {/* 11 Core Capabilities */}
        <h3 className="font-bold font-mono text-xs text-white pt-2 flex items-center space-x-2">
          <Zap size={14} className="text-cyan-400" />
          <span>ELEVEN CORE CAPABILITIES DEMONSTRATED IN THIS PROTOTYPE:</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
          {[
            "1. Real-Time Object Detection (YOLOv8)",
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
            <div key={idx} className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center space-x-2.5">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span className="text-slate-200 font-semibold">{cap}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Institutional Disclaimer */}
      <div className="glass-card bg-slate-950/90 text-white p-6 rounded-2xl border-l-4 border-amber-400 border-t border-r border-b border-slate-800 space-y-2 font-mono text-xs">
        <div className="flex items-center space-x-2 text-amber-400 font-bold">
          <ShieldAlert size={18} />
          <span>RESEARCH PROTOTYPE DISCLAIMER</span>
        </div>
        <p className="text-slate-300 leading-relaxed font-sans text-xs">
          "Interface designed as an experimental mission-control research prototype for Smart India Hackathon 2026 (Problem Statement PS174 / SIH26174) and does not represent an official ISRO operational system or product."
        </p>
      </div>
    </div>
  );
};
