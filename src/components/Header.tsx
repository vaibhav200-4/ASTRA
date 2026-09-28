import React, { useState, useEffect } from 'react';
import { Emblem } from './Emblem';
import { useMission } from '../context/MissionContext';
import {
  Clock, Sun, Moon, Volume2, VolumeX, Bell, Radio
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAlerts: () => void;
}

export const Header: React.FC<HeaderProps> = ({ setActiveTab, onOpenAlerts }) => {
  const {
    missionStatus, metFormatted, language, setLanguage, demoMode, setDemoMode,
    voiceMuted, toggleVoiceMute, alerts, theme, toggleTheme
  } = useMission();

  const [utcTime, setUtcTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().split(' ')[4] + ' UTC');
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const unreadAlerts = alerts.filter(a => !a.resolved).length;

  return (
    <header className="sticky top-0 z-40 w-full flex flex-col font-sans border-b border-[#D5DCE6] dark:border-slate-800 shadow-sm select-none">
      {/* 3px Indian Flag Tricolor Strip */}
      <div className="h-[3px] w-full flex">
        <div className="w-1/3 bg-[#FF9933]" />
        <div className="w-1/3 bg-white" />
        <div className="w-1/3 bg-[#138808]" />
      </div>

      {/* Slim Top Header Bar */}
      <div className="bg-white dark:bg-[#0A1A33] text-[#1B2430] dark:text-slate-100 px-3 py-1.5 flex items-center justify-between">
        {/* Left: Emblem + ISRO Branding */}
        <div
          onClick={() => setActiveTab('overview')}
          className="flex items-center space-x-2.5 cursor-pointer group"
        >
          <Emblem size={32} className="group-hover:scale-105 transition-transform" />
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-base text-[#0B2A5B] dark:text-white tracking-tight">
              ASTRA-PVT
            </span>
            <span className="text-[10px] bg-[#EEF3FA] dark:bg-slate-800 text-[#123F8C] dark:text-slate-200 font-semibold px-2 py-0.5 rounded border border-[#D5DCE6] dark:border-slate-700">
              ISRO • Department of Space
            </span>
          </div>
        </div>

        {/* Right: Telemetry, Clocks, & Controls */}
        <div className="flex items-center space-x-2">
          {/* MET Display */}
          <div className="hidden sm:flex items-center space-x-1 font-mono text-xs text-[#0B2A5B] dark:text-cyan-300 bg-[#EEF3FA] dark:bg-slate-900 px-2.5 py-1 rounded border border-[#D5DCE6] dark:border-slate-800">
            <Clock size={11} className="text-[#123F8C] dark:text-cyan-400" />
            <span className="font-bold">MET {metFormatted}</span>
          </div>

          {/* UTC Clock */}
          <div className="hidden md:flex items-center space-x-1 font-mono text-xs text-[#123F8C] dark:text-slate-300 bg-[#EEF3FA] dark:bg-slate-900 px-2.5 py-1 rounded border border-[#D5DCE6] dark:border-slate-800">
            <span>{utcTime || '11:41:07 UTC'}</span>
          </div>

          {/* Status Badge */}
          <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs font-mono font-bold border ${
            missionStatus === 'CRITICAL' ? 'bg-red-50 border-red-300 text-red-700 dark:bg-red-950/60 dark:border-red-800 dark:text-red-300' :
            missionStatus === 'DEGRADED' ? 'bg-amber-50 border-amber-300 text-amber-800 dark:bg-amber-950/60 dark:border-amber-800 dark:text-amber-300' :
            missionStatus === 'COMPLETED' ? 'bg-emerald-50 border-emerald-300 text-emerald-800 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-300' :
            'bg-[#EEF3FA] border-[#D5DCE6] text-[#123F8C] dark:bg-slate-900 dark:border-slate-700 dark:text-cyan-300'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              missionStatus === 'CRITICAL' ? 'bg-red-600 animate-pulse' :
              missionStatus === 'DEGRADED' ? 'bg-amber-600 animate-pulse' :
              'bg-[#138808]'
            }`} />
            <span>{missionStatus === 'COMPLETED' ? 'COMPLETE' : missionStatus}</span>
          </div>

          {/* Language Selector */}
          <div className="flex items-center bg-[#EEF3FA] dark:bg-slate-900 border border-[#D5DCE6] dark:border-slate-700 rounded p-0.5">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 text-xs font-bold rounded transition-colors ${
                language === 'en'
                  ? 'bg-[#123F8C] text-white'
                  : 'text-[#5B6675] dark:text-slate-300 hover:text-[#1B2430]'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2 py-0.5 text-xs font-bold rounded transition-colors ${
                language === 'hi'
                  ? 'bg-[#123F8C] text-white'
                  : 'text-[#5B6675] dark:text-slate-300 hover:text-[#1B2430]'
              }`}
            >
              HI
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 bg-[#EEF3FA] dark:bg-slate-900 border border-[#D5DCE6] dark:border-slate-700 rounded text-[#123F8C] dark:text-slate-200 hover:bg-[#DDE7F7] transition-colors"
            title={theme === 'light' ? "Switch to Mission Control Dark Theme" : "Switch to Light Theme"}
          >
            {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
          </button>

          {/* Voice Alert Toggle */}
          <button
            onClick={toggleVoiceMute}
            className={`p-1.5 rounded border transition-colors ${
              voiceMuted
                ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 text-slate-400'
                : 'bg-[#EEF3FA] dark:bg-slate-900 border-[#D5DCE6] dark:border-slate-700 text-[#123F8C] dark:text-cyan-400'
            }`}
            title={voiceMuted ? "Voice Guidance Muted" : "Voice Guidance Active"}
          >
            {voiceMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>

          {/* Alert Center Button */}
          <button
            onClick={onOpenAlerts}
            className="relative p-1.5 bg-[#EEF3FA] dark:bg-slate-900 border border-[#D5DCE6] dark:border-slate-700 rounded text-[#123F8C] dark:text-slate-200 hover:bg-[#DDE7F7] transition-colors"
            title="Open Mission Alert Drawer"
          >
            <Bell size={14} />
            {unreadAlerts > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white font-bold text-[9px] rounded-full flex items-center justify-center">
                {unreadAlerts}
              </span>
            )}
          </button>

          {/* Simulation Drawer Toggle */}
          <button
            onClick={() => setDemoMode(demoMode === 'SIMULATION' ? 'MONITORING' : 'SIMULATION')}
            className={`px-2.5 py-1 text-xs font-semibold rounded border transition-colors flex items-center gap-1.5 ${
              demoMode === 'SIMULATION'
                ? 'bg-[#F26B21] text-white border-[#F26B21] hover:bg-[#d95914]'
                : 'bg-[#EEF3FA] dark:bg-slate-900 text-[#5B6675] border-[#D5DCE6] dark:border-slate-700'
            }`}
            title="Toggle Demo Simulation Panel"
          >
            <Radio size={12} className={demoMode === 'SIMULATION' ? 'text-white animate-pulse' : 'text-slate-400'} />
            <span className="hidden lg:inline font-mono text-[11px]">
              {demoMode === 'SIMULATION' ? 'SIMULATION' : 'MONITORING'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
