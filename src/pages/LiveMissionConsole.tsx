import React, { useState, useRef } from 'react';
import { useMission } from '../context/MissionContext';
import { ProceduralRackViewport } from '../components/ProceduralRackViewport';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { PipelineStrip } from '../components/PipelineStrip';
import { 
  Play, Pause, Square, RefreshCw, Maximize, Volume2, 
  CheckCircle2, AlertTriangle, Cpu, Layers, Eye, ShieldCheck, ArrowRight, X,
  Radio, Zap, Activity, Check, Box, VolumeX, EyeOff, Flame
} from 'lucide-react';
import type { CameraMode } from '../types/mission';

export const LiveMissionConsole: React.FC = () => {
  const { 
    missionStatus, currentStep, completedSteps, fsmState, expectedAction, observedAction,
    deviationAlert, completionModalOpen, metFormatted, cameraMode, setCameraMode,
    overlaySettings, toggleOverlaySetting, startMission, pauseMission, stopMission, resetMission,
    performCorrectStep, performWrongStep, skipCurrentStep, triggerObjectLost, triggerLowConfidence,
    recoverTracking, acknowledgeDeviation, closeCompletionModal, fps, latency, detections, hoi,
    activityConfidence, poseConfidence, objectConfidence, trackingStatus,
    causalResult, roiState, triggerSpatialBeepForMisplacedTool, language 
  } = useMission();

  const [aiTab, setAiTab] = useState<'OBJECTS' | 'POSE' | 'HOI' | 'CAUSAL'>('OBJECTS');
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
    if (currentStep === 1) return language === 'hi' ? "लाल प्रयोग बॉक्स का ढक्कन खोलें।" : "Open the red experiment box lid.";
    if (currentStep === 2) return language === 'hi' ? "लाल प्रयोग बॉक्स से पीला कंटेनर निकालें।" : "Remove the yellow container from the red experiment box.";
    if (currentStep === 3) return language === 'hi' ? "पीले कंटेनर को पेलोड रैक स्लॉट में रखें।" : "Place the yellow container in the payload rack slot.";
    return language === 'hi' ? "प्रयोग प्रोटोकॉल पूर्ण।" : "Experiment protocol complete.";
  };

  return (
    <div ref={consoleRef} className="space-y-4 font-sans">
      {/* 1. CORE PIPELINE STRIP */}
      <PipelineStrip />

      {/* 2. TOP TELEMETRY STRIP */}
      <div className="isro-card p-3 bg-white dark:bg-[#0A1A33] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center space-x-4">
          <div>
            <span className="text-[#5B6675] dark:text-slate-400 text-[10px] block">EXPERIMENT ID</span>
            <span className="font-bold text-[#0B2A5B] dark:text-cyan-300">ISRO-BCE-EXP-01</span>
          </div>

          <div className="text-slate-300 dark:text-slate-700">|</div>

          <div>
            <span className="text-[#5B6675] dark:text-slate-400 text-[10px] block">STATUS</span>
            <span className={`font-bold flex items-center gap-1 ${missionStatus === 'CRITICAL' ? 'text-[#C62828] animate-pulse' : 'text-[#138808]'}`}>
              <span className="w-2 h-2 rounded-full bg-[#138808]"></span>
              <span>{missionStatus}</span>
            </span>
          </div>

          <div className="text-slate-300 dark:text-slate-700">|</div>

          <div>
            <span className="text-[#5B6675] dark:text-slate-400 text-[10px] block">MISSION ELAPSED TIME</span>
            <span className="font-bold text-[#F26B21]">MET {metFormatted}</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div>
            <span className="text-[#5B6675] dark:text-slate-400 text-[10px] block">ADAPTIVE ROI COMPUTE</span>
            <span className="text-[#138808] font-bold">{roiState.pixelsProcessedPercent}% pixels ({roiState.computeSavingPercent}% saved)</span>
          </div>

          <div className="text-slate-300 dark:text-slate-700">|</div>

          <div>
            <span className="text-[#5B6675] dark:text-slate-400 text-[10px] block">TELEMETRY (TARGET / SIMULATED)</span>
            <span className="text-[#123F8C] dark:text-cyan-300 font-bold">{fps} FPS | {latency} ms</span>
          </div>
        </div>
      </div>

      {/* PROTOCOL DEVIATION CRITICAL WARNING BANNER */}
      {deviationAlert && (
        <div className="bg-red-50 dark:bg-red-950/90 border border-red-300 dark:border-red-600 text-[#1B2430] dark:text-white p-4 rounded text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-start space-x-3">
            <AlertTriangle size={24} className="text-[#C62828] shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-[#C62828] dark:text-red-300 text-sm">
                  {deviationAlert.title}
                </h3>
                <span className="bg-red-600 text-white font-bold text-[10px] px-1.5 py-0.2 rounded font-mono">
                  FSM: ERROR
                </span>
              </div>
              <p className="text-xs text-[#5B6675] dark:text-slate-200 mt-0.5">{deviationAlert.detail}</p>
              <div className="mt-1.5 text-xs font-mono grid grid-cols-1 md:grid-cols-2 gap-2 bg-white dark:bg-slate-900 p-2 rounded border border-red-200 dark:border-red-800">
                <div><span className="text-[#C62828] font-bold">EXPECTED:</span> {deviationAlert.expected}</div>
                <div><span className="text-[#C62828] font-bold">OBSERVED:</span> {deviationAlert.observed}</div>
              </div>
            </div>
          </div>

          <button 
            onClick={acknowledgeDeviation}
            className="btn-isro-cta self-end md:self-center"
          >
            Acknowledge & Resume
          </button>
        </div>
      )}

      {/* MAIN TWO-COLUMN CONSOLE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT 7 COLS: CAMERA PANEL & CAMERA CONTROLS */}
        <div className="lg:col-span-7 space-y-3">
          {/* Main Vision Viewport Container */}
          <div className="isro-card p-3 bg-white dark:bg-[#0A1A33] space-y-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <h2 className="isro-section-title mb-0 text-xs">
                  Live Mission Camera & Adaptive ROI
                </h2>
                <span className="text-[10px] bg-[#EEF3FA] dark:bg-slate-800 text-[#123F8C] dark:text-cyan-300 font-mono px-2 py-0.5 rounded">
                  {roiState.targetLabel}
                </span>
              </div>

              <div className="flex items-center space-x-2 font-mono text-xs">
                {/* 2D / 3D / DUAL Render Mode Switcher */}
                <div className="flex items-center space-x-1 bg-[#EEF3FA] dark:bg-slate-900 p-0.5 rounded border border-[#D5DCE6] dark:border-slate-800">
                  <button
                    onClick={() => setRenderMode('2D')}
                    className={`px-2 py-0.5 rounded font-semibold transition-colors flex items-center gap-1 ${
                      renderMode === '2D' ? 'bg-[#123F8C] text-white' : 'text-[#5B6675] hover:text-[#1B2430]'
                    }`}
                  >
                    <Eye size={11} />
                    <span>2D</span>
                  </button>
                  <button
                    onClick={() => setRenderMode('3D')}
                    className={`px-2 py-0.5 rounded font-semibold transition-colors flex items-center gap-1 ${
                      renderMode === '3D' ? 'bg-[#123F8C] text-white' : 'text-[#5B6675] hover:text-[#1B2430]'
                    }`}
                  >
                    <Box size={11} />
                    <span>3D</span>
                  </button>
                  <button
                    onClick={() => setRenderMode('DUAL')}
                    className={`px-2 py-0.5 rounded font-semibold transition-colors flex items-center gap-1 ${
                      renderMode === 'DUAL' ? 'bg-[#123F8C] text-white' : 'text-[#5B6675] hover:text-[#1B2430]'
                    }`}
                  >
                    <Layers size={11} />
                    <span>DUAL</span>
                  </button>
                </div>

                {renderMode === '2D' && (
                  <div className="flex items-center space-x-1">
                    {(['CAM-01', 'CAM-02', 'FUSED'] as CameraMode[]).map(cam => (
                      <button
                        key={cam}
                        onClick={() => setCameraMode(cam)}
                        className={`px-2 py-0.5 rounded font-semibold transition-colors ${
                          cameraMode === cam 
                            ? 'bg-[#123F8C] text-white' 
                            : 'bg-[#EEF3FA] text-[#5B6675] hover:text-black'
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
            <ErrorBoundary fallbackTitle="Procedural Rack Viewport Notice">
              <ProceduralRackViewport />
            </ErrorBoundary>

            {/* CAMERA CONTROLS TOOLBAR */}
            <div className="pt-2 border-t border-[#EEF3FA] dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <div className="flex items-center space-x-1.5">
                <button onClick={startMission} className="btn-isro-primary">
                  <Play size={13} className="fill-current" />
                  <span>Start</span>
                </button>

                <button onClick={pauseMission} className="btn-isro-outline">
                  <Pause size={13} />
                  <span>Pause</span>
                </button>

                <button onClick={stopMission} className="btn-isro-outline">
                  <Square size={13} />
                  <span>Stop</span>
                </button>

                <button onClick={resetMission} className="btn-isro-outline">
                  <RefreshCw size={13} />
                  <span>Reset</span>
                </button>

                <button onClick={triggerSpatialBeepForMisplacedTool} className="btn-isro-outline" title="Play 3D Spatial HRTF Audio Cue">
                  <Volume2 size={13} />
                  <span>Spatial Cue</span>
                </button>

                <button onClick={toggleFullscreen} className="btn-isro-outline" title="Fullscreen Viewport">
                  <Maximize size={13} />
                </button>
              </div>

              <div className="flex items-center space-x-1 text-[11px]">
                <span className="text-[#5B6675] mr-1 hidden sm:inline">OVERLAYS:</span>
                <button
                  onClick={() => toggleOverlaySetting('boundingBoxes')}
                  className={`px-2 py-0.5 rounded font-semibold border ${
                    overlaySettings.boundingBoxes ? 'bg-[#EEF3FA] text-[#123F8C] border-[#123F8C]' : 'border-[#D5DCE6] text-[#5B6675]'
                  }`}
                >
                  Boxes
                </button>

                <button
                  onClick={() => toggleOverlaySetting('skeleton')}
                  className={`px-2 py-0.5 rounded font-semibold border ${
                    overlaySettings.skeleton ? 'bg-[#EEF3FA] text-[#123F8C] border-[#123F8C]' : 'border-[#D5DCE6] text-[#5B6675]'
                  }`}
                >
                  Skeleton
                </button>

                <button
                  onClick={() => toggleOverlaySetting('hoiLines')}
                  className={`px-2 py-0.5 rounded font-semibold border ${
                    overlaySettings.hoiLines ? 'bg-[#EEF3FA] text-[#123F8C] border-[#123F8C]' : 'border-[#D5DCE6] text-[#5B6675]'
                  }`}
                >
                  HOI Vector
                </button>
              </div>
            </div>
          </div>

          {/* INFERENCE BREAKOUT TABS */}
          <div className="isro-card p-3 bg-white dark:bg-[#0A1A33] space-y-2">
            <div className="flex items-center justify-between border-b border-[#EEF3FA] dark:border-slate-800 pb-2">
              <h3 className="isro-section-title mb-0 text-xs">
                Inference Telemetry & Evidence Breakout
              </h3>
              <div className="flex space-x-1 text-xs font-mono">
                {(['OBJECTS', 'POSE', 'HOI', 'CAUSAL'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setAiTab(tab)}
                    className={`px-2.5 py-0.5 font-bold rounded transition-colors ${
                      aiTab === tab 
                        ? 'bg-[#123F8C] text-white' 
                        : 'text-[#5B6675] hover:bg-[#EEF3FA] dark:hover:bg-slate-800'
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
                    <div key={det.id} className="p-2 bg-[#F5F7FA] dark:bg-slate-900 rounded border border-[#D5DCE6] dark:border-slate-800">
                      <span className="text-[10px] text-[#5B6675] block">{det.name}</span>
                      <span className="font-bold text-[#0B2A5B] dark:text-white text-xs">{det.confidence}%</span>
                      <span className="text-[10px] text-[#138808] block">{det.status}</span>
                    </div>
                  ))}
                </div>
              )}

              {aiTab === 'POSE' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-2 bg-[#F5F7FA] dark:bg-slate-900 rounded border border-[#D5DCE6] dark:border-slate-800">
                    <span className="text-[10px] text-[#5B6675] block">MODEL</span>
                    <span className="font-bold text-[#0B2A5B] dark:text-white text-xs">YOLO26n 3D Pose</span>
                  </div>
                  <div className="p-2 bg-[#F5F7FA] dark:bg-slate-900 rounded border border-[#D5DCE6] dark:border-slate-800">
                    <span className="text-[10px] text-[#5B6675] block">POSE CONFIDENCE</span>
                    <span className="font-bold text-[#138808] text-xs">{poseConfidence}%</span>
                  </div>
                  <div className="p-2 bg-[#F5F7FA] dark:bg-slate-900 rounded border border-[#D5DCE6] dark:border-slate-800">
                    <span className="text-[10px] text-[#5B6675] block">REFERENCE FRAME</span>
                    <span className="font-bold text-[#0B2A5B] dark:text-white text-xs">RACK ORIGIN</span>
                  </div>
                  <div className="p-2 bg-[#F5F7FA] dark:bg-slate-900 rounded border border-[#D5DCE6] dark:border-slate-800">
                    <span className="text-[10px] text-[#5B6675] block">TRACKING STATE</span>
                    <span className="font-bold text-[#123F8C] dark:text-cyan-300 text-xs">{trackingStatus}</span>
                  </div>
                </div>
              )}

              {aiTab === 'HOI' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-2 bg-[#F5F7FA] dark:bg-slate-900 rounded border border-[#D5DCE6] dark:border-slate-800">
                    <span className="text-[10px] text-[#5B6675] block">VECTOR</span>
                    <span className="font-bold text-[#0B2A5B] dark:text-white text-xs">{hoi.source} → {hoi.target}</span>
                  </div>
                  <div className="p-2 bg-[#F5F7FA] dark:bg-slate-900 rounded border border-[#D5DCE6] dark:border-slate-800">
                    <span className="text-[10px] text-[#5B6675] block">CONTACT CONF</span>
                    <span className="font-bold text-[#F26B21] text-xs">{hoi.contactConfidence}%</span>
                  </div>
                  <div className="p-2 bg-[#F5F7FA] dark:bg-slate-900 rounded border border-[#D5DCE6] dark:border-slate-800">
                    <span className="text-[10px] text-[#5B6675] block">MOTION</span>
                    <span className="font-bold text-[#138808] text-xs">{hoi.motion}</span>
                  </div>
                  <div className="p-2 bg-[#F5F7FA] dark:bg-slate-900 rounded border border-[#D5DCE6] dark:border-slate-800">
                    <span className="text-[10px] text-[#5B6675] block">INTERACTION</span>
                    <span className="font-bold text-[#0B2A5B] dark:text-white text-xs">{hoi.interactionType}</span>
                  </div>
                </div>
              )}

              {aiTab === 'CAUSAL' && (
                <div className="p-2.5 bg-[#F5F7FA] dark:bg-slate-900 rounded border border-[#D5DCE6] dark:border-slate-800 space-y-1 text-xs">
                  <div className="flex items-center justify-between font-bold">
                    <span>Causal Status: {causalResult.accepted ? 'ACCEPTED' : 'REJECTED'}</span>
                    <span className="text-[#5B6675]">3 Evidence Agreement</span>
                  </div>
                  {causalResult.rejectionReason && (
                    <p className="text-[#C62828] font-mono text-[11px]">Reason: {causalResult.rejectionReason}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT 5 COLS: PROTOCOL VALIDATOR & NEXT STEP GUIDANCE */}
        <div className="lg:col-span-5 space-y-3">
          {/* NEXT STEP GUIDANCE PANEL */}
          <div className="isro-card p-4 bg-white dark:bg-[#0A1A33] border-l-4 border-l-[#F26B21] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold tracking-wider text-[#F26B21] uppercase flex items-center gap-1">
                <Radio size={12} className="animate-pulse" />
                <span>Next Required Action</span>
              </span>
              <span className="bg-[#123F8C] text-white font-mono font-bold text-[10px] px-2 py-0.5 rounded">
                STEP {currentStep} / 3
              </span>
            </div>

            <div className="bg-[#EEF3FA] dark:bg-slate-900 p-3 rounded border border-[#D5DCE6] dark:border-slate-800">
              <p className="font-bold text-[#0B2A5B] dark:text-white text-sm">
                "{getStepInstructionText()}"
              </p>
            </div>
          </div>

          {/* PROTOCOL STATE MACHINE VALIDATOR CARDS */}
          <div className="isro-card p-4 bg-white dark:bg-[#0A1A33] space-y-3">
            <div className="flex items-center justify-between border-b border-[#EEF3FA] dark:border-slate-800 pb-2">
              <div>
                <h3 className="isro-section-title mb-0 text-xs">
                  Experiment Protocol Sequence (BCE-01)
                </h3>
                <p className="text-[11px] text-[#5B6675] dark:text-slate-400">Finite State Machine Validator</p>
              </div>
              <span className="text-xs font-mono font-bold text-[#123F8C] dark:text-cyan-300 bg-[#EEF3FA] dark:bg-slate-800 px-2 py-0.5 rounded">
                FSM: {fsmState}
              </span>
            </div>

            {/* Documented 3 Primary Steps */}
            <div className="space-y-2">
              {/* STEP 01 */}
              <div className={`p-2.5 rounded border text-xs transition-colors ${
                completedSteps.includes(1) 
                  ? 'bg-emerald-50 border-emerald-300 text-[#138808] dark:bg-emerald-950/40' 
                  : currentStep === 1 
                  ? 'bg-[#EEF3FA] border-[#123F8C] text-[#0B2A5B] dark:bg-slate-800 font-bold' 
                  : 'bg-white border-[#D5DCE6] text-[#5B6675] dark:bg-slate-900'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold">STEP 01 — OPEN RED BOX</span>
                  {completedSteps.includes(1) ? (
                    <span className="text-[#138808] font-bold flex items-center gap-1">
                      <CheckCircle2 size={13} /> COMPLETED
                    </span>
                  ) : currentStep === 1 ? (
                    <span className="text-[#F26B21] font-bold">● CURRENT</span>
                  ) : (
                    <span className="text-[#5B6675]">WAITING</span>
                  )}
                </div>
              </div>

              {/* STEP 02 */}
              <div className={`p-2.5 rounded border text-xs transition-colors ${
                completedSteps.includes(2) 
                  ? 'bg-emerald-50 border-emerald-300 text-[#138808] dark:bg-emerald-950/40' 
                  : currentStep === 2 
                  ? 'bg-[#EEF3FA] border-[#123F8C] text-[#0B2A5B] dark:bg-slate-800 font-bold' 
                  : 'bg-white border-[#D5DCE6] text-[#5B6675] dark:bg-slate-900'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold">STEP 02 — REMOVE YELLOW CONTAINER</span>
                  {completedSteps.includes(2) ? (
                    <span className="text-[#138808] font-bold flex items-center gap-1">
                      <CheckCircle2 size={13} /> COMPLETED
                    </span>
                  ) : currentStep === 2 ? (
                    <span className="text-[#F26B21] font-bold">● CURRENT</span>
                  ) : (
                    <span className="text-[#5B6675]">WAITING</span>
                  )}
                </div>
              </div>

              {/* STEP 03 */}
              <div className={`p-2.5 rounded border text-xs transition-colors ${
                completedSteps.includes(3) 
                  ? 'bg-emerald-50 border-emerald-300 text-[#138808] dark:bg-emerald-950/40' 
                  : currentStep === 3 
                  ? 'bg-[#EEF3FA] border-[#123F8C] text-[#0B2A5B] dark:bg-slate-800 font-bold' 
                  : 'bg-white border-[#D5DCE6] text-[#5B6675] dark:bg-slate-900'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold">STEP 03 — PLACE CONTAINER IN RACK</span>
                  {completedSteps.includes(3) ? (
                    <span className="text-[#138808] font-bold flex items-center gap-1">
                      <CheckCircle2 size={13} /> COMPLETED
                    </span>
                  ) : currentStep === 3 ? (
                    <span className="text-[#F26B21] font-bold">● CURRENT</span>
                  ) : (
                    <span className="text-[#5B6675]">WAITING</span>
                  )}
                </div>
              </div>
            </div>

            {/* FSM STATE DIAGRAM VISUALIZATION */}
            <div className="pt-2 border-t border-[#EEF3FA] dark:border-slate-800 space-y-1.5">
              <span className="text-[11px] font-bold font-mono text-[#0B2A5B] dark:text-slate-200 block">
                FSM State Diagram & Active Node
              </span>

              <div className="bg-[#F5F7FA] dark:bg-slate-900 text-[#1B2430] dark:text-white p-2.5 rounded border border-[#D5DCE6] dark:border-slate-800 font-mono text-[10px] flex items-center justify-between overflow-x-auto gap-1.5">
                <span className={`px-2 py-0.5 rounded border ${fsmState === 'S0_READY' ? 'bg-[#123F8C] text-white font-bold' : 'bg-white dark:bg-slate-800 text-[#5B6675]'}`}>
                  S0 READY
                </span>
                <span className="text-[#138808]">→</span>

                <span className={`px-2 py-0.5 rounded border ${fsmState === 'S1_OPEN_BOX' ? 'bg-[#123F8C] text-white font-bold' : 'bg-white dark:bg-slate-800 text-[#5B6675]'}`}>
                  S1 OPEN
                </span>
                <span className="text-[#138808]">→</span>

                <span className={`px-2 py-0.5 rounded border ${fsmState === 'S2_REMOVE_CONTAINER' ? 'bg-[#123F8C] text-white font-bold' : 'bg-white dark:bg-slate-800 text-[#5B6675]'}`}>
                  S2 REMOVE
                </span>
                <span className="text-[#138808]">→</span>

                <span className={`px-2 py-0.5 rounded border ${fsmState === 'S3_PLACE_CONTAINER' ? 'bg-[#123F8C] text-white font-bold' : 'bg-white dark:bg-slate-800 text-[#5B6675]'}`}>
                  S3 RACK
                </span>
                <span className="text-[#138808]">→</span>

                <span className={`px-2 py-0.5 rounded border ${fsmState === 'COMPLETE' ? 'bg-[#138808] text-white font-bold' : 'bg-white dark:bg-slate-800 text-[#5B6675]'}`}>
                  COMPLETE
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* COMPLETION MODAL */}
      {completionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="isro-card p-6 max-w-lg w-full bg-white dark:bg-[#0A1A33] space-y-4">
            <div className="flex items-center justify-between border-b border-[#EEF3FA] pb-3">
              <div className="flex items-center space-x-2">
                <CheckCircle2 size={24} className="text-[#138808]" />
                <h3 className="font-bold text-[#0B2A5B] dark:text-white text-base">EXPERIMENT PROTOCOL COMPLETE</h3>
              </div>
              <button onClick={closeCompletionModal} className="text-[#5B6675] hover:text-black">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="bg-[#EEF3FA] dark:bg-slate-900 p-3 rounded space-y-1.5">
                <div className="flex justify-between">
                  <span>Steps Completed:</span>
                  <span className="font-bold text-[#138808]">3 / 3</span>
                </div>
                <div className="flex justify-between">
                  <span>Sequence Integrity:</span>
                  <span className="font-bold text-[#138808]">100% Verified</span>
                </div>
                <div className="flex justify-between">
                  <span>Mission Elapsed Time:</span>
                  <span className="font-bold text-[#123F8C]">{metFormatted}</span>
                </div>
              </div>
            </div>

            <button onClick={closeCompletionModal} className="btn-isro-primary w-full justify-center">
              Return to Console
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
