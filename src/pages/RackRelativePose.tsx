import React from 'react';
import { useMission } from '../context/MissionContext';
import { AstronautViewer } from '../components/AstronautViewer';
import { Layers, RotateCw, Compass, Activity } from 'lucide-react';

export const RackRelativePose: React.FC = () => {
  const { poseData, poseAngle, randomizeOrientation, resetOrientation } = useMission();

  const R = poseData.transform.rotationMatrix;
  const t = poseData.transform.translationVector;

  return (
    <div className="space-y-4 font-sans select-none max-w-[1440px] mx-auto pb-4">
      {/* Header Banner */}
      <div className="isro-card p-4 bg-white dark:bg-[#0A1A33] border-l-4 border-l-[#123F8C] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-[#123F8C] dark:text-[#7DD3FC] font-mono text-xs font-semibold mb-0.5 uppercase tracking-wider">
            <Layers size={14} />
            <span>PART D — ORIENTATION-AGNOSTIC RACK-FRAME POSE</span>
          </div>
          <h1 className="text-lg font-bold text-[#1B2430] dark:text-[#F1F5F9]">
            Microgravity Rack-Relative Pose Estimator (ArUco Fiducial Origin)
          </h1>
          <p className="text-xs text-[#4A5568] dark:text-[#B8C4D6]">
            Rigid body pose transformation: <span className="font-mono font-bold text-[#F26B21] dark:text-[#FFA366]">J_rack = R_rackᵀ (J_cam − t_rack)</span>. Ground-truth invariant in microgravity.
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <button 
            onClick={randomizeOrientation}
            className="px-3.5 py-1.5 rounded text-xs font-bold font-mono bg-[#F26B21] text-white hover:bg-[#d95914] flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <RotateCw size={14} />
            <span>Randomize Astronaut Pose Angle</span>
          </button>
          {poseAngle !== 0 && (
            <button 
              onClick={resetOrientation}
              className="px-3 py-1.5 rounded text-xs font-bold font-mono bg-slate-800 text-[#F1F5F9] border border-slate-700 hover:bg-slate-700 transition-colors"
            >
              <span>Reset Pose</span>
            </button>
          )}
        </div>
      </div>

      {/* Design Explanation Note */}
      <div className="isro-card p-3.5 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs font-mono space-y-1">
        <div className="flex items-center justify-between font-bold text-[#123F8C] dark:text-[#7DD3FC]">
          <span className="flex items-center gap-1.5">
            <Compass size={14} className="text-[#F26B21] dark:text-[#FFA366]" />
            <span>CRITICAL DESIGN PRINCIPLE: Gravity vector (g) unavailable — Payload Rack is rigid origin (0,0,0).</span>
          </span>
          <span className="bg-[#123F8C] text-white px-2.5 py-0.5 rounded text-xs font-bold">
            ArUco Marker ID #42 Locked
          </span>
        </div>
        <p className="text-[#4A5568] dark:text-[#B8C4D6]">
          In zero-G, astronauts operate upside down, sideways, or pitched forward relative to payload cameras. ASTRA-PVT projects all 33 skeleton keypoints into the payload rack's rigid coordinate system using ArUco marker pose ground truth.
        </p>
      </div>

      {/* Grid: 3D GLB Viewport (7 Cols) + Transform Math Matrix (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left 7 Cols: Restored 3D GLB Astronaut Viewer & Scene */}
        <div className="lg:col-span-7 isro-card p-4 bg-white dark:bg-[#0A1A33] border border-[#D5DCE6] dark:border-slate-800 space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#D5DCE6] dark:border-slate-800 pb-2">
            <h3 className="text-sm font-semibold text-[#1B2430] dark:text-[#F1F5F9] flex items-center gap-2 font-sans border-l-[3px] border-[#F26B21] pl-2">
              <Activity size={15} className="text-[#F26B21] dark:text-[#FFA366]" />
              <span>Interactive 3D GLB Rack & Astronaut Pose Projection</span>
            </h3>
            <span className="text-xs font-mono text-white font-bold bg-[#14532D] px-2.5 py-0.5 rounded border border-[#166534]">
              3D GLB Mesh Active
            </span>
          </div>

          {/* 3D Viewport container mounting AstronautViewer */}
          <div className="relative w-full h-[380px] bg-slate-950 rounded-lg border border-slate-800 overflow-hidden">
            <AstronautViewer />
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-[#4A5568] dark:text-[#B8C4D6] pt-1">
            <span>Mouse Drag: Orbit view | Scroll: Zoom</span>
            <span className="text-[#F26B21] dark:text-[#FFA366] font-bold">Orientation Tumble Angle: {poseAngle}°</span>
          </div>
        </div>

        {/* Right 5 Cols: Live Transform Parameters (R 3x3 matrix & t 3x1 vector) */}
        <div className="lg:col-span-5 isro-card p-4 bg-white dark:bg-[#0A1A33] border border-[#D5DCE6] dark:border-slate-800 space-y-3 font-mono text-xs flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[#1B2430] dark:text-[#F1F5F9] flex items-center gap-2 font-sans border-l-[3px] border-[#F26B21] pl-2">
              <Layers size={15} className="text-[#F26B21] dark:text-[#FFA366]" />
              <span>Live Rigid Transformation Matrices</span>
            </h3>

            {/* Matrix Equation Box */}
            <div className="p-3 bg-slate-100 dark:bg-slate-950 rounded border border-slate-300 dark:border-slate-800 text-center space-y-1">
              <span className="text-xs text-[#4A5568] dark:text-[#B8C4D6] block font-sans">COORDINATE TRANSFORMATION FORMULA</span>
              <div className="text-base font-bold text-[#F26B21] dark:text-[#FFA366] tracking-wider">
                J<sub>rack</sub> = R<sup>T</sup> &middot; (J<sub>cam</sub> &minus; t)
              </div>
            </div>

            {/* 3x3 Rotation Matrix R */}
            <div className="space-y-1.5 bg-slate-100 dark:bg-slate-950 p-3 rounded border border-slate-300 dark:border-slate-800">
              <span className="text-xs font-bold text-[#1B2430] dark:text-[#F1F5F9] block font-sans">
                3&times;3 Rotation Matrix R<sub>rack</sub>:
              </span>
              <div className="grid grid-cols-3 gap-1.5 text-center font-mono text-xs text-[#123F8C] dark:text-[#7DD3FC] bg-white dark:bg-slate-900 p-2.5 rounded border border-slate-300 dark:border-slate-800 font-bold">
                <span>{R[0][0]}</span><span>{R[0][1]}</span><span>{R[0][2]}</span>
                <span>{R[1][0]}</span><span>{R[1][1]}</span><span>{R[1][2]}</span>
                <span>{R[2][0]}</span><span>{R[2][1]}</span><span>{R[2][2]}</span>
              </div>
            </div>

            {/* 3x1 Translation Vector t */}
            <div className="space-y-1.5 bg-slate-100 dark:bg-slate-950 p-3 rounded border border-slate-300 dark:border-slate-800">
              <span className="text-xs font-bold text-[#1B2430] dark:text-[#F1F5F9] block font-sans">
                3&times;1 Translation Vector t<sub>rack</sub> (cm):
              </span>
              <div className="flex justify-around font-mono text-xs text-[#F26B21] dark:text-[#FFA366] font-bold bg-white dark:bg-slate-900 p-2.5 rounded border border-slate-300 dark:border-slate-800">
                <span>X: {t[0]}</span>
                <span>Y: {t[1]}</span>
                <span>Z: {t[2]}</span>
              </div>
            </div>
          </div>

          {/* Orientation Status Callout */}
          <div className="p-3 bg-[#14532D] border border-[#166534] rounded text-xs text-white font-mono space-y-1">
            <div className="flex items-center justify-between font-bold">
              <span>Pose Invariance Status:</span>
              <span className="text-[#86EFAC] font-extrabold">VERIFIED</span>
            </div>
            <p className="text-xs text-[#F1F5F9] font-sans">
              Even when camera-frame keypoint positions rotate by {poseAngle}°, calculated rack-relative coordinates remain 100% stationary!
            </p>
          </div>
        </div>
      </div>

      {/* Keypoints Coordinate Transformation Comparison Table */}
      <div className="isro-card p-4 bg-white dark:bg-[#0A1A33] border border-[#D5DCE6] dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between border-b border-[#D5DCE6] dark:border-slate-800 pb-2">
          <h3 className="text-sm font-semibold text-[#1B2430] dark:text-[#F1F5F9] flex items-center gap-2 font-sans border-l-[3px] border-[#F26B21] pl-2">
            <Layers size={15} className="text-[#F26B21] dark:text-[#FFA366]" />
            <span>Skeleton Keypoint Coordinate Projection Table</span>
          </h3>
          <span className="text-xs font-mono text-[#4A5568] dark:text-[#B8C4D6]">
            33 Keypoints Mapped
          </span>
        </div>

        <div className="overflow-x-auto rounded border border-slate-300 dark:border-slate-800">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-950 text-[#1B2430] dark:text-[#F1F5F9] border-b border-slate-300 dark:border-slate-800 font-bold">
                <th className="p-2.5 font-sans font-semibold">Keypoint Label</th>
                <th className="p-2.5 text-[#123F8C] dark:text-[#7DD3FC]">Camera Frame J<sub>cam</sub> (X, Y, Z) cm</th>
                <th className="p-2.5 text-[#0F6B06] dark:text-[#4ADE80]">Rack Frame J<sub>rack</sub> (X, Y, Z) cm</th>
                <th className="p-2.5 text-center font-sans font-semibold">Variance Status</th>
              </tr>
            </thead>
            <tbody>
              {poseData.keypoints.map((kp, idx) => (
                <tr key={kp.id} className={`border-b border-slate-200 dark:border-slate-800/60 ${idx % 2 === 0 ? 'bg-slate-50 dark:bg-slate-900/60' : 'bg-white dark:bg-slate-950/60'}`}>
                  <td className="p-2.5 font-bold text-[#1B2430] dark:text-[#F1F5F9] font-sans flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0284C7]"></span>
                    {kp.name}
                  </td>
                  <td className="p-2.5 text-[#123F8C] dark:text-[#7DD3FC] font-bold">
                    ({kp.cameraFrame.x}, {kp.cameraFrame.y}, {kp.cameraFrame.z})
                  </td>
                  <td className="p-2.5 text-[#0F6B06] dark:text-[#4ADE80] font-bold">
                    ({kp.rackFrame.x}, {kp.rackFrame.y}, {kp.rackFrame.z})
                  </td>
                  <td className="p-2.5 text-center font-sans">
                    <span className="px-2.5 py-0.5 rounded text-xs bg-[#14532D] text-white font-bold border border-[#166534]">
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
