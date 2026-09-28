/**
 * ASTRA-PVT System Config & Safety Thresholds
 * ISRO • Department of Space — On-board BAS Experiments (SIH 2026 PS174)
 */

export interface SystemThresholds {
  bayesFactorK: {
    strongEvidenceThreshold: number; // K >= 3.0
    decisiveEvidenceThreshold: number; // K >= 10.0
    rejectThreshold: number; // K < 1.0
  };
  dempsterShafer: {
    maxConflictFactorK: number; // Conflict factor K < 0.50
    minBeliefConfidence: number; // Belief >= 0.70
  };
  thermalControl: {
    maxTempCelsius: number; // Max thermal threshold before throttling (65 C)
    minFpsUnderThrottle: number; // Minimum safe frame rate (8 FPS)
    nominalFps: number; // Nominal flight frame rate (24 FPS)
  };
  tmrVoting: {
    redundantCopiesCount: number; // 3 SRAM copies
    votingScheme: string; // "2-vs-1 majority voting"
  };
  performance: {
    maxAlertLatencyMs: number; // Alert latency threshold (120ms)
    edgeMemoryLimitMb: number; // Max RAM footprint on Jetson (512MB)
    edgePowerLimitWatts: number; // Max power budget (15W)
  };
}

export type SystemThresholdsConfig = SystemThresholds;

export const defaultConfig: SystemThresholds = {
  bayesFactorK: {
    strongEvidenceThreshold: 3.0,
    decisiveEvidenceThreshold: 10.0,
    rejectThreshold: 1.0,
  },
  dempsterShafer: {
    maxConflictFactorK: 0.50,
    minBeliefConfidence: 0.70,
  },
  thermalControl: {
    maxTempCelsius: 65.0,
    minFpsUnderThrottle: 8.0,
    nominalFps: 24.0,
  },
  tmrVoting: {
    redundantCopiesCount: 3,
    votingScheme: "2-vs-1 majority voting",
  },
  performance: {
    maxAlertLatencyMs: 120.0,
    edgeMemoryLimitMb: 512.0,
    edgePowerLimitWatts: 15.0,
  },
};

export const SYSTEM_THRESHOLDS = defaultConfig;
