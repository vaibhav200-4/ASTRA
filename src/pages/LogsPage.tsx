import React, { useState } from 'react';
import { useMission } from '../context/MissionContext';
import { exportMissionJson, exportMissionCsv } from '../utils/export';
import { FileText, Download, Search, Filter } from 'lucide-react';

export const LogsPage: React.FC = () => {
  const { missionLogs, currentStep } = useMission();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredLogs = missionLogs.filter(log => {
    const matchesSearch = 
      log.eventId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.module.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || log.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'SUCCESS': return 'bg-emerald-950/80 text-emerald-300 border-emerald-800';
      case 'CRITICAL': return 'bg-red-950/80 text-red-300 border-red-800';
      case 'DEGRADED': return 'bg-amber-950/80 text-amber-300 border-amber-800';
      case 'ACTIVE': return 'bg-cyan-950/80 text-cyan-300 border-cyan-800';
      default: return 'bg-slate-900 text-slate-400 border-slate-800';
    }
  };

  return (
    <div className="space-y-5 font-sans">
      {/* Header */}
      <div className="glass-card bg-gradient-to-r from-slate-900 to-[#0d162a] text-white p-5 rounded-2xl shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold mb-1">
            <FileText size={16} />
            <span>BLACKBOX AUDIT EVIDENCE</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold font-mono tracking-tight text-white">
            MISSION EVENT LOG & EVIDENCE DATA
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Structured tamper-evident logs tracking every AI detection, FSM transition, and crew warning.
          </p>
        </div>

        {/* Download Buttons */}
        <div className="flex items-center space-x-2 font-mono text-xs">
          <button 
            onClick={() => exportMissionJson(missionLogs, currentStep)}
            className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-saffron-500 hover:from-amber-600 hover:to-saffron-600 text-slate-950 font-extrabold rounded-xl shadow-lg flex items-center space-x-1.5 transition-all"
          >
            <Download size={14} />
            <span>EXPORT JSON</span>
          </button>

          <button 
            onClick={() => exportMissionCsv(missionLogs)}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-bold rounded-xl border border-slate-700 flex items-center space-x-1.5 transition-all"
          >
            <Download size={14} />
            <span>EXPORT CSV</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3 top-3 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search events, modules, IDs..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-cyan-500 text-white placeholder-slate-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <span className="text-slate-400">STATUS:</span>
          <select 
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500 font-bold text-cyan-400"
          >
            <option value="ALL">ALL STATUSES</option>
            <option value="NORMAL">NORMAL</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="DEGRADED">DEGRADED</option>
          </select>
        </div>
      </div>

      {/* Structured Log Table */}
      <div className="glass-card rounded-2xl border border-slate-800 shadow-xl overflow-x-auto font-mono text-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950 text-slate-300 border-b border-slate-800">
              <th className="p-3">UTC TIME</th>
              <th className="p-3">MET</th>
              <th className="p-3">EVENT ID</th>
              <th className="p-3">MODULE</th>
              <th className="p-3">EVENT DESCRIPTION</th>
              <th className="p-3 text-right">CONF.</th>
              <th className="p-3">FSM STATE</th>
              <th className="p-3 text-center">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-500 font-sans">
                  No matching log entries found.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 text-slate-400">{log.utcTime}</td>
                  <td className="p-3 font-bold text-amber-400">{log.met}</td>
                  <td className="p-3 font-bold text-white">{log.eventId}</td>
                  <td className="p-3 text-slate-300">{log.module}</td>
                  <td className="p-3 font-sans text-slate-200 max-w-xs truncate">{log.event}</td>
                  <td className="p-3 text-right font-bold text-emerald-400">{log.confidence.toFixed(1)}%</td>
                  <td className="p-3 font-bold text-cyan-300">{log.fsmState}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${getStatusBadge(log.status)}`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
