/**
 * Media Storage & Device Upload Utility for TWC Cycling Uganda
 * Handles file reading, canvas-based image compression, video frame thumbnail capture,
 * and IndexedDB blob caching for smooth playback of device-uploaded videos.
 */

const DB_NAME = 'twc_device_media_vault_v1';
const STORE_NAME = 'media_blobs';

// Initialize IndexedDB
function openIndexedDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }
    const request = window.indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Save raw media file/blob to IndexedDB for offline / instant device playback
 */
export async function saveMediaBlob(id: string, blob: Blob): Promise<void> {
  try {
    const db = await openIndexedDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put({ id, blob, updatedAt: Date.now() });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Could not save media blob to IndexedDB:', err);
  }
}

/**
 * Retrieve raw media file/blob from IndexedDB by ID
 */
export async function getMediaBlob(id: string): Promise<Blob | null> {
  try {
    const db = await openIndexedDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => {
        resolve(req.result ? req.result.blob : null);
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Could not retrieve media blob from IndexedDB:', err);
    return null;
  }
}

/**
 * Delete media blob from IndexedDB
 */
export async function deleteMediaBlob(id: string): Promise<void> {
  try {
    const db = await openIndexedDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Could not delete media blob from IndexedDB:', err);
  }
}

/**
 * Read a file as a base64 Data URL
 */
export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/**
 * Compress an image file using an off-screen HTML5 Canvas
 * Keeps quality high while ensuring base64 payload fits comfortably in Firestore (<600KB)
 */
export function compressImageFile(
  file: File,
  maxWidth: number = 1280,
  maxHeight: number = 1280,
  quality: number = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;

      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        // Fallback to raw reader if canvas 2d context unavailable
        readFileAsDataURL(file).then(resolve).catch(reject);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Prefer image/webp if supported, fallback to image/jpeg
      try {
        const webpData = canvas.toDataURL('image/webp', quality);
        if (webpData.startsWith('data:image/webp')) {
          resolve(webpData);
          return;
        }
      } catch {
        // Fall through
      }

      const jpegData = canvas.toDataURL('image/jpeg', quality);
      resolve(jpegData);
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(objectUrl);
      // Fallback
      readFileAsDataURL(file).then(resolve).catch(reject);
    };
    img.src = objectUrl;
  });
}

/**
 * Generate a snapshot poster thumbnail from an uploaded video file
 */
export function captureVideoThumbnail(
  file: File,
  seekTime: number = 1.0,
  maxWidth: number = 800
): Promise<{ thumbnailDataUrl: string; duration: number }> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    const objectUrl = URL.createObjectURL(file);
    video.preload = 'metadata';
    video.src = objectUrl;
    video.muted = true;
    video.playsInline = true;

    // Fallback thumbnail if capture fails
    const fallback = {
      thumbnailDataUrl:
        'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800&auto=format&fit=crop',
      duration: 0,
    };

    const cleanup = () => {
      URL.revokeObjectURL(objectUrl);
      video.remove();
    };

    const timeout = setTimeout(() => {
      cleanup();
      resolve(fallback);
    }, 8000);

    video.onloadedmetadata = () => {
      const duration = video.duration || 0;
      // Seek to either seekTime or midpoint if video is very short
      const targetTime = Math.min(seekTime, Math.max(0.2, duration / 2));
      video.currentTime = targetTime;
    };

    video.onseeked = () => {
      clearTimeout(timeout);
      try {
        const width = video.videoWidth || 640;
        const height = video.videoHeight || 360;
        const scale = Math.min(1, maxWidth / width);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(width * scale);
        canvas.height = Math.round(height * scale);

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const thumbnailDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          cleanup();
          resolve({ thumbnailDataUrl, duration: video.duration || 0 });
          return;
        }
      } catch (e) {
        console.warn('Video thumbnail capture failed:', e);
      }
      cleanup();
      resolve(fallback);
    };

    video.onerror = () => {
      clearTimeout(timeout);
      cleanup();
      resolve(fallback);
    };
  });
}

/**
 * Format bytes to readable size
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Format seconds to MM:SS or HH:MM:SS
 */
export function formatDuration(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00';
  const totalSec = Math.floor(seconds);
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  const padSec = secs < 10 ? `0${secs}` : secs;
  if (mins < 60) return `${mins}:${padSec}`;
  const hours = Math.floor(mins / 60);
  const remMins = mins % 60;
  const padMin = remMins < 10 ? `0${remMins}` : remMins;
  return `${hours}:${padMin}:${padSec}`;
}
