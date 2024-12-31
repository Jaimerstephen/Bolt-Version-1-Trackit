import React, { useEffect, useRef } from 'react';
import type { PoseData } from '../../types';
import { drawPoseOverlay } from '../../utils/visualization/overlay';

interface Props {
  poseData: PoseData;
  width?: number;
  height?: number;
  currentTime?: number;
}

export function PoseViewer2D({ poseData, width = 400, height = 300, currentTime }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !poseData?.keypoints || !poseData.dimensions) {
      console.warn('Missing required data for PoseViewer2D');
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Scale pose data to fit canvas
    const scaledPoseData = {
      keypoints: poseData.keypoints.map(kp => ({
        ...kp,
        x: (kp.x / poseData.dimensions.width) * canvas.width,
        y: (kp.y / poseData.dimensions.height) * canvas.height,
      })),
      dimensions: { width, height }
    };

    // Draw pose
    drawPoseOverlay(ctx, scaledPoseData);
  }, [poseData, width, height, currentTime]);

  return (
    <div className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
    </div>
  );
}