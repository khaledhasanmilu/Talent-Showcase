/**
 * Reads the real playback duration of a user-selected audio (or video) file
 * and formats it as "m:ss". Returns null when the file cannot be decoded —
 * callers should fall back to a placeholder label.
 */
export function getMediaDuration(file: File): Promise<string | null> {
  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const el = document.createElement('audio');
    el.preload = 'metadata';
    el.src = objectUrl;

    const cleanup = () => {
      URL.revokeObjectURL(objectUrl);
    };

    const fail = () => {
      window.clearTimeout(timer);
      cleanup();
      resolve(null);
    };

    // Never hang the upload flow on an undecodable file.
    const timer = window.setTimeout(fail, 8000);

    el.addEventListener(
      'loadedmetadata',
      () => {
        window.clearTimeout(timer);
        const secs = el.duration;
        cleanup();
        if (!Number.isFinite(secs) || secs <= 0) {
          resolve(null);
          return;
        }
        const total = Math.round(secs);
        resolve(`${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`);
      },
      { once: true },
    );

    el.addEventListener('error', fail, { once: true });
  });
}
