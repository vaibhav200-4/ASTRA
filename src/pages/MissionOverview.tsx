import React, { useState } from 'react';
import { useMission } from '../context/MissionContext';
import { ProceduralRackViewport } from '../components/ProceduralRackViewport';
import { PipelineStrip } from '../components/PipelineStrip';
import { ErrorBoundary } from '../components/ErrorBoundary';
import {
  CheckCircle2, Clock, Sliders,
  Radio, Flame, Move3d, ArrowUpRight, Hand, Box
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
    injectBitFlip
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {/* KPI 1: Steps Verified */}
        <div
          onClick={() => setActiveTab('protocol')}
          className="isro-card p-3 bg-white dark:bg-[#0A1A33] border border-[#D5DCE6] dark:border-slate-800 hover:border-[#F26B21] dark:hover:border-[#FFA366] cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-xs text-[#4A5568] dark:text-[#B8C4D6] font-sans">
            <span className="font-semibold text-[#1B2430] dark:text-[#F1F5F9]">Steps Verified</span>
            <ArrowUpRight size={14} className="text-[#4A5568] dark:text-[#B8C4D6] group-hover:text-[#F26B21] dark:group-hover:text-[#FFA366] transition-colors" />
          </div>
          <div className="flex items-baseline justify-between mt-1.5">
            <span className="text-2xl font-bold font-mono text-[#0F6B06] dark:text-[#4ADE80]">
              {completedSteps.length} / 3
            </span>
            <span className="text-xs font-sans font-bold text-white bg-[#14532D] px-2 py-0.5 rounded">
              Active
            </span>
          </div>
        </div>

        {/* KPI 2: Bayes Factor K */}
        <div
          onClick={() => setActiveTab('ai-monitor')}
          className="isro-card p-3 bg-white dark:bg-[#0A1A33] border border-[#D5DCE6] dark:border-slate-800 hover:border-[#F26B21] dark:hover:border-[#FFA366] cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-xs text-[#4A5568] dark:text-[#B8C4D6] font-sans">
            <span className="font-semibold text-[#1B2430] dark:text-[#F1F5F9]">Bayes Factor K</span>
            <ArrowUpRight size={14} className="text-[#4A5568] dark:text-[#B8C4D6] group-hover:text-[#F26B21] dark:group-hover:text-[#FFA366] transition-colors" />
          </div>
          <div className="flex items-baseline justify-between mt-1.5">
            <span className="text-2xl font-bold font-mono text-[#123F8C] dark:text-[#7DD3FC]">
              {(bayesData?.kValue ?? 48.0).toFixed(1)}
            </span>
            <span className="text-xs font-sans font-bold text-[#F1F5F9] bg-[#0284C7] px-2 py-0.5 rounded">
              Very Strong
            </span>
          </div>
        </div>

        {/* KPI 3: Fusion Conflict */}
        <div
          onClick={() => setActiveTab('ai-monitor')}
          className="isro-card p-3 bg-white dark:bg-[#0A1A33] border border-[#D5DCE6] dark:border-slate-800 hover:border-[#F26B21] dark:hover:border-[#FFA366] cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-xs text-[#4A5568] dark:text-[#B8C4D6] font-sans">
            <span className="font-semibold text-[#1B2430] dark:text-[#F1F5F9]">Fusion Conflict</span>
            <ArrowUpRight size={14} className="text-[#4A5568] dark:text-[#B8C4D6] group-hover:text-[#F26B21] dark:group-hover:text-[#FFA366] transition-colors" />
          </div>
          <div className="flex items-baseline justify-between mt-1.5">
            <span className="text-2xl font-bold font-mono text-[#F26B21] dark:text-[#FFA366]">
              {fusionResult.kConflict.toFixed(2)}
            </span>
            <span className="text-xs font-sans font-bold text-white bg-[#14532D] px-2 py-0.5 rounded">
              Nominal
            </span>
          </div>
        </div>

        {/* KPI 4: FPS Telemetry */}
        <div
          onClick={() => setActiveTab('system')}
          className="isro-card p-3 bg-white dark:bg-[#0A1A33] border border-[#D5DCE6] dark:border-slate-800 hover:border-[#F26B21] dark:hover:border-[#FFA366] cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-xs text-[#4A5568] dark:text-[#B8C4D6] font-sans">
            <span className="font-semibold text-[#1B2430] dark:text-[#F1F5F9]">FPS Telemetry</span>
            <ArrowUpRight size={14} className="text-[#4A5568] dark:text-[#B8C4D6] group-hover:text-[#F26B21] dark:group-hover:text-[#FFA366] transition-colors" />
          </div>
          <div className="flex items-baseline justify-between mt-1.5">
            <span className="text-2xl font-bold font-mono text-[#1B2430] dark:text-[#F1F5F9]">
              {fps.toFixed(1)}
            </span>
            <span className="text-xs font-sans font-bold text-[#F1F5F9] bg-[#1E293B] px-2 py-0.5 rounded">
              Simulated
            </span>
          </div>
        </div>

        {/* KPI 5: Latency */}
        <div
          onClick={() => setActiveTab('system')}
          className="isro-card p-3 bg-white dark:bg-[#0A1A33] border border-[#D5DCE6] dark:border-slate-800 hover:border-[#F26B21] dark:hover:border-[#FFA366] cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-xs text-[#4A5568] dark:text-[#B8C4D6] font-sans">
            <span className="font-semibold text-[#1B2430] dark:text-[#F1F5F9]">Processing Latency</span>
            <ArrowUpRight size={14} className="text-[#4A5568] dark:text-[#B8C4D6] group-hover:text-[#F26B21] dark:group-hover:text-[#FFA366] transition-colors" />
          </div>
          <div className="flex items-baseline justify-between mt-1.5">
            <span className="text-2xl font-bold font-mono text-[#F26B21] dark:text-[#FFA366]">
              {latency} ms
            </span>
            <span className="text-xs font-sans font-bold text-[#F1F5F9] bg-[#1E293B] px-2 py-0.5 rounded">
              Simulated
            </span>
          </div>
        </div>

        {/* KPI 6: Active Alerts */}
        <div
          onClick={() => setActiveTab('logs')}
          className="isro-card p-3 bg-white dark:bg-[#0A1A33] border border-[#D5DCE6] dark:border-slate-800 hover:border-[#F26B21] dark:hover:border-[#FFA366] cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-xs text-[#4A5568] dark:text-[#B8C4D6] font-sans">
            <span className="font-semibold text-[#1B2430] dark:text-[#F1F5F9]">Active Alerts</span>
            <ArrowUpRight size={14} className="text-[#4A5568] dark:text-[#B8C4D6] group-hover:text-[#F26B21] dark:group-hover:text-[#FFA366] transition-colors" />
          </div>
          <div className="flex items-baseline justify-between mt-1.5">
            <span className={`text-2xl font-bold font-mono ${activeAlertsCount > 0 ? 'text-[#FF6B6B] animate-pulse' : 'text-[#0F6B06] dark:text-[#4ADE80]'}`}>
              {activeAlertsCount}
            </span>
            <span className={`text-xs font-sans font-bold px-2 py-0.5 rounded text-white ${activeAlertsCount > 0 ? 'bg-[#991B1B]' : 'bg-[#14532D]'}`}>
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
          <div className="isro-card p-3.5 bg-white dark:bg-[#0A1A33] space-y-3">
            <div className="flex items-center justify-between border-b border-[#D5DCE6] dark:border-slate-800 pb-2">
              <h3 className="text-sm font-semibold text-[#1B2430] dark:text-[#F1F5F9] flex items-center gap-2 font-sans border-l-[3px] border-[#F26B21] pl-2">
                <Clock size={15} className="text-[#F26B21] dark:text-[#FFA366]" />
                <span>Protocol Execution Timeline</span>
              </h3>
              <span className="text-xs font-sans font-bold text-[#F1F5F9] bg-[#0284C7] px-2.5 py-0.5 rounded">
                FSM: {fsmState}
              </span>
            </div>

            {/* Stepper Timeline List */}
            <div className="space-y-2">
              {/* Step 1 */}
              <div className={`p-2.5 rounded border text-xs transition-all ${
                completedSteps.includes(1)
                  ? 'bg-[#14532D] border-[#166534] text-white font-semibold'
                  : currentStep === 1
                  ? 'bg-slate-900 border-[#F26B21] text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-[#4A5568] dark:text-[#B8C4D6]'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs">Step 01 — Open Red Experiment Box</span>
                  {completedSteps.includes(1) ? (
                    <span className="text-[#86EFAC] font-bold text-xs flex items-center gap-1">
                      <CheckCircle2 size={13} /> Done
                    </span>
                  ) : currentStep === 1 ? (
                    <span className="text-[#FFA366] font-bold text-xs">&bull; Active</span>
                  ) : (
                    <span className="text-[#4A5568] dark:text-[#B8C4D6] text-xs font-medium">Pending</span>
                  )}
                </div>
                <div className="text-xs mt-1 font-mono opacity-90">
                  Evidence: Physical Lid Displacement Confirmed (BF K=48.0)
                </div>
              </div>

              {/* Step 2 */}
              <div className={`p-2.5 rounded border text-xs transition-all ${
                completedSteps.includes(2)
                  ? 'bg-[#14532D] border-[#166534] text-white font-semibold'
                  : currentStep === 2
                  ? 'bg-slate-900 border-[#F26B21] text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-[#4A5568] dark:text-[#B8C4D6]'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs">Step 02 — Remove Yellow Container</span>
                  {completedSteps.includes(2) ? (
                    <span className="text-[#86EFAC] font-bold text-xs flex items-center gap-1">
                      <CheckCircle2 size={13} /> Done
                    </span>
                  ) : currentStep === 2 ? (
                    <span className="text-[#FFA366] font-bold text-xs">&bull; Active</span>
                  ) : (
                    <span className="text-[#4A5568] dark:text-[#B8C4D6] text-xs font-medium">Pending</span>
                  )}
                </div>
                <div className="text-xs mt-1 font-mono opacity-90">
                  Evidence: HOI Vector Grasp + Rack Coordinates Shift
                </div>
              </div>

              {/* Step 3 */}
              <div className={`p-2.5 rounded border text-xs transition-all ${
                completedSteps.includes(3)
                  ? 'bg-[#14532D] border-[#166534] text-white font-semibold'
                  : currentStep === 3
                  ? 'bg-slate-900 border-[#F26B21] text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-[#4A5568] dark:text-[#B8C4D6]'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs">Step 03 — Place Container in Rack</span>
                  {completedSteps.includes(3) ? (
                    <span className="text-[#86EFAC] font-bold text-xs flex items-center gap-1">
                      <CheckCircle2 size={13} /> Done
                    </span>
                  ) : currentStep === 3 ? (
                    <span className="text-[#FFA366] font-bold text-xs">&bull; Active</span>
                  ) : (
                    <span className="text-[#4A5568] dark:text-[#B8C4D6] text-xs font-medium">Pending</span>
                  )}
                </div>
                <div className="text-xs mt-1 font-mono opacity-90">
                  Evidence: Docking Slot Proximity & Latched State
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Live Demos (6 Icon Grid) */}
          <div className="isro-card p-3.5 bg-white dark:bg-[#0A1A33] space-y-2.5">
            <div className="flex items-center justify-between border-b border-[#D5DCE6] dark:border-slate-800 pb-2">
              <h3 className="text-sm font-semibold text-[#1B2430] dark:text-[#F1F5F9] flex items-center gap-2 font-sans border-l-[3px] border-[#F26B21] pl-2">
                <Radio size={15} className="text-[#F26B21] dark:text-[#FFA366]" />
                <span>Interactive Live Demos</span>
              </h3>
              <span className="text-xs font-sans font-bold text-[#F1F5F9] bg-[#1E293B] px-2 py-0.5 rounded">
                Click to Test
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 font-sans text-xs">
              <button
                onClick={() => handleTileDemo(1, performCorrectStep)}
                className={`p-2.5 rounded border flex flex-col justify-between h-16 transition-all text-left ${
                  activeDemoTile === 1
                    ? 'bg-[#14532D] text-white border-emerald-500 font-bold'
                    : 'bg-[#EEF3FA] dark:bg-slate-900 border-[#D5DCE6] dark:border-slate-800 text-[#1B2430] dark:text-[#F1F5F9] hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <Box size={14} className="text-[#0F6B06] dark:text-[#4ADE80]" />
                  <span className="text-xs font-bold text-[#0F6B06] dark:text-[#4ADE80] font-mono">STEP OK</span>
                </div>
                <span className="font-semibold text-xs leading-tight">Next Step</span>
              </button>

              <button
                onClick={() => handleTileDemo(2, triggerHandNearObjectNoStateChange)}
                className={`p-2.5 rounded border flex flex-col justify-between h-16 transition-all text-left ${
                  activeDemoTile === 2
                    ? 'bg-[#7F1D1D] text-white border-red-500 font-bold'
                    : 'bg-[#EEF3FA] dark:bg-slate-900 border-[#D5DCE6] dark:border-slate-800 text-[#1B2430] dark:text-[#F1F5F9] hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <Hand size={14} className="text-[#B71C1C] dark:text-[#FF6B6B]" />
                  <span className="text-xs font-bold text-[#B71C1C] dark:text-[#FF6B6B] font-mono">REJECT</span>
                </div>
                <span className="font-semibold text-xs leading-tight">Hand Near</span>
              </button>

              <button
                onClick={() => handleTileDemo(3, triggerSensorDisagreement)}
                className={`p-2.5 rounded border flex flex-col justify-between h-16 transition-all text-left ${
                  activeDemoTile === 3
                    ? 'bg-[#78350F] text-white border-amber-500 font-bold'
                    : 'bg-[#EEF3FA] dark:bg-slate-900 border-[#D5DCE6] dark:border-slate-800 text-[#1B2430] dark:text-[#F1F5F9] hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <Sliders size={14} className="text-[#8A5300] dark:text-[#FBBF24]" />
                  <span className="text-xs font-bold text-[#8A5300] dark:text-[#FBBF24] font-mono">DS FAULT</span>
                </div>
                <span className="font-semibold text-xs leading-tight">Conflict Test</span>
              </button>

              <button
                onClick={() => handleTileDemo(4, randomizeOrientation)}
                className={`p-2.5 rounded border flex flex-col justify-between h-16 transition-all text-left ${
                  activeDemoTile === 4
                    ? 'bg-[#0369A1] text-white border-cyan-500 font-bold'
                    : 'bg-[#EEF3FA] dark:bg-slate-900 border-[#D5DCE6] dark:border-slate-800 text-[#1B2430] dark:text-[#F1F5F9] hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <Move3d size={14} className="text-[#123F8C] dark:text-[#7DD3FC]" />
                  <span className="text-xs font-bold text-[#123F8C] dark:text-[#7DD3FC] font-mono">3D POSE</span>
                </div>
                <span className="font-semibold text-xs leading-tight">Rotate Astronaut</span>
              </button>

              <button
                onClick={() => handleTileDemo(5, () => setThermalThrottlePercent(75))}
                className={`p-2.5 rounded border flex flex-col justify-between h-16 transition-all text-left ${
                  activeDemoTile === 5
                    ? 'bg-[#7C2D12] text-white border-orange-500 font-bold'
                    : 'bg-[#EEF3FA] dark:bg-slate-900 border-[#D5DCE6] dark:border-slate-800 text-[#1B2430] dark:text-[#F1F5F9] hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <Flame size={14} className="text-[#F26B21] dark:text-[#FFA366]" />
                  <span className="text-xs font-bold text-[#F26B21] dark:text-[#FFA366] font-mono">75% LOAD</span>
                </div>
                <span className="font-semibold text-xs leading-tight">Thermal Throttle</span>
              </button>

              <button
                onClick={() => handleTileDemo(6, injectBitFlip)}
                className={`p-2.5 rounded border flex flex-col justify-between h-16 transition-all text-left ${
                  activeDemoTile === 6
                    ? 'bg-[#4C1D95] text-white border-purple-500 font-bold'
                    : 'bg-[#EEF3FA] dark:bg-slate-900 border-[#D5DCE6] dark:border-slate-800 text-[#1B2430] dark:text-[#F1F5F9] hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <Box size={14} className="text-purple-600 dark:text-[#C084FC]" />
                  <span className="text-xs font-bold text-purple-600 dark:text-[#C084FC] font-mono">TMR SEU</span>
                </div>
                <span className="font-semibold text-xs leading-tight">Cosmic Bit-Flip</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
