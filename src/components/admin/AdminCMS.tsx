import React, { useState, useMemo } from 'react';
import {
  NoticeItem,
  SponsorItem,
  GalleryPhotoItem,
  SocialMediaItem,
  AdminRole,
  SiteContentSettings,
} from '../../types';
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
  };
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
}

export const AdminCMS: React.FC<AdminCMSProps> = ({
  currentRole,
  notices,
  sponsors,
  galleryPhotos,
  mediaData,
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
  const [activeMediaPlatform, setActiveMediaPlatform] = useState<'youtube' | 'tiktok' | 'instagram'>('youtube');
  const [editingMediaId, setEditingMediaId] = useState<string | null>(null);
  const [mediaEditForm, setMediaEditForm] = useState<Partial<SocialMediaItem>>({});

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
    if (!newMediaForm.title || !newMediaForm.url) return;

    let embedId = newMediaForm.embedId;
    if (!embedId && newMediaForm.url) {
      if (activeMediaPlatform === 'youtube') {
        const match = newMediaForm.url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
        if (match) embedId = match[1];
      }
    }

    const item: SocialMediaItem = {
      id: `media-${Date.now()}`,
      title: newMediaForm.title,
      description: newMediaForm.description || '',
      url: newMediaForm.url,
      embedId: embedId || 'live',
      author: newMediaForm.author || 'TWC Cycling Academy Uganda',
      date: newMediaForm.date || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      thumbnail: newMediaForm.thumbnail || 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=600&auto=format&fit=crop',
      category: newMediaForm.category || 'Race Highlights',
      views: newMediaForm.views || '1K views',
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
    triggerToast(`New ${activeMediaPlatform.toUpperCase()} video published!`);
  };

  const handleStartEditMedia = (item: SocialMediaItem) => {
    setEditingMediaId(item.id);
    setMediaEditForm({ ...item });
  };

  const handleSaveEditedMedia = (platform: 'youtube' | 'tiktok' | 'instagram', index: number) => {
    if (!editingMediaId || !mediaEditForm.title || !mediaEditForm.url) return;

    const originalList = mediaData[platform];
    const existing = originalList[index];
    if (!existing) return;

    let embedId = mediaEditForm.embedId || existing.embedId;
    if (platform === 'youtube' && mediaEditForm.url) {
      const match = mediaEditForm.url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      if (match) embedId = match[1];
    }

    const updatedItem: SocialMediaItem = {
      ...existing,
      title: mediaEditForm.title || existing.title,
      url: mediaEditForm.url || existing.url,
      description: mediaEditForm.description !== undefined ? mediaEditForm.description : existing.description,
      embedId,
      thumbnail: mediaEditForm.thumbnail || existing.thumbnail,
      category: mediaEditForm.category || existing.category,
      views: mediaEditForm.views || existing.views,
    };

    onSaveMediaLink(platform, index, updatedItem);
    setEditingMediaId(null);
    setMediaEditForm({});
    triggerToast(`Updated ${platform.toUpperCase()} media link!`);
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

  const currentMediaList = mediaData[activeMediaPlatform] || [];
  const filteredMedia = useMemo(() => {
    if (!searchQuery.trim()) return currentMediaList;
    const q = searchQuery.toLowerCase();
    return currentMediaList.filter(
      (m) => m.title.toLowerCase().includes(q) || (m.description && m.description.toLowerCase().includes(q))
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
            <button
              id="cms-add-media-btn"
              onClick={() => {
                setShowMediaAddForm(!showMediaAddForm);
                setEditingMediaId(null);
              }}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold font-heading flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
            >
              {showMediaAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{showMediaAddForm ? 'Close Form' : `+ Add ${activeMediaPlatform.toUpperCase()} Video`}</span>
            </button>
          )}

          {activeTab === 'photos' && (
            <button
              id="cms-add-photo-btn"
              onClick={() => {
                setShowPhotoAddForm(!showPhotoAddForm);
                setEditingPhotoId(null);
              }}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold font-heading flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
            >
              {showPhotoAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{showPhotoAddForm ? 'Close Form' : '+ Add Photo'}</span>
            </button>
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
          <div className="flex items-center justify-between bg-zinc-900 p-2 rounded-2xl border border-zinc-800">
            <div className="flex items-center gap-2 text-xs">
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
          </div>

          {/* Add Media Item Form */}
          {showMediaAddForm && (
            <form
              onSubmit={handleCreateMedia}
              className="p-6 rounded-2xl bg-zinc-900 border border-amber-500/50 space-y-4 shadow-2xl animate-in fade-in"
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider font-heading">
                  <Video className="w-4 h-4" />
                  <span>Publish New {activeMediaPlatform.toUpperCase()} Video / Post</span>
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
                  <label className="text-zinc-400 font-semibold block mb-1">Title / Caption *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lubiri 105km Final Sprint Highlights"
                    value={newMediaForm.title || ''}
                    onChange={(e) => setNewMediaForm({ ...newMediaForm, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Direct Media URL *</label>
                  <input
                    type="url"
                    required
                    placeholder="https://www.youtube.com/watch?v=... or https://tiktok.com/@twccycling..."
                    value={newMediaForm.url || ''}
                    onChange={(e) => setNewMediaForm({ ...newMediaForm, url: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-amber-500 font-mono text-[11px]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-zinc-400 font-semibold block mb-1">Video Summary</label>
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
                </div>

                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Race Highlights, Youth Clinic, Crash Analysis"
                    value={newMediaForm.category || ''}
                    onChange={(e) => setNewMediaForm({ ...newMediaForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
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
                  <span>Publish Video</span>
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
                          <label className="text-zinc-400 block mb-1">Direct URL *</label>
                          <input
                            type="url"
                            value={mediaEditForm.url || ''}
                            onChange={(e) => setMediaEditForm({ ...mediaEditForm, url: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white font-mono text-[11px]"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="text-zinc-400 block mb-1">Summary</label>
                          <input
                            type="text"
                            value={mediaEditForm.description || ''}
                            onChange={(e) => setMediaEditForm({ ...mediaEditForm, description: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white"
                          />
                        </div>
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

                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-12 rounded-xl overflow-hidden bg-zinc-950 flex-shrink-0 relative border border-zinc-800">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-sm font-bold text-white line-clamp-1">{item.title}</h4>
                        <p className="text-xs text-zinc-400 line-clamp-1">{item.description}</p>
                        <div className="text-[11px] text-zinc-500 font-mono flex items-center gap-2">
                          <span className="text-amber-400">{item.category}</span>
                          <span>•</span>
                          <span className="truncate max-w-[200px] sm:max-w-xs">{item.url}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white"
                        title="Preview Link"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      <button
                        type="button"
                        onClick={() => handleStartEditMedia(item)}
                        className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-amber-500 hover:text-black text-zinc-300 cursor-pointer text-xs font-bold transition-all flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete media item "${item.title}"?`)) {
                            onDeleteMediaItem(activeMediaPlatform, item.id);
                            triggerToast('Media item deleted.');
                          }
                        }}
                        className="p-1.5 rounded-xl bg-zinc-800 hover:bg-red-950 text-zinc-400 hover:text-red-400 cursor-pointer transition-colors"
                        title="Delete Media Link"
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
    </div>
  );
};
