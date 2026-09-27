import React, { useState, useEffect } from 'react';
import { Emblem } from './Emblem';
import { useMission } from '../context/MissionContext';
import { 
  Activity, ShieldAlert, Cpu, Layers, FileText, 
  Clock, Compass, Info, Sliders, Volume2, VolumeX, Bell,
  Sparkles, Radio, Zap
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAlerts: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onOpenAlerts }) => {
  const { 
    missionStatus, metFormatted, language, setLanguage, demoMode, setDemoMode,
    voiceMuted, toggleVoiceMute, alerts 
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

  const navItems = [
    { id: 'overview', label: language === 'hi' ? 'अवलोकन' : 'Overview', icon: Compass },
    { id: 'live', label: language === 'hi' ? 'लाइव कंसोल' : 'Live Console', icon: Activity, badge: 'LIVE' },
    { id: 'protocol', label: language === 'hi' ? 'प्रोटोकॉल' : 'Protocol', icon: FileText },
    { id: 'ai-monitor', label: language === 'hi' ? 'एआई मॉनिटर' : 'AI Monitor', icon: Sliders },
    { id: 'pose', label: language === 'hi' ? '3डी पोज' : 'Rack Pose', icon: Layers },
    { id: 'timeline', label: language === 'hi' ? 'टाइमलाइन' : 'Timeline', icon: Clock },
    { id: 'logs', label: language === 'hi' ? 'लॉग्स' : 'Logs', icon: FileText },
    { id: 'system', label: language === 'hi' ? 'सिस्टम' : 'System', icon: Cpu },
    { id: 'architecture', label: language === 'hi' ? 'आर्किटेक्चर' : 'Architecture', icon: ShieldAlert },
    { id: 'about', label: language === 'hi' ? 'के बारे में' : 'About', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-40 w-full flex flex-col border-b border-cyan-900/40 bg-[#080d19]/90 backdrop-blur-md font-sans">
      {/* Top Institutional Government Strip */}
      <div className="bg-[#050914] text-slate-400 text-[11px] px-4 py-1 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="font-medium text-slate-300 tracking-wide">
              {language === 'hi' ? 'भारत सरकार | अंतरिक्ष विभाग' : 'Government of India — Department of Space'}
            </span>
          </div>
          <span className="hidden md:inline-block text-slate-700">|</span>
          <span className="hidden md:inline-flex items-center space-x-1 font-mono text-[10px] text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded">
            <Zap size={10} className="text-cyan-400" />
            <span>SIH 2026 PS174 (SIH26174)</span>
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {/* Language Selector */}
          <div className="flex items-center bg-slate-900/80 border border-slate-700/60 rounded px-1 py-0.5">
            <button 
              onClick={() => setLanguage('en')}
              className={`px-1.5 py-0.5 text-[10px] font-bold rounded transition-colors ${language === 'en' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
            >
              EN
            </button>
            <button 
              onClick={() => setLanguage('hi')}
              className={`px-1.5 py-0.5 text-[10px] font-bold rounded transition-colors ${language === 'hi' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
            >
              HI
            </button>
          </div>

          {/* UTC Clock */}
          <div className="font-mono text-cyan-300 text-[11px] bg-cyan-950/40 px-2.5 py-0.5 rounded border border-cyan-800/40 flex items-center space-x-1">
            <Clock size={11} className="text-cyan-400" />
            <span>{utcTime || '11:41:07 UTC'}</span>
          </div>

          {/* System Status Pill */}
          <div className="flex items-center space-x-1.5 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-emerald-400 font-mono font-medium text-[10px]">EDGE AI OFFLINE</span>
          </div>
        </div>
      </div>

      {/* Main Aerospace Navigation Header */}
      <div className="px-4 py-2.5 flex items-center justify-between">
        {/* Brand & Emblem */}
        <div 
          onClick={() => setActiveTab('overview')} 
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="relative">
            <Emblem size={38} className="group-hover:scale-105 transition-transform" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-wider text-white font-mono bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                ASTRA-PVT
              </span>
              <span className="text-[9px] bg-gradient-to-r from-saffron-500 to-amber-500 text-slate-950 font-bold px-1.5 py-0.5 rounded tracking-wider shadow-sm">
                NASA-JPL SPEC
              </span>
            </div>
            <p className="text-[11px] text-slate-400 tracking-wide font-sans flex items-center space-x-1">
              <span>Astronaut Protocol Tracking & Validation System</span>
            </p>
          </div>
        </div>

        {/* Right Status Controls & MET Ticker */}
        <div className="flex items-center space-x-3">
          {/* Mission MET Display */}
          <div className="hidden lg:flex flex-col items-end bg-slate-900/80 px-3 py-1 rounded-lg border border-slate-800/80 shadow-inner">
            <span className="text-[9px] uppercase tracking-widest text-slate-400 font-semibold flex items-center space-x-1">
              <Clock size={10} className="text-cyan-400" />
              <span>Mission Elapsed Time</span>
            </span>
            <span className="font-mono font-bold text-cyan-400 text-sm tracking-widest drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]">
              MET {metFormatted}
            </span>
          </div>

          {/* Status Badge */}
          <div className={`hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg font-mono text-xs font-bold border transition-all ${
            missionStatus === 'CRITICAL' ? 'bg-red-950/80 border-red-500/80 text-red-300 shadow-[0_0_12px_rgba(239,68,68,0.3)]' :
            missionStatus === 'DEGRADED' ? 'bg-amber-950/80 border-amber-500/80 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]' :
            missionStatus === 'COMPLETED' ? 'bg-emerald-950/80 border-emerald-500/80 text-emerald-300' :
            'bg-cyan-950/60 border-cyan-500/60 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
          }`}>
            <span className={`w-2.5 h-2.5 rounded-full ${
              missionStatus === 'CRITICAL' ? 'bg-red-500 animate-ping' :
              missionStatus === 'DEGRADED' ? 'bg-amber-500 animate-pulse' :
              'bg-cyan-400 animate-pulse'
            }`}></span>
            <span className="tracking-wide">
              {missionStatus === 'COMPLETED' ? 'PROTOCOL COMPLETE' : missionStatus}
            </span>
          </div>

          {/* Simulation / Monitoring Mode Toggle */}
          <button 
            onClick={() => setDemoMode(demoMode === 'SIMULATION' ? 'MONITORING' : 'SIMULATION')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all flex items-center space-x-1.5 ${
              demoMode === 'SIMULATION' 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 hover:bg-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.15)]' 
                : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:text-white'
            }`}
            title="Toggle Demo Simulation Drawer Controls"
          >
            <Radio size={13} className={demoMode === 'SIMULATION' ? 'text-amber-400 animate-pulse' : 'text-slate-400'} />
            <span className="font-mono text-[11px]">{demoMode === 'SIMULATION' ? 'SIMULATION MODE' : 'MONITORING'}</span>
          </button>

          {/* Voice Alert Toggle */}
          <button 
            onClick={toggleVoiceMute}
            className={`p-2 rounded-lg border transition-all ${
              voiceMuted 
                ? 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300' 
                : 'bg-cyan-950/60 border-cyan-800/60 text-cyan-400 hover:bg-cyan-900/60 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
            }`}
            title={voiceMuted ? "Voice Guidance Muted" : "Voice Guidance Active"}
          >
            {voiceMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>

          {/* Alert Center Trigger */}
          <button 
            onClick={onOpenAlerts}
            className="relative p-2 bg-slate-900/80 border border-slate-700/80 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
            title="Open Mission Alert Drawer"
          >
            <Bell size={15} />
            {unreadAlerts > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white font-bold text-[9px] rounded-full flex items-center justify-center animate-pulse shadow-md">
                {unreadAlerts}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Primary Navigation Tabs with Animated Indicator Line */}
      <nav className="relative bg-[#050811]/90 text-slate-300 px-3 py-1 flex items-center space-x-1 overflow-x-auto border-t border-slate-800/60 no-scrollbar">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative px-3.5 py-2 text-xs font-semibold rounded-lg flex items-center space-x-2 whitespace-nowrap transition-all ${
                isActive 
                  ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.15)] font-bold' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-cyan-400 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]' : 'text-slate-500'} />
              <span>{item.label}</span>
              {item.badge && (
                <span className="flex items-center space-x-1 text-[9px] bg-red-600/90 text-white font-bold px-1.5 py-0.2 rounded-full animate-pulse shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  <span>{item.badge}</span>
                </span>
              )}

              {/* Active Tab Underline Glow */}
              {isActive && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-cyan-400 rounded-full shadow-[0_0_8px_#06b6d4]"></span>
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
