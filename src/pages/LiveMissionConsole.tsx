import React, { useState, useRef } from 'react';
import { useMission } from '../context/MissionContext';
import { CameraCanvas } from '../components/CameraCanvas';
import { speakGuidance } from '../utils/speech';
import { 
  Play, Pause, Square, RefreshCw, Maximize, Volume2, 
  CheckCircle2, AlertTriangle, Cpu, Layers, Eye, ShieldCheck, ArrowRight, X
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
    <div ref={consoleRef} className="space-y-4 font-sans bg-space-bg p-1">
      {/* 1. TOP TELEMETRY STRIP */}
      <div className="bg-[#071B33] text-white p-3 rounded-lg shadow-md border border-navy-700 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center space-x-4">
          <div>
            <span className="text-slate-400 text-[10px] block">MISSION ID</span>
            <span className="font-bold text-saffron-400">BOX-CONTAINER-EXP-01</span>
          </div>

          <div className="hidden sm:block text-slate-600">|</div>

          <div>
            <span className="text-slate-400 text-[10px] block">STATUS</span>
            <span className={`font-bold ${missionStatus === 'CRITICAL' ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
              ● {missionStatus}
            </span>
          </div>

          <div className="hidden sm:block text-slate-600">|</div>

          <div>
            <span className="text-slate-400 text-[10px] block">MISSION ELAPSED TIME</span>
            <span className="font-bold text-saffron-400">MET {metFormatted}</span>
          </div>

          <div className="hidden md:block text-slate-600">|</div>

          <div className="hidden md:block">
            <span className="text-slate-400 text-[10px] block">EDGE NODE</span>
            <span className="text-slate-200">JETSON-XAVIER-NX</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div>
            <span className="text-slate-400 text-[10px] block">PROCESSING</span>
            <span className="text-emerald-400 font-semibold">LOCAL / OFFLINE</span>
          </div>

          <div className="hidden sm:block text-slate-600">|</div>

          <div>
            <span className="text-slate-400 text-[10px] block">TELEMETRY</span>
            <span className="text-saffron-400 font-bold">{fps} FPS | {latency} ms</span>
          </div>

          <div className="hidden sm:block text-slate-600">|</div>

          <div className="flex items-center space-x-1.5 bg-red-950/80 px-2 py-1 rounded border border-red-800 text-red-300">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            <span className="font-bold text-[11px]">● REC</span>
          </div>
        </div>
      </div>

      {/* PROTOCOL DEVIATION CRITICAL WARNING BANNER */}
      {deviationAlert && (
        <div className="bg-red-950 border-2 border-red-600 text-white p-4 rounded-lg shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle size={28} className="text-red-400 animate-bounce shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold font-mono text-red-200 text-base tracking-wider">
                  {deviationAlert.title}
                </h3>
                <span className="bg-red-600 text-white font-bold text-[10px] px-1.5 py-0.2 rounded font-mono">
                  FSM: ERROR
                </span>
              </div>
              <p className="text-xs text-red-100 mt-1">{deviationAlert.detail}</p>
              <div className="mt-2 text-xs font-mono grid grid-cols-1 md:grid-cols-2 gap-2 bg-red-900/60 p-2 rounded border border-red-800">
                <div><span className="text-red-300">EXPECTED:</span> {deviationAlert.expected}</div>
                <div><span className="text-red-300">OBSERVED:</span> {deviationAlert.observed}</div>
              </div>
            </div>
          </div>

          <button 
            onClick={acknowledgeDeviation}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded border border-red-400 shadow transition-colors whitespace-nowrap self-end md:self-center"
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
          <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
                <h2 className="font-bold font-mono text-xs text-navy-900 tracking-wider">
                  LIVE VISION — RACK-CAM-01 (1920 × 1080)
                </h2>
              </div>

              {/* Camera Switcher Buttons */}
              <div className="flex items-center space-x-1 font-mono text-[11px]">
                {(['CAM-01', 'CAM-02', 'FUSED'] as CameraMode[]).map(cam => (
                  <button
                    key={cam}
                    onClick={() => setCameraMode(cam)}
                    className={`px-2 py-0.5 rounded font-bold transition-colors ${
                      cameraMode === cam 
                        ? 'bg-navy-900 text-white' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cam}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Camera Viewport */}
            <CameraCanvas />

            {/* CAMERA CONTROLS TOOLBAR */}
            <div className="pt-2 border-t flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              {/* Mission State Controls */}
              <div className="flex items-center space-x-1.5">
                <button 
                  onClick={startMission}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded flex items-center space-x-1 transition-colors"
                >
                  <Play size={14} className="fill-current" />
                  <span>Start Mission</span>
                </button>

                <button 
                  onClick={pauseMission}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded flex items-center space-x-1 transition-colors"
                >
                  <Pause size={14} />
                  <span>Pause</span>
                </button>

                <button 
                  onClick={stopMission}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded flex items-center space-x-1 transition-colors"
                >
                  <Square size={14} />
                  <span>Stop</span>
                </button>

                <button 
                  onClick={resetMission}
                  className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded flex items-center space-x-1 transition-colors"
                >
                  <RefreshCw size={14} />
                  <span>Reset</span>
                </button>

                <button 
                  onClick={toggleFullscreen}
                  className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded transition-colors"
                  title="Fullscreen Viewport"
                >
                  <Maximize size={14} />
                </button>
              </div>

              {/* Visualization Layer Toggles */}
              <div className="flex items-center space-x-1 text-[11px]">
                <span className="text-slate-500 mr-1 hidden sm:inline">OVERLAYS:</span>
                <button
                  onClick={() => toggleOverlaySetting('boundingBoxes')}
                  className={`px-2 py-0.5 rounded font-bold border transition-colors ${
                    overlaySettings.boundingBoxes ? 'bg-navy-900 text-white border-navy-900' : 'bg-slate-100 text-slate-500 border-slate-300'
                  }`}
                >
                  Boxes
                </button>

                <button
                  onClick={() => toggleOverlaySetting('skeleton')}
                  className={`px-2 py-0.5 rounded font-bold border transition-colors ${
                    overlaySettings.skeleton ? 'bg-navy-900 text-white border-navy-900' : 'bg-slate-100 text-slate-500 border-slate-300'
                  }`}
                >
                  Skeleton
                </button>

                <button
                  onClick={() => toggleOverlaySetting('hoiLines')}
                  className={`px-2 py-0.5 rounded font-bold border transition-colors ${
                    overlaySettings.hoiLines ? 'bg-navy-900 text-white border-navy-900' : 'bg-slate-100 text-slate-500 border-slate-300'
                  }`}
                >
                  HOI Vector
                </button>

                <button
                  onClick={() => toggleOverlaySetting('labels')}
                  className={`px-2 py-0.5 rounded font-bold border transition-colors ${
                    overlaySettings.labels ? 'bg-navy-900 text-white border-navy-900' : 'bg-slate-100 text-slate-500 border-slate-300'
                  }`}
                >
                  Labels
                </button>
              </div>
            </div>
          </div>

          {/* AI INFERENCE BREAKOUT TABS */}
          <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold font-mono text-xs text-navy-900 tracking-wider">
                LIVE INFERENCE DATA BREAKOUT
              </h3>
              <div className="flex space-x-1 text-xs font-mono">
                {(['OBJECTS', 'POSE', 'HOI', 'ACTIVITY'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setAiTab(tab)}
                    className={`px-2.5 py-1 font-bold rounded transition-colors ${
                      aiTab === tab 
                        ? 'bg-saffron-500 text-white' 
                        : 'text-slate-600 hover:bg-slate-100'
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
                    <div key={det.id} className="p-2 bg-space-bg rounded border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">{det.name}</span>
                      <span className="font-bold text-navy-900 text-sm">{det.confidence}%</span>
                      <span className="text-[10px] text-emerald-600 block">{det.status}</span>
                    </div>
                  ))}
                </div>
              )}

              {aiTab === 'POSE' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-2 bg-space-bg rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 block font-mono">KEYPOINTS</span>
                    <span className="font-bold text-navy-900 text-sm">33 KEYPOINTS</span>
                  </div>
                  <div className="p-2 bg-space-bg rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">POSE CONFIDENCE</span>
                    <span className="font-bold text-emerald-600 text-sm">{poseConfidence}%</span>
                  </div>
                  <div className="p-2 bg-space-bg rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">REFERENCE FRAME</span>
                    <span className="font-bold text-navy-900 text-sm">RACK RELATIVE</span>
                  </div>
                  <div className="p-2 bg-space-bg rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">TRACKING STATE</span>
                    <span className="font-bold text-blue-600 text-sm">{trackingStatus}</span>
                  </div>
                </div>
              )}

              {aiTab === 'HOI' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-2 bg-space-bg rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">HAND-OBJECT VECTOR</span>
                    <span className="font-bold text-navy-900 text-xs">{hoi.source} → {hoi.target}</span>
                  </div>
                  <div className="p-2 bg-space-bg rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">CONTACT CONFIDENCE</span>
                    <span className="font-bold text-saffron-600 text-sm">{hoi.contactConfidence}%</span>
                  </div>
                  <div className="p-2 bg-space-bg rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">OBJECT MOTION</span>
                    <span className="font-bold text-emerald-600 text-sm">{hoi.motion}</span>
                  </div>
                  <div className="p-2 bg-space-bg rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">INTERACTION TYPE</span>
                    <span className="font-bold text-navy-900 text-sm">{hoi.interactionType}</span>
                  </div>
                </div>
              )}

              {aiTab === 'ACTIVITY' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-2 bg-space-bg rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">DETECTED ACTIVITY</span>
                    <span className="font-bold text-saffron-600 text-xs">
                      {currentStep === 1 ? 'OPEN RED BOX' : currentStep === 2 ? 'REMOVE YELLOW CONTAINER' : 'PLACE CONTAINER IN RACK'}
                    </span>
                  </div>
                  <div className="p-2 bg-space-bg rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">HAR CONFIDENCE</span>
                    <span className="font-bold text-emerald-600 text-sm">{activityConfidence.toFixed(1)}%</span>
                  </div>
                  <div className="p-2 bg-space-bg rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">TEMPORAL WINDOW</span>
                    <span className="font-bold text-navy-900 text-sm">32 FRAMES</span>
                  </div>
                  <div className="p-2 bg-space-bg rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">FSM DECISION</span>
                    <span className="font-bold text-navy-900 text-sm">{fsmState}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT 5 COLS: PROTOCOL VALIDATOR & NEXT STEP GUIDANCE */}
        <div className="lg:col-span-5 space-y-3">
          {/* PROMINENT NEXT STEP GUIDANCE PANEL */}
          <div className="bg-[#071B33] text-white p-4 rounded-lg border-2 border-saffron-500 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold tracking-widest text-saffron-400 uppercase">
                NEXT REQUIRED ACTION
              </span>
              <span className="bg-saffron-500 text-white font-mono font-bold text-[10px] px-2 py-0.5 rounded">
                STEP {currentStep} / 3
              </span>
            </div>

            <div className="bg-navy-900 p-3.5 rounded border border-navy-700">
              <p className="font-mono text-sm font-bold text-white leading-relaxed">
                "{getStepInstructionText()}"
              </p>
            </div>

            <button 
              onClick={handlePlayInstruction}
              className="w-full py-2.5 bg-saffron-500 hover:bg-saffron-600 active:bg-saffron-700 text-white font-bold text-xs rounded shadow flex items-center justify-center space-x-2 transition-colors font-mono"
            >
              <Volume2 size={16} />
              <span>🔊 PLAY VOICE INSTRUCTION</span>
            </button>
          </div>

          {/* PROTOCOL STATE MACHINE VALIDATOR CARDS */}
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <h3 className="font-bold font-mono text-xs text-navy-900 tracking-wider">
                  EXPERIMENT PROTOCOL: BOX & CONTAINER (BCE-01)
                </h3>
                <p className="text-[11px] text-slate-500">Validator Engine: Finite State Machine (FSM)</p>
              </div>
              <span className="text-xs font-mono font-bold text-saffron-600 bg-saffron-50 px-2 py-0.5 rounded border border-saffron-200">
                FSM: {fsmState}
              </span>
            </div>

            {/* Documented 3 Primary Steps */}
            <div className="space-y-2.5">
              {/* STEP 01 */}
              <div className={`p-3 rounded border transition-all ${
                completedSteps.includes(1) 
                  ? 'bg-emerald-50 border-emerald-300' 
                  : currentStep === 1 
                  ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-400/30' 
                  : 'bg-slate-50 border-slate-200 opacity-70'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-navy-900">STEP 01 — OPEN RED BOX</span>
                  {completedSteps.includes(1) ? (
                    <span className="text-emerald-700 font-bold text-xs flex items-center space-x-1">
                      <CheckCircle2 size={14} />
                      <span>✓ COMPLETED</span>
                    </span>
                  ) : currentStep === 1 ? (
                    <span className="text-blue-700 font-bold text-xs animate-pulse">● CURRENT</span>
                  ) : (
                    <span className="text-slate-400 text-xs">WAITING</span>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-1 font-mono">
                  Trigger: Red box opened / lid movement detected
                </p>
              </div>

              {/* STEP 02 */}
              <div className={`p-3 rounded border transition-all ${
                completedSteps.includes(2) 
                  ? 'bg-emerald-50 border-emerald-300' 
                  : currentStep === 2 
                  ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-400/30' 
                  : 'bg-slate-50 border-slate-200 opacity-70'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-navy-900">STEP 02 — REMOVE YELLOW CONTAINER</span>
                  {completedSteps.includes(2) ? (
                    <span className="text-emerald-700 font-bold text-xs flex items-center space-x-1">
                      <CheckCircle2 size={14} />
                      <span>✓ COMPLETED</span>
                    </span>
                  ) : currentStep === 2 ? (
                    <span className="text-blue-700 font-bold text-xs animate-pulse">● CURRENT (96.4%)</span>
                  ) : (
                    <span className="text-slate-400 text-xs">WAITING</span>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-1 font-mono">
                  Required Interaction: HAND → YELLOW CONTAINER
                </p>
              </div>

              {/* STEP 03 */}
              <div className={`p-3 rounded border transition-all ${
                completedSteps.includes(3) 
                  ? 'bg-emerald-50 border-emerald-300' 
                  : currentStep === 3 
                  ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-400/30' 
                  : 'bg-slate-50 border-slate-200 opacity-70'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-navy-900">STEP 03 — PLACE CONTAINER IN RACK</span>
                  {completedSteps.includes(3) ? (
                    <span className="text-emerald-700 font-bold text-xs flex items-center space-x-1">
                      <CheckCircle2 size={14} />
                      <span>✓ COMPLETED</span>
                    </span>
                  ) : currentStep === 3 ? (
                    <span className="text-blue-700 font-bold text-xs animate-pulse">● CURRENT</span>
                  ) : (
                    <span className="text-slate-400 text-xs">WAITING</span>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-1 font-mono">
                  Trigger: Container enters rack region slot
                </p>
              </div>
            </div>

            {/* FSM STATE DIAGRAM VISUALIZATION */}
            <div className="pt-2 border-t space-y-2">
              <span className="text-[11px] font-bold font-mono text-navy-900 block">
                FSM STATE DIAGRAM & TRANSITIONS
              </span>

              <div className="bg-[#071B33] text-white p-3 rounded font-mono text-[10px] flex items-center justify-between overflow-x-auto gap-2">
                <span className={`px-2 py-1 rounded border ${fsmState === 'S0_READY' ? 'bg-saffron-500 border-saffron-400 text-white font-bold animate-pulse' : 'bg-navy-900 border-navy-700 text-slate-400'}`}>
                  S0 READY
                </span>
                <span className="text-emerald-400">→</span>

                <span className={`px-2 py-1 rounded border ${fsmState === 'S1_OPEN_BOX' ? 'bg-saffron-500 border-saffron-400 text-white font-bold animate-pulse' : 'bg-navy-900 border-navy-700 text-slate-300'}`}>
                  S1 OPEN BOX
                </span>
                <span className="text-emerald-400">→</span>

                <span className={`px-2 py-1 rounded border ${fsmState === 'S2_REMOVE_CONTAINER' ? 'bg-saffron-500 border-saffron-400 text-white font-bold animate-pulse' : 'bg-navy-900 border-navy-700 text-slate-300'}`}>
                  S2 REMOVE
                </span>
                <span className="text-emerald-400">→</span>

                <span className={`px-2 py-1 rounded border ${fsmState === 'S3_PLACE_CONTAINER' ? 'bg-saffron-500 border-saffron-400 text-white font-bold animate-pulse' : 'bg-navy-900 border-navy-700 text-slate-300'}`}>
                  S3 RACK
                </span>
                <span className="text-emerald-400">→</span>

                <span className={`px-2 py-1 rounded border ${fsmState === 'COMPLETE' ? 'bg-emerald-600 border-emerald-400 text-white font-bold' : 'bg-navy-900 border-navy-700 text-slate-400'}`}>
                  COMPLETE
                </span>
              </div>

              {/* Error Branch Note */}
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 px-1">
                <span className="text-emerald-600 font-semibold">Green arrows = valid transitions</span>
                <span className="text-red-500 font-semibold">Red dotted = invalid → ERROR</span>
              </div>
            </div>

            {/* PIPELINE LATENCY BREAKDOWN */}
            <div className="pt-2 border-t space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-navy-900 font-bold">
                <span>PIPELINE LATENCY BREAKDOWN</span>
                <span className="text-saffron-600">TOTAL: 36 ms (Parallel Branches)</span>
              </div>

              <div className="grid grid-cols-6 gap-1 font-mono text-[9px] text-center">
                <div className="bg-slate-100 p-1 rounded border">Cam<br/>6 ms</div>
                <div className="bg-blue-100 text-blue-900 p-1 rounded border border-blue-300 font-bold">Obj<br/>12 ms</div>
                <div className="bg-blue-100 text-blue-900 p-1 rounded border border-blue-300 font-bold">Pose<br/>8 ms</div>
                <div className="bg-amber-100 text-amber-900 p-1 rounded border border-amber-300">HOI<br/>3 ms</div>
                <div className="bg-purple-100 text-purple-900 p-1 rounded border border-purple-300">HAR<br/>7 ms</div>
                <div className="bg-emerald-100 text-emerald-900 p-1 rounded border border-emerald-300 font-bold">FSM<br/>1 ms</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PROTOCOL COMPLETION SUMMARY MODAL */}
      {completionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#071B33] border-2 border-emerald-500 text-white rounded-lg shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-navy-800 pb-3">
              <div className="flex items-center space-x-2">
                <CheckCircle2 size={24} className="text-emerald-400" />
                <h3 className="font-bold font-mono text-lg text-white">✓ EXPERIMENT PROTOCOL COMPLETE</h3>
              </div>
              <button 
                onClick={closeCompletionModal}
                className="text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <p className="text-slate-200">
                BOX & CONTAINER EXPERIMENT (BCE-01) has been successfully tracked and verified by the on-device AI system.
              </p>

              <div className="bg-navy-900 p-3 rounded border border-navy-700 space-y-2">
                <div className="flex justify-between border-b border-navy-800 pb-1">
                  <span className="text-slate-400">Steps Completed:</span>
                  <span className="font-bold text-emerald-400">3 / 3</span>
                </div>
                <div className="flex justify-between border-b border-navy-800 pb-1">
                  <span className="text-slate-400">Protocol Integrity:</span>
                  <span className="font-bold text-emerald-400">100%</span>
                </div>
                <div className="flex justify-between border-b border-navy-800 pb-1">
                  <span className="text-slate-400">Average AI Confidence:</span>
                  <span className="font-bold text-saffron-400">96.8%</span>
                </div>
                <div className="flex justify-between border-b border-navy-800 pb-1">
                  <span className="text-slate-400">Protocol Deviations:</span>
                  <span className="font-bold text-white">1 (Resolved: 1)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Mission Duration:</span>
                  <span className="font-bold text-saffron-400">{metFormatted}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button 
                onClick={closeCompletionModal}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded transition-colors font-mono"
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
