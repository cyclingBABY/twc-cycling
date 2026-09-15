import React, { useState, useMemo } from 'react';
import {
  NoticeItem,
  SponsorItem,
  GalleryPhotoItem,
  SocialMediaItem,
  AdminRole,
  SiteContentSettings,
} from '../../types';
import { MediaUploadModal } from './MediaUploadModal';
import {
  extractYouTubeId,
  extractTikTokInfo,
  extractInstagramInfo,
  fetchTikTokMediaPreview,
} from '../../data/cyclingData';
import { compressImageFile } from '../../services/mediaStorage';
import {
  FileText,
  Building2,
  Video,
  ImageIcon,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  CheckCircle2,
  Globe,
  Youtube,
  Instagram,
  Eye,
  Save,
  X,
  Search,
  Sparkles,
  Phone,
  MapPin,
  Mail,
  AlertCircle,
  Pin,
  Check,
  Upload,
  Database,
  Film,
  Play,
  Maximize2,
  Loader2,
  RefreshCw,
} from 'lucide-react';

interface AdminCMSProps {
  currentRole: AdminRole;
  notices: NoticeItem[];
  sponsors: SponsorItem[];
  galleryPhotos: GalleryPhotoItem[];
  mediaData: {
    youtube: SocialMediaItem[];
    tiktok: SocialMediaItem[];
    instagram: SocialMediaItem[];
    uploads?: SocialMediaItem[];
  };
  uploadedMedia?: SocialMediaItem[];
  siteContent?: SiteContentSettings;
  onUpdateSiteContent?: (newSettings: Partial<SiteContentSettings>) => void;
  // Notice handlers
  onAddNotice: (notice: NoticeItem) => void;
  onUpdateNotice: (notice: NoticeItem) => void;
  onDeleteNotice: (id: string) => void;
  // Sponsor handlers
  onAddSponsor: (sponsor: SponsorItem) => void;
  onUpdateSponsor: (sponsor: SponsorItem) => void;
  onDeleteSponsor: (id: string) => void;
  onToggleSponsor: (id: string) => void;
  // Photo handlers
  onAddPhoto: (photo: GalleryPhotoItem) => void;
  onUpdatePhoto?: (photo: GalleryPhotoItem) => void;
  onDeletePhoto: (id: string) => void;
  // Media handlers
  onSaveMediaLink: (platform: 'youtube' | 'tiktok' | 'instagram', index: number, updatedItem: SocialMediaItem) => void;
  onAddMediaItem: (platform: 'youtube' | 'tiktok' | 'instagram', item: SocialMediaItem) => void;
  onDeleteMediaItem: (platform: 'youtube' | 'tiktok' | 'instagram', id: string) => void;
  // Device Uploaded Media Handlers
  onAddUploadedMedia?: (item: SocialMediaItem, blob?: Blob) => Promise<void> | void;
  onUpdateUploadedMedia?: (item: SocialMediaItem, blob?: Blob) => Promise<void> | void;
  onDeleteUploadedMedia?: (id: string) => Promise<void> | void;
}

export const AdminCMS: React.FC<AdminCMSProps> = ({
  currentRole,
  notices,
  sponsors,
  galleryPhotos,
  mediaData,
  uploadedMedia = [],
  siteContent,
  onUpdateSiteContent,
  onAddNotice,
  onUpdateNotice,
  onDeleteNotice,
  onAddSponsor,
  onUpdateSponsor,
  onDeleteSponsor,
  onToggleSponsor,
  onAddPhoto,
  onUpdatePhoto,
  onDeletePhoto,
  onSaveMediaLink,
  onAddMediaItem,
  onDeleteMediaItem,
  onAddUploadedMedia,
  onUpdateUploadedMedia,
  onDeleteUploadedMedia,
}) => {
  const [activeTab, setActiveTab] = useState<'notices' | 'sponsors' | 'media' | 'photos' | 'site_copy'>('notices');
  const [searchQuery, setSearchQuery] = useState('');
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  // Forms toggles for ADDING new content
  const [showNoticeAddForm, setShowNoticeAddForm] = useState(false);
  const [showSponsorAddForm, setShowSponsorAddForm] = useState(false);
  const [showPhotoAddForm, setShowPhotoAddForm] = useState(false);
  const [showMediaAddForm, setShowMediaAddForm] = useState(false);

  // EDITING states for each content type
  const [editingNoticeId, setEditingNoticeId] = useState<string | null>(null);
  const [noticeEditForm, setNoticeEditForm] = useState<Partial<NoticeItem>>({});

  const [editingSponsorId, setEditingSponsorId] = useState<string | null>(null);
  const [sponsorEditForm, setSponsorEditForm] = useState<Partial<SponsorItem>>({});

  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [photoEditForm, setPhotoEditForm] = useState<Partial<GalleryPhotoItem>>({});

  // Media Tab
  const [activeMediaPlatform, setActiveMediaPlatform] = useState<'uploads' | 'youtube' | 'tiktok' | 'instagram'>('uploads');
  const [editingMediaId, setEditingMediaId] = useState<string | null>(null);
  const [mediaEditForm, setMediaEditForm] = useState<Partial<SocialMediaItem>>({});

  // Device Media Upload Modal State
  const [isMediaUploadModalOpen, setIsMediaUploadModalOpen] = useState(false);
  const [editingUploadedItem, setEditingUploadedItem] = useState<SocialMediaItem | null>(null);
  const [mediaUploadDefaultType, setMediaUploadDefaultType] = useState<'photo' | 'video'>('photo');

  // Add Notice Form State
  const [newNoticeForm, setNewNoticeForm] = useState<Partial<NoticeItem>>({
    title: '',
    badge: 'Official Press Brief',
    content: '',
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    pinned: false,
    actionLink: '#events',
    actionText: 'View Details',
  });

  // Add Sponsor Form State
  const [newSponsorForm, setNewSponsorForm] = useState<Partial<SponsorItem>>({
    name: '',
    tier: 'Official Co-Sponsor',
    tierWeight: 2,
    logoUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=300&auto=format&fit=crop',
    description: '',
    websiteUrl: 'https://twc-cycling-ug.org',
    bannerPlacement: 'All',
    active: true,
  });

  // Add Photo Form State
  const [newPhotoForm, setNewPhotoForm] = useState<Partial<GalleryPhotoItem>>({
    title: '',
    caption: '',
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800&auto=format&fit=crop',
    eventTag: 'Lubiri Ring Road',
    category: 'Races',
  });

  // Add Media Item Form State
  const [newMediaForm, setNewMediaForm] = useState<Partial<SocialMediaItem>>({
    title: '',
    description: '',
    url: '',
    embedId: '',
    author: 'TWC Cycling Academy Uganda',
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=600&auto=format&fit=crop',
    category: 'Race Highlights',
    views: '1.2K views',
  });

  // Dynamic preview state for TikTok video links
  const [isFetchingTikTokPreview, setIsFetchingTikTokPreview] = useState(false);
  const [isFetchingTikTokEditPreview, setIsFetchingTikTokEditPreview] = useState(false);
  const [tikTokPreviewInfo, setTikTokPreviewInfo] = useState<{
    thumbnailUrl?: string;
    title?: string;
    authorName?: string;
    videoId?: string;
    embedUrl?: string;
  } | null>(null);
  const [tikTokEditPreviewInfo, setTikTokEditPreviewInfo] = useState<{
    thumbnailUrl?: string;
    title?: string;
    authorName?: string;
    videoId?: string;
    embedUrl?: string;
  } | null>(null);

  const handleSyncTikTokAddPreview = async (url: string) => {
    if (!url) return;
    const ttInfo = extractTikTokInfo(url);
    if (!ttInfo.isTikTok) return;

    setIsFetchingTikTokPreview(true);
    try {
      const preview = await fetchTikTokMediaPreview(url);
      if (preview) {
        setTikTokPreviewInfo({
          thumbnailUrl: preview.thumbnailUrl,
          title: preview.title,
          authorName: preview.authorName,
          videoId: preview.videoId || ttInfo.videoId,
          embedUrl: preview.embedUrl || (ttInfo.videoId ? `https://www.tiktok.com/embed/v2/${ttInfo.videoId}` : undefined),
        });

        setNewMediaForm((prev) => ({
          ...prev,
          thumbnail: preview.thumbnailUrl || prev.thumbnail,
          title: preview.title || prev.title || (preview.videoId ? `TWC TikTok Reel #${preview.videoId.slice(-4)}` : prev.title),
          embedId: preview.videoId || ttInfo.videoId || prev.embedId,
        }));
      }
    } catch (err) {
      console.warn('Could not fetch TikTok preview metadata:', err);
    } finally {
      setIsFetchingTikTokPreview(false);
    }
  };

  const handleSyncTikTokEditPreview = async (url: string) => {
    if (!url) return;
    const ttInfo = extractTikTokInfo(url);
    if (!ttInfo.isTikTok) return;

    setIsFetchingTikTokEditPreview(true);
    try {
      const preview = await fetchTikTokMediaPreview(url);
      if (preview) {
        setTikTokEditPreviewInfo({
          thumbnailUrl: preview.thumbnailUrl,
          title: preview.title,
          authorName: preview.authorName,
          videoId: preview.videoId || ttInfo.videoId,
          embedUrl: preview.embedUrl || (ttInfo.videoId ? `https://www.tiktok.com/embed/v2/${ttInfo.videoId}` : undefined),
        });

        setMediaEditForm((prev) => ({
          ...prev,
          thumbnail: preview.thumbnailUrl || prev.thumbnail,
          title: preview.title || prev.title || (preview.videoId ? `TWC TikTok Reel #${preview.videoId.slice(-4)}` : prev.title),
          embedId: preview.videoId || ttInfo.videoId || prev.embedId,
        }));
      }
    } catch (err) {
      console.warn('Could not fetch TikTok edit preview metadata:', err);
    } finally {
      setIsFetchingTikTokEditPreview(false);
    }
  };

  // Site Copy Form State
  const [siteCopyForm, setSiteCopyForm] = useState<SiteContentSettings>(() => ({
    announcementBanner: siteContent?.announcementBanner || 'Official TWC Race Registration Hotlines: +256 706 770 872 / +256 763 145 915 — Register early for the Lubiri Grand Criterium!',
    hotline1: siteContent?.hotline1 || '+256 706 770 872',
    hotline2: siteContent?.hotline2 || '+256 763 145 915',
    headquartersAddress: siteContent?.headquartersAddress || 'BMK House, Katwe, Kampala, Uganda',
    heroHeadline: siteContent?.heroHeadline || 'Together We Can Cycling Uganda Limited',
    heroSubtitle: siteContent?.heroSubtitle || 'Uganda’s premier competitive cycling academy and race organizers based at BMK House Katwe, Kampala. Championing youth development, Senior One grassroots clinics, elite racing at Lubiri Ring Road, and nationwide road safety.',
    contactEmail: siteContent?.contactEmail || 'twccyclinguganda@gmail.com',
  }));

  const triggerToast = (msg: string) => {
    setSaveSuccessNotice(msg);
    setTimeout(() => setSaveSuccessNotice(null), 4000);
  };

  // --- 1. NOTICES HANDLERS ---
  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeForm.title || !newNoticeForm.content) return;

    const notice: NoticeItem = {
      id: `notice-${Date.now()}`,
      title: newNoticeForm.title,
      badge: newNoticeForm.badge || 'Official Press Brief',
      date: newNoticeForm.date || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      content: newNoticeForm.content,
      pinned: !!newNoticeForm.pinned,
      actionLink: newNoticeForm.actionLink || '#events',
      actionText: newNoticeForm.actionText || 'Read More',
    };

    onAddNotice(notice);
    setNewNoticeForm({
      title: '',
      badge: 'Official Press Brief',
      content: '',
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      pinned: false,
      actionLink: '#events',
      actionText: 'View Details',
    });
    setShowNoticeAddForm(false);
    triggerToast(`Notice "${notice.title}" created & published!`);
  };

  const handleStartEditNotice = (n: NoticeItem) => {
    setEditingNoticeId(n.id);
    setNoticeEditForm({ ...n });
  };

  const handleSaveEditedNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNoticeId || !noticeEditForm.title || !noticeEditForm.content) return;

    const updated: NoticeItem = {
      id: editingNoticeId,
      title: noticeEditForm.title,
      badge: noticeEditForm.badge || 'Official Press Brief',
      date: noticeEditForm.date || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      content: noticeEditForm.content,
      pinned: !!noticeEditForm.pinned,
      actionLink: noticeEditForm.actionLink,
      actionText: noticeEditForm.actionText,
    };

    onUpdateNotice(updated);
    setEditingNoticeId(null);
    setNoticeEditForm({});
    triggerToast(`Notice "${updated.title}" successfully updated!`);
  };

  // --- 2. SPONSOR HANDLERS ---
  const handleCreateSponsor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSponsorForm.name) return;

    const sponsor: SponsorItem = {
      id: `sp-${Date.now()}`,
      name: newSponsorForm.name,
      tier: newSponsorForm.tier || 'Official Co-Sponsor',
      tierWeight: Number(newSponsorForm.tierWeight) || 2,
      logoUrl: newSponsorForm.logoUrl || 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=300&auto=format&fit=crop',
      description: newSponsorForm.description || '',
      websiteUrl: newSponsorForm.websiteUrl || 'https://twc-cycling-ug.org',
      bannerPlacement: newSponsorForm.bannerPlacement || 'All',
      active: newSponsorForm.active !== undefined ? newSponsorForm.active : true,
    };

    onAddSponsor(sponsor);
    setNewSponsorForm({
      name: '',
      tier: 'Official Co-Sponsor',
      tierWeight: 2,
      logoUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=300&auto=format&fit=crop',
      description: '',
      websiteUrl: 'https://twc-cycling-ug.org',
      bannerPlacement: 'All',
      active: true,
    });
    setShowSponsorAddForm(false);
    triggerToast(`Sponsor "${sponsor.name}" added to portal!`);
  };

  const handleStartEditSponsor = (sp: SponsorItem) => {
    setEditingSponsorId(sp.id);
    setSponsorEditForm({ ...sp });
  };

  const handleSaveEditedSponsor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSponsorId || !sponsorEditForm.name) return;

    const updated: SponsorItem = {
      id: editingSponsorId,
      name: sponsorEditForm.name,
      tier: sponsorEditForm.tier || 'Official Co-Sponsor',
      tierWeight: Number(sponsorEditForm.tierWeight) || 2,
      logoUrl: sponsorEditForm.logoUrl || 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=300&auto=format&fit=crop',
      description: sponsorEditForm.description || '',
      websiteUrl: sponsorEditForm.websiteUrl || 'https://twc-cycling-ug.org',
      bannerPlacement: sponsorEditForm.bannerPlacement || 'All',
      active: sponsorEditForm.active !== undefined ? sponsorEditForm.active : true,
    };

    onUpdateSponsor(updated);
    setEditingSponsorId(null);
    setSponsorEditForm({});
    triggerToast(`Partner "${updated.name}" updated successfully!`);
  };

  // --- 3. PHOTO HANDLERS ---
  const handleCreatePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoForm.title || !newPhotoForm.imageUrl) return;

    const photo: GalleryPhotoItem = {
      id: `photo-${Date.now()}`,
      title: newPhotoForm.title,
      caption: newPhotoForm.caption || '',
      imageUrl: newPhotoForm.imageUrl,
      eventTag: newPhotoForm.eventTag || 'Lubiri Ring Road',
      category: newPhotoForm.category || 'Races',
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    };

    onAddPhoto(photo);
    setNewPhotoForm({
      title: '',
      caption: '',
      imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800&auto=format&fit=crop',
      eventTag: 'Lubiri Ring Road',
      category: 'Races',
    });
    setShowPhotoAddForm(false);
    triggerToast(`Photo "${photo.title}" added to gallery!`);
  };

  const handleStartEditPhoto = (p: GalleryPhotoItem) => {
    setEditingPhotoId(p.id);
    setPhotoEditForm({ ...p });
  };

  const handleSaveEditedPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhotoId || !photoEditForm.title || !photoEditForm.imageUrl) return;

    const updated: GalleryPhotoItem = {
      id: editingPhotoId,
      title: photoEditForm.title,
      caption: photoEditForm.caption || '',
      imageUrl: photoEditForm.imageUrl,
      eventTag: photoEditForm.eventTag || 'Lubiri Ring Road',
      category: photoEditForm.category || 'Races',
      date: photoEditForm.date || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    };

    if (onUpdatePhoto) {
      onUpdatePhoto(updated);
    }
    setEditingPhotoId(null);
    setPhotoEditForm({});
    triggerToast(`Photo "${updated.title}" updated!`);
  };

  // --- 4. MEDIA LINK HANDLERS ---
  const handleCreateMedia = (e: React.FormEvent) => {
    e.preventDefault();
    const rawUrl = (newMediaForm.url || '').trim();
    if (!rawUrl) {
      triggerToast('Please provide a valid media link.');
      return;
    }

    let embedId = newMediaForm.embedId;
    let computedUrl = rawUrl;
    let computedThumbnail = newMediaForm.thumbnail;
    let generatedTitle = newMediaForm.title ? newMediaForm.title.trim() : '';
    let category = newMediaForm.category;

    if (activeMediaPlatform === 'youtube') {
      const parsedYtId = extractYouTubeId(rawUrl);
      if (parsedYtId) {
        embedId = parsedYtId;
        computedUrl = `https://www.youtube.com/watch?v=${parsedYtId}`;
        if (!computedThumbnail || computedThumbnail.includes('unsplash')) {
          computedThumbnail = `https://i.ytimg.com/vi/${parsedYtId}/hqdefault.jpg`;
        }
      }
      if (!generatedTitle) {
        generatedTitle = parsedYtId ? `TWC YouTube Race Video (${parsedYtId})` : 'TWC Official YouTube Video';
      }
      if (!category) category = 'Race Highlights';
    } else if (activeMediaPlatform === 'tiktok') {
      const ttInfo = extractTikTokInfo(rawUrl);
      if (ttInfo.videoId) {
        embedId = ttInfo.videoId;
      }
      computedUrl = ttInfo.cleanUrl || rawUrl;
      // Prefer preview thumbnail fetched directly from TikTok video link
      if (tikTokPreviewInfo?.thumbnailUrl && (!computedThumbnail || computedThumbnail.includes('unsplash'))) {
        computedThumbnail = tikTokPreviewInfo.thumbnailUrl;
      }
      if (!computedThumbnail) {
        computedThumbnail = 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=600&auto=format&fit=crop';
      }
      if (!generatedTitle) {
        generatedTitle = tikTokPreviewInfo?.title || (ttInfo.videoId
          ? `TWC TikTok Sprint Reel #${ttInfo.videoId.slice(-4)}`
          : 'Together We Can Cycling TikTok Reel');
      }
      if (!category) category = 'TikTok Reel';
    } else if (activeMediaPlatform === 'instagram') {
      const igInfo = extractInstagramInfo(rawUrl);
      if (igInfo.shortcode) {
        embedId = igInfo.shortcode;
      }
      computedUrl = igInfo.cleanUrl || rawUrl;
      if (!computedThumbnail) {
        computedThumbnail = 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800&auto=format&fit=crop';
      }
      if (!generatedTitle) {
        generatedTitle = igInfo.isReel
          ? 'TWC Instagram Reel Highlight'
          : 'Together We Can Cycling Instagram Post';
      }
      if (!category) category = igInfo.isReel ? 'Instagram Reel' : 'Instagram Post';
    }

    const item: SocialMediaItem = {
      id: `media-${Date.now()}`,
      title: generatedTitle,
      caption: generatedTitle,
      description: newMediaForm.description || generatedTitle,
      url: computedUrl,
      videoUrl: computedUrl,
      mediaUrl: computedUrl,
      postUrl: computedUrl,
      imageUrl: computedThumbnail,
      youtubeId: activeMediaPlatform === 'youtube' ? embedId : undefined,
      embedId: embedId || 'live',
      author: newMediaForm.author || 'TWC Cycling Academy Uganda',
      date: newMediaForm.date || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      thumbnail: computedThumbnail || 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=600&auto=format&fit=crop',
      category: category || 'Race Highlights',
      views: newMediaForm.views || '1.2K views',
    };

    onAddMediaItem(activeMediaPlatform, item);
    setNewMediaForm({
      title: '',
      description: '',
      url: '',
      embedId: '',
      author: 'TWC Cycling Academy Uganda',
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=600&auto=format&fit=crop',
      category: 'Race Highlights',
      views: '1.2K views',
    });
    setShowMediaAddForm(false);
    setTikTokPreviewInfo(null);
    triggerToast(`New ${activeMediaPlatform.toUpperCase()} link published successfully!`);
  };

  const handleStartEditMedia = (item: SocialMediaItem) => {
    setEditingMediaId(item.id);
    setTikTokEditPreviewInfo(null);
    const bestUrl =
      item.videoUrl ||
      item.url ||
      item.mediaUrl ||
      (item as any).postUrl ||
      (item.youtubeId ? `https://www.youtube.com/watch?v=${item.youtubeId}` : '');
    const bestYtId = item.youtubeId || item.embedId || extractYouTubeId(bestUrl) || '';
    const bestThumbnail =
      item.thumbnail ||
      (item as any).imageUrl ||
      (bestYtId ? `https://i.ytimg.com/vi/${bestYtId}/hqdefault.jpg` : '');
    const bestTitle = item.title || (item as any).caption || '';

    setMediaEditForm({
      ...item,
      title: bestTitle,
      caption: (item as any).caption || bestTitle,
      description: item.description || (item as any).caption || bestTitle,
      url: bestUrl,
      videoUrl: bestUrl,
      postUrl: bestUrl,
      mediaUrl: bestUrl,
      embedId: bestYtId || (item as any).shortcode || item.embedId || '',
      youtubeId: bestYtId,
      thumbnail: bestThumbnail,
      imageUrl: bestThumbnail,
    });

    if (activeMediaPlatform === 'tiktok' && bestUrl) {
      handleSyncTikTokEditPreview(bestUrl);
    }
  };

  const handleSaveEditedMedia = (platform: 'youtube' | 'tiktok' | 'instagram', index: number) => {
    const rawUrl = (mediaEditForm.url || mediaEditForm.videoUrl || (mediaEditForm as any).postUrl || '').trim();
    if (!editingMediaId || !rawUrl) {
      triggerToast('Please enter a valid media link.');
      return;
    }

    const originalList = mediaData[platform];
    const existing = originalList[index];
    if (!existing) return;

    let embedId = mediaEditForm.embedId || existing.embedId || existing.youtubeId;
    let computedUrl = rawUrl;
    let computedThumbnail = mediaEditForm.thumbnail || existing.thumbnail || (existing as any).imageUrl;

    if (platform === 'youtube') {
      const parsedYtId = extractYouTubeId(rawUrl);
      if (parsedYtId) {
        embedId = parsedYtId;
        computedUrl = `https://www.youtube.com/watch?v=${parsedYtId}`;
        // Automatically sync thumbnail to the new YouTube video provided
        if (
          !mediaEditForm.thumbnail ||
          mediaEditForm.thumbnail === existing.thumbnail ||
          mediaEditForm.thumbnail.includes('unsplash') ||
          mediaEditForm.thumbnail.includes('ytimg.com') ||
          mediaEditForm.thumbnail.includes('youtube.com')
        ) {
          computedThumbnail = `https://i.ytimg.com/vi/${parsedYtId}/hqdefault.jpg`;
        }
      }
    } else if (platform === 'tiktok') {
      const ttInfo = extractTikTokInfo(rawUrl);
      if (ttInfo.videoId) {
        embedId = ttInfo.videoId;
      }
      computedUrl = ttInfo.cleanUrl || rawUrl;
      // Prefer thumbnail fetched directly from TikTok video link
      if (tikTokEditPreviewInfo?.thumbnailUrl && (!mediaEditForm.thumbnail || mediaEditForm.thumbnail === existing.thumbnail || mediaEditForm.thumbnail.includes('unsplash'))) {
        computedThumbnail = tikTokEditPreviewInfo.thumbnailUrl;
      }
      if (!computedThumbnail) {
        computedThumbnail = 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=600&auto=format&fit=crop';
      }
    } else if (platform === 'instagram') {
      const igInfo = extractInstagramInfo(rawUrl);
      if (igInfo.shortcode) {
        embedId = igInfo.shortcode;
      }
      computedUrl = igInfo.cleanUrl || rawUrl;
      if (!computedThumbnail) {
        computedThumbnail = 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800&auto=format&fit=crop';
      }
    }

    const title = mediaEditForm.title ? mediaEditForm.title.trim() : (existing.title || (existing as any).caption || 'TWC Media');

    const updatedItem: SocialMediaItem = {
      ...existing,
      id: existing.id,
      title,
      caption: (mediaEditForm as any).caption || mediaEditForm.description || existing.caption || title,
      description: mediaEditForm.description !== undefined ? mediaEditForm.description : existing.description,
      url: computedUrl,
      videoUrl: computedUrl,
      mediaUrl: computedUrl,
      postUrl: computedUrl,
      imageUrl: computedThumbnail,
      thumbnail: computedThumbnail,
      youtubeId: platform === 'youtube' ? embedId : undefined,
      embedId: embedId || 'live',
      category: mediaEditForm.category || existing.category,
      views: mediaEditForm.views || existing.views,
      likes: mediaEditForm.likes || (existing as any).likes,
    };

    onSaveMediaLink(platform, index, updatedItem);
    setEditingMediaId(null);
    setMediaEditForm({});
    triggerToast(`Updated ${platform.toUpperCase()} media link following your input!`);
  };

  // --- 5. SITE CONTENT / COPY HANDLERS ---
  const handleSaveSiteContent = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateSiteContent) {
      onUpdateSiteContent(siteCopyForm);
      triggerToast('Public website copy, hotlines, and banner updated successfully!');
    }
  };

  // Filtered queries
  const filteredNotices = useMemo(() => {
    if (!searchQuery.trim()) return notices;
    const q = searchQuery.toLowerCase();
    return notices.filter(
      (n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q) || n.badge.toLowerCase().includes(q)
    );
  }, [notices, searchQuery]);

  const filteredSponsors = useMemo(() => {
    if (!searchQuery.trim()) return sponsors;
    const q = searchQuery.toLowerCase();
    return sponsors.filter(
      (s) => s.name.toLowerCase().includes(q) || s.tier.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
    );
  }, [sponsors, searchQuery]);

  const filteredPhotos = useMemo(() => {
    if (!searchQuery.trim()) return galleryPhotos;
    const q = searchQuery.toLowerCase();
    return galleryPhotos.filter(
      (p) => p.title.toLowerCase().includes(q) || (p.caption && p.caption.toLowerCase().includes(q)) || (p.eventTag && p.eventTag.toLowerCase().includes(q))
    );
  }, [galleryPhotos, searchQuery]);

  const currentMediaList = useMemo(() => {
    if (activeMediaPlatform === 'uploads') {
      return uploadedMedia || mediaData.uploads || [];
    }
    return mediaData[activeMediaPlatform] || [];
  }, [activeMediaPlatform, uploadedMedia, mediaData]);

  const filteredMedia = useMemo(() => {
    if (!searchQuery.trim()) return currentMediaList;
    const q = searchQuery.toLowerCase();
    return currentMediaList.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        (m.description && m.description.toLowerCase().includes(q)) ||
        (m.category && m.category.toLowerCase().includes(q)) ||
        (m.caption && m.caption.toLowerCase().includes(q))
    );
  }, [currentMediaList, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Top Banner with Studio Title & Overview */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-amber-950/30 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Globe className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-extrabold text-white font-heading">
              Content Studio & Website Manager
            </h3>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
              Active Control
            </span>
          </div>
          <p className="text-xs text-zinc-400 max-w-2xl">
            Single control center for adding, editing, and deleting all public website content. Changes reflect in real-time across the TWC Cycling Uganda platform.
          </p>
        </div>

        {/* Live Inventory Counter Pill */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 flex items-center gap-1.5 font-mono">
            <span className="text-amber-400 font-bold">{notices.length}</span> Notices
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 flex items-center gap-1.5 font-mono">
            <span className="text-amber-400 font-bold">{sponsors.length}</span> Sponsors
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 flex items-center gap-1.5 font-mono">
            <span className="text-amber-400 font-bold">{galleryPhotos.length}</span> Photos
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 flex items-center gap-1.5 font-mono">
            <span className="text-amber-400 font-bold">{mediaData.youtube.length + mediaData.tiktok.length + mediaData.instagram.length}</span> Videos
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {saveSuccessNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-200 text-xs font-semibold flex items-center justify-between gap-2 shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{saveSuccessNotice}</span>
          </div>
          <button
            onClick={() => setSaveSuccessNotice(null)}
            className="text-emerald-400 hover:text-white p-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Navigation Subtabs + Actions Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div className="flex flex-wrap items-center gap-1.5 bg-zinc-900/90 p-1.5 rounded-2xl border border-zinc-800">
          <button
            id="cms-tab-notices"
            onClick={() => {
              setActiveTab('notices');
              setSearchQuery('');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'notices'
                ? 'bg-amber-500 text-black shadow-md font-extrabold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Notices & News ({notices.length})</span>
          </button>

          <button
            id="cms-tab-sponsors"
            onClick={() => {
              setActiveTab('sponsors');
              setSearchQuery('');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'sponsors'
                ? 'bg-amber-500 text-black shadow-md font-extrabold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Sponsors & Partners ({sponsors.length})</span>
          </button>

          <button
            id="cms-tab-media"
            onClick={() => {
              setActiveTab('media');
              setSearchQuery('');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'media'
                ? 'bg-amber-500 text-black shadow-md font-extrabold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Video & Social Feeds</span>
          </button>

          <button
            id="cms-tab-photos"
            onClick={() => {
              setActiveTab('photos');
              setSearchQuery('');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'photos'
                ? 'bg-amber-500 text-black shadow-md font-extrabold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Photo Albums ({galleryPhotos.length})</span>
          </button>

          <button
            id="cms-tab-site-copy"
            onClick={() => {
              setActiveTab('site_copy');
              setSearchQuery('');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'site_copy'
                ? 'bg-amber-500 text-black shadow-md font-extrabold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Site Copy & Hotlines</span>
          </button>
        </div>

        {/* Right side: Search bar & Add Button */}
        <div className="flex items-center gap-3 flex-wrap">
          {activeTab !== 'site_copy' && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search entries..."
                className="pl-8 pr-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 w-40 sm:w-48"
              />
            </div>
          )}

          {activeTab === 'notices' && (
            <button
              id="cms-add-notice-btn"
              onClick={() => {
                setShowNoticeAddForm(!showNoticeAddForm);
                setEditingNoticeId(null);
              }}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold font-heading flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
            >
              {showNoticeAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{showNoticeAddForm ? 'Close Form' : '+ Add Notice'}</span>
            </button>
          )}

          {activeTab === 'sponsors' && (
            <button
              id="cms-add-sponsor-btn"
              onClick={() => {
                setShowSponsorAddForm(!showSponsorAddForm);
                setEditingSponsorId(null);
              }}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold font-heading flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
            >
              {showSponsorAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{showSponsorAddForm ? 'Close Form' : '+ Add Sponsor'}</span>
            </button>
          )}

          {activeTab === 'media' && (
            <div className="flex items-center gap-2">
              <button
                id="cms-upload-media-btn"
                onClick={() => {
                  setEditingUploadedItem(null);
                  setMediaUploadDefaultType('photo');
                  setIsMediaUploadModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-extrabold font-heading flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
              >
                <Upload className="w-4 h-4" />
                <span>+ Upload From PC/Device</span>
              </button>

              <button
                id="cms-add-media-btn"
                onClick={() => {
                  setShowMediaAddForm(!showMediaAddForm);
                  setEditingMediaId(null);
                }}
                className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold font-heading flex items-center gap-1.5 cursor-pointer border border-zinc-700 transition-all"
              >
                {showMediaAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span>{showMediaAddForm ? 'Close Form' : '+ Social Web Link'}</span>
              </button>
            </div>
          )}

          {activeTab === 'photos' && (
            <div className="flex items-center gap-2">
              <button
                id="cms-upload-photo-btn"
                onClick={() => {
                  setEditingUploadedItem(null);
                  setMediaUploadDefaultType('photo');
                  setIsMediaUploadModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-extrabold font-heading flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
              >
                <Upload className="w-4 h-4" />
                <span>+ Upload Photo from PC</span>
              </button>

              <button
                id="cms-add-photo-btn"
                onClick={() => {
                  setShowPhotoAddForm(!showPhotoAddForm);
                  setEditingPhotoId(null);
                }}
                className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold font-heading flex items-center gap-1.5 cursor-pointer border border-zinc-700 transition-all"
              >
                {showPhotoAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span>{showPhotoAddForm ? 'Close Form' : '+ Photo URL'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. NOTICES & ANNOUNCEMENTS TAB (Add / Edit / Delete) */}
      {/* ========================================================================= */}
      {activeTab === 'notices' && (
        <div className="space-y-6">
          {/* Add Notice Form */}
          {showNoticeAddForm && (
            <form
              onSubmit={handleCreateNotice}
              className="p-6 rounded-2xl bg-zinc-900 border border-amber-500/50 space-y-4 shadow-2xl animate-in fade-in"
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider font-heading">
                  <FileText className="w-4 h-4" />
                  <span>Publish New Notice / Press Brief</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNoticeAddForm(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="md:col-span-2">
                  <label className="text-zinc-400 font-semibold block mb-1">Headline / Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lubiri Circuit Race Road Closure & Safety Brief"
                    value={newNoticeForm.title || ''}
                    onChange={(e) => setNewNoticeForm({ ...newNoticeForm, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Category Badge</label>
                  <select
                    value={newNoticeForm.badge || 'Official Press Brief'}
                    onChange={(e) => setNewNoticeForm({ ...newNoticeForm, badge: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Official Press Brief">Official Press Brief</option>
                    <option value="Flagship Announcement">Flagship Announcement</option>
                    <option value="Youth & Schools">Youth & Schools</option>
                    <option value="Race Logistics">Race Logistics</option>
                    <option value="Road Safety Alert">Road Safety Alert</option>
                  </select>
                </div>

                <div className="md:col-span-3">
                  <label className="text-zinc-400 font-semibold block mb-1">Notice Content *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Full details of the announcement, safety guidelines, participant instructions, or race timings..."
                    value={newNoticeForm.content || ''}
                    onChange={(e) => setNewNoticeForm({ ...newNoticeForm, content: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-amber-500 leading-relaxed"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Action Button Text</label>
                  <input
                    type="text"
                    placeholder="e.g. View Details, Register"
                    value={newNoticeForm.actionText || ''}
                    onChange={(e) => setNewNoticeForm({ ...newNoticeForm, actionText: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Action Button Link</label>
                  <input
                    type="text"
                    placeholder="e.g. #registration or https://..."
                    value={newNoticeForm.actionLink || ''}
                    onChange={(e) => setNewNoticeForm({ ...newNoticeForm, actionLink: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-zinc-300 font-medium">
                    <input
                      type="checkbox"
                      checked={!!newNoticeForm.pinned}
                      onChange={(e) => setNewNoticeForm({ ...newNoticeForm, pinned: e.target.checked })}
                      className="rounded bg-zinc-800 border-zinc-700 text-amber-500 focus:ring-0 w-4 h-4"
                    />
                    <span>Pin to top of website</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowNoticeAddForm(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold font-heading cursor-pointer shadow-lg flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Publish Notice</span>
                </button>
              </div>
            </form>
          )}

          {/* Notice List with Inline Edit & Delete */}
          <div className="space-y-4">
            {filteredNotices.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs">
                No notices found matching your search. Use "+ Add Notice" above to publish one.
              </div>
            ) : (
              filteredNotices.map((n) => {
                const isEditing = editingNoticeId === n.id;

                if (isEditing) {
                  return (
                    <form
                      key={n.id}
                      onSubmit={handleSaveEditedNotice}
                      className="p-5 rounded-2xl bg-zinc-900 border-2 border-amber-500/70 space-y-4 shadow-xl animate-in fade-in"
                    >
                      <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                        <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 font-heading">
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Editing Notice ID: {n.id}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setEditingNoticeId(null)}
                          className="text-zinc-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        <div className="md:col-span-2">
                          <label className="text-zinc-400 block mb-1">Headline *</label>
                          <input
                            type="text"
                            required
                            value={noticeEditForm.title || ''}
                            onChange={(e) => setNoticeEditForm({ ...noticeEditForm, title: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>

                        <div>
                          <label className="text-zinc-400 block mb-1">Category Badge</label>
                          <select
                            value={noticeEditForm.badge || ''}
                            onChange={(e) => setNoticeEditForm({ ...noticeEditForm, badge: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-amber-500"
                          >
                            <option value="Official Press Brief">Official Press Brief</option>
                            <option value="Flagship Announcement">Flagship Announcement</option>
                            <option value="Youth & Schools">Youth & Schools</option>
                            <option value="Race Logistics">Race Logistics</option>
                            <option value="Road Safety Alert">Road Safety Alert</option>
                          </select>
                        </div>

                        <div className="md:col-span-3">
                          <label className="text-zinc-400 block mb-1">Full Content *</label>
                          <textarea
                            required
                            rows={3}
                            value={noticeEditForm.content || ''}
                            onChange={(e) => setNoticeEditForm({ ...noticeEditForm, content: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-amber-500 leading-relaxed"
                          />
                        </div>

                        <div>
                          <label className="text-zinc-400 block mb-1">Button Text</label>
                          <input
                            type="text"
                            value={noticeEditForm.actionText || ''}
                            onChange={(e) => setNoticeEditForm({ ...noticeEditForm, actionText: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>

                        <div>
                          <label className="text-zinc-400 block mb-1">Button Link</label>
                          <input
                            type="text"
                            value={noticeEditForm.actionLink || ''}
                            onChange={(e) => setNoticeEditForm({ ...noticeEditForm, actionLink: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>

                        <div className="flex items-center gap-2 pt-6">
                          <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                            <input
                              type="checkbox"
                              checked={!!noticeEditForm.pinned}
                              onChange={(e) => setNoticeEditForm({ ...noticeEditForm, pinned: e.target.checked })}
                              className="rounded bg-zinc-800 border-zinc-700 text-amber-500 w-4 h-4"
                            />
                            <span>Pinned Notice</span>
                          </label>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
                        <button
                          type="button"
                          onClick={() => setEditingNoticeId(null)}
                          className="px-3.5 py-1.5 rounded-xl bg-zinc-800 text-zinc-300 text-xs cursor-pointer hover:bg-zinc-700"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-md"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Changes</span>
                        </button>
                      </div>
                    </form>
                  );
                }

                return (
                  <div
                    key={n.id}
                    className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3 flex flex-col md:flex-row md:items-start justify-between gap-4 hover:border-zinc-700 transition-colors"
                  >
                    <div className="space-y-1.5 max-w-3xl">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {n.badge}
                        </span>
                        <span className="text-[11px] text-zinc-500 font-mono">{n.date}</span>
                        {n.pinned && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-black flex items-center gap-1">
                            <Pin className="w-3 h-3" />
                            Pinned
                          </span>
                        )}
                      </div>
                      <h4 className="text-base font-bold text-white font-heading">{n.title}</h4>
                      <p className="text-xs text-zinc-300 leading-relaxed">{n.content}</p>
                      {n.actionText && (
                        <div className="text-[11px] text-amber-400 font-medium pt-1">
                          Action: <span className="underline">{n.actionText}</span> ({n.actionLink || '#'})
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-start flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleStartEditNotice(n)}
                        className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-amber-500 hover:text-black text-zinc-300 cursor-pointer text-xs font-bold transition-all flex items-center gap-1"
                        title="Edit Notice"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete notice "${n.title}"?`)) {
                            onDeleteNotice(n.id);
                            triggerToast(`Notice "${n.title}" deleted.`);
                          }
                        }}
                        className="p-1.5 rounded-xl bg-zinc-800 hover:bg-red-950 text-zinc-400 hover:text-red-400 cursor-pointer transition-colors"
                        title="Delete Notice"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SPONSORS & CORPORATE PARTNERS (Add / Edit / Delete) */}
      {/* ========================================================================= */}
      {activeTab === 'sponsors' && (
        <div className="space-y-6">
          {/* Add Sponsor Form */}
          {showSponsorAddForm && (
            <form
              onSubmit={handleCreateSponsor}
              className="p-6 rounded-2xl bg-zinc-900 border border-amber-500/50 space-y-4 shadow-2xl animate-in fade-in"
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider font-heading">
                  <Building2 className="w-4 h-4" />
                  <span>Register Corporate Sponsor / Partner</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSponsorAddForm(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Partner Organization Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MTN Mobile Money Uganda"
                    value={newSponsorForm.name || ''}
                    onChange={(e) => setNewSponsorForm({ ...newSponsorForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Sponsorship Level / Tier *</label>
                  <select
                    value={newSponsorForm.tier || 'Official Co-Sponsor'}
                    onChange={(e) => setNewSponsorForm({ ...newSponsorForm, tier: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Grand Title Partner">Grand Title Partner</option>
                    <option value="Official Co-Sponsor">Official Co-Sponsor</option>
                    <option value="Mobile Money Partner">Mobile Money Partner</option>
                    <option value="Technical & Equipment Partner">Technical & Equipment Partner</option>
                    <option value="Community Supporter">Community Supporter</option>
                  </select>
                </div>

                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Partner Website URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newSponsorForm.websiteUrl || ''}
                    onChange={(e) => setNewSponsorForm({ ...newSponsorForm, websiteUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Logo Image URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newSponsorForm.logoUrl || ''}
                    onChange={(e) => setNewSponsorForm({ ...newSponsorForm, logoUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-zinc-400 font-semibold block mb-1">Partnership Scope / Description</label>
                  <textarea
                    rows={2}
                    placeholder="Describe their contribution (e.g. Official timing, hydration provider, prize purse backer)..."
                    value={newSponsorForm.description || ''}
                    onChange={(e) => setNewSponsorForm({ ...newSponsorForm, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Banner Placement</label>
                  <select
                    value={newSponsorForm.bannerPlacement || 'All'}
                    onChange={(e) => setNewSponsorForm({ ...newSponsorForm, bannerPlacement: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="All">All Pages & Footer</option>
                    <option value="Hero">Hero & Header Only</option>
                    <option value="Events">Race Events Section Only</option>
                    <option value="Footer">Footer Only</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                    <input
                      type="checkbox"
                      checked={!!newSponsorForm.active}
                      onChange={(e) => setNewSponsorForm({ ...newSponsorForm, active: e.target.checked })}
                      className="rounded bg-zinc-800 border-zinc-700 text-amber-500 w-4 h-4"
                    />
                    <span>Active Partnership</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowSponsorAddForm(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold font-heading cursor-pointer shadow-lg flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Partner</span>
                </button>
              </div>
            </form>
          )}

          {/* Sponsors Grid with Edit & Delete */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSponsors.length === 0 ? (
              <div className="col-span-full p-8 text-center rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs">
                No sponsors found matching your search.
              </div>
            ) : (
              filteredSponsors.map((sp) => {
                const isEditing = editingSponsorId === sp.id;

                if (isEditing) {
                  return (
                    <form
                      key={sp.id}
                      onSubmit={handleSaveEditedSponsor}
                      className="p-5 rounded-2xl bg-zinc-900 border-2 border-amber-500/70 space-y-3 shadow-xl animate-in fade-in text-xs col-span-1 md:col-span-2 lg:col-span-3"
                    >
                      <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                        <span className="font-bold text-amber-400 flex items-center gap-1.5 font-heading">
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Editing Sponsor: {sp.name}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setEditingSponsorId(null)}
                          className="text-zinc-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        <div>
                          <label className="text-zinc-400 block mb-1">Name *</label>
                          <input
                            type="text"
                            required
                            value={sponsorEditForm.name || ''}
                            onChange={(e) => setSponsorEditForm({ ...sponsorEditForm, name: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white"
                          />
                        </div>

                        <div>
                          <label className="text-zinc-400 block mb-1">Tier *</label>
                          <select
                            value={sponsorEditForm.tier || ''}
                            onChange={(e) => setSponsorEditForm({ ...sponsorEditForm, tier: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white"
                          >
                            <option value="Grand Title Partner">Grand Title Partner</option>
                            <option value="Official Co-Sponsor">Official Co-Sponsor</option>
                            <option value="Mobile Money Partner">Mobile Money Partner</option>
                            <option value="Technical & Equipment Partner">Technical & Equipment Partner</option>
                            <option value="Community Supporter">Community Supporter</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-zinc-400 block mb-1">Website URL</label>
                          <input
                            type="url"
                            value={sponsorEditForm.websiteUrl || ''}
                            onChange={(e) => setSponsorEditForm({ ...sponsorEditForm, websiteUrl: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="text-zinc-400 block mb-1">Description</label>
                          <input
                            type="text"
                            value={sponsorEditForm.description || ''}
                            onChange={(e) => setSponsorEditForm({ ...sponsorEditForm, description: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white"
                          />
                        </div>

                        <div className="flex items-center gap-2 pt-5">
                          <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                            <input
                              type="checkbox"
                              checked={!!sponsorEditForm.active}
                              onChange={(e) => setSponsorEditForm({ ...sponsorEditForm, active: e.target.checked })}
                              className="rounded bg-zinc-800 border-zinc-700 text-amber-500 w-4 h-4"
                            />
                            <span>Active Partner</span>
                          </label>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
                        <button
                          type="button"
                          onClick={() => setEditingSponsorId(null)}
                          className="px-3.5 py-1.5 rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold cursor-pointer flex items-center gap-1.5 shadow-md"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Changes</span>
                        </button>
                      </div>
                    </form>
                  );
                }

                return (
                  <div
                    key={sp.id}
                    className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3 flex flex-col justify-between hover:border-zinc-700 transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {sp.tier}
                        </span>
                        <button
                          onClick={() => onToggleSponsor(sp.id)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer transition-colors ${
                            sp.active
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}
                          title="Click to toggle status"
                        >
                          {sp.active ? 'Active' : 'Inactive'}
                        </button>
                      </div>

                      <h4 className="text-base font-extrabold text-white font-heading mt-3">
                        {sp.name}
                      </h4>
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{sp.description}</p>
                    </div>

                    <div className="pt-3 border-t border-zinc-800 flex items-center justify-between gap-2">
                      <a
                        href={sp.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-amber-400 hover:underline flex items-center gap-1 truncate"
                      >
                        <span>Visit Partner</span>
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      </a>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleStartEditSponsor(sp)}
                          className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-amber-500 hover:text-black text-zinc-300 cursor-pointer text-xs font-bold transition-all flex items-center gap-1"
                          title="Edit Sponsor Details"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Remove sponsor "${sp.name}"?`)) {
                              onDeleteSponsor(sp.id);
                              triggerToast(`Sponsor "${sp.name}" removed.`);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-red-950 text-zinc-400 hover:text-red-400 cursor-pointer transition-colors"
                          title="Remove Sponsor"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. VIDEO & SOCIAL FEEDS TAB (Add / Edit / Delete) */}
      {/* ========================================================================= */}
      {activeTab === 'media' && (
        <div className="space-y-6">
          {/* Platform Switcher */}
          <div className="flex items-center justify-between bg-zinc-900 p-2 rounded-2xl border border-zinc-800 flex-wrap gap-2">
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <button
                onClick={() => {
                  setActiveMediaPlatform('uploads');
                  setEditingMediaId(null);
                }}
                className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeMediaPlatform === 'uploads'
                    ? 'bg-amber-500 text-black shadow-md font-extrabold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>Device Uploads Vault ({(uploadedMedia || []).length})</span>
              </button>

              <button
                onClick={() => {
                  setActiveMediaPlatform('youtube');
                  setEditingMediaId(null);
                }}
                className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeMediaPlatform === 'youtube'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Youtube className="w-4 h-4" />
                <span>YouTube Clips ({mediaData.youtube.length})</span>
              </button>

              <button
                onClick={() => {
                  setActiveMediaPlatform('tiktok');
                  setEditingMediaId(null);
                }}
                className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeMediaPlatform === 'tiktok'
                    ? 'bg-cyan-500 text-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>TikTok Reels ({mediaData.tiktok.length})</span>
              </button>

              <button
                onClick={() => {
                  setActiveMediaPlatform('instagram');
                  setEditingMediaId(null);
                }}
                className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeMediaPlatform === 'instagram'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Instagram className="w-4 h-4" />
                <span>Instagram Feed ({mediaData.instagram.length})</span>
              </button>
            </div>

            {activeMediaPlatform === 'uploads' ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingUploadedItem(null);
                    setMediaUploadDefaultType('photo');
                    setIsMediaUploadModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>+ Upload File</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowMediaAddForm(!showMediaAddForm);
                    setEditingMediaId(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-md transition-all ${
                    activeMediaPlatform === 'youtube'
                      ? 'bg-red-600 hover:bg-red-500 text-white'
                      : activeMediaPlatform === 'tiktok'
                      ? 'bg-cyan-500 hover:bg-cyan-400 text-black'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white'
                  }`}
                >
                  {showMediaAddForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>
                    {showMediaAddForm
                      ? 'Close'
                      : `+ Add ${activeMediaPlatform === 'youtube' ? 'YouTube' : activeMediaPlatform === 'tiktok' ? 'TikTok' : 'Instagram'} Link`}
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Device Upload Vault Cloud Sync Banner */}
          {activeMediaPlatform === 'uploads' && (
            <div className="p-4 rounded-2xl bg-zinc-900/90 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex-shrink-0 mt-0.5">
                  <Database className="w-4 h-4" />
                </span>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-heading">
                      Firestore Database Media Storage & Local Cache
                    </h4>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.2 rounded-full font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live Synchronized
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Upload photos and videos directly from your PC or mobile device. Media records and metadata are persisted securely in your database, with instant offline caching and smooth playback.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setEditingUploadedItem(null);
                    setMediaUploadDefaultType('photo');
                    setIsMediaUploadModalOpen(true);
                  }}
                  className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-400 text-xs font-bold flex items-center gap-1.5 border border-zinc-700 cursor-pointer"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>+ Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingUploadedItem(null);
                    setMediaUploadDefaultType('video');
                    setIsMediaUploadModalOpen(true);
                  }}
                  className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-cyan-400 text-xs font-bold flex items-center gap-1.5 border border-zinc-700 cursor-pointer"
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>+ Video</span>
                </button>
              </div>
            </div>
          )}

          {/* Add Media Item Form */}
          {showMediaAddForm && (
            <form
              onSubmit={handleCreateMedia}
              className="p-6 rounded-2xl bg-zinc-900 border border-amber-500/50 space-y-4 shadow-2xl animate-in fade-in"
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider font-heading">
                  <Video className="w-4 h-4" />
                  <span>
                    Add New {activeMediaPlatform === 'youtube' ? 'YouTube Video' : activeMediaPlatform === 'tiktok' ? 'TikTok Reel' : 'Instagram Post'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowMediaAddForm(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">
                    Direct {activeMediaPlatform.toUpperCase()} URL / Link *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder={
                      activeMediaPlatform === 'youtube'
                        ? 'https://www.youtube.com/watch?v=... or https://youtu.be/...'
                        : activeMediaPlatform === 'tiktok'
                        ? 'https://www.tiktok.com/@togetherwecancyclingug/video/...'
                        : 'https://www.instagram.com/reel/... or https://www.instagram.com/p/...'
                    }
                    value={newMediaForm.url || ''}
                    onChange={(e) => {
                      const nextUrl = e.target.value;
                      const parsedYt = extractYouTubeId(nextUrl);
                      const parsedTT = extractTikTokInfo(nextUrl);
                      const parsedIG = extractInstagramInfo(nextUrl);

                      let newThumb = newMediaForm.thumbnail;
                      let newTitle = newMediaForm.title;
                      let newCategory = newMediaForm.category;

                      if (activeMediaPlatform === 'youtube' && parsedYt) {
                        if (!newThumb || newThumb.includes('unsplash')) {
                          newThumb = `https://i.ytimg.com/vi/${parsedYt}/hqdefault.jpg`;
                        }
                        if (!newCategory) newCategory = 'Race Highlights';
                      } else if (activeMediaPlatform === 'tiktok' && parsedTT.isTikTok) {
                        if (!newThumb) {
                          newThumb = 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=600&auto=format&fit=crop';
                        }
                        if (!newTitle && parsedTT.videoId) {
                          newTitle = `TWC TikTok Sprint Reel #${parsedTT.videoId.slice(-4)}`;
                        }
                        if (!newCategory) newCategory = 'TikTok Reel';
                        // Automatically fetch preview from TikTok video link
                        handleSyncTikTokAddPreview(nextUrl);
                      } else if (activeMediaPlatform === 'instagram' && parsedIG.isInstagram) {
                        if (!newThumb) {
                          newThumb = 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800&auto=format&fit=crop';
                        }
                        if (!newTitle) {
                          newTitle = parsedIG.isReel ? 'TWC Instagram Reel Highlight' : 'TWC Instagram Race Update';
                        }
                        if (!newCategory) newCategory = parsedIG.isReel ? 'Instagram Reel' : 'Instagram Post';
                      }

                      setNewMediaForm((prev) => ({
                        ...prev,
                        url: nextUrl,
                        title: newTitle || prev.title,
                        category: newCategory || prev.category,
                        embedId: parsedYt || parsedTT.videoId || parsedIG.shortcode || prev.embedId,
                        thumbnail: newThumb,
                      }));
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-amber-500 font-mono text-[11px]"
                  />

                  {/* Real-time Link Detection Badges & Preview Triggers */}
                  {activeMediaPlatform === 'youtube' && extractYouTubeId(newMediaForm.url || '') && (
                    <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>YouTube Video Detected (ID: <strong>{extractYouTubeId(newMediaForm.url || '')}</strong>). Thumbnail auto-synced!</span>
                    </div>
                  )}

                  {activeMediaPlatform === 'tiktok' && extractTikTokInfo(newMediaForm.url || '').isTikTok && (
                    <div className="mt-2 space-y-1.5">
                      <div className="flex items-center justify-between gap-2 flex-wrap text-[10px] text-cyan-400 font-mono">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                          <span>
                            TikTok Reel Detected {extractTikTokInfo(newMediaForm.url || '').videoId ? `(ID: ${extractTikTokInfo(newMediaForm.url || '').videoId})` : ''}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleSyncTikTokAddPreview(newMediaForm.url || '')}
                          disabled={isFetchingTikTokPreview}
                          className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          {isFetchingTikTokPreview ? (
                            <>
                              <Loader2 className="w-2.5 h-2.5 animate-spin" />
                              <span>Fetching Preview...</span>
                            </>
                          ) : (
                            <>
                              <RefreshCw className="w-2.5 h-2.5" />
                              <span>Sync Preview from Link</span>
                            </>
                          )}
                        </button>
                      </div>
                      {tikTokPreviewInfo?.authorName && (
                        <p className="text-[10px] text-zinc-400 font-mono">
                          Creator: <strong className="text-zinc-200">@{tikTokPreviewInfo.authorName}</strong>
                          {tikTokPreviewInfo.title && ` • "${tikTokPreviewInfo.title.slice(0, 45)}..."`}
                        </p>
                      )}
                    </div>
                  )}

                  {activeMediaPlatform === 'instagram' && extractInstagramInfo(newMediaForm.url || '').isInstagram && (
                    <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-pink-400 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5 text-pink-400 flex-shrink-0" />
                      <span>
                        Instagram {extractInstagramInfo(newMediaForm.url || '').isReel ? 'Reel' : 'Post'} Detected {extractInstagramInfo(newMediaForm.url || '').shortcode ? `(${extractInstagramInfo(newMediaForm.url || '').shortcode})` : ''} - Ready to publish!
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">
                    Title / Caption <span className="text-zinc-500 font-normal">(Optional, will auto-generate if empty)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lubiri 105km Sprint Highlights"
                    value={newMediaForm.title || ''}
                    onChange={(e) => setNewMediaForm({ ...newMediaForm, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-zinc-400 font-semibold block mb-1">Summary / Caption Note</label>
                  <textarea
                    rows={2}
                    placeholder="Brief description of the clip or race category featured..."
                    value={newMediaForm.description || ''}
                    onChange={(e) => setNewMediaForm({ ...newMediaForm, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Cover Thumbnail Image URL</label>
                  <input
                    type="url"
                    value={newMediaForm.thumbnail || ''}
                    onChange={(e) => setNewMediaForm({ ...newMediaForm, thumbnail: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-amber-500 font-mono text-[11px]"
                  />
                  {newMediaForm.thumbnail && (
                    <div className="mt-2 flex items-center gap-2">
                      <img
                        src={newMediaForm.thumbnail}
                        alt="Thumbnail preview"
                        referrerPolicy="no-referrer"
                        className="w-16 h-10 object-cover rounded-md border border-zinc-800"
                      />
                      <span className="text-[10px] text-zinc-400">Cover image preview</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Category</label>
                  <input
                    type="text"
                    placeholder={
                      activeMediaPlatform === 'tiktok'
                        ? 'TikTok Reel'
                        : activeMediaPlatform === 'instagram'
                        ? 'Instagram Reel'
                        : 'Race Highlights'
                    }
                    value={newMediaForm.category || ''}
                    onChange={(e) => setNewMediaForm({ ...newMediaForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Live TikTok Video & Thumbnail Preview Box (Directly from provided video link) */}
                {activeMediaPlatform === 'tiktok' && extractTikTokInfo(newMediaForm.url || '').isTikTok && (
                  <div className="md:col-span-2 p-4 rounded-2xl bg-zinc-950 border border-cyan-500/50 space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between text-xs font-heading border-b border-zinc-800 pb-2">
                      <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Live Video Preview (Sourced from TikTok Link)</span>
                      </span>
                      {tikTokPreviewInfo?.authorName ? (
                        <span className="text-[11px] text-zinc-400 font-mono">
                          @{tikTokPreviewInfo.authorName}
                        </span>
                      ) : (
                        <span className="text-[10px] text-zinc-500 font-mono">
                          TikTok Live Embed
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                      {/* Live Embedded Player */}
                      <div className="aspect-[9/16] max-h-72 rounded-xl overflow-hidden bg-black border border-zinc-800 flex items-center justify-center relative shadow-inner">
                        {extractTikTokInfo(newMediaForm.url || '').videoId ? (
                          <iframe
                            src={`https://www.tiktok.com/embed/v2/${extractTikTokInfo(newMediaForm.url || '').videoId}`}
                            title="Live TikTok Video Player"
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <div className="p-4 text-center text-zinc-400 text-xs flex flex-col items-center gap-2">
                            <Play className="w-8 h-8 text-cyan-400 opacity-60" />
                            <span>Preview will display when full video URL is provided</span>
                          </div>
                        )}
                      </div>

                      {/* Thumbnail fetched from link */}
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-zinc-300 font-medium flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                            <span>Cover Image (From Video Link)</span>
                          </span>
                        </div>
                        <div className="aspect-[9/16] max-h-52 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 relative group">
                          <img
                            src={tikTokPreviewInfo?.thumbnailUrl || newMediaForm.thumbnail || 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=600&auto=format&fit=crop'}
                            alt="TikTok video preview"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                            <span className="text-[10px] text-zinc-300 font-mono truncate">
                              {tikTokPreviewInfo?.title || newMediaForm.title || 'TikTok Reel'}
                            </span>
                          </div>
                        </div>
                        <a
                          href={newMediaForm.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium hover:underline pt-1"
                        >
                          <span>Open original video in TikTok</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowMediaAddForm(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold font-heading cursor-pointer shadow-lg flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>
                    Publish {activeMediaPlatform === 'youtube' ? 'Video' : activeMediaPlatform === 'tiktok' ? 'TikTok Reel' : 'Instagram Post'}
                  </span>
                </button>
              </div>
            </form>
          )}

          {/* Media Items List */}
          <div className="space-y-4">
            {filteredMedia.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs">
                No {activeMediaPlatform.toUpperCase()} videos found. Click "+ Add Video" above to add one.
              </div>
            ) : (
              filteredMedia.map((item, index) => {
                const isEditing = editingMediaId === item.id;

                if (isEditing) {
                  return (
                    <div
                      key={item.id}
                      className="p-5 rounded-2xl bg-zinc-900 border-2 border-amber-500/70 space-y-4 shadow-xl animate-in fade-in"
                    >
                      <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                        <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 font-heading">
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Editing {activeMediaPlatform.toUpperCase()} Link: {item.title}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setEditingMediaId(null)}
                          className="text-zinc-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="text-zinc-400 block mb-1">Title *</label>
                          <input
                            type="text"
                            value={mediaEditForm.title || ''}
                            onChange={(e) => setMediaEditForm({ ...mediaEditForm, title: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white"
                          />
                        </div>

                        <div>
                          <label className="text-zinc-400 block mb-1">
                            Direct {activeMediaPlatform.toUpperCase()} URL / Link *
                          </label>
                          <input
                            type="url"
                            value={mediaEditForm.url || mediaEditForm.videoUrl || (mediaEditForm as any).postUrl || ''}
                            onChange={(e) => {
                              const nextUrl = e.target.value;
                              const parsedYt = extractYouTubeId(nextUrl);
                              const parsedTT = extractTikTokInfo(nextUrl);
                              const parsedIG = extractInstagramInfo(nextUrl);

                              let newThumb = mediaEditForm.thumbnail;
                              let newEmbedId = mediaEditForm.embedId;

                              if (activeMediaPlatform === 'youtube' && parsedYt) {
                                newEmbedId = parsedYt;
                                if (!newThumb || newThumb.includes('unsplash') || newThumb.includes('ytimg.com')) {
                                  newThumb = `https://i.ytimg.com/vi/${parsedYt}/hqdefault.jpg`;
                                }
                              } else if (activeMediaPlatform === 'tiktok') {
                                if (parsedTT.videoId) newEmbedId = parsedTT.videoId;
                                if (!newThumb) {
                                  newThumb = 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=600&auto=format&fit=crop';
                                }
                              } else if (activeMediaPlatform === 'tiktok') {
                                if (parsedTT.videoId) newEmbedId = parsedTT.videoId;
                                if (!newThumb) {
                                  newThumb = 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=600&auto=format&fit=crop';
                                }
                                // Auto-fetch live preview from TikTok link
                                handleSyncTikTokEditPreview(nextUrl);
                              } else if (activeMediaPlatform === 'instagram') {
                                if (parsedIG.shortcode) newEmbedId = parsedIG.shortcode;
                                if (!newThumb) {
                                  newThumb = 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800&auto=format&fit=crop';
                                }
                              }

                              setMediaEditForm((prev) => ({
                                ...prev,
                                url: nextUrl,
                                videoUrl: nextUrl,
                                postUrl: nextUrl,
                                mediaUrl: nextUrl,
                                embedId: newEmbedId || prev.embedId,
                                youtubeId: activeMediaPlatform === 'youtube' ? (parsedYt || prev.youtubeId) : undefined,
                                thumbnail: newThumb,
                                imageUrl: newThumb,
                              }));
                            }}
                            placeholder={
                              activeMediaPlatform === 'youtube'
                                ? 'https://www.youtube.com/watch?v=... or https://youtu.be/...'
                                : activeMediaPlatform === 'tiktok'
                                ? 'https://www.tiktok.com/@togetherwecancyclingug/video/...'
                                : 'https://www.instagram.com/reel/... or https://www.instagram.com/p/...'
                            }
                            className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white font-mono text-[11px]"
                          />

                          {/* Real-time Detection Badge in Edit Mode */}
                          {activeMediaPlatform === 'youtube' && extractYouTubeId(mediaEditForm.url || mediaEditForm.videoUrl || '') && (
                            <div className="mt-1 flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                              <span>Detected YouTube Video ID: <strong>{extractYouTubeId(mediaEditForm.url || mediaEditForm.videoUrl || '')}</strong> (Auto-synced)</span>
                            </div>
                          )}

                          {activeMediaPlatform === 'tiktok' && extractTikTokInfo(mediaEditForm.url || mediaEditForm.videoUrl || '').isTikTok && (
                            <div className="mt-2 space-y-1.5">
                              <div className="flex items-center justify-between gap-2 flex-wrap text-[10px] text-cyan-400 font-mono">
                                <div className="flex items-center gap-1.5">
                                  <CheckCircle2 className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                                  <span>
                                    Detected TikTok Reel {extractTikTokInfo(mediaEditForm.url || mediaEditForm.videoUrl || '').videoId ? `(ID: ${extractTikTokInfo(mediaEditForm.url || mediaEditForm.videoUrl || '').videoId})` : ''}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleSyncTikTokEditPreview(mediaEditForm.url || mediaEditForm.videoUrl || '')}
                                  disabled={isFetchingTikTokEditPreview}
                                  className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 flex items-center gap-1 cursor-pointer transition-colors"
                                >
                                  {isFetchingTikTokEditPreview ? (
                                    <>
                                      <Loader2 className="w-2.5 h-2.5 animate-spin" />
                                      <span>Syncing...</span>
                                    </>
                                  ) : (
                                    <>
                                      <RefreshCw className="w-2.5 h-2.5" />
                                      <span>Sync Preview from Link</span>
                                    </>
                                  )}
                                </button>
                              </div>
                              {tikTokEditPreviewInfo?.authorName && (
                                <p className="text-[10px] text-zinc-400 font-mono">
                                  Creator: <strong className="text-zinc-200">@{tikTokEditPreviewInfo.authorName}</strong>
                                  {tikTokEditPreviewInfo.title && ` • "${tikTokEditPreviewInfo.title.slice(0, 45)}..."`}
                                </p>
                              )}
                            </div>
                          )}

                          {activeMediaPlatform === 'instagram' && extractInstagramInfo(mediaEditForm.url || (mediaEditForm as any).postUrl || '').isInstagram && (
                            <div className="mt-1 flex items-center gap-1.5 text-[10px] text-pink-400 font-mono">
                              <CheckCircle2 className="w-3 h-3 text-pink-400 flex-shrink-0" />
                              <span>
                                Detected Instagram {extractInstagramInfo(mediaEditForm.url || (mediaEditForm as any).postUrl || '').isReel ? 'Reel' : 'Post'} {extractInstagramInfo(mediaEditForm.url || (mediaEditForm as any).postUrl || '').shortcode ? `(${extractInstagramInfo(mediaEditForm.url || (mediaEditForm as any).postUrl || '').shortcode})` : ''}
                              </span>
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="text-zinc-400 block mb-1">Category</label>
                          <input
                            type="text"
                            value={mediaEditForm.category || ''}
                            onChange={(e) => setMediaEditForm({ ...mediaEditForm, category: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white"
                          />
                        </div>

                        <div>
                          <label className="text-zinc-400 block mb-1">Cover Thumbnail URL</label>
                          <input
                            type="url"
                            value={mediaEditForm.thumbnail || ''}
                            onChange={(e) => setMediaEditForm({ ...mediaEditForm, thumbnail: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white font-mono text-[11px]"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="text-zinc-400 block mb-1">Summary / Description</label>
                          <input
                            type="text"
                            value={mediaEditForm.description || ''}
                            onChange={(e) => setMediaEditForm({ ...mediaEditForm, description: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white"
                          />
                        </div>

                        {/* Live TikTok Video & Thumbnail Preview Box (Directly from provided video link in Edit mode) */}
                        {activeMediaPlatform === 'tiktok' && extractTikTokInfo(mediaEditForm.url || mediaEditForm.videoUrl || '').isTikTok && (
                          <div className="md:col-span-2 p-4 rounded-2xl bg-zinc-950 border border-cyan-500/50 space-y-3 animate-in fade-in">
                            <div className="flex items-center justify-between text-xs font-heading border-b border-zinc-800 pb-2">
                              <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                                <Play className="w-3.5 h-3.5 fill-current" />
                                <span>Live Video Preview (Sourced from TikTok Link)</span>
                              </span>
                              {tikTokEditPreviewInfo?.authorName ? (
                                <span className="text-[11px] text-zinc-400 font-mono">
                                  @{tikTokEditPreviewInfo.authorName}
                                </span>
                              ) : (
                                <span className="text-[10px] text-zinc-500 font-mono">
                                  TikTok Live Embed
                                </span>
                              )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                              {/* Live Embedded Player */}
                              <div className="aspect-[9/16] max-h-72 rounded-xl overflow-hidden bg-black border border-zinc-800 flex items-center justify-center relative shadow-inner">
                                {extractTikTokInfo(mediaEditForm.url || mediaEditForm.videoUrl || '').videoId ? (
                                  <iframe
                                    src={`https://www.tiktok.com/embed/v2/${extractTikTokInfo(mediaEditForm.url || mediaEditForm.videoUrl || '').videoId}`}
                                    title="Live TikTok Video Player"
                                    className="w-full h-full border-0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  />
                                ) : (
                                  <div className="p-4 text-center text-zinc-400 text-xs flex flex-col items-center gap-2">
                                    <Play className="w-8 h-8 text-cyan-400 opacity-60" />
                                    <span>Preview will display when full video URL is provided</span>
                                  </div>
                                )}
                              </div>

                              {/* Thumbnail fetched from link */}
                              <div className="space-y-2.5">
                                <div className="flex items-center justify-between text-[11px]">
                                  <span className="text-zinc-300 font-medium flex items-center gap-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                                    <span>Cover Image (From Video Link)</span>
                                  </span>
                                </div>
                                <div className="aspect-[9/16] max-h-52 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 relative group">
                                  <img
                                    src={tikTokEditPreviewInfo?.thumbnailUrl || mediaEditForm.thumbnail || 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=600&auto=format&fit=crop'}
                                    alt="TikTok video preview"
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                                    <span className="text-[10px] text-zinc-300 font-mono truncate">
                                      {tikTokEditPreviewInfo?.title || mediaEditForm.title || 'TikTok Reel'}
                                    </span>
                                  </div>
                                </div>
                                <a
                                  href={mediaEditForm.url || mediaEditForm.videoUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium hover:underline pt-1"
                                >
                                  <span>Open original video in TikTok</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            </div>
                          </div>
                        )}

                        {activeMediaPlatform !== 'tiktok' && mediaEditForm.thumbnail && (
                          <div className="md:col-span-2 flex items-center gap-3 p-2 bg-zinc-950 rounded-xl border border-zinc-800">
                            <img
                              src={mediaEditForm.thumbnail}
                              alt="Thumbnail preview"
                              referrerPolicy="no-referrer"
                              className="w-20 h-12 object-cover rounded-lg border border-zinc-700 flex-shrink-0"
                            />
                            <div className="text-[11px] text-zinc-400">
                              <p className="text-white font-medium">Cover Preview</p>
                              <p className="truncate max-w-sm text-zinc-500 font-mono">{mediaEditForm.thumbnail}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
                        <button
                          type="button"
                          onClick={() => setEditingMediaId(null)}
                          className="px-3.5 py-1.5 rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveEditedMedia(activeMediaPlatform, index)}
                          className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold cursor-pointer flex items-center gap-1.5 shadow-md"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Changes</span>
                        </button>
                      </div>
                    </div>
                  );
                }

                const isUploadItem = activeMediaPlatform === 'uploads';
                const isVideo = item.type === 'video' || item.mediaType === 'video';

                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-12 rounded-xl overflow-hidden bg-zinc-950 flex-shrink-0 relative border border-zinc-800">
                        <img
                          src={item.thumbnail || item.mediaUrl || item.imageUrl || 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=600&auto=format&fit=crop'}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        {isVideo && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <Play className="w-4 h-4 text-white fill-white" />
                          </div>
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-white line-clamp-1">{item.title}</h4>
                          {isUploadItem && (
                            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                              isVideo ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            }`}>
                              {isVideo ? 'VIDEO' : 'PHOTO'}
                            </span>
                          )}
                          {isUploadItem && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1 font-mono">
                              <Database className="w-2.5 h-2.5 text-emerald-400" />
                              <span>DB Stored</span>
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-400 line-clamp-1">{item.description || item.caption}</p>
                        <div className="text-[11px] text-zinc-500 font-mono flex items-center gap-2 flex-wrap">
                          <span className="text-amber-400">{item.category}</span>
                          <span>•</span>
                          <span>{item.date}</span>
                          {item.fileName && (
                            <>
                              <span>•</span>
                              <span className="truncate max-w-[140px] text-zinc-400">{item.fileName}</span>
                            </>
                          )}
                          {item.fileSize && (
                            <>
                              <span>•</span>
                              <span className="text-zinc-500">{item.fileSize}</span>
                            </>
                          )}
                          {item.location && (
                            <>
                              <span>•</span>
                              <span className="text-zinc-400">{item.location}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0">
                      {((item as any).postUrl || item.url || item.videoUrl || item.mediaUrl) && (
                        <a
                          href={(item as any).postUrl || item.url || item.videoUrl || item.mediaUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white"
                          title="Preview Link"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          if (isUploadItem) {
                            setEditingUploadedItem(item);
                            setIsMediaUploadModalOpen(true);
                          } else {
                            handleStartEditMedia(item);
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-amber-500 hover:text-black text-zinc-300 cursor-pointer text-xs font-bold transition-all flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (isUploadItem) {
                            if (confirm(`Delete uploaded media "${item.title}" from database?`)) {
                              onDeleteUploadedMedia?.(item.id);
                              triggerToast(`Media "${item.title}" deleted from database.`);
                            }
                          } else {
                            if (confirm(`Delete media item "${item.title}"?`)) {
                              onDeleteMediaItem(activeMediaPlatform, item.id);
                              triggerToast('Media item deleted.');
                            }
                          }
                        }}
                        className="p-1.5 rounded-xl bg-zinc-800 hover:bg-red-950 text-zinc-400 hover:text-red-400 cursor-pointer transition-colors"
                        title="Delete Media"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. PHOTO GALLERY TAB (Add / Edit / Delete) */}
      {/* ========================================================================= */}
      {activeTab === 'photos' && (
        <div className="space-y-6">
          {/* Add Photo Form */}
          {showPhotoAddForm && (
            <form
              onSubmit={handleCreatePhoto}
              className="p-6 rounded-2xl bg-zinc-900 border border-amber-500/50 space-y-4 shadow-2xl animate-in fade-in"
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider font-heading">
                  <ImageIcon className="w-4 h-4" />
                  <span>Upload / Add Academy Photo</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPhotoAddForm(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Photo Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lubiri 105km Elite Sprint Finish"
                    value={newPhotoForm.title || ''}
                    onChange={(e) => setNewPhotoForm({ ...newPhotoForm, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Event or Location Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. Lubiri Ring Road, Katwe Office, Entebbe Highway"
                    value={newPhotoForm.eventTag || ''}
                    onChange={(e) => setNewPhotoForm({ ...newPhotoForm, eventTag: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Category</label>
                  <select
                    value={newPhotoForm.category || 'Races'}
                    onChange={(e) => setNewPhotoForm({ ...newPhotoForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Races">Races</option>
                    <option value="Training">Training</option>
                    <option value="Community">Community</option>
                    <option value="Podium">Podium & Awards</option>
                  </select>
                </div>

                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Image URL *</label>
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/photo-..."
                    value={newPhotoForm.imageUrl || ''}
                    onChange={(e) => setNewPhotoForm({ ...newPhotoForm, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-amber-500 font-mono text-[11px]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-zinc-400 font-semibold block mb-1">Caption / Story</label>
                  <input
                    type="text"
                    placeholder="Brief description of the riders or memorable moment..."
                    value={newPhotoForm.caption || ''}
                    onChange={(e) => setNewPhotoForm({ ...newPhotoForm, caption: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowPhotoAddForm(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold font-heading cursor-pointer shadow-lg flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Publish Photo</span>
                </button>
              </div>
            </form>
          )}

          {/* Photo Grid with Edit & Delete */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredPhotos.length === 0 ? (
              <div className="col-span-full p-8 text-center rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs">
                No photos found matching your search. Use "+ Add Photo" to upload.
              </div>
            ) : (
              filteredPhotos.map((p) => {
                const isEditing = editingPhotoId === p.id;

                if (isEditing) {
                  return (
                    <form
                      key={p.id}
                      onSubmit={handleSaveEditedPhoto}
                      className="p-4 rounded-2xl bg-zinc-900 border-2 border-amber-500/70 space-y-3 shadow-xl animate-in fade-in text-xs col-span-1 sm:col-span-2 md:col-span-3"
                    >
                      <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                        <span className="font-bold text-amber-400 flex items-center gap-1.5 font-heading">
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Editing Photo: {p.title}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setEditingPhotoId(null)}
                          className="text-zinc-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2 space-y-3">
                          <div>
                            <label className="text-zinc-400 block mb-1">Title *</label>
                            <input
                              type="text"
                              required
                              value={photoEditForm.title || ''}
                              onChange={(e) => setPhotoEditForm({ ...photoEditForm, title: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white"
                            />
                          </div>

                          <div>
                            <label className="text-zinc-400 block mb-1">Image URL *</label>
                            <input
                              type="url"
                              required
                              value={photoEditForm.imageUrl || ''}
                              onChange={(e) => setPhotoEditForm({ ...photoEditForm, imageUrl: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white font-mono text-[11px]"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-zinc-400 block mb-1">Event Tag</label>
                              <input
                                type="text"
                                value={photoEditForm.eventTag || ''}
                                onChange={(e) => setPhotoEditForm({ ...photoEditForm, eventTag: e.target.value })}
                                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white"
                              />
                            </div>
                            <div>
                              <label className="text-zinc-400 block mb-1">Category</label>
                              <select
                                value={photoEditForm.category || 'Races'}
                                onChange={(e) => setPhotoEditForm({ ...photoEditForm, category: e.target.value })}
                                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white"
                              >
                                <option value="Races">Races</option>
                                <option value="Training">Training</option>
                                <option value="Community">Community</option>
                                <option value="Podium">Podium & Awards</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="text-zinc-400 block mb-1">Caption</label>
                            <input
                              type="text"
                              value={photoEditForm.caption || ''}
                              onChange={(e) => setPhotoEditForm({ ...photoEditForm, caption: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white"
                            />
                          </div>
                        </div>

                        {/* Live Preview */}
                        <div className="space-y-1">
                          <label className="text-zinc-400 block mb-1">Live Image Preview</label>
                          <div className="aspect-video rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                            {photoEditForm.imageUrl ? (
                              <img
                                src={photoEditForm.imageUrl}
                                alt="Preview"
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-zinc-600">No Image</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
                        <button
                          type="button"
                          onClick={() => setEditingPhotoId(null)}
                          className="px-3.5 py-1.5 rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold cursor-pointer flex items-center gap-1.5 shadow-md"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Changes</span>
                        </button>
                      </div>
                    </form>
                  );
                }

                return (
                  <div
                    key={p.id}
                    className="rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 flex flex-col justify-between hover:border-zinc-700 transition-colors"
                  >
                    <div className="relative aspect-video overflow-hidden bg-zinc-950">
                      <img
                        src={p.imageUrl}
                        alt={p.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/70 text-amber-300 backdrop-blur-sm border border-amber-500/30">
                        {p.category}
                      </span>
                      {p.eventTag && (
                        <span className="absolute bottom-2 left-2 text-[10px] px-2 py-0.5 rounded-full bg-black/70 text-zinc-300 backdrop-blur-sm">
                          {p.eventTag}
                        </span>
                      )}
                    </div>

                    <div className="p-3.5 space-y-2">
                      <div>
                        <h4 className="text-xs font-bold text-white line-clamp-1">{p.title}</h4>
                        <p className="text-[11px] text-zinc-400 line-clamp-1">{p.caption}</p>
                      </div>

                      <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-[11px]">
                        <span className="text-zinc-500 font-mono text-[10px]">{p.date}</span>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleStartEditPhoto(p)}
                            className="px-2 py-1 rounded-lg bg-zinc-800 hover:bg-amber-500 hover:text-black text-zinc-300 cursor-pointer text-[10px] font-bold transition-all flex items-center gap-1"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Delete photo "${p.title}"?`)) {
                                onDeletePhoto(p.id);
                                triggerToast(`Photo "${p.title}" deleted.`);
                              }
                            }}
                            className="p-1 rounded-lg bg-zinc-800 hover:bg-red-950 text-zinc-400 hover:text-red-400 cursor-pointer transition-colors"
                            title="Delete Photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. SITE COPY & OFFICIAL HOTLINES TAB (Live Content Management) */}
      {/* ========================================================================= */}
      {activeTab === 'site_copy' && (
        <form
          onSubmit={handleSaveSiteContent}
          className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-6 shadow-xl"
        >
          <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider font-heading">
              <Globe className="w-4 h-4" />
              <span>Public Website Announcements, Hotlines & Head Office Info</span>
            </div>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono">
              Live Synchronized
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div className="md:col-span-2">
              <label className="text-zinc-300 font-bold block mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Top Notification Ticker / Announcement Banner</span>
              </label>
              <input
                type="text"
                required
                value={siteCopyForm.announcementBanner}
                onChange={(e) => setSiteCopyForm({ ...siteCopyForm, announcementBanner: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-amber-500 font-medium"
              />
              <p className="text-[11px] text-zinc-500 mt-1">
                Displayed in the prominent yellow/amber banner across the top of every page.
              </p>
            </div>

            <div>
              <label className="text-zinc-300 font-bold block mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Primary Registration Hotline (Airtel / MoMo)</span>
              </label>
              <input
                type="text"
                required
                value={siteCopyForm.hotline1}
                onChange={(e) => setSiteCopyForm({ ...siteCopyForm, hotline1: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="text-zinc-300 font-bold block mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Secondary Operations Hotline (MTN / Airtel)</span>
              </label>
              <input
                type="text"
                required
                value={siteCopyForm.hotline2}
                onChange={(e) => setSiteCopyForm({ ...siteCopyForm, hotline2: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="text-zinc-300 font-bold block mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Academy Head Office Address</span>
              </label>
              <input
                type="text"
                required
                value={siteCopyForm.headquartersAddress}
                onChange={(e) => setSiteCopyForm({ ...siteCopyForm, headquartersAddress: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-zinc-300 font-bold block mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>Official Contact Email</span>
              </label>
              <input
                type="email"
                required
                value={siteCopyForm.contactEmail}
                onChange={(e) => setSiteCopyForm({ ...siteCopyForm, contactEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-zinc-300 font-bold block mb-1.5">
                Hero Headline (Main Academy Title)
              </label>
              <input
                type="text"
                required
                value={siteCopyForm.heroHeadline}
                onChange={(e) => setSiteCopyForm({ ...siteCopyForm, heroHeadline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-amber-500 font-heading font-extrabold"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-zinc-300 font-bold block mb-1.5">
                Hero Subtitle / Academy Mission Statement
              </label>
              <textarea
                rows={3}
                required
                value={siteCopyForm.heroSubtitle}
                onChange={(e) => setSiteCopyForm({ ...siteCopyForm, heroSubtitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-amber-500 leading-relaxed"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
            <span className="text-[11px] text-zinc-500 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Clicking Save commits changes directly to the public website headers & contact widgets.</span>
            </span>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-extrabold font-heading cursor-pointer shadow-lg flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Website Content Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* Device Media Upload & Edit Modal for PC / Mobile Files */}
      <MediaUploadModal
        isOpen={isMediaUploadModalOpen}
        onClose={() => {
          setIsMediaUploadModalOpen(false);
          setEditingUploadedItem(null);
        }}
        defaultType={mediaUploadDefaultType}
        editItem={editingUploadedItem}
        autoSave={true}
        onSave={async (item, blob) => {
          if (editingUploadedItem) {
            if (onUpdateUploadedMedia) {
              await onUpdateUploadedMedia(item, blob);
            }
            triggerToast(`Media "${item.title}" updated in database!`);
          } else {
            if (onAddUploadedMedia) {
              await onAddUploadedMedia(item, blob);
            }
            // If active tab is photos, also add to the photo gallery collection
            if (activeTab === 'photos') {
              onAddPhoto({
                id: item.id,
                title: item.title,
                caption: item.description || item.caption || '',
                imageUrl: item.imageUrl || item.thumbnail || item.mediaUrl || '',
                eventTag: item.location || item.category || 'Lubiri Ring Road',
                category: item.category === 'Training Clinics' ? 'Training' : 'Races',
                date: item.date || new Date().toLocaleDateString('en-GB'),
              });
              triggerToast(`Photo "${item.title}" automatically saved to Gallery & Cloud Database!`);
            } else {
              triggerToast(`Media "${item.title}" automatically saved to database!`);
            }
          }
        }}
        onSaveMedia={async (item, blob) => {
          if (editingUploadedItem) {
            if (onUpdateUploadedMedia) {
              await onUpdateUploadedMedia(item, blob);
            }
            triggerToast(`Media "${item.title}" updated in database!`);
          } else {
            if (onAddUploadedMedia) {
              await onAddUploadedMedia(item, blob);
            }
            if (activeTab === 'photos') {
              onAddPhoto({
                id: item.id,
                title: item.title,
                caption: item.description || item.caption || '',
                imageUrl: item.imageUrl || item.thumbnail || item.mediaUrl || '',
                eventTag: item.location || item.category || 'Lubiri Ring Road',
                category: item.category === 'Training Clinics' ? 'Training' : 'Races',
                date: item.date || new Date().toLocaleDateString('en-GB'),
              });
              triggerToast(`Photo "${item.title}" automatically saved to Gallery & Cloud Database!`);
            } else {
              triggerToast(`Media "${item.title}" automatically saved to database!`);
            }
          }
        }}
      />
    </div>
  );
};
