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
      case 'AI': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'PROTOCOL': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'WARNING': return 'bg-red-100 text-red-800 border-red-300';
      case 'SYSTEM': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="bg-[#071B33] text-white p-6 rounded-lg shadow-md border border-navy-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-saffron-400 font-mono text-xs font-bold mb-1">
            <Clock size={16} />
            <span>MISSION CHRONOLOGY</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold font-mono tracking-tight text-white">
            TIMESTAMPED EVENT TIMELINE
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Real-time audit log of protocol transitions, AI detections, and system notifications.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-1.5 font-mono text-xs bg-navy-900 p-1.5 rounded border border-navy-700">
          <Filter size={14} className="text-slate-400 ml-1 mr-1" />
          {['ALL', 'AI', 'PROTOCOL', 'WARNING', 'SYSTEM'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterType(cat)}
              className={`px-2.5 py-1 font-bold rounded transition-colors ${
                filterType === cat 
                  ? 'bg-saffron-500 text-white' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm font-mono text-xs space-y-4">
        <div className="relative border-l-2 border-slate-200 ml-4 space-y-6 pl-6">
          {filteredEvents.map((evt, idx) => (
            <div key={evt.id} className="relative group">
              {/* Timeline Point Dot */}
              <div className={`absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow ${
                evt.level === 'error' ? 'bg-red-600 ring-2 ring-red-300 animate-pulse' :
                evt.level === 'success' ? 'bg-emerald-600' :
                'bg-navy-600'
              }`}></div>

              <div className="bg-space-bg p-4 rounded-lg border border-slate-200 space-y-2 hover:border-slate-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-saffron-600">MET {evt.met}</span>
                    <span className="text-slate-400">|</span>
                    <span className="text-slate-500">{evt.timestamp} UTC</span>
                  </div>

                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${getTypeBadge(evt.type)}`}>
                    {evt.type}
                  </span>
                </div>

                <h4 className="font-bold text-navy-900 text-sm">{evt.title}</h4>
                <p className="text-slate-600 font-sans text-xs">{evt.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
