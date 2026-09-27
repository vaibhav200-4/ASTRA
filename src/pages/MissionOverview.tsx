import React, { useState } from 'react';
import { useMission } from '../context/MissionContext';
import { CameraCanvas } from '../components/CameraCanvas';
import { AstronautViewer } from '../components/AstronautViewer';
import { 
  Play, ShieldAlert, Cpu, Activity, ArrowRight, ShieldCheck, 
  CheckCircle2, Zap, Target, UserCheck, Hand, RefreshCw, Radio,
  WifiOff, Layers, Check, Clock, Box, Eye
} from 'lucide-react';

interface MissionOverviewProps {
  setActiveTab: (tab: string) => void;
}

export const MissionOverview: React.FC<MissionOverviewProps> = ({ setActiveTab }) => {
  const { fps, latency, currentStep, trackingStatus, activityConfidence } = useMission();
  const [viewMode, setViewMode] = useState<'2D' | '3D' | 'DUAL'>('2D');

  // Mini sparkline data generator for visual telemetry charts
  const fpsSparkline = "M 0 15 Q 15 8 30 14 T 60 10 T 90 12 T 120 7 T 150 11";
  const latencySparkline = "M 0 10 Q 15 16 30 12 T 60 18 T 90 14 T 120 19 T 150 13";

  return (
    <div className="space-y-5 font-sans">
      {/* Hero Section Banner */}
      <div className="glass-card bg-gradient-to-r from-[#0c1327] via-[#091122] to-[#0d1b36] border border-cyan-900/40 text-slate-100 p-5 md:p-6 rounded-2xl shadow-2xl relative overflow-hidden">
        {/* Background Decorative Tech Rings */}
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-6">
          <Cpu size={260} className="text-cyan-400" />
        </div>

        <div className="relative z-10 space-y-4 max-w-4xl">
          {/* Header Tag & Title */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-gradient-to-r from-saffron-500 to-amber-500 text-slate-950 font-mono text-xs font-extrabold px-2.5 py-0.5 rounded-md shadow-sm">
              SIH 2026 PS174 | SIH26174
            </span>
            <span className="text-cyan-400 text-xs font-mono flex items-center space-x-1 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded-md">
              <Zap size={12} />
              <span>DEPARTMENT OF SPACE RESEARCH PROTOTYPE</span>
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold font-mono tracking-tight text-white leading-tight flex items-center space-x-2">
            <span>ON-DEVICE ASTRONAUT PROTOCOL INTELLIGENCE</span>
          </h1>

          {/* REPLACE PARAGRAPH WITH 4 SHORT CAPABILITY CHIPS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            <div className="glass-card bg-slate-900/60 border border-cyan-800/40 px-3 py-2 rounded-xl flex items-center space-x-2 text-xs font-medium text-slate-200 hover:border-cyan-400/60 transition-all">
              <div className="p-1.5 bg-cyan-500/20 text-cyan-400 rounded-lg">
                <Target size={14} />
              </div>
              <div>
                <div className="font-bold font-mono text-cyan-300">OBJECT DETECT</div>
                <div className="text-[10px] text-slate-400">YOLOv8 Edge AI</div>
              </div>
            </div>

            <div className="glass-card bg-slate-900/60 border border-cyan-800/40 px-3 py-2 rounded-xl flex items-center space-x-2 text-xs font-medium text-slate-200 hover:border-cyan-400/60 transition-all">
              <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
                <UserCheck size={14} />
              </div>
              <div>
                <div className="font-bold font-mono text-emerald-300">3D ASTRONAUT</div>
                <div className="text-[10px] text-slate-400">Real-Time GLTF Render</div>
              </div>
            </div>

            <div className="glass-card bg-slate-900/60 border border-cyan-800/40 px-3 py-2 rounded-xl flex items-center space-x-2 text-xs font-medium text-slate-200 hover:border-cyan-400/60 transition-all">
              <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg">
                <Hand size={14} />
              </div>
              <div>
                <div className="font-bold font-mono text-amber-300">HOI TRACKING</div>
                <div className="text-[10px] text-slate-400">Hand-Object Vector</div>
              </div>
            </div>

            <div className="glass-card bg-slate-900/60 border border-cyan-800/40 px-3 py-2 rounded-xl flex items-center space-x-2 text-xs font-medium text-slate-200 hover:border-cyan-400/60 transition-all">
              <div className="p-1.5 bg-purple-500/20 text-purple-400 rounded-lg">
                <RefreshCw size={14} />
              </div>
              <div>
                <div className="font-bold font-mono text-purple-300">FSM VALIDATE</div>
                <div className="text-[10px] text-slate-400">Sequence Lock</div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button 
              onClick={() => setActiveTab('live')}
              className="px-5 py-2.5 bg-gradient-to-r from-saffron-500 to-amber-500 hover:from-saffron-600 hover:to-amber-600 text-slate-950 font-extrabold text-xs tracking-wider rounded-xl shadow-[0_0_20px_rgba(245,130,32,0.3)] flex items-center space-x-2 transition-all transform hover:-translate-y-0.5"
            >
              <Play size={15} className="fill-current" />
              <span>OPEN LIVE MISSION CONSOLE</span>
              <ArrowRight size={15} />
            </button>

            <button 
              onClick={() => setActiveTab('architecture')}
              className="px-4 py-2.5 bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-xs rounded-xl border border-slate-700/80 flex items-center space-x-2 transition-all"
            >
              <ShieldAlert size={15} className="text-cyan-400" />
              <span>SYSTEM ARCHITECTURE</span>
            </button>
          </div>

          {/* HORIZONTAL ROW OF STATUS ICON-BADGES WITH COLORED DOT INDICATORS */}
          <div className="pt-3 flex flex-wrap items-center gap-3 text-xs font-mono border-t border-slate-800/80">
            <div className="flex items-center space-x-2 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1 rounded-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <Cpu size={13} className="text-emerald-400" />
              <span className="text-emerald-300 font-bold">EDGE NODE CONNECTED</span>
            </div>

            <div className="flex items-center space-x-2 bg-amber-950/40 border border-amber-800/40 px-3 py-1 rounded-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <Radio size={13} className="text-amber-400" />
              <span className="text-amber-300 font-bold">MODE: LOCAL OFFLINE</span>
            </div>

            <div className="flex items-center space-x-2 bg-cyan-950/40 border border-cyan-800/40 px-3 py-1 rounded-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
              <WifiOff size={13} className="text-cyan-400" />
              <span className="text-cyan-300 font-bold">INTERNET DEPENDENCY: NONE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Protocol Step Stepper Bar */}
      <div className="glass-card bg-slate-900/70 border border-slate-800 p-3.5 rounded-2xl shadow-lg space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold font-mono text-cyan-400 flex items-center space-x-1.5">
            <Layers size={14} />
            <span>PROTOCOL PROGRESS STEPPER</span>
          </span>
          <span className="text-slate-400 font-mono text-[11px]">
            EXPERIMENT: BCE-01 (BOX & CONTAINER)
          </span>
        </div>

        {/* Stepper Steps */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className={`p-2.5 rounded-xl border flex items-center space-x-3 transition-all ${
            currentStep > 1 
              ? 'bg-emerald-950/30 border-emerald-700/50 text-emerald-300' 
              : currentStep === 1 
              ? 'bg-amber-950/40 border-amber-500/60 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]' 
              : 'bg-slate-900/40 border-slate-800 text-slate-500'
          }`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs font-mono shrink-0 ${
              currentStep > 1 ? 'bg-emerald-500 text-slate-950' : currentStep === 1 ? 'bg-amber-500 text-slate-950 animate-pulse' : 'bg-slate-800 text-slate-400'
            }`}>
              {currentStep > 1 ? <Check size={14} /> : '1'}
            </div>
            <div className="overflow-hidden">
              <div className="text-[11px] font-bold truncate">STEP 1: OPEN LID</div>
              <div className="text-[9px] opacity-80 truncate">Open experiment box</div>
            </div>
          </div>

          <div className={`p-2.5 rounded-xl border flex items-center space-x-3 transition-all ${
            currentStep > 2 
              ? 'bg-emerald-950/30 border-emerald-700/50 text-emerald-300' 
              : currentStep === 2 
              ? 'bg-amber-950/40 border-amber-500/60 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]' 
              : 'bg-slate-900/40 border-slate-800 text-slate-500'
          }`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs font-mono shrink-0 ${
              currentStep > 2 ? 'bg-emerald-500 text-slate-950' : currentStep === 2 ? 'bg-amber-500 text-slate-950 animate-pulse' : 'bg-slate-800 text-slate-400'
            }`}>
              {currentStep > 2 ? <Check size={14} /> : '2'}
            </div>
            <div className="overflow-hidden">
              <div className="text-[11px] font-bold truncate">STEP 2: REMOVE CONTAINER</div>
              <div className="text-[9px] opacity-80 truncate">Extract yellow container</div>
            </div>
          </div>

          <div className={`p-2.5 rounded-xl border flex items-center space-x-3 transition-all ${
            currentStep > 3 
              ? 'bg-emerald-950/30 border-emerald-700/50 text-emerald-300' 
              : currentStep === 3 
              ? 'bg-amber-950/40 border-amber-500/60 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]' 
              : 'bg-slate-900/40 border-slate-800 text-slate-500'
          }`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs font-mono shrink-0 ${
              currentStep > 3 ? 'bg-emerald-500 text-slate-950' : currentStep === 3 ? 'bg-amber-500 text-slate-950 animate-pulse' : 'bg-slate-800 text-slate-400'
            }`}>
              {currentStep > 3 ? <Check size={14} /> : '3'}
            </div>
            <div className="overflow-hidden">
              <div className="text-[11px] font-bold truncate">STEP 3: RACK SLOT S3</div>
              <div className="text-[9px] opacity-80 truncate">Secure in target slot</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Camera / 3D Viewport & 2x2 Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Live Camera Preview / 3D Model Viewport */}
        <div className="lg:col-span-2 space-y-3">
          <div className="glass-card glass-card-hover p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div>
                <h2 className="font-bold text-white font-mono text-xs tracking-wider flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
                  <span>PAYLOAD-RACK EXPERIMENT SCENE</span>
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                  Toggle between 2D AI overlay, 3D interactive GLTF astronaut model, or dual view
                </p>
              </div>

              {/* VIEW MODE TOGGLE BUTTONS */}
              <div className="flex items-center space-x-1 bg-slate-950/80 p-1 rounded-lg border border-slate-800 font-mono text-[11px]">
                <button
                  onClick={() => setViewMode('2D')}
                  className={`px-2.5 py-1 rounded-md font-bold transition-all flex items-center space-x-1 ${
                    viewMode === '2D' 
                      ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-[0_0_10px_rgba(6,182,212,0.3)]' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Eye size={12} />
                  <span>2D VISION</span>
                </button>

                <button
                  onClick={() => setViewMode('3D')}
                  className={`px-2.5 py-1 rounded-md font-bold transition-all flex items-center space-x-1 ${
                    viewMode === '3D' 
                      ? 'bg-amber-500 text-slate-950 font-extrabold shadow-[0_0_10px_rgba(245,158,11,0.3)]' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Box size={12} />
                  <span>3D MODEL</span>
                </button>

                <button
                  onClick={() => setViewMode('DUAL')}
                  className={`px-2.5 py-1 rounded-md font-bold transition-all flex items-center space-x-1 ${
                    viewMode === 'DUAL' 
                      ? 'bg-purple-500 text-white font-extrabold shadow-[0_0_10px_rgba(168,85,247,0.3)]' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers size={12} />
                  <span>DUAL</span>
                </button>
              </div>
            </div>

            {/* Viewport Render Area */}
            {viewMode === '2D' && <CameraCanvas />}
            {viewMode === '3D' && <AstronautViewer className="w-full aspect-video min-h-[360px]" />}
            {viewMode === 'DUAL' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <CameraCanvas />
                <AstronautViewer className="w-full aspect-video min-h-[300px]" />
              </div>
            )}
          </div>
        </div>

        {/* Right Col: 2x2 Telemetry Grid & Micro Widgets */}
        <div className="space-y-4">
          <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold font-mono text-xs text-white tracking-wider flex items-center space-x-2">
                <Activity size={14} className="text-cyan-400" />
                <span>SYSTEM TELEMETRY</span>
              </h3>
              <span className="text-emerald-400 font-mono text-[11px] font-bold flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>NOMINAL</span>
              </span>
            </div>

            {/* 2x2 ICON-METRIC GRID WITH COLOR-CODED LEFT BORDERS */}
            <div className="grid grid-cols-2 gap-3">
              {/* Card 1: Inference FPS (Cyan Border) */}
              <div className="glass-card glass-card-hover p-3 rounded-xl border-l-4 border-l-cyan-400 border-t border-r border-b border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono flex items-center space-x-1">
                    <Activity size={12} className="text-cyan-400" />
                    <span>INFERENCE FPS</span>
                  </span>
                  <span className="text-[9px] text-cyan-400 font-mono font-bold">LIVE</span>
                </div>
                <div className="text-xl font-extrabold font-mono text-white flex items-baseline space-x-1">
                  <span>{fps}</span>
                  <span className="text-xs text-cyan-400 font-normal">FPS</span>
                </div>
                {/* Mini Sparkline Chart */}
                <svg className="w-full h-5 stroke-cyan-400 fill-none" viewBox="0 0 150 25">
                  <path d={fpsSparkline} strokeWidth="1.8" />
                </svg>
              </div>

              {/* Card 2: Pipeline Latency (Amber Border) */}
              <div className="glass-card glass-card-hover p-3 rounded-xl border-l-4 border-l-amber-400 border-t border-r border-b border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono flex items-center space-x-1">
                    <Cpu size={12} className="text-amber-400" />
                    <span>LATENCY</span>
                  </span>
                  <span className="text-[9px] text-amber-400 font-mono font-bold">EDGE</span>
                </div>
                <div className="text-xl font-extrabold font-mono text-amber-400 flex items-baseline space-x-1">
                  <span>{latency}</span>
                  <span className="text-xs text-amber-300 font-normal">ms</span>
                </div>
                {/* Mini Sparkline Chart */}
                <svg className="w-full h-5 stroke-amber-400 fill-none" viewBox="0 0 150 25">
                  <path d={latencySparkline} strokeWidth="1.8" />
                </svg>
              </div>

              {/* Card 3: Protocol Step (Red/Orange Border) */}
              <div className="glass-card glass-card-hover p-3 rounded-xl border-l-4 border-l-saffron-500 border-t border-r border-b border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono flex items-center space-x-1">
                    <Layers size={12} className="text-saffron-400" />
                    <span>PROTOCOL STEP</span>
                  </span>
                </div>
                <div className="text-lg font-extrabold font-mono text-white">
                  STEP {currentStep} <span className="text-xs text-slate-400 font-normal">/ 3</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-saffron-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${(currentStep / 3) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Card 4: Tracking Status (Green Border) */}
              <div className="glass-card glass-card-hover p-3 rounded-xl border-l-4 border-l-emerald-400 border-t border-r border-b border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono flex items-center space-x-1">
                    <ShieldCheck size={12} className="text-emerald-400" />
                    <span>TRACKING</span>
                  </span>
                </div>
                <div className="text-sm font-bold font-mono text-emerald-400 flex items-center space-x-1 pt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>{trackingStatus}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono pt-1">
                  Confidence: {activityConfidence.toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Detections Vocabulary Box */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <span className="text-xs font-bold font-mono text-slate-200 block flex items-center justify-between">
                <span>AI DETECTION CONFIDENCE</span>
                <span className="text-[10px] text-cyan-400">YOLOv8 + 3D Pose</span>
              </span>
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between p-2 bg-slate-900/80 border border-slate-800 rounded-lg">
                  <span className="text-cyan-300 font-medium">ASTRONAUT 3D MODEL</span>
                  <span className="font-bold text-white">99.4%</span>
                </div>
                <div className="flex justify-between p-2 bg-slate-900/80 border border-slate-800 rounded-lg">
                  <span className="text-red-400 font-medium">RED EXPERIMENT BOX</span>
                  <span className="font-bold text-white">97.1%</span>
                </div>
                <div className="flex justify-between p-2 bg-slate-900/80 border border-slate-800 rounded-lg">
                  <span className="text-amber-400 font-medium">YELLOW CONTAINER</span>
                  <span className="font-bold text-white">95.8%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Architecture Pipeline Mini Card */}
          <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-2.5">
            <h4 className="font-bold font-mono text-xs text-saffron-400 tracking-wider flex items-center space-x-1.5">
              <Zap size={14} />
              <span>CORE OPERATIONAL PIPELINE</span>
            </h4>
            <ul className="text-xs space-y-2 text-slate-300">
              <li className="flex items-start space-x-2">
                <CheckCircle2 size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                <span><strong>Fixed Cameras:</strong> Continuous 1080p acquisition at rack.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                <span><strong>Three.js / R3F:</strong> Interactive 3D GLTF Model viewport.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                <span><strong>Deterministic FSM:</strong> Eliminates sequence deviation.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
