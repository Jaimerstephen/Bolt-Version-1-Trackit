export type TrainingGoal = 'strength' | 'endurance' | 'flexibility' | 'technique';

export type ModelType = 'blazepose' | 'movenet' | 'posenet' | 'openpose';

export interface PoseData {
  keypoints: Array<{
    x: number;
    y: number;
    score: number;
    name: string;
  }>;
  dimensions: {
    width: number;
    height: number;
  };
}

export interface ModelResult {
  modelName: ModelType;
  confidence: number;
  detectedMotion: string;
  recommendations: string[];
  improvements: string[];
  score: number;
  poseData: PoseData;
}