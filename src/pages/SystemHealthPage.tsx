import React from 'react';
import { useMission } from '../context/MissionContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Cpu, Flame, ShieldAlert, Zap, RefreshCw, HardDrive, Thermometer, Layers, Activity } from 'lucide-react';

export const SystemHealthPage: React.FC = () => {
  const { 
    thermalThrottlePercent, setThermalThrottlePercent, continuityData,
    tmrResult, seuCount, injectBitFlip, ringBufferState, fps, latency, language 
  } = useMission();

  return (
    <div className="space-y-4 font-sans">
      {/* Header Banner */}
      <div className="isro-card p-4 bg-white dark:bg-[#0A1A33] border-l-4 border-l-[#123F8C] flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 text-[#123F8C] dark:text-cyan-400 font-mono text-xs font-semibold mb-0.5">
            <Cpu size={14} />
            <span>EDGE HARDWARE & RELIABILITY ARCHITECTURE</span>
          </div>
          <h1 className="text-lg font-bold text-[#0B2A5B] dark:text-white">
            System Reliability & Embedded Resource Control
          </h1>
          <p className="text-xs text-[#5B6675] dark:text-slate-300">
            Jetson-class edge platform (emulated). All benchmarks labelled <span className="font-mono font-semibold text-[#F26B21]">Target / Simulated</span>.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="bg-[#EEF3FA] dark:bg-slate-800 text-[#138808] font-bold px-2.5 py-1 rounded border border-[#D5DCE6] dark:border-slate-700">
            SYSTEM STATUS: NOMINAL (LOCAL OFFLINE)
          </span>
        </div>
      </div>

      {/* PART F: Thermal-Decoupled State Continuity Filter */}
      <div className="isro-card p-4 bg-white dark:bg-[#0A1A33] space-y-3">
        <div className="flex items-center justify-between border-b border-[#EEF3FA] dark:border-slate-800 pb-2">
          <h2 className="isro-section-title mb-0 text-xs font-mono">
            PART F — Thermal-Decoupled State Continuity Filter
          </h2>
          <span className="text-xs font-mono text-[#F26B21] font-bold bg-[#EEF3FA] dark:bg-slate-800 px-2 py-0.5 rounded">
            Throttle Level: {thermalThrottlePercent}% (FPS: {fps} Target / Simulated)
          </span>
        </div>

        <p className="text-xs text-[#5B6675] dark:text-slate-300">
          Under severe thermal throttling, frame rate drops (24 → 8 FPS) causing variable frame intervals (dt jitter). The dt-decoupled Kalman filter propagates astronaut position using elapsed dt rather than naive frame counting.
        </p>

        {/* Throttle Slider */}
        <div className="p-3 bg-[#EEF3FA] dark:bg-slate-900 rounded border border-[#D5DCE6] dark:border-slate-800 flex items-center justify-between gap-4 text-xs font-mono">
          <span className="font-bold text-[#0B2A5B] dark:text-slate-200 flex items-center gap-1.5">
            <Flame size={15} className="text-[#F26B21]" />
            <span>Simulate Thermal Throttle Load:</span>
          </span>
          <input 
            type="range"
            min="0"
            max="100"
            value={thermalThrottlePercent}
            onChange={(e) => setThermalThrottlePercent(Number(e.target.value))}
            className="w-48 h-1.5 bg-slate-300 dark:bg-slate-700 rounded appearance-none cursor-pointer accent-[#F26B21]"
          />
          <span className="font-bold text-[#F26B21]">{thermalThrottlePercent}%</span>
        </div>

        {/* Recharts Chart: dt propagation vs Naive frame-count */}
        <div className="h-52 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={continuityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#D5DCE6" />
              <XAxis dataKey="timeSec" label={{ value: 'Elapsed Time (sec)', position: 'insideBottom', offset: -2, fill: '#5B6675', fontSize: 10 }} tick={{ fontSize: 9, fill: '#5B6675' }} />
              <YAxis label={{ value: 'Position Error (cm)', angle: -90, position: 'insideLeft', fill: '#5B6675', fontSize: 10 }} tick={{ fontSize: 9, fill: '#5B6675' }} />
              <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#D5DCE6', fontSize: '11px' }} />
              <Legend verticalAlign="top" height={30} wrapperStyle={{ fontSize: '11px' }} />
              <Line type="monotone" dataKey="errorKalman" stroke="#138808" strokeWidth={2} name="dt-based Propagation Error (Kalman)" dot={false} />
              <Line type="monotone" dataKey="errorNaive" stroke="#C62828" strokeWidth={2} strokeDasharray="4 2" name="Naive Frame-Count Error" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PART G & PART H GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* PART G: Radiation Resilience (TMR Engine) */}
        <div className="isro-card p-4 bg-white dark:bg-[#0A1A33] space-y-3">
          <div className="flex items-center justify-between border-b border-[#EEF3FA] dark:border-slate-800 pb-2">
            <h2 className="isro-section-title mb-0 text-xs font-mono">
              PART G — Radiation Resilience (TMR Engine)
            </h2>
            <span className="text-xs font-mono text-[#138808] font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-300">
              SEUs Corrected: {seuCount}
            </span>
          </div>

          <p className="text-xs text-[#5B6675] dark:text-slate-300">
            Critical state vectors are maintained in 3 redundant memory copies. Background majority voting (2-vs-1) detects cosmic ray Single Event Upsets (SEUs) and auto-scrubs corrupted memory.
          </p>

          {/* 3 Memory Copies */}
          <div className="grid grid-cols-3 gap-2 font-mono text-xs">
            {tmrResult.copies.map(copy => (
              <div 
                key={copy.id}
                className={`p-2.5 rounded border ${
                  copy.isCorrupted
                    ? 'bg-red-50 border-red-400 text-[#C62828] dark:bg-red-950 dark:text-red-300 font-bold'
                    : 'bg-[#F5F7FA] dark:bg-slate-900 border-[#D5DCE6] dark:border-slate-800 text-[#0B2A5B] dark:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span>SRAM Copy 0{copy.id}</span>
                  <span className={`px-1 rounded text-[9px] ${copy.isCorrupted ? 'bg-red-600 text-white' : 'bg-emerald-100 text-[#138808]'}`}>
                    {copy.isCorrupted ? 'CORRUPT' : 'OK'}
                  </span>
                </div>
                <div className="text-[11px] truncate">State: {copy.data.fsmState}</div>
                <div className="text-[9px] text-[#5B6675] dark:text-slate-400 mt-1">Hash: {copy.checksum}</div>
              </div>
            ))}
          </div>

          {/* Voting Log */}
          <div className="p-2.5 bg-[#EEF3FA] dark:bg-slate-900 rounded border border-[#D5DCE6] dark:border-slate-800 text-xs font-mono text-[#0B2A5B] dark:text-slate-200">
            <span className="font-bold text-[#F26B21] block text-[10px]">TMR MAJORITY VOTE LOG:</span>
            <p className="text-[11px] mt-0.5">{tmrResult.logMessage}</p>
          </div>

          {/* Inject Bit Flip Trigger */}
          <div className="pt-2 border-t border-[#EEF3FA] dark:border-slate-800 flex justify-end">
            <button 
              onClick={injectBitFlip}
              className="btn-isro-cta"
            >
              <Zap size={14} />
              <span>Inject Cosmic Bit-Flip</span>
            </button>
          </div>
        </div>

        {/* PART H: Lock-Free SPSC Ring Buffer */}
        <div className="isro-card p-4 bg-white dark:bg-[#0A1A33] space-y-3">
          <div className="flex items-center justify-between border-b border-[#EEF3FA] dark:border-slate-800 pb-2">
            <h2 className="isro-section-title mb-0 text-xs font-mono">
              PART H — Lock-Free SPSC Ring Buffer
            </h2>
            <span className="text-[10px] font-mono text-[#123F8C] dark:text-cyan-300 bg-[#EEF3FA] dark:bg-slate-800 px-2 py-0.5 rounded">
              Dropped: {ringBufferState.droppedFramesCount} frames
            </span>
          </div>

          {/* Metrics Summary */}
          <div className="grid grid-cols-4 gap-2 text-center font-mono text-xs">
            <div className="p-2 bg-[#F5F7FA] dark:bg-slate-900 rounded border border-[#D5DCE6] dark:border-slate-800">
              <span className="text-[9px] text-[#5B6675] block">PRODUCER</span>
              <span className="font-bold text-[#123F8C] dark:text-cyan-300">Idx #{ringBufferState.headProducerIndex}</span>
            </div>
            <div className="p-2 bg-[#F5F7FA] dark:bg-slate-900 rounded border border-[#D5DCE6] dark:border-slate-800">
              <span className="text-[9px] text-[#5B6675] block">CONSUMER</span>
              <span className="font-bold text-[#138808]">Idx #{ringBufferState.tailConsumerIndex}</span>
            </div>
            <div className="p-2 bg-[#F5F7FA] dark:bg-slate-900 rounded border border-[#D5DCE6] dark:border-slate-800">
              <span className="text-[9px] text-[#5B6675] block">OCCUPANCY</span>
              <span className="font-bold text-[#0B2A5B] dark:text-white">{ringBufferState.occupancyCount} / {ringBufferState.capacity}</span>
            </div>
            <div className="p-2 bg-[#F5F7FA] dark:bg-slate-900 rounded border border-[#D5DCE6] dark:border-slate-800">
              <span className="text-[9px] text-[#5B6675] block">QUEUE LATENCY</span>
              <span className="font-bold text-[#F26B21]">{ringBufferState.latencyMs} ms</span>
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
                    isProd ? 'bg-[#F26B21] text-white font-bold border-[#F26B21]' :
                    isCons ? 'bg-[#138808] text-white font-bold border-[#138808]' :
                    isReady ? 'bg-blue-100 text-[#123F8C] dark:bg-slate-800 dark:text-cyan-300 border-blue-300' :
                    'bg-[#F5F7FA] text-[#5B6675] dark:bg-slate-900/60 border-[#D5DCE6] dark:border-slate-800'
                  }`}
                >
                  <div>#{slot.index}</div>
                  <div className="text-[8px] opacity-90">{slot.status}</div>
                </div>
              );
            })}
          </div>

          {/* Mandatory Design Note */}
          <p className="text-[11px] font-mono text-[#5B6675] dark:text-slate-400 italic bg-[#EEF3FA] dark:bg-slate-900 p-2 rounded border border-[#D5DCE6] dark:border-slate-800">
            Note: "{ringBufferState.cacheAlignmentNote}".
          </p>
        </div>
      </div>
    </div>
  );
};
