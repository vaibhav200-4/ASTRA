import React from 'react';
import { ShieldAlert, Cpu, ArrowRight, CheckCircle2, Layers, ShieldCheck, Database, GitBranch } from 'lucide-react';

export const ArchitecturePage: React.FC = () => {
  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="bg-[#071B33] text-white p-6 rounded-lg shadow-md border border-navy-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-saffron-400 font-mono text-xs font-bold mb-1">
            <ShieldAlert size={16} />
            <span>ENGINEERING SPECIFICATION</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold font-mono tracking-tight text-white">
            SYSTEM ARCHITECTURE & PIPELINE DESIGN
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            End-to-end multi-modal computer vision and deterministic sequence validation pipeline.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 font-mono text-xs">
          <span className="bg-emerald-950 border border-emerald-500 text-emerald-400 px-2.5 py-1 rounded font-bold">
            NO CLOUD
          </span>
          <span className="bg-blue-950 border border-blue-500 text-blue-400 px-2.5 py-1 rounded font-bold">
            NO INTERNET
          </span>
          <span className="bg-saffron-950 border border-saffron-500 text-saffron-400 px-2.5 py-1 rounded font-bold">
            ON-DEVICE PROCESSING
          </span>
        </div>
      </div>

      {/* 1. ENGINEERING ARCHITECTURE DIAGRAM FLOWCHART */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4 font-mono text-xs">
        <h2 className="font-bold text-sm text-navy-900 border-b pb-2 flex items-center justify-between">
          <span>END-TO-END SYSTEM PIPELINE</span>
          <span className="text-saffron-600 font-bold">TOTAL PIPELINE LATENCY: 36 MS</span>
        </h2>

        {/* Outer Edge Device Boundary */}
        <div className="p-5 bg-space-bg rounded-lg border-2 border-dashed border-navy-700 space-y-4 relative">
          <div className="absolute top-2 right-3 bg-navy-900 text-saffron-400 font-bold text-[10px] px-2 py-0.5 rounded border border-navy-700">
            EDGE DEVICE BOUNDARY (NVIDIA JETSON XAVIER NX)
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-4">
            {/* Input Node */}
            <div className="p-3 bg-navy-900 text-white rounded border border-navy-700 space-y-1">
              <span className="text-saffron-400 font-bold text-[10px] block">01. CAPTURE</span>
              <span className="font-bold text-xs">FIXED RGB CAMERAS</span>
              <span className="text-[10px] text-slate-400 block">1920x1080 @ 30 FPS Frame Sync</span>
            </div>

            {/* Parallel Branches Node */}
            <div className="md:col-span-2 p-3 bg-blue-950 text-white rounded border-2 border-blue-500 space-y-2">
              <span className="text-blue-400 font-bold text-[10px] block">02. PARALLEL AI INFERENCE BRANCHES</span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 bg-navy-900 rounded border border-blue-700">
                  <span className="text-emerald-400 font-bold block">OBJECT DETECTION</span>
                  <span className="text-slate-300 text-[10px]">YOLOv8-Nano (12 ms)</span>
                </div>
                <div className="p-2 bg-navy-900 rounded border border-blue-700">
                  <span className="text-emerald-400 font-bold block">2D / 3D POSE</span>
                  <span className="text-slate-300 text-[10px]">MediaPipe 33 Joint (8 ms)</span>
                </div>
              </div>
            </div>

            {/* HOI Node */}
            <div className="p-3 bg-navy-900 text-white rounded border border-navy-700 space-y-1">
              <span className="text-saffron-400 font-bold text-[10px] block">03. INTERACTION</span>
              <span className="font-bold text-xs">HOI ANALYSIS</span>
              <span className="text-[10px] text-slate-400 block">Geometric Contact Mesh (3 ms)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* HAR Node */}
            <div className="p-3 bg-navy-900 text-white rounded border border-navy-700 space-y-1">
              <span className="text-saffron-400 font-bold text-[10px] block">04. ACTIVITY</span>
              <span className="font-bold text-xs">TEMPORAL HAR</span>
              <span className="text-[10px] text-slate-400 block">LSTM / ST-GCN Window (7 ms)</span>
            </div>

            {/* FSM Validator Node */}
            <div className="p-3 bg-saffron-950 text-white rounded border-2 border-saffron-500 space-y-1">
              <span className="text-saffron-400 font-bold text-[10px] block">05. VALIDATION</span>
              <span className="font-bold text-xs text-saffron-300">SEQUENCE VALIDATOR</span>
              <span className="text-[10px] text-slate-300 block">Finite State Machine (1 ms)</span>
            </div>

            {/* Multi-modal Outputs Node */}
            <div className="p-3 bg-emerald-950 text-white rounded border border-emerald-600 space-y-1">
              <span className="text-emerald-400 font-bold text-[10px] block">06. OUTPUTS</span>
              <span className="font-bold text-xs">CREW FEEDBACK</span>
              <span className="text-[10px] text-slate-300 block">Voice Alert | GUI | JSON | H.264</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MODEL STACK COMPARISON (MVP vs FUTURE UPGRADE) */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4 font-mono text-xs">
        <h2 className="font-bold text-sm text-navy-900 border-b pb-2">
          TECHNICAL MODEL STACK SPECIFICATION
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#071B33] text-white border-b border-navy-800">
                <th className="p-3">MODULE LAYER</th>
                <th className="p-3">MVP IMPLEMENTATION</th>
                <th className="p-3">FUTURE UPGRADE ROADMAP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="p-3 font-bold text-navy-900">OBJECT DETECTION</td>
                <td className="p-3 text-emerald-700 font-bold">YOLOv8-Nano (ONNX / TensorRT)</td>
                <td className="p-3 text-slate-600">YOLOv10 / RT-DETR quantized</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-navy-900">2D / 3D POSE ESTIMATION</td>
                <td className="p-3 text-emerald-700 font-bold">MediaPipe Pose (33 keypoints)</td>
                <td className="p-3 text-slate-600">VideoPose3D / Lightweight 3D Mesh</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-navy-900">HAND-OBJECT INTERACTION (HOI)</td>
                <td className="p-3 text-emerald-700 font-bold">Rule-Based BBox Geometry & Contact Vectors</td>
                <td className="p-3 text-slate-600">Learned HOI Transformer (Hotr / QPIC)</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-navy-900">TEMPORAL HAR</td>
                <td className="p-3 text-emerald-700 font-bold">Sliding-Window Skeleton Feature Classifier</td>
                <td className="p-3 text-slate-600">ST-GCN (Spatial-Temporal Graph Convolutional)</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-navy-900">SEQUENCE VALIDATION</td>
                <td className="p-3 text-saffron-600 font-bold">Deterministic Finite State Machine (FSM)</td>
                <td className="p-3 text-slate-600">Probabilistic HMM / Transformer Validator</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. TECHNICAL ROADMAP & DATASET PIPELINE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
        {/* 3-Phase Technical Roadmap */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold font-mono text-sm text-navy-900 border-b pb-2 flex items-center space-x-2">
            <GitBranch size={16} className="text-saffron-500" />
            <span>3-PHASE TECHNICAL ROADMAP</span>
          </h3>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 bg-emerald-50 rounded border border-emerald-200">
              <span className="font-bold text-emerald-900 block">PHASE 1 — MVP (CURRENT HACKATHON)</span>
              <p className="text-slate-600 font-sans text-xs mt-1">
                YOLOv8, MediaPipe, Rule-based HOI geometry, FSM validator on NVIDIA Jetson Xavier NX.
              </p>
            </div>

            <div className="p-3 bg-blue-50 rounded border border-blue-200">
              <span className="font-bold text-blue-900 block">PHASE 2 — ADVANCED HAR & LEARNED HOI</span>
              <p className="text-slate-600 font-sans text-xs mt-1">
                ST-GCN temporal Graph Convolutional Networks, learned HOI attention matrices.
              </p>
            </div>

            <div className="p-3 bg-purple-50 rounded border border-purple-200">
              <span className="font-bold text-purple-900 block">PHASE 3 — RACK-RELATIVE 3D & TRANSFORMERS</span>
              <p className="text-slate-600 font-sans text-xs mt-1">
                Full 3D Rack mesh registration, HMM / Transformer sequence validation where justified.
              </p>
            </div>
          </div>
        </div>

        {/* Dataset Pipeline */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold font-mono text-sm text-navy-900 border-b pb-2 flex items-center space-x-2">
            <Database size={16} className="text-saffron-500" />
            <span>MICROGRAVITY DATASET & ANNOTATION PIPELINE</span>
          </h3>

          <p className="text-xs text-slate-600 font-sans">
            Specialized microgravity annotation pipeline capturing multiple body sizes, orientations (Upright, Tilted, Inverted), hand keypoints, and skipped step anomalies.
          </p>

          <div className="bg-[#071B33] text-white p-3 rounded font-mono text-[11px] space-y-2">
            <div className="flex items-center justify-between text-saffron-400 font-bold border-b border-navy-800 pb-1">
              <span>ANNOTATION PIPELINE FLOW</span>
            </div>
            <p className="text-slate-300">
              VIDEO RECORDING → AUTOMATED ANNOTATION → OBJECT BOUNDING BOXES → 33 SKELETON POSE JOINTS → HOI CONTACT MESH → STEP TRANSITION LABELS → TRAIN & VALIDATE
            </p>
          </div>
        </div>
      </div>

      {/* 4. ERROR & SAFETY PHILOSOPHY */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4 font-sans">
        <h3 className="font-bold font-mono text-sm text-navy-900 border-b pb-2">
          ERROR & SAFETY PHILOSOPHY: AI DETECTION ≠ PROTOCOL VALIDATION
        </h3>

        <div className="bg-space-bg p-4 rounded border border-slate-200 font-mono text-xs space-y-3">
          <div className="flex items-center justify-between font-bold text-navy-900">
            <span>DECISION CONTROL MATRIX</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-emerald-100 text-emerald-900 rounded border border-emerald-300">
              <span className="font-bold block text-sm">HIGH CONFIDENCE</span>
              <span className="text-[10px] block mt-1">+ Correct Sequence</span>
              <span className="bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 rounded mt-2 inline-block">
                ADVANCE FSM
              </span>
            </div>

            <div className="p-3 bg-amber-100 text-amber-900 rounded border border-amber-300">
              <span className="font-bold block text-sm">LOW CONFIDENCE</span>
              <span className="text-[10px] block mt-1">Below 85% threshold</span>
              <span className="bg-amber-600 text-white font-bold text-[10px] px-2 py-0.5 rounded mt-2 inline-block">
                WAIT & VERIFY
              </span>
            </div>

            <div className="p-3 bg-red-100 text-red-900 rounded border border-red-300">
              <span className="font-bold block text-sm">WRONG SEQUENCE</span>
              <span className="text-[10px] block mt-1">Rule Violation</span>
              <span className="bg-red-600 text-white font-bold text-[10px] px-2 py-0.5 rounded mt-2 inline-block">
                VOICE ALERT & LOCK
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
