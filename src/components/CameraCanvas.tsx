import React, { useRef, useEffect } from 'react';
import { useMission } from '../context/MissionContext';
import { Video, ShieldCheck, Cpu, Upload } from 'lucide-react';

export const CameraCanvas: React.FC = () => {
  const { 
    cameraMode, overlaySettings, currentStep, fsmState, trackingStatus,
    customVideoUrl, setCustomVideoUrl, activityConfidence
  } = useMission();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomVideoUrl(url);
    }
  };

  // Skeleton Joint definitions
  // Adjust coordinates slightly based on current Step for realistic movement
  const isContainerInHand = currentStep >= 2;
  const isContainerInRack = currentStep === 3;

  // Hand position shift based on step
  const rightHandX = currentStep === 1 ? 52 : currentStep === 2 ? 62 : 78;
  const rightHandY = currentStep === 1 ? 62 : currentStep === 2 ? 50 : 38;

  // Container BBox position based on step
  const containerX = currentStep === 1 ? 54 : currentStep === 2 ? 60 : 76;
  const containerY = currentStep === 1 ? 56 : currentStep === 2 ? 46 : 34;

  return (
    <div className="relative w-full aspect-video bg-[#041021] rounded border-2 border-navy-700 overflow-hidden shadow-inner font-mono text-xs select-none">
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
        /* Dark Mission Control Grid & Payload Rack Graphics */
        <div className="absolute inset-0 bg-[radial-gradient(#133663_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
      )}

      {/* SVG Canvas Overlay for AI Bounding Boxes, Skeletons, HOI Vectors */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {/* Payload Rack Frame Wireframe */}
        <rect 
          x="6%" y="6%" width="88%" height="88%" 
          fill="none" stroke="#174EA6" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6"
        />
        <text x="7%" y="9%" fill="#2878C8" fontSize="10" fontWeight="bold">
          PAYLOAD RACK #01 — BOUNDS (X: -1.2m to +1.2m, Y: 0.0m to 2.4m)
        </text>

        {/* 1. BOUNDING BOXES LAYER */}
        {overlaySettings.boundingBoxes && (
          <>
            {/* Astronaut Bounding Box */}
            <rect 
              x="18%" y="10%" width="38%" height="82%" 
              fill="rgba(40, 120, 200, 0.08)" stroke="#2878C8" strokeWidth="1.5"
            />
            {overlaySettings.labels && (
              <g>
                <rect x="18%" y="7.5%" width="120" height="16" fill="#174EA6" rx="2" />
                <text x="18.5%" y="10.5%" fill="#FFFFFF" fontSize="10" fontWeight="bold">
                  ASTRONAUT 98.4%
                </text>
              </g>
            )}

            {/* Red Experiment Box Bounding Box */}
            <rect 
              x="46%" y="50%" width="22%" height="28%" 
              fill="rgba(211, 47, 47, 0.12)" stroke="#D32F2F" strokeWidth="1.8"
            />
            {overlaySettings.labels && (
              <g>
                <rect x="46%" y="46%" width="105" height="16" fill="#D32F2F" rx="2" />
                <text x="46.5%" y="49%" fill="#FFFFFF" fontSize="10" fontWeight="bold">
                  RED BOX 97.1%
                </text>
              </g>
            )}

            {/* Yellow Container Bounding Box */}
            {trackingStatus !== 'LOST' && (
              <g className="transition-all duration-500">
                <rect 
                  x={`${containerX}%`} y={`${containerY}%`} width="14%" height="16%" 
                  fill="rgba(245, 130, 32, 0.2)" stroke="#F58220" strokeWidth="2"
                  strokeDasharray={trackingStatus === 'DEGRADED' ? '4 2' : 'none'}
                />
                {overlaySettings.labels && (
                  <g>
                    <rect x={`${containerX}%`} y={`${containerY - 4.5}%`} width="135" height="16" fill="#F58220" rx="2" />
                    <text x={`${containerX + 0.5}%`} y={`${containerY - 1.5}%`} fill="#FFFFFF" fontSize="10" fontWeight="bold">
                      YELLOW CONTAINER {activityConfidence.toFixed(1)}%
                    </text>
                  </g>
                )}
              </g>
            )}

            {/* Target Rack Storage Slot Box */}
            <rect 
              x="74%" y="30%" width="16%" height="22%" 
              fill="rgba(21, 148, 71, 0.1)" stroke="#159447" strokeWidth="1.5" strokeDasharray="3 3"
            />
            <text x="74.5%" y="28%" fill="#159447" fontSize="9" fontWeight="bold">
              TARGET SLOT S3
            </text>
          </>
        )}

        {/* 2. HUMAN POSE SKELETON LAYER */}
        {overlaySettings.skeleton && (
          <g className="transition-all duration-300">
            {/* Joints coordinates */}
            {/* Head */}
            <circle cx="34%" cy="18%" r="10" fill="none" stroke="#F58220" strokeWidth="2" />
            <circle cx="34%" cy="18%" r="4" fill="#F58220" />
            
            {/* Neck */}
            <circle cx="34%" cy="25%" r="3" fill="#00FFCC" />
            
            {/* Shoulders */}
            <circle cx="27%" cy="28%" r="4" fill="#00FFCC" />
            <circle cx="41%" cy="28%" r="4" fill="#00FFCC" />
            
            {/* Elbows */}
            <circle cx="23%" cy="42%" r="3.5" fill="#00FFCC" />
            <circle cx={`${rightHandX - 8}%`} cy={`${rightHandY - 6}%`} r="3.5" fill="#00FFCC" />
            
            {/* Wrists / Hands */}
            <circle cx="21%" cy="56%" r="4" fill="#00FFCC" />
            <circle cx={`${rightHandX}%`} cy={`${rightHandY}%`} r="5" fill="#F58220" stroke="#FFFFFF" strokeWidth="1.5" />

            {/* Hips */}
            <circle cx="29%" cy="54%" r="4" fill="#00FFCC" />
            <circle cx="39%" cy="54%" r="4" fill="#00FFCC" />

            {/* Knees */}
            <circle cx="28%" cy="70%" r="3.5" fill="#00FFCC" />
            <circle cx="38%" cy="70%" r="3.5" fill="#00FFCC" />

            {/* Ankles */}
            <circle cx="27%" cy="84%" r="4" fill="#00FFCC" />
            <circle cx="37%" cy="84%" r="4" fill="#00FFCC" />

            {/* Skeleton Bones (Lines) */}
            {/* Spine */}
            <line x1="34%" y1="18%" x2="34%" y2="25%" stroke="#00FFCC" strokeWidth="2" />
            <line x1="34%" y1="25%" x2="34%" y2="54%" stroke="#00FFCC" strokeWidth="2" />
            
            {/* Shoulders line */}
            <line x1="27%" y1="28%" x2="41%" y2="28%" stroke="#00FFCC" strokeWidth="2" />
            
            {/* Left Arm */}
            <line x1="27%" y1="28%" x2="23%" y2="42%" stroke="#00FFCC" strokeWidth="2" />
            <line x1="23%" y1="42%" x2="21%" y2="56%" stroke="#00FFCC" strokeWidth="2" />

            {/* Right Arm (Reaching toward Container) */}
            <line x1="41%" y1="28%" x2={`${rightHandX - 8}%`} y2={`${rightHandY - 6}%`} stroke="#00FFCC" strokeWidth="2.5" />
            <line x1={`${rightHandX - 8}%`} y1={`${rightHandY - 6}%`} x2={`${rightHandX}%`} y2={`${rightHandY}%`} stroke="#00FFCC" strokeWidth="2.5" />

            {/* Hips line */}
            <line x1="29%" y1="54%" x2="39%" y2="54%" stroke="#00FFCC" strokeWidth="2" />

            {/* Left Leg */}
            <line x1="29%" y1="54%" x2="28%" y2="70%" stroke="#00FFCC" strokeWidth="2" />
            <line x1="28%" y1="70%" x2="27%" y2="84%" stroke="#00FFCC" strokeWidth="2" />

            {/* Right Leg */}
            <line x1="39%" y1="54%" x2="38%" y2="70%" stroke="#00FFCC" strokeWidth="2" />
            <line x1="38%" y1="70%" x2="37%" y2="84%" stroke="#00FFCC" strokeWidth="2" />
          </g>
        )}

        {/* 3. HAND-OBJECT INTERACTION (HOI) VECTOR LAYER */}
        {overlaySettings.hoiLines && trackingStatus !== 'LOST' && (
          <g>
            {/* Dynamic interaction line from Right Hand to Yellow Container */}
            <line 
              x1={`${rightHandX}%`} y1={`${rightHandY}%`} 
              x2={`${containerX + 7}%`} y2={`${containerY + 8}%`} 
              stroke="#F58220" 
              strokeWidth="2.5" 
              strokeDasharray="4 2"
              className="animate-pulse"
            />
            {/* HOI Target Contact Ring */}
            <circle cx={`${containerX + 7}%`} cy={`${containerY + 8}%`} r="12" fill="none" stroke="#F58220" strokeWidth="1.5" />
            <circle cx={`${containerX + 7}%`} cy={`${containerY + 8}%`} r="3" fill="#F58220" />

            {/* HOI Tag Box */}
            <g>
              <rect x={`${rightHandX - 2}%`} y={`${rightHandY - 8}%`} width="180" height="22" fill="#071B33" stroke="#F58220" strokeWidth="1" rx="3" />
              <text x={`${rightHandX}%`} y={`${rightHandY - 3}%`} fill="#F58220" fontSize="10" fontWeight="bold">
                HOI: RIGHT HAND → CONTAINER (93.6%)
              </text>
            </g>
          </g>
        )}
      </svg>

      {/* Top Camera Overlay Details */}
      <div className="absolute top-2 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div className="flex items-center space-x-2 bg-navy-950/80 px-2.5 py-1 rounded border border-navy-700 backdrop-blur-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
          <span className="font-bold text-red-400 text-xs tracking-wider">● LIVE VISION</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-200 font-mono text-xs">{cameraMode}</span>
          <span className="text-slate-400">|</span>
          <span className="text-saffron-400 font-mono text-xs">1920 × 1080 @ 23.8 FPS</span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Simulation Badge */}
          <div className="bg-saffron-500/20 text-saffron-300 border border-saffron-500/60 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider">
            PROTOTYPE INFERENCE MODE
          </div>

          {/* Upload Custom Video Button */}
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="pointer-events-auto bg-navy-800 hover:bg-navy-700 text-slate-200 hover:text-white px-2 py-1 rounded border border-navy-600 text-[11px] font-bold flex items-center space-x-1 transition-colors"
            title="Upload custom experiment video file"
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
      </div>

      {/* Bottom Technical Status Banner */}
      <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between bg-navy-950/85 px-3 py-1.5 rounded border border-navy-800 backdrop-blur-xs text-[11px]">
        <div className="flex items-center space-x-3">
          <span className="text-slate-400">PIPELINE:</span>
          <span className="text-emerald-400 font-semibold">YOLOv8n</span>
          <span className="text-slate-600">→</span>
          <span className="text-emerald-400 font-semibold">MediaPipe Pose</span>
          <span className="text-slate-600">→</span>
          <span className="text-emerald-400 font-semibold">HOI Mesh</span>
          <span className="text-slate-600">→</span>
          <span className="text-emerald-400 font-semibold">Temporal HAR</span>
          <span className="text-slate-600">→</span>
          <span className="text-saffron-400 font-bold">FSM VALIDATOR</span>
        </div>

        <div className="flex items-center space-x-2 text-slate-300 font-mono">
          <Cpu size={12} className="text-saffron-400" />
          <span>LATENCY: 41 ms</span>
        </div>
      </div>
    </div>
  );
};
