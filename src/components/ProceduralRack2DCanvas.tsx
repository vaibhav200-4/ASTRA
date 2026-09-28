import React, { useRef, useState, useEffect } from 'react';
import { useMission } from '../context/MissionContext';
import { Upload, Target, Eye, Layers } from 'lucide-react';
import type { OverlaySettings } from '../types/mission';

interface TooltipInfo {
  x: number;
  y: number;
  title: string;
  confidence: number;
  details: string[];
  color: string;
}

export const ProceduralRack2DCanvas: React.FC = () => {
  const {
    currentStep, trackingStatus, overlaySettings, toggleOverlaySetting,
    customVideoUrl, setCustomVideoUrl, activityConfidence, roiState,
    timelineFrame, isPlaying
  } = useMission();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hoveredTooltip, setHoveredTooltip] = useState<TooltipInfo | null>(null);

  // Micro-floating phase animation for 2D skeleton
  const [driftOffset, setDriftOffset] = useState<{ x: number; y: number; rot: number }>({ x: 0, y: 0, rot: 0 });

  useEffect(() => {
    let animId: number;
    const animate = (time: number) => {
      const t = time / 1000;
      setDriftOffset({
        x: Math.sin(t * 0.8) * 8,
        y: Math.cos(t * 1.1) * 10,
        rot: Math.sin(t * 0.5) * 3,
      });
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomVideoUrl(url);
    }
  };

  // Dynamic hand position relative to active step & frame
  const rightHandX = currentStep === 1 ? 52 : currentStep === 2 ? 62 : 78;
  const rightHandY = currentStep === 1 ? 62 : currentStep === 2 ? 48 : 36;

  const containerX = currentStep === 1 ? 54 : currentStep === 2 ? 60 : 76;
  const containerY = currentStep === 1 ? 56 : currentStep === 2 ? 46 : 34;

  const handleMouseEnter = (e: React.MouseEvent, title: string, confidence: number, details: string[], color: string) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setHoveredTooltip({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      title,
      confidence,
      details,
      color
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || !hoveredTooltip) return;
    const rect = containerRef.current.getBoundingClientRect();
    setHoveredTooltip(prev => prev ? { ...prev, x: e.clientX - rect.left, y: e.clientY - rect.top } : null);
  };

  const handleMouseLeave = () => setHoveredTooltip(null);

  const chips: Array<{ key: keyof OverlaySettings; label: string }> = [
    { key: 'boundingBoxes', label: 'Boxes' },
    { key: 'skeleton', label: 'Skeleton' },
    { key: 'hoiLines', label: 'HOI vector' },
    { key: 'roi', label: 'ROI' },
    { key: 'rackAxes', label: 'Rack axes' },
    { key: 'heatmap', label: 'Heatmap' },
  ];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full min-h-[300px] aspect-video bg-[#040814] rounded border border-slate-700/80 overflow-hidden font-sans text-xs select-none group flex flex-col justify-between"
    >
      {/* Background Layer: Custom Uploaded Video OR Procedural 2D Rack Scene */}
      {customVideoUrl ? (
        <video
          ref={videoRef}
          src={customVideoUrl}
          autoPlay
          loop
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-[#06101E] overflow-hidden">
          {/* Rack Grid Lines */}
          <div className="absolute inset-0 bg-[radial-gradient(#123F8C_1px,transparent_1px)] [background-size:20px_20px] opacity-25" />
          
          {/* ArUco Marker Box in Top Left Corner */}
          <div className="absolute top-4 left-6 w-10 h-10 bg-white border-2 border-slate-900 flex items-center justify-center p-1 shadow-sm">
            <div className="w-full h-full bg-slate-950 grid grid-cols-3 gap-0.5 p-0.5">
              <div className="bg-white" />
              <div className="bg-black" />
              <div className="bg-white" />
              <div className="bg-black" />
              <div className="bg-[#F26B21]" />
              <div className="bg-black" />
              <div className="bg-white" />
              <div className="bg-black" />
              <div className="bg-white" />
            </div>
          </div>
          <div className="absolute top-15 left-6 font-mono text-[9px] font-bold text-slate-400">ARUCO_RACK_01</div>

          {/* Payload Rack Structure Boxes */}
          <div className="absolute inset-x-8 top-12 bottom-10 border border-[#123F8C]/40 rounded grid grid-cols-3 gap-4 p-4 pointer-events-none">
            {/* Shelf Slot 1 */}
            <div className="border border-slate-800/80 rounded bg-slate-950/40 p-2 relative">
              <span className="font-mono text-[9px] text-slate-500 block">SLOT-A1 [PAYLOAD]</span>
            </div>
            {/* Shelf Slot 2: Red Box Experiment Station */}
            <div className="border border-slate-700/80 rounded bg-slate-950/60 p-2 relative flex flex-col justify-end">
              <span className="font-mono text-[9px] text-red-400 block mb-1">SLOT-B2 [BCE-01 STATION]</span>
              <div className="w-full h-20 bg-red-950/40 border border-red-600/60 rounded relative flex items-center justify-center">
                <span className="font-mono text-[9px] font-bold text-red-300">RED EXPERIMENT BOX</span>
                {/* Lid indicator */}
                <div 
                  className={`absolute top-0 inset-x-0 h-2 bg-red-600/80 transition-transform origin-top ${
                    currentStep >= 2 ? '-rotate-45' : 'rotate-0'
                  }`} 
                />
              </div>
            </div>
            {/* Shelf Slot 3: Tool Tray */}
            <div className="border border-slate-800/80 rounded bg-slate-950/40 p-2 relative">
              <span className="font-mono text-[9px] text-emerald-400 block">SLOT-C3 [TOOL TRAY]</span>
              <div className="mt-4 flex space-x-2">
                <div className="w-6 h-12 bg-emerald-950/60 border border-emerald-500/50 rounded" />
                <div className="w-6 h-8 bg-slate-800 border border-slate-600 rounded" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SVG OVERLAY LAYERS */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        {/* HEATMAP LAYER */}
        {overlaySettings.heatmap && (
          <defs>
            <radialGradient id="interactionHeatmap" cx={`${rightHandX}%`} cy={`${rightHandY}%`} r="30%">
              <stop offset="0%" stopColor="#F26B21" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#EAB308" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#123F8C" stopOpacity="0" />
            </radialGradient>
          </defs>
        )}
        {overlaySettings.heatmap && (
          <rect x="0" y="0" width="100%" height="100%" fill="url(#interactionHeatmap)" />
        )}

        {/* RACK COORDINATE AXES LAYER */}
        {overlaySettings.rackAxes && (
          <g transform="translate(40, 240)">
            {/* X Axis */}
            <line x1="0" y1="0" x2="60" y2="0" stroke="#EF4444" strokeWidth="2.5" />
            <polygon points="65,0 55,-4 55,4" fill="#EF4444" />
            <text x="70" y="4" fill="#EF4444" fontSize="10" fontWeight="bold" fontFamily="monospace">X_RACK</text>

            {/* Y Axis */}
            <line x1="0" y1="0" x2="0" y2="-60" stroke="#10B981" strokeWidth="2.5" />
            <polygon points="0,-65 -4,-55 4,-55" fill="#10B981" />
            <text x="-8" y="-70" fill="#10B981" fontSize="10" fontWeight="bold" fontFamily="monospace">Y_RACK</text>

            {/* Z Axis Depth */}
            <line x1="0" y1="0" x2="-35" y2="35" stroke="#06B6D4" strokeWidth="2.5" />
            <polygon points="-40,40 -30,35 -35,28" fill="#06B6D4" />
            <text x="-55" y="48" fill="#06B6D4" fontSize="10" fontWeight="bold" fontFamily="monospace">Z_DEPTH</text>
          </g>
        )}

        {/* ADAPTIVE ROI OVERLAY */}
        {overlaySettings.roi && (
          <>
            <defs>
              <mask id="roiMask2D">
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
            <rect
              x="0" y="0" width="100%" height="100%"
              fill="rgba(4, 8, 20, 0.65)"
              mask="url(#roiMask2D)"
            />
            <rect
              x={`${roiState.roiBox.x}%`}
              y={`${roiState.roiBox.y}%`}
              width={`${roiState.roiBox.width}%`}
              height={`${roiState.roiBox.height}%`}
              fill="none"
              stroke="#F26B21"
              strokeWidth="2"
              strokeDasharray="5 3"
              rx="4"
            />
            <text
              x={`${roiState.roiBox.x + 1}%`}
              y={`${Math.max(3, roiState.roiBox.y - 1.5)}%`}
              fill="#F26B21"
              fontSize="10"
              fontWeight="bold"
              fontFamily="monospace"
            >
              ADAPTIVE ROI (Pixels processed {roiState.pixelsProcessedPercent}%)
            </text>
          </>
        )}

        {/* BOUNDING BOXES LAYER */}
        {overlaySettings.boundingBoxes && (
          <>
            {/* Astronaut Bounding Box */}
            <g className="cursor-pointer pointer-events-auto">
              <rect
                x={`${16 + driftOffset.x * 0.05}%`}
                y={`${8 + driftOffset.y * 0.05}%`}
                width="36%"
                height="82%"
                fill="rgba(18, 63, 140, 0.08)"
                stroke="#123F8C"
                strokeWidth="1.5"
                rx="4"
                onMouseEnter={(e) => handleMouseEnter(
                  e, 'ASTRONAUT POSE', 98.4,
                  ['Status: TRACKED', '17 Joints Locked', 'Detector: YOLO26n Edge', 'Microgravity Drift: Nominal'],
                  '#123F8C'
                )}
              />
              {overlaySettings.labels && (
                <g pointerEvents="none">
                  <rect x={`${16 + driftOffset.x * 0.05}%`} y={`${5 + driftOffset.y * 0.05}%`} width="135" height="18" fill="#123F8C" rx="3" />
                  <text x={`${16.8 + driftOffset.x * 0.05}%`} y={`${8.2 + driftOffset.y * 0.05}%`} fill="#FFFFFF" fontSize="10" fontWeight="bold">
                    🧍 ASTRONAUT 98.4%
                  </text>
                </g>
              )}
            </g>

            {/* Red Box Bounding Box */}
            <g className="cursor-pointer pointer-events-auto">
              <rect
                x="44%" y="48%" width="24%" height="32%"
                fill="rgba(220, 38, 38, 0.1)" stroke="#DC2626" strokeWidth="1.5" rx="4"
                onMouseEnter={(e) => handleMouseEnter(
                  e, 'RED EXPERIMENT BOX', 97.1,
                  [`Status: ${currentStep >= 2 ? 'LID OPENED' : 'LID CLOSED'}`, 'Slot: RACK-SLOT-B2', 'Station: BCE-01'],
                  '#DC2626'
                )}
              />
              {overlaySettings.labels && (
                <g pointerEvents="none">
                  <rect x="44%" y="43.5%" width="125" height="18" fill="#DC2626" rx="3" />
                  <text x="44.8%" y="46.8%" fill="#FFFFFF" fontSize="10" fontWeight="bold">
                    📦 RED BOX 97.1%
                  </text>
                </g>
              )}
            </g>

            {/* Yellow Container Bounding Box */}
            {trackingStatus !== 'LOST' && (
              <g className="cursor-pointer pointer-events-auto">
                <rect
                  x={`${containerX}%`} y={`${containerY}%`} width="14%" height="18%"
                  fill="rgba(242, 107, 33, 0.15)" stroke="#F26B21" strokeWidth="2" rx="4"
                  onMouseEnter={(e) => handleMouseEnter(
                    e, 'YELLOW CONTAINER', activityConfidence,
                    [`State: ${currentStep === 2 ? 'IN_HAND' : currentStep === 3 ? 'RACK_PLACED' : 'BOX_STORED'}`, `Confidence: ${activityConfidence.toFixed(1)}%`],
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

        {/* SKELETON OVERLAY LAYER (17 Joints) */}
        {overlaySettings.skeleton && (
          <g
            transform={`translate(${driftOffset.x}, ${driftOffset.y}) rotate(${driftOffset.rot}, 200, 200)`}
            className="transition-all duration-300 pointer-events-auto"
          >
            {/* Head */}
            <circle cx="32%" cy="18%" r="10" fill="none" stroke="#F26B21" strokeWidth="2" />
            <circle cx="32%" cy="18%" r="4" fill="#F26B21" />

            {/* Spine & Neck */}
            <line x1="32%" y1="18%" x2="32%" y2="25%" stroke="#123F8C" strokeWidth="2.5" />
            <line x1="32%" y1="25%" x2="32%" y2="52%" stroke="#123F8C" strokeWidth="2.5" />

            {/* Shoulders */}
            <circle cx="25%" cy="27%" r="4" fill="#06B6D4" />
            <circle cx="39%" cy="27%" r="4" fill="#06B6D4" />
            <line x1="25%" y1="27%" x2="39%" y2="27%" stroke="#123F8C" strokeWidth="2.5" />

            {/* Left Arm */}
            <line x1="25%" y1="27%" x2="20%" y2="40%" stroke="#123F8C" strokeWidth="2" />
            <line x1="20%" y1="40%" x2="17%" y2="54%" stroke="#123F8C" strokeWidth="2" />
            <circle cx="20%" cy="40%" r="3" fill="#06B6D4" />
            <circle cx="17%" cy="54%" r="4" fill="#06B6D4" />

            {/* Right Arm (Reaching towards box/container) */}
            <line x1="39%" y1="27%" x2="48%" y2="38%" stroke="#123F8C" strokeWidth="2.5" />
            <line x1="48%" y1="38%" x2={`${rightHandX}%`} y2={`${rightHandY}%`} stroke="#F26B21" strokeWidth="2.5" />
            <circle cx="48%" cy="38%" r="3" fill="#06B6D4" />
            <circle cx={`${rightHandX}%`} cy={`${rightHandY}%`} r="6" fill="#F26B21" stroke="#FFFFFF" strokeWidth="1.5" />

            {/* Hips */}
            <circle cx="28%" cy="52%" r="4" fill="#06B6D4" />
            <circle cx="36%" cy="52%" r="4" fill="#06B6D4" />
            <line x1="28%" y1="52%" x2="36%" y2="52%" stroke="#123F8C" strokeWidth="2.5" />

            {/* Left Leg */}
            <line x1="28%" y1="52%" x2="26%" y2="68%" stroke="#123F8C" strokeWidth="2" />
            <line x1="26%" y1="68%" x2="24%" y2="84%" stroke="#123F8C" strokeWidth="2" />
            <circle cx="26%" cy="68%" r="3" fill="#06B6D4" />
            <circle cx="24%" cy="84%" r="4" fill="#06B6D4" />

            {/* Right Leg */}
            <line x1="36%" y1="52%" x2="38%" y2="68%" stroke="#123F8C" strokeWidth="2" />
            <line x1="38%" y1="68%" x2="40%" y2="84%" stroke="#123F8C" strokeWidth="2" />
            <circle cx="38%" cy="68%" r="3" fill="#06B6D4" />
            <circle cx="40%" cy="84%" r="4" fill="#06B6D4" />
          </g>
        )}

        {/* HOI VECTOR ARROW LAYER */}
        {overlaySettings.hoiLines && trackingStatus !== 'LOST' && (
          <g className="cursor-pointer pointer-events-auto">
            <line
              x1={`${rightHandX}%`} y1={`${rightHandY}%`}
              x2={`${containerX + 7}%`} y2={`${containerY + 9}%`}
              stroke="#F26B21"
              strokeWidth="2.5"
              strokeDasharray="4 2"
            />
            <circle cx={`${containerX + 7}%`} cy={`${containerY + 9}%`} r="4" fill="#F26B21" />
            <text
              x={`${(rightHandX + containerX + 7) / 2}%`}
              y={`${(rightHandY + containerY + 9) / 2 - 2}%`}
              fill="#F26B21"
              fontSize="10"
              fontWeight="bold"
              fontFamily="monospace"
            >
              HOI VECTOR (Grasp Active)
            </text>
          </g>
        )}
      </svg>

      {/* TOOLTIP INSPECTOR POPUP */}
      {hoveredTooltip && (
        <div
          style={{
            left: Math.min(hoveredTooltip.x + 15, containerRef.current ? containerRef.current.clientWidth - 230 : hoveredTooltip.x),
            top: Math.max(hoveredTooltip.y - 10, 10)
          }}
          className="absolute z-50 pointer-events-none bg-slate-900 border border-slate-700 p-2.5 rounded shadow-xl text-xs min-w-[210px]"
        >
          <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-800">
            <span className="font-bold text-white text-[11px] flex items-center gap-1">
              <Target size={12} style={{ color: hoveredTooltip.color }} />
              <span>{hoveredTooltip.title}</span>
            </span>
            <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded" style={{ backgroundColor: `${hoveredTooltip.color}30`, color: hoveredTooltip.color }}>
              {hoveredTooltip.confidence.toFixed(1)}%
            </span>
          </div>
          <div className="space-y-0.5 text-[10px] text-slate-300 font-mono">
            {hoveredTooltip.details.map((detail, idx) => (
              <div key={idx}>› {detail}</div>
            ))}
          </div>
        </div>
      )}

      {/* TOP HEADER CONTROLS */}
      <div className="relative z-20 p-2.5 flex items-center justify-between pointer-events-none text-xs">
        <div className="flex items-center space-x-2 bg-slate-900/90 px-2.5 py-1 rounded border border-slate-700/80 text-white font-mono text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-cyan-300">● 2D CAMERA VIEW</span>
          <span className="text-slate-600">|</span>
          <span className="text-orange-400">YOLO26n (edge, NMS-free)</span>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="pointer-events-auto bg-[#123F8C] hover:bg-[#0B2A5B] text-white px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 shadow-sm transition-colors"
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

      {/* CLICKABLE OVERLAY LAYER CHIPS BAR */}
      <div className="relative z-20 px-3 py-1.5 bg-slate-950/90 border-t border-b border-slate-800 flex items-center space-x-2 overflow-x-auto select-none pointer-events-auto">
        <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1 font-bold mr-1">
          <Layers size={11} className="text-cyan-400" />
          <span>OVERLAYS:</span>
        </span>
        {chips.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => toggleOverlaySetting(key)}
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all border ${
              overlaySettings[key]
                ? 'bg-orange-500/20 text-orange-300 border-orange-500/60 shadow-sm'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {overlaySettings[key] ? `✓ ${label}` : `+ ${label}`}
          </button>
        ))}
      </div>
    </div>
  );
};
