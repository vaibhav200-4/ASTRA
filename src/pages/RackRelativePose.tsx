import React from 'react';
import { RackPoseCanvas } from '../components/RackPoseCanvas';
import { Layers, RotateCw, AlertTriangle, ShieldCheck, Compass } from 'lucide-react';

export const RackRelativePose: React.FC = () => {
  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="bg-[#071B33] text-white p-6 rounded-lg shadow-md border border-navy-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-saffron-400 font-mono text-xs font-bold mb-1">
            <Layers size={16} />
            <span>MICROGRAVITY INNOVATION</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold font-mono tracking-tight text-white">
            RACK-RELATIVE 3D POSE ESTIMATION
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Orientation-Agnostic Astronaut Tracking System for Microgravity Operations
          </p>
        </div>

        <div className="bg-navy-900 px-4 py-2 rounded border border-navy-700 font-mono text-xs text-right">
          <span className="text-slate-400 block text-[10px]">COORDINATE SYSTEM</span>
          <span className="font-bold text-saffron-400">PAYLOAD RACK AXES (X, Y, Z)</span>
        </div>
      </div>

      {/* PROMINENT COMPARISON SECTION: THE "NO FIXED UP" PROBLEM */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4 font-sans">
        <h2 className="font-bold font-mono text-sm text-navy-900 tracking-wider flex items-center space-x-2 border-b pb-2">
          <Compass size={18} className="text-saffron-500" />
          <span>THE "NO FIXED UP" PROBLEM IN MICROGRAVITY</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT: Traditional Ground-Based Pose */}
          <div className="p-4 bg-red-50 rounded-lg border border-red-200 space-y-3">
            <div className="flex items-center justify-between border-b border-red-200 pb-2">
              <h3 className="font-bold font-mono text-xs text-red-900">TRADITIONAL GROUND-BASED POSE</h3>
              <span className="text-[10px] font-mono font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                GRAVITY DEPENDENT
              </span>
            </div>

            <ul className="text-xs space-y-2 text-red-900">
              <li className="flex items-start space-x-1.5">
                <span className="text-red-600 font-bold">•</span>
                <span>Relies on constant Earth gravity vector (9.81 m/s²) for vertical alignment.</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <span className="text-red-600 font-bold">•</span>
                <span>Assumes astronaut remains upright relative to floor.</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <span className="text-red-600 font-bold">•</span>
                <span>Fails completely when astronaut floats upside-down or sideways in microgravity.</span>
              </li>
            </ul>
          </div>

          {/* RIGHT: ASTRA-PVT Rack-Relative Pose */}
          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 space-y-3">
            <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
              <h3 className="font-bold font-mono text-xs text-emerald-900">ASTRA-PVT RACK-RELATIVE POSE</h3>
              <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                ORIENTATION AGNOSTIC
              </span>
            </div>

            <ul className="text-xs space-y-2 text-emerald-900">
              <li className="flex items-start space-x-1.5">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Payload rack provides fixed reference frame regardless of astronaut posture.</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Computes 3D pose vectors relative to rack coordinate origin.</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Fully microgravity suitable: seamless protocol recognition upside down, tilted, or rotated.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Quoted Scientific Explanation */}
        <div className="bg-[#071B33] text-white p-4 rounded-lg border-l-4 border-saffron-500 font-mono text-xs leading-relaxed italic">
          "In microgravity an astronaut has no fixed gravitational 'up'. ASTRA-PVT expresses pose relative to the payload rack so protocol recognition can remain orientation-independent."
        </div>
      </div>

      {/* INTERACTIVE 3D POSE CANVAS */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-3">
        <h3 className="font-bold font-mono text-xs text-navy-900 tracking-wider">
          INTERACTIVE RACK-RELATIVE 3D POSE SIMULATOR
        </h3>
        <RackPoseCanvas />
      </div>
    </div>
  );
};
