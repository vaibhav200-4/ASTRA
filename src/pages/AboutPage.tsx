import React from 'react';
import { Emblem } from '../components/Emblem';
import { ShieldAlert, CheckCircle2, Cpu, Info, Zap } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-4 font-sans">
      {/* Header Banner */}
      <div className="isro-card p-5 bg-white dark:bg-[#0A1A33] border-l-4 border-l-[#123F8C] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Emblem size={56} />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-[#0B2A5B] dark:text-white">
                ASTRA-PVT
              </h1>
              <span className="bg-[#123F8C] text-white font-mono text-xs font-bold px-2 py-0.5 rounded">
                ISRO • Department of Space
              </span>
            </div>
            <p className="text-xs text-[#5B6675] dark:text-slate-300 font-mono mt-0.5">
              Astronaut Protocol Tracking & Validation System (On-board BAS Experiments)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="bg-[#EEF3FA] dark:bg-slate-800 text-[#123F8C] dark:text-cyan-300 px-3 py-1 rounded border border-[#D5DCE6] dark:border-slate-700">
            SIH 2026 PS174 (SIH26174)
          </span>
        </div>
      </div>

      {/* Overview & Research Objective */}
      <div className="isro-card p-5 bg-white dark:bg-[#0A1A33] space-y-3">
        <h2 className="isro-section-title mb-0 text-xs font-mono">
          Research Objective & System Scope
        </h2>

        <p className="text-xs text-[#5B6675] dark:text-slate-300 leading-relaxed font-sans">
          In human spaceflight microgravity environments, astronauts perform complex scientific experiment protocols under high workload. ASTRA-PVT delivers an offline space-grade AI assistant that watches payload rack activities, verifies physical state changes, validates experiment sequences using a deterministic finite state machine, and provides immediate local vocal and visual guidance.
        </p>

        <h3 className="isro-section-title mb-0 text-xs font-mono pt-2">
          Demonstrated Engineering Capabilities:
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 font-mono text-xs">
          {[
            "1. YOLO26n Edge AI (NMS-free object detection)",
            "2. Rack-Relative 3D Pose ('No Fixed Up' Microgravity)",
            "3. 3-Way Causal State Verification",
            "4. Bayes-Factor Hypothesis Evidence Engine (Jeffreys Scale)",
            "5. Dempster-Shafer Fusion & Fault Isolation",
            "6. FSM Sequence Validation (Skipped / Out-of-Order)",
            "7. Thermal-Decoupled dt Continuity Filter",
            "8. Radiation Resilience (TMR Majority Voting)",
            "9. Cache-Aligned Lock-Free SPSC Ring Buffer",
            "10. Adaptive ROI Controller (70%+ Compute Saved)",
            "11. Spatial-Audio (HRTF Panner) & On-Device TTS",
            "12. DO-178C / FDIR-Aligned Traceability Matrix"
          ].map((cap, idx) => (
            <div key={idx} className="p-2.5 bg-[#F5F7FA] dark:bg-slate-900 rounded border border-[#D5DCE6] dark:border-slate-800 flex items-center space-x-2">
              <CheckCircle2 size={15} className="text-[#138808] shrink-0" />
              <span className="text-[#0B2A5B] dark:text-slate-200 font-semibold">{cap}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Institutional Disclaimer */}
      <div className="isro-card p-4 bg-[#EEF3FA] dark:bg-slate-900 border-l-4 border-l-[#F26B21] space-y-1.5 text-xs">
        <div className="flex items-center space-x-2 text-[#0B2A5B] dark:text-white font-bold">
          <ShieldAlert size={16} className="text-[#F26B21]" />
          <span>RESEARCH PROTOTYPE DISCLAIMER</span>
        </div>
        <p className="text-[#5B6675] dark:text-slate-300 leading-relaxed font-sans text-xs">
          "Interface designed as an experimental mission-control research prototype for Smart India Hackathon 2026 (Problem Statement PS174 / SIH26174) and does not represent an official ISRO operational system or product. DO-178C-aligned traceability is maintained for engineering rigor and does not constitute a formal flight certification claim."
        </p>
      </div>
    </div>
  );
};
