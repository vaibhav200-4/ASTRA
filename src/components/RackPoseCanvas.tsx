import React from 'react';
import { useMission } from '../context/MissionContext';
import { RotateCw, Move3d, Compass, ShieldCheck } from 'lucide-react';
import type { PoseOrientation } from '../types/mission';

export const RackPoseCanvas: React.FC = () => {
  const { poseOrientation, setPoseOrientation, poseReference, setPoseReference } = useMission();

  // Angle transformation mappings for orientations
  const getRotationDeg = (orientation: PoseOrientation) => {
    switch (orientation) {
      case 'UPRIGHT': return 0;
      case 'TILTED': return 35;
      case 'ROTATED_90': return 90;
      case 'INVERTED': return 180;
      case 'FREE': return 126;
      default: return 0;
    }
  };

  const getPitchYawRoll = (orientation: PoseOrientation) => {
    switch (orientation) {
      case 'UPRIGHT': return { pitch: '+2.1°', yaw: '-1.4°', roll: '+0.5°' };
      case 'TILTED': return { pitch: '+34.2°', yaw: '-18.7°', roll: '+35.0°' };
      case 'ROTATED_90': return { pitch: '+0.0°', yaw: '+90.0°', roll: '+0.0°' };
      case 'INVERTED': return { pitch: '-178.4°', yaw: '+12.1°', roll: '+180.0°' };
      case 'FREE': return { pitch: '+44.8°', yaw: '-62.3°', roll: '+126.3°' };
    }
  };

  const rotDeg = getRotationDeg(poseOrientation);
  const pyr = getPitchYawRoll(poseOrientation);

  return (
    <div className="flex flex-col space-y-4 font-sans">
      {/* Visual Canvas Panel */}
      <div className="relative w-full aspect-video bg-[#040814] rounded-xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col justify-between p-4 select-none">
        {/* Background Coordinate Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1.5px,transparent_1.5px)] [background-size:32px_32px] opacity-15"></div>

        {/* Top Header & Reference Frame Badge */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-3 bg-slate-950/90 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
            <Move3d size={16} className="text-cyan-400" />
            <span className="font-bold font-mono text-white">3D POSE MATRIX</span>
            <span className="text-slate-700">|</span>
            <span className="text-emerald-400 font-mono font-semibold">
              FRAME: {poseReference === 'RACK' ? 'PAYLOAD RACK (FIXED)' : 'CAMERA OPTICAL AXIS'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setPoseReference(poseReference === 'RACK' ? 'CAMERA' : 'RACK')}
              className={`px-3 py-1 text-xs font-mono font-bold rounded-lg border transition-all ${
                poseReference === 'RACK' 
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-[0_0_10px_rgba(245,158,11,0.3)]' 
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              TOGGLE FRAME: {poseReference}
            </button>
          </div>
        </div>

        {/* Central 3D Vector & Skeleton Projection */}
        <div className="relative z-10 flex-1 flex items-center justify-center my-4">
          <svg className="w-full h-full max-h-80 overflow-visible" viewBox="-200 -200 400 400">
            {/* Payload Rack Frame Coordinate Axes (Fixed In Space) */}
            <g opacity={poseReference === 'RACK' ? '1.0' : '0.4'}>
              {/* X Axis (Red) */}
              <line x1="-120" y1="0" x2="140" y2="0" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 2" />
              <text x="148" y="4" fill="#ef4444" fontSize="12" fontWeight="bold" fontFamily="monospace">X_RACK</text>
              
              {/* Y Axis (Green) */}
              <line x1="0" y1="-120" x2="0" y2="140" stroke="#10b981" strokeWidth="2" strokeDasharray="4 2" />
              <text x="-12" y="-128" fill="#10b981" fontSize="12" fontWeight="bold" fontFamily="monospace">Y_RACK</text>

              {/* Z Axis (Cyan Depth) */}
              <line x1="80" y1="80" x2="-80" y2="-80" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4 2" />
              <text x="-110" y="-85" fill="#06b6d4" fontSize="12" fontWeight="bold" fontFamily="monospace">Z_DEPTH</text>
            </g>

            {/* Astronaut Pose Skeleton Group — Rotates smoothly according to microgravity orientation */}
            <g 
              transform={`rotate(${rotDeg})`}
              className="transition-transform duration-700 ease-out"
            >
              {/* Torso Bounding Frustum */}
              <rect x="-35" y="-70" width="70" height="110" fill="rgba(6, 182, 212, 0.1)" stroke="#06b6d4" strokeWidth="1.5" rx="4" />

              {/* Skeleton Keypoint Nodes */}
              {/* Head */}
              <circle cx="0" cy="-85" r="14" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
              <circle cx="0" cy="-85" r="5" fill="#f59e0b" />
              
              {/* Shoulders */}
              <circle cx="-25" cy="-60" r="4" fill="#22d3ee" />
              <circle cx="25" cy="-60" r="4" fill="#22d3ee" />
              <line x1="-25" y1="-60" x2="25" y2="-60" stroke="#22d3ee" strokeWidth="2.5" />

              {/* Spine */}
              <line x1="0" y1="-85" x2="0" y2="0" stroke="#22d3ee" strokeWidth="2.5" />

              {/* Left Arm */}
              <line x1="-25" y1="-60" x2="-45" y2="-20" stroke="#22d3ee" strokeWidth="2.5" />
              <line x1="-45" y1="-20" x2="-55" y2="20" stroke="#22d3ee" strokeWidth="2.5" />
              <circle cx="-55" cy="20" r="4" fill="#22d3ee" />

              {/* Right Arm (Reaching toward rack) */}
              <line x1="25" y1="-60" x2="48" y2="-25" stroke="#22d3ee" strokeWidth="3" />
              <line x1="48" y1="-25" x2="65" y2="-5" stroke="#22d3ee" strokeWidth="3" />
              <circle cx="65" cy="-5" r="6" fill="#f59e0b" stroke="#FFFFFF" strokeWidth="1.5" />

              {/* Hips */}
              <circle cx="-20" cy="0" r="4" fill="#22d3ee" />
              <circle cx="20" cy="0" r="4" fill="#22d3ee" />
              <line x1="-20" y1="0" x2="20" y2="0" stroke="#22d3ee" strokeWidth="2.5" />

              {/* Legs */}
              <line x1="-20" y1="0" x2="-25" y2="45" stroke="#22d3ee" strokeWidth="2.5" />
              <line x1="-25" y1="45" x2="-30" y2="85" stroke="#22d3ee" strokeWidth="2.5" />

              <line x1="20" y1="0" x2="25" y2="45" stroke="#22d3ee" strokeWidth="2.5" />
              <line x1="25" y1="45" x2="30" y2="85" stroke="#22d3ee" strokeWidth="2.5" />

              {/* Orientation Vector Indicator */}
              <line x1="0" y1="-85" x2="0" y2="-120" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 2" />
              <polygon points="0,-128 -5,-118 5,-118" fill="#f59e0b" />
              <text x="8" y="-120" fill="#f59e0b" fontSize="10" fontWeight="bold" fontFamily="monospace">HEAD_VECTOR</text>
            </g>
          </svg>
        </div>

        {/* Bottom Live Pitch / Yaw / Roll Telemetry Bar */}
        <div className="relative z-10 bg-slate-950/90 p-3 rounded-lg border border-slate-800 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-slate-200">
          <div className="flex items-center space-x-4">
            <div>
              <span className="text-slate-400 text-[10px] block">PITCH</span>
              <span className="font-bold text-cyan-400 text-sm">{pyr.pitch}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">YAW</span>
              <span className="font-bold text-cyan-400 text-sm">{pyr.yaw}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">ROLL</span>
              <span className="font-bold text-cyan-400 text-sm">{pyr.roll}</span>
            </div>
          </div>

          <div className="bg-slate-900 px-3 py-1 rounded-md border border-slate-800 text-right">
            <span className="text-[10px] text-slate-400 block">REFERENCE COORDINATES</span>
            <span className="font-bold text-emerald-400 text-xs">
              {poseReference === 'RACK' ? 'PAYLOAD RACK (GRAVITY INDEPENDENT)' : 'CAMERA SENSOR OPTICS'}
            </span>
          </div>
        </div>
      </div>

      {/* Orientation Selector Control Bar */}
      <div className="glass-card p-3.5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-white">
        <div className="flex items-center space-x-2">
          <RotateCw size={16} className="text-amber-400" />
          <span className="font-bold font-mono text-xs">MICROGRAVITY POSTURE PRESETS:</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {(['UPRIGHT', 'TILTED', 'ROTATED_90', 'INVERTED', 'FREE'] as PoseOrientation[]).map(mode => (
            <button
              key={mode}
              onClick={() => setPoseOrientation(mode)}
              className={`px-3 py-1.5 text-xs font-mono font-bold rounded-xl transition-all ${
                poseOrientation === mode 
                  ? 'bg-amber-500 text-slate-950 font-extrabold shadow-[0_0_10px_rgba(245,158,11,0.3)]' 
                  : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {mode.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
