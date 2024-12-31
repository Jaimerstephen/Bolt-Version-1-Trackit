import type { PoseData, Analysis } from '../../../types';

export function analyzeFormTechnique(poseData: PoseData): Analysis {
  return {
    recommendations: [
      'Maintain neutral spine alignment throughout movement',
      'Keep shoulders back and chest up',
      'Focus on controlled, deliberate movements'
    ],
    improvements: [
      'Work on hip hinge mechanics',
      'Improve knee tracking over toes',
      'Increase core engagement'
    ],
    score: 85
  };
}