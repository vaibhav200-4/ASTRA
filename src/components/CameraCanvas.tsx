import React, { useRef, useState } from 'react';
import { useMission } from '../context/MissionContext';
import { Upload, Eye, Cpu, Target } from 'lucide-react';

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
    customVideoUrl, setCustomVideoUrl, activityConfidence, roiState 
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

  const rightHandX = currentStep === 1 ? 52 : currentStep === 2 ? 62 : 78;
  const rightHandY = currentStep === 1 ? 62 : currentStep === 2 ? 50 : 38;

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

  const handleMouseLeave = () => setHoveredTooltip(null);

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full aspect-video bg-[#040814] rounded border border-[#D5DCE6] dark:border-slate-800 overflow-hidden font-mono text-xs select-none group"
    >
      {/* Background Video */}
      {customVideoUrl ? (
        <video 
          src={customVideoUrl} 
          autoPlay 
          loop 
          muted 
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(#123F8C_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>
      )}

      {/* PART I: ADAPTIVE ROI DIMMING & BOUNDING OVERLAY */}
      {/* Dim region outside ROI box */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <mask id="roiMask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <rect 
              x={`${roiState.roiBox.x}%`} 
              y={`${roiState.roiBox.y}%`} 
              width={`${roiState.roiBox.width}%`} 
              height={`${roiState.roiBox.height}%`} 
              fill="black" 
              rx="4"
            />
          </mask>
        </defs>
        
        {/* Full dim overlay using mask */}
        <rect 
          x="0" y="0" width="100%" height="100%" 
          fill="rgba(0, 0, 0, 0.55)" 
          mask="url(#roiMask)" 
        />

        {/* ROI Box Border */}
        <rect 
          x={`${roiState.roiBox.x}%`} 
          y={`${roiState.roiBox.y}%`} 
          width={`${roiState.roiBox.width}%`} 
          height={`${roiState.roiBox.height}%`} 
          fill="none" 
          stroke="#F26B21" 
          strokeWidth="2" 
          strokeDasharray="4 2"
          rx="4"
        />
        <text 
          x={`${roiState.roiBox.x + 1}%`} 
          y={`${Math.max(2, roiState.roiBox.y - 1)}%`} 
          fill="#F26B21" 
          fontSize="10" 
          fontWeight="bold"
        >
          ADAPTIVE ROI ({roiState.pixelsProcessedPercent}% Pixels Processed)
        </text>

        {/* Rack Outline Wireframe */}
        <rect 
          x="5%" y="5%" width="90%" height="90%" 
          fill="none" stroke="#123F8C" strokeWidth="1" strokeDasharray="6 4" opacity="0.4"
        />

        {/* 1. BOUNDING BOXES LAYER */}
        {overlaySettings.boundingBoxes && (
          <>
            {/* Astronaut Bounding Box */}
            <g className="cursor-pointer pointer-events-auto">
              <rect 
                x="18%" y="10%" width="38%" height="82%" 
                fill="rgba(18, 63, 140, 0.08)" stroke="#123F8C" strokeWidth="1.5" rx="4"
                onMouseEnter={(e) => handleMouseEnter(
                  e, 
                  'ASTRONAUT POSE', 
                  98.4, 
                  ['Status: TRACKED', 'Keypoints: 33 Locked', 'Model: YOLO26n Pose', 'Frame: Rack Origin'],
                  '#123F8C'
                )}
              />
              {overlaySettings.labels && (
                <g pointerEvents="none">
                  <rect x="18%" y="7%" width="130" height="18" fill="#123F8C" rx="3" />
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
                fill="rgba(198, 40, 40, 0.1)" stroke="#C62828" strokeWidth="1.5" rx="4"
                onMouseEnter={(e) => handleMouseEnter(
                  e, 
                  'RED EXPERIMENT BOX', 
                  97.1, 
                  ['Status: LID OPENED', 'Slot: RACK-R1-A', 'Detector: YOLO26n (edge, NMS-free)'],
                  '#C62828'
                )}
              />
              {overlaySettings.labels && (
                <g pointerEvents="none">
                  <rect x="46%" y="45.5%" width="120" height="18" fill="#C62828" rx="3" />
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
                  fill="rgba(242, 107, 33, 0.15)" stroke="#F26B21" strokeWidth="2" rx="4"
                  onMouseEnter={(e) => handleMouseEnter(
                    e, 
                    'YELLOW CONTAINER', 
                    activityConfidence, 
                    ['State: IN_HAND', 'Step Requirement: Step 2', 'HOI Vector: Hand Grasp Active'],
                    '#F26B21'
                  )}
                />
                {overlaySettings.labels && (
                  <g pointerEvents="none">
                    <rect x={`${containerX}%`} y={`${containerY - 5}%`} width="155" height="18" fill="#F26B21" rx="3" />
                    <text x={`${containerX + 0.6}%`} y={`${containerY - 1.8}%`} fill="#FFFFFF" fontSize="10" fontWeight="bold">
                      🧪 CONTAINER {activityConfidence.toFixed(1)}%
                    </text>
                  </g>
                )}
              </g>
            )}
          </>
        )}

        {/* 2. HUMAN POSE SKELETON LAYER */}
        {overlaySettings.skeleton && (
          <g className="transition-all duration-300 pointer-events-auto">
            <circle cx="34%" cy="18%" r="8" fill="none" stroke="#F26B21" strokeWidth="2" />
            <circle cx="34%" cy="18%" r="3" fill="#F26B21" />
            <circle cx="34%" cy="25%" r="3" fill="#123F8C" />
            <circle cx="27%" cy="28%" r="3" fill="#123F8C" />
            <circle cx="41%" cy="28%" r="3" fill="#123F8C" />
            <circle cx="23%" cy="42%" r="3" fill="#123F8C" />
            <circle cx={`${rightHandX - 8}%`} cy={`${rightHandY - 6}%`} r="3" fill="#123F8C" />
            <circle cx={`${rightHandX}%`} cy={`${rightHandY}%`} r="5" fill="#F26B21" stroke="#FFFFFF" strokeWidth="1.5" />

            <line x1="34%" y1="18%" x2="34%" y2="25%" stroke="#123F8C" strokeWidth="2" />
            <line x1="34%" y1="25%" x2="34%" y2="54%" stroke="#123F8C" strokeWidth="2" />
            <line x1="27%" y1="28%" x2="41%" y2="28%" stroke="#123F8C" strokeWidth="2" />
            <line x1="41%" y1="28%" x2={`${rightHandX - 8}%`} y2={`${rightHandY - 6}%`} stroke="#123F8C" strokeWidth="2" />
            <line x1={`${rightHandX - 8}%`} y1={`${rightHandY - 6}%`} x2={`${rightHandX}%`} y2={`${rightHandY}%`} stroke="#123F8C" strokeWidth="2" />
          </g>
        )}

        {/* 3. HOI VECTOR LAYER */}
        {overlaySettings.hoiLines && trackingStatus !== 'LOST' && (
          <g className="cursor-pointer pointer-events-auto">
            <line 
              x1={`${rightHandX}%`} y1={`${rightHandY}%`} 
              x2={`${containerX + 7}%`} y2={`${containerY + 8}%`} 
              stroke="#F26B21" 
              strokeWidth="2" 
              strokeDasharray="4 2"
            />
            <circle cx={`${containerX + 7}%`} cy={`${containerY + 8}%`} r="3" fill="#F26B21" />
          </g>
        )}
      </svg>

      {/* Tooltip Overlay */}
      {hoveredTooltip && (
        <div 
          style={{ 
            left: Math.min(hoveredTooltip.x + 15, containerRef.current ? containerRef.current.clientWidth - 230 : hoveredTooltip.x), 
            top: Math.max(hoveredTooltip.y - 10, 10) 
          }}
          className="absolute z-50 pointer-events-none bg-white dark:bg-slate-900 border border-[#D5DCE6] dark:border-slate-700 p-2.5 rounded shadow-md text-xs min-w-[210px]"
        >
          <div className="flex items-center justify-between pb-1 mb-1 border-b border-[#EEF3FA] dark:border-slate-800">
            <span className="font-bold text-[#0B2A5B] dark:text-white text-[11px] flex items-center gap-1">
              <Target size={12} style={{ color: hoveredTooltip.color }} />
              <span>{hoveredTooltip.title}</span>
            </span>
            <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded" style={{ backgroundColor: `${hoveredTooltip.color}20`, color: hoveredTooltip.color }}>
              {hoveredTooltip.confidence.toFixed(1)}%
            </span>
          </div>
          <div className="space-y-0.5 text-[10px] text-[#5B6675] dark:text-slate-300 font-mono">
            {hoveredTooltip.details.map((detail, idx) => (
              <div key={idx}>› {detail}</div>
            ))}
          </div>
        </div>
      )}

      {/* Top Overlay Banner */}
      <div className="absolute top-2 left-3 right-3 flex items-center justify-between pointer-events-none text-xs">
        <div className="flex items-center space-x-2 bg-white/90 dark:bg-slate-900/90 px-2.5 py-1 rounded border border-[#D5DCE6] dark:border-slate-800">
          <span className="font-bold text-[#123F8C] dark:text-cyan-300">● LIVE CAM</span>
          <span className="text-[#5B6675]">|</span>
          <span className="text-[#1B2430] dark:text-white font-mono">{cameraMode}</span>
          <span className="text-[#5B6675]">|</span>
          <span className="text-[#F26B21] font-mono text-[11px]">YOLO26n (edge, NMS-free)</span>
        </div>

        <button 
          onClick={() => fileInputRef.current?.click()}
          className="pointer-events-auto bg-[#123F8C] hover:bg-[#0B2A5B] text-white px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 shadow-sm"
        >
          <Upload size={12} />
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

      {/* Bottom Telemetry Bar */}
      <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between bg-white/90 dark:bg-slate-900/90 px-3 py-1 rounded border border-[#D5DCE6] dark:border-slate-800 text-[11px] font-mono text-[#5B6675] dark:text-slate-300">
        <span>PIPELINE: YOLO26n → Rack 3D Pose → Causal Verify → Dempster-Shafer → FSM</span>
        <span className="text-[#123F8C] dark:text-cyan-300 font-bold">ROI: {roiState.pixelsProcessedPercent}% pixels ({roiState.computeSavingPercent}% saved)</span>
      </div>
    </div>
  );
};
