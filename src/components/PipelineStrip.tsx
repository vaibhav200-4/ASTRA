import React from 'react';
import { useMission } from '../context/MissionContext';
import { ArrowRight, CheckCircle2, AlertTriangle, XCircle, ShieldCheck } from 'lucide-react';

export const PipelineStrip: React.FC = () => {
  const { pipelineStages, language } = useMission();

  return (
    <div className="isro-card p-3 mb-4 bg-white dark:bg-[#0A1A33]">
      <div className="flex items-center justify-between mb-2">
        <h3 className="isro-section-title mb-0 text-sm">
          {language === 'hi' ? 'लाइव प्रोसेसिंग पाइपलाइन' : 'Live Processing Pipeline'}
        </h3>
        <span className="text-[11px] font-mono text-[#5B6675] dark:text-slate-400 bg-[#EEF3FA] dark:bg-slate-800 px-2 py-0.5 rounded">
          Total Latency: {pipelineStages.reduce((acc, s) => acc + s.latencyMs, 0)} ms (Target / Simulated)
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {pipelineStages.map((stage, idx) => {
          const isOk = stage.status === 'NOMINAL';
          const isWarn = stage.status === 'WARNING' || stage.status === 'ISOLATED';
          const isCrit = stage.status === 'CRITICAL' || stage.status === 'REJECTED';

          return (
            <div 
              key={stage.id}
              className={`p-2 rounded border text-xs flex flex-col justify-between transition-all ${
                stage.active
                  ? 'border-[#F26B21] bg-[#EEF3FA]/70 dark:bg-slate-800/90 shadow-sm'
                  : 'border-[#D5DCE6] dark:border-slate-800 bg-white dark:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono font-bold text-[10px] text-[#0B2A5B] dark:text-cyan-300">
                  0{idx + 1}. {stage.shortName}
                </span>
                {isOk && <CheckCircle2 size={12} className="text-[#138808]" />}
                {isWarn && <AlertTriangle size={12} className="text-[#D98200]" />}
                {isCrit && <XCircle size={12} className="text-[#C62828]" />}
              </div>

              <div className="text-[11px] font-semibold text-[#1B2430] dark:text-slate-100 truncate" title={stage.lastOutput}>
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
                <span className="text-[#5B6675] dark:text-slate-400">{stage.latencyMs} ms</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
