import React, { useState, useEffect } from 'react';
import { useMission } from '../context/MissionContext';
import {
  ChevronUp, ChevronDown, Flame, RefreshCw, X, Radio, Terminal
} from 'lucide-react';

export const DemoControlDrawer: React.FC = () => {
  const {
    demoMode, performCorrectStep, performWrongStep, skipCurrentStep,
    triggerObjectLost, triggerLowConfidence, recoverTracking, resetMission,
    triggerHandNearObjectNoStateChange, triggerSensorDisagreement, randomizeOrientation,
    thermalThrottlePercent, setThermalThrottlePercent, injectBitFlip,
    triggerSpatialBeepForMisplacedTool, currentStep, fsmState, missionStatus
  } = useMission();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Global 'S' key shortcut toggle for Simulation Drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (demoMode !== 'SIMULATION' && !isOpen) return null;

  return (
    <div className="fixed bottom-0 right-4 z-40 max-w-xl w-full sm:w-auto font-sans select-none">
      {/* Docked Drawer Container */}
      <div className="bg-slate-900 border border-slate-700 rounded-t-lg shadow-2xl overflow-hidden text-slate-100">
        {/* Toggle Bar Header */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="bg-slate-950 px-3.5 py-1.5 flex items-center justify-between cursor-pointer border-b border-slate-800 hover:bg-slate-800 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <Radio size={13} className="text-orange-400 animate-pulse" />
            <span className="font-bold text-xs text-white uppercase tracking-wider">
              SIMULATION DRAWER (PRESS 'S')
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-[11px] font-mono text-slate-400">
              STEP {currentStep} | <strong className="text-cyan-300 font-bold">{fsmState}</strong>
            </span>
            <button className="text-slate-400 hover:text-white p-0.5">
              {isOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </button>
          </div>
        </div>

        {/* Action Controls Body */}
        {isOpen && (
          <div className="p-3 bg-slate-900 space-y-2.5 max-h-[340px] overflow-y-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs">
              <button onClick={performCorrectStep} disabled={missionStatus === 'COMPLETED'} className="btn-sim-neutral">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Correct Step</span>
              </button>

              <button onClick={triggerHandNearObjectNoStateChange} className="btn-sim-neutral" title="Causal Verification Rejection">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span>Hand Near (Reject)</span>
              </button>

              <button onClick={triggerSensorDisagreement} className="btn-sim-neutral" title="Inject HOI sensor disagreement">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Sensor Disagree</span>
              </button>

              <button onClick={injectBitFlip} className="btn-sim-neutral" title="Inject SEU memory bit-flip">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <span>Inject Bit-Flip</span>
              </button>

              <button onClick={randomizeOrientation} className="btn-sim-neutral" title="Random 3D orientation tumble">
                <span className="w-2 h-2 rounded-full bg-cyan-500" />
                <span>Random Rotation</span>
              </button>

              <button onClick={triggerSpatialBeepForMisplacedTool} className="btn-sim-neutral" title="Spatial HRTF audio cue">
                <span className="w-2 h-2 rounded-full bg-orange-500" />
                <span>Spatial Cue</span>
              </button>

              <button onClick={performWrongStep} className="btn-sim-neutral">
                <span className="w-2 h-2 rounded-full bg-red-600" />
                <span>Wrong Step</span>
              </button>

              <button onClick={skipCurrentStep} className="btn-sim-neutral">
                <span className="w-2 h-2 rounded-full bg-amber-600" />
                <span>Skip Step</span>
              </button>

              <button onClick={triggerObjectLost} className="btn-sim-neutral">
                <span className="w-2 h-2 rounded-full bg-slate-500" />
                <span>Object Lost</span>
              </button>

              <button onClick={triggerLowConfidence} className="btn-sim-neutral">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                <span>Low Conf</span>
              </button>

              <button onClick={recoverTracking} className="btn-sim-neutral col-span-2">
                <span className="w-2 h-2 rounded-full bg-teal-500" />
                <span>Recover Tracking</span>
              </button>
            </div>

            {/* Thermal Throttle Slider */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Flame size={13} className="text-orange-400" />
                <span>Thermal Throttle:</span>
                <span className="font-mono text-orange-400 font-bold">{thermalThrottlePercent}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={thermalThrottlePercent}
                onChange={(e) => setThermalThrottlePercent(Number(e.target.value))}
                className="w-32 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>

            {/* Drawer Footer Reset */}
            <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-800 text-slate-400 font-mono">
              <span>Press 'S' to hide panel</span>
              <button
                onClick={resetMission}
                className="text-cyan-400 hover:underline font-bold flex items-center gap-1"
              >
                <RefreshCw size={10} />
                <span>Reset State</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
