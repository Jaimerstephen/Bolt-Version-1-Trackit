```python
"""Main script for 3D pose estimation pipeline."""

import cv2
import numpy as np
from pathlib import Path
from typing import Optional

from .config import PoseEstimationConfig
from .detector_2d import MediaPipePoseDetector, OpenPosePythonDetector
from .filter import butterworth_filter, KeypointKalmanFilter, moving_average
from .lift_3d import VideoPose3DLifter, PoseFormerLifter
from .kinematics import compute_joint_angles, compute_velocity, compute_acceleration
from .visualize import plot_joint_angles, plot_3d_pose, create_animation

def process_video(config: PoseEstimationConfig) -> None:
    """Run complete pose estimation pipeline on video.
    
    Args:
        config: Configuration object with all parameters
    """
    # 1. Initialize 2D detector
    if config.detector == "mediapipe":
        detector = MediaPipePoseDetector(
            min_detection_conf=config.min_detection_confidence,
            min_tracking_conf=config.min_tracking_confidence
        )
    else:
        detector = OpenPosePythonDetector()
        
    # 2. Initialize 3D lifter
    if config.model_type == "videopose3d":
        lifter = VideoPose3DLifter(config.model_weights)
    else:
        lifter = PoseFormerLifter(config.model_weights)
        
    # 3. Process video frames
    cap = cv2.VideoCapture(config.input_video)
    fps = cap.get(cv2.CAP_PROP_FPS)
    
    keypoints_2d = []
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
            
        # Detect 2D pose
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        kpts = detector.detect(frame_rgb)
        if kpts:
            keypoints_2d.append(kpts)
            
    cap.release()
    
    # 4. Convert to numpy array
    keypoints_2d = np.array(keypoints_2d)
    
    # 5. Apply temporal filtering to 2D keypoints
    if config.temporal_filter == "butterworth":
        keypoints_2d_filtered = butterworth_filter(
            keypoints_2d,
            cutoff=config.butterworth_cutoff,
            fs=fps,
            order=config.butterworth_order
        )
    elif config.temporal_filter == "moving_avg":
        keypoints_2d_filtered = moving_average(
            keypoints_2d,
            window=config.moving_avg_window
        )
    else:  # Kalman filter
        kf = KeypointKalmanFilter(dim_z=2)
        keypoints_2d_filtered = np.array([
            kf.update(kpts) for kpts in keypoints_2d
        ])
        
    # 6. Lift to 3D
    keypoints_3d = lifter.lift(keypoints_2d_filtered)
    
    # 7. Compute kinematics
    joint_angles = compute_joint_angles(keypoints_3d, JOINT_CONNECTIONS)
    velocities = compute_velocity(keypoints_3d, fps)
    accelerations = compute_acceleration(velocities, fps)
    
    # 8. Visualize results
    output_dir = Path(config.output_dir)
    
    if "plot" in config.viz_type:
        plot_joint_angles(
            joint_angles,
            output_dir / "joint_angles.png",
            fps=fps
        )
        
    if "3d_animation" in config.viz_type:
        create_animation(
            keypoints_3d,
            JOINT_CONNECTIONS,
            output_dir / "pose_animation.gif",
            fps=fps
        )
        
    # 9. Save numerical results
    np.save(output_dir / "keypoints_3d.npy", keypoints_3d)
    np.save(output_dir / "velocities.npy", velocities)
    np.save(output_dir / "accelerations.npy", accelerations)

if __name__ == "__main__":
    # Example usage
    config = PoseEstimationConfig(
        input_video="input.mp4",
        output_dir="output",
        detector="mediapipe",
        temporal_filter="butterworth",
        model_type="videopose3d"
    )
    
    process_video(config)
```