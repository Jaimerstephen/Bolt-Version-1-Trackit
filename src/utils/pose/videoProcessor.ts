export async function ensureVideoReady(video: HTMLVideoElement): Promise<void> {
  return new Promise((resolve, reject) => {
    // If video is already loaded
    if (video.readyState >= 2) {
      resolve();
      return;
    }

    const loadHandler = () => {
      video.play().then(resolve).catch(reject);
    };

    const errorHandler = (error: ErrorEvent) => {
      reject(new Error(`Failed to load video: ${error.message}`));
    };

    video.addEventListener('loadeddata', loadHandler, { once: true });
    video.addEventListener('error', errorHandler, { once: true });
  });
}