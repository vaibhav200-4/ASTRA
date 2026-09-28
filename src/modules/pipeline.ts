export interface PipelineStage {
  id: string;
  name: string;
  shortName: string;
  latencyMs: number;
  status: 'NOMINAL' | 'ACTIVE' | 'WARNING' | 'CRITICAL' | 'ISOLATED' | 'REJECTED';
  lastOutput: string;
  active: boolean;
}

export function computePipelineStages(state: {
  fps: number;
  overallLatency: number;
  causalAccepted: boolean;
  causalReason: string | null;
  sensorConflict: boolean;
  isolatedSource: string | null;
  fsmState: string;
  thermalThrottle: number;
  activeStageId?: string;
}): PipelineStage[] {
  const isThrottled = state.thermalThrottle > 50;

  return [
    {
      id: 'camera',
      name: 'CAMERA',
      shortName: 'CAM',
      latencyMs: isThrottled ? 12 : 5,
      status: 'NOMINAL',
      lastOutput: `Rack Cam 01 (1080p @ ${state.fps} fps)`,
      active: state.activeStageId === 'camera' || !state.activeStageId
    },
    {
      id: 'perceive',
      name: 'PERCEIVE',
      shortName: 'PERCEIVE',
      latencyMs: isThrottled ? 28 : 14,
      status: 'NOMINAL',
      lastOutput: 'YOLO26n + 3D Rack Pose',
      active: state.activeStageId === 'perceive'
    },
    {
      id: 'verify',
      name: 'VERIFY',
      shortName: 'VERIFY',
      latencyMs: 6,
      status: !state.causalAccepted ? 'REJECTED' : 'NOMINAL',
      lastOutput: state.causalAccepted ? '3/3 Evidence Pass' : `Rejected: ${state.causalReason || 'Discrepancy'}`,
      active: state.activeStageId === 'verify'
    },
    {
      id: 'fuse',
      name: 'FUSE/DIAGNOSE',
      shortName: 'FUSE',
      latencyMs: 4,
      status: state.sensorConflict ? 'ISOLATED' : 'NOMINAL',
      lastOutput: state.sensorConflict ? `Isolated: ${state.isolatedSource || 'HOI Sensor'}` : 'Dempster-Shafer Fused',
      active: state.activeStageId === 'fuse'
    },
    {
      id: 'validate',
      name: 'VALIDATE',
      shortName: 'VALIDATE',
      latencyMs: 8,
      status: state.fsmState === 'ERROR' ? 'CRITICAL' : 'NOMINAL',
      lastOutput: `FSM State: ${state.fsmState}`,
      active: state.activeStageId === 'validate'
    },
    {
      id: 'respond',
      name: 'RESPOND',
      shortName: 'RESPOND',
      latencyMs: 2,
      status: 'NOMINAL',
      lastOutput: 'Telemetry & TTS Audio Ready',
      active: state.activeStageId === 'respond'
    }
  ];
}
