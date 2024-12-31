import * as poseDetection from '@tensorflow-models/pose-detection';
import { initializeTensorFlow } from '../../tensorflow';
import type { PoseData } from '../../../types';
import { mapKeypoints } from './utils';

class BlazePoseDetector {
  private detector: poseDetection.PoseDetector | null = null;

  async initialize() {
    if (!this.detector) {
      await initializeTensorFlow();
      this.detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.BlazePose,
        {
          runtime: 'tfjs',
          modelType: 'full'
        }
      );
    }
  }

  async detect(video: HTMLVideoElement): Promise<PoseData> {
    await this.initialize();
    const poses = await this.detector!.estimatePoses(video);
    
    if (!poses || poses.length === 0) {
      throw new Error('No pose detected');
    }

    return mapKeypoints(poses[0].keypoints);
  }
}

export const blazePoseDetector = new BlazePoseDetector();