import React from 'react';
import { useMission } from '../context/MissionContext';
import { ProceduralRack2DCanvas } from './ProceduralRack2DCanvas';
import { AstronautViewer } from './AstronautViewer';
import { Play, Pause, Activity, Monitor } from 'lucide-react';
import type { ViewportMode } from '../types/mission';

export const ProceduralRackViewport: React.FC = () => {
  const {
    viewportMode, setViewportMode,
    isPlaying, togglePlayPause,
    playbackSpeed, setPlaybackSpeed,
    timelineFrame, setTimelineFrame,
    fps
  } = useMission();

  return (
    <div className="flex flex-col space-y-2 w-full font-sans">
      {/* Viewport Header Toolbar with View Mode Selector */}
      <div className="flex items-center justify-between bg-[#0A1A33]/90 backdrop-blur-sm p-2.5 rounded-t border border-slate-800 text-xs">
        <div className="flex items-center space-x-2">
          <Monitor size={15} className="text-[#FFA366]" />
          <span className="font-semibold text-[#F1F5F9] uppercase tracking-wider text-xs font-sans">Payload Rack Vision Viewport</span>
        </div>

        {/* View Mode Selector Chips */}
        <div className="flex items-center space-x-1.5 font-sans text-xs">
          {(['2D', '3D', 'DUAL'] as ViewportMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewportMode(mode)}
              className={`px-3 py-1 rounded font-bold transition-all ${
                viewportMode === mode
                  ? 'bg-[#F26B21] text-white shadow-sm font-extrabold'
                  : 'bg-slate-800 text-[#B8C4D6] hover:bg-slate-700 hover:text-white'
              }`}
            >
              {mode === 'DUAL' ? '2D / 3D DUAL' : `${mode} VIEW`}
            </button>
          ))}
        </div>
      </div>

      {/* Main Viewport Content Display Area */}
      <div className="w-full bg-[#040814] border-x border-b border-slate-800 rounded-b p-1">
        {viewportMode === '2D' && (
          <div className="w-full h-[360px]">
            <ProceduralRack2DCanvas />
          </div>
        )}

        {viewportMode === '3D' && (
          <div className="w-full h-[360px]">
            <AstronautViewer className="w-full h-full min-h-[360px]" />
          </div>
        )}

        {viewportMode === 'DUAL' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 w-full h-[360px]">
            <div className="h-full min-h-[360px]">
              <ProceduralRack2DCanvas />
            </div>
            <div className="h-full min-h-[360px]">
              <AstronautViewer className="w-full h-full min-h-[360px]" />
            </div>
          </div>
        )}
      </div>

      {/* Playback Control Bar */}
      <div className="bg-[#0A1A33]/90 backdrop-blur-sm p-2.5 rounded border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        {/* Play/Pause & Scrub Slider */}
        <div className="flex items-center space-x-3 flex-1 min-w-[280px]">
          <button
            onClick={togglePlayPause}
            className="p-1.5 rounded bg-[#F26B21] hover:bg-[#d95914] text-white font-bold transition-colors shadow-sm"
            title={isPlaying ? 'Pause Simulation Timeline' : 'Play Simulation Timeline'}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>

          {/* Timeline Scrub Slider */}
          <div className="flex-1 flex items-center space-x-2">
            <span className="text-xs font-bold text-[#B8C4D6]">FRAME</span>
            <input
              type="range"
              min="0"
              max="300"
              value={timelineFrame}
              onChange={(e) => setTimelineFrame(Number(e.target.value))}
              className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#F26B21]"
            />
            <span className="text-xs font-bold text-[#FFA366] w-12 text-right">
              #{timelineFrame.toString().padStart(3, '0')}
            </span>
          </div>
        </div>

        {/* Speed Controls & FPS Counter */}
        <div className="flex items-center space-x-3">
          {/* Speed Buttons */}
          <div className="flex items-center space-x-1 text-xs">
            <span className="text-[#B8C4D6] mr-1 font-bold">SPEED:</span>
            {([0.5, 1, 2] as const).map((spd) => (
              <button
                key={spd}
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-2 py-0.5 rounded font-bold transition-all ${
                  playbackSpeed === spd
                    ? 'bg-slate-700 text-[#7DD3FC] border border-[#7DD3FC]/50'
                    : 'bg-slate-950 text-[#B8C4D6] hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* FPS Badge */}
          <div className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800 text-xs text-[#7DD3FC] font-bold flex items-center gap-1">
            <Activity size={13} className="text-[#7DD3FC] animate-pulse" />
            <span>{fps.toFixed(1)} FPS</span>
          </div>
        </div>
      </div>
    </div>
  );
};
