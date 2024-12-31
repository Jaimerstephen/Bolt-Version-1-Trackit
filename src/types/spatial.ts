export interface Point2D {
  x: number;
  y: number;
}

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface Keypoints2D {
  leftEye: Point2D;
  rightEye: Point2D;
  leftHeel: Point2D;
  rightHeel: Point2D;
  [key: string]: Point2D;
}

export interface Keypoints3D {
  leftEye: Point3D;
  rightEye: Point3D;
  leftHeel: Point3D;
  rightHeel: Point3D;
  [key: string]: Point3D;
}

export type MeasurementUnit = 'inches' | 'centimeters';

export interface HeightData {
  value: number;
  unit: MeasurementUnit;
}