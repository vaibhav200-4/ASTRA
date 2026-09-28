export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface PoseKeypoint {
  id: string;
  name: string;
  cameraFrame: Point3D;
  rackFrame: Point3D;
}

export interface TransformMatrix {
  rotationMatrix: number[][]; // 3x3
  translationVector: number[]; // 3x1
}

// Initial default rack transformation (translation and 3D rotation)
export function getInitialTransform(): TransformMatrix {
  return {
    rotationMatrix: [
      [0.98, -0.17, 0.08],
      [0.17,  0.98, -0.04],
      [-0.07, 0.05, 0.99]
    ],
    translationVector: [12.4, -8.2, 45.0] // cm
  };
}

// Base 3D keypoints in Rack Reference Frame (Ground truth invariant in microgravity)
const baseRackKeypoints: { id: string; name: string; rack: Point3D }[] = [
  { id: 'head', name: 'Head', rack: { x: 0.0, y: 45.0, z: 12.0 } },
  { id: 'neck', name: 'Neck / Spine Base', rack: { x: 0.0, y: 32.0, z: 10.0 } },
  { id: 'r_shoulder', name: 'Right Shoulder', rack: { x: 18.0, y: 30.0, z: 8.0 } },
  { id: 'r_elbow', name: 'Right Elbow', rack: { x: 26.0, y: 15.0, z: 22.0 } },
  { id: 'r_wrist', name: 'Right Wrist / Hand', rack: { x: 34.0, y: 4.0, z: 35.0 } },
  { id: 'l_shoulder', name: 'Left Shoulder', rack: { x: -18.0, y: 30.0, z: 8.0 } },
  { id: 'l_elbow', name: 'Left Elbow', rack: { x: -25.0, y: 18.0, z: 14.0 } },
  { id: 'l_wrist', name: 'Left Wrist', rack: { x: -30.0, y: 8.0, z: 18.0 } },
];

export function computeRackFramePose(
  transform: TransformMatrix,
  randomOrientationAngle: number = 0
): { keypoints: PoseKeypoint[]; transform: TransformMatrix } {
  // If random orientation is requested, apply 3D rotation R_rand to Camera frame coordinates
  let R = transform.rotationMatrix;
  const t = transform.translationVector;

  if (randomOrientationAngle !== 0) {
    const rad = (randomOrientationAngle * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    // Rotate around Z and Y axes for arbitrary 3D microgravity orientation
    R = [
      [cos, -sin, 0],
      [sin, cos, 0],
      [0, 0, 1]
    ];
  }

  // J_cam = R_rack * J_rack + t_rack
  // J_rack = R_rack^T * (J_cam - t_rack)
  const keypoints: PoseKeypoint[] = baseRackKeypoints.map(kp => {
    const r = kp.rack;
    // Compute camera frame coordinates based on current R and t
    const camX = Number((R[0][0] * r.x + R[0][1] * r.y + R[0][2] * r.z + t[0]).toFixed(1));
    const camY = Number((R[1][0] * r.x + R[1][1] * r.y + R[1][2] * r.z + t[1]).toFixed(1));
    const camZ = Number((R[2][0] * r.x + R[2][1] * r.y + R[2][2] * r.z + t[2]).toFixed(1));

    return {
      id: kp.id,
      name: kp.name,
      cameraFrame: { x: camX, y: camY, z: camZ },
      rackFrame: { x: r.x, y: r.y, z: r.z } // Consistently invariant in rack frame!
    };
  });

  return {
    keypoints,
    transform: { rotationMatrix: R, translationVector: t }
  };
}
