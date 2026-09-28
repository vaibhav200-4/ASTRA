import React, { useState } from 'react';
import { useMission } from '../context/MissionContext';
import { CheckCircle2, AlertTriangle, XCircle, ArrowRight, X, Activity, Cpu } from 'lucide-react';
import type { PipelineStage } from '../modules/pipeline';

export const PipelineStrip: React.FC = () => {
  const { pipelineStages, language } = useMission();
  const [selectedStage, setSelectedStage] = useState<PipelineStage | null>(null);

  return (
    <div className="isro-card p-2.5 bg-white dark:bg-[#0A1A33] font-sans select-none">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Cpu size={14} className="text-[#F26B21]" />
          <h3 className="text-xs font-bold text-[#0B2A5B] dark:text-white uppercase tracking-wider">
            {language === 'hi' ? 'लाइव प्रोसेसिंग पाइपलाइन' : 'Live Processing Pipeline Stage Flow'}
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400 bg-[#EEF3FA] dark:bg-slate-800 px-2 py-0.5 rounded">
          Latency: <strong className="text-cyan-300 font-bold">{pipelineStages.reduce((acc, s) => acc + s.latencyMs, 0)} ms</strong>
        </span>
      </div>

      {/* Connected Nodes Grid with Animated Flow Lines */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 relative">
        {pipelineStages.map((stage, idx) => {
          const isOk = stage.status === 'NOMINAL';
          const isWarn = stage.status === 'WARNING' || stage.status === 'ISOLATED';
          const isCrit = stage.status === 'CRITICAL' || stage.status === 'REJECTED';

          return (
            <div
              key={stage.id}
              onClick={() => setSelectedStage(stage)}
              className={`p-2 rounded border text-xs cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between relative group ${
                stage.active
                  ? 'border-[#F26B21] bg-[#EEF3FA]/80 dark:bg-slate-800/90 shadow-sm'
                  : 'border-[#D5DCE6] dark:border-slate-800 bg-white dark:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-sans font-bold text-[11px] text-[#0B2A5B] dark:text-cyan-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>{stage.shortName}</span>
                </span>
                {isOk && <CheckCircle2 size={12} className="text-[#138808]" />}
                {isWarn && <AlertTriangle size={12} className="text-[#D98200]" />}
                {isCrit && <XCircle size={12} className="text-[#C62828]" />}
              </div>

              <div className="text-[10px] text-slate-400 truncate" title={stage.lastOutput}>
                {stage.lastOutput}
              </div>

              <div className="flex items-center justify-between mt-1.5 pt-1 border-t border-[#EEF3FA] dark:border-slate-800 text-[10px] font-mono">
                <span className={`px-1 rounded text-[9px] font-semibold ${
                  isOk ? 'bg-emerald-50 text-[#138808] dark:bg-emerald-950/60 dark:text-emerald-300' :
                  isWarn ? 'bg-amber-50 text-[#D98200] dark:bg-amber-950/60 dark:text-amber-300' :
                  'bg-red-50 text-[#C62828] dark:bg-red-950/60 dark:text-red-300'
                }`}>
                  {stage.status}
                </span>
                <span className="text-slate-400">{stage.latencyMs} ms</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* STAGE DETAIL DRAWER */}
      {selectedStage && (
        <div className="fixed inset-y-0 right-0 z-50 w-80 bg-white dark:bg-[#0A1A33] border-l border-slate-700 p-4 shadow-2xl flex flex-col justify-between select-none">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-2">
                <Activity size={16} className="text-orange-400" />
                <h3 className="font-bold text-slate-100 text-sm">{selectedStage.name}</h3>
              </div>
              <button onClick={() => setSelectedStage(null)} className="text-slate-400 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-slate-900 rounded border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 block font-mono">STAGE STATUS</span>
                <span className="font-bold text-emerald-400 text-sm font-mono">{selectedStage.status}</span>
              </div>

              <div className="p-2.5 bg-slate-900 rounded border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 block font-mono">LATENCY CONTRIBUTION</span>
                <span className="font-bold text-orange-400 text-sm font-mono">{selectedStage.latencyMs} ms</span>
              </div>

              <div className="p-2.5 bg-slate-900 rounded border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 block font-mono">LAST STAGE TELEMETRY OUTPUT</span>
                <p className="font-mono text-xs text-slate-200">{selectedStage.lastOutput}</p>
              </div>

              {selectedStage.details && selectedStage.details.length > 0 && (
                <div className="p-2.5 bg-slate-900 rounded border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 block font-mono">EXECUTION DETAILS</span>
                  <ul className="space-y-1 text-[11px] font-mono text-slate-300">
                    {selectedStage.details.map((d, i) => (
                      <li key={i}>› {d}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setSelectedStage(null)}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-1.5 rounded text-xs transition-colors"
          >
            Close Inspector
          </button>
        </div>
      )}
    </div>
  );
};
