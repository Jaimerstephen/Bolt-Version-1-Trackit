```python
"""Configuration settings for pose estimation pipeline."""

import os
from dataclasses import dataclass
from typing import Literal

@dataclass
class PoseEstimationConfig:
    # Input/Output
    input_video: str
    output_dir: str = "output"
    
    # 2D Detection
    detector: Literal["mediapipe", "openpose"] = "mediapipe"
    min_detection_confidence: float = 0.5
    min_tracking_confidence: float = 0.5
    
    # Filtering
    temporal_filter: Literal["butterworth", "kalman", "moving_avg"] = "butterworth"
    butterworth_cutoff: float = 7.0  # Hz
    butterworth_order: int = 4
    moving_avg_window: int = 5
    
    # 3D Lifting
    model_type: Literal["videopose3d", "poseformer"] = "videopose3d"
    model_weights: str = "pretrained_h36m_cpn.bin"
    
    # Visualization
    viz_type: set[Literal["plot", "3d_animation"]] = {"plot", "3d_animation"}
    plot_dpi: int = 300
    
    def __post_init__(self):
        os.makedirs(self.output_dir, exist_ok=True)
```