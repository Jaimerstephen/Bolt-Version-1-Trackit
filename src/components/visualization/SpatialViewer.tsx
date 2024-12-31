import React, { useEffect, useRef } from 'react';
import type { Keypoints3D } from '../../types/spatial';
import { createScene, type Scene } from '../../utils/visualization/threeDScene';

interface Props {
  keypoints3D: Keypoints3D;
}

export function SpatialViewer({ keypoints3D }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<Scene | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    sceneRef.current = createScene(container);

    const handleResize = () => {
      if (sceneRef.current) {
        sceneRef.current.resize(container.clientWidth, container.clientHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (sceneRef.current) {
        sceneRef.current.dispose();
        sceneRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.updatePoseModel(keypoints3D);
    }
  }, [keypoints3D]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full bg-gray-900"
    />
  );
}