import React, { useState, useEffect } from 'react';
import { useMission } from '../context/MissionContext';
import { ErrorBoundary } from '../components/ErrorBoundary';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, BarChart, Bar
} from 'recharts';
import {
  Sliders, Activity, ShieldCheck, CheckCircle2, AlertTriangle, XCircle, Zap, Eye, X, Info
} from 'lucide-react';

interface InspectorDetail {
  title: string;
  type: string;
  data: Record<string, any>;
}

export const AiMonitorPage: React.FC = () => {
  const {
    fps, latency, causalResult, bayesData, bayesHistory, fusionResult,
    setBayesFactorKThreshold, setDempsterShaferConflictLimit, triggerSensorDisagreement,
    triggerHandNearObjectNoStateChange
  } = useMission();

  const [selectedInspector, setSelectedInspector] = useState<InspectorDetail | null>(null);

  const bayesChartData = bayesHistory.map((item, idx) => ({
    time: item.timestamp || `T-${10 - idx}`,
    K: item.kValue,
    threshold: item.thresholdK,
  }));

  const dsBarData = fusionResult.sources.map(src => ({
    name: src.name.replace(/\(.*\)/, '').trim(),
    Belief: Number(src.mStep.toFixed(2)),
    Plausibility: Number((src.mStep + src.mUncertain).toFixed(2)),
    status: src.status
  }));

  // Semicircle gauge angle calculation for Bayes Factor K (1 to 100 scale -> 0 to 180 deg)
  const getGaugeAngle = (k: number) => {
    const clampedK = Math.min(Math.max(k, 0), 100);
    return (clampedK / 100) * 180;
  };

  const currentGaugeAngle = getGaugeAngle(bayesData.kValue);

  return (
    <div className="space-y-4 font-sans select-none max-w-[1440px] mx-auto pb-4">
      {/* Page Header */}
      <div className="isro-card p-4 bg-white dark:bg-[#0A1A33] border-l-4 border-l-[#123F8C] flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 text-[#123F8C] dark:text-cyan-400 font-sans text-xs font-bold mb-0.5 uppercase tracking-wider">
            <Sliders size={14} />
            <span>AI MONITOR & STATISTICAL EVIDENCE ENGINE</span>
          </div>
          <h1 className="text-lg font-bold text-[#0B2A5B] dark:text-white">
            Bayes Factor, 3-Way Causal Verification & Dempster-Shafer Engine
          </h1>
          <p className="text-xs text-[#5B6675] dark:text-slate-300">
            Evaluating evidence hypotheses offline on Jetson-class platform. All metrics labeled <span className="font-mono font-bold text-[#F26B21]">Target / Simulated</span>.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="bg-[#EEF3FA] dark:bg-slate-800 text-[#123F8C] dark:text-cyan-300 px-2.5 py-1 rounded border border-[#D5DCE6] dark:border-slate-700 font-bold">
            FPS: {fps} (Target / Sim)
          </span>
          <span className="bg-[#EEF3FA] dark:bg-slate-800 text-[#123F8C] dark:text-cyan-300 px-2.5 py-1 rounded border border-[#D5DCE6] dark:border-slate-700 font-bold">
            Latency: {latency} ms (Target / Sim)
          </span>
        </div>
      </div>

      {/* TWO-COLUMN GRID: BAYES GAUGE + CAUSAL VERIFICATION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* 1. BAYES FACTOR SUBSYSTEM WITH SEMICIRCLE GAUGE */}
        <div className="isro-card p-4 bg-white dark:bg-[#0A1A33] space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h2 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Activity size={15} className="text-orange-400" />
              <span>Bayes Factor Evidence Subsystem (Jeffreys Scale)</span>
            </h2>
            <span className="text-xs font-mono font-bold text-cyan-300 bg-slate-800 px-2 py-0.5 rounded">
              K = {bayesData.kValue.toFixed(1)}
            </span>
          </div>

          {/* Semicircle Gauge Visualization */}
          <div className="p-3 bg-slate-900 rounded border border-slate-800 flex flex-col items-center justify-center relative">
            <svg className="w-64 h-36 overflow-visible" viewBox="-120 -110 240 120">
              {/* Arc background segments for Jeffreys Scale */}
              {/* Barely (0-3.2) */}
              <path d="M -100 0 A 100 100 0 0 1 -90 -43.5" fill="none" stroke="#EF4444" strokeWidth="16" />
              {/* Substantial (3.2-10) */}
              <path d="M -90 -43.5 A 100 100 0 0 1 -60 -80" fill="none" stroke="#F59E0B" strokeWidth="16" />
              {/* Strong (10-31.6) */}
              <path d="M -60 -80 A 100 100 0 0 1 0 -100" fill="none" stroke="#EAB308" strokeWidth="16" />
              {/* Very Strong (31.6-100) */}
              <path d="M 0 -100 A 100 100 0 0 1 100 0" fill="none" stroke="#10B981" strokeWidth="16" />

              {/* Gauge Needle */}
              <g transform={`rotate(${-90 + currentGaugeAngle})`}>
                <line x1="0" y1="0" x2="0" y2="-82" stroke="#FFFFFF" strokeWidth="3" />
                <circle cx="0" cy="0" r="7" fill="#F26B21" />
              </g>

              {/* Central Text Value */}
              <text x="0" y="-15" textAnchor="middle" fill="#FFFFFF" fontSize="20" fontWeight="bold" fontFamily="monospace">
                {bayesData.kValue.toFixed(1)}
              </text>
              <text x="0" y="5" textAnchor="middle" fill="#10B981" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
                {bayesData.label.toUpperCase()} EVIDENCE
              </text>
            </svg>

            <div className="flex items-center justify-between w-full text-[10px] font-mono text-slate-400 mt-2 px-4">
              <span className="text-red-400">K&lt;3.2 (Barely)</span>
              <span className="text-amber-400">K=10 (Substantial)</span>
              <span className="text-orange-400">K=31.6 (Strong)</span>
              <span className="text-emerald-400">K&ge;100 (Decisive)</span>
            </div>
          </div>

          {/* Draggable Threshold Slider & Live Line Chart */}
          <div className="space-y-2 pt-1 text-xs">
            <div className="flex items-center justify-between font-sans font-semibold text-slate-200">
              <span>Threshold Line (Default K=31.6): <strong className="font-mono text-orange-400">{bayesData.thresholdK}</strong></span>
              <span className="text-[10px] text-slate-400 italic">Draggable parameter</span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              step="0.5"
              value={bayesData.thresholdK}
              onChange={(e) => setBayesFactorKThreshold(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-orange-500"
            />
          </div>

          {/* Recharts Live Line Chart */}
          <div 
            onClick={() => setSelectedInspector({ title: 'Bayes Factor History Log', type: 'BAYES', data: bayesData })}
            className="h-32 w-full pt-1 cursor-pointer"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bayesChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0A1A33', borderColor: '#1E293B', fontSize: '11px', color: '#FFF' }} />
                <ReferenceLine y={bayesData.thresholdK} stroke="#F26B21" strokeDasharray="4 2" />
                <Line type="monotone" dataKey="K" stroke="#06B6D4" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Callout Note */}
          <div className="p-2.5 bg-slate-900 rounded border border-slate-800 flex items-start space-x-2 text-xs text-slate-300 font-sans">
            <Info size={14} className="text-cyan-400 shrink-0 mt-0.5" />
            <p className="italic text-[11px]">
              "Neural confidence is not probability: Bayes Factor converts raw softmax outputs into physical likelihood ratio K = P(Action | H1) / P(Action | H0)."
            </p>
          </div>
        </div>

        {/* 2. CAUSAL VERIFICATION SUBSYSTEM */}
        <div className="isro-card p-4 bg-white dark:bg-[#0A1A33] space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h2 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck size={15} className="text-orange-400" />
              <span>3-Way Causal Verification Engine</span>
            </h2>
            <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono ${
              causalResult.accepted ? 'bg-emerald-950 text-emerald-300 border border-emerald-600' : 'bg-red-950 text-red-300 border border-red-600'
            }`}>
              {causalResult.accepted ? 'ACCEPTED' : 'REJECTED'}
            </span>
          </div>

          {/* Large Verdict Banner */}
          <div
            onClick={() => setSelectedInspector({ title: 'Causal Verification Report', type: 'CAUSAL', data: causalResult })}
            className={`p-4 rounded border cursor-pointer transition-all flex items-center justify-between ${
              causalResult.accepted
                ? 'bg-emerald-950/80 border-emerald-600 text-emerald-200'
                : 'bg-red-950/90 border-red-600 text-red-200 animate-pulse'
            }`}
          >
            <div className="flex items-center space-x-3">
              {causalResult.accepted ? (
                <CheckCircle2 size={26} className="text-emerald-400 shrink-0" />
              ) : (
                <XCircle size={26} className="text-red-400 shrink-0" />
              )}
              <div>
                <span className="font-bold text-base block">
                  VERDICT: {causalResult.accepted ? 'ACTION ACCEPTED' : 'ACTION REJECTED'}
                </span>
                <span className="text-xs font-mono text-slate-300">
                  {causalResult.rejectionReason || '3/3 Evidence channels in full agreement.'}
                </span>
              </div>
            </div>
          </div>

          {/* 3 Evidence Cards */}
          <div className="space-y-2">
            {causalResult.evidences.map((ev, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedInspector({ title: `Evidence: ${ev.name}`, type: 'EVIDENCE', data: ev })}
                className="p-3 rounded border border-slate-800 bg-slate-900 cursor-pointer hover:border-slate-700 flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-200 text-xs">{ev.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({ev.category})</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{ev.detail}</p>
                </div>

                <div>
                  {ev.status === 'PASS' ? (
                    <span className="flex items-center gap-1 font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded text-xs">
                      <CheckCircle2 size={13} /> PASS
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 font-bold text-red-400 bg-red-950/80 px-2.5 py-1 rounded text-xs">
                      <XCircle size={13} /> FAIL
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800 flex justify-end">
            <button onClick={triggerHandNearObjectNoStateChange} className="btn-isro-outline">
              <Eye size={13} />
              <span>Simulate Causal Rejection</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. DEMPSTER-SHAFER MULTI-SENSOR FUSION SUBSYSTEM */}
      <div className="isro-card p-4 bg-white dark:bg-[#0A1A33] space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h2 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Zap size={15} className="text-orange-400" />
            <span>Dempster-Shafer Multi-Sensor Fusion & Conflict Isolation</span>
          </h2>
          <div className="flex items-center space-x-3 text-xs font-mono">
            <span className="text-slate-300">K_conflict: <strong className="text-orange-400 font-bold">{fusionResult.kConflict}</strong></span>
            <span className="text-slate-400">|</span>
            <span className="text-emerald-400 font-bold">Belief: {fusionResult.fusedBelief}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Stacked Belief vs Plausibility Bar Chart (6 Cols) */}
          <div className="lg:col-span-6 space-y-2">
            <span className="text-xs font-bold text-slate-200 block">Belief vs Plausibility per Sensor Source</span>
            <div className="h-44 w-full bg-slate-900 p-2 rounded border border-slate-800">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dsBarData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                  <YAxis domain={[0, 1]} tick={{ fontSize: 10, fill: '#94A3B8' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0A1A33', borderColor: '#1E293B', fontSize: '11px', color: '#FFF' }} />
                  <Bar dataKey="Belief" fill="#06B6D4" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Plausibility" fill="#F26B21" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 3-Node Interactive Graph with Isolation (6 Cols) */}
          <div className="lg:col-span-6 space-y-2">
            <span className="text-xs font-bold text-slate-200 block">3-Node Sensor Topology Graph</span>
            <div className="h-44 bg-slate-900 p-3 rounded border border-slate-800 flex items-center justify-around relative">
              {fusionResult.sources.map((src) => {
                const isIsolated = src.status === 'ISOLATED';
                return (
                  <div
                    key={src.id}
                    onClick={() => setSelectedInspector({ title: `Sensor: ${src.name}`, type: 'SENSOR', data: src })}
                    className={`p-3 rounded-lg border text-center cursor-pointer transition-all flex flex-col items-center justify-center w-28 h-28 ${
                      isIsolated
                        ? 'bg-slate-800/60 border-slate-600/60 text-slate-500 opacity-50 stroke-dash'
                        : 'bg-slate-950 border-cyan-500/80 text-white shadow-md'
                    }`}
                  >
                    <span className={`w-3 h-3 rounded-full mb-1 ${isIsolated ? 'bg-slate-500' : 'bg-emerald-400 animate-pulse'}`} />
                    <span className="font-bold text-xs leading-tight">{src.name.split(' ')[0]}</span>
                    <span className="text-[10px] font-mono text-slate-400 mt-1">m={src.mStep.toFixed(2)}</span>
                    <span className={`text-[9px] font-mono font-bold mt-1 px-1 rounded ${isIsolated ? 'bg-slate-700 text-slate-400' : 'bg-emerald-950 text-emerald-400'}`}>
                      {src.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Fusion Control Bar */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs">
            <span className="font-semibold text-slate-200">K_conflict Limit:</span>
            <input
              type="range"
              min="0.30"
              max="0.90"
              step="0.05"
              value={0.65}
              onChange={(e) => setDempsterShaferConflictLimit(Number(e.target.value))}
              className="w-32 h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-orange-500"
            />
            <span className="font-mono text-orange-400 font-bold">0.65</span>
          </div>

          <button onClick={triggerSensorDisagreement} className="btn-isro-cta text-xs">
            <Zap size={14} />
            <span>Inject Sensor Disagreement</span>
          </button>
        </div>
      </div>

      {/* RIGHT SIDE INSPECTOR DRAWER FOR JSON DETAILS */}
      {selectedInspector && (
        <div className="fixed inset-y-0 right-0 z-50 w-96 bg-[#0A1A33] border-l border-slate-700 p-4 shadow-2xl flex flex-col justify-between select-none font-sans text-xs">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-2">
                <Info size={16} className="text-cyan-400" />
                <h3 className="font-bold text-white text-sm">{selectedInspector.title}</h3>
              </div>
              <button onClick={() => setSelectedInspector(null)} className="text-slate-400 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase">RAW SUBSYSTEM TELEMETRY JSON</span>
              <pre className="p-3 bg-slate-950 rounded border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto max-h-96">
                {JSON.stringify(selectedInspector.data, null, 2)}
              </pre>
            </div>
          </div>

          <button
            onClick={() => setSelectedInspector(null)}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-1.5 rounded text-xs transition-colors"
          >
            Close Panel
          </button>
        </div>
      )}
    </div>
  );
};
