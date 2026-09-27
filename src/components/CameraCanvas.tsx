import React, { useRef, useState } from 'react';
import { useMission } from '../context/MissionContext';
import { Upload, Eye, Cpu, Activity, Info, Target, Sparkles } from 'lucide-react';

interface TooltipInfo {
  x: number;
  y: number;
  title: string;
  confidence: number;
  details: string[];
  color: string;
}

export const CameraCanvas: React.FC = () => {
  const { 
    cameraMode, overlaySettings, currentStep, trackingStatus,
    customVideoUrl, setCustomVideoUrl, activityConfidence
  } = useMission();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredTooltip, setHoveredTooltip] = useState<TooltipInfo | null>(null);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomVideoUrl(url);
    }
  };

  // Hand position shift based on step
  const rightHandX = currentStep === 1 ? 52 : currentStep === 2 ? 62 : 78;
  const rightHandY = currentStep === 1 ? 62 : currentStep === 2 ? 50 : 38;

  // Container BBox position based on step
  const containerX = currentStep === 1 ? 54 : currentStep === 2 ? 60 : 76;
  const containerY = currentStep === 1 ? 56 : currentStep === 2 ? 46 : 34;

  const handleMouseEnter = (e: React.MouseEvent, title: string, confidence: number, details: string[], color: string) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setHoveredTooltip({ x, y, title, confidence, details, color });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || !hoveredTooltip) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setHoveredTooltip(prev => prev ? { ...prev, x, y } : null);
  };

  const handleMouseLeave = () => {
    setHoveredTooltip(null);
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full aspect-video bg-[#040814] rounded-xl border border-cyan-900/40 overflow-hidden shadow-[0_0_25px_rgba(0,0,0,0.8)] font-mono text-xs select-none group"
    >
      {/* Background Video Element if user uploaded custom video */}
      {customVideoUrl ? (
        <video 
          src={customVideoUrl} 
          autoPlay 
          loop 
          muted 
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        /* Dark Mission Control Grid & Payload Rack Sci-Fi Graphics */
        <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px] opacity-15"></div>
      )}

      {/* Grid Scanline Overlay */}
      <div className="absolute inset-0 scanline-bg pointer-events-none opacity-20"></div>

      {/* SVG Canvas Overlay for AI Bounding Boxes, Skeletons, HOI Vectors */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <radialGradient id="cyanGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </radialGradient>
          <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Payload Rack Frame Wireframe */}
        <rect 
          x="5%" y="5%" width="90%" height="90%" 
          fill="none" stroke="#0891b2" strokeWidth="1" strokeDasharray="6 4" opacity="0.4"
        />
        <text x="6%" y="8.5%" fill="#22d3ee" fontSize="10" fontWeight="600" opacity="0.8">
          PAYLOAD RACK #01 — BOUNDS (X: -1.2m to +1.2m, Y: 0.0m to 2.4m)
        </text>

        {/* 1. BOUNDING BOXES LAYER */}
        {overlaySettings.boundingBoxes && (
          <>
            {/* Astronaut Bounding Box */}
            <g className="cursor-pointer pointer-events-auto">
              <rect 
                x="18%" y="10%" width="38%" height="82%" 
                fill="rgba(6, 182, 212, 0.06)" stroke="#06b6d4" strokeWidth="1.5" rx="4"
                className="transition-all duration-200 hover:fill-cyan-500/20 hover:stroke-cyan-300 hover:stroke-2"
                onMouseEnter={(e) => handleMouseEnter(
                  e, 
                  'ASTRONAUT POSE', 
                  98.4, 
                  ['Status: TRACKED', 'Keypoints: 33/33 Locked', 'Orientation: Upright', 'Interaction: Active'],
                  '#06b6d4'
                )}
              />
              {overlaySettings.labels && (
                <g pointerEvents="none">
                  <rect x="18%" y="7%" width="125" height="18" fill="#0891b2" rx="3" />
                  <text x="18.8%" y="10.2%" fill="#FFFFFF" fontSize="10" fontWeight="bold">
                    🧍 ASTRONAUT 98.4%
                  </text>
                </g>
              )}
            </g>

            {/* Red Experiment Box Bounding Box */}
            <g className="cursor-pointer pointer-events-auto">
              <rect 
                x="46%" y="50%" width="22%" height="28%" 
                fill="rgba(239, 68, 68, 0.08)" stroke="#ef4444" strokeWidth="1.5" rx="4"
                className="transition-all duration-200 hover:fill-red-500/20 hover:stroke-red-300 hover:stroke-2"
                onMouseEnter={(e) => handleMouseEnter(
                  e, 
                  'RED EXPERIMENT BOX', 
                  97.1, 
                  ['Status: LID OPENED', 'Slot: RACK-R1-A', 'Bounding Box: [48, 52, 22, 28]', 'Detection: YOLOv8n'],
                  '#ef4444'
                )}
              />
              {overlaySettings.labels && (
                <g pointerEvents="none">
                  <rect x="46%" y="45.5%" width="115" height="18" fill="#dc2626" rx="3" />
                  <text x="46.8%" y="48.8%" fill="#FFFFFF" fontSize="10" fontWeight="bold">
                    📦 RED BOX 97.1%
                  </text>
                </g>
              )}
            </g>

            {/* Yellow Container Bounding Box */}
            {trackingStatus !== 'LOST' && (
              <g className="cursor-pointer pointer-events-auto transition-all duration-500">
                <rect 
                  x={`${containerX}%`} y={`${containerY}%`} width="14%" height="16%" 
                  fill="rgba(245, 158, 11, 0.12)" stroke="#f59e0b" strokeWidth="2" rx="4"
                  strokeDasharray={trackingStatus === 'DEGRADED' ? '4 2' : 'none'}
                  className="transition-all duration-200 hover:fill-amber-500/25 hover:stroke-amber-300 hover:stroke-[2.5]"
                  onMouseEnter={(e) => handleMouseEnter(
                    e, 
                    'YELLOW CONTAINER', 
                    activityConfidence, 
                    ['State: IN_HAND', 'Step Requirement: Step 2', 'HOI Vector: Hand Grasp Active', 'Tracking: NOMINAL'],
                    '#f59e0b'
                  )}
                />
                {overlaySettings.labels && (
                  <g pointerEvents="none">
                    <rect x={`${containerX}%`} y={`${containerY - 5}%`} width="155" height="18" fill="#d97706" rx="3" />
                    <text x={`${containerX + 0.6}%`} y={`${containerY - 1.8}%`} fill="#FFFFFF" fontSize="10" fontWeight="bold">
                      🧪 CONTAINER {activityConfidence.toFixed(1)}%
                    </text>
                  </g>
                )}
              </g>
            )}

            {/* Target Rack Storage Slot Box */}
            <g className="cursor-pointer pointer-events-auto">
              <rect 
                x="74%" y="30%" width="16%" height="22%" 
                fill="rgba(16, 185, 129, 0.08)" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 3" rx="4"
                className="transition-all duration-200 hover:fill-emerald-500/20 hover:stroke-emerald-300"
                onMouseEnter={(e) => handleMouseEnter(
                  e, 
                  'TARGET RACK SLOT S3', 
                  99.2, 
                  ['Target Zone: Payload Rack Slot 3', 'Expected Action: Step 3 Container Placement', 'Tolerance: ± 2.5cm'],
                  '#10b981'
                )}
              />
              <text x="74.8%" y="27.5%" fill="#34d399" fontSize="9" fontWeight="bold">
                🎯 TARGET SLOT S3
              </text>
            </g>
          </>
        )}

        {/* 2. HUMAN POSE SKELETON LAYER */}
        {overlaySettings.skeleton && (
          <g className="transition-all duration-300 pointer-events-auto">
            {/* Joints coordinates */}
            {/* Head */}
            <circle cx="34%" cy="18%" r="10" fill="none" stroke="#f59e0b" strokeWidth="2" />
            <circle cx="34%" cy="18%" r="4" fill="#f59e0b" 
              className="cursor-pointer hover:r-6 hover:fill-amber-300 transition-all"
              onMouseEnter={(e) => handleMouseEnter(e, 'HEAD KEYPOINT (0)', 99.1, ['X: 0.34m, Y: 0.18m', 'Pose Node: Head Apex'], '#f59e0b')}
            />
            
            {/* Neck */}
            <circle cx="34%" cy="25%" r="3.5" fill="#22d3ee" 
              className="cursor-pointer hover:r-5 transition-all"
              onMouseEnter={(e) => handleMouseEnter(e, 'NECK KEYPOINT (1)', 98.7, ['X: 0.34m, Y: 0.25m', 'Node: Cervical Spine'], '#22d3ee')}
            />
            
            {/* Shoulders */}
            <circle cx="27%" cy="28%" r="4" fill="#22d3ee" className="cursor-pointer hover:r-6 transition-all" />
            <circle cx="41%" cy="28%" r="4" fill="#22d3ee" className="cursor-pointer hover:r-6 transition-all" />
            
            {/* Elbows */}
            <circle cx="23%" cy="42%" r="4" fill="#22d3ee" className="cursor-pointer hover:r-6 transition-all" />
            <circle cx={`${rightHandX - 8}%`} cy={`${rightHandY - 6}%`} r="4" fill="#22d3ee" className="cursor-pointer hover:r-6 transition-all" />
            
            {/* Wrists / Hands */}
            <circle cx="21%" cy="56%" r="4" fill="#22d3ee" className="cursor-pointer hover:r-6 transition-all" />
            <circle 
              cx={`${rightHandX}%`} cy={`${rightHandY}%`} r="6" fill="#f59e0b" stroke="#ffffff" strokeWidth="2"
              className="cursor-pointer hover:r-8 transition-all animate-pulse"
              onMouseEnter={(e) => handleMouseEnter(
                e, 
                'RIGHT HAND WRIST (16)', 
                98.9, 
                [`X: ${rightHandX}%, Y: ${rightHandY}%`, 'GRASP ACTION ACTIVE', 'Grip Force Vector: Nominal'],
                '#f59e0b'
              )}
            />

            {/* Hips & Lower Body */}
            <circle cx="29%" cy="54%" r="4" fill="#22d3ee" />
            <circle cx="39%" cy="54%" r="4" fill="#22d3ee" />
            <circle cx="28%" cy="70%" r="3.5" fill="#22d3ee" />
            <circle cx="38%" cy="70%" r="3.5" fill="#22d3ee" />
            <circle cx="27%" cy="84%" r="4" fill="#22d3ee" />
            <circle cx="37%" cy="84%" r="4" fill="#22d3ee" />

            {/* Skeleton Bones (Lines) */}
            <line x1="34%" y1="18%" x2="34%" y2="25%" stroke="#06b6d4" strokeWidth="2" opacity="0.8" />
            <line x1="34%" y1="25%" x2="34%" y2="54%" stroke="#06b6d4" strokeWidth="2" opacity="0.8" />
            <line x1="27%" y1="28%" x2="41%" y2="28%" stroke="#06b6d4" strokeWidth="2" opacity="0.8" />
            <line x1="27%" y1="28%" x2="23%" y2="42%" stroke="#06b6d4" strokeWidth="2" opacity="0.8" />
            <line x1="23%" y1="42%" x2="21%" y2="56%" stroke="#06b6d4" strokeWidth="2" opacity="0.8" />
            <line x1="41%" y1="28%" x2={`${rightHandX - 8}%`} y2={`${rightHandY - 6}%`} stroke="#22d3ee" strokeWidth="2.5" />
            <line x1={`${rightHandX - 8}%`} y1={`${rightHandY - 6}%`} x2={`${rightHandX}%`} y2={`${rightHandY}%`} stroke="#22d3ee" strokeWidth="2.5" />
            <line x1="29%" y1="54%" x2="39%" y2="54%" stroke="#06b6d4" strokeWidth="2" opacity="0.8" />
            <line x1="29%" y1="54%" x2="28%" y2="70%" stroke="#06b6d4" strokeWidth="2" opacity="0.8" />
            <line x1="28%" y1="70%" x2="27%" y2="84%" stroke="#06b6d4" strokeWidth="2" opacity="0.8" />
            <line x1="39%" y1="54%" x2="38%" y2="70%" stroke="#06b6d4" strokeWidth="2" opacity="0.8" />
            <line x1="38%" y1="70%" x2="37%" y2="84%" stroke="#06b6d4" strokeWidth="2" opacity="0.8" />
          </g>
        )}

        {/* 3. HAND-OBJECT INTERACTION (HOI) VECTOR LAYER */}
        {overlaySettings.hoiLines && trackingStatus !== 'LOST' && (
          <g className="cursor-pointer pointer-events-auto">
            {/* Dynamic interaction line from Right Hand to Yellow Container */}
            <line 
              x1={`${rightHandX}%`} y1={`${rightHandY}%`} 
              x2={`${containerX + 7}%`} y2={`${containerY + 8}%`} 
              stroke="#f59e0b" 
              strokeWidth="2.5" 
              strokeDasharray="4 2"
              className="animate-pulse"
              onMouseEnter={(e) => handleMouseEnter(
                e, 
                'HOI INTERACTION VECTOR', 
                93.6, 
                ['Source: Right Hand (Wrist)', 'Target: Yellow Container', 'Type: GRASPING', 'Spatial Distance: 3.4 cm'],
                '#f59e0b'
              )}
            />
            {/* HOI Target Contact Ring */}
            <circle cx={`${containerX + 7}%`} cy={`${containerY + 8}%`} r="12" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
            <circle cx={`${containerX + 7}%`} cy={`${containerY + 8}%`} r="3" fill="#f59e0b" />

            {/* HOI Tag Box */}
            <g pointerEvents="none">
              <rect x={`${rightHandX - 1}%`} y={`${rightHandY - 8}%`} width="185" height="22" fill="#080e1e" stroke="#f59e0b" strokeWidth="1" rx="4" />
              <text x={`${rightHandX + 1}%`} y={`${rightHandY - 3}%`} fill="#f59e0b" fontSize="10" fontWeight="bold">
                ⚡ HOI: RIGHT HAND → CONTAINER (93.6%)
              </text>
            </g>
          </g>
        )}
      </svg>

      {/* Interactive Tooltip Overlay on BBox / Keypoint Hover */}
      {hoveredTooltip && (
        <div 
          style={{ 
            left: Math.min(hoveredTooltip.x + 15, containerRef.current ? containerRef.current.clientWidth - 230 : hoveredTooltip.x), 
            top: Math.max(hoveredTooltip.y - 10, 10) 
          }}
          className="absolute z-50 pointer-events-none bg-[#080d1a]/95 backdrop-blur-md border border-cyan-500/50 p-2.5 rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.3)] min-w-[210px] animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-700/60">
            <span className="font-bold text-slate-100 text-[11px] flex items-center space-x-1">
              <Target size={12} style={{ color: hoveredTooltip.color }} />
              <span>{hoveredTooltip.title}</span>
            </span>
            <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded" style={{ backgroundColor: `${hoveredTooltip.color}25`, color: hoveredTooltip.color }}>
              {hoveredTooltip.confidence.toFixed(1)}%
            </span>
          </div>
          <div className="space-y-0.5 text-[10px] text-slate-300 font-mono">
            {hoveredTooltip.details.map((detail, idx) => (
              <div key={idx} className="flex items-center space-x-1">
                <span className="text-cyan-400">›</span>
                <span>{detail}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Camera Overlay Details with Animated Live Pulse */}
      <div className="absolute top-2.5 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div className="flex items-center space-x-2.5 bg-slate-950/85 px-3 py-1 rounded-lg border border-slate-800/80 backdrop-blur-md">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
            <span className="font-bold text-cyan-400 text-xs tracking-wider">● LIVE VISION</span>
          </div>
          <span className="text-slate-700">|</span>
          <span className="text-slate-200 font-mono text-xs">{cameraMode}</span>
          <span className="text-slate-700">|</span>
          <span className="text-amber-400 font-mono text-[11px]">1920 × 1080 @ 24.2 FPS</span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Prototype Badge */}
          <div className="bg-amber-500/15 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider font-mono shadow-sm">
            EDGE AI INFERENCE
          </div>

          {/* Upload Custom Video Button */}
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="pointer-events-auto bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white px-2.5 py-1 rounded-md border border-slate-700 text-[11px] font-bold flex items-center space-x-1.5 transition-all shadow-sm"
            title="Upload custom experiment video file"
          >
            <Upload size={12} className="text-cyan-400" />
            <span>{customVideoUrl ? 'VIDEO LOADED' : 'LOAD VIDEO'}</span>
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleVideoUpload} 
            accept="video/*" 
            className="hidden" 
          />
        </div>
      </div>

      {/* Bottom Technical Status Banner */}
      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between bg-slate-950/90 px-3 py-1.5 rounded-lg border border-slate-800/90 backdrop-blur-md text-[11px]">
        <div className="flex items-center space-x-2 text-slate-300 overflow-x-auto no-scrollbar">
          <span className="text-slate-500 font-semibold">PIPELINE:</span>
          <span className="text-cyan-400 font-semibold font-mono">YOLOv8n</span>
          <span className="text-slate-700">→</span>
          <span className="text-cyan-400 font-semibold font-mono">MediaPipe Pose</span>
          <span className="text-slate-700">→</span>
          <span className="text-cyan-400 font-semibold font-mono">HOI Mesh</span>
          <span className="text-slate-700">→</span>
          <span className="text-amber-400 font-bold font-mono">FSM VALIDATOR</span>
        </div>

        <div className="flex items-center space-x-2 text-slate-300 font-mono text-[11px] shrink-0">
          <Cpu size={12} className="text-cyan-400" />
          <span className="text-cyan-300 font-bold">LATENCY: 41 ms</span>
        </div>
      </div>
    </div>
  );
};
