import React from 'react';
import { Slider } from 'lucide-react';

interface Props {
  currentTime: number;
  duration: number;
  onTimeUpdate: (time: number) => void;
  onPlay: () => void;
  onPause: () => void;
  isPlaying: boolean;
}

export function TimelineController({ 
  currentTime, 
  duration, 
  onTimeUpdate, 
  onPlay, 
  onPause, 
  isPlaying 
}: Props) {
  return (
    <div className="flex items-center space-x-4 w-full bg-gray-800 p-2 rounded-lg">
      <button
        onClick={isPlaying ? onPause : onPlay}
        className="p-2 rounded-full hover:bg-gray-700"
      >
        {isPlaying ? (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          </svg>
        )}
      </button>

      <div className="flex-1">
        <input
          type="range"
          min={0}
          max={duration}
          value={currentTime}
          onChange={(e) => onTimeUpdate(Number(e.target.value))}
          className="w-full"
          step={0.1}
        />
      </div>

      <div className="text-white text-sm">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}