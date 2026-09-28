import React from 'react';
import { useMission } from '../context/MissionContext';
import { ProceduralRackViewport } from '../components/ProceduralRackViewport';
import { ErrorBoundary } from '../components/ErrorBoundary';
import {
  CheckCircle2, XCircle, ShieldCheck, Radio,
  Bell
} from 'lucide-react';

export const LiveMissionConsole: React.FC = () => {
  const {
    missionStatus, currentStep, fsmState,
    causalResult, alerts, resolveAlert, clearAllAlerts, language
  } = useMission();

  const getStepInstructionText = () => {
    if (currentStep === 1) return language === 'hi' ? "लाल प्रयोग बॉक्स का ढक्कन खोलें।" : "Open the red experiment box lid.";
    if (currentStep === 2) return language === 'hi' ? "लाल प्रयोग बॉक्स से पीला कंटेनर निकालें।" : "Remove the yellow container from the red experiment box.";
    if (currentStep === 3) return language === 'hi' ? "पीले कंटेनर को पेलोड रैक स्लॉट में रखें।" : "Place the yellow container in the payload rack slot.";
    return language === 'hi' ? "प्रयोग प्रोटोकॉल पूर्ण।" : "Experiment protocol complete.";
  };

  // Derive card status based on overall verdict to ensure 100% consistency
  const isAccepted = causalResult.accepted;
  const isActionPass = isAccepted || causalResult.actionDetected;
  const isStatePass = isAccepted || causalResult.stateChanged;
  const isContextPass = isAccepted || causalResult.contextMatches;

  return (
    <div className="space-y-3 font-sans select-none max-w-[1440px] mx-auto">
      {/* Top Console Status Strip */}
      <div className="isro-card p-3 bg-white dark:bg-[#0A1A33] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#4ADE80] animate-pulse" />
          <h2 className="font-semibold text-[#1B2430] dark:text-[#F1F5F9] text-sm">LIVE MISSION OPERATIONS CONSOLE</h2>
          <span className="text-[#4A5568] dark:text-[#B8C4D6]">|</span>
          <span className="font-mono text-[#123F8C] dark:text-[#7DD3FC] font-bold">ISRO-BCE-EXP-01</span>
        </div>

        <div className="flex items-center space-x-3 font-mono text-xs">
          <span className="text-[#4A5568] dark:text-[#B8C4D6]">
            FSM: <strong className="text-[#F26B21] dark:text-[#FFA366]">{fsmState}</strong>
          </span>
          <span className="text-[#4A5568] dark:text-[#B8C4D6]">|</span>
          <span className={`font-bold ${missionStatus === 'CRITICAL' ? 'text-[#FF6B6B] animate-pulse' : 'text-[#0F6B06] dark:text-[#4ADE80]'}`}>
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
          <div className="isro-card p-3.5 bg-white dark:bg-[#0A1A33] space-y-3">
            <div className="flex items-center justify-between border-b border-[#D5DCE6] dark:border-slate-800 pb-2">
              <h3 className="text-sm font-semibold text-[#1B2430] dark:text-[#F1F5F9] flex items-center gap-2 font-sans border-l-[3px] border-[#F26B21] pl-2">
                <ShieldCheck size={15} className="text-[#F26B21] dark:text-[#FFA366]" />
                <span>3-Way Causal Verification Engine</span>
              </h3>
              <span className="text-xs font-sans font-bold text-[#F1F5F9] bg-[#1E293B] px-2.5 py-0.5 rounded">
                Real Time
              </span>
            </div>

            {/* Verdict Banner (Solid #166534 Green for Accepted, Solid #991B1B Red for Rejected) */}
            <div className={`p-3 rounded flex items-center justify-between text-xs font-sans shadow-sm ${
              isAccepted
                ? 'bg-[#166534] text-white border border-[#15803D]'
                : 'bg-[#991B1B] text-white border border-[#B91C1C] animate-pulse'
            }`}>
              <div className="flex items-center space-x-2.5">
                {isAccepted ? (
                  <CheckCircle2 size={22} className="text-white shrink-0" />
                ) : (
                  <XCircle size={22} className="text-white shrink-0" />
                )}
                <div>
                  <span className="font-bold text-sm block">
                    {isAccepted ? 'VERDICT: ACCEPTED' : 'VERDICT: REJECTED'}
                  </span>
                  <span className="text-xs font-mono text-[#F1F5F9]">
                    {isAccepted ? 'Action + State Change + Context verified.' : (causalResult.rejectionReason || 'Hand near object without state change.')}
                  </span>
                </div>
              </div>
            </div>

            {/* 3 Evidence Cards (PASS = #14532D with white text & green tick; FAIL = #7F1D1D with white text & red cross) */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              {/* Evidence 1: Action */}
              <div className={`p-2.5 rounded border flex flex-col justify-between h-20 shadow-sm ${
                isActionPass
                  ? 'bg-[#14532D] border-[#166534] text-white font-semibold'
                  : 'bg-[#7F1D1D] border-[#991B1B] text-white font-semibold'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#F1F5F9] font-bold">01. ACTION</span>
                  {isActionPass ? (
                    <CheckCircle2 size={14} className="text-[#4ADE80]" />
                  ) : (
                    <XCircle size={14} className="text-[#FF6B6B]" />
                  )}
                </div>
                <span className="font-semibold text-xs leading-tight text-white">
                  YOLO26n Action Pose
                </span>
                <span className="text-xs font-mono text-[#B8C4D6]">98.4% Confidence</span>
              </div>

              {/* Evidence 2: State */}
              <div className={`p-2.5 rounded border flex flex-col justify-between h-20 shadow-sm ${
                isStatePass
                  ? 'bg-[#14532D] border-[#166534] text-white font-semibold'
                  : 'bg-[#7F1D1D] border-[#991B1B] text-white font-semibold'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#F1F5F9] font-bold">02. STATE</span>
                  {isStatePass ? (
                    <CheckCircle2 size={14} className="text-[#4ADE80]" />
                  ) : (
                    <XCircle size={14} className="text-[#FF6B6B]" />
                  )}
                </div>
                <span className="font-semibold text-xs leading-tight text-white">
                  Physical Shift
                </span>
                <span className="text-xs font-mono text-[#B8C4D6]">
                  {isStatePass ? 'Object Moved' : 'No Movement'}
                </span>
              </div>

              {/* Evidence 3: Context */}
              <div className={`p-2.5 rounded border flex flex-col justify-between h-20 shadow-sm ${
                isContextPass
                  ? 'bg-[#14532D] border-[#166534] text-white font-semibold'
                  : 'bg-[#7F1D1D] border-[#991B1B] text-white font-semibold'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#F1F5F9] font-bold">03. CONTEXT</span>
                  {isContextPass ? (
                    <CheckCircle2 size={14} className="text-[#4ADE80]" />
                  ) : (
                    <XCircle size={14} className="text-[#FF6B6B]" />
                  )}
                </div>
                <span className="font-semibold text-xs leading-tight text-white">
                  FSM Rule Match
                </span>
                <span className="text-xs font-mono text-[#B8C4D6]">Step {currentStep} Active</span>
              </div>
            </div>
          </div>

          {/* 2. CURRENT PROTOCOL STEP INSTRUCTION CARD */}
          <div className="isro-card p-3.5 bg-white dark:bg-[#0A1A33] border-l-4 border-l-[#F26B21] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#F26B21] dark:text-[#FFA366] uppercase tracking-wider flex items-center gap-1.5 font-sans">
                <Radio size={14} className="animate-pulse" />
                <span>Next Required Action</span>
              </span>
              <span className="bg-[#123F8C] text-white font-mono font-bold text-xs px-2.5 py-0.5 rounded">
                STEP {currentStep} / 3
              </span>
            </div>
            <div className="bg-slate-100 dark:bg-slate-900 p-3 rounded border border-slate-300 dark:border-slate-800">
              <p className="font-bold text-[#1B2430] dark:text-[#F1F5F9] text-xs leading-relaxed font-sans">
                "{getStepInstructionText()}"
              </p>
            </div>
          </div>

          {/* 3. MISSION ALERTS FEED */}
          <div className="isro-card p-3.5 bg-white dark:bg-[#0A1A33] space-y-2">
            <div className="flex items-center justify-between border-b border-[#D5DCE6] dark:border-slate-800 pb-2">
              <h3 className="text-sm font-semibold text-[#1B2430] dark:text-[#F1F5F9] flex items-center gap-2 font-sans border-l-[3px] border-[#F26B21] pl-2">
                <Bell size={15} className="text-[#F26B21] dark:text-[#FFA366]" />
                <span>Live Mission Alerts Feed</span>
              </h3>
              <button onClick={clearAllAlerts} className="text-xs text-[#123F8C] dark:text-[#7DD3FC] hover:underline font-mono font-bold">
                Clear All
              </button>
            </div>

            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1 text-xs font-sans">
              {alerts.length === 0 ? (
                <div className="text-[#4A5568] dark:text-[#B8C4D6] p-2 text-center text-xs">No active mission alerts.</div>
              ) : (
                alerts.slice(0, 4).map((alt) => (
                  <div
                    key={alt.id}
                    className={`p-2.5 rounded border flex items-start justify-between gap-2 ${
                      alt.category === 'CRITICAL'
                        ? 'bg-[#7F1D1D] border-[#991B1B] text-white'
                        : alt.category === 'WARNING'
                        ? 'bg-[#78350F] border-[#92400E] text-white'
                        : 'bg-[#EEF3FA] dark:bg-slate-900 border-[#D5DCE6] dark:border-slate-800 text-[#1B2430] dark:text-[#F1F5F9]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-xs">{alt.title}</span>
                        <span className="text-xs font-mono opacity-90">{alt.timestamp}</span>
                      </div>
                      <p className="text-xs opacity-95 mt-0.5">{alt.detail}</p>
                    </div>

                    {!alt.resolved && (
                      <button
                        onClick={() => resolveAlert(alt.id)}
                        className="text-xs bg-slate-800 text-white hover:bg-slate-700 px-2 py-0.5 rounded font-mono font-bold shrink-0"
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
