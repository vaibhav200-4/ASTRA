import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { 
  MissionStatus, StepId, FsmState, Language, CameraMode, 
  PoseOrientation, PoseReference, OverlaySettings, DetectionItem, 
  HoiInteraction, TimelineEvent, MissionLogItem, AlertItem 
} from '../types/mission';
import { speakGuidance, setVoiceMuted as setSpeechMuted } from '../utils/speech';

interface MissionContextType {
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
  language: Language;
  demoMode: 'SIMULATION' | 'MONITORING';
  cameraMode: CameraMode;
  customVideoUrl: string | null;
  overlaySettings: OverlaySettings;
  poseOrientation: PoseOrientation;
  poseReference: PoseReference;
  voiceMuted: boolean;
  alerts: AlertItem[];
  timelineEvents: TimelineEvent[];
  missionLogs: MissionLogItem[];
  detections: DetectionItem[];
  hoi: HoiInteraction;
  activityConfidence: number;
  poseConfidence: number;
  objectConfidence: number;
  fps: number;
  latency: number;
  trackingStatus: 'NOMINAL' | 'DEGRADED' | 'LOST';
  
  // Actions
  setLanguage: (lang: Language) => void;
  setDemoMode: (mode: 'SIMULATION' | 'MONITORING') => void;
  setCameraMode: (cam: CameraMode) => void;
  setCustomVideoUrl: (url: string | null) => void;
  setPoseOrientation: (orientation: PoseOrientation) => void;
  setPoseReference: (ref: PoseReference) => void;
  toggleOverlaySetting: (key: keyof OverlaySettings) => void;
  toggleVoiceMute: () => void;
  
  startMission: () => void;
  pauseMission: () => void;
  stopMission: () => void;
  resetMission: () => void;
  
  performCorrectStep: () => void;
  performWrongStep: () => void;
  skipCurrentStep: () => void;
  triggerObjectLost: () => void;
  triggerLowConfidence: () => void;
  recoverTracking: () => void;
  acknowledgeDeviation: () => void;
  closeCompletionModal: () => void;
  resolveAlert: (id: string) => void;
  clearAllAlerts: () => void;
}

const initialDetections: DetectionItem[] = [
  { id: 'det-1', name: 'ASTRONAUT', confidence: 98.4, bbox: [22, 12, 54, 82], color: '#2878C8', status: 'TRACKED' },
  { id: 'det-2', name: 'RED BOX', confidence: 97.1, bbox: [48, 52, 22, 28], color: '#D32F2F', status: 'OPEN' },
  { id: 'det-3', name: 'YELLOW CONTAINER', confidence: 95.8, bbox: [54, 46, 14, 18], color: '#F58220', status: 'IN_HAND' },
  { id: 'det-4', name: 'PAYLOAD RACK', confidence: 99.0, bbox: [5, 5, 90, 90], color: '#174EA6', status: 'STABLE' },
];

const initialHoi: HoiInteraction = {
  source: 'RIGHT HAND',
  target: 'YELLOW CONTAINER',
  contactConfidence: 93.6,
  motion: 'DETECTED',
  interactionType: 'GRASPING'
};

const initialLogs: MissionLogItem[] = [
  { eventId: 'EVT-0010', utcTime: '10:41:02 UTC', met: '00:00:02', module: 'SYSTEM', event: 'Mission initialization complete', confidence: 100, fsmState: 'S0_READY', status: 'NORMAL' },
  { eventId: 'EVT-0015', utcTime: '10:41:05 UTC', met: '00:00:05', module: 'CAMERA', event: 'Rack Cam 01 video stream synchronized', confidence: 99.9, fsmState: 'S0_READY', status: 'NORMAL' },
  { eventId: 'EVT-0022', utcTime: '10:41:12 UTC', met: '00:00:12', module: 'OBJECT_DETECTION', event: 'Astronaut detected (98.4%), Payload rack initialized', confidence: 98.4, fsmState: 'S0_READY', status: 'NORMAL' },
  { eventId: 'EVT-0034', utcTime: '10:41:24 UTC', met: '00:00:24', module: 'FSM', event: 'Step 01 started: Open Red Box', confidence: 97.5, fsmState: 'S1_OPEN_BOX', status: 'ACTIVE' },
  { eventId: 'EVT-0041', utcTime: '10:41:40 UTC', met: '00:00:40', module: 'FSM', event: 'Step 01 verified (Red box lid movement detected)', confidence: 97.2, fsmState: 'S1_OPEN_BOX', status: 'SUCCESS' },
  { eventId: 'EVT-0052', utcTime: '10:42:01 UTC', met: '00:01:01', module: 'HOI', event: 'Hand-object contact detected: Right Hand → Yellow Container', confidence: 93.6, fsmState: 'S2_REMOVE_CONTAINER', status: 'ACTIVE' },
];

const initialTimeline: TimelineEvent[] = [
  { id: 'tl-1', timestamp: '10:41:02', met: '00:00:02', type: 'SYSTEM', title: 'MISSION INITIALIZED', description: 'Edge AI inference engine online. Jetson Xavier NX nominal.', level: 'info' },
  { id: 'tl-2', timestamp: '10:41:12', met: '00:00:12', type: 'AI', title: 'ASTRONAUT POSE TRACKED', description: '33 3D keypoints locked relative to payload rack axes.', level: 'info' },
  { id: 'tl-3', timestamp: '10:41:40', met: '00:00:40', type: 'PROTOCOL', title: 'STEP 01 VERIFIED', description: 'Red experiment box lid open sequence verified by temporal model.', level: 'success' },
  { id: 'tl-4', timestamp: '10:42:01', met: '00:01:01', type: 'AI', title: 'HOI CONTACT DETECTED', description: 'Right hand grasp vector aligned with yellow container bounding box.', level: 'info' },
];

const initialAlerts: AlertItem[] = [
  { id: 'alt-1', met: '00:00:02', timestamp: '10:41:02', category: 'SYSTEM', title: 'EDGE NODE ONLINE', detail: 'Processing mode strictly local offline. Cloud dependency zero.', resolved: true },
  { id: 'alt-2', met: '00:00:15', timestamp: '10:41:15', category: 'INFO', title: 'PROTOCOL LOADED', detail: 'Box & Container Experiment (BCE-01) state machine ready.', resolved: true },
];

const MissionContext = createContext<MissionContextType | undefined>(undefined);

export const MissionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [missionStatus, setMissionStatus] = useState<MissionStatus>('ACTIVE');
  const [currentStep, setCurrentStep] = useState<StepId>(2); // Step 2 ACTIVE by default for demonstration
  const [completedSteps, setCompletedSteps] = useState<number[]>([1]);
  const [fsmState, setFsmState] = useState<FsmState>('S2_REMOVE_CONTAINER');
  const [expectedAction, setExpectedAction] = useState<string>('Remove the yellow container from the red experiment box');
  const [observedAction, setObservedAction] = useState<string>('Hand grasp yellow container detected (96.4%)');
  const [deviationAlert, setDeviationAlert] = useState<{ title: string; detail: string; expected: string; observed: string } | null>(null);
  const [completionModalOpen, setCompletionModalOpen] = useState<boolean>(false);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(261); // 00:04:21
  const [language, setLanguage] = useState<Language>('en');
  const [demoMode, setDemoMode] = useState<'SIMULATION' | 'MONITORING'>('SIMULATION');
  const [cameraMode, setCameraMode] = useState<CameraMode>('CAM-01');
  const [customVideoUrl, setCustomVideoUrl] = useState<string | null>(null);
  const [poseOrientation, setPoseOrientation] = useState<PoseOrientation>('UPRIGHT');
  const [poseReference, setPoseReference] = useState<PoseReference>('RACK');
  const [voiceMuted, setVoiceMutedState] = useState<boolean>(false);
  
  const [overlaySettings, setOverlaySettings] = useState<OverlaySettings>({
    boundingBoxes: true,
    skeleton: true,
    hoiLines: true,
    labels: true,
    confidence: true,
  });

  const [alerts, setAlerts] = useState<AlertItem[]>(initialAlerts);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(initialTimeline);
  const [missionLogs, setMissionLogs] = useState<MissionLogItem[]>(initialLogs);
  const [detections, setDetections] = useState<DetectionItem[]>(initialDetections);
  const [hoi, setHoi] = useState<HoiInteraction>(initialHoi);
  
  const [activityConfidence, setActivityConfidence] = useState<number>(96.4);
  const [poseConfidence, setPoseConfidence] = useState<number>(96.2);
  const [objectConfidence, setObjectConfidence] = useState<number>(97.1);
  const [fps, setFps] = useState<number>(23.8);
  const [latency, setLatency] = useState<number>(41);
  const [trackingStatus, setTrackingStatus] = useState<'NOMINAL' | 'DEGRADED' | 'LOST'>('NOMINAL');

  // MET Timer effect
  useEffect(() => {
    let timer: any;
    if (missionStatus === 'ACTIVE') {
      timer = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
        
        // Random micro noise for realistic telemetry
        setFps(+(23.5 + Math.random() * 0.8).toFixed(1));
        setLatency(Math.floor(39 + Math.random() * 5));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [missionStatus]);

  // Format seconds to MET HH:MM:SS
  const formatMet = (sec: number) => {
    const hrs = Math.floor(sec / 3600).toString().padStart(2, '0');
    const mins = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
    const secs = (sec % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  const metFormatted = formatMet(secondsElapsed);

  const getUtcTimestamp = () => {
    const now = new Date();
    return now.toTimeString().split(' ')[0] + ' UTC';
  };

  const toggleOverlaySetting = (key: keyof OverlaySettings) => {
    setOverlaySettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleVoiceMute = () => {
    const next = !voiceMuted;
    setVoiceMutedState(next);
    setSpeechMuted(next);
  };

  const startMission = () => {
    setMissionStatus('ACTIVE');
    speakGuidance("Mission console active. Monitoring protocol sequence.");
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
    speakGuidance("Mission reset to Step One. Ready to begin.");
  };

  const performCorrectStep = () => {
    const utc = getUtcTimestamp();
    const met = metFormatted;

    if (currentStep === 0 || currentStep === 1) {
      // Advance to Step 2
      setCurrentStep(2);
      setCompletedSteps([1]);
      setFsmState('S2_REMOVE_CONTAINER');
      setExpectedAction("Remove the yellow container from the red experiment box");
      setObservedAction("Step 01 Verified: Red box lid open detected (97.2%)");
      setActivityConfidence(96.4);
      
      const newLog: MissionLogItem = {
        eventId: `EVT-00${Math.floor(60 + Math.random() * 20)}`,
        utcTime: utc,
        met: met,
        module: 'FSM',
        event: 'Step 01 verified: Open Red Box complete',
        confidence: 97.2,
        fsmState: 'S1→S2',
        status: 'SUCCESS'
      };
      setMissionLogs(prev => [newLog, ...prev]);

      const newTl: TimelineEvent = {
        id: `tl-${Date.now()}`,
        timestamp: utc.split(' ')[0],
        met: met,
        type: 'PROTOCOL',
        title: 'STEP 01 VERIFIED',
        description: 'Red box opening verified. Advancing protocol to Step 02.',
        level: 'success'
      };
      setTimelineEvents(prev => [newTl, ...prev]);

      speakGuidance("Step one verified. Remove the yellow container.");

    } else if (currentStep === 2) {
      // Advance to Step 3
      setCurrentStep(3);
      setCompletedSteps([1, 2]);
      setFsmState('S3_PLACE_CONTAINER');
      setExpectedAction("Place the yellow container securely in the payload rack slot");
      setObservedAction("Step 02 Verified: Container removed from box (96.4%)");
      setActivityConfidence(95.8);

      const newLog: MissionLogItem = {
        eventId: `EVT-00${Math.floor(80 + Math.random() * 20)}`,
        utcTime: utc,
        met: met,
        module: 'FSM',
        event: 'Step 02 verified: Remove Yellow Container complete',
        confidence: 96.4,
        fsmState: 'S2→S3',
        status: 'SUCCESS'
      };
      setMissionLogs(prev => [newLog, ...prev]);

      const newTl: TimelineEvent = {
        id: `tl-${Date.now()}`,
        timestamp: utc.split(' ')[0],
        met: met,
        type: 'PROTOCOL',
        title: 'STEP 02 VERIFIED',
        description: 'Yellow container removal confirmed. Advancing to Step 03.',
        level: 'success'
      };
      setTimelineEvents(prev => [newTl, ...prev]);

      speakGuidance("Step two verified. Place the container in the rack.");

    } else if (currentStep === 3) {
      // Complete Protocol!
      setCompletedSteps([1, 2, 3]);
      setFsmState('COMPLETE');
      setMissionStatus('COMPLETED');
      setExpectedAction("Protocol execution complete");
      setObservedAction("Container locked in rack slot (99.1%)");
      setCompletionModalOpen(true);

      const newLog: MissionLogItem = {
        eventId: `EVT-0100`,
        utcTime: utc,
        met: met,
        module: 'FSM',
        event: 'Protocol execution complete: 100% sequence verified',
        confidence: 98.8,
        fsmState: 'COMPLETE',
        status: 'SUCCESS'
      };
      setMissionLogs(prev => [newLog, ...prev]);

      const newTl: TimelineEvent = {
        id: `tl-${Date.now()}`,
        timestamp: utc.split(' ')[0],
        met: met,
        type: 'PROTOCOL',
        title: 'PROTOCOL COMPLETE',
        description: 'All experiment validation rules satisfied.',
        level: 'success'
      };
      setTimelineEvents(prev => [newTl, ...prev]);

      speakGuidance("Experiment protocol complete.");
    }
  };

  const performWrongStep = () => {
    const utc = getUtcTimestamp();
    const met = metFormatted;

    setFsmState('ERROR');
    setMissionStatus('CRITICAL');
    
    const title = "PROTOCOL DEVIATION DETECTED";
    const detail = "Observed astronaut action violates finite state machine transition rules.";
    const exp = "Remove Yellow Container (Step 02)";
    const obs = "Place Container in Rack (Attempted Step 03 prematurely)";

    setDeviationAlert({ title, detail, expected: exp, observed: obs });

    const newAlert: AlertItem = {
      id: `alt-${Date.now()}`,
      met: met,
      timestamp: utc,
      category: 'CRITICAL',
      title: 'PROTOCOL DEVIATION',
      detail: `${obs} when expected ${exp}`,
      resolved: false
    };
    setAlerts(prev => [newAlert, ...prev]);

    const newLog: MissionLogItem = {
      eventId: `EVT-00${Math.floor(70 + Math.random() * 20)}`,
      utcTime: utc,
      met: met,
      module: 'FSM',
      event: `Protocol deviation: Observed ${obs}`,
      confidence: 94.8,
      fsmState: 'S2→ERROR',
      status: 'CRITICAL'
    };
    setMissionLogs(prev => [newLog, ...prev]);

    const newTl: TimelineEvent = {
      id: `tl-${Date.now()}`,
      timestamp: utc.split(' ')[0],
      met: met,
      type: 'WARNING',
      title: 'PROTOCOL DEVIATION DETECTED',
      description: `Observed ${obs} prior to container removal. FSM locked in ERROR state.`,
      level: 'error'
    };
    setTimelineEvents(prev => [newTl, ...prev]);

    speakGuidance("Warning. Incorrect procedure detected. Return to Step Two.");
  };

  const skipCurrentStep = () => {
    const utc = getUtcTimestamp();
    const met = metFormatted;

    setFsmState('ERROR');
    setMissionStatus('CRITICAL');

    const title = "SEQUENCE VIOLATION DETECTED";
    const detail = "Previous required step has not been completed. Cannot jump state vector.";
    const exp = "Complete Step 02 (Remove Yellow Container)";
    const obs = "Attempted Step 03 jump without lid / container removal validation";

    setDeviationAlert({ title, detail, expected: exp, observed: obs });

    const newAlert: AlertItem = {
      id: `alt-${Date.now()}`,
      met: met,
      timestamp: utc,
      category: 'CRITICAL',
      title: 'SEQUENCE VIOLATION',
      detail: detail,
      resolved: false
    };
    setAlerts(prev => [newAlert, ...prev]);

    speakGuidance("Sequence violation. Previous required step has not been completed.");
  };

  const triggerObjectLost = () => {
    const utc = getUtcTimestamp();
    const met = metFormatted;

    setTrackingStatus('LOST');
    setMissionStatus('DEGRADED');

    const newAlert: AlertItem = {
      id: `alt-${Date.now()}`,
      met: met,
      timestamp: utc,
      category: 'WARNING',
      title: 'TRACKING LOST',
      detail: 'Yellow container temporarily unavailable in payload rack field of view.',
      resolved: false
    };
    setAlerts(prev => [newAlert, ...prev]);

    const newLog: MissionLogItem = {
      eventId: `EVT-00${Math.floor(80 + Math.random() * 10)}`,
      utcTime: utc,
      met: met,
      module: 'OBJECT_DETECTION',
      event: 'Tracking lost for Yellow Container (occlusion detected)',
      confidence: 42.1,
      fsmState: fsmState,
      status: 'DEGRADED'
    };
    setMissionLogs(prev => [newLog, ...prev]);

    speakGuidance("Tracking temporarily lost. Please remain within the camera field of view.");
  };

  const triggerLowConfidence = () => {
    setActivityConfidence(62.4);
    setObservedAction("Activity confidence below validation threshold (62.4% < 85.0%)");
    
    const utc = getUtcTimestamp();
    const met = metFormatted;

    const newAlert: AlertItem = {
      id: `alt-${Date.now()}`,
      met: met,
      timestamp: utc,
      category: 'WARNING',
      title: 'LOW CONFIDENCE EVENT',
      detail: 'Activity confidence 62.4%. System state: AWAITING VALIDATION.',
      resolved: false
    };
    setAlerts(prev => [newAlert, ...prev]);

    speakGuidance("Low confidence event. Awaiting visual confirmation.");
  };

  const recoverTracking = () => {
    setTrackingStatus('NOMINAL');
    setMissionStatus('ACTIVE');
    setActivityConfidence(96.4);
    setObservedAction("Right hand grasp container verified (96.4%)");
    
    const utc = getUtcTimestamp();
    const met = metFormatted;

    const newTl: TimelineEvent = {
      id: `tl-${Date.now()}`,
      timestamp: utc.split(' ')[0],
      met: met,
      type: 'SYSTEM',
      title: 'TRACKING RECOVERED',
      description: 'Astronaut keypoint matrix & container bounding box locked.',
      level: 'info'
    };
    setTimelineEvents(prev => [newTl, ...prev]);

    speakGuidance("Tracking active. Protocol validation resumed.");
  };

  const acknowledgeDeviation = () => {
    setDeviationAlert(null);
    setFsmState(currentStep === 1 ? 'S1_OPEN_BOX' : currentStep === 2 ? 'S2_REMOVE_CONTAINER' : 'S3_PLACE_CONTAINER');
    setMissionStatus('ACTIVE');
    
    // Mark alert resolved
    setAlerts(prev => prev.map(a => a.category === 'CRITICAL' ? { ...a, resolved: true } : a));
    
    speakGuidance("Deviation acknowledged. Resume step procedure.");
  };

  const closeCompletionModal = () => {
    setCompletionModalOpen(false);
  };

  const resolveAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
  };

  const clearAllAlerts = () => {
    setAlerts(prev => prev.map(a => ({ ...a, resolved: true })));
  };

  return (
    <MissionContext.Provider value={{
      missionStatus, currentStep, completedSteps, fsmState, expectedAction, observedAction,
      deviationAlert, completionModalOpen, secondsElapsed, metFormatted, language, demoMode,
      cameraMode, customVideoUrl, overlaySettings, poseOrientation, poseReference, voiceMuted,
      alerts, timelineEvents, missionLogs, detections, hoi, activityConfidence, poseConfidence,
      objectConfidence, fps, latency, trackingStatus,
      
      setLanguage, setDemoMode, setCameraMode, setCustomVideoUrl, setPoseOrientation,
      setPoseReference, toggleOverlaySetting, toggleVoiceMute, startMission, pauseMission,
      stopMission, resetMission, performCorrectStep, performWrongStep, skipCurrentStep,
      triggerObjectLost, triggerLowConfidence, recoverTracking, acknowledgeDeviation,
      closeCompletionModal, resolveAlert, clearAllAlerts
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
