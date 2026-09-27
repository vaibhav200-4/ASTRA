import React, { useState, useEffect } from 'react';
import { useMission } from '../context/MissionContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Sliders, Activity, Cpu, ShieldCheck } from 'lucide-react';
import type { ChartDataPoint } from '../types/mission';

export const AiMonitorPage: React.FC = () => {
  const { missionStatus, fps, latency, activityConfidence, poseConfidence, objectConfidence } = useMission();
  const [dataPoints, setDataPoints] = useState<ChartDataPoint[]>([]);

  useEffect(() => {
    // Generate initial history
    const initialHistory: ChartDataPoint[] = [];
    const now = new Date();
    for (let i = 15; i >= 0; i--) {
      const t = new Date(now.getTime() - i * 2000);
      const timeStr = t.toTimeString().split(' ')[0];
      initialHistory.push({
        time: timeStr,
        fps: +(23.2 + Math.random() * 1.2).toFixed(1),
        latency: Math.floor(38 + Math.random() * 6),
        activityConf: +(95 + Math.random() * 3).toFixed(1),
        poseConf: +(96 + Math.random() * 2).toFixed(1),
        objectConf: +(97 + Math.random() * 2).toFixed(1),
      });
    }
    setDataPoints(initialHistory);
  }, []);

  useEffect(() => {
    let timer: any;
    if (missionStatus === 'ACTIVE') {
      timer = setInterval(() => {
        const timeStr = new Date().toTimeString().split(' ')[0];
        const newPoint: ChartDataPoint = {
          time: timeStr,
          fps: fps,
          latency: latency,
          activityConf: +activityConfidence.toFixed(1),
          poseConf: +poseConfidence.toFixed(1),
          objectConf: +objectConfidence.toFixed(1),
        };

        setDataPoints(prev => [...prev.slice(1), newPoint]);
      }, 2000);
    }
    return () => clearInterval(timer);
  }, [missionStatus, fps, latency, activityConfidence, poseConfidence, objectConfidence]);

  return (
    <div className="space-y-5 font-sans">
      {/* Header */}
      <div className="glass-card bg-gradient-to-r from-slate-900 to-[#0d162a] text-white p-5 rounded-2xl shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold mb-1">
            <Sliders size={16} />
            <span>REAL-TIME INFERENCE TELEMETRY</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold font-mono tracking-tight text-white">
            AI MONITOR & PERFORMANCE METRICS
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Live telemetry stream monitoring edge AI inference latency, frame rates, and confidence scores.
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className={`px-3 py-1 rounded-lg font-bold border flex items-center space-x-1.5 ${
            missionStatus === 'ACTIVE' 
              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-400' 
              : 'bg-amber-950/80 border-amber-500 text-amber-300'
          }`}>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>CHARTS: {missionStatus === 'ACTIVE' ? 'LIVE STREAMING' : 'PAUSED'}</span>
          </span>
        </div>
      </div>

      {/* Grid of 4 Recharts Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* 1. FPS Chart */}
        <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between font-mono text-xs border-b border-slate-800 pb-2">
            <span className="font-bold text-white flex items-center space-x-1.5">
              <Activity size={14} className="text-cyan-400" />
              <span>INFERENCE FRAME RATE (FPS)</span>
            </span>
            <span className="text-cyan-400 font-bold">{fps} FPS</span>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataPoints}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis domain={[15, 30]} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', fontSize: '11px', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="fps" stroke="#06b6d4" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Latency Chart */}
        <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between font-mono text-xs border-b border-slate-800 pb-2">
            <span className="font-bold text-white flex items-center space-x-1.5">
              <Cpu size={14} className="text-amber-400" />
              <span>PIPELINE LATENCY (MS)</span>
            </span>
            <span className="text-amber-400 font-bold">{latency} ms</span>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataPoints}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis domain={[20, 60]} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', fontSize: '11px', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="latency" stroke="#f59e0b" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Activity Confidence Chart */}
        <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between font-mono text-xs border-b border-slate-800 pb-2">
            <span className="font-bold text-white flex items-center space-x-1.5">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>ACTIVITY CONFIDENCE (%)</span>
            </span>
            <span className="text-emerald-400 font-bold">{activityConfidence.toFixed(1)}%</span>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataPoints}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', fontSize: '11px', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="activityConf" stroke="#10b981" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Pose & Object Confidence Chart */}
        <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between font-mono text-xs border-b border-slate-800 pb-2">
            <span className="font-bold text-white flex items-center space-x-1.5">
              <Sliders size={14} className="text-purple-400" />
              <span>POSE & OBJECT TRACKING CONFIDENCE (%)</span>
            </span>
            <span className="text-purple-400 font-bold">{poseConfidence}%</span>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataPoints}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis domain={[80, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', fontSize: '11px', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="poseConf" stroke="#a855f7" strokeWidth={2} dot={false} name="Pose" />
                <Line type="monotone" dataKey="objectConf" stroke="#06b6d4" strokeWidth={2} dot={false} name="Object" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
