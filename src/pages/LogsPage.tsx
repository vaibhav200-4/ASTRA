import React, { useState } from 'react';
import { useMission } from '../context/MissionContext';
import { exportMissionJson, exportMissionCsv } from '../utils/export';
import { FileText, Download, Search, Radio, Wifi, WifiOff, X, Filter, Code2 } from 'lucide-react';
import type { LogEntry } from '../types/mission';

export const LogsPage: React.FC = () => {
  const { missionLogs, currentStep, isRtspStreaming, toggleRtspStream, language } = useMission();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

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
      <div className="isro-card p-4 bg-slate-900 border-l-4 border-l-cyan-500 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-lg">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-semibold mb-0.5">
            <FileText size={14} />
            <span>PART M — MISSION LOGS & AUDIT REVIEW</span>
          </div>
          <h1 className="text-lg font-bold text-white">
            Timestamped Blackbox Event Log & Telemetry Audit
          </h1>
          <p className="text-xs text-slate-300">
            Structured JSON event records capturing step decisions, Bayes Factor K, Dempster-Shafer fusion, FSM transitions, and crew alerts.
          </p>
        </div>

        {/* Download Buttons */}
        <div className="flex items-center space-x-2 font-mono text-xs">
          <button 
            onClick={() => exportMissionJson(missionLogs, currentStep)}
            className="px-3 py-1.5 rounded text-xs font-bold font-mono bg-cyan-600 text-white hover:bg-cyan-500 flex items-center gap-1.5 transition-colors"
          >
            <Download size={13} />
            <span>Export JSON</span>
          </button>

          <button 
            onClick={() => exportMissionCsv(missionLogs)}
            className="px-3 py-1.5 rounded text-xs font-bold font-mono bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* RTSP Stream Status Toggle Banner */}
      <div className="isro-card p-3 bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center space-x-2">
          {isRtspStreaming ? <Wifi size={16} className="text-emerald-400 animate-pulse" /> : <WifiOff size={16} className="text-slate-400" />}
          <span className="font-semibold text-slate-200">
            Stream Link Status: {isRtspStreaming ? 'STREAMING AVAILABLE (H.264/RTSP Active)' : 'LINK OFFLINE (Local Buffer Only)'}
          </span>
        </div>

        <button 
          onClick={toggleRtspStream}
          className="px-3 py-1 rounded text-xs font-mono bg-slate-800 text-cyan-300 border border-slate-700 hover:bg-slate-700 flex items-center gap-1.5 transition-colors"
        >
          <Radio size={13} />
          <span>Toggle RTSP Link Stream</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="isro-card p-3 bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
        <div className="relative w-full sm:w-80">
          <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search events, modules, IDs..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded focus:outline-none text-white focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <Filter size={14} className="text-slate-400" />
          <span className="text-slate-400">STATUS SEVERITY:</span>
          <select 
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-cyan-300 font-bold focus:outline-none"
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
      <div className="isro-card overflow-x-auto font-mono text-xs bg-slate-900 border border-slate-800 rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950 text-slate-300 border-b border-slate-800">
              <th className="p-2.5">UTC TIME</th>
              <th className="p-2.5">MET</th>
              <th className="p-2.5">EVENT ID</th>
              <th className="p-2.5">MODULE</th>
              <th className="p-2.5">EVENT DESCRIPTION</th>
              <th className="p-2.5 text-right">CONF.</th>
              <th className="p-2.5">FSM STATE</th>
              <th className="p-2.5 text-center">STATUS</th>
              <th className="p-2.5 text-center">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-6 text-center text-slate-400 font-sans">
                  No matching event log entries found.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log, idx) => (
                <tr 
                  key={idx} 
                  onClick={() => setSelectedLog(log)}
                  className="hover:bg-slate-800/60 cursor-pointer transition-colors"
                >
                  <td className="p-2.5 text-slate-400">{log.utcTime}</td>
                  <td className="p-2.5 font-bold text-amber-400">{log.met}</td>
                  <td className="p-2.5 font-bold text-white">{log.eventId}</td>
                  <td className="p-2.5 text-cyan-300">{log.module}</td>
                  <td className="p-2.5 font-sans text-slate-200 max-w-xs truncate">{log.event}</td>
                  <td className="p-2.5 text-right font-bold text-emerald-400">{log.confidence.toFixed(1)}%</td>
                  <td className="p-2.5 font-bold text-cyan-400">{log.fsmState}</td>
                  <td className="p-2.5 text-center">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      log.status === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                      log.status === 'CRITICAL' ? 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse' :
                      log.status === 'DEGRADED' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                      'bg-slate-800 text-cyan-300 border border-slate-700'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="p-2.5 text-center">
                    <button className="text-cyan-400 hover:text-cyan-200 text-[10px] underline flex items-center gap-1 mx-auto">
                      <Code2 size={12} /> JSON
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* JSON DETAIL DRAWER MODAL */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-slate-900 h-full border-l border-slate-800 p-5 flex flex-col justify-between overflow-y-auto font-mono text-xs shadow-2xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2 text-cyan-400 font-bold">
                  <Code2 size={16} />
                  <span>LOG RECORD: {selectedLog.eventId}</span>
                </div>
                <button 
                  onClick={() => setSelectedLog(null)}
                  className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-2 text-slate-300 text-xs">
                <div className="flex justify-between p-2 bg-slate-950 rounded border border-slate-800">
                  <span className="text-slate-400">UTC Time:</span>
                  <span className="font-bold text-white">{selectedLog.utcTime}</span>
                </div>
                <div className="flex justify-between p-2 bg-slate-950 rounded border border-slate-800">
                  <span className="text-slate-400">Mission Elapsed Time:</span>
                  <span className="font-bold text-amber-400">{selectedLog.met}</span>
                </div>
                <div className="flex justify-between p-2 bg-slate-950 rounded border border-slate-800">
                  <span className="text-slate-400">Target Module:</span>
                  <span className="font-bold text-cyan-300">{selectedLog.module}</span>
                </div>
                <div className="flex justify-between p-2 bg-slate-950 rounded border border-slate-800">
                  <span className="text-slate-400">FSM State:</span>
                  <span className="font-bold text-emerald-400">{selectedLog.fsmState}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-bold block text-[10px]">RAW JSON TELEMETRY PAYLOAD:</span>
                <pre className="p-3 bg-slate-950 rounded border border-slate-800 text-[11px] text-cyan-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {JSON.stringify(selectedLog, null, 2)}
                </pre>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button 
                onClick={() => setSelectedLog(null)}
                className="px-4 py-1.5 bg-slate-800 text-slate-200 rounded font-bold hover:bg-slate-700"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
