import { blazePoseDetector } from './blazepose';
import { moveNetDetector } from './movenet';
import { poseNetDetector } from './posenet';
import type { ModelType, PoseData } from '../../../types';

const models = {
  blazepose: blazePoseDetector,
  movenet: moveNetDetector,
  posenet: poseNetDetector
};

export async function detectPoseWithAllModels(video: HTMLVideoElement) {
  const results = await Promise.allSettled(
    Object.entries(models).map(async ([modelType, detector]) => {
      try {
        const result = await detector.detect(video);
        return {
          modelType: modelType as ModelType,
          data: result
        };
      } catch (error) {
        throw new Error(`${modelType} detection failed`);
      }
    })
  );

  return results
    .filter((result): result is PromiseFulfilledResult<{
      modelType: ModelType;
      data: PoseData;
    }> => result.status === 'fulfilled')
    .map(result => result.value);
}