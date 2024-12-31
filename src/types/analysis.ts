import type { ModelType, PoseData } from './index';

export interface ModelResult {
  modelName: ModelType;
  confidence: number;
  detectedMotion: string;
  recommendations: string[];
  improvements: string[];
  score: number;
  poseData: PoseData;
}

export interface Analysis {
  modelResults: ModelResult[];
  consolidated: {
    detectedMotion: string;
    confidence: number;
    recommendations: string[];
    improvements: string[];
    score: number;
  };
}