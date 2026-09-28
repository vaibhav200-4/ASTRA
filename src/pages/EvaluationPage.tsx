import React, { useState } from 'react';
import { useMission } from '../context/MissionContext';
import { BarChart2, CheckCircle2, AlertTriangle, Upload, Zap, ShieldCheck, Cpu } from 'lucide-react';

export const EvaluationPage: React.FC = () => {
  const { evaluationMetrics, stressTestChecklist, loadCustomMetricsJson, language } = useMission();
  const [jsonText, setJsonText] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleLoadJson = () => {
    if (jsonText.trim()) {
      loadCustomMetricsJson(jsonText);
      setIsModalOpen(false);
      setJsonText('');
    }
  };

  return (
    <div className="space-y-4 font-sans">
      {/* Header Banner */}
      <div className="isro-card p-4 bg-white dark:bg-[#0A1A33] border-l-4 border-l-[#123F8C] flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 text-[#123F8C] dark:text-cyan-400 font-mono text-xs font-semibold mb-0.5">
            <BarChart2 size={14} />
            <span>PART L — EVALUATION DASHBOARD & BENCHMARKS</span>
          </div>
          <h1 className="text-lg font-bold text-[#0B2A5B] dark:text-white">
            Performance Evaluation & Stress Test Suite
          </h1>
          <p className="text-xs text-[#5B6675] dark:text-slate-300">
            Per-step precision/recall, confusion matrix, false completion rate, and live stress test checklist. All numbers labelled <span className="font-mono font-semibold text-[#F26B21]">Target / Simulated</span>.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-isro-cta"
          >
            <Upload size={13} />
            <span>Load Real Results JSON</span>
          </button>
        </div>
      </div>

      {/* METRIC HIGHLIGHT CARDS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 font-mono text-xs">
        <div className="isro-card p-3 bg-white dark:bg-[#0A1A33]">
          <span className="text-[10px] text-[#5B6675] block">FALSE COMPLETION</span>
          <span className="text-lg font-bold text-[#138808]">{evaluationMetrics.falseCompletionRatePercent}%</span>
          <span className="text-[9px] text-[#5B6675] block mt-1">(Target / Simulated)</span>
        </div>

        <div className="isro-card p-3 bg-white dark:bg-[#0A1A33]">
          <span className="text-[10px] text-[#5B6675] block">SKIPPED STEP DETECTION</span>
          <span className="text-lg font-bold text-[#123F8C] dark:text-cyan-300">{evaluationMetrics.skippedStepDetectionRatePercent}%</span>
          <span className="text-[9px] text-[#5B6675] block mt-1">(Target / Simulated)</span>
        </div>

        <div className="isro-card p-3 bg-white dark:bg-[#0A1A33]">
          <span className="text-[10px] text-[#5B6675] block">FALSE ALERT RATE</span>
          <span className="text-lg font-bold text-[#138808]">{evaluationMetrics.falseAlertRatePercent}%</span>
          <span className="text-[9px] text-[#5B6675] block mt-1">(Target / Simulated)</span>
        </div>

        <div className="isro-card p-3 bg-white dark:bg-[#0A1A33]">
          <span className="text-[10px] text-[#5B6675] block">ALERT LATENCY</span>
          <span className="text-lg font-bold text-[#F26B21]">{evaluationMetrics.alertLatencyMs} ms</span>
          <span className="text-[9px] text-[#5B6675] block mt-1">(Target / Simulated)</span>
        </div>

        <div className="isro-card p-3 bg-white dark:bg-[#0A1A33]">
          <span className="text-[10px] text-[#5B6675] block">EDGE MEMORY</span>
          <span className="text-lg font-bold text-[#0B2A5B] dark:text-white">{evaluationMetrics.edgeMemoryUsageMb} MB</span>
          <span className="text-[9px] text-[#5B6675] block mt-1">(Target / Simulated)</span>
        </div>

        <div className="isro-card p-3 bg-white dark:bg-[#0A1A33]">
          <span className="text-[10px] text-[#5B6675] block">EDGE POWER</span>
          <span className="text-lg font-bold text-[#138808]">{evaluationMetrics.edgePowerUsageWatts} W</span>
          <span className="text-[9px] text-[#5B6675] block mt-1">(Target / Simulated)</span>
        </div>
      </div>

      {/* GRID: PER-STEP PRECISION/RECALL + CONFUSION MATRIX */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Per-step Table */}
        <div className="isro-card p-4 bg-white dark:bg-[#0A1A33] space-y-3">
          <div className="flex items-center justify-between border-b border-[#EEF3FA] dark:border-slate-800 pb-2">
            <h3 className="isro-section-title mb-0 text-xs">
              Per-Step Validation Accuracy Breakdown
            </h3>
            <span className="text-[10px] font-mono text-[#5B6675] bg-[#EEF3FA] dark:bg-slate-800 px-2 py-0.5 rounded">
              Target / Simulated
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans border-collapse">
              <thead>
                <tr className="bg-[#EEF3FA] dark:bg-slate-900 text-[#0B2A5B] dark:text-slate-200 border-b border-[#D5DCE6] dark:border-slate-800">
                  <th className="p-2 font-semibold font-mono">Step</th>
                  <th className="p-2 font-semibold">Protocol Action</th>
                  <th className="p-2 font-semibold font-mono">Precision</th>
                  <th className="p-2 font-semibold font-mono">Recall</th>
                  <th className="p-2 font-semibold font-mono">F1 Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF3FA] dark:divide-slate-800 font-mono text-xs">
                {evaluationMetrics.perStepMetrics.map(item => (
                  <tr key={item.stepId} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-2 font-bold text-[#0B2A5B] dark:text-slate-200">{item.stepId}</td>
                    <td className="p-2 font-sans font-medium text-[#0B2A5B] dark:text-slate-200">{item.name}</td>
                    <td className="p-2 text-[#138808] font-bold">{item.precision}%</td>
                    <td className="p-2 text-[#123F8C] dark:text-cyan-300 font-bold">{item.recall}%</td>
                    <td className="p-2 text-[#F26B21] font-bold">{item.f1Score}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Confusion Matrix Table */}
        <div className="isro-card p-4 bg-white dark:bg-[#0A1A33] space-y-3">
          <div className="flex items-center justify-between border-b border-[#EEF3FA] dark:border-slate-800 pb-2">
            <h3 className="isro-section-title mb-0 text-xs">
              Protocol Confusion Matrix
            </h3>
            <span className="text-[10px] font-mono text-[#5B6675] bg-[#EEF3FA] dark:bg-slate-800 px-2 py-0.5 rounded">
              Predicted vs Actual (Target / Simulated)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center text-xs font-mono border-collapse">
              <thead>
                <tr className="bg-[#EEF3FA] dark:bg-slate-900 text-[#0B2A5B] dark:text-slate-200 border-b border-[#D5DCE6] dark:border-slate-800">
                  <th className="p-2 text-left">Actual \ Pred</th>
                  {evaluationMetrics.confusionMatrix.labels.map(l => (
                    <th key={l} className="p-2">{l}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {evaluationMetrics.confusionMatrix.matrix.map((row, rIdx) => (
                  <tr key={rIdx} className="border-b border-[#EEF3FA] dark:border-slate-800">
                    <td className="p-2 font-bold text-left text-[#0B2A5B] dark:text-slate-200 bg-[#EEF3FA] dark:bg-slate-900">
                      {evaluationMetrics.confusionMatrix.labels[rIdx]}
                    </td>
                    {row.map((val, cIdx) => (
                      <td 
                        key={cIdx} 
                        className={`p-2 font-bold ${
                          rIdx === cIdx ? 'bg-emerald-50 text-[#138808] dark:bg-emerald-950 dark:text-emerald-300' : val > 0 ? 'bg-amber-50 text-[#D98200] dark:bg-amber-950 dark:text-amber-300' : 'text-[#5B6675]'
                        }`}
                      >
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* STRESS TESTS CHECKLIST SECTION */}
      <div className="isro-card p-4 bg-white dark:bg-[#0A1A33] space-y-3">
        <div className="flex items-center justify-between border-b border-[#EEF3FA] dark:border-slate-800 pb-2">
          <h2 className="isro-section-title mb-0 text-xs font-mono">
            Live Robustness & Stress Tests Checklist
          </h2>
          <span className="text-xs font-mono text-[#138808] font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-300">
            Driven by Simulation Controls
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {stressTestChecklist.map(st => (
            <div 
              key={st.id}
              className={`p-3 rounded border text-xs space-y-1 ${
                st.status === 'ACTIVE'
                  ? 'bg-amber-50 border-amber-400 text-[#D98200] dark:bg-amber-950 dark:text-amber-300 font-semibold'
                  : 'bg-[#F5F7FA] dark:bg-slate-900 border-[#D5DCE6] dark:border-slate-800 text-[#0B2A5B] dark:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <span>{st.name}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                  st.status === 'PASS' ? 'bg-emerald-100 text-[#138808]' : 'bg-amber-500 text-white animate-pulse'
                }`}>
                  {st.status}
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#5B6675] block">Category: {st.category}</span>
              <p className="text-[11px] text-[#5B6675] dark:text-slate-300 font-mono mt-1">{st.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL FOR LOADING CUSTOM JSON */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="isro-card p-5 max-w-lg w-full bg-white dark:bg-[#0A1A33] space-y-3">
            <h3 className="font-bold text-sm text-[#0B2A5B] dark:text-white">Load Custom Evaluation Metrics JSON</h3>
            <p className="text-xs text-[#5B6675] dark:text-slate-300">
              Paste custom empirical benchmark JSON containing per-step precision/recall, confusion matrix, or hardware metrics:
            </p>
            <textarea 
              rows={6}
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              placeholder='{"perStepMetrics": [...], "falseCompletionRatePercent": 0.3, "isSimulatedData": false}'
              className="w-full p-2 bg-[#F5F7FA] dark:bg-slate-900 border border-[#D5DCE6] dark:border-slate-800 rounded font-mono text-xs text-[#1B2430] dark:text-slate-100 focus:outline-none"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button onClick={() => setIsModalOpen(false)} className="btn-isro-outline">Cancel</button>
              <button onClick={handleLoadJson} className="btn-isro-primary">Load & Render</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
