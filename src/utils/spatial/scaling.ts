import { HeightData, Keypoints3D } from '../../types/spatial';
import { calculate3DDistance } from './keypoints';

export function convertToMeters(height: HeightData): number {
  return height.unit === 'inches' ? height.value * 0.0254 : height.value / 100;
}

export function calculateScaleFactor(
  keypoints3D: Keypoints3D,
  realWorldHeight: HeightData
): number {
  const eyeCenter = {
    x: (keypoints3D.leftEye.x + keypoints3D.rightEye.x) / 2,
    y: (keypoints3D.leftEye.y + keypoints3D.rightEye.y) / 2,
    z: (keypoints3D.leftEye.z + keypoints3D.rightEye.z) / 2
  };

  const heelCenter = {
    x: (keypoints3D.leftHeel.x + keypoints3D.rightHeel.x) / 2,
    y: (keypoints3D.leftHeel.y + keypoints3D.rightHeel.y) / 2,
    z: (keypoints3D.leftHeel.z + keypoints3D.rightHeel.z) / 2
  };

  const virtualHeight = calculate3DDistance(eyeCenter, heelCenter);
  const realHeight = convertToMeters(realWorldHeight);

  return realHeight / virtualHeight;
}

export function scaleKeypoints(keypoints3D: Keypoints3D, scaleFactor: number): Keypoints3D {
  return Object.entries(keypoints3D).reduce((acc, [key, point]) => ({
    ...acc,
    [key]: {
      x: point.x * scaleFactor,
      y: point.y * scaleFactor,
      z: point.z * scaleFactor
    }
  }), {} as Keypoints3D);
}