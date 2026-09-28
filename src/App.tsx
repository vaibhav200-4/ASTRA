import React, { useState, useEffect } from 'react';
import { MissionProvider, useMission } from './context/MissionContext';
import { Header } from './components/Header';
import { SidebarNav } from './components/SidebarNav';
import { Footer } from './components/Footer';
import { AlertDrawer } from './components/AlertDrawer';
import { DemoControlDrawer } from './components/DemoControlDrawer';
import { ErrorBoundary } from './components/ErrorBoundary';

import { MissionOverview } from './pages/MissionOverview';
import { LiveMissionConsole } from './pages/LiveMissionConsole';
import { ProtocolPage } from './pages/ProtocolPage';
import { AiMonitorPage } from './pages/AiMonitorPage';
import { RackRelativePose } from './pages/RackRelativePose';
import { TimelinePage } from './pages/TimelinePage';
import { LogsPage } from './pages/LogsPage';
import { SystemHealthPage } from './pages/SystemHealthPage';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { EvaluationPage } from './pages/EvaluationPage';
import { AboutPage } from './pages/AboutPage';

export const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [alertsOpen, setAlertsOpen] = useState<boolean>(false);
  const { togglePlayPause } = useMission();

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in form controls
      if (
        e.target instanceof HTMLInputElement || 
        e.target instanceof HTMLTextAreaElement || 
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      // Page Navigation 1-9 & 0
      if (e.key === '1') setActiveTab('overview');
      else if (e.key === '2') setActiveTab('live');
      else if (e.key === '3') setActiveTab('protocol');
      else if (e.key === '4') setActiveTab('ai-monitor');
      else if (e.key === '5') setActiveTab('pose');
      else if (e.key === '6') setActiveTab('timeline');
      else if (e.key === '7') setActiveTab('logs');
      else if (e.key === '8') setActiveTab('system');
      else if (e.key === '9') setActiveTab('architecture');
      else if (e.key === '0') setActiveTab('about');
      
      // Spacebar Play/Pause Simulation
      else if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      }

      // Escape key closes open drawers
      else if (e.key === 'Escape') {
        setAlertsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlayPause]);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <ErrorBoundary fallbackTitle="Overview Module Notice">
            <MissionOverview setActiveTab={setActiveTab} />
          </ErrorBoundary>
        );
      case 'live':
        return (
          <ErrorBoundary fallbackTitle="Live Mission Console Module Notice">
            <LiveMissionConsole />
          </ErrorBoundary>
        );
      case 'protocol':
        return (
          <ErrorBoundary fallbackTitle="Protocol Module Notice">
            <ProtocolPage />
          </ErrorBoundary>
        );
      case 'ai-monitor':
        return (
          <ErrorBoundary fallbackTitle="AI Monitor Module Notice">
            <AiMonitorPage />
          </ErrorBoundary>
        );
      case 'pose':
        return (
          <ErrorBoundary fallbackTitle="Rack Relative Pose Module Notice">
            <RackRelativePose />
          </ErrorBoundary>
        );
      case 'timeline':
        return (
          <ErrorBoundary fallbackTitle="Timeline Module Notice">
            <TimelinePage />
          </ErrorBoundary>
        );
      case 'logs':
        return (
          <ErrorBoundary fallbackTitle="Logs Module Notice">
            <LogsPage />
          </ErrorBoundary>
        );
      case 'system':
        return (
          <ErrorBoundary fallbackTitle="System Health Module Notice">
            <SystemHealthPage />
          </ErrorBoundary>
        );
      case 'architecture':
        return (
          <ErrorBoundary fallbackTitle="Architecture Module Notice">
            <ArchitecturePage />
          </ErrorBoundary>
        );
      case 'evaluation':
        return (
          <ErrorBoundary fallbackTitle="Evaluation Module Notice">
            <EvaluationPage />
          </ErrorBoundary>
        );
      case 'about':
        return (
          <ErrorBoundary fallbackTitle="About Module Notice">
            <AboutPage />
          </ErrorBoundary>
        );
      default:
        return (
          <ErrorBoundary fallbackTitle="Overview Module Notice">
            <MissionOverview setActiveTab={setActiveTab} />
          </ErrorBoundary>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6F9] dark:bg-[#06101E] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Slim Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAlerts={() => setAlertsOpen(true)}
      />

      {/* Main Workspace Body with Left Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Left Sidebar */}
        <SidebarNav activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Dynamic Workspace Container */}
        <main className="flex-1 overflow-y-auto p-3 md:p-4">
          {renderActivePage()}
        </main>
      </div>

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
