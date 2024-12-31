```python
"""Kinematic computations for 3D pose data."""

import numpy as np
from typing import Tuple, List, Dict
from dataclasses import dataclass

@dataclass
class JointAngle:
    angle: float  # in degrees
    parent_joint: str
    child_joint: str

def compute_joint_angles(keypoints_3d: np.ndarray, 
                        joint_connections: List[Tuple[str, str]]) -> Dict[str, List[float]]:
    """Compute joint angles between connected segments.
    
    Args:
        keypoints_3d: Array of shape (frames, joints, 3)
        joint_connections: List of joint name pairs defining segments
        
    Returns:
        Dictionary mapping joint names to angle time series
    """
    angles = {}
    for joint1, joint2 in joint_connections:
        # Get vectors between connected joints
        vec1 = keypoints_3d[:, joint1] - keypoints_3d[:, joint2]
        vec2 = keypoints_3d[:, joint2] - keypoints_3d[:, joint1]
        
        # Compute angle using dot product
        dot_product = np.sum(vec1 * vec2, axis=1)
        norms = np.linalg.norm(vec1, axis=1) * np.linalg.norm(vec2, axis=1)
        angles[f"{joint1}_{joint2}"] = np.arccos(dot_product / norms) * 180 / np.pi
        
    return angles

def compute_velocity(positions: np.ndarray, fps: float = 30.0) -> np.ndarray:
    """Compute velocity using finite differences.
    
    Args:
        positions: Array of shape (frames, joints, 3)
        fps: Video frame rate
        
    Returns:
        Velocity array of shape (frames-1, joints, 3)
    """
    return np.diff(positions, axis=0) * fps

def compute_acceleration(velocity: np.ndarray, fps: float = 30.0) -> np.ndarray:
    """Compute acceleration using finite differences.
    
    Args:
        velocity: Array of shape (frames, joints, 3)
        fps: Video frame rate
        
    Returns:
        Acceleration array of shape (frames-1, joints, 3)
    """
    return np.diff(velocity, axis=0) * fps
```