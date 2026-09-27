import React, { useState } from 'react';
import { useMission } from '../context/MissionContext';
import { Play, AlertTriangle, FastForward, EyeOff, ShieldAlert, RefreshCw, ChevronUp, ChevronDown, Sparkles, Sliders } from 'lucide-react';

export const DemoControlDrawer: React.FC = () => {
  const { 
    demoMode, performCorrectStep, performWrongStep, skipCurrentStep, 
    triggerObjectLost, triggerLowConfidence, recoverTracking, resetMission,
    currentStep, fsmState, missionStatus 
  } = useMission();

  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  if (demoMode !== 'SIMULATION') return null;

  return (
    <div className="fixed bottom-3 right-4 z-40 max-w-xl w-full sm:w-auto font-sans animate-in fade-in slide-in-from-bottom duration-300">
      <div className="glass-card bg-[#080d19]/95 backdrop-blur-md border-2 border-amber-500/80 rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.25)] overflow-hidden text-white">
        {/* Drawer Header Toggle */}
        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-slate-950/90 px-4 py-2.5 flex items-center justify-between cursor-pointer border-b border-slate-800 select-none hover:bg-slate-900 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <Sparkles size={16} className="text-amber-400 animate-pulse" />
            <span className="font-extrabold font-mono text-xs text-amber-400 tracking-wider">
              DEMO & JUDGE SIMULATION CONTROLS
            </span>
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-bold px-1.5 py-0.2 rounded font-mono">
              LIVE SIM
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-[11px] font-mono text-slate-300">
              STEP {currentStep} | <span className="text-amber-400 font-bold">{fsmState}</span>
            </span>
            <button className="text-slate-400 hover:text-white p-0.5">
              {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </button>
          </div>
        </div>

        {/* Collapsible Action Buttons Panel */}
        {isExpanded && (
          <div className="p-3.5 bg-slate-950/80 space-y-2.5">
            <p className="text-[11px] text-slate-400 font-mono leading-tight">
              Interactive test controls: simulate valid step completion, protocol deviation alerts, object tracking loss, low confidence, and state machine recovery.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {/* Perform Correct Step */}
              <button
                onClick={performCorrectStep}
                disabled={missionStatus === 'COMPLETED'}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-50 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center space-x-1.5 transition-all font-mono border border-emerald-400"
              >
                <Play size={14} className="fill-current" />
                <span>CORRECT STEP</span>
              </button>

              {/* Perform Wrong Step */}
              <button
                onClick={performWrongStep}
                className="px-3 py-2 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center space-x-1.5 transition-all font-mono border border-red-400"
              >
                <AlertTriangle size={14} />
                <span>WRONG STEP</span>
              </button>

              {/* Skip Current Step */}
              <button
                onClick={skipCurrentStep}
                className="px-3 py-2 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center space-x-1.5 transition-all font-mono border border-amber-400"
              >
                <FastForward size={14} />
                <span>SKIP STEP</span>
              </button>

              {/* Object Lost */}
              <button
                onClick={triggerObjectLost}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs rounded-xl shadow flex items-center justify-center space-x-1.5 transition-all font-mono border border-slate-700"
              >
                <EyeOff size={14} className="text-slate-400" />
                <span>OBJECT LOST</span>
              </button>

              {/* Low Confidence */}
              <button
                onClick={triggerLowConfidence}
                className="px-3 py-2 bg-purple-950/80 hover:bg-purple-900 text-purple-200 font-bold text-xs rounded-xl shadow flex items-center justify-center space-x-1.5 transition-all font-mono border border-purple-800"
              >
                <ShieldAlert size={14} className="text-purple-400" />
                <span>LOW CONF</span>
              </button>

              {/* Recover Tracking */}
              <button
                onClick={recoverTracking}
                className="px-3 py-2 bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 font-bold text-xs rounded-xl shadow flex items-center justify-center space-x-1.5 transition-all font-mono border border-cyan-700"
              >
                <RefreshCw size={14} className="text-cyan-400" />
                <span>RECOVER</span>
              </button>
            </div>

            {/* Quick Reset Link */}
            <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-slate-800/80 text-slate-400 font-mono">
              <span>Jetson Xavier Edge AI Emulator</span>
              <button 
                onClick={resetMission}
                className="text-amber-400 hover:text-amber-300 font-bold flex items-center space-x-1 transition-colors"
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
