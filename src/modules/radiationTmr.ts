export interface TmrCopy<T> {
  id: number;
  data: T;
  isCorrupted: boolean;
  checksum: string;
}

export interface TmrVoteResult<T> {
  consensusValue: T;
  votingOutcome: 'UNANIMOUS' | 'CORRECTED_2_VS_1' | 'FATAL_DISAGREEMENT';
  corruptedCopyId: number | null;
  seusCorrectedCount: number;
  copies: TmrCopy<T>[];
  logMessage: string;
}

function calculateSimpleChecksum(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return '0x' + (hash >>> 0).toString(16).toUpperCase();
}

export function runTmrMajorityVote<T extends { stepId: number; fsmState: string }>(
  copy1Data: T,
  copy2Data: T,
  copy3Data: T,
  currentSeuCount: number = 0,
  injectBitFlipCopyId: number | null = null
): TmrVoteResult<T> {
  let c1 = { ...copy1Data };
  let c2 = { ...copy2Data };
  let c3 = { ...copy3Data };

  let isC1Corrupt = false;
  let isC2Corrupt = false;
  let isC3Corrupt = false;
  let newSeuCount = currentSeuCount;

  if (injectBitFlipCopyId === 1) {
    c1.fsmState = 'CORRUPTED_0xDEAD';
    isC1Corrupt = true;
    newSeuCount += 1;
  } else if (injectBitFlipCopyId === 2) {
    c2.fsmState = 'CORRUPTED_0xDEAD';
    isC2Corrupt = true;
    newSeuCount += 1;
  } else if (injectBitFlipCopyId === 3) {
    c3.fsmState = 'CORRUPTED_0xDEAD';
    isC3Corrupt = true;
    newSeuCount += 1;
  }

  const s1 = JSON.stringify(c1);
  const s2 = JSON.stringify(c2);
  const s3 = JSON.stringify(c3);

  let consensusValue: T = c1;
  let votingOutcome: 'UNANIMOUS' | 'CORRECTED_2_VS_1' | 'FATAL_DISAGREEMENT' = 'UNANIMOUS';
  let corruptedCopyId: number | null = null;
  let logMessage = 'TMR Vote 3/3 Unanimous consensus.';

  if (s1 === s2 && s2 === s3) {
    consensusValue = c1;
    votingOutcome = 'UNANIMOUS';
  } else if (s2 === s3) {
    // Copy 1 is corrupted
    consensusValue = c2;
    votingOutcome = 'CORRECTED_2_VS_1';
    corruptedCopyId = 1;
    logMessage = 'SEU detected in Copy 1! TMR majority vote (2 vs 1) restored valid state from Copy 2 & 3. Scrubbed Copy 1.';
  } else if (s1 === s3) {
    // Copy 2 is corrupted
    consensusValue = c1;
    votingOutcome = 'CORRECTED_2_VS_1';
    corruptedCopyId = 2;
    logMessage = 'SEU detected in Copy 2! TMR majority vote (2 vs 1) restored valid state from Copy 1 & 3. Scrubbed Copy 2.';
  } else if (s1 === s2) {
    // Copy 3 is corrupted
    consensusValue = c1;
    votingOutcome = 'CORRECTED_2_VS_1';
    corruptedCopyId = 3;
    logMessage = 'SEU detected in Copy 3! TMR majority vote (2 vs 1) restored valid state from Copy 1 & 2. Scrubbed Copy 3.';
  } else {
    votingOutcome = 'FATAL_DISAGREEMENT';
    logMessage = 'Fatal TMR triple disagreement detected! Triggering safe backup recovery.';
  }

  const copies: TmrCopy<T>[] = [
    { id: 1, data: c1, isCorrupted: corruptedCopyId === 1 || isC1Corrupt, checksum: calculateSimpleChecksum(s1) },
    { id: 2, data: c2, isCorrupted: corruptedCopyId === 2 || isC2Corrupt, checksum: calculateSimpleChecksum(s2) },
    { id: 3, data: c3, isCorrupted: corruptedCopyId === 3 || isC3Corrupt, checksum: calculateSimpleChecksum(s3) },
  ];

  return {
    consensusValue,
    votingOutcome,
    corruptedCopyId,
    seusCorrectedCount: newSeuCount,
    copies,
    logMessage
  };
}
