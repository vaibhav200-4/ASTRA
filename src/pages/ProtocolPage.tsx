import React from 'react';
import { useMission } from '../context/MissionContext';
import { FSM_NODES } from '../modules/fsmValidation';
import { FileText, CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight, Zap, RefreshCw, XCircle, AlertOctagon } from 'lucide-react';

export const ProtocolPage: React.FC = () => {
  const { 
    currentStep, completedSteps, fsmState, expectedAction, observedAction,
    fsmValidationResult, performWrongStep, skipCurrentStep, recoverTracking, language 
  } = useMission();

  const getTransitionBadge = (type: string, level: string) => {
    if (level === 'NOMINAL') {
      return (
        <span className="px-2.5 py-1 rounded text-xs font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
          <ShieldCheck size={14} /> TRANSITION: VALID (NOMINAL)
        </span>
      );
    }
    if (type === 'SKIPPED') {
      return (
        <span className="px-2.5 py-1 rounded text-xs font-bold font-mono bg-red-500/20 text-red-400 border border-red-500/50 flex items-center gap-1.5 animate-pulse">
          <AlertOctagon size={14} /> TRANSITION: SKIPPED (CRITICAL)
        </span>
      );
    }
    if (type === 'OUT_OF_ORDER') {
      return (
        <span className="px-2.5 py-1 rounded text-xs font-bold font-mono bg-red-500/20 text-red-400 border border-red-500/50 flex items-center gap-1.5 animate-pulse">
          <AlertOctagon size={14} /> TRANSITION: OUT-OF-ORDER (CRITICAL)
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded text-xs font-bold font-mono bg-amber-500/20 text-amber-400 border border-amber-500/50 flex items-center gap-1.5">
        <AlertTriangle size={14} /> TRANSITION: REPEATED (WARNING)
      </span>
    );
  };

  const isError = fsmState === 'ERROR';

  return (
    <div className="space-y-4 font-sans">
      {/* Header Banner */}
      <div className="isro-card p-4 bg-slate-900 border-l-4 border-l-cyan-500 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-lg">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-semibold mb-0.5">
            <FileText size={14} />
            <span>PART E — PROTOCOL FSM VALIDATOR ENGINE</span>
          </div>
          <h1 className="text-lg font-bold text-white">
            Finite State Machine Protocol Validator (ISRO BCE-01)
          </h1>
          <p className="text-xs text-slate-300">
            Enforces strict procedural compliance, detecting SKIPPED, REPEATED, OUT-OF-ORDER, and UNVERIFIED transitions in real time.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {getTransitionBadge(fsmValidationResult.transitionType, fsmValidationResult.alertLevel)}
        </div>
      </div>

      {/* SVG FSM STATE DIAGRAM VISUALIZATION */}
      <div className="isro-card p-4 bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="isro-section-title mb-0 text-xs font-mono text-slate-200">
            FSM State Transition Graph (Deterministic Ground Truth)
          </h3>
          <span className="text-[11px] font-mono text-slate-400">
            Active State: <strong className={isError ? 'text-red-400 animate-pulse' : 'text-cyan-400'}>{fsmState}</strong>
          </span>
        </div>

        {/* SVG Diagram Canvas */}
        <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 overflow-x-auto relative min-h-[140px] flex items-center justify-center">
          <svg className="w-full max-w-5xl h-28 overflow-visible" viewBox="0 0 900 120">
            <defs>
              <marker id="arrow-nominal" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#10B981" />
              </marker>
              <marker id="arrow-[#D5DCE6]" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748B" />
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
                    stroke={isPast ? "#10B981" : "#475569"} 
                    strokeWidth={isPast ? "2.5" : "1.5"} 
                    strokeDasharray={isPast ? undefined : "4 2"}
                    markerEnd={isPast ? "url(#arrow-nominal)" : "url(#arrow-[#D5DCE6])"}
                  />
                  <text x={(x1 + x2) / 2} y="52" fill={isPast ? "#10B981" : "#64748B"} fontSize="10" fontFamily="monospace" textAnchor="middle">
                    valid
                  </text>
                </g>
              );
            })}

            {/* Error Loop-back / Exception Arc if in Error */}
            {isError && (
              <path 
                d="M 630 35 Q 450 -10 270 35" 
                fill="none" 
                stroke="#EF4444" 
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
              let textColor = '#94A3B8';
              let filter = undefined;

              if (isError && currentStep === node.stepIndex) {
                fillBg = '#450A0A';
                strokeColor = '#EF4444';
                textColor = '#FCA5A5';
                filter = 'url(#glow-red)';
              } else if (isCurrent) {
                fillBg = '#0369A1';
                strokeColor = '#38BDF8';
                textColor = '#FFFFFF';
                filter = 'url(#glow-cyan)';
              } else if (isDone) {
                fillBg = '#064E3B';
                strokeColor = '#10B981';
                textColor = '#6EE7B7';
              }

              return (
                <g key={node.id} filter={filter} className="transition-all duration-300">
                  <rect 
                    x={cx - 65} y={cy - 25} width="130" height="50" rx="8" 
                    fill={fillBg} stroke={strokeColor} strokeWidth={isCurrent || (isError && currentStep === node.stepIndex) ? "2.5" : "1.5"} 
                  />
                  <text x={cx} y={cy - 6} fill={textColor} fontSize="11" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
                    {node.label}
                  </text>
                  <text x={cx} y={cy + 12} fill={textColor} opacity="0.8" fontSize="9" fontFamily="sans-serif" textAnchor="middle">
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
        <div className="isro-card p-4 bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="isro-section-title mb-0 text-xs text-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Expected Nominal Lane (Ground Truth FSM)
            </h3>
            <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              NOMINAL PATH
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="p-3 bg-slate-950 rounded border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-0.5">TARGET ACTIVE STEP EXPECTATION</span>
              <span className="font-bold text-emerald-300 text-sm">{expectedAction}</span>
            </div>

            <div className="space-y-1.5 text-xs">
              {[
                { step: 1, name: "Open Red Box Lid", state: "S0 → S1", code: "S1_OPEN_BOX" },
                { step: 2, name: "Remove Yellow Container", state: "S1 → S2", code: "S2_REMOVE_CONTAINER" },
                { step: 3, name: "Place Container in Rack Slot", state: "S2 → S3", code: "S3_PLACE_CONTAINER" },
              ].map(s => {
                const isStepCompleted = completedSteps.includes(s.step);
                const isStepActive = currentStep === s.step && !isError;
                return (
                  <div 
                    key={s.step} 
                    className={`p-2.5 rounded border flex items-center justify-between transition-all ${
                      isStepCompleted ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' :
                      isStepActive ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-200 font-bold' :
                      'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                        {s.step}
                      </span>
                      <span>{s.name}</span>
                    </div>
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                      {s.state}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* OBSERVED LANE */}
        <div className="isro-card p-4 bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="isro-section-title mb-0 text-xs text-slate-200 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isError ? 'bg-red-500 animate-ping' : 'bg-cyan-400'}`}></span>
              Observed Inference Lane (Live Telemetry)
            </h3>
            <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${
              isError ? 'bg-red-500/20 text-red-400 border-red-500/40' : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
            }`}>
              {isError ? 'DEVIATION DETECTED' : 'SEQUENCE NOMINAL'}
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="p-3 bg-slate-950 rounded border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-0.5">CURRENT INFERRED ACTION & STATE</span>
              <span className={`font-bold text-sm ${isError ? 'text-red-400' : 'text-cyan-300'}`}>
                {observedAction}
              </span>
            </div>

            <div className={`p-3 rounded border space-y-1.5 ${
              isError ? 'bg-red-950/40 border-red-500/50 text-red-200' : 'bg-slate-950 border-slate-800 text-slate-300'
            }`}>
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-slate-400">VALIDATOR RESULT LOG:</span>
                <span className={isError ? 'text-red-400' : 'text-emerald-400'}>
                  {fsmValidationResult.transitionType}
                </span>
              </div>
              <p className="text-xs font-semibold">{fsmValidationResult.message}</p>
              <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/60">
                <span>Transition Alert: {fsmValidationResult.alertLevel}</span>
                <span>Expected Next: {fsmValidationResult.expectedNextState}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SIMULATION TEST CONTROLS & DEVIATION BADGES */}
      <div className="isro-card p-4 bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div>
          <span className="font-bold text-white text-xs block">
            FSM Deviation Simulation Injection:
          </span>
          <p className="text-[11px] text-slate-400">
            Trigger abnormal astronaut procedure steps to test safety guards and transition validator alert flags.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={performWrongStep}
            className="px-3 py-1.5 rounded text-xs font-bold font-mono bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30 flex items-center gap-1.5 transition-colors"
          >
            <AlertTriangle size={13} className="text-red-400" />
            <span>Simulate Wrong Step</span>
          </button>

          <button 
            onClick={skipCurrentStep}
            className="px-3 py-1.5 rounded text-xs font-bold font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 flex items-center gap-1.5 transition-colors"
          >
            <XCircle size={13} className="text-amber-400" />
            <span>Simulate Skip Step</span>
          </button>

          <button 
            onClick={recoverTracking}
            className="btn-isro-primary px-3 py-1.5 rounded text-xs font-bold font-mono bg-cyan-600 text-white hover:bg-cyan-500 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw size={13} />
            <span>Recover FSM State</span>
          </button>
        </div>
      </div>
    </div>
  );
};
