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
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="bg-[#071B33] text-white p-6 rounded-lg shadow-md border border-navy-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-saffron-400 font-mono text-xs font-bold mb-1">
            <Sliders size={16} />
            <span>REAL-TIME INFERENCE TELEMETRY</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold font-mono tracking-tight text-white">
            AI MONITOR & PERFORMANCE METRICS
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Live telemetry stream monitoring edge AI inference latency, frame rates, and confidence scores.
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className={`px-3 py-1 rounded font-bold border ${
            missionStatus === 'ACTIVE' 
              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-400' 
              : 'bg-amber-950/80 border-amber-500 text-amber-300'
          }`}>
            CHARTS: {missionStatus === 'ACTIVE' ? '● STREAMING LIVE' : 'PAUSED'}
          </span>
        </div>
      </div>

      {/* Grid of 4 Recharts Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. FPS Chart */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="font-bold text-navy-900">INFERENCE FRAME RATE (FPS)</span>
            <span className="text-saffron-600 font-bold">{fps} FPS</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataPoints}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis domain={[15, 30]} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip contentStyle={{ backgroundColor: '#071B33', color: '#fff', fontSize: '11px' }} />
                <Line type="monotone" dataKey="fps" stroke="#F58220" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Latency Chart */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="font-bold text-navy-900">PIPELINE LATENCY (MS)</span>
            <span className="text-emerald-600 font-bold">{latency} ms</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataPoints}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis domain={[20, 60]} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip contentStyle={{ backgroundColor: '#071B33', color: '#fff', fontSize: '11px' }} />
                <Line type="monotone" dataKey="latency" stroke="#159447" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Activity Confidence Chart */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="font-bold text-navy-900">ACTIVITY CONFIDENCE (%)</span>
            <span className="text-blue-600 font-bold">{activityConfidence.toFixed(1)}%</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataPoints}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip contentStyle={{ backgroundColor: '#071B33', color: '#fff', fontSize: '11px' }} />
                <Line type="monotone" dataKey="activityConf" stroke="#174EA6" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Pose & Object Confidence Chart */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="font-bold text-navy-900">POSE & OBJECT TRACKING CONFIDENCE (%)</span>
            <span className="text-purple-600 font-bold">{poseConfidence}%</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataPoints}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis domain={[80, 100]} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip contentStyle={{ backgroundColor: '#071B33', color: '#fff', fontSize: '11px' }} />
                <Line type="monotone" dataKey="poseConf" stroke="#9333ea" strokeWidth={2} dot={false} name="Pose" />
                <Line type="monotone" dataKey="objectConf" stroke="#059669" strokeWidth={2} dot={false} name="Object" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
