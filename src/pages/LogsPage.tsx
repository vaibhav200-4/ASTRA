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
      case 'SUCCESS': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-300';
      case 'DEGRADED': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'ACTIVE': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="bg-[#071B33] text-white p-6 rounded-lg shadow-md border border-navy-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-saffron-400 font-mono text-xs font-bold mb-1">
            <FileText size={16} />
            <span>BLACKBOX AUDIT EVIDENCE</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold font-mono tracking-tight text-white">
            MISSION EVENT LOG & EVIDENCE DATA
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Structured tamper-evident logs tracking every AI detection, FSM transition, and crew warning.
          </p>
        </div>

        {/* Download Buttons */}
        <div className="flex items-center space-x-2 font-mono text-xs">
          <button 
            onClick={() => exportMissionJson(missionLogs, currentStep)}
            className="px-3.5 py-2 bg-saffron-500 hover:bg-saffron-600 active:bg-saffron-700 text-white font-bold rounded shadow flex items-center space-x-1.5 transition-colors"
          >
            <Download size={14} />
            <span>EXPORT JSON</span>
          </button>

          <button 
            onClick={() => exportMissionCsv(missionLogs)}
            className="px-3.5 py-2 bg-navy-800 hover:bg-navy-700 text-slate-200 hover:text-white font-bold rounded border border-navy-600 flex items-center space-x-1.5 transition-colors"
          >
            <Download size={14} />
            <span>EXPORT CSV</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3 top-3 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search events, modules, IDs..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-space-bg border border-slate-300 rounded focus:outline-none focus:border-navy-600 text-navy-900"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <span className="text-slate-500">STATUS:</span>
          <select 
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-space-bg border border-slate-300 rounded px-3 py-2 focus:outline-none focus:border-navy-600 font-bold text-navy-900"
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
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-x-auto font-mono text-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#071B33] text-white border-b border-navy-800">
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
          <tbody className="divide-y divide-slate-200">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-400 font-sans">
                  No matching log entries found.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 text-slate-600">{log.utcTime}</td>
                  <td className="p-3 font-bold text-saffron-600">{log.met}</td>
                  <td className="p-3 font-bold text-navy-900">{log.eventId}</td>
                  <td className="p-3 text-slate-700">{log.module}</td>
                  <td className="p-3 font-sans text-slate-800 max-w-xs truncate">{log.event}</td>
                  <td className="p-3 text-right font-bold text-emerald-600">{log.confidence.toFixed(1)}%</td>
                  <td className="p-3 font-bold text-navy-900">{log.fsmState}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${getStatusBadge(log.status)}`}>
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
