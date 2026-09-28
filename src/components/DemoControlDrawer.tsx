import React, { useEffect } from 'react';
import { useMission } from '../context/MissionContext';
import {
  X, Flame, RefreshCw, Radio, Terminal, Hand, Move3d, Sliders, Zap, Target, Volume2
} from 'lucide-react';

export const DemoControlDrawer: React.FC = () => {
  const {
    demoMode, setDemoMode, performCorrectStep, performWrongStep, skipCurrentStep,
    triggerObjectLost, triggerLowConfidence, recoverTracking, resetMission,
    triggerHandNearObjectNoStateChange, triggerSensorDisagreement, randomizeOrientation,
    thermalThrottlePercent, setThermalThrottlePercent, injectBitFlip,
    triggerSpatialBeepForMisplacedTool, currentStep, fsmState
  } = useMission();

  const isOpen = demoMode === 'SIMULATION';

  // Keyboard shortcut toggle with 'S' and 'Escape' keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        setDemoMode(demoMode === 'SIMULATION' ? 'MONITORING' : 'SIMULATION');
      } else if (e.key === 'Escape') {
        setDemoMode('MONITORING');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [demoMode, setDemoMode]);

  if (!isOpen) return null;

  return (
    <>
      {/* Dimmed Backdrop Overlay */}
      <div
        onClick={() => setDemoMode('MONITORING')}
        className="fixed inset-0 bg-black/40 z-40 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 z-50 w-96 bg-[#0A1A33] border-l border-slate-700 shadow-2xl flex flex-col justify-between select-none font-sans text-xs">
      {/* Header */}
      <div className="bg-[#071326] px-4 py-3 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Radio size={16} className="text-[#F26B21] animate-pulse" />
          <div>
            <h3 className="font-bold text-white text-sm">Simulation & Stress Tests</h3>
            <span className="text-slate-400 text-[11px] font-mono">Press 'S' key to toggle</span>
          </div>
        </div>

        <button
          onClick={() => setDemoMode('MONITORING')}
          className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Main 2-Column Grid of Large Controls */}
      <div className="p-4 flex-1 overflow-y-auto space-y-4">
        <div className="p-2.5 bg-slate-900/90 rounded border border-slate-800 font-mono text-xs">
          <span className="text-slate-400 block text-[11px]">ACTIVE FSM STATE</span>
          <span className="font-bold text-cyan-300 text-sm">Step {currentStep} • {fsmState}</span>
        </div>

        <div className="space-y-1.5">
          <span className="font-bold text-slate-200 text-xs uppercase tracking-wider block">
            Protocol & Stress Test Controls
          </span>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={performCorrectStep}
              className="p-2.5 rounded bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-600/60 text-emerald-200 font-bold flex flex-col justify-between h-16 transition-all"
            >
              <div className="flex items-center justify-between w-full">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-[10px] text-emerald-400 font-mono">OK</span>
              </div>
              <span className="text-xs text-left leading-tight">Correct Step</span>
            </button>

            <button
              onClick={triggerHandNearObjectNoStateChange}
              className="p-2.5 rounded bg-red-950/60 hover:bg-red-900 border border-red-600/60 text-red-200 font-bold flex flex-col justify-between h-16 transition-all"
            >
              <div className="flex items-center justify-between w-full">
                <Hand size={14} className="text-red-400" />
                <span className="text-[10px] text-red-400 font-mono">REJECT</span>
              </div>
              <span className="text-xs text-left leading-tight">Hand Near (Reject)</span>
            </button>

            <button
              onClick={triggerSensorDisagreement}
              className="p-2.5 rounded bg-amber-950/60 hover:bg-amber-900 border border-amber-600/60 text-amber-200 font-bold flex flex-col justify-between h-16 transition-all"
            >
              <div className="flex items-center justify-between w-full">
                <Sliders size={14} className="text-amber-400" />
                <span className="text-[10px] text-amber-400 font-mono">DS FAULT</span>
              </div>
              <span className="text-xs text-left leading-tight">Sensor Disagree</span>
            </button>

            <button
              onClick={injectBitFlip}
              className="p-2.5 rounded bg-purple-950/60 hover:bg-purple-900 border border-purple-600/60 text-purple-200 font-bold flex flex-col justify-between h-16 transition-all"
            >
              <div className="flex items-center justify-between w-full">
                <Zap size={14} className="text-purple-400" />
                <span className="text-[10px] text-purple-400 font-mono">TMR</span>
              </div>
              <span className="text-xs text-left leading-tight">Inject Bit-Flip</span>
            </button>

            <button
              onClick={randomizeOrientation}
              className="p-2.5 rounded bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-600/60 text-cyan-200 font-bold flex flex-col justify-between h-16 transition-all"
            >
              <div className="flex items-center justify-between w-full">
                <Move3d size={14} className="text-cyan-400" />
                <span className="text-[10px] text-cyan-400 font-mono">3D</span>
              </div>
              <span className="text-xs text-left leading-tight">Random Rotation</span>
            </button>

            <button
              onClick={triggerSpatialBeepForMisplacedTool}
              className="p-2.5 rounded bg-orange-950/60 hover:bg-orange-900 border border-orange-600/60 text-orange-200 font-bold flex flex-col justify-between h-16 transition-all"
            >
              <div className="flex items-center justify-between w-full">
                <Volume2 size={14} className="text-orange-400" />
                <span className="text-[10px] text-orange-400 font-mono">HRTF</span>
              </div>
              <span className="text-xs text-left leading-tight">Spatial Audio</span>
            </button>

            <button
              onClick={performWrongStep}
              className="p-2.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold flex flex-col justify-between h-16 transition-all"
            >
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-xs text-left leading-tight">Wrong Step</span>
            </button>

            <button
              onClick={skipCurrentStep}
              className="p-2.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold flex flex-col justify-between h-16 transition-all"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-xs text-left leading-tight">Skip Step</span>
            </button>

            <button
              onClick={triggerObjectLost}
              className="p-2.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold flex flex-col justify-between h-16 transition-all"
            >
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <span className="text-xs text-left leading-tight">Object Lost</span>
            </button>

            <button
              onClick={triggerLowConfidence}
              className="p-2.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold flex flex-col justify-between h-16 transition-all"
            >
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              <span className="text-xs text-left leading-tight">Low Conf</span>
            </button>
          </div>
        </div>

        {/* Thermal Throttle Slider */}
        <div className="p-3 bg-slate-900 rounded border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <Flame size={14} className="text-[#F26B21]" />
              <span>Simulate Thermal Throttle:</span>
            </span>
            <span className="font-mono text-[#F26B21] font-bold text-sm">{thermalThrottlePercent}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={thermalThrottlePercent}
            onChange={(e) => setThermalThrottlePercent(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#F26B21]"
          />
          <span className="text-[11px] text-slate-400 block font-mono">
            Reduces FPS & triggers dt-based continuous filtering.
          </span>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="p-3 bg-[#071326] border-t border-slate-800 flex items-center justify-between">
        <button
          onClick={resetMission}
          className="btn-isro-outline text-xs font-bold"
        >
          <RefreshCw size={13} />
          <span>Reset Mission State</span>
        </button>

        <button
          onClick={() => setDemoMode('MONITORING')}
          className="btn-isro-cta text-xs font-bold"
        >
          Close Drawer
        </button>
      </div>
    </div>
  </>
);
};
