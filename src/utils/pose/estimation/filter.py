```python
"""Temporal filtering for pose keypoints."""

import numpy as np
from scipy import signal
from typing import List, Optional
from filterpy.kalman import KalmanFilter

def butterworth_filter(data: np.ndarray, cutoff: float, fs: float = 30.0, order: int = 4) -> np.ndarray:
    """Apply Butterworth low-pass filter to keypoint trajectories.
    
    Args:
        data: Numpy array of shape (n_frames, n_keypoints, 2 or 3)
        cutoff: Cutoff frequency in Hz
        fs: Sampling frequency in Hz
        order: Filter order
        
    Returns:
        Filtered data with same shape as input
    """
    nyq = fs * 0.5
    normal_cutoff = cutoff / nyq
    b, a = signal.butter(order, normal_cutoff, btype='low', analog=False)
    
    # Apply filter along time dimension for each coordinate
    filtered = np.zeros_like(data)
    for i in range(data.shape[1]):  # For each keypoint
        for j in range(data.shape[2]):  # For each coordinate
            filtered[:, i, j] = signal.filtfilt(b, a, data[:, i, j])
    return filtered

class KeypointKalmanFilter:
    """Kalman filter for smoothing keypoint trajectories."""
    
    def __init__(self, dim_z: int, dim_x: int = None):
        """Initialize Kalman filter for pose tracking.
        
        Args:
            dim_z: Dimension of measurements (2 for 2D, 3 for 3D)
            dim_x: State dimension (typically 2*dim_z for position and velocity)
        """
        if dim_x is None:
            dim_x = 2 * dim_z
            
        self.kf = KalmanFilter(dim_x=dim_x, dim_z=dim_z)
        dt = 1.0  # Time step
        
        # State transition matrix (constant velocity model)
        self.kf.F = np.eye(dim_x)
        self.kf.F[:dim_z, dim_z:] = np.eye(dim_z) * dt
        
        # Measurement matrix (we only measure position)
        self.kf.H = np.zeros((dim_z, dim_x))
        self.kf.H[:, :dim_z] = np.eye(dim_z)
        
        # Reasonable starting values for covariance matrices
        self.kf.R *= 0.01  # Measurement noise
        self.kf.Q *= 0.1   # Process noise
        self.kf.P *= 1000  # Initial state uncertainty
        
    def update(self, measurement: np.ndarray) -> np.ndarray:
        """Update filter with new measurement and return filtered state."""
        self.kf.predict()
        self.kf.update(measurement)
        return self.kf.x[:measurement.shape[0]]

def moving_average(data: np.ndarray, window: int = 5) -> np.ndarray:
    """Simple moving average filter."""
    return np.array([
        np.convolve(data[:, i], np.ones(window)/window, mode='valid')
        for i in range(data.shape[1])
    ]).T
```