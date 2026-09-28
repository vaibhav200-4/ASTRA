import React from 'react';
import { useMission } from '../context/MissionContext';
import { ShieldAlert, Cpu, CheckCircle2, Layers, ShieldCheck, Database, GitBranch, Zap, FileText } from 'lucide-react';

export const ArchitecturePage: React.FC = () => {
  const { traceabilityMatrix, language } = useMission();

  return (
    <div className="space-y-4 font-sans">
      {/* Header Banner */}
      <div className="isro-card p-4 bg-white dark:bg-[#0A1A33] border-l-4 border-l-[#123F8C] flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 text-[#123F8C] dark:text-cyan-400 font-mono text-xs font-semibold mb-0.5">
            <ShieldAlert size={14} />
            <span>PART K — SYSTEM ARCHITECTURE & TRACEABILITY</span>
          </div>
          <h1 className="text-lg font-bold text-[#0B2A5B] dark:text-white">
            System Architecture & DO-178C / FDIR Traceability Matrix
          </h1>
          <p className="text-xs text-[#5B6675] dark:text-slate-300">
            End-to-end multi-modal computer vision and deterministic sequence validation pipeline. Strictly local offline.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-mono">
          <span className="bg-[#EEF3FA] dark:bg-slate-800 text-[#123F8C] dark:text-cyan-300 px-2.5 py-1 rounded border border-[#D5DCE6] dark:border-slate-700 font-semibold">
            NO CLOUD / OFFLINE
          </span>
          <span className="bg-[#EEF3FA] dark:bg-slate-800 text-[#123F8C] dark:text-cyan-300 px-2.5 py-1 rounded border border-[#D5DCE6] dark:border-slate-700 font-semibold">
            JETSON-CLASS EDGE PLATFORM
          </span>
        </div>
      </div>

      {/* Mandatory Architecture Note */}
      <div className="isro-card p-3.5 bg-[#EEF3FA] dark:bg-slate-900 border border-[#D5DCE6] dark:border-slate-800 text-xs font-mono space-y-1">
        <span className="font-bold text-[#0B2A5B] dark:text-cyan-300 block">
          ARCHITECTURE NOTE: Edge Deployable Model Stack
        </span>
        <p className="text-[#5B6675] dark:text-slate-300">
          On-board edge deployment utilizes <strong className="text-[#123F8C] dark:text-cyan-300">YOLO26n (edge, NMS-free)</strong> for zero-latency bounding box inference. <strong className="text-[#F26B21]">RF-DETR is used offline for auto-annotation only; not deployed on board.</strong>
        </p>
      </div>

      {/* PART K: TRACEABILITY MATRIX TABLE */}
      <div className="isro-card p-4 bg-white dark:bg-[#0A1A33] space-y-3">
        <div className="flex items-center justify-between border-b border-[#EEF3FA] dark:border-slate-800 pb-2">
          <h2 className="isro-section-title mb-0 text-xs font-mono">
            DO-178C / FDIR-aligned Traceability Matrix (not a certification claim)
          </h2>
          <span className="text-xs font-mono text-[#138808] font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-300">
            DO-178C Aligned Traceability
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans border-collapse">
            <thead>
              <tr className="bg-[#EEF3FA] dark:bg-slate-900 text-[#0B2A5B] dark:text-slate-200 border-b border-[#D5DCE6] dark:border-slate-800">
                <th className="p-2.5 font-semibold font-mono">ID</th>
                <th className="p-2.5 font-semibold">Function</th>
                <th className="p-2.5 font-semibold text-[#C62828]">Identified Hazard</th>
                <th className="p-2.5 font-semibold text-[#123F8C] dark:text-cyan-300">FDIR Mitigation</th>
                <th className="p-2.5 font-semibold font-mono">Test Case</th>
                <th className="p-2.5 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF3FA] dark:divide-slate-800 text-xs">
              {traceabilityMatrix.map(row => (
                <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-2.5 font-mono font-bold text-[#0B2A5B] dark:text-slate-200">{row.id}</td>
                  <td className="p-2.5 font-semibold text-[#0B2A5B] dark:text-slate-200">{row.functionName}</td>
                  <td className="p-2.5 text-[#5B6675] dark:text-slate-300">{row.hazard}</td>
                  <td className="p-2.5 text-[#123F8C] dark:text-slate-200 font-medium">{row.mitigation}</td>
                  <td className="p-2.5 font-mono text-[11px] text-[#5B6675] dark:text-slate-400">{row.testCase}</td>
                  <td className="p-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-50 text-[#138808] dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* END-TO-END PIPELINE DIAGRAM */}
      <div className="isro-card p-4 bg-white dark:bg-[#0A1A33] space-y-3">
        <h2 className="isro-section-title mb-0 text-xs font-mono">
          End-to-End System Pipeline Design
        </h2>

        <div className="p-4 bg-[#F5F7FA] dark:bg-slate-900 rounded border border-[#D5DCE6] dark:border-slate-800 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-xs font-mono">
            <div className="p-2.5 bg-white dark:bg-slate-950 rounded border border-[#D5DCE6] dark:border-slate-800">
              <span className="text-[10px] text-[#F26B21] font-bold block">01. CAPTURE</span>
              <span className="font-bold text-[#0B2A5B] dark:text-white">Fixed Rack Cameras</span>
              <span className="text-[10px] text-[#5B6675] block">1080p @ 24fps local stream</span>
            </div>

            <div className="md:col-span-2 p-2.5 bg-[#EEF3FA] dark:bg-slate-950 rounded border border-[#123F8C] space-y-1">
              <span className="text-[10px] text-[#123F8C] dark:text-cyan-300 font-bold block">02. ON-DEVICE INFERENCE</span>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="p-1.5 bg-white dark:bg-slate-900 rounded border border-[#D5DCE6]">
                  <span className="font-bold text-[#138808] block">DETECTOR</span>
                  <span>YOLO26n (edge, NMS-free)</span>
                </div>
                <div className="p-1.5 bg-white dark:bg-slate-900 rounded border border-[#D5DCE6]">
                  <span className="font-bold text-[#138808] block">3D POSE</span>
                  <span>Rack Frame Transformed Pose</span>
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-white dark:bg-slate-950 rounded border border-[#D5DCE6] dark:border-slate-800">
              <span className="text-[10px] text-[#F26B21] font-bold block">03. VERIFY & FUSE</span>
              <span className="font-bold text-[#0B2A5B] dark:text-white">Causal & Dempster-Shafer</span>
              <span className="text-[10px] text-[#5B6675] block">3-way evidence pass</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
