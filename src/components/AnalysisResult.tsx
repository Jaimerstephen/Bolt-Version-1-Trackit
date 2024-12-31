```tsx
import React, { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';
import { MotionAnalysis } from './analysis/MotionAnalysis';
import { SpatialAnalysis } from './analysis/SpatialAnalysis';
import { VideoComparison } from './visualization/VideoComparison';
import { PoseViewer2D } from './visualization/PoseViewer2D';
import { SpatialViewer } from './visualization/SpatialViewer';
import type { Analysis } from '../types';
import type { Keypoints3D } from '../types/spatial';

interface Props {
  analysis: Analysis;
  keypoints3D?: Keypoints3D;
  videoElement?: HTMLVideoElement;
}

export default function AnalysisResult({ analysis, keypoints3D, videoElement }: Props) {
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (!videoElement) return;

    const updateTime = () => {
      setCurrentTime(videoElement.currentTime);
    };

    videoElement.addEventListener('timeupdate', updateTime);

    return () => {
      videoElement.removeEventListener('timeupdate', updateTime);
    };
  }, [videoElement]);

  if (!analysis?.consolidated || !videoElement || !analysis.modelResults[0]) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Score Banner */}
      <div className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Overall Performance</h2>
          <div className="flex items-center space-x-2">
            <Trophy className="h-5 w-5" />
            <span className="text-xl font-bold">
              {analysis.consolidated.score}/100
            </span>
          </div>
        </div>
      </div>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-12 gap-4 h-[600px]">
        {/* Video Player with Overlay - Larger left column */}
        <div className="col-span-8 rounded-lg overflow-hidden bg-black relative">
          <VideoComparison 
            video={videoElement} 
            poseData={analysis.modelResults[0].poseData}
            currentTime={currentTime}
          />
        </div>

        {/* Right Column for 2D and 3D Analysis */}
        <div className="col-span-4 space-y-4">
          {/* 2D Pose Analysis */}
          <div className="h-[290px] rounded-lg overflow-hidden bg-black">
            <PoseViewer2D 
              poseData={analysis.modelResults[0].poseData}
              currentTime={currentTime}
            />
          </div>

          {/* 3D Spatial Analysis */}
          {keypoints3D && (
            <div className="h-[290px] rounded-lg overflow-hidden">
              <SpatialViewer 
                keypoints3D={keypoints3D}
                currentTime={currentTime}
              />
            </div>
          )}
        </div>
      </div>

      {/* Analysis Details */}
      <div className="grid grid-cols-2 gap-6">
        <MotionAnalysis analysis={analysis} />
        {keypoints3D && (
          <SpatialAnalysis 
            keypoints3D={keypoints3D} 
            videoElement={videoElement}
          />
        )}
      </div>
    </div>
  );
}
```