export interface SensorMassAssignment {
  id: string;
  name: string;
  mStep: number;     // Mass for normal step completion
  mAnomaly: number;  // Mass for anomaly
  mUncertain: number; // Mass for uncertainty (Theta)
  status: 'NOMINAL' | 'ISOLATED' | 'DEGRADED';
  isIncluded: boolean;
}

export interface FusionResult {
  fusedBelief: number;
  fusedPlausibility: number;
  kConflict: number;
  conflictExceeded: boolean;
  isolatedSourceId: string | null;
  sources: SensorMassAssignment[];
}

export function combineDempsterShafer(
  rawSources: SensorMassAssignment[],
  conflictLimit: number = 0.65,
  injectDisagreement: boolean = false
): FusionResult {
  const sources = rawSources.map(s => ({ ...s }));

  if (injectDisagreement) {
    // Inject disagreement in source 3 (HOI) to force high conflict
    const hoiSource = sources.find(s => s.id === 'hoi');
    if (hoiSource) {
      hoiSource.mStep = 0.05;
      hoiSource.mAnomaly = 0.90;
      hoiSource.mUncertain = 0.05;
    }
  }

  // Calculate pairwise conflict between sources
  let totalConflict = 0;
  let maxDisagreedId: string | null = null;
  let maxDisagreement = 0;

  // Average mass of others vs each source
  sources.forEach(src => {
    const others = sources.filter(s => s.id !== src.id);
    const avgOtherStep = others.reduce((acc, o) => acc + o.mStep, 0) / others.length;
    const diff = Math.abs(src.mStep - avgOtherStep);
    if (diff > maxDisagreement) {
      maxDisagreement = diff;
      maxDisagreedId = src.id;
    }
  });

  // Calculate overall K_conflict between first two active sources
  const s1 = sources[0];
  const s2 = sources[1];
  const s3 = sources[2];

  // K_conflict = s1.mStep*s2.mAnomaly + s1.mAnomaly*s2.mStep + ...
  const kConflictRaw = (s1.mStep * s2.mAnomaly + s1.mAnomaly * s2.mStep) +
                       (s1.mStep * s3.mAnomaly + s1.mAnomaly * s3.mStep);
  totalConflict = Math.min(0.99, Number(kConflictRaw.toFixed(3)));

  const conflictExceeded = totalConflict > conflictLimit;
  let isolatedSourceId: string | null = null;

  if (conflictExceeded && maxDisagreedId) {
    isolatedSourceId = maxDisagreedId;
    const offending = sources.find(s => s.id === isolatedSourceId);
    if (offending) {
      offending.status = 'ISOLATED';
      offending.isIncluded = false;
    }
  }

  // Combine masses for included sources only
  const activeSources = sources.filter(s => s.isIncluded);
  let combinedMassStep = 0;
  let combinedMassAnomaly = 0;

  if (activeSources.length > 0) {
    const sumStep = activeSources.reduce((acc, s) => acc + s.mStep, 0);
    const sumAnomaly = activeSources.reduce((acc, s) => acc + s.mAnomaly, 0);
    const sumTotal = sumStep + sumAnomaly + 0.1;

    combinedMassStep = sumStep / sumTotal;
    combinedMassAnomaly = sumAnomaly / sumTotal;
  }

  const fusedBelief = Number(combinedMassStep.toFixed(3));
  const fusedPlausibility = Number((1 - combinedMassAnomaly).toFixed(3));

  return {
    fusedBelief,
    fusedPlausibility,
    kConflict: totalConflict,
    conflictExceeded,
    isolatedSourceId,
    sources
  };
}
