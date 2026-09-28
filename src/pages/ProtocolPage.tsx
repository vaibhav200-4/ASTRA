import React from 'react';
import { useMission } from '../context/MissionContext';
import { FSM_NODES } from '../modules/fsmValidation';
import { FileText, AlertTriangle, ShieldCheck, RefreshCw, XCircle, AlertOctagon } from 'lucide-react';

export const ProtocolPage: React.FC = () => {
  const { 
    currentStep, completedSteps, fsmState, expectedAction, observedAction,
    fsmValidationResult, performWrongStep, skipCurrentStep, recoverTracking
  } = useMission();

  const getTransitionBadge = (type: string, level: string) => {
    if (level === 'NOMINAL') {
      return (
        <span className="px-3 py-1 rounded text-xs font-bold font-mono bg-[#14532D] text-[#86EFAC] border border-[#166534] flex items-center gap-1.5">
          <ShieldCheck size={14} /> TRANSITION: VALID (NOMINAL)
        </span>
      );
    }
    if (type === 'SKIPPED') {
      return (
        <span className="px-3 py-1 rounded text-xs font-bold font-mono bg-[#7F1D1D] text-white border border-[#991B1B] flex items-center gap-1.5 animate-pulse">
          <AlertOctagon size={14} /> TRANSITION: SKIPPED (CRITICAL)
        </span>
      );
    }
    if (type === 'OUT_OF_ORDER') {
      return (
        <span className="px-3 py-1 rounded text-xs font-bold font-mono bg-[#7F1D1D] text-white border border-[#991B1B] flex items-center gap-1.5 animate-pulse">
          <AlertOctagon size={14} /> TRANSITION: OUT-OF-ORDER (CRITICAL)
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded text-xs font-bold font-mono bg-[#78350F] text-white border border-[#92400E] flex items-center gap-1.5">
        <AlertTriangle size={14} /> TRANSITION: REPEATED (WARNING)
      </span>
    );
  };

  const isError = fsmState === 'ERROR';

  return (
    <div className="space-y-4 font-sans">
      {/* Header Banner */}
      <div className="isro-card p-4 bg-white dark:bg-[#0A1A33] border-l-4 border-l-[#123F8C] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-[#123F8C] dark:text-[#7DD3FC] font-mono text-xs font-semibold mb-0.5">
            <FileText size={14} />
            <span>PART E — PROTOCOL FSM VALIDATOR ENGINE</span>
          </div>
          <h1 className="text-lg font-bold text-[#1B2430] dark:text-[#F1F5F9]">
            Finite State Machine Protocol Validator (ISRO BCE-01)
          </h1>
          <p className="text-xs text-[#4A5568] dark:text-[#B8C4D6]">
            Enforces strict procedural compliance, detecting SKIPPED, REPEATED, OUT-OF-ORDER, and UNVERIFIED transitions in real time.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {getTransitionBadge(fsmValidationResult.transitionType, fsmValidationResult.alertLevel)}
        </div>
      </div>

      {/* SVG FSM STATE DIAGRAM VISUALIZATION */}
      <div className="isro-card p-4 bg-white dark:bg-[#0A1A33] border border-[#D5DCE6] dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between border-b border-[#D5DCE6] dark:border-slate-800 pb-2">
          <h3 className="text-sm font-semibold text-[#1B2430] dark:text-[#F1F5F9] flex items-center gap-2 font-sans border-l-[3px] border-[#F26B21] pl-2">
            <ShieldCheck size={15} className="text-[#F26B21] dark:text-[#FFA366]" />
            <span>FSM State Transition Graph (Deterministic Ground Truth)</span>
          </h3>
          <span className="text-xs font-mono text-[#4A5568] dark:text-[#B8C4D6]">
            Active State: <strong className={isError ? 'text-[#FF6B6B] animate-pulse' : 'text-[#7DD3FC]'}>{fsmState}</strong>
          </span>
        </div>

        {/* SVG Diagram Canvas */}
        <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 overflow-x-auto relative min-h-[140px] flex items-center justify-center">
          <svg className="w-full max-w-5xl h-28 overflow-visible" viewBox="0 0 900 120">
            <defs>
              <marker id="arrow-nominal" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#4ADE80" />
              </marker>
              <marker id="arrow-muted" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#B8C4D6" />
              </marker>
              <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Transition Connectors */}
            {FSM_NODES.slice(0, -1).map((node, i) => {
              const x1 = 90 + i * 180 + 65;
              const x2 = 90 + (i + 1) * 180 - 65;
              const isPast = completedSteps.includes(node.stepIndex);
              return (
                <g key={`arrow-${node.id}`}>
                  <line 
                    x1={x1} y1="60" x2={x2} y2="60" 
                    stroke={isPast ? "#4ADE80" : "#64748B"} 
                    strokeWidth={isPast ? "2.5" : "1.5"} 
                    strokeDasharray={isPast ? undefined : "4 2"}
                    markerEnd={isPast ? "url(#arrow-nominal)" : "url(#arrow-muted)"}
                  />
                  <text x={(x1 + x2) / 2} y="52" fill={isPast ? "#4ADE80" : "#B8C4D6"} fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                    valid
                  </text>
                </g>
              );
            })}

            {/* Error Loop-back Arc if in Error */}
            {isError && (
              <path 
                d="M 630 35 Q 450 -10 270 35" 
                fill="none" 
                stroke="#FF6B6B" 
                strokeWidth="2" 
                strokeDasharray="4 3" 
                className="animate-pulse"
              />
            )}

            {/* State Nodes */}
            {FSM_NODES.map((node, idx) => {
              const cx = 90 + idx * 180;
              const cy = 60;
              const isCurrent = fsmState === node.id || (node.id === 'COMPLETE' && fsmState === 'COMPLETE');
              const isDone = completedSteps.includes(node.stepIndex);

              let fillBg = '#0F172A';
              let strokeColor = '#334155';
              let textColor = '#B8C4D6';
              let filter = undefined;

              if (isError && currentStep === node.stepIndex) {
                fillBg = '#7F1D1D';
                strokeColor = '#FF6B6B';
                textColor = '#FFFFFF';
                filter = 'url(#glow-red)';
              } else if (isCurrent) {
                fillBg = '#0369A1';
                strokeColor = '#7DD3FC';
                textColor = '#FFFFFF';
                filter = 'url(#glow-cyan)';
              } else if (isDone) {
                fillBg = '#14532D';
                strokeColor = '#4ADE80';
                textColor = '#FFFFFF';
              }

              return (
                <g key={node.id} filter={filter} className="transition-all duration-300">
                  <rect 
                    x={cx - 65} y={cy - 25} width="130" height="50" rx="8" 
                    fill={fillBg} stroke={strokeColor} strokeWidth={isCurrent || (isError && currentStep === node.stepIndex) ? "2.5" : "1.5"} 
                  />
                  <text x={cx} y={cy - 6} fill={textColor} fontSize="12" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
                    {node.label}
                  </text>
                  <text x={cx} y={cy + 12} fill={textColor} opacity="0.9" fontSize="10" fontFamily="sans-serif" textAnchor="middle">
                    {node.stepIndex === 0 ? 'START' : `Step 0${node.stepIndex}`}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* SIDE-BY-SIDE: 2 ALIGNED LANES (EXPECTED VS OBSERVED SEQUENCE) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* EXPECTED LANE */}
        <div className="isro-card p-4 bg-white dark:bg-[#0A1A33] border border-[#D5DCE6] dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-[#D5DCE6] dark:border-slate-800 pb-2">
            <h3 className="text-sm font-semibold text-[#1B2430] dark:text-[#F1F5F9] flex items-center gap-2 font-sans border-l-[3px] border-[#F26B21] pl-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4ADE80]"></span>
              Expected Nominal Lane (Ground Truth FSM)
            </h3>
            <span className="text-xs font-mono text-white font-bold bg-[#14532D] px-2.5 py-0.5 rounded border border-[#166534]">
              NOMINAL PATH
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="p-3 bg-slate-100 dark:bg-slate-950 rounded border border-slate-300 dark:border-slate-800">
              <span className="text-xs text-[#4A5568] dark:text-[#B8C4D6] block mb-0.5 font-sans">TARGET ACTIVE STEP EXPECTATION</span>
              <span className="font-bold text-[#0F6B06] dark:text-[#4ADE80] text-sm">{expectedAction}</span>
            </div>

            <div className="space-y-1.5 text-xs">
              {[
                { step: 1, name: "Open Red Box Lid", state: "S0 → S1" },
                { step: 2, name: "Remove Yellow Container", state: "S1 → S2" },
                { step: 3, name: "Place Container in Rack Slot", state: "S2 → S3" },
              ].map(s => {
                const isStepCompleted = completedSteps.includes(s.step);
                const isStepActive = currentStep === s.step && !isError;
                return (
                  <div 
                    key={s.step} 
                    className={`p-2.5 rounded border flex items-center justify-between transition-all ${
                      isStepCompleted ? 'bg-[#14532D] border-[#166534] text-white font-semibold' :
                      isStepActive ? 'bg-slate-900 border-[#F26B21] text-white font-bold' :
                      'bg-slate-100 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-[#4A5568] dark:text-[#B8C4D6]'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold font-mono">
                        {s.step}
                      </span>
                      <span className="font-sans">{s.name}</span>
                    </div>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-900 text-[#F1F5F9] border border-slate-800">
                      {s.state}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* OBSERVED LANE */}
        <div className="isro-card p-4 bg-white dark:bg-[#0A1A33] border border-[#D5DCE6] dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-[#D5DCE6] dark:border-slate-800 pb-2">
            <h3 className="text-sm font-semibold text-[#1B2430] dark:text-[#F1F5F9] flex items-center gap-2 font-sans border-l-[3px] border-[#F26B21] pl-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isError ? 'bg-[#FF6B6B] animate-ping' : 'bg-[#7DD3FC]'}`}></span>
              Observed Inference Lane (Live Telemetry)
            </h3>
            <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded border text-white ${
              isError ? 'bg-[#7F1D1D] border-[#991B1B]' : 'bg-[#0284C7] border-cyan-600'
            }`}>
              {isError ? 'DEVIATION DETECTED' : 'SEQUENCE NOMINAL'}
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="p-3 bg-slate-100 dark:bg-slate-950 rounded border border-slate-300 dark:border-slate-800">
              <span className="text-xs text-[#4A5568] dark:text-[#B8C4D6] block mb-0.5 font-sans">CURRENT INFERRED ACTION & STATE</span>
              <span className={`font-bold text-sm ${isError ? 'text-[#FF6B6B]' : 'text-[#123F8C] dark:text-[#7DD3FC]'}`}>
                {observedAction}
              </span>
            </div>

            <div className={`p-3 rounded border space-y-1.5 ${
              isError ? 'bg-[#7F1D1D] border-[#991B1B] text-white' : 'bg-slate-100 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-[#1B2430] dark:text-[#F1F5F9]'
            }`}>
              <div className="flex items-center justify-between text-xs font-bold font-mono">
                <span className="text-[#4A5568] dark:text-[#B8C4D6]">VALIDATOR RESULT LOG:</span>
                <span className={isError ? 'text-[#FF6B6B]' : 'text-[#0F6B06] dark:text-[#4ADE80]'}>
                  {fsmValidationResult.transitionType}
                </span>
              </div>
              <p className="text-xs font-semibold font-sans">{fsmValidationResult.message}</p>
              <div className="pt-1.5 flex items-center justify-between text-xs text-[#4A5568] dark:text-[#B8C4D6] border-t border-slate-300 dark:border-slate-800">
                <span>Transition Alert: {fsmValidationResult.alertLevel}</span>
                <span>Expected Next: {fsmValidationResult.expectedNextState}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SIMULATION TEST CONTROLS & DEVIATION BADGES */}
      <div className="isro-card p-4 bg-white dark:bg-[#0A1A33] border border-[#D5DCE6] dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div>
          <span className="font-bold text-[#1B2430] dark:text-[#F1F5F9] text-xs block font-sans">
            FSM Deviation Simulation Injection:
          </span>
          <p className="text-xs text-[#4A5568] dark:text-[#B8C4D6] font-sans">
            Trigger abnormal astronaut procedure steps to test safety guards and transition validator alert flags.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={performWrongStep}
            className="px-3 py-1.5 rounded text-xs font-bold font-mono bg-[#7F1D1D] text-white border border-[#991B1B] hover:bg-red-800 flex items-center gap-1.5 transition-colors"
          >
            <AlertTriangle size={14} className="text-[#FF6B6B]" />
            <span>Simulate Wrong Step</span>
          </button>

          <button 
            onClick={skipCurrentStep}
            className="px-3 py-1.5 rounded text-xs font-bold font-mono bg-[#78350F] text-white border border-[#92400E] hover:bg-amber-800 flex items-center gap-1.5 transition-colors"
          >
            <XCircle size={14} className="text-[#FBBF24]" />
            <span>Simulate Skip Step</span>
          </button>

          <button 
            onClick={recoverTracking}
            className="btn-isro-primary px-3.5 py-1.5 rounded text-xs font-bold font-mono bg-[#123F8C] text-white hover:bg-[#0B2A5B] flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw size={14} />
            <span>Recover FSM State</span>
          </button>
        </div>
      </div>
    </div>
  );
};
