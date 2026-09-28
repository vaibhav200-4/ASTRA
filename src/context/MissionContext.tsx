import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { 
  MissionStatus, StepId, FsmState, Language, CameraMode, 
  PoseOrientation, PoseReference, OverlaySettings, DetectionItem, 
  HoiInteraction, TimelineEvent, MissionLogItem, AlertItem 
} from '../types/mission';

import { defaultConfig, type SystemThresholds } from '../config/thresholds';
import { evaluateCausalVerification, type CausalVerificationResult } from '../modules/verification';
import { computeBayesFactor, type BayesFactorData } from '../modules/bayes';
import { combineDempsterShafer, type FusionResult, type SensorMassAssignment } from '../modules/fusion';
import { computeRackFramePose, getInitialTransform, type PoseKeypoint, type TransformMatrix } from '../modules/poseTransform';
import { validateFsmTransition, FSM_NODES, type FsmValidationResult } from '../modules/fsmValidation';
import { generateThermalContinuityData, type PropagationPoint } from '../modules/continuityFilter';
import { runTmrMajorityVote, type TmrVoteResult } from '../modules/radiationTmr';
import { createInitialRingBuffer, stepRingBufferSimulation, type RingBufferState } from '../modules/ringBuffer';
import { getAdaptiveRoiForStep, type RoiState } from '../modules/roiController';
import { playSpatialAudioBeep, speakTtsAlert, setSpatialAudioMuted } from '../modules/spatialAudio';
import { TRACEABILITY_MATRIX, type TraceabilityRow } from '../modules/traceability';
import { defaultEvaluationMetrics, getStressTestChecklist, type EvaluationMetrics, type StressTestItem } from '../modules/evaluation';
import { computePipelineStages, type PipelineStage } from '../modules/pipeline';

export type AppTheme = 'light' | 'dark';

interface MissionContextType {
  // Theme & Global Settings
  theme: AppTheme;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  demoMode: 'SIMULATION' | 'MONITORING';
  setDemoMode: (mode: 'SIMULATION' | 'MONITORING') => void;
  voiceMuted: boolean;
  toggleVoiceMute: () => void;

  // Mission Basic State
  missionStatus: MissionStatus;
  currentStep: StepId;
  completedSteps: number[];
  fsmState: FsmState;
  expectedAction: string;
  observedAction: string;
  deviationAlert: { title: string; detail: string; expected: string; observed: string } | null;
  completionModalOpen: boolean;
  secondsElapsed: number;
  metFormatted: string;
  cameraMode: CameraMode;
  setCameraMode: (cam: CameraMode) => void;
  viewportMode: '2D' | '3D' | 'DUAL';
  setViewportMode: (mode: '2D' | '3D' | 'DUAL') => void;
  isPlaying: boolean;
  togglePlayPause: () => void;
  playbackSpeed: 0.5 | 1 | 2;
  setPlaybackSpeed: (speed: 0.5 | 1 | 2) => void;
  timelineFrame: number;
  setTimelineFrame: (frame: number) => void;
  customVideoUrl: string | null;
  setCustomVideoUrl: (url: string | null) => void;
  overlaySettings: OverlaySettings;
  toggleOverlaySetting: (key: keyof OverlaySettings) => void;

  // Performance Telemetry (Labeled Target / Simulated)
  fps: number;
  latency: number;
  activityConfidence: number;
  poseConfidence: number;
  objectConfidence: number;
  trackingStatus: 'NOMINAL' | 'DEGRADED' | 'LOST';

  // Real Subsystem Modules State & Algorithms
  config: SystemThresholds;
  pipelineStages: PipelineStage[];
  causalResult: CausalVerificationResult;
  bayesData: BayesFactorData;
  bayesHistory: BayesFactorData[];
  fusionResult: FusionResult;
  poseData: { keypoints: PoseKeypoint[]; transform: TransformMatrix };
  poseAngle: number;
  fsmValidationResult: FsmValidationResult;
  thermalThrottlePercent: number;
  continuityData: PropagationPoint[];
  tmrResult: TmrVoteResult<{ stepId: number; fsmState: string }>;
  seuCount: number;
  ringBufferState: RingBufferState;
  roiState: RoiState;
  traceabilityMatrix: TraceabilityRow[];
  evaluationMetrics: EvaluationMetrics;
  stressTestChecklist: StressTestItem[];
  isRtspStreaming: boolean;

  // Logs & Alerts & Detections
  alerts: AlertItem[];
  timelineEvents: TimelineEvent[];
  missionLogs: MissionLogItem[];
  detections: DetectionItem[];
  hoi: HoiInteraction;

  // Action Triggers
  startMission: () => void;
  pauseMission: () => void;
  stopMission: () => void;
  resetMission: () => void;

  // Simulation Controls
  performCorrectStep: () => void;
  performWrongStep: () => void;
  skipCurrentStep: () => void;
  triggerObjectLost: () => void;
  triggerLowConfidence: () => void;
  recoverTracking: () => void;
  triggerHandNearObjectNoStateChange: () => void;
  triggerSensorDisagreement: () => void;
  randomizeOrientation: () => void;
  resetOrientation: () => void;
  setThermalThrottlePercent: (val: number) => void;
  injectBitFlip: () => void;
  setBayesFactorKThreshold: (k: number) => void;
  setDempsterShaferConflictLimit: (limit: number) => void;
  triggerSpatialBeepForMisplacedTool: () => void;
  toggleRtspStream: () => void;
  loadCustomMetricsJson: (jsonString: string) => void;

  acknowledgeDeviation: () => void;
  closeCompletionModal: () => void;
  resolveAlert: (id: string) => void;
  clearAllAlerts: () => void;
}

const initialDetections: DetectionItem[] = [
  { id: 'det-1', name: 'ASTRONAUT', confidence: 98.4, bbox: [22, 12, 54, 82], color: '#123F8C', status: 'TRACKED' },
  { id: 'det-2', name: 'RED BOX', confidence: 97.1, bbox: [48, 52, 22, 28], color: '#C62828', status: 'OPEN' },
  { id: 'det-3', name: 'YELLOW CONTAINER', confidence: 95.8, bbox: [54, 46, 14, 18], color: '#F26B21', status: 'IN_HAND' },
  { id: 'det-4', name: 'PAYLOAD RACK', confidence: 99.0, bbox: [5, 5, 90, 90], color: '#0B2A5B', status: 'STABLE' },
];

const initialHoi: HoiInteraction = {
  source: 'RIGHT HAND',
  target: 'YELLOW CONTAINER',
  contactConfidence: 93.6,
  motion: 'DETECTED',
  interactionType: 'GRASPING'
};

const initialRawSources: SensorMassAssignment[] = [
  { id: 'detector', name: 'Object Detector (YOLO26n)', mStep: 0.85, mAnomaly: 0.10, mUncertain: 0.05, status: 'NOMINAL', isIncluded: true },
  { id: 'pose', name: 'Rack-relative Pose Engine', mStep: 0.82, mAnomaly: 0.12, mUncertain: 0.06, status: 'NOMINAL', isIncluded: true },
  { id: 'hoi', name: 'Hand-Object Interaction', mStep: 0.88, mAnomaly: 0.08, mUncertain: 0.04, status: 'NOMINAL', isIncluded: true },
];

const initialLogs: MissionLogItem[] = [
  { eventId: 'EVT-0010', utcTime: '10:41:02 UTC', met: '00:00:02', module: 'SYSTEM', event: 'ASTRA-PVT initialization complete (ISRO • Department of Space)', confidence: 100, fsmState: 'S0_READY', status: 'NORMAL' },
  { eventId: 'EVT-0015', utcTime: '10:41:05 UTC', met: '00:00:05', module: 'CAMERA', event: 'Rack Cam 01 video stream synchronized', confidence: 99.9, fsmState: 'S0_READY', status: 'NORMAL' },
  { eventId: 'EVT-0022', utcTime: '10:41:12 UTC', met: '00:00:12', module: 'PERCEPTION', event: 'Astronaut detected (98.4%), Payload rack fiducial locked', confidence: 98.4, fsmState: 'S0_READY', status: 'NORMAL' },
  { eventId: 'EVT-0034', utcTime: '10:41:24 UTC', met: '00:00:24', module: 'FSM', event: 'Step 01 started: Open Red Box', confidence: 97.5, fsmState: 'S1_OPEN_BOX', status: 'ACTIVE' },
  { eventId: 'EVT-0041', utcTime: '10:41:40 UTC', met: '00:00:40', module: 'VERIFICATION', event: 'Step 01 verified (Red box lid displacement confirmed)', confidence: 97.2, fsmState: 'S1_OPEN_BOX', status: 'SUCCESS' },
  { eventId: 'EVT-0052', utcTime: '10:42:01 UTC', met: '00:01:01', module: 'HOI', event: 'Hand-object contact detected: Right Hand → Yellow Container', confidence: 93.6, fsmState: 'S2_REMOVE_CONTAINER', status: 'ACTIVE' },
];

const initialTimeline: TimelineEvent[] = [
  { id: 'tl-1', timestamp: '10:41:02', met: '00:00:02', type: 'SYSTEM', title: 'MISSION INITIALIZED', description: 'Edge AI engine online on Jetson-class platform (emulated). DO-178C-aligned traceability.', level: 'info' },
  { id: 'tl-2', timestamp: '10:41:12', met: '00:00:12', type: 'AI', title: 'ASTRONAUT POSE TRACKED', description: 'Pose keypoints locked relative to payload rack axes (J_rack).', level: 'info' },
  { id: 'tl-3', timestamp: '10:41:40', met: '00:00:40', type: 'PROTOCOL', title: 'STEP 01 VERIFIED', description: 'Causal verification 3/3 evidence pass. Lid opening confirmed.', level: 'success' },
  { id: 'tl-4', timestamp: '10:42:01', met: '00:01:01', type: 'AI', title: 'HOI CONTACT DETECTED', description: 'Right hand grasp vector aligned with yellow container bounding box.', level: 'info' },
];

const initialAlerts: AlertItem[] = [
  { id: 'alt-1', met: '00:00:02', timestamp: '10:41:02', category: 'SYSTEM', title: 'EDGE NODE ONLINE', detail: 'Processing mode strictly local offline. Zero external API dependency.', resolved: true },
  { id: 'alt-2', met: '00:00:15', timestamp: '10:41:15', category: 'INFO', title: 'PROTOCOL LOADED', detail: 'Box & Container Experiment (BCE-01) state machine ready.', resolved: true },
];

const MissionContext = createContext<MissionContextType | undefined>(undefined);

export const MissionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<AppTheme>('light');
  const [language, setLanguage] = useState<Language>('en');
  const [demoMode, setDemoMode] = useState<'SIMULATION' | 'MONITORING'>('SIMULATION');
  const [voiceMuted, setVoiceMutedState] = useState<boolean>(false);

  // Mission State
  const [missionStatus, setMissionStatus] = useState<MissionStatus>('ACTIVE');
  const [currentStep, setCurrentStep] = useState<StepId>(2);
  const [completedSteps, setCompletedSteps] = useState<number[]>([1]);
  const [fsmState, setFsmState] = useState<FsmState>('S2_REMOVE_CONTAINER');
  const [expectedAction, setExpectedAction] = useState<string>('Remove the yellow container from the red experiment box');
  const [observedAction, setObservedAction] = useState<string>('Hand grasp yellow container detected (96.4%)');
  const [deviationAlert, setDeviationAlert] = useState<{ title: string; detail: string; expected: string; observed: string } | null>(null);
  const [completionModalOpen, setCompletionModalOpen] = useState<boolean>(false);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(261);

  const [cameraMode, setCameraMode] = useState<CameraMode>('CAM-01');
  const [viewportMode, setViewportMode] = useState<'2D' | '3D' | 'DUAL'>('2D');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<0.5 | 1 | 2>(1);
  const [timelineFrame, setTimelineFrame] = useState<number>(142);
  const [customVideoUrl, setCustomVideoUrl] = useState<string | null>(null);
  const [overlaySettings, setOverlaySettings] = useState<OverlaySettings>({
    boundingBoxes: true,
    skeleton: true,
    hoiLines: true,
    labels: true,
    confidence: true,
    roi: true,
    rackAxes: true,
    heatmap: false,
  });

  const togglePlayPause = () => setIsPlaying(prev => !prev);

  // Telemetry (Target / Simulated)
  const [fps, setFps] = useState<number>(23.8);
  const [latency, setLatency] = useState<number>(41);
  const [activityConfidence, setActivityConfidence] = useState<number>(96.4);
  const [poseConfidence, setPoseConfidence] = useState<number>(96.2);
  const [objectConfidence, setObjectConfidence] = useState<number>(97.1);
  const [trackingStatus, setTrackingStatus] = useState<'NOMINAL' | 'DEGRADED' | 'LOST'>('NOMINAL');

  // Subsystem Modules
  const [config, setConfig] = useState<SystemThresholds>(defaultConfig);
  const [causalResult, setCausalResult] = useState<CausalVerificationResult>(evaluateCausalVerification(true, true, true));
  const [bayesData, setBayesData] = useState<BayesFactorData>(computeBayesFactor(0.96, 0.02, defaultConfig.bayesFactorKThreshold));
  const [bayesHistory, setBayesHistory] = useState<BayesFactorData[]>([
    computeBayesFactor(0.90, 0.05, defaultConfig.bayesFactorKThreshold),
    computeBayesFactor(0.94, 0.03, defaultConfig.bayesFactorKThreshold),
    computeBayesFactor(0.96, 0.02, defaultConfig.bayesFactorKThreshold),
  ]);

  const [sensorDisagreement, setSensorDisagreement] = useState<boolean>(false);
  const [fusionResult, setFusionResult] = useState<FusionResult>(combineDempsterShafer(initialRawSources, defaultConfig.dempsterShaferConflictLimit, false));

  const [poseAngle, setPoseAngle] = useState<number>(0);
  const [poseData, setPoseData] = useState(computeRackFramePose(getInitialTransform(), 0));

  const [fsmValidationResult, setFsmValidationResult] = useState<FsmValidationResult>(validateFsmTransition('S1_OPEN_BOX', 'S2_REMOVE_CONTAINER'));

  const [thermalThrottlePercent, setThermalThrottlePercentState] = useState<number>(0);
  const [continuityData, setContinuityData] = useState<PropagationPoint[]>(generateThermalContinuityData(0));

  const [seuCount, setSeuCount] = useState<number>(0);
  const [tmrResult, setTmrResult] = useState<TmrVoteResult<{ stepId: number; fsmState: string }>>(
    runTmrMajorityVote({ stepId: 2, fsmState: 'S2_REMOVE_CONTAINER' }, { stepId: 2, fsmState: 'S2_REMOVE_CONTAINER' }, { stepId: 2, fsmState: 'S2_REMOVE_CONTAINER' }, 0, null)
  );

  const [ringBufferState, setRingBufferState] = useState<RingBufferState>(createInitialRingBuffer(16));
  const [roiState, setRoiState] = useState<RoiState>(getAdaptiveRoiForStep(2, defaultConfig.roiPaddingMarginPercent));

  const [traceabilityMatrix] = useState<TraceabilityRow[]>(TRACEABILITY_MATRIX);
  const [evaluationMetrics, setEvaluationMetrics] = useState<EvaluationMetrics>(defaultEvaluationMetrics);
  const [isRtspStreaming, setIsRtspStreaming] = useState<boolean>(false);

  const [alerts, setAlerts] = useState<AlertItem[]>(initialAlerts);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(initialTimeline);
  const [missionLogs, setMissionLogs] = useState<MissionLogItem[]>(initialLogs);
  const [detections, setDetections] = useState<DetectionItem[]>(initialDetections);
  const [hoi, setHoi] = useState<HoiInteraction>(initialHoi);

  // Compute live pipeline strip state
  const pipelineStages = computePipelineStages({
    fps,
    overallLatency: latency,
    causalAccepted: causalResult.accepted,
    causalReason: causalResult.rejectionReason,
    sensorConflict: fusionResult.conflictExceeded,
    isolatedSource: fusionResult.isolatedSourceId,
    fsmState,
    thermalThrottle: thermalThrottlePercent,
  });

  // Sync dark class on document element
  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Main Simulation Loop Ticker
  useEffect(() => {
    let timer: any;
    if (missionStatus === 'ACTIVE') {
      timer = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);

        // Update Ring Buffer simulation step
        setRingBufferState(prev => stepRingBufferSimulation(prev, Math.round(24 - (thermalThrottlePercent / 100) * 16)));

        // Micro-jitter for FPS & Latency
        const effectiveFps = +(23.5 - (thermalThrottlePercent / 100) * 15.5 + Math.random() * 0.8).toFixed(1);
        const effectiveLatency = Math.floor(39 + (thermalThrottlePercent / 100) * 35 + Math.random() * 5);

        setFps(effectiveFps);
        setLatency(effectiveLatency);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [missionStatus, thermalThrottlePercent]);

  // Format MET
  const metFormatted = (() => {
    const hrs = Math.floor(secondsElapsed / 3600).toString().padStart(2, '0');
    const mins = Math.floor((secondsElapsed % 3600) / 60).toString().padStart(2, '0');
    const secs = (secondsElapsed % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  })();

  const getUtcTimestamp = () => {
    return new Date().toTimeString().split(' ')[0] + ' UTC';
  };

  const toggleOverlaySetting = (key: keyof OverlaySettings) => {
    setOverlaySettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleVoiceMute = () => {
    const next = !voiceMuted;
    setVoiceMutedState(next);
    setSpatialAudioMuted(next);
  };

  // Controls
  const startMission = () => {
    setMissionStatus('ACTIVE');
    speakTtsAlert("Mission console active. Monitoring protocol sequence.", language);
  };

  const pauseMission = () => {
    setMissionStatus('PAUSED');
  };

  const stopMission = () => {
    setMissionStatus('IDLE');
  };

  const resetMission = () => {
    setMissionStatus('IDLE');
    setCurrentStep(1);
    setCompletedSteps([]);
    setFsmState('S1_OPEN_BOX');
    setExpectedAction("Open the red experiment box lid");
    setObservedAction("Lid static");
    setSecondsElapsed(0);
    setDeviationAlert(null);
    setCompletionModalOpen(false);
    setTrackingStatus('NOMINAL');
    setActivityConfidence(95.0);
    setSensorDisagreement(false);
    setCausalResult(evaluateCausalVerification(true, true, true));
    setFusionResult(combineDempsterShafer(initialRawSources, config.dempsterShaferConflictLimit, false));
    setRoiState(getAdaptiveRoiForStep(1, config.roiPaddingMarginPercent));
    speakTtsAlert("Mission reset to Step One. Ready to begin.", language);
  };

  // SIMULATION ACTIONS
  const performCorrectStep = () => {
    const utc = getUtcTimestamp();
    const met = metFormatted;

    // Reset any failure states
    setCausalResult(evaluateCausalVerification(true, true, true));
    setSensorDisagreement(false);
    setFusionResult(combineDempsterShafer(initialRawSources, config.dempsterShaferConflictLimit, false));

    if (currentStep === 0 || currentStep === 1) {
      setCurrentStep(2);
      setCompletedSteps([1]);
      setFsmState('S2_REMOVE_CONTAINER');
      setExpectedAction("Remove the yellow container from the red experiment box");
      setObservedAction("Step 01 Verified: Red box lid open detected (97.2%)");
      setActivityConfidence(96.4);
      setFsmValidationResult(validateFsmTransition('S1_OPEN_BOX', 'S2_REMOVE_CONTAINER'));
      setRoiState(getAdaptiveRoiForStep(2, config.roiPaddingMarginPercent));

      const newBayes = computeBayesFactor(0.96, 0.02, config.bayesFactorKThreshold);
      setBayesData(newBayes);
      setBayesHistory(prev => [...prev.slice(-9), newBayes]);

      const newLog: MissionLogItem = {
        eventId: `EVT-00${Math.floor(60 + Math.random() * 20)}`,
        utcTime: utc,
        met,
        module: 'VERIFICATION',
        event: 'Step 01 verified: Open Red Box complete (Causal 3/3 Pass, BF K=48.0)',
        confidence: 97.2,
        fsmState: 'S1→S2',
        status: 'SUCCESS'
      };
      setMissionLogs(prev => [newLog, ...prev]);

      const newTl: TimelineEvent = {
        id: `tl-${Date.now()}`,
        timestamp: utc.split(' ')[0],
        met,
        type: 'PROTOCOL',
        title: 'STEP 01 VERIFIED',
        description: 'Red box opening verified by physical state change. Advancing to Step 02.',
        level: 'success'
      };
      setTimelineEvents(prev => [newTl, ...prev]);

      speakTtsAlert(language === 'hi' ? "चरण एक सत्यापित। पीला कंटेनर निकालें।" : "Step one verified. Remove the yellow container.", language);

    } else if (currentStep === 2) {
      setCurrentStep(3);
      setCompletedSteps([1, 2]);
      setFsmState('S3_PLACE_CONTAINER');
      setExpectedAction("Place the yellow container securely in the payload rack slot");
      setObservedAction("Step 02 Verified: Container removed from box (96.4%)");
      setActivityConfidence(95.8);
      setFsmValidationResult(validateFsmTransition('S2_REMOVE_CONTAINER', 'S3_PLACE_CONTAINER'));
      setRoiState(getAdaptiveRoiForStep(3, config.roiPaddingMarginPercent));

      const newBayes = computeBayesFactor(0.98, 0.01, config.bayesFactorKThreshold);
      setBayesData(newBayes);
      setBayesHistory(prev => [...prev.slice(-9), newBayes]);

      const newLog: MissionLogItem = {
        eventId: `EVT-00${Math.floor(80 + Math.random() * 20)}`,
        utcTime: utc,
        met,
        module: 'VERIFICATION',
        event: 'Step 02 verified: Remove Yellow Container complete (Causal 3/3 Pass, BF K=98.0)',
        confidence: 96.4,
        fsmState: 'S2→S3',
        status: 'SUCCESS'
      };
      setMissionLogs(prev => [newLog, ...prev]);

      const newTl: TimelineEvent = {
        id: `tl-${Date.now()}`,
        timestamp: utc.split(' ')[0],
        met,
        type: 'PROTOCOL',
        title: 'STEP 02 VERIFIED',
        description: 'Yellow container removal confirmed by rack-relative pose shift.',
        level: 'success'
      };
      setTimelineEvents(prev => [newTl, ...prev]);

      speakTtsAlert(language === 'hi' ? "चरण दो सत्यापित। कंटेनर को रैड में रखें।" : "Step two verified. Place the container in the rack.", language);

    } else if (currentStep === 3) {
      setCompletedSteps([1, 2, 3]);
      setFsmState('COMPLETE');
      setMissionStatus('COMPLETED');
      setExpectedAction("Protocol execution complete");
      setObservedAction("Container locked in rack slot (99.1%)");
      setCompletionModalOpen(true);
      setFsmValidationResult(validateFsmTransition('S3_PLACE_CONTAINER', 'COMPLETE'));

      const newLog: MissionLogItem = {
        eventId: `EVT-0100`,
        utcTime: utc,
        met,
        module: 'FSM',
        event: 'Protocol execution complete: 100% sequence verified (ISRO BAS-01)',
        confidence: 98.8,
        fsmState: 'COMPLETE',
        status: 'SUCCESS'
      };
      setMissionLogs(prev => [newLog, ...prev]);

      speakTtsAlert(language === 'hi' ? "प्रयोग प्रोटोकॉल पूर्ण।" : "Experiment protocol complete.", language);
    }
  };

  const performWrongStep = () => {
    const utc = getUtcTimestamp();
    const met = metFormatted;

    setFsmState('ERROR');
    setMissionStatus('CRITICAL');
    setFsmValidationResult(validateFsmTransition('S2_REMOVE_CONTAINER', 'S3_PLACE_CONTAINER'));

    const title = "PROTOCOL DEVIATION DETECTED";
    const detail = "Observed astronaut action violates finite state machine transition rules.";
    const exp = "Remove Yellow Container (Step 02)";
    const obs = "Place Container in Rack (Attempted Step 03 prematurely)";

    setDeviationAlert({ title, detail, expected: exp, observed: obs });

    const newAlert: AlertItem = {
      id: `alt-${Date.now()}`,
      met,
      timestamp: utc,
      category: 'CRITICAL',
      title: 'PROTOCOL DEVIATION',
      detail: `${obs} when expected ${exp}`,
      resolved: false
    };
    setAlerts(prev => [newAlert, ...prev]);

    speakTtsAlert("Warning. Incorrect procedure detected. Return to Step Two.", language);
  };

  const skipCurrentStep = () => {
    const utc = getUtcTimestamp();
    const met = metFormatted;

    setFsmState('ERROR');
    setMissionStatus('CRITICAL');
    setFsmValidationResult(validateFsmTransition('S1_OPEN_BOX', 'S3_PLACE_CONTAINER'));

    const title = "SEQUENCE VIOLATION DETECTED";
    const detail = "Attempted step skip. Jumped from Step 1 to Step 3 without container removal.";
    const exp = "Complete Step 02 (Remove Yellow Container)";
    const obs = "Attempted Step 03 jump without Step 02 validation";

    setDeviationAlert({ title, detail, expected: exp, observed: obs });

    const newAlert: AlertItem = {
      id: `alt-${Date.now()}`,
      met,
      timestamp: utc,
      category: 'CRITICAL',
      title: 'SEQUENCE VIOLATION',
      detail,
      resolved: false
    };
    setAlerts(prev => [newAlert, ...prev]);

    speakTtsAlert("Sequence violation. Previous required step has not been completed.", language);
  };

  const triggerObjectLost = () => {
    const utc = getUtcTimestamp();
    const met = metFormatted;

    setTrackingStatus('LOST');
    setMissionStatus('DEGRADED');

    const newAlert: AlertItem = {
      id: `alt-${Date.now()}`,
      met,
      timestamp: utc,
      category: 'WARNING',
      title: 'TRACKING LOST',
      detail: 'Yellow container temporarily occluded in rack camera view.',
      resolved: false
    };
    setAlerts(prev => [newAlert, ...prev]);

    speakTtsAlert("Tracking temporarily lost. Please remain within camera field of view.", language);
  };

  const triggerLowConfidence = () => {
    setActivityConfidence(62.4);
    setObservedAction("Activity confidence below threshold (62.4% < 85.0%)");
    const utc = getUtcTimestamp();
    const met = metFormatted;

    const newAlert: AlertItem = {
      id: `alt-${Date.now()}`,
      met,
      timestamp: utc,
      category: 'WARNING',
      title: 'LOW CONFIDENCE EVENT',
      detail: 'Activity confidence 62.4%. System awaiting causal confirmation.',
      resolved: false
    };
    setAlerts(prev => [newAlert, ...prev]);

    speakTtsAlert("Low confidence event. Awaiting visual confirmation.", language);
  };

  const recoverTracking = () => {
    setTrackingStatus('NOMINAL');
    setMissionStatus('ACTIVE');
    setActivityConfidence(96.4);
    setObservedAction("Right hand grasp container verified (96.4%)");
    setCausalResult(evaluateCausalVerification(true, true, true));
    setSensorDisagreement(false);
    setFusionResult(combineDempsterShafer(initialRawSources, config.dempsterShaferConflictLimit, false));

    speakTtsAlert("Tracking active. Protocol validation resumed.", language);
  };

  // PART 2 A: Hand Near Object No State Change Simulation
  const triggerHandNearObjectNoStateChange = () => {
    const utc = getUtcTimestamp();
    const met = metFormatted;

    const rejectedCausal = evaluateCausalVerification(true, false, true, true, "Action seen, expected state change NOT observed");
    setCausalResult(rejectedCausal);

    const newBayes = computeBayesFactor(0.12, 0.85, config.bayesFactorKThreshold);
    setBayesData(newBayes);
    setBayesHistory(prev => [...prev.slice(-9), newBayes]);

    setObservedAction("REJECTED: Hand near object, expected state change NOT observed");

    const newAlert: AlertItem = {
      id: `alt-${Date.now()}`,
      met,
      timestamp: utc,
      category: 'WARNING',
      title: 'CAUSAL VERIFICATION REJECTED',
      detail: 'Action seen, expected state change NOT observed (Hand near object without displacement).',
      resolved: false
    };
    setAlerts(prev => [newAlert, ...prev]);

    const newLog: MissionLogItem = {
      eventId: `EVT-00${Math.floor(70 + Math.random() * 20)}`,
      utcTime: utc,
      met,
      module: 'VERIFICATION',
      event: 'Step REJECTED: Action seen, expected state change NOT observed (BF K=0.14)',
      confidence: 14.0,
      fsmState: fsmState,
      status: 'CRITICAL'
    };
    setMissionLogs(prev => [newLog, ...prev]);

    speakTtsAlert("Step rejected. Action seen, expected state change NOT observed.", language);
  };

  // PART 2 C: Inject Sensor Disagreement
  const triggerSensorDisagreement = () => {
    const utc = getUtcTimestamp();
    const met = metFormatted;

    setSensorDisagreement(true);
    const fused = combineDempsterShafer(initialRawSources, config.dempsterShaferConflictLimit, true);
    setFusionResult(fused);

    const newAlert: AlertItem = {
      id: `alt-${Date.now()}`,
      met,
      timestamp: utc,
      category: 'WARNING',
      title: 'SENSOR DISAGREEMENT ISOLATED',
      detail: `Dempster-Shafer K_conflict = ${fused.kConflict} > limit. Offending source (${fused.isolatedSourceId || 'HOI'}) ISOLATED.`,
      resolved: false
    };
    setAlerts(prev => [newAlert, ...prev]);

    speakTtsAlert("Sensor conflict detected. Offending sensor isolated from Dempster-Shafer fusion.", language);
  };

  // PART 2 D: Randomize Astronaut Orientation
  const randomizeOrientation = () => {
    const nextAngle = (poseAngle + 90) % 360;
    setPoseAngle(nextAngle);
    setPoseData(computeRackFramePose(getInitialTransform(), nextAngle));
  };

  const resetOrientation = () => {
    setPoseAngle(0);
    setPoseData(computeRackFramePose(getInitialTransform(), 0));
  };

  // PART 2 F: Thermal Throttle Slider
  const setThermalThrottlePercent = (val: number) => {
    setThermalThrottlePercentState(val);
    setContinuityData(generateThermalContinuityData(val));
  };

  // PART 2 G: Inject Bit-Flip
  const injectBitFlip = () => {
    const utc = getUtcTimestamp();
    const met = metFormatted;

    const corruptedCopy = (seuCount % 3) + 1;
    const res = runTmrMajorityVote({ stepId: currentStep, fsmState }, { stepId: currentStep, fsmState }, { stepId: currentStep, fsmState }, seuCount, corruptedCopy);

    setSeuCount(res.seusCorrectedCount);
    setTmrResult(res);

    const newAlert: AlertItem = {
      id: `alt-${Date.now()}`,
      met,
      timestamp: utc,
      category: 'SYSTEM',
      title: 'RADIATION SEU CORRECTED (TMR)',
      detail: res.logMessage,
      resolved: false
    };
    setAlerts(prev => [newAlert, ...prev]);

    const newLog: MissionLogItem = {
      eventId: `EVT-00${Math.floor(90 + Math.random() * 10)}`,
      utcTime: utc,
      met,
      module: 'RELIABILITY',
      event: `Bit-flip detected in SRAM Copy ${corruptedCopy}. TMR 2-vs-1 vote restored state & scrubbed memory.`,
      confidence: 100,
      fsmState,
      status: 'NORMAL'
    };
    setMissionLogs(prev => [newLog, ...prev]);
  };

  // PART 2 B: Threshold Sliders
  const setBayesFactorKThreshold = (k: number) => {
    const newConfig = { ...config, bayesFactorKThreshold: k };
    setConfig(newConfig);
    setBayesData(computeBayesFactor(bayesData.pNormal, bayesData.pAnomaly, k));
  };

  const setDempsterShaferConflictLimit = (limit: number) => {
    const newConfig = { ...config, dempsterShaferConflictLimit: limit };
    setConfig(newConfig);
    setFusionResult(combineDempsterShafer(initialRawSources, limit, sensorDisagreement));
  };

  // PART 2 J: Spatial Audio Trigger for Misplaced Tool
  const triggerSpatialBeepForMisplacedTool = () => {
    playSpatialAudioBeep(0.85, 0.20, -0.40);
    speakTtsAlert(language === 'hi' ? "चेतावनी: उपकरण गलत स्थान पर रखा गया है।" : "Warning: Misplaced tool detected at right rear quadrant.", language);
  };

  // PART 2 M: Toggle RTSP Streaming status
  const toggleRtspStream = () => {
    setIsRtspStreaming(prev => !prev);
  };

  // PART 2 L: Load Custom Metrics JSON
  const loadCustomMetricsJson = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.perStepMetrics) {
        setEvaluationMetrics({ ...parsed, isSimulatedData: false });
        speakTtsAlert("Custom evaluation JSON loaded successfully.", language);
      }
    } catch (e) {
      alert("Invalid JSON format");
    }
  };

  const acknowledgeDeviation = () => {
    setDeviationAlert(null);
    setFsmState(currentStep === 1 ? 'S1_OPEN_BOX' : currentStep === 2 ? 'S2_REMOVE_CONTAINER' : 'S3_PLACE_CONTAINER');
    setMissionStatus('ACTIVE');
    setAlerts(prev => prev.map(a => a.category === 'CRITICAL' ? { ...a, resolved: true } : a));
    speakTtsAlert("Deviation acknowledged. Resume step procedure.", language);
  };

  const closeCompletionModal = () => setCompletionModalOpen(false);
  const resolveAlert = (id: string) => setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
  const clearAllAlerts = () => setAlerts(prev => prev.map(a => ({ ...a, resolved: true })));

  const stressTestChecklist = getStressTestChecklist({
    poseAngle,
    trackingStatus,
    thermalThrottle: thermalThrottlePercent,
    sensorDisagreement,
    seuCount
  });

  return (
    <MissionContext.Provider value={{
      theme, toggleTheme, language, setLanguage, demoMode, setDemoMode, voiceMuted, toggleVoiceMute,
      missionStatus, currentStep, completedSteps, fsmState, expectedAction, observedAction,
      deviationAlert, completionModalOpen, secondsElapsed, metFormatted, cameraMode, setCameraMode,
      viewportMode, setViewportMode, isPlaying, togglePlayPause, playbackSpeed, setPlaybackSpeed,
      timelineFrame, setTimelineFrame, customVideoUrl, setCustomVideoUrl, overlaySettings, toggleOverlaySetting,
      fps, latency, activityConfidence, poseConfidence, objectConfidence, trackingStatus,
      config, pipelineStages, causalResult, bayesData, bayesHistory, fusionResult, poseData, poseAngle,
      fsmValidationResult, thermalThrottlePercent, continuityData, tmrResult, seuCount, ringBufferState,
      roiState, traceabilityMatrix, evaluationMetrics, stressTestChecklist, isRtspStreaming,
      alerts, timelineEvents, missionLogs, detections, hoi,
      startMission, pauseMission, stopMission, resetMission,
      performCorrectStep, performWrongStep, skipCurrentStep, triggerObjectLost, triggerLowConfidence,
      recoverTracking, triggerHandNearObjectNoStateChange, triggerSensorDisagreement, randomizeOrientation,
      resetOrientation, setThermalThrottlePercent, injectBitFlip, setBayesFactorKThreshold,
      setDempsterShaferConflictLimit, triggerSpatialBeepForMisplacedTool, toggleRtspStream,
      loadCustomMetricsJson, acknowledgeDeviation, closeCompletionModal, resolveAlert, clearAllAlerts
    }}>
      {children}
    </MissionContext.Provider>
  );
};

export const useMission = () => {
  const ctx = useContext(MissionContext);
  if (!ctx) throw new Error('useMission must be used within a MissionProvider');
  return ctx;
};
