import { Point2D, Point3D, Keypoints2D } from '../../types/spatial';

export function calculateMidpoint(point1: Point2D, point2: Point2D): Point2D {
  return {
    x: (point1.x + point2.x) / 2,
    y: (point1.y + point2.y) / 2
  };
}

export function getEyeCenter(keypoints: Keypoints2D): Point2D {
  return calculateMidpoint(keypoints.leftEye, keypoints.rightEye);
}

export function getHeelCenter(keypoints: Keypoints2D): Point2D {
  return calculateMidpoint(keypoints.leftHeel, keypoints.rightHeel);
}

export function calculate3DDistance(point1: Point3D, point2: Point3D): number {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  const dz = point2.z - point1.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}