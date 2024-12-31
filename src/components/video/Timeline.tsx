import React, { useRef, useState } from 'react';

interface Props {
  currentTime: number;
  duration: number;
  onTimeUpdate: (time: number) => void;
}

export function Timeline({ currentTime, duration, onTimeUpdate }: Props) {
  const [isHovering, setIsHovering] = useState(false);
  const [hoverPosition, setHoverPosition] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const position = (e.clientX - rect.left) / rect.width;
    setHoverPosition(Math.max(0, Math.min(1, position)));
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const position = (e.clientX - rect.left) / rect.width;
    const time = position * duration;
    onTimeUpdate(Math.max(0, Math.min(duration, time)));
  };

  return (
    <div
      ref={timelineRef}
      className="group relative h-1 bg-gray-600 cursor-pointer"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      {/* Progress bar */}
      <div
        className="absolute h-full bg-red-500"
        style={{ width: `${(currentTime / duration) * 100}%` }}
      />

      {/* Hover preview */}
      {isHovering && (
        <div
          className="absolute bottom-4 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded"
          style={{ left: `${hoverPosition * 100}%` }}
        >
          {formatTime(hoverPosition * duration)}
        </div>
      )}

      {/* Hover indicator */}
      {isHovering && (
        <div
          className="absolute h-full w-0.5 bg-white/50"
          style={{ left: `${hoverPosition * 100}%` }}
        />
      )}

      {/* Timeline handle */}
      <div
        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full -ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ left: `${(currentTime / duration) * 100}%` }}
      />
    </div>
  );
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}