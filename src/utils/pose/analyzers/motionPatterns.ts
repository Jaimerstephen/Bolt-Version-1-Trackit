import type { PoseData } from '../../../types';

// Define key angles and positions for different athletic movements
export const motionPatterns = {
  discusThrow: (keypoints: PoseData['keypoints']) => {
    // Check for rotational movement and arm positions typical in discus
    const shoulders = keypoints.filter(kp => kp.name.includes('shoulder'));
    const hips = keypoints.filter(kp => kp.name.includes('hip'));
    const wrists = keypoints.filter(kp => kp.name.includes('wrist'));
    
    if (shoulders.length < 2 || hips.length < 2 || wrists.length < 2) return 0;
    
    // Calculate shoulder rotation
    const shoulderRotation = Math.abs(shoulders[0].x - shoulders[1].x);
    const hipRotation = Math.abs(hips[0].x - hips[1].x);
    const armExtension = Math.max(...wrists.map(w => w.x)) - Math.min(...shoulders.map(s => s.x));
    
    // Weight different aspects of the throw
    const rotationScore = (shoulderRotation + hipRotation) / 2;
    const armScore = armExtension / 100; // Normalize to 0-1
    
    return (rotationScore * 0.6 + armScore * 0.4);
  },

  shotPut: (keypoints: PoseData['keypoints']) => {
    // Similar pattern detection for shot put
    const shoulders = keypoints.filter(kp => kp.name.includes('shoulder'));
    const elbows = keypoints.filter(kp => kp.name.includes('elbow'));
    
    if (shoulders.length < 2 || elbows.length < 2) return 0;
    
    // Calculate pushing motion
    const elbowFlexion = Math.abs(elbows[0].y - shoulders[0].y);
    return elbowFlexion / 100;
  },

  // Add more throwing patterns
  javelinThrow: (keypoints: PoseData['keypoints']) => {
    const shoulders = keypoints.filter(kp => kp.name.includes('shoulder'));
    const elbows = keypoints.filter(kp => kp.name.includes('elbow'));
    const wrists = keypoints.filter(kp => kp.name.includes('wrist'));
    
    if (shoulders.length < 2 || elbows.length < 2 || wrists.length < 2) return 0;
    
    // Check for overhead throwing position
    const armHeight = Math.min(...shoulders.map(s => s.y)) - Math.min(...wrists.map(w => w.y));
    const armExtension = Math.max(...wrists.map(w => w.x)) - Math.min(...elbows.map(e => e.x));
    
    return (armHeight * 0.7 + armExtension * 0.3) / 100;
  }
};