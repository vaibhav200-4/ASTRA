import React, { useState } from 'react';
import { useMission } from '../context/MissionContext';
import { ProceduralRackViewport } from '../components/ProceduralRackViewport';
import { ErrorBoundary } from '../components/ErrorBoundary';
import {
  CheckCircle2, AlertTriangle, XCircle, ShieldCheck, Activity, Radio,
  Bell, Clock, Eye, Layers, ChevronRight, Zap, Target, Hand
} from 'lucide-react';

export const LiveMissionConsole: React.FC = () => {
  const {
    missionStatus, currentStep, completedSteps, fsmState, expectedAction, observedAction,
    causalResult, alerts, resolveAlert, clearAllAlerts, language
  } = useMission();

  const getStepInstructionText = () => {
    if (currentStep === 1) return language === 'hi' ? "लाल प्रयोग बॉक्स का ढक्कन खोलें।" : "Open the red experiment box lid.";
    if (currentStep === 2) return language === 'hi' ? "लाल प्रयोग बॉक्स से पीला कंटेनर निकालें।" : "Remove the yellow container from the red experiment box.";
    if (currentStep === 3) return language === 'hi' ? "पीले कंटेनर को पेलोड रैक स्लॉट में रखें।" : "Place the yellow container in the payload rack slot.";
    return language === 'hi' ? "प्रयोग प्रोटोकॉल पूर्ण।" : "Experiment protocol complete.";
  };

  return (
    <div className="space-y-3 font-sans select-none max-w-[1440px] mx-auto">
      {/* Top Console Status Strip */}
      <div className="isro-card p-3 bg-white dark:bg-[#0A1A33] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <h2 className="font-bold text-[#0B2A5B] dark:text-white text-sm">LIVE MISSION OPERATIONS CONSOLE</h2>
          <span className="text-slate-400">|</span>
          <span className="font-mono text-cyan-300 font-bold">ISRO-BCE-EXP-01</span>
        </div>

        <div className="flex items-center space-x-3 font-mono text-xs">
          <span className="text-slate-300">
            FSM: <strong className="text-orange-400">{fsmState}</strong>
          </span>
          <span className="text-slate-400">|</span>
          <span className={`font-bold ${missionStatus === 'CRITICAL' ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
            STATUS: {missionStatus}
          </span>
        </div>
      </div>

      {/* Main 60% / 40% Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* LEFT 60% (7 COLS): PROCEDURAL VIEWPORT & PLAYBACK CONTROLS */}
        <div className="lg:col-span-7 space-y-2">
          <div className="isro-card p-2 bg-white dark:bg-[#0A1A33]">
            <ErrorBoundary fallbackTitle="Procedural Rack Viewport Notice">
              <ProceduralRackViewport />
            </ErrorBoundary>
          </div>
        </div>

        {/* RIGHT 40% (5 COLS): CAUSAL VERIFICATION, CURRENT STEP & ALERTS FEED */}
        <div className="lg:col-span-5 space-y-3">
          {/* 1. CAUSAL VERIFICATION PANEL (3 Evidence Cards + Verdict Banner) */}
          <div className="isro-card p-3 bg-white dark:bg-[#0A1A33] space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-orange-400" />
                <span>3-Way Causal Verification Engine</span>
              </h3>
              <span className="text-[10px] font-sans font-bold text-cyan-400 bg-slate-800 px-2 py-0.5 rounded">
                Real Time
              </span>
            </div>

            {/* Verdict Banner */}
            <div className={`p-3 rounded border flex items-center justify-between text-xs font-sans ${
              causalResult.accepted
                ? 'bg-emerald-950/80 border-emerald-600/80 text-emerald-200'
                : 'bg-red-950/90 border-red-600/90 text-red-200 animate-pulse'
            }`}>
              <div className="flex items-center space-x-2">
                {causalResult.accepted ? (
                  <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
                ) : (
                  <XCircle size={20} className="text-red-400 shrink-0" />
                )}
                <div>
                  <span className="font-bold text-sm block">
                    {causalResult.accepted ? 'VERDICT: ACCEPTED' : 'VERDICT: REJECTED'}
                  </span>
                  <span className="text-[11px] font-mono text-slate-300">
                    {causalResult.rejectionReason || 'Action + State Change + Context verified.'}
                  </span>
                </div>
              </div>
            </div>

            {/* 3 Evidence Cards */}
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              {/* Evidence 1 */}
              <div className={`p-2 rounded border flex flex-col justify-between h-20 ${
                causalResult.actionDetected
                  ? 'bg-slate-900 border-emerald-600/60 text-emerald-300'
                  : 'bg-red-950/40 border-red-800 text-red-300'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">01. ACTION</span>
                  {causalResult.actionDetected ? (
                    <CheckCircle2 size={12} className="text-emerald-400" />
                  ) : (
                    <XCircle size={12} className="text-red-400" />
                  )}
                </div>
                <span className="font-semibold text-[11px] leading-tight">
                  YOLO26n Action Pose
                </span>
                <span className="text-[9px] font-mono text-slate-400">98.4% Confidence</span>
              </div>

              {/* Evidence 2 */}
              <div className={`p-2 rounded border flex flex-col justify-between h-20 ${
                causalResult.stateChanged
                  ? 'bg-slate-900 border-emerald-600/60 text-emerald-300'
                  : 'bg-red-950/40 border-red-800 text-red-300'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">02. STATE</span>
                  {causalResult.stateChanged ? (
                    <CheckCircle2 size={12} className="text-emerald-400" />
                  ) : (
                    <XCircle size={12} className="text-red-400" />
                  )}
                </div>
                <span className="font-semibold text-[11px] leading-tight">
                  Physical Shift
                </span>
                <span className="text-[9px] font-mono text-slate-400">Object Moved</span>
              </div>

              {/* Evidence 3 */}
              <div className={`p-2 rounded border flex flex-col justify-between h-20 ${
                causalResult.contextMatches
                  ? 'bg-slate-900 border-emerald-600/60 text-emerald-300'
                  : 'bg-red-950/40 border-red-800 text-red-300'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">03. CONTEXT</span>
                  {causalResult.contextMatches ? (
                    <CheckCircle2 size={12} className="text-emerald-400" />
                  ) : (
                    <XCircle size={12} className="text-red-400" />
                  )}
                </div>
                <span className="font-semibold text-[11px] leading-tight">
                  FSM Rule Match
                </span>
                <span className="text-[9px] font-mono text-slate-400">Step {currentStep} Active</span>
              </div>
            </div>
          </div>

          {/* 2. CURRENT PROTOCOL STEP INSTRUCTION CARD */}
          <div className="isro-card p-3 bg-white dark:bg-[#0A1A33] border-l-4 border-l-[#F26B21] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                <Radio size={13} className="animate-pulse" />
                <span>Next Required Action</span>
              </span>
              <span className="bg-[#123F8C] text-white font-mono font-bold text-xs px-2.5 py-0.5 rounded">
                STEP {currentStep} / 3
              </span>
            </div>
            <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
              <p className="font-bold text-white text-xs leading-relaxed">
                "{getStepInstructionText()}"
              </p>
            </div>
          </div>

          {/* 3. MISSION ALERTS FEED */}
          <div className="isro-card p-3 bg-white dark:bg-[#0A1A33] space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                <Bell size={13} className="text-orange-400" />
                <span>Live Mission Alerts Feed</span>
              </h3>
              <button onClick={clearAllAlerts} className="text-[10px] text-cyan-400 hover:underline font-mono">
                Clear All
              </button>
            </div>

            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1 text-xs">
              {alerts.length === 0 ? (
                <div className="text-slate-400 p-2 text-center text-xs">No active mission alerts.</div>
              ) : (
                alerts.slice(0, 4).map((alt) => (
                  <div
                    key={alt.id}
                    className={`p-2 rounded border flex items-start justify-between gap-2 ${
                      alt.category === 'CRITICAL'
                        ? 'bg-red-950/60 border-red-800 text-red-200'
                        : alt.category === 'WARNING'
                        ? 'bg-amber-950/60 border-amber-800 text-amber-200'
                        : 'bg-slate-900 border-slate-800 text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-[11px]">{alt.title}</span>
                        <span className="text-[9px] font-mono text-slate-400">{alt.timestamp}</span>
                      </div>
                      <p className="text-[10px] text-slate-300 mt-0.5">{alt.detail}</p>
                    </div>

                    {!alt.resolved && (
                      <button
                        onClick={() => resolveAlert(alt.id)}
                        className="text-[9px] bg-slate-800 hover:bg-slate-700 px-1.5 py-0.5 rounded font-mono font-bold shrink-0"
                      >
                        Dismiss
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
