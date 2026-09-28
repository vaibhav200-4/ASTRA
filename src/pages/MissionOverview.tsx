import React, { useState } from 'react';
import { useMission } from '../context/MissionContext';
import { CameraCanvas } from '../components/CameraCanvas';
import { AstronautViewer } from '../components/AstronautViewer';
import { PipelineStrip } from '../components/PipelineStrip';
import { 
  Play, ShieldAlert, Cpu, Activity, ArrowRight, ShieldCheck, 
  CheckCircle2, Zap, Target, UserCheck, Hand, RefreshCw, Radio,
  WifiOff, Layers, Check, Clock, Box, Eye, AlertOctagon, HelpCircle
} from 'lucide-react';

interface MissionOverviewProps {
  setActiveTab: (tab: string) => void;
}

export const MissionOverview: React.FC<MissionOverviewProps> = ({ setActiveTab }) => {
  const { fps, latency, currentStep, trackingStatus, activityConfidence, language } = useMission();
  const [viewMode, setViewMode] = useState<'2D' | '3D' | 'DUAL'>('2D');

  return (
    <div className="space-y-4 font-sans">
      {/* 1. HERO SECTION BANNER */}
      <div className="isro-card p-5 bg-white dark:bg-[#0A1A33] border-l-4 border-l-[#F26B21] space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-[#123F8C] text-white font-mono text-xs font-bold px-2.5 py-0.5 rounded">
            SIH 2026 PS174 | SIH26174
          </span>
          <span className="bg-[#EEF3FA] dark:bg-slate-800 text-[#123F8C] dark:text-cyan-300 text-xs font-mono font-semibold px-2 py-0.5 rounded border border-[#D5DCE6] dark:border-slate-700">
            ISRO • Department of Space
          </span>
        </div>

        <h1 className="text-xl md:text-2xl font-bold text-[#0B2A5B] dark:text-white leading-tight">
          ASTRA-PVT: Astronaut Protocol Tracking & Validation System
        </h1>

        {/* MANDATORY ONE-LINE PITCH */}
        <p className="text-sm font-semibold text-[#123F8C] dark:text-cyan-300 bg-[#EEF3FA] dark:bg-slate-900 p-3 rounded border border-[#D5DCE6] dark:border-slate-800">
          "An offline space-grade AI assistant that does not just recognize an astronaut's action — it verifies the physical result, validates the experiment sequence, and responds locally."
        </p>

        {/* Action CTAs */}
        <div className="pt-1 flex flex-wrap items-center gap-2.5">
          <button 
            onClick={() => setActiveTab('live')}
            className="btn-isro-cta font-bold"
          >
            <Play size={14} className="fill-current" />
            <span>Open Live Mission Console</span>
            <ArrowRight size={14} />
          </button>

          <button 
            onClick={() => setActiveTab('architecture')}
            className="btn-isro-primary"
          >
            <ShieldAlert size={14} />
            <span>System Architecture & Traceability</span>
          </button>

          <button 
            onClick={() => setActiveTab('evaluation')}
            className="btn-isro-outline font-bold"
          >
            <Activity size={14} />
            <span>Evaluation Dashboard</span>
          </button>
        </div>
      </div>

      {/* 2. CORE LIVE PIPELINE STRIP */}
      <PipelineStrip />

      {/* 3. COMPACT PROBLEMS → SOLUTION SECTION */}
      <div className="isro-card p-4 bg-white dark:bg-[#0A1A33] space-y-3">
        <h2 className="isro-section-title mb-0 text-xs font-mono">
          System Core Capabilities: Problems → Solution Mapping
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Problem 1 */}
          <div className="p-3 bg-[#F5F7FA] dark:bg-slate-900 rounded border border-[#D5DCE6] dark:border-slate-800 space-y-1 text-xs">
            <span className="font-bold text-[#C62828] text-[11px] block">Problem 1: No Earth-in-the-loop</span>
            <p className="text-[#5B6675] dark:text-slate-300 text-[11px]">
              <strong>Solution:</strong> 100% on-device edge inference on Jetson-class platform. Zero cloud dependency.
            </p>
          </div>

          {/* Problem 2 */}
          <div className="p-3 bg-[#F5F7FA] dark:bg-slate-900 rounded border border-[#D5DCE6] dark:border-slate-800 space-y-1 text-xs">
            <span className="font-bold text-[#C62828] text-[11px] block">Problem 2: No fixed 'up' in microgravity</span>
            <p className="text-[#5B6675] dark:text-slate-300 text-[11px]">
              <strong>Solution:</strong> Rigid transform J_rack = R_rackᵀ (J_cam − t_rack) anchored to ArUco fiducials on rack.
            </p>
          </div>

          {/* Problem 3 */}
          <div className="p-3 bg-[#F5F7FA] dark:bg-slate-900 rounded border border-[#D5DCE6] dark:border-slate-800 space-y-1 text-xs">
            <span className="font-bold text-[#C62828] text-[11px] block">Problem 3: Hand-near-object ≠ proof</span>
            <p className="text-[#5B6675] dark:text-slate-300 text-[11px]">
              <strong>Solution:</strong> 3-way causal verification requiring Action + Physical State-change + Context agreement.
            </p>
          </div>

          {/* Problem 4 */}
          <div className="p-3 bg-[#F5F7FA] dark:bg-slate-900 rounded border border-[#D5DCE6] dark:border-slate-800 space-y-1 text-xs">
            <span className="font-bold text-[#C62828] text-[11px] block">Problem 4: Single-model failure / sensor noise</span>
            <p className="text-[#5B6675] dark:text-slate-300 text-[11px]">
              <strong>Solution:</strong> Dempster-Shafer multi-sensor fusion with automated K_conflict fault isolation.
            </p>
          </div>

          {/* Problem 5 */}
          <div className="p-3 bg-[#F5F7FA] dark:bg-slate-900 rounded border border-[#D5DCE6] dark:border-slate-800 space-y-1 text-xs">
            <span className="font-bold text-[#C62828] text-[11px] block">Problem 5: Constrained edge compute</span>
            <p className="text-[#5B6675] dark:text-slate-300 text-[11px]">
              <strong>Solution:</strong> Adaptive ROI controller crops active interaction area (70%+ FLOPS saved).
            </p>
          </div>

          {/* Problem 6 */}
          <div className="p-3 bg-[#F5F7FA] dark:bg-slate-900 rounded border border-[#D5DCE6] dark:border-slate-800 space-y-1 text-xs">
            <span className="font-bold text-[#C62828] text-[11px] block">Problem 6: Protocol deviations & sequence mistakes</span>
            <p className="text-[#5B6675] dark:text-slate-300 text-[11px]">
              <strong>Solution:</strong> Deterministic FSM sequence validation with on-device Web Speech TTS guidance.
            </p>
          </div>
        </div>
      </div>

      {/* 4. MAIN SCENE VIEWPORT & TELEMETRY SUMMARY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: Live Camera Preview / 3D Model Viewport */}
        <div className="lg:col-span-2 space-y-3">
          <div className="isro-card p-3.5 bg-white dark:bg-[#0A1A33] space-y-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#EEF3FA] dark:border-slate-800 pb-2">
              <div>
                <h2 className="isro-section-title mb-0 text-xs">
                  Payload Rack Experiment Viewport
                </h2>
                <p className="text-[11px] text-[#5B6675] dark:text-slate-300 font-mono">
                  Live 2D YOLO26n AI overlay, 3D GLTF interactive model, or dual mode
                </p>
              </div>

              {/* VIEW MODE TOGGLE BUTTONS */}
              <div className="flex items-center space-x-1 bg-[#EEF3FA] dark:bg-slate-900 p-0.5 rounded border border-[#D5DCE6] dark:border-slate-800 text-xs font-mono">
                <button
                  onClick={() => setViewMode('2D')}
                  className={`px-2.5 py-0.5 rounded font-bold transition-colors ${
                    viewMode === '2D' ? 'bg-[#123F8C] text-white' : 'text-[#5B6675] hover:text-black'
                  }`}
                >
                  2D VISION
                </button>
                <button
                  onClick={() => setViewMode('3D')}
                  className={`px-2.5 py-0.5 rounded font-bold transition-colors ${
                    viewMode === '3D' ? 'bg-[#123F8C] text-white' : 'text-[#5B6675] hover:text-black'
                  }`}
                >
                  3D MODEL
                </button>
                <button
                  onClick={() => setViewMode('DUAL')}
                  className={`px-2.5 py-0.5 rounded font-bold transition-colors ${
                    viewMode === 'DUAL' ? 'bg-[#123F8C] text-white' : 'text-[#5B6675] hover:text-black'
                  }`}
                >
                  DUAL
                </button>
              </div>
            </div>

            {/* Viewport Render Area */}
            {viewMode === '2D' && <CameraCanvas />}
            {viewMode === '3D' && <AstronautViewer className="w-full aspect-video min-h-[360px]" />}
            {viewMode === 'DUAL' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <CameraCanvas />
                <AstronautViewer className="w-full aspect-video min-h-[300px]" />
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Telemetry Cards (Target / Simulated) */}
        <div className="space-y-3">
          <div className="isro-card p-3.5 bg-white dark:bg-[#0A1A33] space-y-3 font-mono text-xs">
            <h3 className="isro-section-title mb-0 text-xs font-mono">
              Live Telemetry (Target / Simulated)
            </h3>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-2.5 bg-[#F5F7FA] dark:bg-slate-900 rounded border border-[#D5DCE6] dark:border-slate-800">
                <span className="text-[10px] text-[#5B6675] block">FPS (TARGET/SIM)</span>
                <span className="text-xl font-bold text-[#123F8C] dark:text-cyan-300">{fps}</span>
              </div>

              <div className="p-2.5 bg-[#F5F7FA] dark:bg-slate-900 rounded border border-[#D5DCE6] dark:border-slate-800">
                <span className="text-[10px] text-[#5B6675] block">LATENCY (TARGET/SIM)</span>
                <span className="text-xl font-bold text-[#F26B21]">{latency} ms</span>
              </div>

              <div className="p-2.5 bg-[#F5F7FA] dark:bg-slate-900 rounded border border-[#D5DCE6] dark:border-slate-800">
                <span className="text-[10px] text-[#5B6675] block">CURRENT STEP</span>
                <span className="text-lg font-bold text-[#0B2A5B] dark:text-white">STEP {currentStep} / 3</span>
              </div>

              <div className="p-2.5 bg-[#F5F7FA] dark:bg-slate-900 rounded border border-[#D5DCE6] dark:border-slate-800">
                <span className="text-[10px] text-[#5B6675] block">TRACKING STATUS</span>
                <span className="text-sm font-bold text-[#138808]">{trackingStatus}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#EEF3FA] dark:border-slate-800 space-y-1.5">
              <span className="text-xs font-bold text-[#0B2A5B] dark:text-slate-200 block">
                Edge AI Pipeline Stack
              </span>
              <ul className="space-y-1 text-[11px] text-[#5B6675] dark:text-slate-300">
                <li>• Detector: YOLO26n (edge, NMS-free)</li>
                <li>• Pose Engine: Rack-Frame Transformed 3D Pose</li>
                <li>• Verification: Causal 3-Way Evidence Agreement</li>
                <li>• Fusion: Dempster-Shafer with Conflict Isolation</li>
                <li>• Sequence: Deterministic Finite State Machine</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
