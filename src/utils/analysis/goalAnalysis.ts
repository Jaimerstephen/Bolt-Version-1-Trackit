import type { TrainingGoal, PoseData } from '../../types';
import type { Analysis } from '../../types/analysis';
import { detectMotion } from '../pose/analyzers/motionDetection';
import {
  analyzeFormTechnique,
  analyzeStrengthPerformance,
  analyzeEndurance,
  analyzeFlexibility
} from '../pose/analyzers';

export function analyzeGoal(poseData: PoseData, goal: TrainingGoal): Analysis {
  const motion = detectMotion(poseData);
  let analysis;

  switch (goal) {
    case 'technique':
      analysis = analyzeFormTechnique(poseData);
      break;
    case 'strength':
      analysis = analyzeStrengthPerformance(poseData);
      break;
    case 'endurance':
      analysis = analyzeEndurance(poseData);
      break;
    case 'flexibility':
      analysis = analyzeFlexibility(poseData);
      break;
    default:
      throw new Error('Invalid training goal');
  }

  return {
    modelResults: [{
      modelName: 'blazepose',
      confidence: motion.confidence,
      detectedMotion: motion.name,
      recommendations: analysis.recommendations,
      improvements: analysis.improvements,
      score: analysis.score,
      poseData
    }],
    consolidated: {
      detectedMotion: motion.name,
      confidence: motion.confidence,
      recommendations: analysis.recommendations,
      improvements: analysis.improvements,
      score: analysis.score
    }
  };
}