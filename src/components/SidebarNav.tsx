import React from 'react';
import { useMission } from '../context/MissionContext';
import {
  Compass, Activity, FileText, Sliders, Layers, Clock,
  Cpu, ShieldAlert, BarChart2, Info, Menu
} from 'lucide-react';

interface SidebarNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({ activeTab, setActiveTab }) => {
  const { language } = useMission();

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
    { id: 'evaluation', label: language === 'hi' ? 'मूल्यांकन' : 'Evaluation', icon: BarChart2 },
    { id: 'about', label: language === 'hi' ? 'के बारे में' : 'About', icon: Info },
  ];

  return (
    <aside className="w-16 md:w-52 bg-[#0B2A5B] dark:bg-[#071326] border-r border-[#123F8C] dark:border-slate-800 flex flex-col justify-between select-none py-2 shrink-0 transition-all font-sans">
      {/* Navigation Items List */}
      <div className="flex flex-col space-y-1 px-1.5">
        <div className="hidden md:flex items-center space-x-2 px-3 py-2 text-xs font-semibold tracking-wider text-[#B8C4D6] uppercase border-b border-white/10 mb-1">
          <Menu size={14} className="text-[#FFA366]" />
          <span>CONSOLE NAVIGATION</span>
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex items-center space-x-2.5 px-3 py-2 rounded-md text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-[#123F8C] dark:bg-[#0E2850] text-[#F1F5F9] font-bold shadow-sm'
                  : 'text-[#B8C4D6] hover:text-[#F1F5F9] hover:bg-white/10 dark:hover:bg-slate-800/60'
              }`}
              title={item.label}
            >
              {/* Active Left Indicator Bar */}
              {isActive && (
                <span className="absolute left-0 top-1 bottom-1 w-1 bg-[#FFA366] rounded-r" />
              )}

              <Icon
                size={18}
                className={`shrink-0 ${isActive ? 'text-[#FFA366]' : 'text-[#B8C4D6] group-hover:text-[#F1F5F9]'}`}
              />

              <span className="hidden md:inline truncate">{item.label}</span>

              {item.badge && (
                <span className="hidden md:inline-block w-2 h-2 rounded-full bg-[#FF6B6B] animate-pulse ml-auto" />
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Branding Badge */}
      <div className="hidden md:block px-3 pt-2 border-t border-white/10 font-mono text-[10px] text-[#B8C4D6] text-center font-bold">
        <span>ASTRA-PVT &bull; v1.0.0</span>
      </div>
    </aside>
  );
};
