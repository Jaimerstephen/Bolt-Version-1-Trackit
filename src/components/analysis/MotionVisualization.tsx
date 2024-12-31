import React, { useEffect, useRef } from 'react';
import type { Keypoints3D } from '../../types/spatial';

interface Props {
  keypoints3D: Keypoints3D;
  videoElement: HTMLVideoElement;
}

export function MotionVisualization({ keypoints3D, videoElement }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Match canvas size to video
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    // Clear previous frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw video frame
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    // Draw skeleton overlay
    drawSkeleton(ctx, keypoints3D);

    // Draw ideal form reference
    drawIdealForm(ctx, keypoints3D);
  }, [keypoints3D, videoElement]);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}

function drawSkeleton(ctx: CanvasRenderingContext2D, keypoints: Keypoints3D) {
  // Draw connections between keypoints
  ctx.strokeStyle = 'rgba(0, 255, 0, 0.8)';
  ctx.lineWidth = 2;

  // Draw points
  Object.values(keypoints).forEach(point => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
    ctx.fill();
  });

  // Draw lines connecting joints
  // Add specific joint connections for your skeleton
}

function drawIdealForm(ctx: CanvasRenderingContext2D, keypoints: Keypoints3D) {
  // Draw reference skeleton showing ideal form
  ctx.strokeStyle = 'rgba(0, 0, 255, 0.4)';
  ctx.lineWidth = 2;
  
  // Add ideal form visualization based on the detected motion
  // This would show the expected positions for each phase
}