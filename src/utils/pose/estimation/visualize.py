```python
"""Visualization tools for pose estimation results."""

import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
from typing import Dict, List, Optional

def plot_joint_angles(angles: Dict[str, List[float]], 
                     output_path: str,
                     fps: float = 30.0) -> None:
    """Plot joint angles over time.
    
    Args:
        angles: Dictionary mapping joint names to angle time series
        output_path: Path to save the plot
        fps: Video frame rate for time axis
    """
    time = np.arange(len(next(iter(angles.values())))) / fps
    
    plt.figure(figsize=(12, 6))
    for joint, angle_series in angles.items():
        plt.plot(time, angle_series, label=joint)
        
    plt.xlabel('Time (s)')
    plt.ylabel('Angle (degrees)')
    plt.title('Joint Angles Over Time')
    plt.legend()
    plt.grid(True)
    plt.savefig(output_path, dpi=300)
    plt.close()

def plot_3d_pose(keypoints_3d: np.ndarray,
                 joint_connections: List[Tuple[str, str]],
                 output_path: str) -> None:
    """Create 3D visualization of pose.
    
    Args:
        keypoints_3d: Array of shape (joints, 3)
        joint_connections: List of joint pairs to draw lines between
        output_path: Path to save the plot
    """
    fig = plt.figure(figsize=(10, 10))
    ax = fig.add_subplot(111, projection='3d')
    
    # Plot joints
    ax.scatter(keypoints_3d[:, 0], 
              keypoints_3d[:, 1], 
              keypoints_3d[:, 2], 
              c='r', marker='o')
              
    # Plot connections
    for joint1, joint2 in joint_connections:
        pts = np.vstack([keypoints_3d[joint1], keypoints_3d[joint2]])
        ax.plot(pts[:, 0], pts[:, 1], pts[:, 2], 'b-')
        
    # Set equal aspect ratio
    ax.set_box_aspect([1,1,1])
    plt.savefig(output_path, dpi=300)
    plt.close()

def create_animation(keypoints_3d: np.ndarray,
                    joint_connections: List[Tuple[str, str]],
                    output_path: str,
                    fps: float = 30.0) -> None:
    """Create animated visualization of 3D pose sequence.
    
    Args:
        keypoints_3d: Array of shape (frames, joints, 3)
        joint_connections: List of joint pairs to draw lines between
        output_path: Path to save the animation
        fps: Frame rate for animation
    """
    import matplotlib.animation as animation
    
    fig = plt.figure(figsize=(10, 10))
    ax = fig.add_subplot(111, projection='3d')
    
    def update(frame):
        ax.clear()
        # Plot joints
        ax.scatter(keypoints_3d[frame, :, 0],
                  keypoints_3d[frame, :, 1],
                  keypoints_3d[frame, :, 2],
                  c='r', marker='o')
                  
        # Plot connections
        for joint1, joint2 in joint_connections:
            pts = np.vstack([keypoints_3d[frame, joint1],
                           keypoints_3d[frame, joint2]])
            ax.plot(pts[:, 0], pts[:, 1], pts[:, 2], 'b-')
            
        ax.set_box_aspect([1,1,1])
        
    anim = animation.FuncAnimation(fig, update,
                                 frames=len(keypoints_3d),
                                 interval=1000/fps)
    anim.save(output_path, writer='pillow', fps=fps)
    plt.close()
```