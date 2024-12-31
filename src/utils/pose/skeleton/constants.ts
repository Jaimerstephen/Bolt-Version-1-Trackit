export const HUMAN_HEIGHT_M = 1.75; // Default height in meters

// Define skeleton segments for visualization
export const SKELETON_CONNECTIONS = [
  ['leftEye', 'rightEye'],
  ['leftEye', 'leftEar'],
  ['rightEye', 'rightEar'],
  ['leftShoulder', 'rightShoulder'],
  ['leftShoulder', 'leftElbow'],
  ['leftElbow', 'leftWrist'],
  ['rightShoulder', 'rightElbow'],
  ['rightElbow', 'rightWrist'],
  ['leftShoulder', 'leftHip'],
  ['rightShoulder', 'rightHip'],
  ['leftHip', 'rightHip'],
  ['leftHip', 'leftKnee'],
  ['leftKnee', 'leftAnkle'],
  ['rightHip', 'rightKnee'],
  ['rightKnee', 'rightAnkle']
] as const;

export const KEYPOINT_COLORS = {
  eye: '#ff0000',
  ear: '#ff4500',
  shoulder: '#00ff00',
  elbow: '#00ff00',
  wrist: '#00ff00',
  hip: '#0000ff',
  knee: '#0000ff',
  ankle: '#0000ff'
} as const;