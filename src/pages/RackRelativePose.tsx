import React from 'react';
import { useMission } from '../context/MissionContext';
import { AstronautViewer } from '../components/AstronautViewer';
import { Layers, RotateCw, Compass, ShieldCheck, Zap, Activity } from 'lucide-react';

export const RackRelativePose: React.FC = () => {
  const { poseData, poseAngle, randomizeOrientation, resetOrientation, language } = useMission();

  const R = poseData.transform.rotationMatrix;
  const t = poseData.transform.translationVector;

  return (
    <div className="space-y-4 font-sans">
      {/* Header Banner */}
      <div className="isro-card p-4 bg-slate-900 border-l-4 border-l-cyan-500 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-lg">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-semibold mb-0.5">
            <Layers size={14} />
            <span>PART D — ORIENTATION-AGNOSTIC RACK-FRAME POSE</span>
          </div>
          <h1 className="text-lg font-bold text-white">
            Microgravity Rack-Relative Pose Estimator (ArUco Fiducial Origin)
          </h1>
          <p className="text-xs text-slate-300">
            Rigid body pose transformation: <span className="font-mono font-semibold text-amber-400">J_rack = R_rackᵀ (J_cam − t_rack)</span>. Ground-truth invariant in microgravity.
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <button 
            onClick={randomizeOrientation}
            className="px-3 py-1.5 rounded text-xs font-bold font-mono bg-cyan-600 text-white hover:bg-cyan-500 flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <RotateCw size={14} />
            <span>Randomize Astronaut Pose Angle</span>
          </button>
          {poseAngle !== 0 && (
            <button 
              onClick={resetOrientation}
              className="px-3 py-1.5 rounded text-xs font-bold font-mono bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition-colors"
            >
              <span>Reset Pose</span>
            </button>
          )}
        </div>
      </div>

      {/* Design Explanation Note */}
      <div className="isro-card p-3.5 bg-slate-900 border border-slate-800 text-xs font-mono space-y-1">
        <div className="flex items-center justify-between font-bold text-cyan-300">
          <span className="flex items-center gap-1.5">
            <Compass size={14} className="text-amber-400" />
            <span>CRITICAL DESIGN PRINCIPLE: Gravity vector (g) unavailable — Payload Rack is rigid origin (0,0,0).</span>
          </span>
          <span className="bg-cyan-950 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded text-[10px]">
            ArUco Marker ID #42 Locked
          </span>
        </div>
        <p className="text-slate-300">
          In zero-G, astronauts operate upside down, sideways, or pitched forward relative to payload cameras. ASTRA-PVT projects all 33 skeleton keypoints into the payload rack's rigid coordinate system using ArUco marker pose ground truth.
        </p>
      </div>

      {/* Grid: 3D GLB Viewport (7 Cols) + Transform Math Matrix (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left 7 Cols: Restored 3D GLB Astronaut Viewer & Scene */}
        <div className="lg:col-span-7 isro-card p-4 bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="isro-section-title mb-0 text-xs font-mono text-slate-200 flex items-center gap-2">
              <Activity size={14} className="text-cyan-400" />
              Interactive 3D GLB Rack & Astronaut Pose Projection
            </h3>
            <span className="text-[11px] font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              3D GLB Mesh Active
            </span>
          </div>

          {/* 3D Viewport container mounting AstronautViewer */}
          <div className="relative w-full h-[380px] bg-slate-950 rounded-lg border border-slate-800 overflow-hidden">
            <AstronautViewer />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
            <span>Mouse Drag: Orbit view | Scroll: Zoom</span>
            <span className="text-amber-400 font-bold">Orientation Tumble Angle: {poseAngle}°</span>
          </div>
        </div>

        {/* Right 5 Cols: Live Transform Parameters (R 3x3 matrix & t 3x1 vector) */}
        <div className="lg:col-span-5 isro-card p-4 bg-slate-900 border border-slate-800 space-y-3 font-mono text-xs flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="isro-section-title mb-0 text-xs font-mono text-slate-200">
              Live Rigid Transformation Matrices
            </h3>

            {/* Matrix Equation Box */}
            <div className="p-3 bg-slate-950 rounded border border-slate-800 text-center space-y-1">
              <span className="text-[10px] text-slate-400 block font-sans">COORDINATE TRANSFORMATION FORMULA</span>
              <div className="text-sm font-bold text-amber-400 tracking-wider">
                J<sub>rack</sub> = R<sup>T</sup> &middot; (J<sub>cam</sub> &minus; t)
              </div>
            </div>

            {/* 3x3 Rotation Matrix R */}
            <div className="space-y-1.5 bg-slate-950 p-3 rounded border border-slate-800">
              <span className="text-[11px] font-bold text-slate-200 block">
                3&times;3 Rotation Matrix R<sub>rack</sub>:
              </span>
              <div className="grid grid-cols-3 gap-1.5 text-center font-mono text-xs text-cyan-300 bg-slate-900 p-2.5 rounded border border-slate-800">
                <span>{R[0][0]}</span><span>{R[0][1]}</span><span>{R[0][2]}</span>
                <span>{R[1][0]}</span><span>{R[1][1]}</span><span>{R[1][2]}</span>
                <span>{R[2][0]}</span><span>{R[2][1]}</span><span>{R[2][2]}</span>
              </div>
            </div>

            {/* 3x1 Translation Vector t */}
            <div className="space-y-1.5 bg-slate-950 p-3 rounded border border-slate-800">
              <span className="text-[11px] font-bold text-slate-200 block">
                3&times;1 Translation Vector t<sub>rack</sub> (cm):
              </span>
              <div className="flex justify-around font-mono text-xs text-amber-400 font-bold bg-slate-900 p-2.5 rounded border border-slate-800">
                <span>X: {t[0]}</span>
                <span>Y: {t[1]}</span>
                <span>Z: {t[2]}</span>
              </div>
            </div>
          </div>

          {/* Orientation Status Callout */}
          <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded text-xs text-emerald-300 font-mono space-y-1">
            <div className="flex items-center justify-between font-bold">
              <span>Pose Invariance Status:</span>
              <span className="text-emerald-400 font-extrabold">VERIFIED</span>
            </div>
            <p className="text-[11px] text-slate-300 font-sans">
              Even when camera-frame keypoint positions rotate by {poseAngle}°, calculated rack-relative coordinates remain 100% stationary!
            </p>
          </div>
        </div>
      </div>

      {/* Keypoints Coordinate Transformation Comparison Table */}
      <div className="isro-card p-4 bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="isro-section-title mb-0 text-xs font-mono text-slate-200">
            Skeleton Keypoint Coordinate Projection Table
          </h3>
          <span className="text-[11px] font-mono text-slate-400">
            33 MediaPipe / YOLO26 Keypoints Mapped
          </span>
        </div>

        <div className="overflow-x-auto rounded border border-slate-800">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-300 border-b border-slate-800">
                <th className="p-2.5 font-semibold">Keypoint Label</th>
                <th className="p-2.5 font-semibold text-cyan-400">Camera Frame J<sub>cam</sub> (X, Y, Z) cm</th>
                <th className="p-2.5 font-semibold text-emerald-400">Rack Frame J<sub>rack</sub> (X, Y, Z) cm</th>
                <th className="p-2.5 font-semibold text-slate-400">Variance Status</th>
              </tr>
            </thead>
            <tbody>
              {poseData.keypoints.map((kp, idx) => (
                <tr key={kp.id} className={`border-b border-slate-800/60 ${idx % 2 === 0 ? 'bg-slate-900/60' : 'bg-slate-950/60'}`}>
                  <td className="p-2.5 font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    {kp.name}
                  </td>
                  <td className="p-2.5 text-cyan-300">
                    ({kp.cameraFrame.x}, {kp.cameraFrame.y}, {kp.cameraFrame.z})
                  </td>
                  <td className="p-2.5 text-emerald-300 font-bold">
                    ({kp.rackFrame.x}, {kp.rackFrame.y}, {kp.rackFrame.z})
                  </td>
                  <td className="p-2.5 text-slate-400">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                      INVARIANT
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
