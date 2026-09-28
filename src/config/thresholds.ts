// Configurable system thresholds for ASTRA-PVT space-grade AI engine

export interface SystemThresholds {
  bayesFactorKThreshold: number; // Default 31.6 (Very Strong evidence)
  dempsterShaferConflictLimit: number; // Default 0.65 (Isolation threshold)
  roiPaddingMarginPercent: number; // Default 15% margin around active target
  tmrRedundantCopies: number; // Default 3 (Triple Modular Redundancy)
  nominalFps: number; // 24 FPS target
  throttledFps: number; // 8 FPS during 100% thermal throttling
}

export const defaultConfig: SystemThresholds = {
  bayesFactorKThreshold: 31.6,
  dempsterShaferConflictLimit: 0.65,
  roiPaddingMarginPercent: 15,
  tmrRedundantCopies: 3,
  nominalFps: 24,
  throttledFps: 8,
};
