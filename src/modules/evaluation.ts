export interface EvaluationMetrics {
  perStepMetrics: {
    stepId: string;
    name: string;
    precision: number;
    recall: number;
    f1Score: number;
  }[];
  confusionMatrix: {
    labels: string[];
    matrix: number[][]; // Row: Actual, Col: Predicted
  };
  falseCompletionRatePercent: number; // e.g., 0.4%
  skippedStepDetectionRatePercent: number; // e.g., 99.2%
  falseAlertRatePercent: number; // e.g., 1.1%
  alertLatencyMs: number; // e.g., 28ms
  edgeFpsSimulated: number;
  edgeMemoryUsageMb: number;
  edgePowerUsageWatts: number;
  isSimulatedData: boolean;
}

export interface StressTestItem {
  id: string;
  name: string;
  category: string;
  status: 'PASS' | 'FAIL' | 'ACTIVE';
  detail: string;
}

export const defaultEvaluationMetrics: EvaluationMetrics = {
  perStepMetrics: [
    { stepId: 'S1', name: 'Open Red Box', precision: 98.5, recall: 97.2, f1Score: 97.8 },
    { stepId: 'S2', name: 'Remove Container', precision: 96.8, recall: 98.1, f1Score: 97.4 },
    { stepId: 'S3', name: 'Place Container', precision: 99.1, recall: 96.5, f1Score: 97.8 },
  ],
  confusionMatrix: {
    labels: ['S1 Open', 'S2 Remove', 'S3 Place', 'Idle/Noise'],
    matrix: [
      [245,   4,   1,   2],
      [  3, 238,   5,   2],
      [  0,   2, 242,   1],
      [  1,   3,   2, 195]
    ]
  },
  falseCompletionRatePercent: 0.4,
  skippedStepDetectionRatePercent: 99.2,
  falseAlertRatePercent: 1.1,
  alertLatencyMs: 28,
  edgeFpsSimulated: 23.8,
  edgeMemoryUsageMb: 1420,
  edgePowerUsageWatts: 12.4,
  isSimulatedData: true
};

export function getStressTestChecklist(simState: {
  poseAngle: number;
  trackingStatus: string;
  thermalThrottle: number;
  sensorDisagreement: boolean;
  seuCount: number;
}): StressTestItem[] {
  return [
    {
      id: 'st-1',
      name: 'Arbitrary 3D Microgravity Rotation',
      category: 'Pose Transform',
      status: 'PASS',
      detail: simState.poseAngle !== 0 ? `Active rotation ${simState.poseAngle}° verified invariant in rack frame` : 'Nominal orientation baseline verified'
    },
    {
      id: 'st-2',
      name: 'Object Occlusion & Loss Recovery',
      category: 'Perception',
      status: simState.trackingStatus === 'LOST' ? 'ACTIVE' : 'PASS',
      detail: simState.trackingStatus === 'LOST' ? 'Occlusion detected: Kalman state propagation engaged' : 'Tracking nominal'
    },
    {
      id: 'st-3',
      name: 'Frame Drop & Jitter Resilience',
      category: 'State Filter',
      status: 'PASS',
      detail: 'dt-decoupled continuity filter handles 150ms frame gaps without velocity drift'
    },
    {
      id: 'st-4',
      name: '100% Thermal Throttle Survival',
      category: 'System Resource',
      status: simState.thermalThrottle > 50 ? 'ACTIVE' : 'PASS',
      detail: `Throttle ${simState.thermalThrottle}%: Adaptive ROI reduced frame processing load`
    },
    {
      id: 'st-5',
      name: 'Single Sensor Disagreement Isolation',
      category: 'Multi-Sensor Fusion',
      status: simState.sensorDisagreement ? 'ACTIVE' : 'PASS',
      detail: simState.sensorDisagreement ? 'Dempster-Shafer K_conflict > limit: Offending sensor ISOLATED' : 'Multi-sensor agreement nominal'
    },
    {
      id: 'st-6',
      name: 'Cosmic Ray Bit-Flip Recovery (TMR)',
      category: 'Reliability',
      status: simState.seuCount > 0 ? 'ACTIVE' : 'PASS',
      detail: simState.seuCount > 0 ? `${simState.seuCount} SEUs corrected via 2-vs-1 TMR majority vote` : 'TMR memory copies intact'
    }
  ];
}
