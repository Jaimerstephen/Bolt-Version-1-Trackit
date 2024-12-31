import { Keypoints2D, Keypoints3D, HeightData } from '../../types/spatial';
import { lift2DTo3D } from './poseLift';
import { calculateScaleFactor, scaleKeypoints } from './scaling';
import { smoothKeypoints } from './smoothing';

const DEFAULT_HEIGHT: HeightData = {
  value: 175,
  unit: 'centimeters'
};

export function process3DSpatialAnalysis(keypoints2D: Keypoints2D): Keypoints3D {
  // Step 1: Lift 2D keypoints to 3D
  const initial3D = lift2DTo3D(keypoints2D);

  // Step 2: Calculate and apply scaling
  const scaleFactor = calculateScaleFactor(initial3D, DEFAULT_HEIGHT);
  const scaled3D = scaleKeypoints(initial3D, scaleFactor);

  // Step 3: Apply smoothing
  return smoothKeypoints(scaled3D);
}