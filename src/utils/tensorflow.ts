import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';

export async function initializeTensorFlow() {
  try {
    await tf.setBackend('webgl');
    await tf.ready();
  } catch (error) {
    throw new Error('Failed to initialize TensorFlow.js');
  }
}