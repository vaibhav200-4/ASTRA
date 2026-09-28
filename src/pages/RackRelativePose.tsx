import React from 'react';
import { useMission } from '../context/MissionContext';
import { Layers, RotateCw, Compass, ShieldCheck, Zap } from 'lucide-react';

export const RackRelativePose: React.FC = () => {
  const { poseData, poseAngle, randomizeOrientation, resetOrientation, language } = useMission();

  const R = poseData.transform.rotationMatrix;
  const t = poseData.transform.translationVector;

  return (
    <div className="space-y-4 font-sans">
      {/* Header */}
      <div className="isro-card p-4 bg-white dark:bg-[#0A1A33] border-l-4 border-l-[#123F8C] flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 text-[#123F8C] dark:text-cyan-400 font-mono text-xs font-semibold mb-0.5">
            <Layers size={14} />
            <span>PART D — ORIENTATION-AGNOSTIC RACK-FRAME POSE</span>
          </div>
          <h1 className="text-lg font-bold text-[#0B2A5B] dark:text-white">
            Microgravity Rack-Relative Pose Estimator
          </h1>
          <p className="text-xs text-[#5B6675] dark:text-slate-300">
            Rigid body pose transformation: <span className="font-mono font-semibold text-[#F26B21]">J_rack = R_rackᵀ (J_cam − t_rack)</span>. Ground truth invariant in microgravity.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={randomizeOrientation}
            className="btn-isro-cta"
          >
            <RotateCw size={14} />
            <span>Randomize Astronaut Orientation</span>
          </button>
          {poseAngle !== 0 && (
            <button 
              onClick={resetOrientation}
              className="btn-isro-outline"
            >
              <span>Reset Orientation</span>
            </button>
          )}
        </div>
      </div>

      {/* Explanation Banner */}
      <div className="isro-card p-3.5 bg-[#EEF3FA] dark:bg-slate-900 border border-[#D5DCE6] dark:border-slate-800 text-xs font-mono space-y-1">
        <div className="flex items-center justify-between font-bold text-[#0B2A5B] dark:text-cyan-300">
          <span className="flex items-center gap-1.5">
            <Compass size={14} className="text-[#F26B21]" />
            <span>CRITICAL DESIGN NOTE: No gravity reference — rack is the origin.</span>
          </span>
          <span className="bg-[#123F8C] text-white px-2 py-0.5 rounded text-[10px]">
            ArUco Fiducial Marker Locked
          </span>
        </div>
        <p className="text-[#5B6675] dark:text-slate-300">
          In microgravity, astronauts float freely in any 3D orientation (upside down, sideways). ASTRA-PVT projects all 33 skeleton keypoints into the payload rack's rigid coordinate system so step validation works identically regardless of astronaut posture.
        </p>
      </div>

      {/* Transform Math & Live Numeric R and t Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left 5 Cols: Live Transform Matrix R & Translation Vector t */}
        <div className="lg:col-span-5 isro-card p-4 bg-white dark:bg-[#0A1A33] space-y-3 font-mono text-xs">
          <h3 className="isro-section-title mb-0 text-xs font-mono">
            Live Rigid Transform Parameters
          </h3>

          {/* 3x3 Rotation Matrix R */}
          <div className="space-y-1 bg-[#F5F7FA] dark:bg-slate-900 p-2.5 rounded border border-[#D5DCE6] dark:border-slate-800">
            <span className="text-[11px] font-bold text-[#0B2A5B] dark:text-slate-200 block">
              3x3 Rotation Matrix R_rack:
            </span>
            <div className="grid grid-cols-3 gap-1 text-center font-mono text-[11px] text-[#123F8C] dark:text-cyan-300 bg-white dark:bg-slate-950 p-2 rounded">
              <span>{R[0][0]}</span><span>{R[0][1]}</span><span>{R[0][2]}</span>
              <span>{R[1][0]}</span><span>{R[1][1]}</span><span>{R[1][2]}</span>
              <span>{R[2][0]}</span><span>{R[2][1]}</span><span>{R[2][2]}</span>
            </div>
          </div>

          {/* 3x1 Translation Vector t */}
          <div className="space-y-1 bg-[#F5F7FA] dark:bg-slate-900 p-2.5 rounded border border-[#D5DCE6] dark:border-slate-800">
            <span className="text-[11px] font-bold text-[#0B2A5B] dark:text-slate-200 block">
              Translation Vector t_rack (cm):
            </span>
            <div className="flex justify-around font-mono text-xs text-[#F26B21] font-bold bg-white dark:bg-slate-950 p-2 rounded">
              <span>X: {t[0]}</span>
              <span>Y: {t[1]}</span>
              <span>Z: {t[2]}</span>
            </div>
          </div>

          {/* Current Rotation Angle */}
          <div className="p-2 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded text-xs text-[#138808] dark:text-emerald-300 font-mono">
            <span>Camera-Frame Orientation Shift: <strong>{poseAngle}°</strong></span>
            <p className="text-[10px] text-[#5B6675] dark:text-slate-400 mt-0.5">
              Notice: As orientation shifts in Camera Frame, Rack Frame coordinates stay 100% constant!
            </p>
          </div>
        </div>

        {/* Right 7 Cols: Interactive SVG Viewport with ArUco Marker and Rack Frame */}
        <div className="lg:col-span-7 isro-card p-4 bg-white dark:bg-[#0A1A33] space-y-3">
          <div className="flex items-center justify-between border-b border-[#EEF3FA] dark:border-slate-800 pb-2">
            <h3 className="isro-section-title mb-0 text-xs">
              Microgravity Pose Projection Canvas
            </h3>
            <span className="text-xs font-mono text-[#138808] font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-300">
              Rack Invariant
            </span>
          </div>

          {/* Interactive SVG Viewport */}
          <div className="relative w-full aspect-video bg-[#06101E] rounded border border-slate-800 overflow-hidden flex items-center justify-center p-4">
            <svg className="w-full h-full max-h-80 overflow-visible" viewBox="-200 -200 400 400">
              {/* ArUco Fiducial Marker Box on Rack */}
              <g transform="translate(-160, -140)">
                <rect x="0" y="0" width="40" height="40" fill="#FFFFFF" stroke="#000000" strokeWidth="2" />
                <rect x="8" y="8" width="12" height="12" fill="#000000" />
                <rect x="24" y="24" width="8" height="8" fill="#000000" />
                <rect x="8" y="24" width="8" height="8" fill="#000000" />
                <text x="48" y="24" fill="#FF9933" fontSize="10" fontFamily="monospace" fontWeight="bold">ArUco ID #42 (Rack Origin)</text>
              </g>

              {/* Fixed Rack Axes (X/Y/Z) */}
              <g>
                {/* X Axis */}
                <line x1="-120" y1="0" x2="140" y2="0" stroke="#F26B21" strokeWidth="2" strokeDasharray="4 2" />
                <text x="145" y="4" fill="#F26B21" fontSize="11" fontWeight="bold" fontFamily="monospace">X_RACK</text>

                {/* Y Axis */}
                <line x1="0" y1="-120" x2="0" y2="140" stroke="#138808" strokeWidth="2" strokeDasharray="4 2" />
                <text x="-12" y="-125" fill="#138808" fontSize="11" fontWeight="bold" fontFamily="monospace">Y_RACK</text>

                {/* Z Depth */}
                <line x1="80" y1="80" x2="-80" y2="-80" stroke="#123F8C" strokeWidth="2" strokeDasharray="4 2" />
                <text x="-115" y="-85" fill="#123F8C" fontSize="11" fontWeight="bold" fontFamily="monospace">Z_RACK</text>
              </g>

              {/* Skeleton Group with Live Orientation Rotation */}
              <g transform={`rotate(${poseAngle})`} className="transition-transform duration-500 ease-in-out">
                {/* Torso Box */}
                <rect x="-35" y="-60" width="70" height="100" fill="rgba(18, 63, 140, 0.2)" stroke="#123F8C" strokeWidth="1.5" rx="4" />
                
                {/* Head */}
                <circle cx="0" cy="-75" r="14" fill="none" stroke="#F26B21" strokeWidth="2" />
                <circle cx="0" cy="-75" r="4" fill="#F26B21" />

                {/* Skeleton Joints */}
                <circle cx="-25" cy="-50" r="4" fill="#138808" />
                <circle cx="25" cy="-50" r="4" fill="#138808" />
                <line x1="-25" y1="-50" x2="25" y2="-50" stroke="#138808" strokeWidth="2" />

                <line x1="0" y1="-75" x2="0" y2="0" stroke="#138808" strokeWidth="2" />

                <line x1="-25" y1="-50" x2="-45" y2="-10" stroke="#138808" strokeWidth="2" />
                <line x1="25" y1="-50" x2="55" y2="-15" stroke="#F26B21" strokeWidth="2.5" />
                <circle cx="55" cy="-15" r="5" fill="#F26B21" />

                <line x1="-20" y1="40" x2="-25" y2="80" stroke="#138808" strokeWidth="2" />
                <line x1="20" y1="40" x2="25" y2="80" stroke="#138808" strokeWidth="2" />
              </g>
            </svg>
          </div>

          {/* Keypoints Coordinate Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="bg-[#EEF3FA] dark:bg-slate-900 text-[#0B2A5B] dark:text-slate-200 border-b border-[#D5DCE6] dark:border-slate-800">
                  <th className="p-2 font-semibold">Keypoint</th>
                  <th className="p-2 font-semibold text-[#123F8C] dark:text-cyan-300">Camera Frame (Cam_X, Cam_Y, Cam_Z)</th>
                  <th className="p-2 font-semibold text-[#138808]">Rack Frame J_rack (Rack_X, Rack_Y, Rack_Z)</th>
                </tr>
              </thead>
              <tbody>
                {poseData.keypoints.map(kp => (
                  <tr key={kp.id} className="border-b border-[#EEF3FA] dark:border-slate-800">
                    <td className="p-2 font-bold text-[#0B2A5B] dark:text-slate-200">{kp.name}</td>
                    <td className="p-2 text-[#123F8C] dark:text-cyan-400">({kp.cameraFrame.x}, {kp.cameraFrame.y}, {kp.cameraFrame.z}) cm</td>
                    <td className="p-2 text-[#138808] font-bold">({kp.rackFrame.x}, {kp.rackFrame.y}, {kp.rackFrame.z}) cm</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
