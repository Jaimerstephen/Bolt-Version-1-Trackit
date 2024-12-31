```tsx
import React, { useEffect, useRef, useState } from 'react';
import { VideoControls } from '../video/VideoControls';
import type { PoseData } from '../../types';
import { drawPoseOverlay } from '../../utils/visualization/overlay';

interface Props {
  video: HTMLVideoElement;
  poseData: PoseData;
  currentTime: number;
}

export function VideoComparison({ video, poseData, currentTime }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const updateDimensions = () => {
      if (video.videoWidth && video.videoHeight) {
        setDimensions({
          width: video.videoWidth,
          height: video.videoHeight
        });
      }
    };

    updateDimensions();
    video.addEventListener('loadedmetadata', updateDimensions);
    video.addEventListener('loadeddata', updateDimensions);

    return () => {
      video.removeEventListener('loadedmetadata', updateDimensions);
      video.removeEventListener('loadeddata', updateDimensions);
    };
  }, [video]);

  useEffect(() => {
    video.volume = isMuted ? 0 : volume;
  }, [video, volume, isMuted]);

  useEffect(() => {
    video.playbackRate = playbackSpeed;
  }, [video, playbackSpeed]);

  useEffect(() => {
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, [video]);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleSeek = (seconds: number) => {
    if (video) {
      const newTime = Math.max(0, Math.min(video.duration, video.currentTime + seconds));
      video.currentTime = newTime;
    }
  };

  const handleTimeUpdate = (time: number) => {
    if (video) {
      video.currentTime = time;
    }
  };

  const handleTogglePlay = () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  useEffect(() => {
    if (!canvasRef.current || !dimensions.width || !poseData?.keypoints) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawPoseOverlay(ctx, poseData);
      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [video, poseData, dimensions]);

  return (
    <div ref={containerRef} className="relative w-full h-full bg-black group">
      <video
        src={video.src}
        className="w-full h-full object-contain"
        playsInline
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
      />
      
      <VideoControls
        currentTime={currentTime}
        duration={video.duration}
        volume={volume}
        playbackSpeed={playbackSpeed}
        isPlaying={isPlaying}
        isMuted={isMuted}
        isFullscreen={isFullscreen}
        onTimeUpdate={handleTimeUpdate}
        onVolumeChange={setVolume}
        onPlaybackSpeedChange={setPlaybackSpeed}
        onTogglePlay={handleTogglePlay}
        onToggleMute={() => setIsMuted(!isMuted)}
        onToggleFullscreen={toggleFullscreen}
        onSeek={handleSeek}
      />
    </div>
  );
}
```