export type FsmTransitionType = 'VALID' | 'SKIPPED' | 'REPEATED' | 'OUT_OF_ORDER' | 'UNVERIFIED';

export interface FsmStateNode {
  id: string;
  label: string;
  description: string;
  stepIndex: number;
}

export const FSM_NODES: FsmStateNode[] = [
  { id: 'S0_READY', label: 'S0: Ready', description: 'Experiment area initialized', stepIndex: 0 },
  { id: 'S1_OPEN_BOX', label: 'S1: Open Red Box', description: 'Unlock lid latches and open box', stepIndex: 1 },
  { id: 'S2_REMOVE_CONTAINER', label: 'S2: Remove Container', description: 'Extract yellow container from box', stepIndex: 2 },
  { id: 'S3_PLACE_CONTAINER', label: 'S3: Place in Rack', description: 'Secure container into rack slot', stepIndex: 3 },
  { id: 'COMPLETE', label: 'Complete', description: 'All protocol validation rules satisfied', stepIndex: 4 },
];

export interface FsmValidationResult {
  transitionType: FsmTransitionType;
  alertLevel: 'NOMINAL' | 'WARNING' | 'CRITICAL';
  currentState: string;
  expectedNextState: string;
  observedNextState: string;
  message: string;
}

export function validateFsmTransition(
  currentState: string,
  targetState: string
): FsmValidationResult {
  const currentIndex = FSM_NODES.findIndex(n => n.id === currentState);
  const targetIndex = FSM_NODES.findIndex(n => n.id === targetState);

  if (targetIndex === currentIndex + 1) {
    return {
      transitionType: 'VALID',
      alertLevel: 'NOMINAL',
      currentState,
      expectedNextState: targetState,
      observedNextState: targetState,
      message: `Valid transition: ${currentState} → ${targetState}`
    };
  }

  if (targetIndex === currentIndex) {
    return {
      transitionType: 'REPEATED',
      alertLevel: 'WARNING',
      currentState,
      expectedNextState: FSM_NODES[currentIndex + 1]?.id || 'COMPLETE',
      observedNextState: targetState,
      message: `Repeated step detected: ${currentState} performed again`
    };
  }

  if (targetIndex > currentIndex + 1) {
    return {
      transitionType: 'SKIPPED',
      alertLevel: 'CRITICAL',
      currentState,
      expectedNextState: FSM_NODES[currentIndex + 1]?.id || 'COMPLETE',
      observedNextState: targetState,
      message: `Skipped step violation: Jumped from ${currentState} to ${targetState} without completing intermediate step`
    };
  }

  return {
    transitionType: 'OUT_OF_ORDER',
    alertLevel: 'CRITICAL',
    currentState,
    expectedNextState: FSM_NODES[currentIndex + 1]?.id || 'COMPLETE',
    observedNextState: targetState,
    message: `Out-of-order execution: Cannot transition backward from ${currentState} to ${targetState}`
  };
}
