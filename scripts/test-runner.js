// Standalone ESM test runner for ASTRA-PVT algorithm unit tests
import { evaluateCausalVerification } from '../src/modules/verification.js';
import { computeBayesFactor } from '../src/modules/bayes.js';
import { combineDempsterShafer } from '../src/modules/fusion.js';
import { computeRackFramePose, getInitialTransform } from '../src/modules/poseTransform.js';
import { validateFsmTransition } from '../src/modules/fsmValidation.js';
import { generateThermalContinuityData } from '../src/modules/continuityFilter.js';
import { runTmrMajorityVote } from '../src/modules/radiationTmr.js';
import { createInitialRingBuffer, stepRingBufferSimulation } from '../src/modules/ringBuffer.js';

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`❌ [FAIL] ${testName}`);
    failed++;
  }
}

console.log('=== ASTRA-PVT ALGORITHM VERIFICATION TESTS ===');

// 1. Causal Verification
const cPass = evaluateCausalVerification(true, true, true);
assert(cPass.accepted === true && cPass.rejectionReason === null, 'Causal Verification Pass Case');

const cReject = evaluateCausalVerification(true, false, true, true, "Action seen, expected state change NOT observed");
assert(cReject.accepted === false && cReject.rejectionReason.includes("NOT observed"), 'Causal Verification Rejection Case');

// 2. Bayes Factor Engine
const bfStrong = computeBayesFactor(0.96, 0.02, 31.6);
assert(bfStrong.kValue === 48 && bfStrong.label === 'Strong' && bfStrong.isAboveThreshold === true, 'Bayes Factor K=48 Strong Evidence');

const bfAnomaly = computeBayesFactor(0.10, 0.80, 31.6);
assert(bfAnomaly.kValue === 0.13 && bfAnomaly.label === 'Anomaly Evidence' && bfAnomaly.isAboveThreshold === false, 'Bayes Factor Anomaly Evidence');

// 3. Dempster-Shafer Multi-Sensor Fusion
const rawSources = [
  { id: 'detector', name: 'Detector', mStep: 0.85, mAnomaly: 0.10, mUncertain: 0.05, status: 'NOMINAL', isIncluded: true },
  { id: 'pose', name: 'Pose', mStep: 0.82, mAnomaly: 0.12, mUncertain: 0.06, status: 'NOMINAL', isIncluded: true },
  { id: 'hoi', name: 'HOI', mStep: 0.88, mAnomaly: 0.08, mUncertain: 0.04, status: 'NOMINAL', isIncluded: true },
];
const fuseNominal = combineDempsterShafer(rawSources, 0.65, false);
assert(fuseNominal.conflictExceeded === false && fuseNominal.fusedBelief > 0.7, 'Dempster-Shafer Nominal Fusion');

const fuseDisagreed = combineDempsterShafer(rawSources, 0.65, true);
assert(fuseDisagreed.conflictExceeded === true && fuseDisagreed.isolatedSourceId === 'hoi', 'Dempster-Shafer Conflict Isolation');

// 4. Pose Orientation Invariance
const pose0 = computeRackFramePose(getInitialTransform(), 0);
const pose90 = computeRackFramePose(getInitialTransform(), 90);
assert(pose0.keypoints[0].rackFrame.x === pose90.keypoints[0].rackFrame.x, 'Rack-Frame Coordinate Invariance under 3D Rotation');

// 5. Protocol FSM Validation
const fsmValid = validateFsmTransition('S1_OPEN_BOX', 'S2_REMOVE_CONTAINER');
assert(fsmValid.transitionType === 'VALID' && fsmValid.alertLevel === 'NOMINAL', 'FSM Valid Transition S1->S2');

const fsmSkip = validateFsmTransition('S1_OPEN_BOX', 'S3_PLACE_CONTAINER');
assert(fsmSkip.transitionType === 'SKIPPED' && fsmSkip.alertLevel === 'CRITICAL', 'FSM Skipped Step Transition S1->S3');

// 6. Thermal Continuity Filter
const continuity = generateThermalContinuityData(100, 5);
assert(continuity.length > 0 && continuity[continuity.length - 1].errorKalman < continuity[continuity.length - 1].errorNaive, 'Thermal dt Propagation Reduces Velocity Error');

// 7. Radiation Resilience TMR
const tmrUnanimous = runTmrMajorityVote({ stepId: 1, fsmState: 'S1' }, { stepId: 1, fsmState: 'S1' }, { stepId: 1, fsmState: 'S1' }, 0, null);
assert(tmrUnanimous.votingOutcome === 'UNANIMOUS', 'TMR Unanimous Vote 3/3');

const tmrCorrupt = runTmrMajorityVote({ stepId: 1, fsmState: 'S1' }, { stepId: 1, fsmState: 'S1' }, { stepId: 1, fsmState: 'S1' }, 0, 1);
assert(tmrCorrupt.votingOutcome === 'CORRECTED_2_VS_1' && tmrCorrupt.corruptedCopyId === 1, 'TMR SEU 2-vs-1 Correction');

// 8. Ring Buffer Simulation
const rb0 = createInitialRingBuffer(16);
const rb1 = stepRingBufferSimulation(rb0, 24);
assert(rb1.capacity === 16 && rb1.headProducerIndex === 6, 'Ring Buffer Producer Index');

console.log(`=== SUMMARY: ${passed} PASSED, ${failed} FAILED ===`);
if (failed > 0) process.exit(1);
