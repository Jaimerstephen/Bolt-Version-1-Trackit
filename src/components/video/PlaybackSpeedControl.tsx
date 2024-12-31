import React, { useState } from 'react';
import { Settings } from 'lucide-react';

interface Props {
  speed: number;
  onSpeedChange: (speed: number) => void;
}

const SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export function PlaybackSpeedControl({ speed, onSpeedChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 rounded-full hover:bg-white/20 text-white flex items-center space-x-1"
        title="Playback speed"
      >
        <Settings className="w-5 h-5" />
        <span className="text-sm">{speed}x</span>
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 bg-black/80 rounded-lg overflow-hidden">
          {SPEEDS.map((s) => (
            <button
              key={s}
              onClick={() => {
                onSpeedChange(s);
                setIsOpen(false);
              }}
              className={`
                block w-full px-4 py-2 text-sm text-left
                ${speed === s ? 'bg-white/20 text-white' : 'text-gray-200 hover:bg-white/10'}
              `}
            >
              {s}x
            </button>
          ))}
        </div>
      )}
    </div>
  );
}