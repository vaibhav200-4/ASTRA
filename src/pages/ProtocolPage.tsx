import React from 'react';
import { useMission } from '../context/MissionContext';
import { FSM_NODES } from '../modules/fsmValidation';
import { FileText, CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight, Zap, RefreshCw, XCircle } from 'lucide-react';

export const ProtocolPage: React.FC = () => {
  const { 
    currentStep, completedSteps, fsmState, expectedAction, observedAction,
    fsmValidationResult, performWrongStep, skipCurrentStep, recoverTracking, language 
  } = useMission();

  const getTransitionBadge = (type: string, level: string) => {
    if (level === 'NOMINAL') {
      return <span className="px-2 py-0.5 rounded text-xs font-bold font-mono bg-emerald-50 text-[#138808] dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">TRANSITION: VALID</span>;
    }
    if (type === 'SKIPPED') {
      return <span className="px-2 py-0.5 rounded text-xs font-bold font-mono bg-red-50 text-[#C62828] dark:bg-red-950 dark:text-red-300 border border-red-300">TRANSITION: SKIPPED (CRITICAL)</span>;
    }
    if (type === 'OUT_OF_ORDER') {
      return <span className="px-2 py-0.5 rounded text-xs font-bold font-mono bg-red-50 text-[#C62828] dark:bg-red-950 dark:text-red-300 border border-red-300">TRANSITION: OUT-OF-ORDER (CRITICAL)</span>;
    }
    return <span className="px-2 py-0.5 rounded text-xs font-bold font-mono bg-amber-50 text-[#D98200] dark:bg-amber-950 dark:text-amber-300 border border-amber-300">TRANSITION: REPEATED (WARNING)</span>;
  };

  return (
    <div className="space-y-4 font-sans">
      {/* Header Banner */}
      <div className="isro-card p-4 bg-white dark:bg-[#0A1A33] border-l-4 border-l-[#123F8C] flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 text-[#123F8C] dark:text-cyan-400 font-mono text-xs font-semibold mb-0.5">
            <FileText size={14} />
            <span>PART E — PROTOCOL FSM VALIDATOR ENGINE</span>
          </div>
          <h1 className="text-lg font-bold text-[#0B2A5B] dark:text-white">
            Finite State Machine Protocol Validator (ISRO BCE-01)
          </h1>
          <p className="text-xs text-[#5B6675] dark:text-slate-300">
            Enforces strict procedural compliance, detecting SKIPPED, REPEATED, OUT-OF-ORDER, and UNVERIFIED transitions.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {getTransitionBadge(fsmValidationResult.transitionType, fsmValidationResult.alertLevel)}
        </div>
      </div>

      {/* FSM STATE DIAGRAM VISUALIZATION */}
      <div className="isro-card p-4 bg-white dark:bg-[#0A1A33] space-y-3">
        <h3 className="isro-section-title mb-0 text-xs font-mono">
          FSM State Transition Diagram & Current Active Node
        </h3>

        {/* Diagram Nodes Row */}
        <div className="p-3 bg-[#EEF3FA] dark:bg-slate-900 rounded border border-[#D5DCE6] dark:border-slate-800 flex items-center justify-between overflow-x-auto gap-2 text-xs font-mono">
          {FSM_NODES.map((node, idx) => {
            const isCurrent = fsmState === node.id || (node.id === 'COMPLETE' && fsmState === 'COMPLETE');
            const isDone = completedSteps.includes(node.stepIndex);

            return (
              <React.Fragment key={node.id}>
                <div 
                  className={`p-2.5 rounded border flex flex-col items-center justify-center text-center min-w-[110px] transition-all ${
                    fsmState === 'ERROR' && currentStep === node.stepIndex
                      ? 'bg-red-50 border-red-500 text-[#C62828] dark:bg-red-950 dark:text-red-300 font-bold'
                      : isCurrent
                      ? 'bg-[#123F8C] border-[#123F8C] text-white font-bold shadow-sm'
                      : isDone
                      ? 'bg-emerald-50 border-emerald-300 text-[#138808] dark:bg-emerald-950 dark:text-emerald-300 font-semibold'
                      : 'bg-white dark:bg-slate-800 border-[#D5DCE6] dark:border-slate-700 text-[#5B6675]'
                  }`}
                >
                  <span className="font-bold text-[11px]">{node.label}</span>
                  <span className="text-[9px] font-sans opacity-80">{node.description}</span>
                </div>

                {idx < FSM_NODES.length - 1 && (
                  <ArrowRight size={16} className={isDone ? 'text-[#138808]' : 'text-slate-400'} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* SIDE-BY-SIDE: EXPECTED VS OBSERVED SEQUENCE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* EXPECTED SEQUENCE */}
        <div className="isro-card p-4 bg-white dark:bg-[#0A1A33] space-y-3">
          <div className="flex items-center justify-between border-b border-[#EEF3FA] dark:border-slate-800 pb-2">
            <h3 className="isro-section-title mb-0 text-xs">
              Expected Nominal Sequence
            </h3>
            <span className="text-[10px] font-mono text-[#138808] font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-300">
              FSM Ground Truth
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 bg-[#F5F7FA] dark:bg-slate-900 rounded border border-[#D5DCE6] dark:border-slate-800">
              <span className="text-[10px] text-[#5B6675] block">CURRENT ACTIVE STEP EXPECTATION</span>
              <span className="font-bold text-[#0B2A5B] dark:text-white text-sm">{expectedAction}</span>
            </div>

            <div className="space-y-1 text-[11px]">
              <div className="p-2 bg-white dark:bg-slate-950 rounded border border-[#D5DCE6] dark:border-slate-800 flex justify-between">
                <span>01. Open Red Box Lid</span>
                <span className="text-[#138808]">S0 → S1</span>
              </div>
              <div className="p-2 bg-white dark:bg-slate-950 rounded border border-[#D5DCE6] dark:border-slate-800 flex justify-between">
                <span>02. Remove Yellow Container</span>
                <span className="text-[#138808]">S1 → S2</span>
              </div>
              <div className="p-2 bg-white dark:bg-slate-950 rounded border border-[#D5DCE6] dark:border-slate-800 flex justify-between">
                <span>03. Place Container in Rack Slot</span>
                <span className="text-[#138808]">S2 → S3 → COMPLETE</span>
              </div>
            </div>
          </div>
        </div>

        {/* OBSERVED SEQUENCE */}
        <div className="isro-card p-4 bg-white dark:bg-[#0A1A33] space-y-3">
          <div className="flex items-center justify-between border-b border-[#EEF3FA] dark:border-slate-800 pb-2">
            <h3 className="isro-section-title mb-0 text-xs">
              Observed Inference Sequence
            </h3>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
              fsmState === 'ERROR' ? 'bg-red-50 text-[#C62828] border-red-300' : 'bg-[#EEF3FA] text-[#123F8C] border-[#D5DCE6]'
            }`}>
              {fsmState === 'ERROR' ? 'DEVIATION DETECTED' : 'SEQUENCE NOMINAL'}
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 bg-[#F5F7FA] dark:bg-slate-900 rounded border border-[#D5DCE6] dark:border-slate-800">
              <span className="text-[10px] text-[#5B6675] block">OBSERVED ACTION & TRANSITION</span>
              <span className="font-bold text-[#123F8C] dark:text-cyan-300 text-sm">{observedAction}</span>
            </div>

            <div className="p-2.5 bg-[#EEF3FA] dark:bg-slate-900 rounded border border-[#D5DCE6] dark:border-slate-800 space-y-1">
              <span className="text-[10px] text-[#5B6675] font-bold block">VALIDATOR RESULT LOG:</span>
              <p className="text-xs font-semibold text-[#0B2A5B] dark:text-slate-200">{fsmValidationResult.message}</p>
            </div>
          </div>
        </div>
      </div>

      {/* SIMULATION TEST CONTROLS */}
      <div className="isro-card p-3.5 bg-white dark:bg-[#0A1A33] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <span className="font-bold text-[#0B2A5B] dark:text-slate-200">
          Simulate FSM Deviations:
        </span>

        <div className="flex items-center space-x-2">
          <button 
            onClick={performWrongStep}
            className="btn-isro-outline"
          >
            <AlertTriangle size={13} className="text-[#C62828]" />
            <span>Simulate Wrong Step</span>
          </button>

          <button 
            onClick={skipCurrentStep}
            className="btn-isro-outline"
          >
            <XCircle size={13} className="text-[#D98200]" />
            <span>Simulate Skip Step</span>
          </button>

          <button 
            onClick={recoverTracking}
            className="btn-isro-primary"
          >
            <RefreshCw size={13} />
            <span>Recover FSM State</span>
          </button>
        </div>
      </div>
    </div>
  );
};
