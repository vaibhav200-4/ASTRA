export interface BoundingBox {
  x: number;      // % from left
  y: number;      // % from top
  width: number;  // % width
  height: number; // % height
}

export interface RoiState {
  stepId: number;
  roiBox: BoundingBox;
  pixelsProcessedPercent: number;
  computeSavingPercent: number;
  targetLabel: string;
}

export function getAdaptiveRoiForStep(stepId: number, marginPercent: number = 15): RoiState {
  let roiBox: BoundingBox;
  let targetLabel = 'Payload Rack Full Field of View';

  switch (stepId) {
    case 1:
      // Step 1: Open Red Box (Center-Right interaction zone)
      roiBox = { x: 42, y: 45, width: 32, height: 38 };
      targetLabel = 'Red Experiment Box Latches (ROI 01)';
      break;
    case 2:
      // Step 2: Remove Yellow Container (Center zone)
      roiBox = { x: 46, y: 40, width: 28, height: 34 };
      targetLabel = 'Yellow Container Handle & Bay (ROI 02)';
      break;
    case 3:
      // Step 3: Place Container (Right Bay zone)
      roiBox = { x: 60, y: 35, width: 30, height: 42 };
      targetLabel = 'Rack Mounting Slot 03 (ROI 03)';
      break;
    default:
      roiBox = { x: 10, y: 10, width: 80, height: 80 };
      targetLabel = 'Full Rack Inspection Zone';
      break;
  }

  // Expand box by margin
  const marginX = (roiBox.width * marginPercent) / 100;
  const marginY = (roiBox.height * marginPercent) / 100;

  const finalBox: BoundingBox = {
    x: Math.max(0, Math.round(roiBox.x - marginX / 2)),
    y: Math.max(0, Math.round(roiBox.y - marginY / 2)),
    width: Math.min(100, Math.round(roiBox.width + marginX)),
    height: Math.min(100, Math.round(roiBox.height + marginY)),
  };

  const areaPercent = Math.round((finalBox.width * finalBox.height) / 100);
  const computeSavingPercent = 100 - areaPercent;

  return {
    stepId,
    roiBox: finalBox,
    pixelsProcessedPercent: areaPercent,
    computeSavingPercent,
    targetLabel
  };
}
