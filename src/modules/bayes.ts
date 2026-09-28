export interface BayesFactorData {
  kValue: number;
  label: string;
  pNormal: number;
  pAnomaly: number;
  thresholdK: number;
  isAboveThreshold: boolean;
  timestamp: string;
}

export function computeBayesFactor(
  pNormal: number,
  pAnomaly: number,
  thresholdK: number = 31.6
): BayesFactorData {
  const safeAnomaly = Math.max(pAnomaly, 0.0001);
  const kValue = Number((pNormal / safeAnomaly).toFixed(2));

  let label = 'Substantial';
  if (kValue < 1) label = 'Anomaly Evidence';
  else if (kValue < 3.2) label = 'Barely Worth Mentioning';
  else if (kValue < 10) label = 'Substantial';
  else if (kValue < 31.6) label = 'Strong';
  else if (kValue < 100) label = 'Very Strong';
  else label = 'Decisive';

  const isAboveThreshold = kValue >= thresholdK;
  const timestamp = new Date().toISOString().substring(11, 19);

  return {
    kValue,
    label,
    pNormal,
    pAnomaly,
    thresholdK,
    isAboveThreshold,
    timestamp
  };
}
