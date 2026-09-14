import React, { useState } from 'react';
import { useMission } from '../context/MissionContext';
import { X, Bell, AlertTriangle, AlertCircle, Info, CheckCircle2, ShieldAlert } from 'lucide-react';

interface AlertDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AlertDrawer: React.FC<AlertDrawerProps> = ({ isOpen, onClose }) => {
  const { alerts, resolveAlert, clearAllAlerts } = useMission();
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  if (!isOpen) return null;

  const filteredAlerts = filterCategory === 'ALL' 
    ? alerts 
    : alerts.filter(a => a.category === filterCategory);

  const getIcon = (cat: string) => {
    switch (cat) {
      case 'CRITICAL': return <AlertTriangle className="text-red-500" size={18} />;
      case 'WARNING': return <AlertCircle className="text-amber-500" size={18} />;
      case 'SYSTEM': return <ShieldAlert className="text-blue-500" size={18} />;
      default: return <Info className="text-slate-400" size={18} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end font-sans">
      <div className="w-full max-w-md bg-[#071B33] border-l border-navy-700 shadow-2xl flex flex-col text-white h-full animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-navy-800 bg-[#041021] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="text-saffron-500" size={20} />
            <h3 className="font-bold font-mono tracking-wider text-base text-white">MISSION ALERT CENTER</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded hover:bg-navy-800 text-slate-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div className="p-3 bg-navy-900 border-b border-navy-800 flex items-center justify-between">
          <div className="flex space-x-1">
            {['ALL', 'CRITICAL', 'WARNING', 'SYSTEM'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-2.5 py-1 text-[11px] font-bold rounded transition-colors ${
                  filterCategory === cat 
                    ? 'bg-saffron-500 text-white' 
                    : 'text-slate-400 hover:text-white hover:bg-navy-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <button 
            onClick={clearAllAlerts}
            className="text-[11px] text-slate-400 hover:text-saffron-400 font-semibold underline"
          >
            Acknowledge All
          </button>
        </div>

        {/* Alert List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredAlerts.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <CheckCircle2 size={36} className="mx-auto text-emerald-500 mb-2 opacity-60" />
              <p className="text-sm font-medium">No alerts active</p>
              <p className="text-xs text-slate-500 mt-1">All mission parameters nominal</p>
            </div>
          ) : (
            filteredAlerts.map(alert => (
              <div 
                key={alert.id}
                className={`p-3 rounded border transition-all ${
                  alert.category === 'CRITICAL' ? 'bg-red-950/40 border-red-800/70' :
                  alert.category === 'WARNING' ? 'bg-amber-950/40 border-amber-800/70' :
                  'bg-navy-900 border-navy-700'
                } ${alert.resolved ? 'opacity-60' : 'shadow-md'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {getIcon(alert.category)}
                    <span className="font-bold font-mono text-xs text-slate-100">{alert.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{alert.met}</span>
                </div>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{alert.detail}</p>
                <div className="mt-2.5 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500 font-mono">{alert.timestamp}</span>
                  {!alert.resolved ? (
                    <button 
                      onClick={() => resolveAlert(alert.id)}
                      className="px-2 py-0.5 bg-navy-800 hover:bg-navy-700 text-saffron-400 font-semibold rounded border border-navy-600"
                    >
                      Acknowledge
                    </button>
                  ) : (
                    <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                      <CheckCircle2 size={12} />
                      <span>RESOLVED</span>
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-[#041021] border-t border-navy-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Processing: LOCAL EDGE</span>
          <span className="font-mono text-saffron-400">SIH 2026 PS174</span>
        </div>
      </div>
    </div>
  );
};
