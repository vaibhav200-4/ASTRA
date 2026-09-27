import React from 'react';
import { RackPoseCanvas } from '../components/RackPoseCanvas';
import { Layers, RotateCw, AlertTriangle, ShieldCheck, Compass } from 'lucide-react';

export const RackRelativePose: React.FC = () => {
  return (
    <div className="space-y-5 font-sans">
      {/* Header */}
      <div className="glass-card bg-gradient-to-r from-slate-900 to-[#0d162a] text-white p-5 rounded-2xl shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold mb-1">
            <Layers size={16} />
            <span>MICROGRAVITY INNOVATION</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold font-mono tracking-tight text-white">
            RACK-RELATIVE 3D POSE ESTIMATION
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Orientation-Agnostic Astronaut Tracking System for Microgravity Operations
          </p>
        </div>

        <div className="bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800 font-mono text-xs text-right">
          <span className="text-slate-400 block text-[10px]">COORDINATE SYSTEM</span>
          <span className="font-bold text-amber-400">PAYLOAD RACK AXES (X, Y, Z)</span>
        </div>
      </div>

      {/* PROMINENT COMPARISON SECTION: THE "NO FIXED UP" PROBLEM */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4 font-sans">
        <h2 className="font-bold font-mono text-sm text-white tracking-wider flex items-center space-x-2 border-b border-slate-800 pb-2">
          <Compass size={18} className="text-amber-400" />
          <span>THE "NO FIXED UP" PROBLEM IN MICROGRAVITY</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* LEFT: Traditional Ground-Based Pose */}
          <div className="p-4 bg-red-950/30 rounded-xl border border-red-800/60 space-y-3">
            <div className="flex items-center justify-between border-b border-red-800/60 pb-2">
              <h3 className="font-bold font-mono text-xs text-red-300">TRADITIONAL GROUND-BASED POSE</h3>
              <span className="text-[10px] font-mono font-bold text-red-300 bg-red-900/60 px-2 py-0.5 rounded-md border border-red-700">
                GRAVITY DEPENDENT
              </span>
            </div>

            <ul className="text-xs space-y-2 text-red-200 font-mono">
              <li className="flex items-start space-x-1.5">
                <span className="text-red-400 font-bold">•</span>
                <span>Relies on constant Earth gravity vector (9.81 m/s²) for vertical alignment.</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <span className="text-red-400 font-bold">•</span>
                <span>Assumes astronaut remains upright relative to floor.</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <span className="text-red-400 font-bold">•</span>
                <span>Fails completely when astronaut floats upside-down or sideways in microgravity.</span>
              </li>
            </ul>
          </div>

          {/* RIGHT: ASTRA-PVT Rack-Relative Pose */}
          <div className="p-4 bg-emerald-950/30 rounded-xl border border-emerald-800/60 space-y-3">
            <div className="flex items-center justify-between border-b border-emerald-800/60 pb-2">
              <h3 className="font-bold font-mono text-xs text-emerald-300">ASTRA-PVT RACK-RELATIVE POSE</h3>
              <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-900/60 px-2 py-0.5 rounded-md border border-emerald-700">
                ORIENTATION AGNOSTIC
              </span>
            </div>

            <ul className="text-xs space-y-2 text-emerald-200 font-mono">
              <li className="flex items-start space-x-1.5">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Payload rack provides fixed reference frame regardless of astronaut posture.</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Computes 3D pose vectors relative to rack coordinate origin.</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Fully microgravity suitable: seamless protocol recognition upside down or rotated.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Quoted Scientific Explanation */}
        <div className="bg-slate-950/80 text-white p-4 rounded-xl border-l-4 border-amber-400 font-mono text-xs leading-relaxed italic">
          "In microgravity an astronaut has no fixed gravitational 'up'. ASTRA-PVT expresses pose relative to the payload rack so protocol recognition can remain orientation-independent."
        </div>
      </div>

      {/* INTERACTIVE 3D POSE CANVAS */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 shadow-xl space-y-3">
        <h3 className="font-bold font-mono text-xs text-white tracking-wider flex items-center space-x-2">
          <RotateCw size={14} className="text-cyan-400" />
          <span>INTERACTIVE RACK-RELATIVE 3D POSE SIMULATOR</span>
        </h3>
        <RackPoseCanvas />
      </div>
    </div>
  );
};
