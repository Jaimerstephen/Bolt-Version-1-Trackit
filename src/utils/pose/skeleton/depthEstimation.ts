import { PoseData } from '../../../types';
import { HUMAN_HEIGHT_M } from './constants';

export function estimateDepth(pose: PoseData): number[] {
  const eyePoints = pose.keypoints.filter(kp => 
    kp.name.includes('Eye') && kp.score > 0.5
  );
  const heelPoints = pose.keypoints.filter(kp => 
    kp.name.includes('Heel') && kp.score > 0.5
  );

  if (eyePoints.length < 2 || heelPoints.length < 2) {
    return pose.keypoints.map(() => 0);
  }

  // Calculate height in pixels
  const eyeY = Math.min(...eyePoints.map(p => p.y));
  const heelY = Math.max(...heelPoints.map(p => p.y));
  const heightPixels = heelY - eyeY;

  // Estimate depth using perspective projection
  // Z = (f * H) / h where:
  // f is focal length (estimated)
  // H is real height
  // h is height in pixels
  const focalLength = 1000; // Estimated focal length
  const baseDepth = (focalLength * HUMAN_HEIGHT_M) / heightPixels;

  // Return depth for each keypoint
  return pose.keypoints.map(kp => {
    const verticalPosition = (kp.y - eyeY) / heightPixels;
    return baseDepth * (1 + verticalPosition * 0.1); // Add slight depth variation
  });
}