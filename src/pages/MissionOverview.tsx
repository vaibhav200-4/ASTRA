import React from 'react';
import { useMission } from '../context/MissionContext';
import { CameraCanvas } from '../components/CameraCanvas';
import { Play, ShieldAlert, Cpu, Activity, ArrowRight, ShieldCheck, CheckCircle2, Zap } from 'lucide-react';

interface MissionOverviewProps {
  setActiveTab: (tab: string) => void;
}

export const MissionOverview: React.FC<MissionOverviewProps> = ({ setActiveTab }) => {
  const { fps, latency, currentStep, trackingStatus } = useMission();

  return (
    <div className="space-y-6 font-sans">
      {/* Top Government / Hackathon Banner */}
      <div className="bg-[#071B33] border-l-4 border-saffron-500 text-white p-6 rounded-lg shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-6">
          <Cpu size={240} className="text-saffron-400" />
        </div>

        <div className="relative z-10 space-y-3 max-w-4xl">
          <div className="flex items-center space-x-2">
            <span className="bg-saffron-500 text-white font-mono text-xs font-bold px-2 py-0.5 rounded">
              SIH 2026 PS174 | SIH26174
            </span>
            <span className="text-slate-300 text-xs font-mono">
              Research Prototype — Department of Space
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold font-mono tracking-tight text-white leading-tight">
            ON-DEVICE ASTRONAUT PROTOCOL INTELLIGENCE
          </h1>

          <p className="text-sm md:text-base text-slate-200 leading-relaxed font-sans">
            Real-time experiment tracking and protocol validation using edge AI and computer vision.
          </p>

          <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
            ASTRA-PVT monitors astronaut experiment procedures from fixed payload-rack cameras using object detection, human pose estimation, hand-object interaction analysis, temporal activity recognition and deterministic sequence validation.
          </p>

          {/* Action CTAs & Status Badges */}
          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button 
              onClick={() => setActiveTab('live')}
              className="px-5 py-2.5 bg-saffron-500 hover:bg-saffron-600 active:bg-saffron-700 text-white font-bold text-sm rounded shadow-lg flex items-center space-x-2 transition-all transform hover:-translate-y-0.5"
            >
              <Play size={16} className="fill-current" />
              <span>OPEN LIVE MISSION CONSOLE</span>
              <ArrowRight size={16} />
            </button>

            <button 
              onClick={() => setActiveTab('architecture')}
              className="px-4 py-2.5 bg-navy-800 hover:bg-navy-700 text-slate-200 hover:text-white font-bold text-sm rounded border border-navy-600 flex items-center space-x-2 transition-colors"
            >
              <ShieldAlert size={16} />
              <span>VIEW SYSTEM ARCHITECTURE</span>
            </button>
          </div>

          {/* Status Bar */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300 border-t border-navy-800/80">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>EDGE AI NODE CONNECTED</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-saffron-400"></span>
              <span>PROCESSING MODE: LOCAL OFFLINE</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              <span>INTERNET DEPENDENCY: NONE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Payload Rack Feed & Quick Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Camera Preview Viewport */}
        <div className="lg:col-span-2 space-y-3">
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="font-bold text-navy-900 font-mono text-sm tracking-wider">
                  PAYLOAD-RACK EXPERIMENT SCENE (OFFLINE AI SIMULATION)
                </h2>
                <p className="text-xs text-slate-500">
                  Fixed camera view tracking astronaut pose keypoints and experiment containers
                </p>
              </div>
              <span className="bg-emerald-100 text-emerald-800 font-mono text-xs font-bold px-2 py-0.5 rounded border border-emerald-300">
                ACTIVE PIPELINE
              </span>
            </div>

            {/* Live Interactive Camera Canvas */}
            <CameraCanvas />
          </div>
        </div>

        {/* Right Col: Live System Telemetry & Statistics */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold font-mono text-xs text-navy-900 tracking-wider border-b pb-2 flex items-center justify-between">
              <span>SYSTEM TELEMETRY</span>
              <span className="text-emerald-600 font-mono font-bold">● NOMINAL</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-space-bg p-3 rounded border border-slate-200">
                <span className="text-[10px] text-slate-500 font-mono block">INFERENCE FPS</span>
                <span className="text-xl font-bold font-mono text-navy-900">{fps} FPS</span>
              </div>

              <div className="bg-space-bg p-3 rounded border border-slate-200">
                <span className="text-[10px] text-slate-500 font-mono block">PIPELINE LATENCY</span>
                <span className="text-xl font-bold font-mono text-saffron-600">{latency} ms</span>
              </div>

              <div className="bg-space-bg p-3 rounded border border-slate-200">
                <span className="text-[10px] text-slate-500 font-mono block">PROTOCOL STEP</span>
                <span className="text-xl font-bold font-mono text-navy-900">STEP {currentStep} / 3</span>
              </div>

              <div className="bg-space-bg p-3 rounded border border-slate-200">
                <span className="text-[10px] text-slate-500 font-mono block">TRACKING STATUS</span>
                <span className="text-sm font-bold font-mono text-emerald-600">{trackingStatus}</span>
              </div>
            </div>

            {/* Detections Vocabulary Box */}
            <div className="pt-2 border-t space-y-2">
              <span className="text-xs font-bold font-mono text-navy-900 block">
                DETECTION VOCABULARY CONFIDENCE
              </span>
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between p-1.5 bg-blue-50 text-blue-900 rounded border border-blue-200">
                  <span>ASTRONAUT POSE</span>
                  <span className="font-bold">98.4%</span>
                </div>
                <div className="flex justify-between p-1.5 bg-red-50 text-red-900 rounded border border-red-200">
                  <span>RED EXPERIMENT BOX</span>
                  <span className="font-bold">97.1%</span>
                </div>
                <div className="flex justify-between p-1.5 bg-amber-50 text-amber-900 rounded border border-amber-200">
                  <span>YELLOW CONTAINER</span>
                  <span className="font-bold">95.8%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Architecture Summary Card */}
          <div className="bg-[#071B33] text-white p-4 rounded-lg shadow-sm space-y-3">
            <h4 className="font-bold font-mono text-xs text-saffron-400 tracking-wider">
              CORE OPERATIONAL PIPELINE
            </h4>
            <ul className="text-xs space-y-2 text-slate-300">
              <li className="flex items-start space-x-2">
                <CheckCircle2 size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                <span><strong>Fixed Cameras:</strong> Continuous video acquisition at payload rack.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                <span><strong>Parallel AI Inference:</strong> YOLOv8 Object Detection + MediaPipe Pose.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                <span><strong>Deterministic FSM:</strong> Guarantees sequence validation without false positives.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
