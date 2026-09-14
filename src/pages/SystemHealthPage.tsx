import React from 'react';
import { Cpu, HardDrive, Zap, Thermometer, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const SystemHealthPage: React.FC = () => {
  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="bg-[#071B33] text-white p-6 rounded-lg shadow-md border border-navy-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-saffron-400 font-mono text-xs font-bold mb-1">
            <Cpu size={16} />
            <span>EDGE HARDWARE MONITOR</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold font-mono tracking-tight text-white">
            NVIDIA JETSON XAVIER NX — SYSTEM HEALTH
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            On-Device Edge AI telemetry monitoring thermal, compute, and memory allocation.
          </p>
        </div>

        <div className="flex items-center space-x-3 font-mono text-xs">
          <div className="bg-emerald-950/90 border border-emerald-500 text-emerald-400 px-3 py-1.5 rounded flex items-center space-x-2 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>SYSTEM NOMINAL (OFFLINE)</span>
          </div>
        </div>
      </div>

      {/* Edge System Specs Card */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h3 className="font-bold text-sm text-navy-900">EDGE DEVICE: NVIDIA JETSON XAVIER NX</h3>
            <p className="text-slate-500 font-sans text-xs">Embedded SOM running Linux (Ubuntu 22.04 LTS)</p>
          </div>
          <span className="bg-blue-100 text-blue-900 border border-blue-300 font-bold px-2.5 py-1 rounded">
            INTERNET DEPENDENCY: NONE
          </span>
        </div>

        {/* 6 Metric Gauges Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-space-bg p-4 rounded border border-slate-200">
            <span className="text-slate-500 text-[10px] block">GPU LOAD</span>
            <span className="text-2xl font-bold text-navy-900">67%</span>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-saffron-500 h-full w-[67%]"></div>
            </div>
          </div>

          <div className="bg-space-bg p-4 rounded border border-slate-200">
            <span className="text-slate-500 text-[10px] block">CPU LOAD</span>
            <span className="text-2xl font-bold text-navy-900">42%</span>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-blue-500 h-full w-[42%]"></div>
            </div>
          </div>

          <div className="bg-space-bg p-4 rounded border border-slate-200">
            <span className="text-slate-500 text-[10px] block">RAM USAGE</span>
            <span className="text-xl font-bold text-navy-900">5.7 / 8 GB</span>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-purple-500 h-full w-[71%]"></div>
            </div>
          </div>

          <div className="bg-space-bg p-4 rounded border border-slate-200">
            <span className="text-slate-500 text-[10px] block">NVMe STORAGE</span>
            <span className="text-xl font-bold text-navy-900">124 / 512 GB</span>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-emerald-500 h-full w-[24%]"></div>
            </div>
          </div>

          <div className="bg-space-bg p-4 rounded border border-slate-200">
            <span className="text-slate-500 text-[10px] block">SOC TEMP</span>
            <span className="text-2xl font-bold text-saffron-600">57°C</span>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-saffron-500 h-full w-[57%]"></div>
            </div>
          </div>

          <div className="bg-space-bg p-4 rounded border border-slate-200">
            <span className="text-slate-500 text-[10px] block">POWER DRAW</span>
            <span className="text-2xl font-bold text-emerald-600">14.2 W</span>
            <span className="text-[9px] text-slate-400 block mt-1">MAX 15W MODE</span>
          </div>
        </div>
      </div>

      {/* Model Stack Status Cards */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4 font-mono text-xs">
        <h3 className="font-bold text-sm text-navy-900 border-b pb-2">
          DEPLOYED ON-DEVICE MODEL & MODULE STACK
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: "YOLOv8-Nano", type: "OBJECT DETECTION", status: "ACTIVE", latency: "12 ms" },
            { name: "MediaPipe Pose", type: "HUMAN 3D SKELETON", status: "ACTIVE", latency: "8 ms" },
            { name: "HOI Engine", type: "HAND-OBJECT INTERACTION", status: "ACTIVE", latency: "3 ms" },
            { name: "Temporal HAR", type: "ACTIVITY RECOGNITION", status: "ACTIVE", latency: "7 ms" },
            { name: "Deterministic FSM", type: "SEQUENCE VALIDATION", status: "ACTIVE", latency: "1 ms" },
            { name: "Web Speech TTS", type: "VOICE GUIDANCE", status: "READY", latency: "0 ms" },
            { name: "JSON Logger", type: "BLACKBOX AUDIT LOG", status: "ACTIVE", latency: "0 ms" },
            { name: "H.264 Recorder", type: "LOCAL VIDEO STORAGE", status: "REC", latency: "5 ms" },
          ].map((mod, idx) => (
            <div key={idx} className="p-3 bg-space-bg rounded border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-navy-900">{mod.name}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                  mod.status === 'REC' ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}>
                  {mod.status}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 block">{mod.type}</span>
              <span className="text-[10px] text-saffron-600 font-bold block">Latency: {mod.latency}</span>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-slate-500 font-sans italic pt-2 border-t">
          Note: Telemetry metrics represent realistic edge hardware simulation values on NVIDIA Jetson architecture.
        </p>
      </div>
    </div>
  );
};
