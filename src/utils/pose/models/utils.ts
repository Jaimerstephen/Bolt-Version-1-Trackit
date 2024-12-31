import type { PoseData } from '../../../types';

export function mapKeypoints(keypoints: any[]): PoseData {
  return {
    keypoints: keypoints.map(kp => ({
      x: kp.x,
      y: kp.y,
      score: kp.score || 0,
      name: kp.name || ''
    }))
  };
}