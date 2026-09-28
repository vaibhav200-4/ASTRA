import React, { useState } from 'react';
import { useMission } from '../context/MissionContext';
import { 
  Play, AlertTriangle, FastForward, EyeOff, ShieldAlert, RefreshCw, 
  ChevronUp, ChevronDown, Sliders, Cpu, RotateCw, Volume2, Flame
} from 'lucide-react';

export const DemoControlDrawer: React.FC = () => {
  const { 
    demoMode, performCorrectStep, performWrongStep, skipCurrentStep, 
    triggerObjectLost, triggerLowConfidence, recoverTracking, resetMission,
    triggerHandNearObjectNoStateChange, triggerSensorDisagreement, randomizeOrientation,
    thermalThrottlePercent, setThermalThrottlePercent, injectBitFlip,
    triggerSpatialBeepForMisplacedTool, currentStep, fsmState, missionStatus 
  } = useMission();

  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  if (demoMode !== 'SIMULATION') return null;

  return (
    <div className="fixed bottom-3 right-4 z-40 max-w-2xl w-full sm:w-auto font-sans">
      <div className="bg-white dark:bg-[#0A1A33] border border-[#D5DCE6] dark:border-slate-700 rounded-md shadow-lg overflow-hidden text-[#1B2430] dark:text-slate-100">
        {/* Drawer Header */}
        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-[#EEF3FA] dark:bg-slate-900 px-3.5 py-2 flex items-center justify-between cursor-pointer border-b border-[#D5DCE6] dark:border-slate-800 select-none hover:bg-[#DDE7F7] dark:hover:bg-slate-800 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#F26B21] animate-pulse"></span>
            <span className="font-bold text-xs text-[#0B2A5B] dark:text-cyan-300">
              SIMULATION CONTROLS & STRESS TESTS
            </span>
            <span className="bg-[#123F8C] text-white text-[10px] font-semibold px-1.5 py-0.2 rounded font-mono">
              DEMO PANEL
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs font-mono text-[#5B6675] dark:text-slate-300">
              STEP {currentStep} | <span className="text-[#123F8C] dark:text-cyan-400 font-bold">{fsmState}</span>
            </span>
            <button className="text-[#5B6675] dark:text-slate-400 hover:text-black dark:hover:text-white p-0.5">
              {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </button>
          </div>
        </div>

        {/* Action Panel */}
        {isExpanded && (
          <div className="p-3 bg-white dark:bg-[#0A1A33] space-y-3">
            <p className="text-xs text-[#5B6675] dark:text-slate-300 font-sans">
              Interactive test controls: simulate causal rejection, Dempster-Shafer sensor disagreement, bit-flips, microgravity rotations, thermal throttle, and audio cueing.
            </p>

            {/* Neutral Buttons with Colored Dots */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1.5">
              {/* Correct Step */}
              <button
                onClick={performCorrectStep}
                disabled={missionStatus === 'COMPLETED'}
                className="btn-sim-neutral"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span>Correct Step</span>
              </button>

              {/* Hand Near Object (No State Change) */}
              <button
                onClick={triggerHandNearObjectNoStateChange}
                className="btn-sim-neutral"
                title="Causal Verification Rejection Test"
              >
                <span className="w-2 h-2 rounded-full bg-red-600"></span>
                <span>Hand Near (No Change)</span>
              </button>

              {/* Sensor Disagreement */}
              <button
                onClick={triggerSensorDisagreement}
                className="btn-sim-neutral"
                title="Inject HOI sensor conflict into Dempster-Shafer engine"
              >
                <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                <span>Sensor Disagree</span>
              </button>

              {/* Inject Bit-Flip */}
              <button
                onClick={injectBitFlip}
                className="btn-sim-neutral"
                title="Inject bit-flip into TMR memory copy"
              >
                <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                <span>Inject Bit-Flip</span>
              </button>

              {/* Randomize Orientation */}
              <button
                onClick={randomizeOrientation}
                className="btn-sim-neutral"
                title="Apply random 3D rotation in camera frame"
              >
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>Random Rotation</span>
              </button>

              {/* Spatial Audio Beep */}
              <button
                onClick={triggerSpatialBeepForMisplacedTool}
                className="btn-sim-neutral"
                title="Play 3D HRTF spatial audio cue"
              >
                <span className="w-2 h-2 rounded-full bg-[#F26B21]"></span>
                <span>Spatial Audio</span>
              </button>

              {/* Wrong Step */}
              <button
                onClick={performWrongStep}
                className="btn-sim-neutral"
              >
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span>Wrong Step</span>
              </button>

              {/* Skip Step */}
              <button
                onClick={skipCurrentStep}
                className="btn-sim-neutral"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Skip Step</span>
              </button>

              {/* Object Lost */}
              <button
                onClick={triggerObjectLost}
                className="btn-sim-neutral"
              >
                <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                <span>Object Lost</span>
              </button>

              {/* Low Conf */}
              <button
                onClick={triggerLowConfidence}
                className="btn-sim-neutral"
              >
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                <span>Low Confidence</span>
              </button>

              {/* Recover */}
              <button
                onClick={recoverTracking}
                className="btn-sim-neutral col-span-2"
              >
                <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                <span>Recover Tracking</span>
              </button>
            </div>

            {/* Thermal Throttle Slider */}
            <div className="pt-2 border-t border-[#EEF3FA] dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-[#0B2A5B] dark:text-slate-200">
                <Flame size={14} className="text-[#F26B21]" />
                <span>Simulate Thermal Throttle:</span>
                <span className="font-mono text-[#F26B21]">{thermalThrottlePercent}%</span>
              </div>
              <input 
                type="range"
                min="0"
                max="100"
                value={thermalThrottlePercent}
                onChange={(e) => setThermalThrottlePercent(Number(e.target.value))}
                className="w-36 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#F26B21]"
              />
            </div>

            {/* Footer Note */}
            <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-[#EEF3FA] dark:border-slate-800 text-[#5B6675] dark:text-slate-400 font-mono">
              <span>Jetson-class edge platform (emulated)</span>
              <button 
                onClick={resetMission}
                className="text-[#123F8C] dark:text-cyan-400 hover:underline font-semibold flex items-center gap-1"
              >
                <RefreshCw size={11} />
                <span>Reset State</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
