import React, { useState, useRef } from 'react';
import { useMission } from '../context/MissionContext';
import { CameraCanvas } from '../components/CameraCanvas';
import { AstronautViewer } from '../components/AstronautViewer';
import { speakGuidance } from '../utils/speech';
import { 
  Play, Pause, Square, RefreshCw, Maximize, Volume2, 
  CheckCircle2, AlertTriangle, Cpu, Layers, Eye, ShieldCheck, ArrowRight, X,
  Radio, Zap, Activity, Check, Box
} from 'lucide-react';
import type { CameraMode } from '../types/mission';

export const LiveMissionConsole: React.FC = () => {
  const { 
    missionStatus, currentStep, completedSteps, fsmState, expectedAction, observedAction,
    deviationAlert, completionModalOpen, metFormatted, cameraMode, setCameraMode,
    overlaySettings, toggleOverlaySetting, startMission, pauseMission, stopMission, resetMission,
    performCorrectStep, performWrongStep, skipCurrentStep, triggerObjectLost, triggerLowConfidence,
    recoverTracking, acknowledgeDeviation, closeCompletionModal, fps, latency, detections, hoi,
    activityConfidence, poseConfidence, objectConfidence, trackingStatus
  } = useMission();

  const [aiTab, setAiTab] = useState<'OBJECTS' | 'POSE' | 'HOI' | 'ACTIVITY'>('OBJECTS');
  const [renderMode, setRenderMode] = useState<'2D' | '3D' | 'DUAL'>('2D');
  const consoleRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      consoleRef.current?.requestFullscreen().catch(err => console.error(err));
    } else {
      document.exitFullscreen().catch(err => console.error(err));
    }
  };

  const getStepInstructionText = () => {
    if (currentStep === 1) return "Open the red experiment box lid.";
    if (currentStep === 2) return "Remove the yellow container from the red experiment box.";
    if (currentStep === 3) return "Place the yellow container in the payload rack slot.";
    return "Experiment protocol complete.";
  };

  const handlePlayInstruction = () => {
    speakGuidance(getStepInstructionText());
  };

  return (
    <div ref={consoleRef} className="space-y-4 font-sans bg-transparent">
      {/* 1. TOP TELEMETRY STRIP */}
      <div className="glass-card p-3 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono shadow-xl">
        <div className="flex items-center space-x-4">
          <div>
            <span className="text-slate-400 text-[10px] block">MISSION ID</span>
            <span className="font-bold text-cyan-400">BCE-EXP-01</span>
          </div>

          <div className="hidden sm:block text-slate-700">|</div>

          <div>
            <span className="text-slate-400 text-[10px] block">STATUS</span>
            <span className={`font-bold flex items-center space-x-1 ${missionStatus === 'CRITICAL' ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{missionStatus}</span>
            </span>
          </div>

          <div className="hidden sm:block text-slate-700">|</div>

          <div>
            <span className="text-slate-400 text-[10px] block">MISSION ELAPSED TIME</span>
            <span className="font-bold text-amber-400">MET {metFormatted}</span>
          </div>

          <div className="hidden md:block text-slate-700">|</div>

          <div className="hidden md:block">
            <span className="text-slate-400 text-[10px] block">EDGE NODE</span>
            <span className="text-slate-200">JETSON-XAVIER-NX</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div>
            <span className="text-slate-400 text-[10px] block">PROCESSING</span>
            <span className="text-emerald-400 font-semibold">LOCAL OFFLINE</span>
          </div>

          <div className="hidden sm:block text-slate-700">|</div>

          <div>
            <span className="text-slate-400 text-[10px] block">TELEMETRY</span>
            <span className="text-cyan-400 font-bold">{fps} FPS | {latency} ms</span>
          </div>

          <div className="hidden sm:block text-slate-700">|</div>

          <div className="flex items-center space-x-1.5 bg-red-950/60 px-2.5 py-1 rounded-md border border-red-800/60 text-red-300">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            <span className="font-bold text-[11px]">REC</span>
          </div>
        </div>
      </div>

      {/* PROTOCOL DEVIATION CRITICAL WARNING BANNER */}
      {deviationAlert && (
        <div className="bg-red-950/90 border-2 border-red-500 text-white p-4 rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.4)] animate-in zoom-in-95 duration-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle size={28} className="text-red-400 animate-bounce shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold font-mono text-red-200 text-base tracking-wider">
                  {deviationAlert.title}
                </h3>
                <span className="bg-red-600 text-white font-bold text-[10px] px-2 py-0.5 rounded font-mono">
                  FSM: ERROR
                </span>
              </div>
              <p className="text-xs text-red-100 mt-1">{deviationAlert.detail}</p>
              <div className="mt-2 text-xs font-mono grid grid-cols-1 md:grid-cols-2 gap-2 bg-red-900/60 p-2.5 rounded-lg border border-red-800">
                <div><span className="text-red-300">EXPECTED:</span> {deviationAlert.expected}</div>
                <div><span className="text-red-300">OBSERVED:</span> {deviationAlert.observed}</div>
              </div>
            </div>
          </div>

          <button 
            onClick={acknowledgeDeviation}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl border border-red-400 shadow transition-colors whitespace-nowrap self-end md:self-center"
          >
            ACKNOWLEDGE & RESUME
          </button>
        </div>
      )}

      {/* MAIN TWO-COLUMN CONSOLE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT 7 COLS: CAMERA PANEL & CAMERA CONTROLS */}
        <div className="lg:col-span-7 space-y-3">
          {/* Main Vision Viewport Container */}
          <div className="glass-card p-3.5 rounded-2xl border border-slate-800 shadow-xl space-y-2.5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
                <h2 className="font-bold font-mono text-xs text-white tracking-wider">
                  LIVE MISSION CONSOLE VIEWPORT
                </h2>
              </div>

              <div className="flex items-center space-x-2 font-mono text-[11px]">
                {/* 2D / 3D / DUAL Render Mode Switcher */}
                <div className="flex items-center space-x-1 bg-slate-950/80 p-0.5 rounded-lg border border-slate-800">
                  <button
                    onClick={() => setRenderMode('2D')}
                    className={`px-2 py-0.5 rounded-md font-bold transition-all flex items-center space-x-1 ${
                      renderMode === '2D' ? 'bg-cyan-500 text-slate-950 font-extrabold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Eye size={11} />
                    <span>2D</span>
                  </button>
                  <button
                    onClick={() => setRenderMode('3D')}
                    className={`px-2 py-0.5 rounded-md font-bold transition-all flex items-center space-x-1 ${
                      renderMode === '3D' ? 'bg-amber-500 text-slate-950 font-extrabold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Box size={11} />
                    <span>3D</span>
                  </button>
                  <button
                    onClick={() => setRenderMode('DUAL')}
                    className={`px-2 py-0.5 rounded-md font-bold transition-all flex items-center space-x-1 ${
                      renderMode === 'DUAL' ? 'bg-purple-500 text-white font-extrabold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Layers size={11} />
                    <span>DUAL</span>
                  </button>
                </div>

                {/* Camera Switcher Buttons (for 2D view) */}
                {renderMode === '2D' && (
                  <div className="flex items-center space-x-1">
                    {(['CAM-01', 'CAM-02', 'FUSED'] as CameraMode[]).map(cam => (
                      <button
                        key={cam}
                        onClick={() => setCameraMode(cam)}
                        className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                          cameraMode === cam 
                            ? 'bg-slate-800 text-cyan-400 border border-cyan-800' 
                            : 'bg-slate-900 text-slate-500 hover:text-white'
                        }`}
                      >
                        {cam}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Viewport Content */}
            {renderMode === '2D' && <CameraCanvas />}
            {renderMode === '3D' && <AstronautViewer className="w-full aspect-video min-h-[350px]" />}
            {renderMode === 'DUAL' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <CameraCanvas />
                <AstronautViewer className="w-full aspect-video min-h-[280px]" />
              </div>
            )}

            {/* CAMERA CONTROLS TOOLBAR */}
            <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              {/* Mission State Controls */}
              <div className="flex items-center space-x-1.5">
                <button 
                  onClick={startMission}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg flex items-center space-x-1 transition-all shadow-sm"
                >
                  <Play size={13} className="fill-current" />
                  <span>Start</span>
                </button>

                <button 
                  onClick={pauseMission}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg flex items-center space-x-1 transition-all shadow-sm"
                >
                  <Pause size={13} />
                  <span>Pause</span>
                </button>

                <button 
                  onClick={stopMission}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg flex items-center space-x-1 transition-all shadow-sm"
                >
                  <Square size={13} />
                  <span>Stop</span>
                </button>

                <button 
                  onClick={resetMission}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg flex items-center space-x-1 transition-all"
                >
                  <RefreshCw size={13} />
                  <span>Reset</span>
                </button>

                <button 
                  onClick={toggleFullscreen}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg transition-all"
                  title="Fullscreen Viewport"
                >
                  <Maximize size={13} />
                </button>
              </div>

              {/* Visualization Layer Toggles */}
              <div className="flex items-center space-x-1 text-[11px]">
                <span className="text-slate-400 mr-1 hidden sm:inline">OVERLAYS:</span>
                <button
                  onClick={() => toggleOverlaySetting('boundingBoxes')}
                  className={`px-2 py-0.5 rounded-md font-bold border transition-all ${
                    overlaySettings.boundingBoxes ? 'bg-cyan-950/80 text-cyan-300 border-cyan-600' : 'bg-slate-900 text-slate-500 border-slate-800'
                  }`}
                >
                  Boxes
                </button>

                <button
                  onClick={() => toggleOverlaySetting('skeleton')}
                  className={`px-2 py-0.5 rounded-md font-bold border transition-all ${
                    overlaySettings.skeleton ? 'bg-cyan-950/80 text-cyan-300 border-cyan-600' : 'bg-slate-900 text-slate-500 border-slate-800'
                  }`}
                >
                  Skeleton
                </button>

                <button
                  onClick={() => toggleOverlaySetting('hoiLines')}
                  className={`px-2 py-0.5 rounded-md font-bold border transition-all ${
                    overlaySettings.hoiLines ? 'bg-cyan-950/80 text-cyan-300 border-cyan-600' : 'bg-slate-900 text-slate-500 border-slate-800'
                  }`}
                >
                  HOI Vector
                </button>

                <button
                  onClick={() => toggleOverlaySetting('labels')}
                  className={`px-2 py-0.5 rounded-md font-bold border transition-all ${
                    overlaySettings.labels ? 'bg-cyan-950/80 text-cyan-300 border-cyan-600' : 'bg-slate-900 text-slate-500 border-slate-800'
                  }`}
                >
                  Labels
                </button>
              </div>
            </div>
          </div>

          {/* AI INFERENCE BREAKOUT TABS */}
          <div className="glass-card p-3.5 rounded-2xl border border-slate-800 shadow-xl space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold font-mono text-xs text-white tracking-wider flex items-center space-x-1.5">
                <Cpu size={14} className="text-cyan-400" />
                <span>LIVE INFERENCE DATA BREAKOUT</span>
              </h3>
              <div className="flex space-x-1 text-xs font-mono">
                {(['OBJECTS', 'POSE', 'HOI', 'ACTIVITY'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setAiTab(tab)}
                    className={`px-2.5 py-1 font-bold rounded-lg transition-all ${
                      aiTab === tab 
                        ? 'bg-amber-500 text-slate-950 shadow-[0_0_10px_rgba(245,158,11,0.3)]' 
                        : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Tab Content */}
            <div className="font-mono text-xs">
              {aiTab === 'OBJECTS' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {detections.map(det => (
                    <div key={det.id} className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">{det.name}</span>
                      <span className="font-bold text-white text-sm">{det.confidence}%</span>
                      <span className="text-[10px] text-emerald-400 block">{det.status}</span>
                    </div>
                  ))}
                </div>
              )}

              {aiTab === 'POSE' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-mono">3D MESH</span>
                    <span className="font-bold text-white text-sm">ASTRONAUT.GLB</span>
                  </div>
                  <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">POSE CONFIDENCE</span>
                    <span className="font-bold text-emerald-400 text-sm">{poseConfidence}%</span>
                  </div>
                  <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">REFERENCE FRAME</span>
                    <span className="font-bold text-white text-sm">RACK RELATIVE</span>
                  </div>
                  <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">TRACKING STATE</span>
                    <span className="font-bold text-cyan-400 text-sm">{trackingStatus}</span>
                  </div>
                </div>
              )}

              {aiTab === 'HOI' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">HAND-OBJECT VECTOR</span>
                    <span className="font-bold text-white text-xs">{hoi.source} → {hoi.target}</span>
                  </div>
                  <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">CONTACT CONFIDENCE</span>
                    <span className="font-bold text-amber-400 text-sm">{hoi.contactConfidence}%</span>
                  </div>
                  <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">OBJECT MOTION</span>
                    <span className="font-bold text-emerald-400 text-sm">{hoi.motion}</span>
                  </div>
                  <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">INTERACTION TYPE</span>
                    <span className="font-bold text-white text-sm">{hoi.interactionType}</span>
                  </div>
                </div>
              )}

              {aiTab === 'ACTIVITY' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">DETECTED ACTIVITY</span>
                    <span className="font-bold text-amber-400 text-xs truncate block">
                      {currentStep === 1 ? 'OPEN RED BOX' : currentStep === 2 ? 'REMOVE YELLOW CONTAINER' : 'PLACE CONTAINER IN RACK'}
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">HAR CONFIDENCE</span>
                    <span className="font-bold text-emerald-400 text-sm">{activityConfidence.toFixed(1)}%</span>
                  </div>
                  <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">TEMPORAL WINDOW</span>
                    <span className="font-bold text-white text-sm">32 FRAMES</span>
                  </div>
                  <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">FSM DECISION</span>
                    <span className="font-bold text-white text-sm">{fsmState}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT 5 COLS: PROTOCOL VALIDATOR & NEXT STEP GUIDANCE */}
        <div className="lg:col-span-5 space-y-3">
          {/* PROMINENT NEXT STEP GUIDANCE PANEL */}
          <div className="glass-card bg-gradient-to-r from-slate-900 to-[#0c152b] text-white p-4 rounded-2xl border-2 border-amber-500/80 shadow-[0_0_20px_rgba(245,158,11,0.2)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase flex items-center space-x-1">
                <Radio size={12} className="animate-pulse" />
                <span>NEXT REQUIRED ACTION</span>
              </span>
              <span className="bg-amber-500 text-slate-950 font-mono font-extrabold text-[10px] px-2.5 py-0.5 rounded-md shadow-sm">
                STEP {currentStep} / 3
              </span>
            </div>

            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
              <p className="font-mono text-sm font-bold text-white leading-relaxed">
                "{getStepInstructionText()}"
              </p>
            </div>

            <button 
              onClick={handlePlayInstruction}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-saffron-500 hover:from-amber-600 hover:to-saffron-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all font-mono"
            >
              <Volume2 size={16} />
              <span>PLAY VOICE INSTRUCTION</span>
            </button>
          </div>

          {/* PROTOCOL STATE MACHINE VALIDATOR CARDS */}
          <div className="glass-card p-4 rounded-2xl border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div>
                <h3 className="font-bold font-mono text-xs text-white tracking-wider">
                  EXPERIMENT PROTOCOL: BCE-01
                </h3>
                <p className="text-[11px] text-slate-400">Validator Engine: Finite State Machine (FSM)</p>
              </div>
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded-md border border-amber-800/60">
                FSM: {fsmState}
              </span>
            </div>

            {/* Documented 3 Primary Steps */}
            <div className="space-y-2">
              {/* STEP 01 */}
              <div className={`p-3 rounded-xl border transition-all ${
                completedSteps.includes(1) 
                  ? 'bg-emerald-950/30 border-emerald-700/50 text-emerald-300' 
                  : currentStep === 1 
                  ? 'bg-amber-950/40 border-amber-500/60 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]' 
                  : 'bg-slate-900/40 border-slate-800 text-slate-500'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs">STEP 01 — OPEN RED BOX</span>
                  {completedSteps.includes(1) ? (
                    <span className="text-emerald-400 font-bold text-xs flex items-center space-x-1">
                      <CheckCircle2 size={14} />
                      <span>COMPLETED</span>
                    </span>
                  ) : currentStep === 1 ? (
                    <span className="text-amber-400 font-bold text-xs animate-pulse">● CURRENT</span>
                  ) : (
                    <span className="text-slate-500 text-xs">WAITING</span>
                  )}
                </div>
              </div>

              {/* STEP 02 */}
              <div className={`p-3 rounded-xl border transition-all ${
                completedSteps.includes(2) 
                  ? 'bg-emerald-950/30 border-emerald-700/50 text-emerald-300' 
                  : currentStep === 2 
                  ? 'bg-amber-950/40 border-amber-500/60 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]' 
                  : 'bg-slate-900/40 border-slate-800 text-slate-500'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs">STEP 02 — REMOVE YELLOW CONTAINER</span>
                  {completedSteps.includes(2) ? (
                    <span className="text-emerald-400 font-bold text-xs flex items-center space-x-1">
                      <CheckCircle2 size={14} />
                      <span>COMPLETED</span>
                    </span>
                  ) : currentStep === 2 ? (
                    <span className="text-amber-400 font-bold text-xs animate-pulse">● CURRENT (96.4%)</span>
                  ) : (
                    <span className="text-slate-500 text-xs">WAITING</span>
                  )}
                </div>
              </div>

              {/* STEP 03 */}
              <div className={`p-3 rounded-xl border transition-all ${
                completedSteps.includes(3) 
                  ? 'bg-emerald-950/30 border-emerald-700/50 text-emerald-300' 
                  : currentStep === 3 
                  ? 'bg-amber-950/40 border-amber-500/60 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]' 
                  : 'bg-slate-900/40 border-slate-800 text-slate-500'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs">STEP 03 — PLACE CONTAINER IN RACK</span>
                  {completedSteps.includes(3) ? (
                    <span className="text-emerald-400 font-bold text-xs flex items-center space-x-1">
                      <CheckCircle2 size={14} />
                      <span>COMPLETED</span>
                    </span>
                  ) : currentStep === 3 ? (
                    <span className="text-amber-400 font-bold text-xs animate-pulse">● CURRENT</span>
                  ) : (
                    <span className="text-slate-500 text-xs">WAITING</span>
                  )}
                </div>
              </div>
            </div>

            {/* FSM STATE DIAGRAM VISUALIZATION */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <span className="text-[11px] font-bold font-mono text-white block">
                FSM STATE DIAGRAM & TRANSITIONS
              </span>

              <div className="bg-slate-950/80 text-white p-3 rounded-xl border border-slate-800 font-mono text-[10px] flex items-center justify-between overflow-x-auto gap-2">
                <span className={`px-2 py-1 rounded border ${fsmState === 'S0_READY' ? 'bg-amber-500 border-amber-400 text-slate-950 font-bold animate-pulse' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                  S0 READY
                </span>
                <span className="text-emerald-400">→</span>

                <span className={`px-2 py-1 rounded border ${fsmState === 'S1_OPEN_BOX' ? 'bg-amber-500 border-amber-400 text-slate-950 font-bold animate-pulse' : 'bg-slate-900 border-slate-800 text-slate-300'}`}>
                  S1 OPEN BOX
                </span>
                <span className="text-emerald-400">→</span>

                <span className={`px-2 py-1 rounded border ${fsmState === 'S2_REMOVE_CONTAINER' ? 'bg-amber-500 border-amber-400 text-slate-950 font-bold animate-pulse' : 'bg-slate-900 border-slate-800 text-slate-300'}`}>
                  S2 REMOVE
                </span>
                <span className="text-emerald-400">→</span>

                <span className={`px-2 py-1 rounded border ${fsmState === 'S3_PLACE_CONTAINER' ? 'bg-amber-500 border-amber-400 text-slate-950 font-bold animate-pulse' : 'bg-slate-900 border-slate-800 text-slate-300'}`}>
                  S3 RACK
                </span>
                <span className="text-emerald-400">→</span>

                <span className={`px-2 py-1 rounded border ${fsmState === 'COMPLETE' ? 'bg-emerald-600 border-emerald-400 text-white font-bold' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                  COMPLETE
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PROTOCOL COMPLETION SUMMARY MODAL */}
      {completionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-emerald-500 text-white rounded-2xl shadow-[0_0_35px_rgba(16,185,129,0.3)] max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <CheckCircle2 size={24} className="text-emerald-400" />
                <h3 className="font-bold font-mono text-lg text-white">EXPERIMENT PROTOCOL COMPLETE</h3>
              </div>
              <button 
                onClick={closeCompletionModal}
                className="text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <p className="text-slate-300">
                BOX & CONTAINER EXPERIMENT (BCE-01) successfully tracked and verified by Edge AI.
              </p>

              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span className="text-slate-400">Steps Completed:</span>
                  <span className="font-bold text-emerald-400">3 / 3</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span className="text-slate-400">Protocol Integrity:</span>
                  <span className="font-bold text-emerald-400">100%</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span className="text-slate-400">Average AI Confidence:</span>
                  <span className="font-bold text-amber-400">96.8%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Mission Duration:</span>
                  <span className="font-bold text-cyan-400">{metFormatted}</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button 
                onClick={closeCompletionModal}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-xs rounded-xl transition-colors font-mono"
              >
                RETURN TO CONSOLE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
