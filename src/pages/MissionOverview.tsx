import React, { useState } from 'react';
import { useMission } from '../context/MissionContext';
import { ProceduralRackViewport } from '../components/ProceduralRackViewport';
import { PipelineStrip } from '../components/PipelineStrip';
import { ErrorBoundary } from '../components/ErrorBoundary';
import {
  CheckCircle2, AlertTriangle, ShieldCheck, Activity, Clock, Sliders,
  Layers, Radio, Flame, RefreshCw, Zap, ArrowUpRight, Target, Hand, Move3d, Box
} from 'lucide-react';

interface MissionOverviewProps {
  setActiveTab: (tab: string) => void;
}

export const MissionOverview: React.FC<MissionOverviewProps> = ({ setActiveTab }) => {
  const {
    fps, latency, currentStep, completedSteps, fsmState,
    bayesData, fusionResult, alerts,
    performCorrectStep, triggerHandNearObjectNoStateChange,
    triggerSensorDisagreement, randomizeOrientation, setThermalThrottlePercent,
    injectBitFlip, triggerObjectLost, recoverTracking
  } = useMission();

  const [activeDemoTile, setActiveDemoTile] = useState<number | null>(null);

  const activeAlertsCount = alerts.filter(a => !a.resolved).length;

  const handleTileDemo = (tileId: number, action: () => void) => {
    setActiveDemoTile(tileId);
    action();
    setTimeout(() => setActiveDemoTile(null), 3000);
  };

  return (
    <div className="space-y-3 font-sans select-none max-w-[1440px] mx-auto pb-2">
      {/* 1. TOP KPI ROW (12 Columns Grid) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {/* KPI 1: Steps Verified */}
        <div
          onClick={() => setActiveTab('protocol')}
          className="isro-card p-2.5 bg-white dark:bg-[#0A1A33] border border-slate-700/80 hover:border-orange-500 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-sans">
            <span className="font-semibold text-slate-200">Steps Verified</span>
            <ArrowUpRight size={12} className="text-slate-500 group-hover:text-orange-400 transition-colors" />
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold font-mono text-emerald-400">
              {completedSteps.length} / 3
            </span>
            <span className="text-[10px] font-sans font-bold text-emerald-500 bg-emerald-950/60 px-1.5 py-0.2 rounded">
              Active
            </span>
          </div>
        </div>

        {/* KPI 2: Bayes Factor K */}
        <div
          onClick={() => setActiveTab('ai-monitor')}
          className="isro-card p-2.5 bg-white dark:bg-[#0A1A33] border border-slate-700/80 hover:border-orange-500 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-sans">
            <span className="font-semibold text-slate-200">Bayes Factor K</span>
            <ArrowUpRight size={12} className="text-slate-500 group-hover:text-orange-400 transition-colors" />
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold font-mono text-cyan-300">
              {(bayesData?.kValue ?? 48.0).toFixed(1)}
            </span>
            <span className="text-[10px] font-sans font-bold text-cyan-400 bg-cyan-950/60 px-1.5 py-0.2 rounded">
              Very Strong
            </span>
          </div>
        </div>

        {/* KPI 3: Fusion Conflict */}
        <div
          onClick={() => setActiveTab('ai-monitor')}
          className="isro-card p-2.5 bg-white dark:bg-[#0A1A33] border border-slate-700/80 hover:border-orange-500 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-sans">
            <span className="font-semibold text-slate-200">Fusion Conflict</span>
            <ArrowUpRight size={12} className="text-slate-500 group-hover:text-orange-400 transition-colors" />
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold font-mono text-orange-400">
              {fusionResult.kConflict.toFixed(2)}
            </span>
            <span className="text-[10px] font-sans font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded">
              Nominal
            </span>
          </div>
        </div>

        {/* KPI 4: FPS Telemetry */}
        <div
          onClick={() => setActiveTab('system')}
          className="isro-card p-2.5 bg-white dark:bg-[#0A1A33] border border-slate-700/80 hover:border-orange-500 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-sans">
            <span className="font-semibold text-slate-200">FPS Telemetry</span>
            <ArrowUpRight size={12} className="text-slate-500 group-hover:text-orange-400 transition-colors" />
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold font-mono text-white">
              {fps.toFixed(1)}
            </span>
            <span className="text-[10px] font-sans font-semibold text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded">
              Simulated
            </span>
          </div>
        </div>

        {/* KPI 5: Latency */}
        <div
          onClick={() => setActiveTab('system')}
          className="isro-card p-2.5 bg-white dark:bg-[#0A1A33] border border-slate-700/80 hover:border-orange-500 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-sans">
            <span className="font-semibold text-slate-200">Processing Latency</span>
            <ArrowUpRight size={12} className="text-slate-500 group-hover:text-orange-400 transition-colors" />
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold font-mono text-orange-400">
              {latency} ms
            </span>
            <span className="text-[10px] font-sans font-semibold text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded">
              Simulated
            </span>
          </div>
        </div>

        {/* KPI 6: Active Alerts */}
        <div
          onClick={() => setActiveTab('logs')}
          className="isro-card p-2.5 bg-white dark:bg-[#0A1A33] border border-slate-700/80 hover:border-orange-500 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-sans">
            <span className="font-semibold text-slate-200">Active Alerts</span>
            <ArrowUpRight size={12} className="text-slate-500 group-hover:text-orange-400 transition-colors" />
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span className={`text-xl font-bold font-mono ${activeAlertsCount > 0 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
              {activeAlertsCount} Active
            </span>
            <span className={`text-[10px] font-sans font-bold px-1.5 py-0.2 rounded ${activeAlertsCount > 0 ? 'bg-red-950 text-red-300' : 'bg-emerald-950 text-emerald-400'}`}>
              {activeAlertsCount > 0 ? 'Action Req' : 'Nominal'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. MAIN DASHBOARD CONTENT GRID (12 Cols: 8 Left / 4 Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* LEFT 8 COLS: VIEWPORT & CONNECTED PIPELINE FLOW */}
        <div className="lg:col-span-8 space-y-2">
          {/* Phase 1 Procedural Rack Camera Viewport */}
          <div className="isro-card p-2 bg-white dark:bg-[#0A1A33]">
            <ErrorBoundary fallbackTitle="Procedural Viewport Notice">
              <ProceduralRackViewport />
            </ErrorBoundary>
          </div>

          {/* Live Pipeline Strip */}
          <ErrorBoundary fallbackTitle="Pipeline Strip Notice">
            <PipelineStrip />
          </ErrorBoundary>
        </div>

        {/* RIGHT 4 COLS: PROTOCOL STEPPER & 6-TILE DEMO ICON GRID */}
        <div className="lg:col-span-4 space-y-2">
          {/* Vertical Protocol Stepper Timeline */}
          <div className="isro-card p-3 bg-white dark:bg-[#0A1A33] space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                <Clock size={13} className="text-orange-400" />
                <span>Protocol Execution Timeline</span>
              </h3>
              <span className="text-[10px] font-sans font-bold text-cyan-400 bg-slate-800 px-2 py-0.5 rounded">
                FSM: {fsmState}
              </span>
            </div>

            {/* Stepper Timeline List */}
            <div className="space-y-2">
              {/* Step 1 */}
              <div className={`p-2 rounded border text-xs transition-all ${
                completedSteps.includes(1)
                  ? 'bg-emerald-950/40 border-emerald-600/60 text-emerald-300'
                  : currentStep === 1
                  ? 'bg-slate-800 border-orange-500 text-white font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[11px]">Step 01 — Open Red Experiment Box</span>
                  {completedSteps.includes(1) ? (
                    <span className="text-emerald-400 font-bold text-[10px] flex items-center gap-1">
                      <CheckCircle2 size={12} /> Done
                    </span>
                  ) : currentStep === 1 ? (
                    <span className="text-orange-400 font-bold text-[10px]">● Active</span>
                  ) : (
                    <span className="text-slate-500 text-[10px]">Pending</span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">
                  Evidence: Physical Lid Displacement Confirmed (BF K=48.0)
                </div>
              </div>

              {/* Step 2 */}
              <div className={`p-2 rounded border text-xs transition-all ${
                completedSteps.includes(2)
                  ? 'bg-emerald-950/40 border-emerald-600/60 text-emerald-300'
                  : currentStep === 2
                  ? 'bg-slate-800 border-orange-500 text-white font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[11px]">Step 02 — Remove Yellow Container</span>
                  {completedSteps.includes(2) ? (
                    <span className="text-emerald-400 font-bold text-[10px] flex items-center gap-1">
                      <CheckCircle2 size={12} /> Done
                    </span>
                  ) : currentStep === 2 ? (
                    <span className="text-orange-400 font-bold text-[10px]">● Active</span>
                  ) : (
                    <span className="text-slate-500 text-[10px]">Pending</span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">
                  Evidence: HOI Vector Grasp + Rack Coordinates Shift
                </div>
              </div>

              {/* Step 3 */}
              <div className={`p-2 rounded border text-xs transition-all ${
                completedSteps.includes(3)
                  ? 'bg-emerald-950/40 border-emerald-600/60 text-emerald-300'
                  : currentStep === 3
                  ? 'bg-slate-800 border-orange-500 text-white font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[11px]">Step 03 — Place Container in Rack</span>
                  {completedSteps.includes(3) ? (
                    <span className="text-emerald-400 font-bold text-[10px] flex items-center gap-1">
                      <CheckCircle2 size={12} /> Done
                    </span>
                  ) : currentStep === 3 ? (
                    <span className="text-orange-400 font-bold text-[10px]">● Active</span>
                  ) : (
                    <span className="text-slate-500 text-[10px]">Pending</span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">
                  Evidence: Container Locked in Target Rack Slot (99.1%)
                </div>
              </div>
            </div>
          </div>

          {/* 6-TILE DEMO ICON GRID (Titles ≤ 4 words) */}
          <div className="isro-card p-3 bg-white dark:bg-[#0A1A33] space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                <Zap size={13} className="text-orange-400" />
                <span>Interactive Live Demos</span>
              </h3>
              <span className="text-[9px] font-sans text-slate-400">Click tile to test</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {/* Tile 1 */}
              <div
                onClick={() => handleTileDemo(1, triggerHandNearObjectNoStateChange)}
                className={`p-2 rounded border text-xs cursor-pointer transition-all flex flex-col justify-between h-20 ${
                  activeDemoTile === 1
                    ? 'border-red-500 bg-red-950/60 ring-2 ring-red-500'
                    : 'border-slate-800 bg-slate-900 hover:border-orange-500 hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Hand size={14} className="text-red-400" />
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                </div>
                <span className="font-semibold text-[11px] text-slate-200 leading-tight">
                  Hand Near Object
                </span>
                <span className="text-[9px] text-slate-400">Causal Reject</span>
              </div>

              {/* Tile 2 */}
              <div
                onClick={() => handleTileDemo(2, randomizeOrientation)}
                className={`p-2 rounded border text-xs cursor-pointer transition-all flex flex-col justify-between h-20 ${
                  activeDemoTile === 2
                    ? 'border-cyan-500 bg-cyan-950/60 ring-2 ring-cyan-500'
                    : 'border-slate-800 bg-slate-900 hover:border-orange-500 hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Move3d size={14} className="text-cyan-400" />
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                </div>
                <span className="font-semibold text-[11px] text-slate-200 leading-tight">
                  No Fixed Up/Down
                </span>
                <span className="text-[9px] text-slate-400">Random Rotate</span>
              </div>

              {/* Tile 3 */}
              <div
                onClick={() => handleTileDemo(3, triggerSensorDisagreement)}
                className={`p-2 rounded border text-xs cursor-pointer transition-all flex flex-col justify-between h-20 ${
                  activeDemoTile === 3
                    ? 'border-amber-500 bg-amber-950/60 ring-2 ring-amber-500'
                    : 'border-slate-800 bg-slate-900 hover:border-orange-500 hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Sliders size={14} className="text-amber-400" />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                </div>
                <span className="font-semibold text-[11px] text-slate-200 leading-tight">
                  Sensor Disagreement
                </span>
                <span className="text-[9px] text-slate-400">DS Conflict</span>
              </div>

              {/* Tile 4 */}
              <div
                onClick={() => handleTileDemo(4, injectBitFlip)}
                className={`p-2 rounded border text-xs cursor-pointer transition-all flex flex-col justify-between h-20 ${
                  activeDemoTile === 4
                    ? 'border-purple-500 bg-purple-950/60 ring-2 ring-purple-500'
                    : 'border-slate-800 bg-slate-900 hover:border-orange-500 hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Zap size={14} className="text-purple-400" />
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                </div>
                <span className="font-semibold text-[11px] text-slate-200 leading-tight">
                  Radiation Bit-Flip
                </span>
                <span className="text-[9px] text-slate-400">TMR Scrubbing</span>
              </div>

              {/* Tile 5 */}
              <div
                onClick={() => handleTileDemo(5, () => setThermalThrottlePercent(65))}
                className={`p-2 rounded border text-xs cursor-pointer transition-all flex flex-col justify-between h-20 ${
                  activeDemoTile === 5
                    ? 'border-orange-500 bg-orange-950/60 ring-2 ring-orange-500'
                    : 'border-slate-800 bg-slate-900 hover:border-orange-500 hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Flame size={14} className="text-orange-400" />
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                </div>
                <span className="font-semibold text-[11px] text-slate-200 leading-tight">
                  Thermal Throttle
                </span>
                <span className="text-[9px] text-slate-400">dt Continuity</span>
              </div>

              {/* Tile 6 */}
              <div
                onClick={() => handleTileDemo(6, () => { triggerObjectLost(); setTimeout(recoverTracking, 2000); })}
                className={`p-2 rounded border text-xs cursor-pointer transition-all flex flex-col justify-between h-20 ${
                  activeDemoTile === 6
                    ? 'border-emerald-500 bg-emerald-950/60 ring-2 ring-emerald-500'
                    : 'border-slate-800 bg-slate-900 hover:border-orange-500 hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Target size={14} className="text-emerald-400" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
                <span className="font-semibold text-[11px] text-slate-200 leading-tight">
                  Occlusion Recovery
                </span>
                <span className="text-[9px] text-slate-400">Re-Identify</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
