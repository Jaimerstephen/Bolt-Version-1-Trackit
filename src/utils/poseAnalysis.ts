import type { TrainingGoal, Analysis, PoseData } from '../types';
import { detectPose } from './pose/detector';
import { ensureVideoReady } from './pose/videoProcessor';
import { analyzeGoal } from './analysis/goalAnalysis';
import { process3DSpatialAnalysis } from './spatial';

export async function analyzePose(
  video: HTMLVideoElement, 
  goal: TrainingGoal
): Promise<Analysis> {
  try {
    await ensureVideoReady(video);
    const pose = await detectPose(video);
    
    // Convert pose to our PoseData format
    const poseData: PoseData = {
      keypoints: pose.keypoints.map(kp => ({
        x: kp.x,
        y: kp.y,
        score: kp.score || 0,
        name: kp.name || ''
      }))
    };

    return analyzeGoal(poseData, goal);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Pose analysis failed: ${error.message}`);
    }
    throw new Error('Pose analysis failed: Unknown error');
  }
}