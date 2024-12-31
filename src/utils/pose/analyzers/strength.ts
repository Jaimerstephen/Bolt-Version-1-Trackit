import type { PoseData, Analysis } from '../../../types';

export function analyzeStrengthPerformance(poseData: PoseData): Analysis {
  return {
    recommendations: [
      'Increase time under tension',
      'Focus on eccentric phase of movement',
      'Maintain proper breathing patterns'
    ],
    improvements: [
      'Add progressive overload',
      'Improve stability at end ranges',
      'Work on power development'
    ],
    score: 78
  };
}