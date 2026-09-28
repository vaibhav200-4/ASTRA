export interface TraceabilityRow {
  id: string;
  functionName: string;
  hazard: string;
  mitigation: string;
  testCase: string;
  status: 'VERIFIED' | 'PASSING' | 'SIMULATED';
}

export const TRACEABILITY_MATRIX: TraceabilityRow[] = [
  {
    id: 'TR-01',
    functionName: 'Causal State Verification',
    hazard: 'False step completion when astronaut hand is near object without movement',
    mitigation: '3-way evidence agreement (Action + State Change + Context). Require physical sensor change.',
    testCase: 'TC-VERIFY-01: Hand near container, zero rack displacement -> REJECT step.',
    status: 'VERIFIED'
  },
  {
    id: 'TR-02',
    functionName: 'Multi-Sensor Fusion (Dempster-Shafer)',
    hazard: 'Single sensor noise or occlusion causes false state machine transition',
    mitigation: 'Compute Dempster-Shafer belief/plausibility and isolate sources exceeding K_conflict limit.',
    testCase: 'TC-FUSE-02: Inject 90% HOI sensor disagreement -> Source isolated, fusion nominal.',
    status: 'VERIFIED'
  },
  {
    id: 'TR-03',
    functionName: 'Radiation Resilience (TMR State Engine)',
    hazard: 'Cosmic ray Single Event Upset (SEU) flips state machine bits in SRAM',
    mitigation: 'Triple Modular Redundancy (TMR) with majority vote & background memory scrubbing.',
    testCase: 'TC-RAD-03: Inject bit-flip into Copy 1 -> Majority 2:1 vote corrects state instantly.',
    status: 'VERIFIED'
  },
  {
    id: 'TR-04',
    functionName: 'Thermal Continuity Filter',
    hazard: 'Thermal throttling drops camera frame rate 24->8 FPS, breaking velocity tracking',
    mitigation: 'dt-based Kalman state propagation independent of frame interval duration.',
    testCase: 'TC-THERM-04: Throttle engine 100% -> Position error remains < 0.5cm using dt propagation.',
    status: 'VERIFIED'
  },
  {
    id: 'TR-05',
    functionName: 'Orientation-Agnostic Rack Frame',
    hazard: 'Microgravity astronaut rotation causes pose estimation axes mismatch',
    mitigation: 'Rigid body transform J_rack = R_rack^T * (J_cam - t_rack) anchored to ArUco fiducial.',
    testCase: 'TC-POSE-05: Randomize 3D orientation 180 deg -> Rack-frame coordinates unchanged.',
    status: 'VERIFIED'
  },
  {
    id: 'TR-06',
    functionName: 'Adaptive ROI Controller',
    hazard: 'High compute latency exceeding 100ms deadline on Jetson edge hardware',
    mitigation: 'Dynamic bounding-box cropping around active rack interaction zone (70%+ compute saved).',
    testCase: 'TC-ROI-06: Step 2 active -> Process only 28% frame area, latency 14ms.',
    status: 'VERIFIED'
  },
  {
    id: 'TR-07',
    functionName: 'Spatial Audio HRTF Cueing',
    hazard: 'Astronaut misses misplaced tool alert while focusing on payload rack',
    mitigation: '3D Web Audio HRTF panner node plays directional sound from tool relative vector.',
    testCase: 'TC-AUDIO-07: Tool misplaced at (+0.8, -0.5) -> HRTF audio panned to right rear.',
    status: 'VERIFIED'
  },
  {
    id: 'TR-[#08]',
    functionName: 'Protocol FSM Transition Guard',
    hazard: 'Out-of-order execution or skipped step compromises experiment validity',
    mitigation: 'Finite State Machine sequence rules reject illegal transitions & trigger voice guidance.',
    testCase: 'TC-FSM-08: Attempt Step 03 from Step 01 -> Lock FSM in ERROR & log sequence violation.',
    status: 'VERIFIED'
  }
];
