import React from 'react';
import { useMission } from '../context/MissionContext';
import { ShieldAlert, Cpu, CheckCircle2, Layers, ShieldCheck, Database, GitBranch, Zap, FileText, ArrowRight, Server, Eye } from 'lucide-react';

export const ArchitecturePage: React.FC = () => {
  const { traceabilityMatrix, language } = useMission();

  return (
    <div className="space-y-4 font-sans">
      {/* Header Banner */}
      <div className="isro-card p-4 bg-slate-900 border-l-4 border-l-cyan-500 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-lg">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-semibold mb-0.5">
            <ShieldAlert size={14} />
            <span>PART K — SYSTEM ARCHITECTURE & TRACEABILITY</span>
          </div>
          <h1 className="text-lg font-bold text-white">
            System Architecture & DO-178C / FDIR Traceability Matrix
          </h1>
          <p className="text-xs text-slate-300">
            End-to-end multi-modal computer vision and deterministic sequence validation pipeline. Strictly 100% offline edge execution.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-mono">
          <span className="bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded border border-emerald-500/30 font-semibold">
            100% OFFLINE (NO CDN / CLOUD)
          </span>
          <span className="bg-cyan-500/10 text-cyan-300 px-2.5 py-1 rounded border border-cyan-500/30 font-semibold">
            JETSON-CLASS EDGE EMBEDDED
          </span>
        </div>
      </div>

      {/* Mandatory Architecture Note regarding RF-DETR and YOLO26n */}
      <div className="isro-card p-3.5 bg-slate-900 border border-slate-800 text-xs font-mono space-y-1.5">
        <span className="font-bold text-cyan-300 block flex items-center gap-2">
          <Cpu size={14} className="text-amber-400" />
          SYSTEM SPECIFICATION NOTE: Deployable Model Stack (ISRO PS174)
        </span>
        <p className="text-slate-300">
          On-board edge deployment utilizes <strong className="text-cyan-300">YOLO26n (edge, NMS-free)</strong> for zero-latency bounding box inference and keypoint detection. <strong className="text-amber-400">RF-DETR is used offline for auto-annotation only; not deployed on board.</strong>
        </p>
      </div>

      {/* INTERACTIVE CONNECTED BLOCK DIAGRAM */}
      <div className="isro-card p-4 bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h2 className="isro-section-title mb-0 text-xs font-mono text-slate-200">
            End-to-End Edge Pipeline Architecture Block Diagram
          </h2>
          <span className="text-[11px] font-mono text-slate-400">
            Modular Hardware-Decoupled Dataflow
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-2 pt-1 font-mono text-xs">
          {[
            { id: "01", title: "CAMERA INPUT", desc: "Dual 1080p @ 24fps RTSP / USB Local", color: "border-cyan-500/40 bg-cyan-950/20 text-cyan-300", icon: Eye },
            { id: "02", title: "PREPROCESS & ROI", desc: "Dynamic BBox Crop & dt Kalman Filter", color: "border-purple-500/40 bg-purple-950/20 text-purple-300", icon: Layers },
            { id: "03", title: "YOLO26n PERCEPTION", desc: "NMS-free Edge Detection & Pose Projection", color: "border-amber-500/40 bg-amber-950/20 text-amber-300", icon: Cpu },
            { id: "04", title: "CAUSAL & FSM VERIFIER", desc: "Bayes K Factor + Dempster-Shafer Fusion", color: "border-emerald-500/40 bg-emerald-950/20 text-emerald-300", icon: ShieldCheck },
            { id: "05", title: "TMR MEMORY SCRUB", desc: "3-Copy SRAM Majority Vote & Ring Buffer", color: "border-blue-500/40 bg-blue-950/20 text-blue-300", icon: Server },
            { id: "06", title: "MISSION CONSOLE", desc: "Offline UI Telemetry & Crew Alerts", color: "border-cyan-400 bg-cyan-900/40 text-white font-bold", icon: FileText },
          ].map((block, idx) => {
            const IconComp = block.icon;
            return (
              <div key={block.id} className={`p-3 rounded border ${block.color} space-y-1 relative flex flex-col justify-between`}>
                <div>
                  <div className="flex items-center justify-between text-[10px] opacity-80 mb-1">
                    <span>STEP #{block.id}</span>
                    <IconComp size={14} />
                  </div>
                  <h4 className="font-bold text-xs">{block.title}</h4>
                  <p className="text-[10px] font-sans opacity-90 leading-tight mt-1">{block.desc}</p>
                </div>

                {idx < 5 && (
                  <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight size={14} className="text-slate-400 bg-slate-900 rounded-full" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* PART K: DO-178C / FDIR TRACEABILITY MATRIX TABLE */}
      <div className="isro-card p-4 bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h2 className="isro-section-title mb-0 text-xs font-mono text-slate-200">
            DO-178C / FDIR-aligned Traceability Matrix (not a certification claim)
          </h2>
          <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
            DO-178C Traceability Aligned
          </span>
        </div>

        <div className="overflow-x-auto rounded border border-slate-800">
          <table className="w-full text-left text-xs font-sans border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-300 border-b border-slate-800 font-mono">
                <th className="p-2.5 font-semibold">ID</th>
                <th className="p-2.5 font-semibold">Function</th>
                <th className="p-2.5 font-semibold text-red-400">Identified Hazard</th>
                <th className="p-2.5 font-semibold text-cyan-300">FDIR Mitigation Strategy</th>
                <th className="p-2.5 font-semibold">Test Case Reference</th>
                <th className="p-2.5 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs">
              {traceabilityMatrix.map(row => (
                <tr key={row.id} className="hover:bg-slate-800/50">
                  <td className="p-2.5 font-mono font-bold text-white">{row.id}</td>
                  <td className="p-2.5 font-semibold text-cyan-300">{row.functionName}</td>
                  <td className="p-2.5 text-slate-300">{row.hazard}</td>
                  <td className="p-2.5 text-slate-200 font-medium">{row.mitigation}</td>
                  <td className="p-2.5 font-mono text-[11px] text-amber-400">{row.testCase}</td>
                  <td className="p-2.5 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
