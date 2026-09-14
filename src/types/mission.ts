export type MissionStatus = 'IDLE' | 'ACTIVE' | 'PAUSED' | 'DEGRADED' | 'CRITICAL' | 'COMPLETED';

export type StepId = 0 | 1 | 2 | 3;

export type FsmState = 
  | 'S0_READY' 
  | 'S1_OPEN_BOX' 
  | 'S2_REMOVE_CONTAINER' 
  | 'S3_PLACE_CONTAINER' 
  | 'COMPLETE' 
  | 'ERROR';

export type Language = 'en' | 'hi';

export type CameraMode = 'CAM-01' | 'CAM-02' | 'FUSED';

export type PoseOrientation = 'UPRIGHT' | 'TILTED' | 'ROTATED_90' | 'INVERTED' | 'FREE';

export type PoseReference = 'RACK' | 'CAMERA';

export interface OverlaySettings {
  boundingBoxes: boolean;
  skeleton: boolean;
  hoiLines: boolean;
  labels: boolean;
  confidence: boolean;
}

export interface DetectionItem {
  id: string;
  name: string;
  confidence: number;
  bbox: [number, number, number, number]; // x, y, width, height in %
  color: string;
  status?: string;
}

export interface HoiInteraction {
  source: string;
  target: string;
  contactConfidence: number;
  motion: string;
  interactionType: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  met: string;
  type: 'AI' | 'PROTOCOL' | 'WARNING' | 'SYSTEM';
  title: string;
  description: string;
  level: 'info' | 'success' | 'warning' | 'error';
}

export interface MissionLogItem {
  eventId: string;
  utcTime: string;
  met: string;
  module: string;
  event: string;
  confidence: number;
  fsmState: string;
  status: 'NORMAL' | 'SUCCESS' | 'ACTIVE' | 'CRITICAL' | 'DEGRADED';
}

export interface AlertItem {
  id: string;
  met: string;
  timestamp: string;
  category: 'CRITICAL' | 'WARNING' | 'SYSTEM' | 'INFO';
  title: string;
  detail: string;
  resolved: boolean;
}

export interface ChartDataPoint {
  time: string;
  fps: number;
  latency: number;
  activityConf: number;
  poseConf: number;
  objectConf: number;
}
