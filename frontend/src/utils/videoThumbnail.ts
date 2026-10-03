/**
 * Captures a real thumbnail frame from a user-selected video file.
 * Draws the frame to a canvas and returns a JPEG data URL, or null
 * when the file cannot be decoded (caller should fall back to a placeholder).
 */
export function captureVideoThumbnail(file: File, seekToSeconds = 1): Promise<string | null> {
  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.src = objectUrl;

    const cleanup = () => {
      URL.revokeObjectURL(objectUrl);
    };

    const fail = () => {
      window.clearTimeout(timer);
      cleanup();
      resolve(null);
    };

    // Never hang the upload flow if the file cannot be decoded.
    const timer = window.setTimeout(fail, 8000);

    video.addEventListener(
      'loadedmetadata',
      () => {
        try {
          const duration = video.duration;
          const target =
            Number.isFinite(duration) && duration > 0
              ? Math.min(seekToSeconds, duration / 2)
              : 0.5;
          video.currentTime = target > 0 ? target : 0.1;
        } catch {
          fail();
        }
      },
      { once: true },
    );

    video.addEventListener(
      'seeked',
      () => {
        try {
          const vw = video.videoWidth || 480;
          const vh = video.videoHeight || 270;
          const scale = Math.min(1, 480 / vw);
          const canvas = document.createElement('canvas');
          canvas.width = Math.max(2, Math.round(vw * scale));
          canvas.height = Math.max(2, Math.round(vh * scale));
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            fail();
            return;
          }
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          let dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          // Shrink further if the payload is too large for a TEXT column.
          if (dataUrl.length > 60000) {
            const small = document.createElement('canvas');
            small.width = 320;
            small.height = Math.max(2, Math.round((canvas.height / canvas.width) * 320));
            const sctx = small.getContext('2d');
            if (sctx) {
              sctx.drawImage(canvas, 0, 0, small.width, small.height);
              dataUrl = small.toDataURL('image/jpeg', 0.6);
            }
          }
          window.clearTimeout(timer);
          cleanup();
          resolve(dataUrl);
        } catch {
          fail();
        }
      },
      { once: true },
    );

    video.addEventListener('error', fail, { once: true });
  });
}
