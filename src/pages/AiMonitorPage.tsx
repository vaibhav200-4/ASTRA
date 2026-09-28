import React, { useState, useEffect } from 'react';
import { useMission } from '../context/MissionContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Sliders, Activity, Cpu, ShieldCheck, CheckCircle2, AlertTriangle, XCircle, Zap, Eye, AlertOctagon } from 'lucide-react';

export const AiMonitorPage: React.FC = () => {
  const { 
    fps, latency, causalResult, bayesData, bayesHistory, fusionResult, 
    setBayesFactorKThreshold, setDempsterShaferConflictLimit, triggerSensorDisagreement,
    triggerHandNearObjectNoStateChange, language 
  } = useMission();

  const [bayesChartData, setBayesChartData] = useState<{ time: string; K: number; threshold: number }[]>([]);

  useEffect(() => {
    setBayesChartData(
      bayesHistory.map((item, idx) => ({
        time: item.timestamp || `T-${10 - idx}`,
        K: item.kValue,
        threshold: item.thresholdK,
      }))
    );
  }, [bayesHistory]);

  return (
    <div className="space-y-4 font-sans">
      {/* Header Banner */}
      <div className="isro-card p-4 bg-white dark:bg-[#0A1A33] border-l-4 border-l-[#123F8C] flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 text-[#123F8C] dark:text-cyan-400 font-mono text-xs font-semibold mb-0.5">
            <Sliders size={14} />
            <span>AI MONITOR & STATISTICAL EVIDENCE ENGINE</span>
          </div>
          <h1 className="text-lg font-bold text-[#0B2A5B] dark:text-white">
            Statistical Evidence & Multi-Sensor Fusion Engine
          </h1>
          <p className="text-xs text-[#5B6675] dark:text-slate-300">
            Causal verification, Bayes factor hypothesis evaluation, and Dempster-Shafer fault isolation. All metrics labelled <span className="font-mono font-semibold text-[#F26B21]">Target / Simulated</span>.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="bg-[#EEF3FA] dark:bg-slate-800 text-[#123F8C] dark:text-cyan-300 px-2.5 py-1 rounded border border-[#D5DCE6] dark:border-slate-700">
            FPS: {fps} (Target / Simulated)
          </span>
          <span className="bg-[#EEF3FA] dark:bg-slate-800 text-[#123F8C] dark:text-cyan-300 px-2.5 py-1 rounded border border-[#D5DCE6] dark:border-slate-700">
            Latency: {latency} ms (Target / Simulated)
          </span>
        </div>
      </div>

      {/* Grid: Part A Causal Verification + Part B Bayes Factor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* PART A: Causal Verification Panel */}
        <div className="isro-card p-4 bg-white dark:bg-[#0A1A33] space-y-3">
          <div className="flex items-center justify-between border-b border-[#EEF3FA] dark:border-slate-800 pb-2">
            <h2 className="isro-section-title mb-0 text-sm">
              PART A — Causal Verification Engine
            </h2>
            <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono ${
              causalResult.accepted
                ? 'bg-emerald-50 text-[#138808] border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300'
                : 'bg-red-50 text-[#C62828] border border-red-300 dark:bg-red-950/60 dark:text-red-300'
            }`}>
              {causalResult.accepted ? 'STEP ACCEPTED' : 'STEP REJECTED'}
            </span>
          </div>

          <p className="text-xs text-[#5B6675] dark:text-slate-300">
            Requires 3-way agreement between Action evidence, State-change evidence, and Protocol-context evidence.
          </p>

          {/* 3 Evidence Rows */}
          <div className="space-y-2">
            {causalResult.evidences.map((ev, idx) => (
              <div 
                key={idx}
                className="p-2.5 rounded border border-[#D5DCE6] dark:border-slate-800 bg-[#F5F7FA] dark:bg-slate-900/60 flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-[#0B2A5B] dark:text-slate-200">{ev.name}</span>
                    <span className="text-[10px] text-[#5B6675] font-mono">({ev.category})</span>
                  </div>
                  <p className="text-[11px] text-[#5B6675] dark:text-slate-400">{ev.detail}</p>
                </div>
                <div>
                  {ev.status === 'PASS' && (
                    <span className="flex items-center gap-1 font-bold text-[#138808] bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                      <CheckCircle2 size={13} /> PASS
                    </span>
                  )}
                  {ev.status === 'FAIL' && (
                    <span className="flex items-center gap-1 font-bold text-[#C62828] bg-red-50 dark:bg-red-950/60 px-2 py-0.5 rounded">
                      <XCircle size={13} /> FAIL
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Rejection Details */}
          {!causalResult.accepted && (
            <div className="p-2.5 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 rounded text-xs text-[#C62828] dark:text-red-300 space-y-1">
              <span className="font-bold flex items-center gap-1">
                <AlertOctagon size={14} /> Rejection Reason:
              </span>
              <p className="font-mono text-[11px]">{causalResult.rejectionReason}</p>
            </div>
          )}

          {/* Simulation Action */}
          <div className="pt-2 border-t border-[#EEF3FA] dark:border-slate-800 flex justify-end">
            <button 
              onClick={triggerHandNearObjectNoStateChange}
              className="btn-isro-outline"
            >
              <Eye size={13} />
              <span>Simulate: "Hand near object, no state change"</span>
            </button>
          </div>
        </div>

        {/* PART B: Bayes-Factor Evidence Engine */}
        <div className="isro-card p-4 bg-white dark:bg-[#0A1A33] space-y-3">
          <div className="flex items-center justify-between border-b border-[#EEF3FA] dark:border-slate-800 pb-2">
            <h2 className="isro-section-title mb-0 text-sm">
              PART B — Bayes-Factor Evidence Engine
            </h2>
            <span className="text-[11px] font-mono text-[#123F8C] dark:text-cyan-300 bg-[#EEF3FA] dark:bg-slate-800 px-2 py-0.5 rounded">
              K = {bayesData.kValue}
            </span>
          </div>

          {/* K Gauge + Jeffreys Label */}
          <div className="p-3 bg-[#EEF3FA] dark:bg-slate-900 rounded border border-[#D5DCE6] dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#0B2A5B] dark:text-slate-200">Jeffreys Scale Assessment:</span>
              <span className={`font-bold font-mono px-2 py-0.5 rounded text-xs ${
                bayesData.isAboveThreshold 
                  ? 'bg-emerald-100 text-[#138808] dark:bg-emerald-950 dark:text-emerald-300' 
                  : 'bg-amber-100 text-[#D98200] dark:bg-amber-950 dark:text-amber-300'
              }`}>
                {bayesData.label} Evidence
              </span>
            </div>

            {/* Gauge Bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-3 rounded-full overflow-hidden relative">
              <div 
                className="bg-[#123F8C] dark:bg-cyan-500 h-full transition-all duration-300"
                style={{ width: `${Math.min(100, (bayesData.kValue / 100) * 100)}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-[#5B6675] dark:text-slate-400">
              <span>K=1 (Barely)</span>
              <span>K=10 (Substantial)</span>
              <span>K=31.6 (Strong/Default)</span>
              <span>K=100 (Decisive)</span>
            </div>
          </div>

          {/* Threshold Slider */}
          <div className="space-y-1.5 pt-1 text-xs">
            <div className="flex items-center justify-between font-semibold">
              <span className="text-[#0B2A5B] dark:text-slate-200">
                Bayes Factor Threshold (K): <span className="font-mono text-[#F26B21]">{bayesData.thresholdK}</span>
              </span>
              <span className="text-[10px] text-[#5B6675] italic">configurable engineering parameter</span>
            </div>
            <input 
              type="range"
              min="1"
              max="100"
              step="0.5"
              value={bayesData.thresholdK}
              onChange={(e) => setBayesFactorKThreshold(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded appearance-none cursor-pointer accent-[#F26B21]"
            />
          </div>

          {/* Chart of K over time */}
          <div className="h-32 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bayesChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D5DCE6" />
                <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#5B6675' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: '#5B6675' }} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#D5DCE6', fontSize: '11px' }} />
                <ReferenceLine y={bayesData.thresholdK} stroke="#F26B21" strokeDasharray="3 3" label={{ value: 'Threshold', fill: '#F26B21', fontSize: 9 }} />
                <Line type="monotone" dataKey="K" stroke="#123F8C" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Explicit Note */}
          <p className="text-[11px] font-mono text-[#5B6675] dark:text-slate-400 italic bg-[#EEF3FA] dark:bg-slate-900 p-2 rounded border border-[#D5DCE6] dark:border-slate-800">
            Note: "Neural confidence is not treated as probability".
          </p>
        </div>
      </div>

      {/* PART C: Dempster-Shafer Multi-Sensor Fusion & Fault Isolation */}
      <div className="isro-card p-4 bg-white dark:bg-[#0A1A33] space-y-3">
        <div className="flex items-center justify-between border-b border-[#EEF3FA] dark:border-slate-800 pb-2">
          <h2 className="isro-section-title mb-0 text-sm">
            PART C — Dempster-Shafer Multi-Sensor Fusion & Fault Isolation
          </h2>
          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="bg-[#EEF3FA] dark:bg-slate-800 text-[#0B2A5B] dark:text-slate-200 px-2 py-0.5 rounded border border-[#D5DCE6] dark:border-slate-700">
              Belief: {fusionResult.fusedBelief}
            </span>
            <span className="bg-[#EEF3FA] dark:bg-slate-800 text-[#0B2A5B] dark:text-slate-200 px-2 py-0.5 rounded border border-[#D5DCE6] dark:border-slate-700">
              Plausibility: {fusionResult.fusedPlausibility}
            </span>
            <span className={`px-2 py-0.5 rounded font-bold ${
              fusionResult.conflictExceeded
                ? 'bg-amber-100 text-[#D98200] dark:bg-amber-950 dark:text-amber-300 border border-amber-300'
                : 'bg-emerald-50 text-[#138808] dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
            }`}>
              K_conflict: {fusionResult.kConflict}
            </span>
          </div>
        </div>

        {/* Mass Assignment & Status Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans border-collapse">
            <thead>
              <tr className="bg-[#EEF3FA] dark:bg-slate-900 text-[#0B2A5B] dark:text-slate-200 border-b border-[#D5DCE6] dark:border-slate-800">
                <th className="p-2 font-semibold">Sensor Source</th>
                <th className="p-2 font-semibold font-mono">m(Step)</th>
                <th className="p-2 font-semibold font-mono">m(Anomaly)</th>
                <th className="p-2 font-semibold font-mono">m(Uncertain)</th>
                <th className="p-2 font-semibold">Status</th>
                <th className="p-2 font-semibold">Fusion Included?</th>
              </tr>
            </thead>
            <tbody>
              {fusionResult.sources.map((src) => {
                const isIsolated = src.status === 'ISOLATED';
                return (
                  <tr 
                    key={src.id}
                    className={`border-b border-[#EEF3FA] dark:border-slate-800 transition-colors ${
                      isIsolated ? 'bg-slate-100 dark:bg-slate-900/80 text-[#5B6675] opacity-60' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="p-2 font-medium flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${isIsolated ? 'bg-amber-600' : 'bg-[#138808]'}`}></span>
                      <span>{src.name}</span>
                    </td>
                    <td className="p-2 font-mono">{src.mStep}</td>
                    <td className="p-2 font-mono">{src.mAnomaly}</td>
                    <td className="p-2 font-mono">{src.mUncertain}</td>
                    <td className="p-2 font-mono">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        isIsolated ? 'bg-amber-100 text-[#D98200]' : 'bg-emerald-100 text-[#138808]'
                      }`}>
                        {src.status}
                      </span>
                    </td>
                    <td className="p-2 font-mono">
                      {src.isIncluded ? (
                        <span className="text-[#138808] font-semibold">YES (Active)</span>
                      ) : (
                        <span className="text-[#C62828] font-semibold">NO (Isolated)</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Isolation Alert if Triggered */}
        {fusionResult.conflictExceeded && (
          <div className="p-2.5 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 rounded text-xs text-[#D98200] dark:text-amber-300 flex items-center justify-between">
            <span className="font-semibold flex items-center gap-1.5">
              <AlertTriangle size={15} />
              <span>
                Sensor Conflict Exceeded Limit (K_conflict = {fusionResult.kConflict} &gt; Limit). Offending source <strong className="font-mono text-[#C62828]">{fusionResult.isolatedSourceId || 'HOI'}</strong> ISOLATED from Dempster-Shafer combination.
              </span>
            </span>
          </div>
        )}

        {/* Controls */}
        <div className="pt-2 border-t border-[#EEF3FA] dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-[#0B2A5B] dark:text-slate-200">Conflict Limit:</span>
            <input 
              type="range"
              min="0.30"
              max="0.90"
              step="0.05"
              value={0.65}
              onChange={(e) => setDempsterShaferConflictLimit(Number(e.target.value))}
              className="w-28 h-1.5 bg-slate-200 dark:bg-slate-800 rounded appearance-none cursor-pointer accent-[#123F8C]"
            />
            <span className="font-mono text-[#123F8C] dark:text-cyan-300 font-bold">0.65</span>
          </div>

          <button 
            onClick={triggerSensorDisagreement}
            className="btn-isro-cta"
          >
            <Zap size={14} />
            <span>Inject Sensor Disagreement</span>
          </button>
        </div>
      </div>
    </div>
  );
};
