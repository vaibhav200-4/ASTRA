export interface RingBufferSlot {
  index: number;
  frameId: number;
  timestamp: string;
  status: 'EMPTY' | 'WRITING' | 'READY' | 'READING';
  fps: number;
}

export interface RingBufferState {
  capacity: number;
  headProducerIndex: number;
  tailConsumerIndex: number;
  occupancyCount: number;
  droppedFramesCount: number;
  latencyMs: number;
  slots: RingBufferSlot[];
  cacheAlignmentNote: string;
}

export function createInitialRingBuffer(capacity: number = 16): RingBufferState {
  const slots: RingBufferSlot[] = Array.from({ length: capacity }, (_, i) => ({
    index: i,
    frameId: i < 6 ? 100 + i : 0,
    timestamp: i < 6 ? `10:42:${10 + i}` : '-',
    status: i === 5 ? 'WRITING' : i === 0 ? 'READING' : i < 5 ? 'READY' : 'EMPTY',
    fps: 24
  }));

  return {
    capacity,
    headProducerIndex: 5,
    tailConsumerIndex: 0,
    occupancyCount: 5,
    droppedFramesCount: 0,
    latencyMs: 14.2,
    slots,
    cacheAlignmentNote: 'cache-aligned C++ lock-free SPSC (design), UI shows simulation'
  };
}

export function stepRingBufferSimulation(
  prev: RingBufferState,
  thermalThrottleFps: number = 24
): RingBufferState {
  const capacity = prev.capacity;
  let newProducer = (prev.headProducerIndex + 1) % capacity;
  let newConsumer = prev.tailConsumerIndex;
  let dropped = prev.droppedFramesCount;

  // Check if buffer is full (overflow)
  const isFull = ((prev.headProducerIndex + 1) % capacity) === prev.tailConsumerIndex;
  if (isFull) {
    dropped += 1; // Producer drops frame because consumer is too slow under thermal throttling!
  } else {
    // Consumer advances if there is data
    if (prev.occupancyCount > 1) {
      newConsumer = (prev.tailConsumerIndex + 1) % capacity;
    }
  }

  const occupancyCount = (newProducer - newConsumer + capacity) % capacity;
  const frameId = 100 + newProducer + Math.floor(Math.random() * 50);

  const slots = prev.slots.map((s, idx) => {
    if (idx === newProducer) {
      return { idx, index: idx, frameId, timestamp: new Date().toISOString().substring(11, 19), status: 'WRITING', fps: thermalThrottleFps } as RingBufferSlot;
    }
    if (idx === newConsumer) {
      return { idx, index: idx, frameId: s.frameId, timestamp: s.timestamp, status: 'READING', fps: thermalThrottleFps } as RingBufferSlot;
    }
    if ((newConsumer < newProducer && idx > newConsumer && idx < newProducer) ||
        (newProducer < newConsumer && (idx > newConsumer || idx < newProducer))) {
      return { idx, index: idx, frameId: s.frameId, timestamp: s.timestamp, status: 'READY', fps: thermalThrottleFps } as RingBufferSlot;
    }
    return { idx, index: idx, frameId: 0, timestamp: '-', status: 'EMPTY', fps: thermalThrottleFps } as RingBufferSlot;
  });

  const latencyMs = Number((occupancyCount * (1000 / thermalThrottleFps)).toFixed(1));

  return {
    capacity,
    headProducerIndex: newProducer,
    tailConsumerIndex: newConsumer,
    occupancyCount,
    droppedFramesCount: dropped,
    latencyMs,
    slots,
    cacheAlignmentNote: prev.cacheAlignmentNote
  };
}
