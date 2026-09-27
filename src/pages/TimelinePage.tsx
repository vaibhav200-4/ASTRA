import React, { useState } from 'react';
import { useMission } from '../context/MissionContext';
import { Clock, Filter, AlertTriangle, ShieldCheck, Activity, Info } from 'lucide-react';

export const TimelinePage: React.FC = () => {
  const { timelineEvents } = useMission();
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredEvents = filterType === 'ALL' 
    ? timelineEvents 
    : timelineEvents.filter(e => e.type === filterType);

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'AI': return 'bg-cyan-950/80 text-cyan-300 border-cyan-800';
      case 'PROTOCOL': return 'bg-emerald-950/80 text-emerald-300 border-emerald-800';
      case 'WARNING': return 'bg-red-950/80 text-red-300 border-red-800';
      case 'SYSTEM': return 'bg-purple-950/80 text-purple-300 border-purple-800';
      default: return 'bg-slate-900 text-slate-400 border-slate-800';
    }
  };

  return (
    <div className="space-y-5 font-sans">
      {/* Header */}
      <div className="glass-card bg-gradient-to-r from-slate-900 to-[#0d162a] text-white p-5 rounded-2xl shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold mb-1">
            <Clock size={16} />
            <span>MISSION CHRONOLOGY</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold font-mono tracking-tight text-white">
            TIMESTAMPED EVENT TIMELINE
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Real-time audit log of protocol transitions, AI detections, and system notifications.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-1.5 font-mono text-xs bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
          <Filter size={14} className="text-slate-400 ml-1 mr-1" />
          {['ALL', 'AI', 'PROTOCOL', 'WARNING', 'SYSTEM'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterType(cat)}
              className={`px-2.5 py-1 font-bold rounded-lg transition-all ${
                filterType === cat 
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.3)]' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 shadow-xl font-mono text-xs space-y-4">
        <div className="relative border-l-2 border-slate-800 ml-4 space-y-6 pl-6">
          {filteredEvents.map((evt, idx) => (
            <div key={evt.id} className="relative group">
              {/* Timeline Point Dot */}
              <div className={`absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-slate-950 shadow ${
                evt.level === 'error' ? 'bg-red-500 ring-2 ring-red-400 animate-pulse' :
                evt.level === 'success' ? 'bg-emerald-400' :
                'bg-cyan-400'
              }`}></div>

              <div className="glass-card bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2 hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-amber-400">MET {evt.met}</span>
                    <span className="text-slate-700">|</span>
                    <span className="text-slate-400">{evt.timestamp} UTC</span>
                  </div>

                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${getTypeBadge(evt.type)}`}>
                    {evt.type}
                  </span>
                </div>

                <h4 className="font-bold text-white text-sm">{evt.title}</h4>
                <p className="text-slate-300 font-sans text-xs">{evt.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
