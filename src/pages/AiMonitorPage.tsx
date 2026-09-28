import React, { useState } from 'react';
import { useMission } from '../context/MissionContext';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, BarChart, Bar
} from 'recharts';
import {
  Sliders, Activity, ShieldCheck, CheckCircle2, XCircle, Eye, X, Info
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
  const isAccepted = causalResult.accepted;

  return (
    <div className="space-y-4 font-sans select-none max-w-[1440px] mx-auto pb-4">
      {/* Page Header */}
      <div className="isro-card p-4 bg-white dark:bg-[#0A1A33] border-l-4 border-l-[#123F8C] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-[#123F8C] dark:text-[#7DD3FC] font-sans text-xs font-bold mb-0.5 uppercase tracking-wider">
            <Sliders size={14} />
            <span>AI MONITOR & STATISTICAL EVIDENCE ENGINE</span>
          </div>
          <h1 className="text-lg font-bold text-[#1B2430] dark:text-[#F1F5F9]">
            Bayes Factor, 3-Way Causal Verification & Dempster-Shafer Engine
          </h1>
          <p className="text-xs text-[#4A5568] dark:text-[#B8C4D6]">
            Evaluating evidence hypotheses offline on Jetson-class platform. All metrics labeled <span className="font-mono font-bold text-[#F26B21] dark:text-[#FFA366]">Target / Simulated</span>.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="bg-[#EEF3FA] dark:bg-slate-800 text-[#123F8C] dark:text-[#7DD3FC] px-2.5 py-1 rounded border border-[#D5DCE6] dark:border-slate-700 font-bold">
            FPS: {fps} (Target / Sim)
          </span>
          <span className="bg-[#EEF3FA] dark:bg-slate-800 text-[#123F8C] dark:text-[#7DD3FC] px-2.5 py-1 rounded border border-[#D5DCE6] dark:border-slate-700 font-bold">
            Latency: {latency} ms (Target / Sim)
          </span>
        </div>
      </div>

      {/* TWO-COLUMN GRID: BAYES GAUGE + CAUSAL VERIFICATION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* 1. BAYES FACTOR SUBSYSTEM WITH SEMICIRCLE GAUGE */}
        <div className="isro-card p-4 bg-white dark:bg-[#0A1A33] space-y-3">
          <div className="flex items-center justify-between border-b border-[#D5DCE6] dark:border-slate-800 pb-2">
            <h2 className="text-sm font-semibold text-[#1B2430] dark:text-[#F1F5F9] flex items-center gap-2 font-sans border-l-[3px] border-[#F26B21] pl-2">
              <Activity size={15} className="text-[#F26B21] dark:text-[#FFA366]" />
              <span>Bayes Factor Evidence Subsystem (Jeffreys Scale)</span>
            </h2>
            <span className="text-xs font-mono font-bold text-white bg-[#0284C7] px-2.5 py-0.5 rounded">
              K = {bayesData.kValue.toFixed(1)}
            </span>
          </div>

          {/* Semicircle Gauge Visualization */}
          <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded border border-slate-300 dark:border-slate-800 flex flex-col items-center justify-center relative">
            <svg className="w-64 h-36 overflow-visible" viewBox="-120 -110 240 120">
              {/* Arc background segments for Jeffreys Scale */}
              <path d="M -100 0 A 100 100 0 0 1 -90 -43.5" fill="none" stroke="#FF6B6B" strokeWidth="16" />
              <path d="M -90 -43.5 A 100 100 0 0 1 -60 -80" fill="none" stroke="#FBBF24" strokeWidth="16" />
              <path d="M -60 -80 A 100 100 0 0 1 0 -100" fill="none" stroke="#FFA366" strokeWidth="16" />
              <path d="M 0 -100 A 100 100 0 0 1 100 0" fill="none" stroke="#4ADE80" strokeWidth="16" />

              {/* Gauge Needle */}
              <g transform={`rotate(${-90 + currentGaugeAngle})`}>
                <line x1="0" y1="0" x2="0" y2="-82" stroke="#F1F5F9" strokeWidth="3" />
                <circle cx="0" cy="0" r="7" fill="#F26B21" />
              </g>

              {/* Central Text Value */}
              <text x="0" y="-15" textAnchor="middle" className="fill-[#1B2430] dark:fill-[#F1F5F9]" fontSize="20" fontWeight="bold" fontFamily="monospace">
                {bayesData.kValue.toFixed(1)}
              </text>
              <text x="0" y="5" textAnchor="middle" fill="#4ADE80" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                {bayesData.label.toUpperCase()} EVIDENCE
              </text>
            </svg>

            <div className="flex items-center justify-between w-full text-xs font-mono font-bold text-[#4A5568] dark:text-[#B8C4D6] mt-2 px-4">
              <span className="text-[#FF6B6B]">K&lt;3.2 (Barely)</span>
              <span className="text-[#FBBF24]">K=10 (Substantial)</span>
              <span className="text-[#4ADE80]">K=31.6 (Strong)</span>
              <span className="text-[#4ADE80]">K&gt;100 (Decisive)</span>
            </div>
          </div>

          {/* Jeffreys Scale Interpretation Table */}
          <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded border border-slate-300 dark:border-slate-800 text-xs font-mono space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#4A5568] dark:text-[#B8C4D6] font-bold">Log10(K) Factor:</span>
              <span className="font-bold text-[#123F8C] dark:text-[#7DD3FC]">{(Math.log10(bayesData.kValue || 1)).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#4A5568] dark:text-[#B8C4D6] font-bold">Hypothesis Acceptance:</span>
              <span className="font-bold text-[#0F6B06] dark:text-[#4ADE80]">{bayesData.hypothesis}</span>
            </div>
          </div>

          {/* Interactive Threshold Slider */}
          <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded border border-slate-300 dark:border-slate-800 space-y-1.5 font-sans">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-[#1B2430] dark:text-[#F1F5F9]">Adjust Decision Threshold (K_min):</span>
              <span className="font-mono text-[#F26B21] dark:text-[#FFA366] font-bold">{bayesData.thresholdK} K</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              value={bayesData.thresholdK}
              onChange={(e) => setBayesFactorKThreshold(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-300 dark:bg-slate-800 rounded appearance-none cursor-pointer accent-[#F26B21]"
            />
          </div>
        </div>

        {/* 2. 3-WAY CAUSAL VERIFICATION SUBSYSTEM */}
        <div className="isro-card p-4 bg-white dark:bg-[#0A1A33] space-y-3">
          <div className="flex items-center justify-between border-b border-[#D5DCE6] dark:border-slate-800 pb-2">
            <h2 className="text-sm font-semibold text-[#1B2430] dark:text-[#F1F5F9] flex items-center gap-2 font-sans border-l-[3px] border-[#F26B21] pl-2">
              <ShieldCheck size={15} className="text-[#F26B21] dark:text-[#FFA366]" />
              <span>3-Way Causal Verification Engine</span>
            </h2>
            <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded text-white ${
              isAccepted ? 'bg-[#14532D]' : 'bg-[#7F1D1D]'
            }`}>
              {isAccepted ? 'PASSED' : 'FAULT DETECTED'}
            </span>
          </div>

          <p className="text-xs text-[#4A5568] dark:text-[#B8C4D6]">
            Requires all 3 independent evidence vectors before triggering FSM step transition: Action Pose + Physical State Change + Protocol Context.
          </p>

          {/* Verdict Banner */}
          <div className={`p-3 rounded flex items-center justify-between text-xs font-sans ${
            isAccepted ? 'bg-[#166534] text-white border border-[#15803D]' : 'bg-[#991B1B] text-white border border-[#B91C1C]'
          }`}>
            <div className="flex items-center space-x-2">
              {isAccepted ? <CheckCircle2 size={20} className="text-white shrink-0" /> : <XCircle size={20} className="text-white shrink-0" />}
              <div>
                <span className="font-bold text-sm block">{isAccepted ? 'VERDICT: ACCEPTED' : 'VERDICT: REJECTED'}</span>
                <span className="text-xs font-mono opacity-90">{causalResult.rejectionReason || 'All 3 evidence components satisfied.'}</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedInspector({ title: "3-Way Causal Verification Payload", type: "CAUSAL", data: causalResult })}
              className="px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white font-mono text-xs rounded font-bold flex items-center gap-1 shrink-0"
            >
              <Eye size={12} /> Inspect
            </button>
          </div>

          {/* 3 Evidence Cards */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className={`p-2.5 rounded border flex flex-col justify-between h-24 ${
              isAccepted || causalResult.actionDetected ? 'bg-[#14532D] border-[#166534] text-white font-semibold' : 'bg-[#7F1D1D] border-[#991B1B] text-white font-semibold'
            }`}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold font-mono">01. ACTION</span>
                {isAccepted || causalResult.actionDetected ? <CheckCircle2 size={14} className="text-[#4ADE80]" /> : <XCircle size={14} className="text-[#FF6B6B]" />}
              </div>
              <span className="font-semibold text-xs leading-tight">YOLO26n Pose</span>
              <span className="text-xs font-mono opacity-80">98.4% Conf</span>
            </div>

            <div className={`p-2.5 rounded border flex flex-col justify-between h-24 ${
              isAccepted || causalResult.stateChanged ? 'bg-[#14532D] border-[#166534] text-white font-semibold' : 'bg-[#7F1D1D] border-[#991B1B] text-white font-semibold'
            }`}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold font-mono">02. STATE</span>
                {isAccepted || causalResult.stateChanged ? <CheckCircle2 size={14} className="text-[#4ADE80]" /> : <XCircle size={14} className="text-[#FF6B6B]" />}
              </div>
              <span className="font-semibold text-xs leading-tight">Physical Displacement</span>
              <span className="text-xs font-mono opacity-80">BBox Shift</span>
            </div>

            <div className={`p-2.5 rounded border flex flex-col justify-between h-24 ${
              isAccepted || causalResult.contextMatches ? 'bg-[#14532D] border-[#166534] text-white font-semibold' : 'bg-[#7F1D1D] border-[#991B1B] text-white font-semibold'
            }`}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold font-mono">03. CONTEXT</span>
                {isAccepted || causalResult.contextMatches ? <CheckCircle2 size={14} className="text-[#4ADE80]" /> : <XCircle size={14} className="text-[#FF6B6B]" />}
              </div>
              <span className="font-semibold text-xs leading-tight">FSM Expected</span>
              <span className="text-xs font-mono opacity-80">Rule Match</span>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={triggerHandNearObjectNoStateChange}
              className="px-3 py-1.5 rounded text-xs font-bold font-mono bg-[#7F1D1D] text-white border border-[#991B1B] hover:bg-red-800 transition-colors"
            >
              Simulate False Action (Hand Near, No Shift)
            </button>
          </div>
        </div>
      </div>

      {/* TWO-COLUMN GRID: RECHARTS BAYES TIME-SERIES + DEMPSTER-SHAFER FUSION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* 3. RECHARTS BAYES FACTOR TIME SERIES */}
        <div className="isro-card p-4 bg-white dark:bg-[#0A1A33] space-y-3">
          <div className="flex items-center justify-between border-b border-[#D5DCE6] dark:border-slate-800 pb-2">
            <h2 className="text-sm font-semibold text-[#1B2430] dark:text-[#F1F5F9] flex items-center gap-2 font-sans border-l-[3px] border-[#F26B21] pl-2">
              <Activity size={15} className="text-[#F26B21] dark:text-[#FFA366]" />
              <span>Bayes Factor Evidence Accumulation Over Time</span>
            </h2>
            <span className="text-xs font-mono text-[#4A5568] dark:text-[#B8C4D6]">
              10-Step Window
            </span>
          </div>

          <div className="h-56 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bayesChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.12)" />
                <XAxis dataKey="time" tick={{ fill: '#B8C4D6', fontSize: 10 }} />
                <YAxis tick={{ fill: '#B8C4D6', fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0A1A33', borderColor: '#1E293B', color: '#F1F5F9', fontSize: '11px' }} />
                <ReferenceLine y={bayesData.thresholdK} stroke="#FFA366" strokeDasharray="4 4" label={{ value: 'K_min', fill: '#FFA366', fontSize: 10 }} />
                <Line type="monotone" dataKey="K" stroke="#4ADE80" strokeWidth={2.5} dot={{ fill: '#4ADE80', r: 4 }} name="Bayes Factor K" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. DEMPSTER-SHAFER FUSION ENGINE */}
        <div className="isro-card p-4 bg-white dark:bg-[#0A1A33] space-y-3">
          <div className="flex items-center justify-between border-b border-[#D5DCE6] dark:border-slate-800 pb-2">
            <h2 className="text-sm font-semibold text-[#1B2430] dark:text-[#F1F5F9] flex items-center gap-2 font-sans border-l-[3px] border-[#F26B21] pl-2">
              <Sliders size={15} className="text-[#F26B21] dark:text-[#FFA366]" />
              <span>Dempster-Shafer Multi-Sensor Fusion & Conflict Isolation</span>
            </h2>
            <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded text-white ${
              fusionResult.status === 'ISOLATED' ? 'bg-[#78350F]' : 'bg-[#14532D]'
            }`}>
              K_conflict = {fusionResult.kConflict.toFixed(2)}
            </span>
          </div>

          <div className="h-44 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dsBarData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.12)" />
                <XAxis dataKey="name" tick={{ fill: '#B8C4D6', fontSize: 10 }} />
                <YAxis domain={[0, 1]} tick={{ fill: '#B8C4D6', fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0A1A33', borderColor: '#1E293B', color: '#F1F5F9', fontSize: '11px' }} />
                <Bar dataKey="Belief" fill="#7DD3FC" name="Belief Mass m(A)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Plausibility" fill="#4ADE80" name="Plausibility Pl(A)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Conflict Limit Controls */}
          <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded border border-slate-300 dark:border-slate-800 flex items-center justify-between text-xs font-sans">
            <span className="font-semibold text-[#1B2430] dark:text-[#F1F5F9]">Max Allowed Conflict (K_limit):</span>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="0.1"
                max="0.9"
                step="0.05"
                value={fusionResult.conflictLimit}
                onChange={(e) => setDempsterShaferConflictLimit(Number(e.target.value))}
                className="w-32 h-1.5 bg-slate-300 dark:bg-slate-800 rounded appearance-none cursor-pointer accent-[#F26B21]"
              />
              <span className="font-mono text-[#F26B21] dark:text-[#FFA366] font-bold">{fusionResult.conflictLimit.toFixed(2)}</span>
            </div>
            <button
              onClick={triggerSensorDisagreement}
              className="px-2.5 py-1 rounded text-xs font-bold font-mono bg-[#78350F] text-white border border-[#92400E] hover:bg-amber-800 transition-colors"
            >
              Simulate Sensor Disagreement
            </button>
          </div>
        </div>
      </div>

      {/* INSPECTOR JSON DRAWER */}
      {selectedInspector && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-slate-900 h-full border-l border-slate-800 p-5 flex flex-col justify-between font-mono text-xs shadow-2xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2 text-[#7DD3FC] font-bold">
                  <Info size={16} />
                  <span>{selectedInspector.title}</span>
                </div>
                <button onClick={() => setSelectedInspector(null)} className="text-slate-400 hover:text-white p-1 rounded">
                  <X size={18} />
                </button>
              </div>

              <pre className="p-3 bg-slate-950 rounded border border-slate-800 text-[11px] text-[#7DD3FC] overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {JSON.stringify(selectedInspector.data, null, 2)}
              </pre>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button onClick={() => setSelectedInspector(null)} className="px-4 py-1.5 bg-slate-800 text-white rounded font-bold hover:bg-slate-700">
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
