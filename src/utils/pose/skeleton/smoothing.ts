import { Point3D } from '../../../types/spatial';

const SMOOTHING_FACTOR = 0.8;

export class PoseSmoother {
  private previousPoints: Point3D[] | null = null;

  smooth(points: Point3D[]): Point3D[] {
    if (!this.previousPoints) {
      this.previousPoints = points;
      return points;
    }

    const smoothedPoints = points.map((point, i) => {
      const prev = this.previousPoints![i];
      return {
        x: prev.x * SMOOTHING_FACTOR + point.x * (1 - SMOOTHING_FACTOR),
        y: prev.y * SMOOTHING_FACTOR + point.y * (1 - SMOOTHING_FACTOR),
        z: prev.z * SMOOTHING_FACTOR + point.z * (1 - SMOOTHING_FACTOR)
      };
    });

    this.previousPoints = smoothedPoints;
    return smoothedPoints;
  }

  reset() {
    this.previousPoints = null;
  }
}