import React, { useState } from 'react';
import { useMission } from '../context/MissionContext';
import { Play, AlertTriangle, FastForward, EyeOff, ShieldAlert, RefreshCw, ChevronUp, ChevronDown, Sparkles } from 'lucide-react';

export const DemoControlDrawer: React.FC = () => {
  const { 
    demoMode, performCorrectStep, performWrongStep, skipCurrentStep, 
    triggerObjectLost, triggerLowConfidence, recoverTracking, resetMission,
    currentStep, fsmState, missionStatus 
  } = useMission();

  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  if (demoMode !== 'SIMULATION') return null;

  return (
    <div className="fixed bottom-3 right-4 z-40 max-w-xl font-sans animate-in fade-in slide-in-from-bottom duration-300">
      <div className="bg-[#071B33] border-2 border-saffron-500 rounded-lg shadow-2xl overflow-hidden text-white">
        {/* Drawer Header Toggle */}
        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-[#041021] px-3.5 py-2 flex items-center justify-between cursor-pointer border-b border-navy-800 select-none hover:bg-navy-900 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <Sparkles size={16} className="text-saffron-400 animate-pulse" />
            <span className="font-bold font-mono text-xs text-saffron-400 tracking-wider">
              DEMO & JUDGE SIMULATION CONTROLS
            </span>
            <span className="bg-saffron-500/20 text-saffron-300 border border-saffron-500/40 text-[10px] font-bold px-1.5 py-0.2 rounded">
              PROTOTYPE
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-[11px] font-mono text-slate-300">
              STEP: {currentStep} | FSM: <span className="text-saffron-400">{fsmState}</span>
            </span>
            <button className="text-slate-400 hover:text-white">
              {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </button>
          </div>
        </div>

        {/* Collapsible Action Buttons Panel */}
        {isExpanded && (
          <div className="p-3 bg-navy-900 space-y-2.5">
            <p className="text-[11px] text-slate-300 leading-tight">
              Test full operational loop: valid state transitions, deviation warnings, sequence violations, low confidence, and tracking loss.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {/* Perform Correct Step */}
              <button
                onClick={performCorrectStep}
                disabled={missionStatus === 'COMPLETED'}
                className="px-2.5 py-2 bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs rounded shadow flex items-center justify-center space-x-1.5 transition-colors border border-emerald-500"
              >
                <Play size={14} className="fill-current" />
                <span>CORRECT STEP</span>
              </button>

              {/* Perform Wrong Step */}
              <button
                onClick={performWrongStep}
                className="px-2.5 py-2 bg-red-700 hover:bg-red-600 active:bg-red-800 text-white font-bold text-xs rounded shadow flex items-center justify-center space-x-1.5 transition-colors border border-red-500"
              >
                <AlertTriangle size={14} />
                <span>WRONG STEP</span>
              </button>

              {/* Skip Current Step */}
              <button
                onClick={skipCurrentStep}
                className="px-2.5 py-2 bg-amber-700 hover:bg-amber-600 active:bg-amber-800 text-white font-bold text-xs rounded shadow flex items-center justify-center space-x-1.5 transition-colors border border-amber-500"
              >
                <FastForward size={14} />
                <span>SKIP STEP</span>
              </button>

              {/* Object Lost */}
              <button
                onClick={triggerObjectLost}
                className="px-2.5 py-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-slate-200 font-bold text-xs rounded shadow flex items-center justify-center space-x-1.5 transition-colors border border-slate-600"
              >
                <EyeOff size={14} />
                <span>OBJECT LOST</span>
              </button>

              {/* Low Confidence */}
              <button
                onClick={triggerLowConfidence}
                className="px-2.5 py-2 bg-purple-900 hover:bg-purple-800 active:bg-purple-950 text-purple-200 font-bold text-xs rounded shadow flex items-center justify-center space-x-1.5 transition-colors border border-purple-600"
              >
                <ShieldAlert size={14} />
                <span>LOW CONFIDENCE</span>
              </button>

              {/* Recover Tracking */}
              <button
                onClick={recoverTracking}
                className="px-2.5 py-2 bg-blue-700 hover:bg-blue-600 active:bg-blue-800 text-white font-bold text-xs rounded shadow flex items-center justify-center space-x-1.5 transition-colors border border-blue-500"
              >
                <RefreshCw size={14} />
                <span>RECOVER TRACKING</span>
              </button>
            </div>

            {/* Quick Reset Link */}
            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-navy-800 text-slate-400">
              <span>Simulated Inference Mode — Edge Jetson Xavier</span>
              <button 
                onClick={resetMission}
                className="text-saffron-400 hover:underline font-semibold flex items-center space-x-1"
              >
                <RefreshCw size={12} />
                <span>Reset Simulation</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
