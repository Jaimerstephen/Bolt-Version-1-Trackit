import { Point3D, Keypoints3D } from '../../types/spatial';

interface SmoothingState {
  previousKeypoints: Keypoints3D | null;
  alpha: number; // Smoothing factor (0-1)
}

const state: SmoothingState = {
  previousKeypoints: null,
  alpha: 0.8 // Adjust this value to control smoothing strength
};

function smoothPoint(current: Point3D, previous: Point3D): Point3D {
  return {
    x: state.alpha * previous.x + (1 - state.alpha) * current.x,
    y: state.alpha * previous.y + (1 - state.alpha) * current.y,
    z: state.alpha * previous.z + (1 - state.alpha) * current.z
  };
}

export function smoothKeypoints(keypoints: Keypoints3D): Keypoints3D {
  if (!state.previousKeypoints) {
    state.previousKeypoints = keypoints;
    return keypoints;
  }

  const smoothedKeypoints = Object.entries(keypoints).reduce((acc, [key, point]) => ({
    ...acc,
    [key]: smoothPoint(point, state.previousKeypoints![key])
  }), {} as Keypoints3D);

  state.previousKeypoints = smoothedKeypoints;
  return smoothedKeypoints;
}