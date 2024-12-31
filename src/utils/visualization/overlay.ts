import { PoseData } from '../../types';
import { SKELETON_CONNECTIONS, KEYPOINT_COLORS } from '../pose/skeleton/constants';

const KEYPOINT_RADIUS = 4;
const CONFIDENCE_THRESHOLD = 0.3;

export function drawPoseOverlay(ctx: CanvasRenderingContext2D, pose: PoseData) {
  if (!pose?.keypoints) {
    console.warn('No keypoints available for pose overlay');
    return;
  }

  // Draw connections first (underneath points)
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  SKELETON_CONNECTIONS.forEach(([from, to]) => {
    const fromPoint = pose.keypoints.find(kp => kp.name === from);
    const toPoint = pose.keypoints.find(kp => kp.name === to);

    if (fromPoint && toPoint && 
        fromPoint.score > CONFIDENCE_THRESHOLD && 
        toPoint.score > CONFIDENCE_THRESHOLD) {
      const color = KEYPOINT_COLORS[from.replace('left', '').replace('right', '') as keyof typeof KEYPOINT_COLORS];
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.7;
      
      ctx.beginPath();
      ctx.moveTo(fromPoint.x, fromPoint.y);
      ctx.lineTo(toPoint.x, toPoint.y);
      ctx.stroke();
    }
  });

  // Draw keypoints on top with glow effect
  ctx.globalAlpha = 1;
  pose.keypoints.forEach(keypoint => {
    if (keypoint.score > CONFIDENCE_THRESHOLD) {
      const baseType = keypoint.name.replace('left', '').replace('right', '') as keyof typeof KEYPOINT_COLORS;
      const color = KEYPOINT_COLORS[baseType];
      
      // Draw glow
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;
      ctx.fillStyle = 'white';
      
      ctx.beginPath();
      ctx.arc(keypoint.x, keypoint.y, KEYPOINT_RADIUS, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw point
      ctx.shadowBlur = 0;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(keypoint.x, keypoint.y, KEYPOINT_RADIUS - 1, 0, 2 * Math.PI);
      ctx.fill();
    }
  });
}