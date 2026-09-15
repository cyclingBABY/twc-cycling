import { useState, useEffect, useCallback } from 'react';
import {
  MediaVideoItem,
  TikTokItem,
  InstagramItem,
  YOUTUBE_MEDIA,
  TIKTOK_MEDIA,
  INSTAGRAM_MEDIA,
  extractYouTubeId,
} from '../data/cyclingData';
import { SocialMediaItem } from '../types';
import { saveDocument, deleteDocument, fetchCollection } from '../services/dbService';
import {
  saveMediaBlob,
  getMediaBlob,
  deleteMediaBlob,
} from '../services/mediaStorage';

const STORAGE_KEYS = {
  YOUTUBE: 'twc_media_youtube_v1',
  TIKTOK: 'twc_media_tiktok_v1',
  INSTAGRAM: 'twc_media_instagram_v1',
  UPLOADS: 'twc_media_uploads_v1',
};

// Initial featured device uploads so the vault has immediate content
export const INITIAL_DEVICE_UPLOADS: SocialMediaItem[] = [
  {
    id: 'upload-katwe-criterium-start',
    title: 'Katwe Grassroots Youth Criterium - Race Start Line',
    caption: 'Together We Can Cycling UG junior riders and mechanics lined up at the start line of the Katwe Grassroots Youth Criterium in Kampala.',
    type: 'photo',
    mediaType: 'upload',
    sourceType: 'local_upload',
    imageUrl: '/images/katwe-grassroots-criterium.jpg',
    thumbnail: '/images/katwe-grassroots-criterium.jpg',
    category: 'Grassroots Criterium',
    tag: 'Katwe Youth',
    author: 'Together We Can Cycling UG',
    date: '14 Sep 2026',
    location: 'Katwe Clocktower - Queen’s Way Loop, Kampala',
    views: '2.1K views',
    likes: '315',
  },
  {
    id: 'upload-kitgum-memorial-1',
    title: 'Irene Gleeson Memorial Bicycle Race - Kitgum Breakaway',
    caption: 'Official squad photo of TWC Cycling Academy athletes racing during the 450km Northern Uganda tour in Kitgum.',
    type: 'photo',
    mediaType: 'upload',
    sourceType: 'local_upload',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7WBsfFNzFp04i3JTuiQCmIxNf9Y1L6-TeUcaewO_8mg&s',
    thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7WBsfFNzFp04i3JTuiQCmIxNf9Y1L6-TeUcaewO_8mg&s',
    category: 'Memorial Race',
    tag: 'Kitgum Tour',
    author: 'Coach Solomon Ssebakaki',
    date: '14 Sep 2026',
    location: 'Kitgum, Northern Uganda',
    views: '2.4K views',
    likes: '348',
  },
  {
    id: 'upload-lubiri-cadets-2',
    title: 'Lubiri Ring Road Sprint Pack Training Drill',
    caption: 'TWC youth squad paceline execution and drafting techniques around the 3.8 km Lubiri Palace tarmac circuit.',
    type: 'video',
    mediaType: 'upload',
    sourceType: 'local_upload',
    videoUrl: 'https://www.youtube.com/watch?v=nBz2AddtXRY',
    mediaUrl: 'https://www.youtube.com/watch?v=nBz2AddtXRY',
    youtubeId: 'nBz2AddtXRY',
    thumbnail: '/images/lubiri-sprint-drill.jpg',
    duration: '0:58',
    category: 'Youth Training',
    tag: 'Lubiri Circuit',
    author: 'TWC Operations Desk',
    date: '12 Sep 2026',
    location: 'Lubiri Palace Circuit, Mengo',
    views: '2.4K views',
    likes: '280',
  },
  {
    id: 'upload-academy-clinic-3',
    title: 'Grassroots Bike Safety & Maintenance Clinic at BMK House',
    caption: 'Weekly workshop at Katwe headquarters inspecting gears, trueing spokes, and fitting safety helmets for Senior One cadets.',
    type: 'photo',
    mediaType: 'upload',
    sourceType: 'local_upload',
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?q=80&w=800&auto=format&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?q=80&w=800&auto=format&fit=crop',
    category: 'Academy Clinic',
    tag: 'Katwe HQ',
    author: 'David M. (Coordinator)',
    date: '10 Sep 2026',
    location: 'BMK House, Katwe',
    views: '1.4K views',
    likes: '185',
  },
];

export function useMediaData() {
  const [youtubeVideos, setYoutubeVideos] = useState<MediaVideoItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.YOUTUBE);
      if (saved) {
        const parsed: MediaVideoItem[] = JSON.parse(saved);
        return parsed.map((item) => {
          const parsedYtId = extractYouTubeId(item.videoUrl || (item as any).url || (item as any).mediaUrl || '');
          const effectiveYtId = parsedYtId || item.youtubeId;

          // If the item already has a valid customized YouTube video ID, respect what the user provided!
          if (effectiveYtId && effectiveYtId !== 'live' && effectiveYtId !== 'dQw4w9WgXcQ' && item.videoUrl && !item.videoUrl.includes('channel/UCcyYTjupx6KfAfe-ON_Wqlg')) {
            return {
              ...item,
              youtubeId: effectiveYtId,
              videoUrl: item.videoUrl || `https://www.youtube.com/watch?v=${effectiveYtId}`,
              thumbnail: item.thumbnail || `https://i.ytimg.com/vi/${effectiveYtId}/hqdefault.jpg`,
            };
          }

          if (item.id === 'yt-2' || item.title?.includes('Aziz Ssempijja dominated the Kasese')) {
            return {
              ...item,
              youtubeId: 'DCHD5gQPYqA',
              videoUrl: 'https://www.youtube.com/watch?v=DCHD5gQPYqA',
              thumbnail: '/images/aziz-ssempijja-race.jpg',
            };
          }
          if (item.id === 'yt-4' || item.title?.includes('Namilyango High School Gulama')) {
            return {
              ...item,
              youtubeId: '7KxG7z0I00Q',
              videoUrl: 'https://www.youtube.com/watch?v=7KxG7z0I00Q',
              thumbnail: '/images/namilyango-cycling-school.jpg',
            };
          }
          if (item.id === 'yt-5' || item.title?.includes('Together we unite')) {
            return {
              ...item,
              youtubeId: 'V0MWeSsgF-s',
              videoUrl: 'https://www.youtube.com/watch?v=V0MWeSsgF-s',
              thumbnail: '/images/together-we-unite-peloton.jpg',
            };
          }
          return {
            ...item,
            youtubeId: effectiveYtId || item.youtubeId,
            videoUrl:
              item.videoUrl ||
              (effectiveYtId
                ? `https://www.youtube.com/watch?v=${effectiveYtId}`
                : 'https://www.youtube.com/channel/UCcyYTjupx6KfAfe-ON_Wqlg'),
          };
        });
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

  const [uploadedMedia, setUploadedMedia] = useState<SocialMediaItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.UPLOADS);
      if (saved) {
        let parsed: SocialMediaItem[] = JSON.parse(saved);
        if (!parsed.some((p) => p.id === 'upload-katwe-criterium-start')) {
          const katweItem = INITIAL_DEVICE_UPLOADS[0];
          parsed = [katweItem, ...parsed];
        }
        return parsed.map((item) => {
          if (item.id === 'upload-lubiri-cadets-2' || item.title?.includes('Lubiri Ring Road Sprint Pack')) {
            return {
              ...item,
              videoUrl: 'https://www.youtube.com/watch?v=nBz2AddtXRY',
              mediaUrl: 'https://www.youtube.com/watch?v=nBz2AddtXRY',
              youtubeId: 'nBz2AddtXRY',
              thumbnail: '/images/lubiri-sprint-drill.jpg',
              duration: '0:58',
            };
          }
          return item;
        });
      }
    } catch (e) {
      console.error('Error loading stored uploaded media', e);
    }
    return INITIAL_DEVICE_UPLOADS;
  });

  const [isLoadingFromCloud, setIsLoadingFromCloud] = useState(false);

  // Restore IndexedDB object URLs for uploaded video files across browser reloads
  useEffect(() => {
    let active = true;
    const restoreBlobs = async () => {
      const updated = await Promise.all(
        uploadedMedia.map(async (item) => {
          if (item.type === 'video' && item.id && !item.mediaUrl?.startsWith('blob:')) {
            const blob = await getMediaBlob(item.id);
            if (blob && active) {
              const objectUrl = URL.createObjectURL(blob);
              return { ...item, mediaUrl: objectUrl, videoUrl: objectUrl };
            }
          }
          return item;
        })
      );
      if (active) {
        // Check if any url actually changed to avoid re-render loops
        const hasChange = updated.some(
          (u, idx) => u.mediaUrl !== uploadedMedia[idx]?.mediaUrl
        );
        if (hasChange) {
          setUploadedMedia(updated);
        }
      }
    };

    restoreBlobs();
    return () => {
      active = false;
    };
  }, []);

  // Fetch Cloud Firestore records for 'socialMedia' on mount
  useEffect(() => {
    let isMounted = true;
    const loadFromCloud = async () => {
      try {
        setIsLoadingFromCloud(true);
        const cloudItems = await fetchCollection<any>('socialMedia');
        if (!isMounted || !cloudItems || cloudItems.length === 0) {
          setIsLoadingFromCloud(false);
          return;
        }

        const cloudUploads: SocialMediaItem[] = [];
        const cloudYT: MediaVideoItem[] = [];
        const cloudTT: TikTokItem[] = [];
        const cloudIG: InstagramItem[] = [];

        cloudItems.forEach((item) => {
          if (item.mediaType === 'upload' || item.sourceType === 'local_upload' || item.type === 'photo' || item.type === 'video') {
            cloudUploads.push(item);
          } else if (item.platform === 'youtube') {
            cloudYT.push(item);
          } else if (item.platform === 'tiktok') {
            cloudTT.push(item);
          } else if (item.platform === 'instagram') {
            cloudIG.push(item);
          }
        });

        if (cloudUploads.length > 0 && isMounted) {
          const updatedCloudUploads = cloudUploads.map((item) => {
            if (item.id === 'upload-lubiri-cadets-2' || item.title?.includes('Lubiri Ring Road Sprint Pack')) {
              const fixed = {
                ...item,
                videoUrl: 'https://www.youtube.com/watch?v=nBz2AddtXRY',
                mediaUrl: 'https://www.youtube.com/watch?v=nBz2AddtXRY',
                youtubeId: 'nBz2AddtXRY',
                thumbnail: '/images/lubiri-sprint-drill.jpg',
                duration: '0:58',
              };
              saveDocument('socialMedia', fixed.id, fixed, true);
              return fixed;
            }
            return item;
          });

          setUploadedMedia((prev) => {
            const merged = [...updatedCloudUploads];
            prev.forEach((p) => {
              if (!merged.some((m) => m.id === p.id)) {
                merged.push(p);
              }
            });
            try {
              localStorage.setItem(STORAGE_KEYS.UPLOADS, JSON.stringify(merged));
            } catch {}
            return merged;
          });
        }

        if (cloudYT.length > 0 && isMounted) {
          const updatedCloudYT = cloudYT.map((item: any) => {
            const parsedYtId = extractYouTubeId(item.videoUrl || item.url || item.mediaUrl || '');
            const effectiveYtId = parsedYtId || item.youtubeId;

            // If user has provided their own link and ID, follow what the user provided!
            if (
              effectiveYtId &&
              effectiveYtId !== 'live' &&
              effectiveYtId !== 'dQw4w9WgXcQ' &&
              item.videoUrl &&
              !item.videoUrl.includes('channel/UCcyYTjupx6KfAfe-ON_Wqlg')
            ) {
              return {
                ...item,
                youtubeId: effectiveYtId,
                videoUrl: item.videoUrl || `https://www.youtube.com/watch?v=${effectiveYtId}`,
                thumbnail: item.thumbnail || `https://i.ytimg.com/vi/${effectiveYtId}/hqdefault.jpg`,
              };
            }

            if (item.id === 'yt-2' || item.title?.includes('Aziz Ssempijja dominated the Kasese')) {
              const fixed = {
                ...item,
                youtubeId: 'DCHD5gQPYqA',
                videoUrl: 'https://www.youtube.com/watch?v=DCHD5gQPYqA',
                thumbnail: '/images/aziz-ssempijja-race.jpg',
              };
              saveDocument('socialMedia', fixed.id, { ...fixed, platform: 'youtube' }, true);
              return fixed;
            }
            if (item.id === 'yt-lubiri-drill' || item.title?.includes('Lubiri Ring Road Sprint Pack')) {
              const fixed = {
                ...item,
                youtubeId: 'nBz2AddtXRY',
                videoUrl: 'https://www.youtube.com/watch?v=nBz2AddtXRY',
                thumbnail: '/images/lubiri-sprint-drill.jpg',
              };
              saveDocument('socialMedia', fixed.id, { ...fixed, platform: 'youtube' }, true);
              return fixed;
            }
            if (item.id === 'yt-4' || item.title?.includes('Namilyango High School Gulama')) {
              const fixed = {
                ...item,
                youtubeId: '7KxG7z0I00Q',
                videoUrl: 'https://www.youtube.com/watch?v=7KxG7z0I00Q',
                thumbnail: '/images/namilyango-cycling-school.jpg',
              };
              saveDocument('socialMedia', fixed.id, { ...fixed, platform: 'youtube' }, true);
              return fixed;
            }
            if (item.id === 'yt-5' || item.title?.includes('Together we unite')) {
              const fixed = {
                ...item,
                youtubeId: 'V0MWeSsgF-s',
                videoUrl: 'https://www.youtube.com/watch?v=V0MWeSsgF-s',
                thumbnail: '/images/together-we-unite-peloton.jpg',
              };
              saveDocument('socialMedia', fixed.id, { ...fixed, platform: 'youtube' }, true);
              return fixed;
            }
            return item;
          });

          setYoutubeVideos((prev) => {
            const merged = [...updatedCloudYT];
            prev.forEach((p) => {
              if (!merged.some((m) => m.id === p.id)) merged.push(p);
            });
            try {
              localStorage.setItem(STORAGE_KEYS.YOUTUBE, JSON.stringify(merged));
            } catch {}
            return merged;
          });
        }

        if (cloudTT.length > 0 && isMounted) {
          setTiktokReels((prev) => {
            const merged = prev.map((localItem) => {
              const cloudMatch = cloudTT.find((c) => c.id === localItem.id);
              return cloudMatch ? { ...cloudMatch, ...localItem } : localItem;
            });
            cloudTT.forEach((c) => {
              if (!merged.some((m) => m.id === c.id)) merged.push(c);
            });
            try {
              localStorage.setItem(STORAGE_KEYS.TIKTOK, JSON.stringify(merged));
            } catch {}
            return merged;
          });
        }

        if (cloudIG.length > 0 && isMounted) {
          setInstagramPosts((prev) => {
            const merged = prev.map((localItem) => {
              const cloudMatch = cloudIG.find((c) => c.id === localItem.id);
              return cloudMatch ? { ...cloudMatch, ...localItem } : localItem;
            });
            cloudIG.forEach((c) => {
              if (!merged.some((m) => m.id === c.id)) merged.push(c);
            });
            try {
              localStorage.setItem(STORAGE_KEYS.INSTAGRAM, JSON.stringify(merged));
            } catch {}
            return merged;
          });
        }
      } catch (err) {
        console.warn('Could not sync media from cloud Firestore:', err);
      } finally {
        if (isMounted) setIsLoadingFromCloud(false);
      }
    };

    loadFromCloud();
    return () => {
      isMounted = false;
    };
  }, []);

  // --- UPLOADED DEVICE MEDIA (Photos & Videos) HANDLERS ---
  const addUploadedMedia = useCallback(
    async (item: SocialMediaItem, fileBlob?: Blob) => {
      // 1. If a raw file blob exists, store in IndexedDB
      if (fileBlob) {
        await saveMediaBlob(item.id, fileBlob);
      }

      // 2. Add to React state
      setUploadedMedia((prev) => {
        const updated = [item, ...prev.filter((x) => x.id !== item.id)];
        try {
          // Store stripped version in localStorage to preserve quota
          const toStore = updated.map((m) => ({
            ...m,
            // If dataUrl is massive (>400KB), keep thumbnail
            mediaUrl: m.mediaUrl?.startsWith('blob:') ? undefined : m.mediaUrl,
          }));
          localStorage.setItem(STORAGE_KEYS.UPLOADS, JSON.stringify(toStore));
        } catch (e) {
          console.warn('Failed to cache uploaded media in localStorage', e);
        }
        return updated;
      });

      // 3. Save directly to Cloud Firestore
      const firestorePayload = {
        ...item,
        platform: 'upload',
        mediaType: 'upload',
        sourceType: 'local_upload',
        updatedAt: new Date().toISOString(),
      };
      // If mediaUrl is a temporary blob:, don't save blob: string to Firestore, save thumbnail or fallback
      if (firestorePayload.mediaUrl?.startsWith('blob:')) {
        delete firestorePayload.mediaUrl;
      }
      if (firestorePayload.videoUrl?.startsWith('blob:')) {
        delete firestorePayload.videoUrl;
      }

      await saveDocument('socialMedia', item.id, firestorePayload, false);
    },
    []
  );

  const updateUploadedMedia = useCallback(
    async (item: SocialMediaItem, newFileBlob?: Blob) => {
      if (newFileBlob) {
        await saveMediaBlob(item.id, newFileBlob);
      }

      setUploadedMedia((prev) => {
        const updated = prev.map((x) => (x.id === item.id ? item : x));
        try {
          const toStore = updated.map((m) => ({
            ...m,
            mediaUrl: m.mediaUrl?.startsWith('blob:') ? undefined : m.mediaUrl,
          }));
          localStorage.setItem(STORAGE_KEYS.UPLOADS, JSON.stringify(toStore));
        } catch (e) {
          console.warn('Failed to cache updated media in localStorage', e);
        }
        return updated;
      });

      const firestorePayload = {
        ...item,
        platform: 'upload',
        mediaType: 'upload',
        updatedAt: new Date().toISOString(),
      };
      if (firestorePayload.mediaUrl?.startsWith('blob:')) {
        delete firestorePayload.mediaUrl;
      }
      if (firestorePayload.videoUrl?.startsWith('blob:')) {
        delete firestorePayload.videoUrl;
      }

      await saveDocument('socialMedia', item.id, firestorePayload, true);
    },
    []
  );

  const deleteUploadedMedia = useCallback(async (id: string) => {
    await deleteMediaBlob(id);

    setUploadedMedia((prev) => {
      const updated = prev.filter((x) => x.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.UPLOADS, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to update localStorage after delete', e);
      }
      return updated;
    });

    await deleteDocument('socialMedia', id);
  }, []);

  // --- YOUTUBE ACTIONS ---
  const addYouTubeVideo = useCallback(async (video: MediaVideoItem) => {
    const rawUrl = (video.videoUrl || (video as any).url || (video as any).mediaUrl || '').trim();
    const parsedId = extractYouTubeId(rawUrl) || video.youtubeId;
    const normalized: MediaVideoItem = {
      ...video,
      videoUrl: rawUrl || (parsedId ? `https://www.youtube.com/watch?v=${parsedId}` : ''),
      youtubeId: parsedId || video.youtubeId,
      thumbnail:
        (video.thumbnail && !video.thumbnail.includes('unsplash'))
          ? video.thumbnail
          : (parsedId ? `https://i.ytimg.com/vi/${parsedId}/hqdefault.jpg` : video.thumbnail),
    };

    setYoutubeVideos((prev) => {
      const updated = [normalized, ...prev.filter((item) => item.id !== normalized.id)];
      try {
        localStorage.setItem(STORAGE_KEYS.YOUTUBE, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    await saveDocument('socialMedia', normalized.id, { ...normalized, platform: 'youtube' }, false);
  }, []);

  const updateYouTubeVideo = useCallback(async (video: MediaVideoItem) => {
    const rawUrl = (video.videoUrl || (video as any).url || (video as any).mediaUrl || '').trim();
    const parsedId = extractYouTubeId(rawUrl) || video.youtubeId;
    const normalized: MediaVideoItem = {
      ...video,
      videoUrl: rawUrl || (parsedId ? `https://www.youtube.com/watch?v=${parsedId}` : ''),
      youtubeId: parsedId || video.youtubeId,
      thumbnail:
        (video.thumbnail && !video.thumbnail.includes('unsplash'))
          ? video.thumbnail
          : (parsedId ? `https://i.ytimg.com/vi/${parsedId}/hqdefault.jpg` : video.thumbnail),
    };

    setYoutubeVideos((prev) => {
      const exists = prev.some((item) => item.id === normalized.id);
      const updated = exists
        ? prev.map((item) => (item.id === normalized.id ? normalized : item))
        : [normalized, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.YOUTUBE, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    await saveDocument('socialMedia', normalized.id, { ...normalized, platform: 'youtube' }, true);
  }, []);

  const deleteYouTubeVideo = useCallback(async (id: string) => {
    setYoutubeVideos((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.YOUTUBE, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    await deleteDocument('socialMedia', id);
  }, []);

  // --- TIKTOK ACTIONS ---
  const addTikTokReel = useCallback(async (reel: TikTokItem) => {
    setTiktokReels((prev) => {
      const updated = [reel, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.TIKTOK, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    await saveDocument('socialMedia', reel.id, { ...reel, platform: 'tiktok' }, false);
  }, []);

  const updateTikTokReel = useCallback(async (reel: TikTokItem) => {
    setTiktokReels((prev) => {
      const exists = prev.some((item) => item.id === reel.id);
      const updated = exists
        ? prev.map((item) => (item.id === reel.id ? { ...item, ...reel } : item))
        : [reel, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.TIKTOK, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    await saveDocument('socialMedia', reel.id, { ...reel, platform: 'tiktok' }, true);
  }, []);

  const deleteTikTokReel = useCallback(async (id: string) => {
    setTiktokReels((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.TIKTOK, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    await deleteDocument('socialMedia', id);
  }, []);

  // --- INSTAGRAM ACTIONS ---
  const addInstagramPost = useCallback(async (post: InstagramItem) => {
    setInstagramPosts((prev) => {
      const updated = [post, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.INSTAGRAM, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    await saveDocument('socialMedia', post.id, { ...post, platform: 'instagram' }, false);
  }, []);

  const updateInstagramPost = useCallback(async (post: InstagramItem) => {
    setInstagramPosts((prev) => {
      const exists = prev.some((item) => item.id === post.id);
      const updated = exists
        ? prev.map((item) => (item.id === post.id ? { ...item, ...post } : item))
        : [post, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.INSTAGRAM, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    await saveDocument('socialMedia', post.id, { ...post, platform: 'instagram' }, true);
  }, []);

  const deleteInstagramPost = useCallback(async (id: string) => {
    setInstagramPosts((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.INSTAGRAM, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    await deleteDocument('socialMedia', id);
  }, []);

  // Reset to default data
  const resetToDefaults = () => {
    setYoutubeVideos(YOUTUBE_MEDIA);
    setTiktokReels(TIKTOK_MEDIA);
    setInstagramPosts(INSTAGRAM_MEDIA);
    setUploadedMedia(INITIAL_DEVICE_UPLOADS);
    try {
      localStorage.removeItem(STORAGE_KEYS.YOUTUBE);
      localStorage.removeItem(STORAGE_KEYS.TIKTOK);
      localStorage.removeItem(STORAGE_KEYS.INSTAGRAM);
      localStorage.removeItem(STORAGE_KEYS.UPLOADS);
    } catch (err) {
      console.error('Failed to clear media localStorage keys', err);
    }
  };

  return {
    youtubeVideos,
    tiktokReels,
    instagramPosts,
    uploadedMedia,
    isLoadingFromCloud,
    addUploadedMedia,
    updateUploadedMedia,
    deleteUploadedMedia,
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
