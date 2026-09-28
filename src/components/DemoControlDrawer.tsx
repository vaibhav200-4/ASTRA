import React, { useEffect } from 'react';
import { useMission } from '../context/MissionContext';
import {
  X, Flame, RefreshCw, Radio, Hand, Move3d, Sliders, Zap, Volume2
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
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return;
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
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 z-50 w-96 bg-[#0A1A33] border-l border-slate-700 shadow-2xl flex flex-col justify-between select-none font-sans text-xs">
        {/* Header */}
        <div className="bg-[#071326] px-4 py-3 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Radio size={16} className="text-[#FFA366] animate-pulse" />
            <div>
              <h3 className="font-bold text-[#F1F5F9] text-sm">Simulation & Stress Tests</h3>
              <span className="text-[#B8C4D6] text-xs font-mono">Press 'S' key to toggle</span>
            </div>
          </div>

          <button
            onClick={() => setDemoMode('MONITORING')}
            className="text-[#B8C4D6] hover:text-[#F1F5F9] p-1 rounded hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Main 2-Column Grid of Large Controls */}
        <div className="p-4 flex-1 overflow-y-auto space-y-4">
          <div className="p-2.5 bg-slate-900 rounded border border-slate-800 font-mono text-xs">
            <span className="text-[#B8C4D6] block text-xs">ACTIVE FSM STATE</span>
            <span className="font-bold text-[#7DD3FC] text-sm">Step {currentStep} &bull; {fsmState}</span>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-[#F1F5F9] text-xs uppercase tracking-wider block font-sans">
              Protocol & Stress Test Controls
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={performCorrectStep}
                className="p-2.5 rounded bg-[#14532D] hover:bg-[#166534] border border-emerald-600/60 text-[#F1F5F9] font-bold flex flex-col justify-between h-16 transition-all"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4ADE80]" />
                  <span className="text-xs text-[#B8C4D6] font-mono font-bold">OK</span>
                </div>
                <span className="text-xs text-left leading-tight text-[#F1F5F9]">Correct Step</span>
              </button>

              <button
                onClick={triggerHandNearObjectNoStateChange}
                className="p-2.5 rounded bg-[#7F1D1D] hover:bg-[#991B1B] border border-red-600/60 text-[#F1F5F9] font-bold flex flex-col justify-between h-16 transition-all"
              >
                <div className="flex items-center justify-between w-full">
                  <Hand size={14} className="text-[#FF6B6B]" />
                  <span className="text-xs text-[#B8C4D6] font-mono font-bold">REJECT</span>
                </div>
                <span className="text-xs text-left leading-tight text-[#F1F5F9]">Hand Near (Reject)</span>
              </button>

              <button
                onClick={triggerSensorDisagreement}
                className="p-2.5 rounded bg-[#78350F] hover:bg-[#92400E] border border-amber-600/60 text-[#F1F5F9] font-bold flex flex-col justify-between h-16 transition-all"
              >
                <div className="flex items-center justify-between w-full">
                  <Sliders size={14} className="text-[#FBBF24]" />
                  <span className="text-xs text-[#B8C4D6] font-mono font-bold">DS FAULT</span>
                </div>
                <span className="text-xs text-left leading-tight text-[#F1F5F9]">Sensor Disagree</span>
              </button>

              <button
                onClick={injectBitFlip}
                className="p-2.5 rounded bg-[#4C1D95] hover:bg-[#5B21B6] border border-purple-600/60 text-[#F1F5F9] font-bold flex flex-col justify-between h-16 transition-all"
              >
                <div className="flex items-center justify-between w-full">
                  <Zap size={14} className="text-[#C084FC]" />
                  <span className="text-xs text-[#B8C4D6] font-mono font-bold">TMR</span>
                </div>
                <span className="text-xs text-left leading-tight text-[#F1F5F9]">Inject Bit-Flip</span>
              </button>

              <button
                onClick={randomizeOrientation}
                className="p-2.5 rounded bg-[#0369A1] hover:bg-[#0284C7] border border-cyan-600/60 text-[#F1F5F9] font-bold flex flex-col justify-between h-16 transition-all"
              >
                <div className="flex items-center justify-between w-full">
                  <Move3d size={14} className="text-[#7DD3FC]" />
                  <span className="text-xs text-[#B8C4D6] font-mono font-bold">3D</span>
                </div>
                <span className="text-xs text-left leading-tight text-[#F1F5F9]">Random Rotation</span>
              </button>

              <button
                onClick={triggerSpatialBeepForMisplacedTool}
                className="p-2.5 rounded bg-[#7C2D12] hover:bg-[#9A3412] border border-orange-600/60 text-[#F1F5F9] font-bold flex flex-col justify-between h-16 transition-all"
              >
                <div className="flex items-center justify-between w-full">
                  <Volume2 size={14} className="text-[#FFA366]" />
                  <span className="text-xs text-[#B8C4D6] font-mono font-bold">HRTF</span>
                </div>
                <span className="text-xs text-left leading-tight text-[#F1F5F9]">Spatial Audio</span>
              </button>

              <button
                onClick={performWrongStep}
                className="p-2.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[#F1F5F9] font-bold flex flex-col justify-between h-16 transition-all"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B6B]" />
                  <span className="text-xs text-[#B8C4D6] font-mono font-bold">ERROR</span>
                </div>
                <span className="text-xs text-left leading-tight text-[#F1F5F9]">Wrong Step</span>
              </button>

              <button
                onClick={skipCurrentStep}
                className="p-2.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[#F1F5F9] font-bold flex flex-col justify-between h-16 transition-all"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FBBF24]" />
                  <span className="text-xs text-[#B8C4D6] font-mono font-bold">SKIP</span>
                </div>
                <span className="text-xs text-left leading-tight text-[#F1F5F9]">Skip Step</span>
              </button>

              <button
                onClick={triggerObjectLost}
                className="p-2.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[#F1F5F9] font-bold flex flex-col justify-between h-16 transition-all"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#B8C4D6]" />
                  <span className="text-xs text-[#B8C4D6] font-mono font-bold">LOST</span>
                </div>
                <span className="text-xs text-left leading-tight text-[#F1F5F9]">Object Lost</span>
              </button>

              <button
                onClick={triggerLowConfidence}
                className="p-2.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[#F1F5F9] font-bold flex flex-col justify-between h-16 transition-all"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#818CF8]" />
                  <span className="text-xs text-[#B8C4D6] font-mono font-bold">CONF</span>
                </div>
                <span className="text-xs text-left leading-tight text-[#F1F5F9]">Low Conf</span>
              </button>
            </div>
          </div>

          {/* Thermal Throttle Slider */}
          <div className="p-3 bg-slate-900 rounded border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#F1F5F9] flex items-center gap-1.5 font-sans">
                <Flame size={14} className="text-[#FFA366]" />
                <span>Simulate Thermal Throttle:</span>
              </span>
              <span className="font-mono text-[#FFA366] font-bold text-sm">{thermalThrottlePercent}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={thermalThrottlePercent}
              onChange={(e) => setThermalThrottlePercent(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#F26B21]"
            />
            <span className="text-xs text-[#B8C4D6] block font-sans">
              Reduces FPS & triggers dt-based continuous filtering.
            </span>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="p-3 bg-[#071326] border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={resetMission}
            className="btn-isro-outline text-xs font-bold text-[#F1F5F9]"
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
