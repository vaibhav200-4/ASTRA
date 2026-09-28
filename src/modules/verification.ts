export interface EvidenceRow {
  name: string;
  category: 'Action' | 'State-change' | 'Protocol-context';
  status: 'PASS' | 'FAIL' | 'UNCERTAIN';
  detail: string;
  timestamp: string;
}

export interface CausalVerificationResult {
  accepted: boolean;
  rejectionReason: string | null;
  evidences: EvidenceRow[];
}

export function evaluateCausalVerification(
  actionObserved: boolean,
  stateChanged: boolean,
  contextValid: boolean,
  simulatedReject: boolean = false,
  rejectReasonCustom?: string
): CausalVerificationResult {
  const timestamp = new Date().toISOString().substring(11, 19);

  if (simulatedReject) {
    const evidences: EvidenceRow[] = [
      {
        name: 'Action Evidence',
        category: 'Action',
        status: 'PASS',
        detail: 'Hand trajectory aligned near container handle (94.2% vector match)',
        timestamp
      },
      {
        name: 'State-change Evidence',
        category: 'State-change',
        status: 'FAIL',
        detail: 'Container micro-switch & optical occlusion indicate NO displacement',
        timestamp
      },
      {
        name: 'Protocol-context Evidence',
        category: 'Protocol-context',
        status: 'PASS',
        detail: 'Current state S2_REMOVE_CONTAINER expects container displacement',
        timestamp
      }
    ];

    return {
      accepted: false,
      rejectionReason: rejectReasonCustom || "Action seen, expected state change NOT observed",
      evidences
    };
  }

  const evidences: EvidenceRow[] = [
    {
      name: 'Action Evidence',
      category: 'Action',
      status: actionObserved ? 'PASS' : 'FAIL',
      detail: actionObserved ? 'Hand grasp & pull motion detected' : 'No valid hand action trajectory',
      timestamp
    },
    {
      name: 'State-change Evidence',
      category: 'State-change',
      status: stateChanged ? 'PASS' : 'FAIL',
      detail: stateChanged ? 'Target object pose shifted 14.2 cm from rack bay' : 'Object pose static in rack bay',
      timestamp
    },
    {
      name: 'Protocol-context Evidence',
      category: 'Protocol-context',
      status: contextValid ? 'PASS' : 'FAIL',
      detail: contextValid ? 'Valid step transition in FSM graph' : 'Invalid step transition in FSM graph',
      timestamp
    }
  ];

  const accepted = actionObserved && stateChanged && contextValid;
  const rejectionReason = accepted
    ? null
    : !stateChanged
    ? "Action seen, expected state change NOT observed"
    : !actionObserved
    ? "State change reported without action confirmation"
    : "Protocol context mismatch";

  return {
    accepted,
    rejectionReason,
    evidences
  };
}
