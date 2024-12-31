import type { PoseData, Analysis } from '../../../types';

export function analyzeFlexibility(poseData: PoseData): Analysis {
  return {
    recommendations: [
      'Hold stretches for 30-60 seconds',
      'Focus on breathing during stretches',
      'Maintain alignment in end ranges'
    ],
    improvements: [
      'Increase range of motion in hips',
      'Work on shoulder mobility',
      'Improve ankle flexibility'
    ],
    score: 75
  };
}