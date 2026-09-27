import React from 'react';
import { ShieldAlert, Cpu, ArrowRight, CheckCircle2, Layers, ShieldCheck, Database, GitBranch, Zap } from 'lucide-react';

export const ArchitecturePage: React.FC = () => {
  return (
    <div className="space-y-5 font-sans">
      {/* Header */}
      <div className="glass-card bg-gradient-to-r from-slate-900 to-[#0d162a] text-white p-5 rounded-2xl shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold mb-1">
            <ShieldAlert size={16} />
            <span>ENGINEERING SPECIFICATION</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold font-mono tracking-tight text-white">
            SYSTEM ARCHITECTURE & PIPELINE DESIGN
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            End-to-end multi-modal computer vision and deterministic sequence validation pipeline.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 font-mono text-xs">
          <span className="bg-emerald-950/80 border border-emerald-500 text-emerald-400 px-3 py-1 rounded-lg font-bold">
            NO CLOUD
          </span>
          <span className="bg-cyan-950/80 border border-cyan-500 text-cyan-400 px-3 py-1 rounded-lg font-bold">
            NO INTERNET
          </span>
          <span className="bg-amber-950/80 border border-amber-500 text-amber-400 px-3 py-1 rounded-lg font-bold">
            ON-DEVICE PROCESSING
          </span>
        </div>
      </div>

      {/* 1. ENGINEERING ARCHITECTURE DIAGRAM FLOWCHART */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4 font-mono text-xs">
        <h2 className="font-bold text-sm text-white border-b border-slate-800 pb-2 flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <Zap size={14} className="text-cyan-400" />
            <span>END-TO-END SYSTEM PIPELINE</span>
          </span>
          <span className="text-amber-400 font-bold">TOTAL LATENCY: 36 MS</span>
        </h2>

        {/* Outer Edge Device Boundary */}
        <div className="p-5 bg-slate-950/80 rounded-xl border-2 border-dashed border-slate-700 space-y-4 relative">
          <div className="absolute top-2 right-3 bg-slate-900 text-amber-400 font-bold text-[10px] px-2.5 py-0.5 rounded-md border border-slate-700">
            EDGE DEVICE BOUNDARY (NVIDIA JETSON XAVIER NX)
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-4">
            {/* Input Node */}
            <div className="p-3 bg-slate-900 text-white rounded-xl border border-slate-800 space-y-1">
              <span className="text-amber-400 font-bold text-[10px] block">01. CAPTURE</span>
              <span className="font-bold text-xs">FIXED RGB CAMERAS</span>
              <span className="text-[10px] text-slate-400 block">1920x1080 @ 30 FPS Frame Sync</span>
            </div>

            {/* Parallel Branches Node */}
            <div className="md:col-span-2 p-3 bg-cyan-950/40 text-white rounded-xl border-2 border-cyan-500/80 space-y-2">
              <span className="text-cyan-400 font-bold text-[10px] block">02. PARALLEL AI INFERENCE BRANCHES</span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 bg-slate-900 rounded-lg border border-cyan-800">
                  <span className="text-emerald-400 font-bold block">OBJECT DETECTION</span>
                  <span className="text-slate-300 text-[10px]">YOLOv8-Nano (12 ms)</span>
                </div>
                <div className="p-2 bg-slate-900 rounded-lg border border-cyan-800">
                  <span className="text-emerald-400 font-bold block">2D / 3D POSE</span>
                  <span className="text-slate-300 text-[10px]">MediaPipe 33 Joint (8 ms)</span>
                </div>
              </div>
            </div>

            {/* HOI Node */}
            <div className="p-3 bg-slate-900 text-white rounded-xl border border-slate-800 space-y-1">
              <span className="text-amber-400 font-bold text-[10px] block">03. INTERACTION</span>
              <span className="font-bold text-xs">HOI ANALYSIS</span>
              <span className="text-[10px] text-slate-400 block">Geometric Contact Mesh (3 ms)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* HAR Node */}
            <div className="p-3 bg-slate-900 text-white rounded-xl border border-slate-800 space-y-1">
              <span className="text-amber-400 font-bold text-[10px] block">04. ACTIVITY</span>
              <span className="font-bold text-xs">TEMPORAL HAR</span>
              <span className="text-[10px] text-slate-400 block">LSTM / ST-GCN Window (7 ms)</span>
            </div>

            {/* FSM Validator Node */}
            <div className="p-3 bg-amber-950/60 text-white rounded-xl border-2 border-amber-500 space-y-1">
              <span className="text-amber-400 font-bold text-[10px] block">05. VALIDATION</span>
              <span className="font-bold text-xs text-amber-300">SEQUENCE VALIDATOR</span>
              <span className="text-[10px] text-slate-300 block">Finite State Machine (1 ms)</span>
            </div>

            {/* Multi-modal Outputs Node */}
            <div className="p-3 bg-emerald-950/60 text-white rounded-xl border border-emerald-700 space-y-1">
              <span className="text-emerald-400 font-bold text-[10px] block">06. OUTPUTS</span>
              <span className="font-bold text-xs">CREW FEEDBACK</span>
              <span className="text-[10px] text-slate-300 block">Voice Alert | GUI | JSON | H.264</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MODEL STACK COMPARISON */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4 font-mono text-xs">
        <h2 className="font-bold text-sm text-white border-b border-slate-800 pb-2">
          TECHNICAL MODEL STACK SPECIFICATION
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-300 border-b border-slate-800">
                <th className="p-3">MODULE LAYER</th>
                <th className="p-3">MVP IMPLEMENTATION</th>
                <th className="p-3">FUTURE UPGRADE ROADMAP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr>
                <td className="p-3 font-bold text-white">OBJECT DETECTION</td>
                <td className="p-3 text-emerald-400 font-bold">YOLOv8-Nano (ONNX / TensorRT)</td>
                <td className="p-3 text-slate-400">YOLOv10 / RT-DETR quantized</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-white">2D / 3D POSE ESTIMATION</td>
                <td className="p-3 text-emerald-400 font-bold">MediaPipe Pose (33 keypoints)</td>
                <td className="p-3 text-slate-400">VideoPose3D / Lightweight 3D Mesh</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-white">HAND-OBJECT INTERACTION (HOI)</td>
                <td className="p-3 text-emerald-400 font-bold">Rule-Based BBox Geometry & Contact Vectors</td>
                <td className="p-3 text-slate-400">Learned HOI Transformer (Hotr / QPIC)</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-white">TEMPORAL HAR</td>
                <td className="p-3 text-emerald-400 font-bold">Sliding-Window Skeleton Feature Classifier</td>
                <td className="p-3 text-slate-400">ST-GCN (Spatial-Temporal Graph Convolutional)</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-white">SEQUENCE VALIDATION</td>
                <td className="p-3 text-amber-400 font-bold">Deterministic Finite State Machine (FSM)</td>
                <td className="p-3 text-slate-400">Probabilistic HMM / Transformer Validator</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. TECHNICAL ROADMAP & DATASET PIPELINE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-sans">
        {/* 3-Phase Technical Roadmap */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <h3 className="font-bold font-mono text-sm text-white border-b border-slate-800 pb-2 flex items-center space-x-2">
            <GitBranch size={16} className="text-amber-400" />
            <span>3-PHASE TECHNICAL ROADMAP</span>
          </h3>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-800/60">
              <span className="font-bold text-emerald-400 block">PHASE 1 — MVP (CURRENT)</span>
              <p className="text-slate-300 font-sans text-xs mt-1">
                YOLOv8, MediaPipe, Rule-based HOI geometry, FSM validator on NVIDIA Jetson Xavier NX.
              </p>
            </div>

            <div className="p-3 bg-cyan-950/40 rounded-xl border border-cyan-800/60">
              <span className="font-bold text-cyan-300 block">PHASE 2 — ADVANCED HAR & HOI</span>
              <p className="text-slate-300 font-sans text-xs mt-1">
                ST-GCN temporal Graph Convolutional Networks, learned HOI attention matrices.
              </p>
            </div>

            <div className="p-3 bg-purple-950/40 rounded-xl border border-purple-800/60">
              <span className="font-bold text-purple-300 block">PHASE 3 — RACK 3D MESH & TRANSFORMERS</span>
              <p className="text-slate-300 font-sans text-xs mt-1">
                Full 3D Rack mesh registration, HMM / Transformer sequence validation where justified.
              </p>
            </div>
          </div>
        </div>

        {/* Dataset Pipeline */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <h3 className="font-bold font-mono text-sm text-white border-b border-slate-800 pb-2 flex items-center space-x-2">
            <Database size={16} className="text-cyan-400" />
            <span>DATASET & ANNOTATION PIPELINE</span>
          </h3>

          <p className="text-xs text-slate-300 font-sans">
            Microgravity annotation pipeline capturing multiple body sizes, orientations (Upright, Tilted, Inverted), hand keypoints, and step anomalies.
          </p>

          <div className="bg-slate-950/90 text-white p-3.5 rounded-xl border border-slate-800 font-mono text-[11px] space-y-2">
            <div className="flex items-center justify-between text-amber-400 font-bold border-b border-slate-800 pb-1">
              <span>ANNOTATION PIPELINE FLOW</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              VIDEO RECORDING → AUTOMATED ANNOTATION → OBJECT BOUNDING BOXES → 33 SKELETON POSE JOINTS → HOI CONTACT MESH → STEP TRANSITION LABELS → TRAIN & VALIDATE
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
