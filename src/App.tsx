import React, { useState } from 'react';
import { MissionProvider } from './context/MissionContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AlertDrawer } from './components/AlertDrawer';
import { DemoControlDrawer } from './components/DemoControlDrawer';

import { MissionOverview } from './pages/MissionOverview';
import { LiveMissionConsole } from './pages/LiveMissionConsole';
import { ProtocolPage } from './pages/ProtocolPage';
import { AiMonitorPage } from './pages/AiMonitorPage';
import { RackRelativePose } from './pages/RackRelativePose';
import { TimelinePage } from './pages/TimelinePage';
import { LogsPage } from './pages/LogsPage';
import { SystemHealthPage } from './pages/SystemHealthPage';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { AboutPage } from './pages/AboutPage';

export const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [alertsOpen, setAlertsOpen] = useState<boolean>(false);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'overview':
        return <MissionOverview setActiveTab={setActiveTab} />;
      case 'live':
        return <LiveMissionConsole />;
      case 'protocol':
        return <ProtocolPage />;
      case 'ai-monitor':
        return <AiMonitorPage />;
      case 'pose':
        return <RackRelativePose />;
      case 'timeline':
        return <TimelinePage />;
      case 'logs':
        return <LogsPage />;
      case 'system':
        return <SystemHealthPage />;
      case 'architecture':
        return <ArchitecturePage />;
      case 'about':
        return <AboutPage />;
      default:
        return <MissionOverview setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7FA] text-[#152238] font-sans selection:bg-saffron-500 selection:text-white">
      {/* Institutional Mission Control Header */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenAlerts={() => setAlertsOpen(true)} 
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 transition-all">
        {renderActivePage()}
      </main>

      {/* Institutional Footer */}
      <Footer />

      {/* Global Alert Center Drawer */}
      <AlertDrawer 
        isOpen={alertsOpen} 
        onClose={() => setAlertsOpen(false)} 
      />

      {/* Demo & Judge Simulation Control Panel Drawer */}
      <DemoControlDrawer />
    </div>
  );
};

export default function App() {
  return (
    <MissionProvider>
      <AppContent />
    </MissionProvider>
  );
}
