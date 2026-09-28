import React from 'react';
import { Emblem } from '../components/Emblem';
import { ShieldAlert, CheckCircle2, Cpu, Info, Zap, ShieldCheck, Code, Server } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-4 font-sans">
      {/* Header Banner */}
      <div className="isro-card p-5 bg-slate-900 border-l-4 border-l-cyan-500 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center space-x-4">
          <Emblem size={56} />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-white">
                ASTRA-PVT
              </h1>
              <span className="bg-cyan-600 text-white font-mono text-xs font-bold px-2.5 py-0.5 rounded shadow-sm">
                ISRO &bull; Department of Space
              </span>
            </div>
            <p className="text-xs text-slate-300 font-mono mt-0.5">
              Astronaut Protocol Tracking &amp; Validation System (On-board BAS Experiments)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="bg-cyan-950 text-cyan-300 px-3 py-1 rounded border border-cyan-500/30 font-bold">
            SIH 2026 PS174 (SIH26174)
          </span>
        </div>
      </div>

      {/* Overview & Research Objective */}
      <div className="isro-card p-5 bg-slate-900 border border-slate-800 space-y-4">
        <h2 className="isro-section-title mb-0 text-xs font-mono text-slate-200">
          Research Objective & System Scope
        </h2>

        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          In human spaceflight microgravity environments, astronauts perform complex scientific experiment protocols under high cognitive workload. ASTRA-PVT delivers an offline space-grade AI assistant that watches payload rack activities, verifies physical state changes, validates experiment sequences using a deterministic finite state machine, and provides immediate local vocal and visual guidance.
        </p>

        <h3 className="isro-section-title mb-0 text-xs font-mono pt-2 text-slate-200">
          Demonstrated Engineering Subsystems & Capabilities:
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 font-mono text-xs">
          {[
            "1. YOLO26n Edge AI (NMS-free object detection)",
            "2. Rack-Relative 3D Pose ('No Fixed Up' Microgravity)",
            "3. 3-Way Causal State Verification",
            "4. Bayes-Factor Evidence Engine (Jeffreys Scale)",
            "5. Dempster-Shafer Fusion & Fault Isolation",
            "6. FSM Sequence Validation (Skipped / Out-of-Order)",
            "7. Thermal-Decoupled dt Continuity Filter",
            "8. Radiation Resilience (TMR Majority Voting)",
            "9. Cache-Aligned Lock-Free SPSC Ring Buffer",
            "10. Adaptive ROI Controller (78%+ Compute Saved)",
            "11. Spatial-Audio (HRTF Panner) & Local Speech Synthesis",
            "12. DO-178C / FDIR-Aligned Traceability Matrix"
          ].map((cap, idx) => (
            <div key={idx} className="p-2.5 bg-slate-950 rounded border border-slate-800 flex items-center space-x-2">
              <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
              <span className="text-slate-200 font-semibold">{cap}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ALGORITHM COMPARISON BREAKDOWN TABLE (HONEST SIMULATED VS FLIGHT TARGET) */}
      <div className="isro-card p-4 bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h2 className="isro-section-title mb-0 text-xs font-mono text-slate-200 flex items-center gap-2">
            <Code size={14} className="text-cyan-400" />
            Algorithm Implementation Breakdown (Simulated / Prototype vs Flight Target)
          </h2>
          <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
            Honest Architecture Breakdown
          </span>
        </div>

        <div className="overflow-x-auto rounded border border-slate-800">
          <table className="w-full text-left text-xs font-sans border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-300 border-b border-slate-800 font-mono">
                <th className="p-2.5 font-semibold">Subsystem Component</th>
                <th className="p-2.5 font-semibold text-cyan-400">Current Prototype Implementation</th>
                <th className="p-2.5 font-semibold text-emerald-400">Flight Target Implementation</th>
                <th className="p-2.5 font-semibold text-amber-400">Deployment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono text-xs">
              {[
                { module: "Visual Object Detector", prototype: "Simulated YOLO26n BBox Inference", flight: "TensorRT C++ YOLO26n ONNX Engine", status: "Target / Simulated" },
                { module: "Offline Auto-Annotation", prototype: "RF-DETR (Offline only)", flight: "Offline ground workstation pipeline only", status: "Offline Only (Not Deployed Onboard)" },
                { module: "3D Rack Pose Estimator", prototype: "ArUco Rigid Transformation J_rack", flight: "6-DoF Kalman-filtered ArUco PnP Engine", status: "Target / Simulated" },
                { module: "Sequence Validator", prototype: "Deterministic Ground Truth FSM", flight: "Formal Verified C++ FSM Validator", status: "Implemented in Prototype" },
                { module: "Bayesian Evidence", prototype: "Jeffreys Scale Bayes Factor K", flight: "Log-likelihood ratio Bayesian updater", status: "Implemented in Prototype" },
                { module: "Memory Resilience", prototype: "3-Copy SRAM TMR Voting", flight: "ECC SRAM + Microcontroller TMR Scrub", status: "Target / Simulated" },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/50">
                  <td className="p-2.5 font-bold text-white">{row.module}</td>
                  <td className="p-2.5 text-cyan-300">{row.prototype}</td>
                  <td className="p-2.5 text-emerald-300">{row.flight}</td>
                  <td className="p-2.5 text-amber-400 font-bold">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Institutional Disclaimer */}
      <div className="isro-card p-4 bg-slate-900 border-l-4 border-l-amber-500 space-y-1.5 text-xs">
        <div className="flex items-center space-x-2 text-white font-bold">
          <ShieldAlert size={16} className="text-amber-400" />
          <span>RESEARCH PROTOTYPE DISCLAIMER & STATEMENT OF COMPLIANCE</span>
        </div>
        <p className="text-slate-300 leading-relaxed font-sans text-xs">
          "Interface designed as an experimental mission-control research prototype for Smart India Hackathon 2026 (Problem Statement PS174 / SIH26174) and does not represent an official ISRO operational system or product. DO-178C-aligned traceability is maintained for engineering rigor and does not constitute a formal flight certification claim."
        </p>
      </div>
    </div>
  );
};
