import type { PoseData } from '../../../types';

export function analyzeEndurance(poseData: PoseData) {
  return {
    detectedMotion: 'endurance exercise',
    confidence: 85,
    recommendations: [
      'Maintain consistent pace',
      'Focus on breathing rhythm',
      'Keep proper form during fatigue'
    ],
    improvements: [
      'Build aerobic capacity',
      'Improve movement efficiency',
      'Develop better pacing strategy'
    ],
    score: 82
  };
}