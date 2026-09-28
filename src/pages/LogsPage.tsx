import React, { useState } from 'react';
import { useMission } from '../context/MissionContext';
import { exportMissionJson, exportMissionCsv } from '../utils/export';
import { FileText, Download, Search, Radio, Wifi, WifiOff } from 'lucide-react';

export const LogsPage: React.FC = () => {
  const { missionLogs, currentStep, isRtspStreaming, toggleRtspStream, language } = useMission();
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

  return (
    <div className="space-y-4 font-sans">
      {/* Header Banner */}
      <div className="isro-card p-4 bg-white dark:bg-[#0A1A33] border-l-4 border-l-[#123F8C] flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 text-[#123F8C] dark:text-cyan-400 font-mono text-xs font-semibold mb-0.5">
            <FileText size={14} />
            <span>PART M — MISSION LOGS & AUDIT REVIEW</span>
          </div>
          <h1 className="text-lg font-bold text-[#0B2A5B] dark:text-white">
            Timestamped Blackbox Event Log & Telemetry
          </h1>
          <p className="text-xs text-[#5B6675] dark:text-slate-300">
            Structured JSON event records capturing step decisions, Bayes Factor K, Dempster-Shafer fusion, FSM transitions, and crew alerts.
          </p>
        </div>

        {/* Download Buttons */}
        <div className="flex items-center space-x-2 font-mono text-xs">
          <button 
            onClick={() => exportMissionJson(missionLogs, currentStep)}
            className="btn-isro-cta"
          >
            <Download size={13} />
            <span>Export JSON</span>
          </button>

          <button 
            onClick={() => exportMissionCsv(missionLogs)}
            className="btn-isro-primary"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* RTSP Stream Status Toggle Banner */}
      <div className="isro-card p-3 bg-white dark:bg-[#0A1A33] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center space-x-2">
          {isRtspStreaming ? <Wifi size={16} className="text-[#138808]" /> : <WifiOff size={16} className="text-[#5B6675]" />}
          <span className="font-semibold text-[#0B2A5B] dark:text-slate-200">
            Stream Link Status: {isRtspStreaming ? 'STREAMING AVAILABLE (H.264/RTSP Active)' : 'LINK OFFLINE (Local Buffer Only)'}
          </span>
        </div>

        <button 
          onClick={toggleRtspStream}
          className="btn-isro-outline"
        >
          <Radio size={13} />
          <span>Toggle Link Stream (H.264/RTSP)</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="isro-card p-3 bg-white dark:bg-[#0A1A33] flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
        <div className="relative w-full sm:w-80">
          <Search size={14} className="absolute left-2.5 top-2.5 text-[#5B6675]" />
          <input 
            type="text" 
            placeholder="Search events, modules, IDs..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#F5F7FA] dark:bg-slate-900 border border-[#D5DCE6] dark:border-slate-800 rounded focus:outline-none text-[#1B2430] dark:text-white"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <span className="text-[#5B6675]">STATUS:</span>
          <select 
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-[#F5F7FA] dark:bg-slate-900 border border-[#D5DCE6] dark:border-slate-800 rounded px-2.5 py-1 text-[#123F8C] dark:text-cyan-300 font-bold"
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
      <div className="isro-card overflow-x-auto font-mono text-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#EEF3FA] dark:bg-slate-900 text-[#0B2A5B] dark:text-slate-200 border-b border-[#D5DCE6] dark:border-slate-800">
              <th className="p-2.5">UTC TIME</th>
              <th className="p-2.5">MET</th>
              <th className="p-2.5">EVENT ID</th>
              <th className="p-2.5">MODULE</th>
              <th className="p-2.5">EVENT DESCRIPTION</th>
              <th className="p-2.5 text-right">CONF.</th>
              <th className="p-2.5">FSM STATE</th>
              <th className="p-2.5 text-center">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EEF3FA] dark:divide-slate-800">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-[#5B6675] font-sans">
                  No matching event log entries found.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-2.5 text-[#5B6675]">{log.utcTime}</td>
                  <td className="p-2.5 font-bold text-[#F26B21]">{log.met}</td>
                  <td className="p-2.5 font-bold text-[#0B2A5B] dark:text-slate-200">{log.eventId}</td>
                  <td className="p-2.5 text-[#5B6675] dark:text-slate-400">{log.module}</td>
                  <td className="p-2.5 font-sans text-[#1B2430] dark:text-slate-200 max-w-xs truncate">{log.event}</td>
                  <td className="p-2.5 text-right font-bold text-[#138808]">{log.confidence.toFixed(1)}%</td>
                  <td className="p-2.5 font-bold text-[#123F8C] dark:text-cyan-300">{log.fsmState}</td>
                  <td className="p-2.5 text-center">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      log.status === 'SUCCESS' ? 'bg-emerald-50 text-[#138808]' :
                      log.status === 'CRITICAL' ? 'bg-red-50 text-[#C62828]' :
                      log.status === 'DEGRADED' ? 'bg-amber-50 text-[#D98200]' :
                      'bg-[#EEF3FA] text-[#123F8C]'
                    }`}>
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
