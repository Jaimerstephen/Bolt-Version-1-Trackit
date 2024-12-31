import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';
import * as tf from '@tensorflow/tfjs';

let detector: poseDetection.PoseDetector | null = null;

export async function initializePoseDetector() {
  if (!detector) {
    await tf.ready();
    await tf.setBackend('webgl');
    
    detector = await poseDetection.createDetector(
      poseDetection.SupportedModels.BlazePose,
      {
        runtime: 'tfjs',
        enableSmoothing: true,
        modelType: 'full'
      }
    );
    console.log('Pose detector initialized');
  }
  return detector;
}

export async function detectPose(video: HTMLVideoElement) {
  const detector = await initializePoseDetector();
  const poses = await detector.estimatePoses(video, {
    flipHorizontal: false,
    maxPoses: 1,
  });
  
  if (!poses || poses.length === 0) {
    throw new Error('No pose detected in the video');
  }

  return {
    ...poses[0],
    dimensions: {
      width: video.videoWidth,
      height: video.videoHeight
    }
  };
}