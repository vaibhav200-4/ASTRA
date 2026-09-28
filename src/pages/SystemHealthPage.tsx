import React from 'react';
import { useMission } from '../context/MissionContext';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Cpu, Flame, ShieldAlert, Zap, RefreshCw, HardDrive, Thermometer, Layers, Activity, Server, AlertOctagon, CheckCircle2 } from 'lucide-react';

export const SystemHealthPage: React.FC = () => {
  const { 
    thermalThrottlePercent, setThermalThrottlePercent, continuityData,
    tmrResult, seuCount, injectBitFlip, ringBufferState, fps, latency, language 
  } = useMission();

  // ROI Compute savings mock dataset
  const roiComputeData = [
    { frame: 'F1', fullFrameGflops: 42.5, roiCroppedGflops: 8.2, savingsPercent: 80.7 },
    { frame: 'F2', fullFrameGflops: 42.5, roiCroppedGflops: 8.5, savingsPercent: 80.0 },
    { frame: 'F3', fullFrameGflops: 42.5, roiCroppedGflops: 8.1, savingsPercent: 80.9 },
    { frame: 'F4', fullFrameGflops: 42.5, roiCroppedGflops: 9.0, savingsPercent: 78.8 },
    { frame: 'F5', fullFrameGflops: 42.5, roiCroppedGflops: 8.4, savingsPercent: 80.2 },
    { frame: 'F6', fullFrameGflops: 42.5, roiCroppedGflops: 8.3, savingsPercent: 80.5 },
  ];

  // CPU/GPU/Thermal computed metrics
  const cpuLoad = Math.min(98, Math.round(28 + thermalThrottlePercent * 0.6));
  const gpuLoad = Math.min(99, Math.round(45 + thermalThrottlePercent * 0.5));
  const tempCelsius = Math.round(42 + thermalThrottlePercent * 0.43);

  return (
    <div className="space-y-4 font-sans">
      {/* Header Banner */}
      <div className="isro-card p-4 bg-slate-900 border-l-4 border-l-cyan-500 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-lg">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-semibold mb-0.5">
            <Cpu size={14} />
            <span>EDGE HARDWARE & RELIABILITY ARCHITECTURE</span>
          </div>
          <h1 className="text-lg font-bold text-white">
            System Reliability & Embedded Resource Control
          </h1>
          <p className="text-xs text-slate-300">
            Jetson Orin Nano / NX class edge platform (emulated). All benchmarks labelled <span className="font-mono font-semibold text-amber-400">Target / Simulated</span> until flight measured.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="bg-emerald-500/10 text-emerald-400 font-bold px-3 py-1.5 rounded border border-emerald-500/30 flex items-center gap-1.5">
            <CheckCircle2 size={14} /> SYSTEM STATUS: NOMINAL (FULLY OFFLINE)
          </span>
        </div>
      </div>

      {/* HARDWARE GAUGES ROW (CPU, GPU, TEMP, LATENCY, THRESHOLDS) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono">
        <div className="isro-card p-3 bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block font-sans">ARM CORTEX CPU</span>
            <span className="text-lg font-bold text-cyan-400">{cpuLoad}%</span>
            <span className="text-[9px] text-slate-400 block">Target / Simulated</span>
          </div>
          <Cpu className="text-cyan-400 opacity-80" size={24} />
        </div>

        <div className="isro-card p-3 bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block font-sans">NVIDIA AMPERE GPU</span>
            <span className="text-lg font-bold text-purple-400">{gpuLoad}%</span>
            <span className="text-[9px] text-slate-400 block">Target / Simulated</span>
          </div>
          <Server className="text-purple-400 opacity-80" size={24} />
        </div>

        <div className="isro-card p-3 bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block font-sans">SOC THERMAL</span>
            <span className={`text-lg font-bold ${tempCelsius > 70 ? 'text-red-400' : tempCelsius > 55 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {tempCelsius}&deg;C
            </span>
            <span className="text-[9px] text-slate-400 block">Target / Simulated</span>
          </div>
          <Thermometer className={tempCelsius > 70 ? 'text-red-400' : 'text-emerald-400'} size={24} />
        </div>

        <div className="isro-card p-3 bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block font-sans">FRAME RATE / LATENCY</span>
            <span className="text-lg font-bold text-emerald-400">{fps} FPS / {latency}ms</span>
            <span className="text-[9px] text-slate-400 block">Target / Simulated</span>
          </div>
          <Activity className="text-emerald-400 opacity-80" size={24} />
        </div>
      </div>

      {/* PART F: Thermal-Decoupled State Continuity Filter */}
      <div className="isro-card p-4 bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h2 className="isro-section-title mb-0 text-xs font-mono text-slate-200">
            PART F — Thermal-Decoupled State Continuity Filter (dt-Kalman)
          </h2>
          <span className="text-xs font-mono text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
            Throttle Level: {thermalThrottlePercent}% (Effective FPS: {fps} Target / Simulated)
          </span>
        </div>

        <p className="text-xs text-slate-300">
          Under severe thermal throttling, frame rate drops (24 &rarr; 8 FPS) causing variable frame intervals (dt jitter). The dt-decoupled Kalman filter propagates astronaut position using elapsed dt rather than naive frame counting.
        </p>

        {/* Throttle Slider */}
        <div className="p-3 bg-slate-950 rounded border border-slate-800 flex items-center justify-between gap-4 text-xs font-mono">
          <span className="font-bold text-slate-200 flex items-center gap-1.5">
            <Flame size={15} className="text-amber-400" />
            <span>Simulate Thermal Throttle Load:</span>
          </span>
          <input 
            type="range"
            min="0"
            max="100"
            value={thermalThrottlePercent}
            onChange={(e) => setThermalThrottlePercent(Number(e.target.value))}
            className="w-56 h-2 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-400"
          />
          <span className="font-bold text-amber-400 w-12 text-right">{thermalThrottlePercent}%</span>
        </div>

        {/* Recharts Chart: dt propagation vs Naive frame-count */}
        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={continuityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="timeSec" label={{ value: 'Elapsed Time (sec)', position: 'insideBottom', offset: -2, fill: '#94A3B8', fontSize: 10 }} tick={{ fontSize: 9, fill: '#94A3B8' }} />
              <YAxis label={{ value: 'Position Error (cm)', angle: -90, position: 'insideLeft', fill: '#94A3B8', fontSize: 10 }} tick={{ fontSize: 9, fill: '#94A3B8' }} />
              <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', color: '#F8FAFC', fontSize: '11px' }} />
              <Legend verticalAlign="top" height={30} wrapperStyle={{ fontSize: '11px' }} />
              <Line type="monotone" dataKey="errorKalman" stroke="#10B981" strokeWidth={2.5} name="dt-based Propagation Error (Kalman)" dot={false} />
              <Line type="monotone" dataKey="errorNaive" stroke="#EF4444" strokeWidth={2} strokeDasharray="4 2" name="Naive Frame-Count Error" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PART G & PART H GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* PART G: Radiation Resilience (TMR Engine) */}
        <div className="isro-card p-4 bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h2 className="isro-section-title mb-0 text-xs font-mono text-slate-200">
                PART G — Radiation Resilience (TMR Engine)
              </h2>
              <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/30">
                SEUs Corrected: {seuCount}
              </span>
            </div>

            <p className="text-xs text-slate-300">
              Critical state vectors are maintained in 3 redundant memory copies. Background majority voting (2-vs-1) detects cosmic ray Single Event Upsets (SEUs) and auto-scrubs corrupted memory.
            </p>

            {/* 3 Redundant Memory Copies */}
            <div className="grid grid-cols-3 gap-2 font-mono text-xs">
              {tmrResult.copies.map(copy => (
                <div 
                  key={copy.id}
                  className={`p-2.5 rounded border transition-all ${
                    copy.isCorrupted
                      ? 'bg-red-950/40 border-red-500 text-red-300 font-bold animate-pulse'
                      : 'bg-slate-950 border-slate-800 text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span>SRAM Copy 0{copy.id}</span>
                    <span className={`px-1 rounded text-[9px] font-bold ${copy.isCorrupted ? 'bg-red-600 text-white' : 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'}`}>
                      {copy.isCorrupted ? 'CORRUPT' : 'OK'}
                    </span>
                  </div>
                  <div className="text-[11px] truncate">State: {copy.data.fsmState}</div>
                  <div className="text-[9px] text-slate-400 mt-1">Hash: {copy.checksum}</div>
                </div>
              ))}
            </div>

            {/* Voting Log */}
            <div className="p-3 bg-slate-950 rounded border border-slate-800 text-xs font-mono text-slate-200 space-y-1">
              <span className="font-bold text-amber-400 block text-[10px]">TMR MAJORITY VOTE LOG:</span>
              <p className="text-[11px] font-semibold">{tmrResult.logMessage}</p>
            </div>
          </div>

          {/* Inject Bit Flip Trigger */}
          <div className="pt-2 border-t border-slate-800 flex justify-end">
            <button 
              onClick={injectBitFlip}
              className="px-3 py-1.5 rounded text-xs font-bold font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 flex items-center gap-1.5 transition-colors"
            >
              <Zap size={14} className="text-amber-400" />
              <span>Inject Cosmic Bit-Flip (SEU)</span>
            </button>
          </div>
        </div>

        {/* PART H: Lock-Free SPSC Ring Buffer */}
        <div className="isro-card p-4 bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h2 className="isro-section-title mb-0 text-xs font-mono text-slate-200">
                PART H — Lock-Free SPSC Ring Buffer
              </h2>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                Dropped: {ringBufferState.droppedFramesCount} frames
              </span>
            </div>

            {/* Metrics Summary */}
            <div className="grid grid-cols-4 gap-2 text-center font-mono text-xs">
              <div className="p-2 bg-slate-950 rounded border border-slate-800">
                <span className="text-[9px] text-slate-400 block">PRODUCER</span>
                <span className="font-bold text-amber-400">Idx #{ringBufferState.headProducerIndex}</span>
              </div>
              <div className="p-2 bg-slate-950 rounded border border-slate-800">
                <span className="text-[9px] text-slate-400 block">CONSUMER</span>
                <span className="font-bold text-emerald-400">Idx #{ringBufferState.tailConsumerIndex}</span>
              </div>
              <div className="p-2 bg-slate-950 rounded border border-slate-800">
                <span className="text-[9px] text-slate-400 block">OCCUPANCY</span>
                <span className="font-bold text-white">{ringBufferState.occupancyCount} / {ringBufferState.capacity}</span>
              </div>
              <div className="p-2 bg-slate-950 rounded border border-slate-800">
                <span className="text-[9px] text-slate-400 block">QUEUE LATENCY</span>
                <span className="font-bold text-cyan-400">{ringBufferState.latencyMs} ms</span>
              </div>
            </div>

            {/* Animated 16-slot Circular/Grid Visualization */}
            <div className="grid grid-cols-8 gap-1.5 pt-1">
              {ringBufferState.slots.map((slot) => {
                const isProd = slot.index === ringBufferState.headProducerIndex;
                const isCons = slot.index === ringBufferState.tailConsumerIndex;
                const isReady = slot.status === 'READY';

                return (
                  <div 
                    key={slot.index}
                    className={`p-1.5 rounded text-center font-mono text-[9px] border transition-colors ${
                      isProd ? 'bg-amber-500 text-slate-950 font-bold border-amber-400' :
                      isCons ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400' :
                      isReady ? 'bg-cyan-950 text-cyan-300 border-cyan-500/40' :
                      'bg-slate-950 text-slate-500 border-slate-800'
                    }`}
                  >
                    <div>#{slot.index}</div>
                    <div className="text-[8px] opacity-90">{slot.status}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cache Alignment Note */}
          <p className="text-[11px] font-mono text-slate-400 italic bg-slate-950 p-2.5 rounded border border-slate-800">
            Note: "{ringBufferState.cacheAlignmentNote}".
          </p>
        </div>
      </div>

      {/* ROI COMPUTE-SAVINGS CHART (PART I FEATURE) */}
      <div className="isro-card p-4 bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h2 className="isro-section-title mb-0 text-xs font-mono text-slate-200">
            Keypoint ROI Dynamic Crop vs Full-Frame Inference Compute Load
          </h2>
          <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/30">
            ~80% Compute Savings (Target / Simulated)
          </span>
        </div>

        <p className="text-xs text-slate-300">
          Once the astronaut payload interaction bounding box is locked, the inference pipeline crops the camera frame into a tight Bounding Box Region-of-Interest (ROI), reducing edge GFLOPS requirement from 42.5 GFLOPS to 8.2 GFLOPS.
        </p>

        <div className="h-48 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={roiComputeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="frame" tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <YAxis label={{ value: 'GFLOPS', angle: -90, position: 'insideLeft', fill: '#94A3B8', fontSize: 10 }} tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', color: '#F8FAFC', fontSize: '11px' }} />
              <Legend verticalAlign="top" height={30} wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="fullFrameGflops" fill="#EF4444" name="Full Frame 1080p Inference (GFLOPS)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="roiCroppedGflops" fill="#10B981" name="Keypoint ROI BBox Cropped Inference (GFLOPS)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
