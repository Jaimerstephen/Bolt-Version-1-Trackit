import React from 'react';
import { Play, Pause, Volume2, VolumeX, Settings, Maximize, SkipBack, SkipForward } from 'lucide-react';
import { Timeline } from './Timeline';
import { VolumeControl } from './VolumeControl';
import { PlaybackSpeedControl } from './PlaybackSpeedControl';

interface Props {
  currentTime: number;
  duration: number;
  volume: number;
  playbackSpeed: number;
  isPlaying: boolean;
  isMuted: boolean;
  isFullscreen: boolean;
  onTimeUpdate: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onPlaybackSpeedChange: (speed: number) => void;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onToggleFullscreen: () => void;
  onSeek: (seconds: number) => void;
}

export function VideoControls({
  currentTime,
  duration,
  volume,
  playbackSpeed,
  isPlaying,
  isMuted,
  isFullscreen,
  onTimeUpdate,
  onVolumeChange,
  onPlaybackSpeedChange,
  onTogglePlay,
  onToggleMute,
  onToggleFullscreen,
  onSeek,
}: Props) {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
      <Timeline
        currentTime={currentTime}
        duration={duration}
        onTimeUpdate={onTimeUpdate}
      />
      
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onSeek(-10)}
            className="p-1.5 rounded-full hover:bg-white/20 text-white"
            title="Rewind 10 seconds"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          <button
            onClick={onTogglePlay}
            className="p-2 rounded-full hover:bg-white/20 text-white"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </button>

          <button
            onClick={() => onSeek(10)}
            className="p-1.5 rounded-full hover:bg-white/20 text-white"
            title="Forward 10 seconds"
          >
            <SkipForward className="w-5 h-5" />
          </button>

          <VolumeControl
            volume={volume}
            isMuted={isMuted}
            onVolumeChange={onVolumeChange}
            onToggleMute={onToggleMute}
          />

          <div className="text-white text-sm">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <PlaybackSpeedControl
            speed={playbackSpeed}
            onSpeedChange={onPlaybackSpeedChange}
          />

          <button
            onClick={onToggleFullscreen}
            className="p-1.5 rounded-full hover:bg-white/20 text-white"
            title="Toggle fullscreen"
          >
            <Maximize className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}