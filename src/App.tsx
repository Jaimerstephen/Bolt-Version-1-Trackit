import React, { useState, useRef } from 'react';
import { VideoUpload } from './components/VideoUpload';
import { GoalSelector } from './components/GoalSelector';
import { AnalysisResult } from './components/AnalysisResult';
import { analyzePose } from './utils/poseAnalysis';
import { process3DSpatialAnalysis } from './utils/spatial';
import type { TrainingGoal, Analysis } from './types';
import type { Keypoints3D } from './types/spatial';
import { Camera } from 'lucide-react';

export default function App() {
  const [selectedGoal, setSelectedGoal] = useState<TrainingGoal>('technique');
  const [video, setVideo] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [keypoints3D, setKeypoints3D] = useState<Keypoints3D | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoUrlRef = useRef<string | null>(null);

  const handleVideoSelect = async (file: File) => {
    try {
      setVideo(file);
      setAnalysis(null);
      setKeypoints3D(null);
      setError(null);
      setAnalyzing(true);

      if (videoUrlRef.current) {
        URL.revokeObjectURL(videoUrlRef.current);
      }

      const videoUrl = URL.createObjectURL(file);
      videoUrlRef.current = videoUrl;

      if (!videoRef.current) {
        throw new Error('Video element not found');
      }

      videoRef.current.src = videoUrl;
      const result = await analyzePose(videoRef.current, selectedGoal);
      
      const spatialData = process3DSpatialAnalysis({
        leftEye: { x: 0, y: 0 },
        rightEye: { x: 100, y: 0 },
        leftHeel: { x: 0, y: 200 },
        rightHeel: { x: 100, y: 200 }
      }, {
        value: 170,
        unit: 'centimeters'
      });

      setAnalysis(result);
      setKeypoints3D(spatialData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
      console.error('Analysis failed:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  React.useEffect(() => {
    return () => {
      if (videoUrlRef.current) {
        URL.revokeObjectURL(videoUrlRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <Camera className="mx-auto h-12 w-12 text-blue-600" />
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900">
            AI Training Analysis
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Upload your training video and get personalized recommendations
          </p>
        </div>

        <div className="mt-12 space-y-8">
          <div>
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              1. Select Your Training Goal
            </h2>
            <GoalSelector
              selectedGoal={selectedGoal}
              onSelectGoal={setSelectedGoal}
            />
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              2. Upload Your Video
            </h2>
            <VideoUpload onVideoSelect={handleVideoSelect} />
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>

          {analyzing && (
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-2 text-gray-600">Analyzing your form...</p>
            </div>
          )}

          {analysis && (
            <div>
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                3. Your Analysis Results
              </h2>
              <AnalysisResult 
                analysis={analysis} 
                keypoints3D={keypoints3D || undefined} 
                videoElement={videoRef.current || undefined}
              />
            </div>
          )}
        </div>

        <video
          ref={videoRef}
          className="hidden"
          playsInline
          muted
        />
      </div>
    </div>
  );
}