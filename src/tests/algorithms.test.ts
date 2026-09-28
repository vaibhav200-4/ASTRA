// Unit Tests for ASTRA-PVT Core Algorithms
import { evaluateCausalVerification } from '../modules/verification';
import { computeBayesFactor } from '../modules/bayes';
import { combineDempsterShafer } from '../modules/fusion';
import { computeRackFramePose, getInitialTransform } from '../modules/poseTransform';
import { validateFsmTransition } from '../modules/fsmValidation';
import { generateThermalContinuityData } from '../modules/continuityFilter';
import { runTmrMajorityVote } from '../modules/radiationTmr';
import { createInitialRingBuffer, stepRingBufferSimulation } from '../modules/ringBuffer';

export function runAllAlgorithmTests() {
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
      failed++;
    }
  }

  console.log('--- STARTING ASTRA-PVT ALGORITHM UNIT TESTS ---');

  // Test 1: Causal Verification
  const cPass = evaluateCausalVerification(true, true, true);
  assert(cPass.accepted === true && cPass.rejectionReason === null, 'Causal Verification Pass Case');

  const cReject = evaluateCausalVerification(true, false, true, true, "Action seen, expected state change NOT observed");
  assert(cReject.accepted === false && cReject.rejectionReason?.includes("NOT observed"), 'Causal Verification Rejection Case');

  // Test 2: Bayes Factor Evidence Engine
  const bfStrong = computeBayesFactor(0.96, 0.02, 31.6);
  assert(bfStrong.kValue === 48 && bfStrong.label === 'Very Strong' && bfStrong.isAboveThreshold === true, 'Bayes Factor K=48 Very Strong Evidence');

  const bfAnomaly = computeBayesFactor(0.10, 0.80, 31.6);
  assert(bfAnomaly.kValue === 0.13 && bfAnomaly.label === 'Anomaly Evidence' && bfAnomaly.isAboveThreshold === false, 'Bayes Factor Anomaly Evidence');

  // Test 3: Dempster-Shafer Multi-Sensor Fusion
  const rawSources = [
    { id: 'detector', name: 'Detector', mStep: 0.85, mAnomaly: 0.10, mUncertain: 0.05, status: 'NOMINAL' as const, isIncluded: true },
    { id: 'pose', name: 'Pose', mStep: 0.82, mAnomaly: 0.12, mUncertain: 0.06, status: 'NOMINAL' as const, isIncluded: true },
    { id: 'hoi', name: 'HOI', mStep: 0.88, mAnomaly: 0.08, mUncertain: 0.04, status: 'NOMINAL' as const, isIncluded: true },
  ];
  const fuseNominal = combineDempsterShafer(rawSources, 0.65, false);
  assert(fuseNominal.conflictExceeded === false && fuseNominal.fusedBelief > 0.7, 'Dempster-Shafer Nominal Fusion');

  const fuseDisagreed = combineDempsterShafer(rawSources, 0.65, true);
  assert(fuseDisagreed.conflictExceeded === true && fuseDisagreed.isolatedSourceId === 'hoi', 'Dempster-Shafer Conflict Isolation of HOI Sensor');

  // Test 4: Rack-Frame Pose Invariance
  const pose0 = computeRackFramePose(getInitialTransform(), 0);
  const pose90 = computeRackFramePose(getInitialTransform(), 90);
  const headRack0 = pose0.keypoints[0].rackFrame;
  const headRack90 = pose90.keypoints[0].rackFrame;
  assert(headRack0.x === headRack90.x && headRack0.y === headRack90.y, 'Rack-Frame Skeleton Coordinates Invariant under Rotation');

  // Test 5: Protocol FSM State Transitions
  const fsmValid = validateFsmTransition('S1_OPEN_BOX', 'S2_REMOVE_CONTAINER');
  assert(fsmValid.transitionType === 'VALID' && fsmValid.alertLevel === 'NOMINAL', 'FSM Valid Transition S1->S2');

  const fsmSkip = validateFsmTransition('S1_OPEN_BOX', 'S3_PLACE_CONTAINER');
  assert(fsmSkip.transitionType === 'SKIPPED' && fsmSkip.alertLevel === 'CRITICAL', 'FSM Skipped Transition S1->S3');

  // Test 6: Thermal Continuity Filter
  const continuity = generateThermalContinuityData(100, 5);
  assert(continuity.length > 0 && continuity[continuity.length - 1].errorKalman < continuity[continuity.length - 1].errorNaive, 'Thermal dt Propagation Reduces Velocity Error');

  // Test 7: Radiation TMR Majority Voting
  const tmrUnanimous = runTmrMajorityVote({ stepId: 1, fsmState: 'S1' }, { stepId: 1, fsmState: 'S1' }, { stepId: 1, fsmState: 'S1' }, 0, null);
  assert(tmrUnanimous.votingOutcome === 'UNANIMOUS', 'TMR Unanimous Vote 3/3');

  const tmrCorrupt = runTmrMajorityVote({ stepId: 1, fsmState: 'S1' }, { stepId: 1, fsmState: 'S1' }, { stepId: 1, fsmState: 'S1' }, 0, 1);
  assert(tmrCorrupt.votingOutcome === 'CORRECTED_2_VS_1' && tmrCorrupt.corruptedCopyId === 1 && tmrCorrupt.seusCorrectedCount === 1, 'TMR SEU Correction 2-vs-1 Vote');

  // Test 8: Ring Buffer
  const rb0 = createInitialRingBuffer(16);
  const rb1 = stepRingBufferSimulation(rb0, 24);
  assert(rb1.capacity === 16 && rb1.headProducerIndex === 6, 'Ring Buffer Producer Index Step');

  console.log(`--- TEST RESULTS: ${passed} PASSED, ${failed} FAILED ---`);
  return { passed, failed };
}

// Execute if run directly via tsx/node
if (typeof process !== 'undefined' && process.argv && process.argv[1]?.includes('algorithms.test')) {
  runAllAlgorithmTests();
}
