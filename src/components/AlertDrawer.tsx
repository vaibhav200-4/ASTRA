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
      case 'CRITICAL': return <AlertTriangle className="text-[#C62828]" size={16} />;
      case 'WARNING': return <AlertCircle className="text-[#D98200]" size={16} />;
      case 'SYSTEM': return <ShieldAlert className="text-[#123F8C] dark:text-cyan-300" size={16} />;
      default: return <Info className="text-[#5B6675]" size={16} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end font-sans">
      <div className="w-full max-w-md bg-white dark:bg-[#0A1A33] border-l border-[#D5DCE6] dark:border-slate-800 shadow-xl flex flex-col text-[#1B2430] dark:text-slate-100 h-full animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-3.5 border-b border-[#EEF3FA] dark:border-slate-800 bg-[#EEF3FA] dark:bg-slate-900 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="text-[#F26B21]" size={18} />
            <h3 className="font-bold text-[#0B2A5B] dark:text-white text-sm">MISSION ALERT CENTER</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-[#5B6675] dark:text-slate-400 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div className="p-2.5 bg-white dark:bg-[#0A1A33] border-b border-[#EEF3FA] dark:border-slate-800 flex items-center justify-between">
          <div className="flex space-x-1 font-mono text-xs">
            {['ALL', 'CRITICAL', 'WARNING', 'SYSTEM'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-2 py-0.5 text-xs font-bold rounded transition-colors ${
                  filterCategory === cat 
                    ? 'bg-[#123F8C] text-white' 
                    : 'text-[#5B6675] hover:bg-[#EEF3FA] dark:hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <button 
            onClick={clearAllAlerts}
            className="text-xs text-[#123F8C] dark:text-cyan-400 hover:underline font-semibold"
          >
            Acknowledge All
          </button>
        </div>

        {/* Alert List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredAlerts.length === 0 ? (
            <div className="py-12 text-center text-[#5B6675] font-sans">
              <CheckCircle2 size={32} className="mx-auto text-[#138808] mb-2 opacity-80" />
              <p className="text-sm font-bold text-[#0B2A5B] dark:text-white">No active alerts</p>
              <p className="text-xs text-[#5B6675] mt-0.5">All mission parameters nominal</p>
            </div>
          ) : (
            filteredAlerts.map(alert => (
              <div 
                key={alert.id}
                className={`p-3 rounded border text-xs transition-colors ${
                  alert.category === 'CRITICAL' ? 'bg-red-50 border-red-300 dark:bg-red-950/60 dark:border-red-900' :
                  alert.category === 'WARNING' ? 'bg-amber-50 border-amber-300 dark:bg-amber-950/60 dark:border-amber-900' :
                  'bg-[#F5F7FA] border-[#D5DCE6] dark:bg-slate-900 dark:border-slate-800'
                } ${alert.resolved ? 'opacity-60' : 'shadow-xs'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {getIcon(alert.category)}
                    <span className="font-bold font-mono text-xs text-[#0B2A5B] dark:text-slate-100">{alert.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#5B6675]">{alert.met}</span>
                </div>
                <p className="text-xs text-[#1B2430] dark:text-slate-300 mt-1">{alert.detail}</p>
                <div className="mt-2 flex items-center justify-between text-[10px]">
                  <span className="text-[#5B6675] font-mono">{alert.timestamp}</span>
                  {!alert.resolved ? (
                    <button 
                      onClick={() => resolveAlert(alert.id)}
                      className="btn-isro-outline text-[10px] py-0.5"
                    >
                      Acknowledge
                    </button>
                  ) : (
                    <span className="text-[#138808] font-semibold flex items-center space-x-1 font-mono">
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
        <div className="p-2.5 bg-[#EEF3FA] dark:bg-slate-900 border-t border-[#D5DCE6] dark:border-slate-800 text-xs text-[#5B6675] flex items-center justify-between font-mono">
          <span>Processing: LOCAL EDGE</span>
          <span className="text-[#F26B21]">SIH 2026 PS174</span>
        </div>
      </div>
    </div>
  );
};
