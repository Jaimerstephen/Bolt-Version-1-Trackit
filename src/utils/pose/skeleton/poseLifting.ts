import { PoseData } from '../../../types';
import { Point3D } from '../../../types/spatial';
import { estimateDepth } from './depthEstimation';
import { PoseSmoother } from './smoothing';

const smoother = new PoseSmoother();

export function liftPoseTo3D(pose: PoseData): Point3D[] {
  // Estimate depth for each keypoint
  const depths = estimateDepth(pose);

  // Convert 2D points to 3D
  const points3D = pose.keypoints.map((kp, i) => ({
    x: kp.x - window.innerWidth / 2, // Center X coordinate
    y: -(kp.y - window.innerHeight / 2), // Invert Y coordinate
    z: -depths[i] // Negative Z for OpenGL convention
  }));

  // Apply smoothing
  return smoother.smooth(points3D);
}

export function resetSmoothing() {
  smoother.reset();
}