import React, { useState } from 'react';
import { Volume2, VolumeX, Volume1, Volume } from 'lucide-react';

interface Props {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
}

export function VolumeControl({ volume, isMuted, onVolumeChange, onToggleMute }: Props) {
  const [isHovering, setIsHovering] = useState(false);

  const VolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX />;
    if (volume < 0.3) return <Volume />;
    if (volume < 0.7) return <Volume1 />;
    return <Volume2 />;
  };

  return (
    <div
      className="relative flex items-center group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <button
        onClick={onToggleMute}
        className="p-1.5 rounded-full hover:bg-white/20 text-white"
      >
        <VolumeIcon />
      </button>

      <div className={`
        absolute left-full ml-2 bg-black/80 rounded px-3 py-2 w-32
        transition-opacity duration-200
        ${isHovering ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={isMuted ? 0 : volume}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  );
}