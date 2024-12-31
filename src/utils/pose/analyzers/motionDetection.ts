import type { PoseData } from '../../../types';
import { motionPatterns } from './motionPatterns';

interface Motion {
  name: string;
  confidence: number;
  details: {
    phase: string;
    keyPoints: string[];
  };
}

export function detectMotion(poseData: PoseData): Motion {
  // Calculate confidence for each motion pattern
  const confidenceScores = Object.entries(motionPatterns).map(([name, detector]) => ({
    name,
    confidence: detector(poseData.keypoints) * 100,
    details: analyzeMotionPhase(name, poseData.keypoints)
  }));

  // Find best matching motion
  const bestMatch = confidenceScores.reduce((prev, current) => 
    current.confidence > prev.confidence ? current : prev
  );

  return {
    name: bestMatch.name,
    confidence: bestMatch.confidence,
    details: bestMatch.details
  };
}

function analyzeMotionPhase(motionName: string, keypoints: PoseData['keypoints']) {
  // Analyze current phase of the motion
  switch (motionName) {
    case 'discusThrow':
      return analyzeDiscusPhase(keypoints);
    case 'shotPut':
      return analyzeShotPutPhase(keypoints);
    case 'javelinThrow':
      return analyzeJavelinPhase(keypoints);
    default:
      return {
        phase: 'unknown',
        keyPoints: []
      };
  }
}

function analyzeDiscusPhase(keypoints: PoseData['keypoints']) {
  const shoulders = keypoints.filter(kp => kp.name.includes('shoulder'));
  const hips = keypoints.filter(kp => kp.name.includes('hip'));
  
  if (shoulders.length < 2 || hips.length < 2) {
    return { phase: 'unknown', keyPoints: [] };
  }

  const shoulderRotation = Math.abs(shoulders[0].x - shoulders[1].x);
  const hipRotation = Math.abs(hips[0].x - hips[1].x);

  // Determine phase based on rotation angles
  if (shoulderRotation < 30) {
    return {
      phase: 'wind-up',
      keyPoints: ['Initiate rotation', 'Load hips', 'Keep arms wide']
    };
  } else if (shoulderRotation < 90) {
    return {
      phase: 'transition',
      keyPoints: ['Drive from ground', 'Maintain arm position', 'Rotate core']
    };
  } else {
    return {
      phase: 'release',
      keyPoints: ['Explosive hip rotation', 'Follow through', 'Balance finish']
    };
  }
}

// Add similar phase analysis for other throws
function analyzeShotPutPhase(keypoints: PoseData['keypoints']) {
  // Implementation for shot put phases
  return { phase: 'preparation', keyPoints: [] };
}

function analyzeJavelinPhase(keypoints: PoseData['keypoints']) {
  // Implementation for javelin phases
  return { phase: 'approach', keyPoints: [] };
}