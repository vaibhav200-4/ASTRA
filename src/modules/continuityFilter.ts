export interface PropagationPoint {
  timeSec: number;
  dt: number;
  actualFps: number;
  truePosition: number;
  kalmanDtPosition: number;
  naiveFrameCountPosition: number;
  errorNaive: number;
  errorKalman: number;
}

export function generateThermalContinuityData(
  thermalThrottlePercent: number = 0,
  durationSec: number = 10
): PropagationPoint[] {
  const points: PropagationPoint[] = [];
  const baseFps = 24;
  // FPS drops from 24 to 8 as throttle goes from 0% to 100%
  const effectiveFps = Math.max(8, Math.round(baseFps - (thermalThrottlePercent / 100) * 16));
  const baseDt = 1 / effectiveFps;

  let currentSec = 0;
  let truePos = 0;
  let kalmanPos = 0;
  let naivePos = 0;
  const velocity = 5.0; // cm/s moving velocity of astronaut hand/tool

  while (currentSec <= durationSec) {
    // Add realistic jitter to dt under thermal load
    const jitter = (Math.random() - 0.5) * baseDt * (thermalThrottlePercent / 100);
    const actualDt = Math.max(0.02, baseDt + jitter);

    truePos += velocity * actualDt;

    // dt-based time propagation (Kalman filter constant-velocity motion model)
    kalmanPos += velocity * actualDt;

    // Naive frame-count propagation assumes fixed nominal 1/24s frame rate regardless of dropped frames
    const nominalDt = 1 / baseFps;
    naivePos += velocity * nominalDt;

    const errorNaive = Number(Math.abs(truePos - naivePos).toFixed(2));
    const errorKalman = Number(Math.abs(truePos - kalmanPos).toFixed(2));

    points.push({
      timeSec: Number(currentSec.toFixed(2)),
      dt: Number((actualDt * 1000).toFixed(1)), // ms
      actualFps: Number((1 / actualDt).toFixed(1)),
      truePosition: Number(truePos.toFixed(2)),
      kalmanDtPosition: Number(kalmanPos.toFixed(2)),
      naiveFrameCountPosition: Number(naivePos.toFixed(2)),
      errorNaive,
      errorKalman
    });

    currentSec += actualDt;
  }

  return points;
}
