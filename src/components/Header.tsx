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
      <div className="bg-white dark:bg-[#0A1A33] text-[#1B2430] dark:text-[#F1F5F9] px-3 py-1.5 flex items-center justify-between">
        {/* Left: Emblem + ISRO Branding */}
        <div
          onClick={() => setActiveTab('overview')}
          className="flex items-center space-x-2.5 cursor-pointer group"
        >
          <Emblem size={32} className="group-hover:scale-105 transition-transform" />
          <div className="flex items-center space-x-2">
            <span className="font-bold text-base text-[#0B2A5B] dark:text-[#F1F5F9] tracking-tight">
              ASTRA-PVT
            </span>
            <span className="text-xs bg-[#EEF3FA] dark:bg-slate-800 text-[#123F8C] dark:text-[#B8C4D6] font-semibold px-2.5 py-0.5 rounded border border-[#D5DCE6] dark:border-slate-700">
              ISRO &bull; Department of Space
            </span>
          </div>
        </div>

        {/* Right: Telemetry, Clocks, & Controls */}
        <div className="flex items-center space-x-2 text-xs">
          {/* MET Display */}
          <div className="hidden sm:flex items-center space-x-1.5 font-mono text-xs text-[#0B2A5B] dark:text-[#7DD3FC] bg-[#EEF3FA] dark:bg-slate-900 px-2.5 py-1 rounded border border-[#D5DCE6] dark:border-slate-800 font-bold">
            <Clock size={13} className="text-[#123F8C] dark:text-[#7DD3FC]" />
            <span>MET {metFormatted}</span>
          </div>

          {/* UTC Clock */}
          <div className="hidden md:flex items-center space-x-1 font-mono text-xs text-[#123F8C] dark:text-[#B8C4D6] bg-[#EEF3FA] dark:bg-slate-900 px-2.5 py-1 rounded border border-[#D5DCE6] dark:border-slate-800 font-semibold">
            <span>{utcTime || '11:41:07 UTC'}</span>
          </div>

          {/* Status Badge */}
          <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs font-mono font-bold border ${
            missionStatus === 'CRITICAL' ? 'bg-[#FFCDD2] border-red-400 text-[#B71C1C] dark:bg-[#7F1D1D] dark:border-red-600 dark:text-[#FF6B6B]' :
            missionStatus === 'DEGRADED' ? 'bg-[#FEF3C7] border-amber-400 text-[#8A5300] dark:bg-[#78350F] dark:border-amber-600 dark:text-[#FBBF24]' :
            missionStatus === 'COMPLETED' ? 'bg-[#DCFCE7] border-emerald-400 text-[#0F6B06] dark:bg-[#14532D] dark:border-emerald-600 dark:text-[#4ADE80]' :
            'bg-[#EEF3FA] border-[#D5DCE6] text-[#123F8C] dark:bg-slate-900 dark:border-slate-700 dark:text-[#7DD3FC]'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              missionStatus === 'CRITICAL' ? 'bg-red-600 animate-pulse' :
              missionStatus === 'DEGRADED' ? 'bg-amber-600 animate-pulse' :
              'bg-[#138808] dark:bg-[#4ADE80]'
            }`} />
            <span>{missionStatus === 'COMPLETED' ? 'COMPLETE' : missionStatus}</span>
          </div>

          {/* Language Selector */}
          <div className="flex items-center bg-[#EEF3FA] dark:bg-slate-900 border border-[#D5DCE6] dark:border-slate-700 rounded p-0.5">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-0.5 text-xs font-bold rounded transition-colors ${
                language === 'en'
                  ? 'bg-[#123F8C] text-white'
                  : 'text-[#4A5568] dark:text-[#B8C4D6] hover:text-[#1B2430] dark:hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2.5 py-0.5 text-xs font-bold rounded transition-colors ${
                language === 'hi'
                  ? 'bg-[#123F8C] text-white'
                  : 'text-[#4A5568] dark:text-[#B8C4D6] hover:text-[#1B2430] dark:hover:text-white'
              }`}
            >
              HI
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 bg-[#EEF3FA] dark:bg-slate-900 border border-[#D5DCE6] dark:border-slate-700 rounded text-[#123F8C] dark:text-[#F1F5F9] hover:bg-[#DDE7F7] dark:hover:bg-slate-800 transition-colors"
            title={theme === 'light' ? "Switch to Mission Control Dark Theme" : "Switch to Light Theme"}
          >
            {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
          </button>

          {/* Voice Alert Toggle */}
          <button
            onClick={toggleVoiceMute}
            className={`p-1.5 rounded border transition-colors ${
              voiceMuted
                ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-[#4A5568] dark:text-[#B8C4D6]'
                : 'bg-[#EEF3FA] dark:bg-slate-900 border-[#D5DCE6] dark:border-slate-700 text-[#123F8C] dark:text-[#7DD3FC]'
            }`}
            title={voiceMuted ? "Voice Guidance Muted" : "Voice Guidance Active"}
          >
            {voiceMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>

          {/* Alert Center Button */}
          <button
            onClick={onOpenAlerts}
            className="relative p-1.5 bg-[#EEF3FA] dark:bg-slate-900 border border-[#D5DCE6] dark:border-slate-700 rounded text-[#123F8C] dark:text-[#F1F5F9] hover:bg-[#DDE7F7] dark:hover:bg-slate-800 transition-colors"
            title="Open Mission Alert Drawer"
          >
            <Bell size={14} />
            {unreadAlerts > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C62828] text-white font-bold text-[10px] rounded-full flex items-center justify-center">
                {unreadAlerts}
              </span>
            )}
          </button>

          {/* Simulation Drawer Toggle */}
          <button
            onClick={() => setDemoMode(demoMode === 'SIMULATION' ? 'MONITORING' : 'SIMULATION')}
            className={`px-2.5 py-1 text-xs font-bold rounded border transition-colors flex items-center gap-1.5 ${
              demoMode === 'SIMULATION'
                ? 'bg-[#F26B21] text-white border-[#F26B21] hover:bg-[#d95914]'
                : 'bg-[#EEF3FA] dark:bg-slate-900 text-[#1B2430] dark:text-[#F1F5F9] border-[#D5DCE6] dark:border-slate-700 hover:bg-[#DDE7F7] dark:hover:bg-slate-800'
            }`}
            title="Toggle Demo Simulation Panel"
          >
            <Radio size={13} className={demoMode === 'SIMULATION' ? 'text-white animate-pulse' : 'text-[#F26B21] dark:text-[#FFA366]'} />
            <span className="hidden lg:inline font-sans text-xs font-bold">
              {demoMode === 'SIMULATION' ? 'SIMULATION' : 'MONITORING'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
