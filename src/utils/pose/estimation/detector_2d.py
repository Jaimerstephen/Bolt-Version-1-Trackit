```python
"""2D pose detection using MediaPipe or OpenPose."""

import cv2
import numpy as np
import mediapipe as mp
from typing import List, Tuple, Optional
from dataclasses import dataclass

@dataclass
class Keypoint2D:
    x: float
    y: float
    confidence: float
    name: str

class MediaPipePoseDetector:
    def __init__(self, min_detection_conf: float = 0.5, min_tracking_conf: float = 0.5):
        """Initialize MediaPipe pose detector.
        
        Args:
            min_detection_conf: Minimum confidence for detection
            min_tracking_conf: Minimum confidence for tracking
        """
        self.mp_pose = mp.solutions.pose
        self.pose = self.mp_pose.Pose(
            min_detection_confidence=min_detection_conf,
            min_tracking_confidence=min_tracking_conf
        )
        
    def detect(self, frame: np.ndarray) -> List[Keypoint2D]:
        """Detect 2D pose keypoints in a single frame.
        
        Args:
            frame: RGB image as numpy array
            
        Returns:
            List of detected keypoints with coordinates and confidence
        """
        results = self.pose.process(frame)
        if not results.pose_landmarks:
            return []
            
        keypoints = []
        for idx, landmark in enumerate(results.pose_landmarks.landmark):
            keypoints.append(Keypoint2D(
                x=landmark.x * frame.shape[1],
                y=landmark.y * frame.shape[0],
                confidence=landmark.visibility,
                name=self.mp_pose.PoseLandmark(idx).name
            ))
        return keypoints
        
    def __del__(self):
        self.pose.close()

class OpenPosePythonDetector:
    """Optional OpenPose implementation if available."""
    def __init__(self):
        try:
            import pyopenpose as op
            self.op = op
            params = {
                "model_folder": "./models/openpose",
                "number_people_max": 1
            }
            self.opWrapper = op.WrapperPython()
            self.opWrapper.configure(params)
            self.opWrapper.start()
        except ImportError:
            raise ImportError("OpenPose Python API not found. Please install it first.")
            
    def detect(self, frame: np.ndarray) -> List[Keypoint2D]:
        datum = self.op.Datum()
        datum.cvInputData = frame
        self.opWrapper.emplaceAndPop(self.op.VectorDatum([datum]))
        
        if datum.poseKeypoints is None:
            return []
            
        keypoints = []
        for idx, kp in enumerate(datum.poseKeypoints[0]):
            keypoints.append(Keypoint2D(
                x=kp[0],
                y=kp[1],
                confidence=kp[2],
                name=f"kp_{idx}"
            ))
        return keypoints
```