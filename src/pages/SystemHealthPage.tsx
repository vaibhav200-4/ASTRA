import React from 'react';
import { useMission } from '../context/MissionContext';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Cpu, Flame, Zap, Thermometer, Activity, Server, CheckCircle2 } from 'lucide-react';

export const SystemHealthPage: React.FC = () => {
  const { 
    thermalThrottlePercent, setThermalThrottlePercent, continuityData,
    tmrResult, seuCount, injectBitFlip, ringBufferState, fps, latency
  } = useMission();

  // ROI Compute savings mock dataset
  const roiComputeData = [
    { frame: 'F1', fullFrameGflops: 42.5, roiCroppedGflops: 8.2 },
    { frame: 'F2', fullFrameGflops: 42.5, roiCroppedGflops: 8.5 },
    { frame: 'F3', fullFrameGflops: 42.5, roiCroppedGflops: 8.1 },
    { frame: 'F4', fullFrameGflops: 42.5, roiCroppedGflops: 9.0 },
    { frame: 'F5', fullFrameGflops: 42.5, roiCroppedGflops: 8.4 },
    { frame: 'F6', fullFrameGflops: 42.5, roiCroppedGflops: 8.3 },
  ];

  // CPU/GPU/Thermal computed metrics
  const cpuLoad = Math.min(98, Math.round(28 + thermalThrottlePercent * 0.6));
  const gpuLoad = Math.min(99, Math.round(45 + thermalThrottlePercent * 0.5));
  const tempCelsius = Math.round(42 + thermalThrottlePercent * 0.43);

  return (
    <div className="space-y-4 font-sans select-none max-w-[1440px] mx-auto pb-4">
      {/* Header Banner */}
      <div className="isro-card p-4 bg-white dark:bg-[#0A1A33] border-l-4 border-l-[#123F8C] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-[#123F8C] dark:text-[#7DD3FC] font-mono text-xs font-semibold mb-0.5 uppercase tracking-wider">
            <Cpu size={14} />
            <span>EDGE HARDWARE & RELIABILITY ARCHITECTURE</span>
          </div>
          <h1 className="text-lg font-bold text-[#1B2430] dark:text-[#F1F5F9]">
            System Reliability & Embedded Resource Control
          </h1>
          <p className="text-xs text-[#4A5568] dark:text-[#B8C4D6]">
            Jetson Orin Nano / NX class edge platform (emulated). All benchmarks labeled <span className="font-mono font-bold text-[#F26B21] dark:text-[#FFA366]">Target / Simulated</span> until flight measured.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="bg-[#14532D] text-white font-bold px-3 py-1.5 rounded border border-[#166534] flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-[#4ADE80]" /> SYSTEM STATUS: NOMINAL (FULLY OFFLINE)
          </span>
        </div>
      </div>

      {/* HARDWARE GAUGES ROW (CPU, GPU, TEMP, LATENCY, THRESHOLDS) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
        <div className="isro-card p-3 bg-white dark:bg-[#0A1A33] border border-[#D5DCE6] dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-[#4A5568] dark:text-[#B8C4D6] block font-sans font-semibold">ARM CORTEX CPU</span>
            <span className="text-xl font-bold text-[#123F8C] dark:text-[#7DD3FC]">{cpuLoad}%</span>
            <span className="text-[10px] text-[#4A5568] dark:text-[#B8C4D6] block font-sans">Target / Simulated</span>
          </div>
          <Cpu className="text-[#123F8C] dark:text-[#7DD3FC]" size={24} />
        </div>

        <div className="isro-card p-3 bg-white dark:bg-[#0A1A33] border border-[#D5DCE6] dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-[#4A5568] dark:text-[#B8C4D6] block font-sans font-semibold">NVIDIA AMPERE GPU</span>
            <span className="text-xl font-bold text-purple-600 dark:text-[#C084FC]">{gpuLoad}%</span>
            <span className="text-[10px] text-[#4A5568] dark:text-[#B8C4D6] block font-sans">Target / Simulated</span>
          </div>
          <Server className="text-purple-600 dark:text-[#C084FC]" size={24} />
        </div>

        <div className="isro-card p-3 bg-white dark:bg-[#0A1A33] border border-[#D5DCE6] dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-[#4A5568] dark:text-[#B8C4D6] block font-sans font-semibold">SOC THERMAL</span>
            <span className={`text-xl font-bold ${tempCelsius > 70 ? 'text-[#FF6B6B]' : tempCelsius > 55 ? 'text-[#FBBF24]' : 'text-[#0F6B06] dark:text-[#4ADE80]'}`}>
              {tempCelsius}&deg;C
            </span>
            <span className="text-[10px] text-[#4A5568] dark:text-[#B8C4D6] block font-sans">Target / Simulated</span>
          </div>
          <Thermometer className={tempCelsius > 70 ? 'text-[#FF6B6B]' : 'text-[#4ADE80]'} size={24} />
        </div>

        <div className="isro-card p-3 bg-white dark:bg-[#0A1A33] border border-[#D5DCE6] dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-[#4A5568] dark:text-[#B8C4D6] block font-sans font-semibold">FRAME RATE / LATENCY</span>
            <span className="text-xl font-bold text-[#0F6B06] dark:text-[#4ADE80]">{fps} FPS / {latency}ms</span>
            <span className="text-[10px] text-[#4A5568] dark:text-[#B8C4D6] block font-sans">Target / Simulated</span>
          </div>
          <Activity className="text-[#0F6B06] dark:text-[#4ADE80]" size={24} />
        </div>
      </div>

      {/* PART F: Thermal-Decoupled State Continuity Filter */}
      <div className="isro-card p-4 bg-white dark:bg-[#0A1A33] border border-[#D5DCE6] dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between border-b border-[#D5DCE6] dark:border-slate-800 pb-2">
          <h2 className="text-sm font-semibold text-[#1B2430] dark:text-[#F1F5F9] flex items-center gap-2 font-sans border-l-[3px] border-[#F26B21] pl-2">
            <Flame size={15} className="text-[#F26B21] dark:text-[#FFA366]" />
            <span>PART F — Thermal-Decoupled State Continuity Filter (dt-Kalman)</span>
          </h2>
          <span className="text-xs font-mono text-white font-bold bg-[#78350F] px-2.5 py-0.5 rounded border border-[#92400E]">
            Throttle Level: {thermalThrottlePercent}% (Effective FPS: {fps} Target / Simulated)
          </span>
        </div>

        <p className="text-xs text-[#4A5568] dark:text-[#B8C4D6]">
          Under severe thermal throttling, frame rate drops (24 &rarr; 8 FPS) causing variable frame intervals (dt jitter). The dt-decoupled Kalman filter propagates astronaut position using elapsed dt rather than naive frame counting.
        </p>

        {/* Throttle Slider */}
        <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded border border-slate-300 dark:border-slate-800 flex items-center justify-between gap-4 text-xs font-mono">
          <span className="font-bold text-[#1B2430] dark:text-[#F1F5F9] flex items-center gap-1.5 font-sans">
            <Flame size={15} className="text-[#F26B21] dark:text-[#FFA366]" />
            <span>Simulate Thermal Throttle Load:</span>
          </span>
          <input 
            type="range"
            min="0"
            max="100"
            value={thermalThrottlePercent}
            onChange={(e) => setThermalThrottlePercent(Number(e.target.value))}
            className="w-56 h-2 bg-slate-300 dark:bg-slate-800 rounded appearance-none cursor-pointer accent-[#F26B21]"
          />
          <span className="font-bold text-[#F26B21] dark:text-[#FFA366] w-12 text-right">{thermalThrottlePercent}%</span>
        </div>

        {/* Recharts Chart: dt propagation vs Naive frame-count */}
        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={continuityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.12)" />
              <XAxis dataKey="timeSec" label={{ value: 'Elapsed Time (sec)', position: 'insideBottom', offset: -2, fill: '#B8C4D6', fontSize: 10 }} tick={{ fontSize: 10, fill: '#B8C4D6' }} />
              <YAxis label={{ value: 'Position Error (cm)', angle: -90, position: 'insideLeft', fill: '#B8C4D6', fontSize: 10 }} tick={{ fontSize: 10, fill: '#B8C4D6' }} />
              <Tooltip contentStyle={{ backgroundColor: '#0A1A33', borderColor: '#1E293B', color: '#F1F5F9', fontSize: '11px' }} />
              <Legend verticalAlign="top" height={30} wrapperStyle={{ fontSize: '11px', color: '#F1F5F9' }} />
              <Line type="monotone" dataKey="errorKalman" stroke="#4ADE80" strokeWidth={2.5} name="dt-based Propagation Error (Kalman)" dot={false} />
              <Line type="monotone" dataKey="errorNaive" stroke="#FF6B6B" strokeWidth={2} strokeDasharray="4 2" name="Naive Frame-Count Error" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PART G & PART H GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* PART G: Radiation Resilience (TMR Engine) */}
        <div className="isro-card p-4 bg-white dark:bg-[#0A1A33] border border-[#D5DCE6] dark:border-slate-800 space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#D5DCE6] dark:border-slate-800 pb-2">
              <h2 className="text-sm font-semibold text-[#1B2430] dark:text-[#F1F5F9] flex items-center gap-2 font-sans border-l-[3px] border-[#F26B21] pl-2">
                <Zap size={15} className="text-[#F26B21] dark:text-[#FFA366]" />
                <span>PART G — Radiation Resilience (TMR Engine)</span>
              </h2>
              <span className="text-xs font-mono text-white font-bold bg-[#14532D] px-2.5 py-0.5 rounded border border-[#166534]">
                SEUs Corrected: {seuCount}
              </span>
            </div>

            <p className="text-xs text-[#4A5568] dark:text-[#B8C4D6]">
              Critical state vectors are maintained in 3 redundant memory copies. Background majority voting (2-vs-1) detects cosmic ray Single Event Upsets (SEUs) and auto-scrubs corrupted memory.
            </p>

            {/* 3 Redundant Memory Copies */}
            <div className="grid grid-cols-3 gap-2 font-mono text-xs">
              {tmrResult.copies.map(copy => (
                <div 
                  key={copy.id}
                  className={`p-2.5 rounded border transition-all ${
                    copy.isCorrupted
                      ? 'bg-[#7F1D1D] border-[#991B1B] text-white font-bold animate-pulse'
                      : 'bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-[#1B2430] dark:text-[#F1F5F9]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span>SRAM 0{copy.id}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${copy.isCorrupted ? 'bg-[#991B1B] text-white' : 'bg-[#14532D] text-[#86EFAC]'}`}>
                      {copy.isCorrupted ? 'CORRUPT' : 'OK'}
                    </span>
                  </div>
                  <div className="text-xs truncate font-bold">State: {copy.data.fsmState}</div>
                  <div className="text-[10px] text-[#4A5568] dark:text-[#B8C4D6] mt-1">Hash: {copy.checksum}</div>
                </div>
              ))}
            </div>

            {/* Voting Log */}
            <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded border border-slate-300 dark:border-slate-800 text-xs font-mono text-[#1B2430] dark:text-[#F1F5F9] space-y-1">
              <span className="font-bold text-[#F26B21] dark:text-[#FFA366] block text-xs font-sans">TMR MAJORITY VOTE LOG:</span>
              <p className="text-xs font-semibold">{tmrResult.logMessage}</p>
            </div>
          </div>

          {/* Inject Bit Flip Trigger */}
          <div className="pt-2 border-t border-[#D5DCE6] dark:border-slate-800 flex justify-end">
            <button 
              onClick={injectBitFlip}
              className="px-3 py-1.5 rounded text-xs font-bold font-mono bg-[#78350F] text-white border border-[#92400E] hover:bg-amber-800 flex items-center gap-1.5 transition-colors"
            >
              <Zap size={14} className="text-[#FBBF24]" />
              <span>Inject Cosmic Bit-Flip (SEU)</span>
            </button>
          </div>
        </div>

        {/* PART H: Lock-Free SPSC Ring Buffer */}
        <div className="isro-card p-4 bg-white dark:bg-[#0A1A33] border border-[#D5DCE6] dark:border-slate-800 space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#D5DCE6] dark:border-slate-800 pb-2">
              <h2 className="text-sm font-semibold text-[#1B2430] dark:text-[#F1F5F9] flex items-center gap-2 font-sans border-l-[3px] border-[#F26B21] pl-2">
                <Server size={15} className="text-[#F26B21] dark:text-[#FFA366]" />
                <span>PART H — Lock-Free SPSC Ring Buffer</span>
              </h2>
              <span className="text-xs font-mono text-white bg-[#0284C7] px-2.5 py-0.5 rounded border border-cyan-600 font-bold">
                Dropped: {ringBufferState.droppedFramesCount} frames
              </span>
            </div>

            {/* Metrics Summary */}
            <div className="grid grid-cols-4 gap-2 text-center font-mono text-xs">
              <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded border border-slate-300 dark:border-slate-800">
                <span className="text-[10px] text-[#4A5568] dark:text-[#B8C4D6] block font-sans">PRODUCER</span>
                <span className="font-bold text-[#F26B21] dark:text-[#FFA366]">Idx #{ringBufferState.headProducerIndex}</span>
              </div>
              <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded border border-slate-300 dark:border-slate-800">
                <span className="text-[10px] text-[#4A5568] dark:text-[#B8C4D6] block font-sans">CONSUMER</span>
                <span className="font-bold text-[#0F6B06] dark:text-[#4ADE80]">Idx #{ringBufferState.tailConsumerIndex}</span>
              </div>
              <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded border border-slate-300 dark:border-slate-800">
                <span className="text-[10px] text-[#4A5568] dark:text-[#B8C4D6] block font-sans">OCCUPANCY</span>
                <span className="font-bold text-[#1B2430] dark:text-[#F1F5F9]">{ringBufferState.occupancyCount} / {ringBufferState.capacity}</span>
              </div>
              <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded border border-slate-300 dark:border-slate-800">
                <span className="text-[10px] text-[#4A5568] dark:text-[#B8C4D6] block font-sans">LATENCY</span>
                <span className="font-bold text-[#123F8C] dark:text-[#7DD3FC]">{ringBufferState.latencyMs} ms</span>
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
                    className={`p-1.5 rounded text-center font-mono text-xs border transition-colors ${
                      isProd ? 'bg-[#F26B21] text-white font-bold border-[#F26B21]' :
                      isCons ? 'bg-[#14532D] text-white font-bold border-[#166534]' :
                      isReady ? 'bg-[#0284C7] text-white border-cyan-500 font-bold' :
                      'bg-slate-100 dark:bg-slate-900 text-[#4A5568] dark:text-[#B8C4D6] border-slate-300 dark:border-slate-800'
                    }`}
                  >
                    <div>#{slot.index}</div>
                    <div className="text-[9px] opacity-90">{slot.status}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cache Alignment Note */}
          <p className="text-xs font-mono text-[#4A5568] dark:text-[#B8C4D6] italic bg-slate-100 dark:bg-slate-900 p-2.5 rounded border border-slate-300 dark:border-slate-800">
            Note: "{ringBufferState.cacheAlignmentNote}".
          </p>
        </div>
      </div>

      {/* ROI COMPUTE-SAVINGS CHART */}
      <div className="isro-card p-4 bg-white dark:bg-[#0A1A33] border border-[#D5DCE6] dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between border-b border-[#D5DCE6] dark:border-slate-800 pb-2">
          <h2 className="text-sm font-semibold text-[#1B2430] dark:text-[#F1F5F9] flex items-center gap-2 font-sans border-l-[3px] border-[#F26B21] pl-2">
            <Cpu size={15} className="text-[#F26B21] dark:text-[#FFA366]" />
            <span>Keypoint ROI Dynamic Crop vs Full-Frame Inference Compute Load</span>
          </h2>
          <span className="text-xs font-mono text-white font-bold bg-[#14532D] px-2.5 py-0.5 rounded border border-[#166534]">
            ~80% Compute Savings (Target / Simulated)
          </span>
        </div>

        <p className="text-xs text-[#4A5568] dark:text-[#B8C4D6]">
          Once the astronaut payload interaction bounding box is locked, the inference pipeline crops the camera frame into a tight Bounding Box Region-of-Interest (ROI), reducing edge GFLOPS requirement from 42.5 GFLOPS to 8.2 GFLOPS.
        </p>

        <div className="h-48 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={roiComputeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.12)" />
              <XAxis dataKey="frame" tick={{ fill: '#B8C4D6', fontSize: 10 }} />
              <YAxis label={{ value: 'GFLOPS', angle: -90, position: 'insideLeft', fill: '#B8C4D6', fontSize: 10 }} tick={{ fill: '#B8C4D6', fontSize: 10 }} />
              <Tooltip contentStyle={{ backgroundColor: '#0A1A33', borderColor: '#1E293B', color: '#F1F5F9', fontSize: '11px' }} />
              <Legend verticalAlign="top" height={30} wrapperStyle={{ fontSize: '11px', color: '#F1F5F9' }} />
              <Bar dataKey="fullFrameGflops" fill="#FF6B6B" name="Full Frame 1080p Inference (GFLOPS)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="roiCroppedGflops" fill="#4ADE80" name="Keypoint ROI BBox Cropped Inference (GFLOPS)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
