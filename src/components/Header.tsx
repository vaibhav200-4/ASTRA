import React, { useState, useEffect } from 'react';
import { Emblem } from './Emblem';
import { useMission } from '../context/MissionContext';
import { 
  Activity, ShieldAlert, Cpu, Layers, FileText, 
  Clock, Compass, Info, Sliders, Volume2, VolumeX, Bell, CheckCircle2
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
    <header className="sticky top-0 z-40 w-full flex flex-col shadow-md font-sans">
      {/* Top Institutional Government Strip */}
      <div className="bg-[#041021] text-slate-300 text-xs px-4 py-1 flex items-center justify-between border-b border-navy-800">
        <div className="flex items-center space-x-3">
          <span className="font-semibold text-slate-200 tracking-wide">
            {language === 'hi' ? 'भारत सरकार | अंतरिक्ष विभाग' : 'भारत सरकार | Government of India — Department of Space'}
          </span>
          <span className="hidden md:inline-block text-slate-500">|</span>
          <span className="hidden md:inline-block text-saffron-400 font-mono text-[11px] tracking-wider">
            SIH 2026 PS174 (SIH26174)
          </span>
        </div>

        <div className="flex items-center space-x-4">
          {/* Language Selector */}
          <div className="flex items-center space-x-1 bg-navy-900 border border-navy-700 rounded px-1.5 py-0.5">
            <button 
              onClick={() => setLanguage('en')}
              className={`px-1.5 py-0.5 text-[10px] font-bold rounded transition-colors ${language === 'en' ? 'bg-saffron-500 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              EN
            </button>
            <button 
              onClick={() => setLanguage('hi')}
              className={`px-1.5 py-0.5 text-[10px] font-bold rounded transition-colors ${language === 'hi' ? 'bg-saffron-500 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              हिन्दी
            </button>
          </div>

          {/* UTC Clock */}
          <div className="font-mono text-slate-200 text-[11px] bg-navy-900 px-2 py-0.5 rounded border border-navy-700">
            {utcTime || '11:41:07 UTC'}
          </div>

          {/* System Status Pill */}
          <div className="flex items-center space-x-1.5 bg-navy-900 px-2 py-0.5 rounded border border-navy-700 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-emerald-400 font-medium">EDGE AI OFFLINE</span>
          </div>
        </div>
      </div>

      {/* Main Aerospace Navigation Header */}
      <div className="bg-[#071B33] text-white px-4 py-2.5 flex items-center justify-between border-b-2 border-saffron-500">
        {/* Brand & Emblem */}
        <div 
          onClick={() => setActiveTab('overview')} 
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <Emblem size={38} className="group-hover:scale-105 transition-transform" />
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-wider text-white font-mono">ASTRA-PVT</span>
              <span className="text-[10px] bg-saffron-500 text-white font-bold px-1.5 py-0.2 rounded tracking-wider">
                SIH2026
              </span>
            </div>
            <p className="text-[11px] text-slate-300 tracking-wide font-sans">
              Astronaut Protocol Tracking & Validation System
            </p>
          </div>
        </div>

        {/* Right Status Controls & MET */}
        <div className="flex items-center space-x-3">
          {/* Mission MET Display */}
          <div className="hidden lg:flex flex-col items-end bg-navy-900 px-3 py-1 rounded border border-navy-700">
            <span className="text-[9px] uppercase tracking-widest text-slate-400 font-semibold">Mission Elapsed Time</span>
            <span className="font-mono font-bold text-saffron-400 text-sm tracking-widest">
              MET {metFormatted}
            </span>
          </div>

          {/* Status Badge */}
          <div className={`hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded font-mono text-xs font-semibold border ${
            missionStatus === 'CRITICAL' ? 'bg-red-950/80 border-red-500 text-red-300' :
            missionStatus === 'DEGRADED' ? 'bg-amber-950/80 border-amber-500 text-amber-300' :
            missionStatus === 'COMPLETED' ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300' :
            'bg-navy-900 border-emerald-600/60 text-emerald-400'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              missionStatus === 'CRITICAL' ? 'bg-red-500 animate-ping' :
              missionStatus === 'DEGRADED' ? 'bg-amber-500 animate-pulse' :
              'bg-emerald-400 animate-pulse'
            }`}></span>
            <span>{missionStatus === 'COMPLETED' ? 'PROTOCOL COMPLETE' : `● ${missionStatus}`}</span>
          </div>

          {/* Simulation / Monitoring Mode Toggle */}
          <button 
            onClick={() => setDemoMode(demoMode === 'SIMULATION' ? 'MONITORING' : 'SIMULATION')}
            className={`px-2.5 py-1 text-xs font-bold rounded border transition-all flex items-center space-x-1 ${
              demoMode === 'SIMULATION' 
                ? 'bg-saffron-500/20 text-saffron-300 border-saffron-500/60 hover:bg-saffron-500/30' 
                : 'bg-navy-800 text-slate-300 border-navy-600 hover:text-white'
            }`}
            title="Toggle Simulation Drawer Visibility"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-saffron-400"></span>
            <span>{demoMode === 'SIMULATION' ? 'SIMULATION MODE' : 'MONITORING MODE'}</span>
          </button>

          {/* Voice Alert Toggle */}
          <button 
            onClick={toggleVoiceMute}
            className={`p-1.5 rounded border transition-colors ${
              voiceMuted 
                ? 'bg-navy-900 border-navy-700 text-slate-500 hover:text-slate-300' 
                : 'bg-navy-800 border-navy-600 text-saffron-400 hover:bg-navy-700'
            }`}
            title={voiceMuted ? "Voice Guidance Muted" : "Voice Guidance Active"}
          >
            {voiceMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          {/* Alert Center Trigger */}
          <button 
            onClick={onOpenAlerts}
            className="relative p-1.5 bg-navy-800 border border-navy-600 rounded text-slate-200 hover:text-white hover:bg-navy-700 transition-colors"
            title="Open Mission Alert Drawer"
          >
            <Bell size={16} />
            {unreadAlerts > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white font-bold text-[10px] rounded-full flex items-center justify-center animate-pulse">
                {unreadAlerts}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <nav className="bg-[#0B2545] text-slate-200 px-3 py-1 flex items-center space-x-1 overflow-x-auto border-b border-navy-800">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded flex items-center space-x-1.5 whitespace-nowrap transition-all ${
                isActive 
                  ? 'bg-navy-600 text-white shadow-sm border-l-2 border-saffron-500' 
                  : 'text-slate-300 hover:text-white hover:bg-navy-800/80'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-saffron-400' : 'text-slate-400'} />
              <span>{item.label}</span>
              {item.badge && (
                <span className="text-[9px] bg-red-600 text-white font-bold px-1 rounded animate-pulse">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
