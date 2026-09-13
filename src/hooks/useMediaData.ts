import { useState, useEffect } from 'react';
import {
  MediaVideoItem,
  TikTokItem,
  InstagramItem,
  YOUTUBE_MEDIA,
  TIKTOK_MEDIA,
  INSTAGRAM_MEDIA,
} from '../data/cyclingData';

const STORAGE_KEYS = {
  YOUTUBE: 'twc_media_youtube_v1',
  TIKTOK: 'twc_media_tiktok_v1',
  INSTAGRAM: 'twc_media_instagram_v1',
};

export function useMediaData() {
  const [youtubeVideos, setYoutubeVideos] = useState<MediaVideoItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.YOUTUBE);
      if (saved) {
        const parsed: MediaVideoItem[] = JSON.parse(saved);
        // Ensure every item has a valid videoUrl field
        return parsed.map((item) => ({
          ...item,
          videoUrl: item.videoUrl || (item.youtubeId ? `https://www.youtube.com/watch?v=${item.youtubeId}` : 'https://www.youtube.com/channel/UCcyYTjupx6KfAfe-ON_Wqlg'),
        }));
      }
    } catch (e) {
      console.error('Error loading stored YouTube media', e);
    }
    return YOUTUBE_MEDIA;
  });

  const [tiktokReels, setTiktokReels] = useState<TikTokItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TIKTOK);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading stored TikTok media', e);
    }
    return TIKTOK_MEDIA;
  });

  const [instagramPosts, setInstagramPosts] = useState<InstagramItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INSTAGRAM);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading stored Instagram media', e);
    }
    return INSTAGRAM_MEDIA;
  });

  // YouTube actions with immediate synchronous persistence
  const addYouTubeVideo = (video: MediaVideoItem) => {
    setYoutubeVideos((prev) => {
      const updated = [video, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.YOUTUBE, JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to sync YouTube add to localStorage', err);
      }
      return updated;
    });
  };

  const updateYouTubeVideo = (video: MediaVideoItem) => {
    setYoutubeVideos((prev) => {
      const updated = prev.map((item) => (item.id === video.id ? video : item));
      try {
        localStorage.setItem(STORAGE_KEYS.YOUTUBE, JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to sync YouTube update to localStorage', err);
      }
      return updated;
    });
  };

  const deleteYouTubeVideo = (id: string) => {
    setYoutubeVideos((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.YOUTUBE, JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to sync YouTube delete to localStorage', err);
      }
      return updated;
    });
  };

  // TikTok actions with immediate synchronous persistence
  const addTikTokReel = (reel: TikTokItem) => {
    setTiktokReels((prev) => {
      const updated = [reel, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.TIKTOK, JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to sync TikTok add to localStorage', err);
      }
      return updated;
    });
  };

  const updateTikTokReel = (reel: TikTokItem) => {
    setTiktokReels((prev) => {
      const updated = prev.map((item) => (item.id === reel.id ? reel : item));
      try {
        localStorage.setItem(STORAGE_KEYS.TIKTOK, JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to sync TikTok update to localStorage', err);
      }
      return updated;
    });
  };

  const deleteTikTokReel = (id: string) => {
    setTiktokReels((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.TIKTOK, JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to sync TikTok delete to localStorage', err);
      }
      return updated;
    });
  };

  // Instagram actions with immediate synchronous persistence
  const addInstagramPost = (post: InstagramItem) => {
    setInstagramPosts((prev) => {
      const updated = [post, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.INSTAGRAM, JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to sync Instagram add to localStorage', err);
      }
      return updated;
    });
  };

  const updateInstagramPost = (post: InstagramItem) => {
    setInstagramPosts((prev) => {
      const updated = prev.map((item) => (item.id === post.id ? post : item));
      try {
        localStorage.setItem(STORAGE_KEYS.INSTAGRAM, JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to sync Instagram update to localStorage', err);
      }
      return updated;
    });
  };

  const deleteInstagramPost = (id: string) => {
    setInstagramPosts((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.INSTAGRAM, JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to sync Instagram delete to localStorage', err);
      }
      return updated;
    });
  };

  // Reset to default data
  const resetToDefaults = () => {
    setYoutubeVideos(YOUTUBE_MEDIA);
    setTiktokReels(TIKTOK_MEDIA);
    setInstagramPosts(INSTAGRAM_MEDIA);
    try {
      localStorage.removeItem(STORAGE_KEYS.YOUTUBE);
      localStorage.removeItem(STORAGE_KEYS.TIKTOK);
      localStorage.removeItem(STORAGE_KEYS.INSTAGRAM);
    } catch (err) {
      console.error('Failed to clear media localStorage keys', err);
    }
  };

  return {
    youtubeVideos,
    tiktokReels,
    instagramPosts,
    addYouTubeVideo,
    updateYouTubeVideo,
    deleteYouTubeVideo,
    addTikTokReel,
    updateTikTokReel,
    deleteTikTokReel,
    addInstagramPost,
    updateInstagramPost,
    deleteInstagramPost,
    resetToDefaults,
  };
}
