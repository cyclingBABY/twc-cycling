import React, { useState } from 'react';
import {
  YOUTUBE_CHANNEL,
  YOUTUBE_MEDIA,
  TIKTOK_ACCOUNT,
  TIKTOK_MEDIA,
  INSTAGRAM_ACCOUNT,
  INSTAGRAM_MEDIA,
  MediaVideoItem,
  TikTokItem,
  InstagramItem,
  extractYouTubeId,
  extractTikTokInfo,
} from '../data/cyclingData';
import { SocialMediaItem } from '../types';
import {
  Youtube,
  Instagram,
  Play,
  Heart,
  MessageCircle,
  Share2,
  ExternalLink,
  Sparkles,
  X,
  Check,
  Radio,
  Image as ImageIcon,
  Video as VideoIcon,
  MapPin,
  Calendar,
  Eye,
  Film,
  Maximize2,
} from 'lucide-react';

import { TikTokUserReelCard } from './TikTokUserReelCard';

// Custom TikTok icon
const TikTokIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.26 6.26 0 0 0 1.87-4.49V8.62a8.28 8.28 0 0 0 4.9 1.58V6.75a4.85 4.85 0 0 1-1-.06Z" />
  </svg>
);

interface SocialMediaHubProps {
  youtubeVideos?: MediaVideoItem[];
  tiktokReels?: TikTokItem[];
  instagramPosts?: InstagramItem[];
  uploadedMedia?: SocialMediaItem[];
  onUpdateTikTokReel?: (reel: TikTokItem) => void;
}

export const SocialMediaHub: React.FC<SocialMediaHubProps> = ({
  youtubeVideos = YOUTUBE_MEDIA,
  tiktokReels = TIKTOK_MEDIA,
  instagramPosts = INSTAGRAM_MEDIA,
  uploadedMedia = [],
  onUpdateTikTokReel,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'uploads' | 'youtube' | 'tiktok' | 'instagram'>('all');
  const [activeVideoModal, setActiveVideoModal] = useState<MediaVideoItem | null>(null);
  const [activeTikTokModal, setActiveTikTokModal] = useState<TikTokItem | null>(null);
  const [activeUploadedMediaModal, setActiveUploadedMediaModal] = useState<SocialMediaItem | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  const getYouTubeLink = (video: MediaVideoItem) => {
    if (video.videoUrl && video.videoUrl.trim()) {
      return video.videoUrl.trim();
    }
    if ((video as any).url && (video as any).url.trim()) {
      return (video as any).url.trim();
    }
    if ((video as any).mediaUrl && (video as any).mediaUrl.trim()) {
      return (video as any).mediaUrl.trim();
    }
    if (video.youtubeId) {
      return `https://www.youtube.com/watch?v=${video.youtubeId}`;
    }
    return `https://www.youtube.com/results?search_query=TWC+CYCLING+${encodeURIComponent(video.title)}`;
  };

  return (
    <section id="media" className="py-20 sm:py-28 bg-zinc-950 text-zinc-100 relative overflow-hidden border-t border-zinc-800/80">
      {/* Neon/athletic atmospheric glow */}
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Top section header with official social links */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider font-heading mb-3">
              <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              <span>Official Media & Content Vault</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-heading tracking-tight">
              TWC Cycling in Real Motion
            </h2>
            <p className="mt-3 text-zinc-400 text-sm sm:text-base leading-relaxed max-w-2xl">
              Authentic race footage, team media archives, and official broadcasts from Together We Can Cycling Uganda.
            </p>
          </div>

          {/* Clean Official Channels Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href={YOUTUBE_CHANNEL.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold font-heading transition-all shadow-md shadow-red-600/20"
            >
              <Youtube className="w-4 h-4" />
              <span>YouTube Channel</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <a
              href={TIKTOK_ACCOUNT.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white text-xs font-bold font-heading transition-all shadow-md"
            >
              <TikTokIcon className="w-4 h-4 text-cyan-400" />
              <span>TikTok</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <a
              href={INSTAGRAM_ACCOUNT.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-pink-500/30 text-pink-300 hover:text-white text-xs font-bold font-heading transition-all shadow-md"
            >
              <Instagram className="w-4 h-4 text-pink-400" />
              <span>Instagram</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Interactive Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-4 overflow-x-auto">
          {[
            { id: 'all', label: 'All Media', icon: <Sparkles className="w-4 h-4" /> },
            ...(uploadedMedia.length > 0
              ? [
                  {
                    id: 'uploads',
                    label: `Team Vault (${uploadedMedia.length})`,
                    icon: <Film className="w-4 h-4 text-amber-400" />,
                  },
                ]
              : []),
            {
              id: 'youtube',
              label: `YouTube Official (${youtubeVideos.length})`,
              icon: <Youtube className="w-4 h-4 text-red-500" />,
            },
            {
              id: 'tiktok',
              label: `TikTok Reels (${tiktokReels.length})`,
              icon: <TikTokIcon className="w-4 h-4 text-cyan-400" />,
            },
            {
              id: 'instagram',
              label: `Instagram Gallery (${instagramPosts.length})`,
              icon: <Instagram className="w-4 h-4 text-pink-400" />,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* 1. TEAM UPLOADS / VAULT (Photos and Videos) */}
        {/* ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'uploads') && uploadedMedia.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                <h3 className="text-lg sm:text-xl font-extrabold text-white font-heading tracking-tight">
                  Team Vault & Race Media
                </h3>
              </div>
              <span className="text-xs text-zinc-400 font-mono">
                {uploadedMedia.length} {uploadedMedia.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {uploadedMedia.map((item) => {
                const isVideo = item.type === 'video' || !!item.videoUrl;
                const displayThumbnail =
                  item.thumbnail ||
                  item.imageUrl ||
                  item.mediaUrl ||
                  'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800&auto=format&fit=crop';

                return (
                  <div
                    key={item.id}
                    className="bg-zinc-900/90 rounded-3xl border border-zinc-800/90 overflow-hidden hover:border-amber-500/60 transition-all group flex flex-col justify-between shadow-lg hover:shadow-2xl"
                  >
                    {/* Media Header / Image Box */}
                    <div className="relative aspect-video overflow-hidden bg-zinc-950">
                      <img
                        src={displayThumbnail}
                        alt={item.title || 'TWC Media'}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg backdrop-blur-md flex items-center gap-1 shadow-md ${
                            isVideo
                              ? 'bg-amber-500 text-black'
                              : 'bg-emerald-500 text-black'
                          }`}
                        >
                          {isVideo ? <VideoIcon className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                          <span>{isVideo ? 'Video' : 'Photo'}</span>
                        </span>
                      </div>

                      {/* Top Right Duration */}
                      {item.duration && (
                        <div className="absolute top-3 right-3 text-[10px] font-mono font-bold bg-black/80 text-amber-400 px-2 py-0.5 rounded border border-zinc-800 backdrop-blur-md">
                          {item.duration}
                        </div>
                      )}

                      {/* Click overlay to play/view */}
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <button
                          onClick={() => setActiveUploadedMediaModal(item)}
                          className="w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center shadow-xl shadow-amber-500/40 group-hover:scale-110 transition-transform cursor-pointer"
                          title={isVideo ? 'Play Video' : 'View Full Photo'}
                        >
                          {isVideo ? (
                            <Play className="w-5 h-5 ml-0.5 fill-current" />
                          ) : (
                            <Maximize2 className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-1.5">
                          <span className="text-amber-400 font-bold uppercase">{item.category}</span>
                          {item.date && <span>{item.date}</span>}
                        </div>

                        <h4 className="text-base font-bold text-white font-heading leading-snug line-clamp-2">
                          {item.title}
                        </h4>

                        <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                          {item.caption || item.description || 'TWC Cycling Uganda team archive.'}
                        </p>
                      </div>

                      {/* Location & View Button */}
                      <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2 text-xs">
                        {item.location ? (
                          <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] truncate max-w-[180px]">
                            <MapPin className="w-3 h-3 text-amber-400 flex-shrink-0" />
                            <span className="truncate">{item.location}</span>
                          </div>
                        ) : (
                          <div className="text-[11px] text-zinc-500 font-mono">
                            {item.fileName || 'TWC Media'}
                          </div>
                        )}

                        <button
                          onClick={() => setActiveUploadedMediaModal(item)}
                          className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                        >
                          <span>{isVideo ? 'Play Video' : 'View High-Res'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. YOUTUBE SECTION (UCcyYTjupx6KfAfe-ON_Wqlg) */}
        {/* ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'youtube') && (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-red-950/30 via-zinc-900 to-zinc-950 border border-red-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-red-600/30">
                  <Youtube className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl sm:text-2xl font-black text-white font-heading">
                      {YOUTUBE_CHANNEL.name}
                    </h3>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/40">
                      ID: {YOUTUBE_CHANNEL.id}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-amber-300">
                      {YOUTUBE_CHANNEL.subscribers}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                      {youtubeVideos.length} videos listed
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-300 mt-2 max-w-2xl leading-relaxed">
                    {YOUTUBE_CHANNEL.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={YOUTUBE_CHANNEL.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-heading font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-red-600/25 cursor-pointer"
                >
                  <Youtube className="w-4 h-4" />
                  <span>Subscribe on YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* YouTube Video Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {youtubeVideos.map((video) => (
                <div
                  key={video.id}
                  className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden hover:border-red-500/50 transition-all group flex flex-col justify-between"
                >
                  <div className="relative aspect-video overflow-hidden bg-zinc-950">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <button
                        onClick={() => setActiveVideoModal(video)}
                        className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl shadow-red-600/50 group-hover:scale-110 transition-transform cursor-pointer"
                        aria-label="Play YouTube video"
                      >
                        <Play className="w-5 h-5 ml-0.5 fill-current" />
                      </button>
                    </div>
                    <div className="absolute bottom-2.5 right-2.5 bg-black/80 text-white text-[10px] font-mono px-2 py-0.5 rounded border border-zinc-800">
                      {video.duration}
                    </div>
                    <div className="absolute top-2.5 left-2.5 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow">
                      {video.category}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="text-base font-bold text-white font-heading line-clamp-2 leading-snug">
                        {video.title}
                      </h4>
                      <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                        {video.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
                      <div className="flex items-center gap-1.5 font-mono text-[11px]">
                        <Eye className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{video.views}</span>
                        <span>•</span>
                        <span>{video.uploadDate}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => copyToClipboard(getYouTubeLink(video), video.id)}
                          className="text-zinc-400 hover:text-white p-1 rounded hover:bg-zinc-800 transition-colors"
                          title="Copy Video Link"
                        >
                          {copiedLink === video.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                        </button>
                        <a
                          href={getYouTubeLink(video)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-red-400 hover:text-red-300 text-xs font-semibold flex items-center gap-1 hover:underline"
                        >
                          <span>YouTube</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. TIKTOK SECTION */}
        {/* ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'tiktok') && (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-cyan-950/30 via-zinc-900 to-zinc-950 border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500 flex items-center justify-center text-black flex-shrink-0 shadow-lg shadow-cyan-500/30">
                  <TikTokIcon className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl sm:text-2xl font-black text-white font-heading">
                      {TIKTOK_ACCOUNT.name}
                    </h3>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                      {TIKTOK_ACCOUNT.handle}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-cyan-300">
                      {TIKTOK_ACCOUNT.followers}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                      {TIKTOK_ACCOUNT.likes}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-300 mt-2 max-w-2xl leading-relaxed">
                    {TIKTOK_ACCOUNT.bio}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={TIKTOK_ACCOUNT.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-heading font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
                >
                  <TikTokIcon className="w-4 h-4" />
                  <span>Follow @togetherwecancyclingug</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* TikTok Reels Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {tiktokReels.map((reel) => (
                <div
                  key={reel.id}
                  className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden hover:border-cyan-500/50 transition-all group flex flex-col justify-between"
                >
                  <div className="relative aspect-[9/16] overflow-hidden bg-zinc-950">
                    <img
                      src={reel.thumbnail}
                      alt={reel.caption}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                    {/* Play Video / Preview Button Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => setActiveTikTokModal(reel)}
                        className="w-14 h-14 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black flex items-center justify-center shadow-xl shadow-cyan-500/50 transform scale-90 group-hover:scale-100 transition-all cursor-pointer"
                        title="Preview TikTok Video"
                        aria-label="Preview TikTok video"
                      >
                        <Play className="w-6 h-6 ml-0.5 fill-current" />
                      </button>
                    </div>

                    <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-mono px-2 py-0.5 rounded border border-zinc-800 flex items-center gap-1 z-10">
                      <TikTokIcon className="w-3 h-3 text-cyan-400" />
                      <span>{reel.views}</span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 space-y-2 z-10">
                      <p className="text-xs text-white font-medium line-clamp-3 leading-snug">
                        {reel.caption}
                      </p>
                      <div className="text-[10px] text-zinc-400 font-mono flex items-center justify-between pt-1 border-t border-white/10">
                        <span className="flex items-center gap-1 text-cyan-300">
                          <Heart className="w-3 h-3 fill-current" />
                          {reel.likes}
                        </span>
                        <span className="truncate max-w-[120px] text-zinc-300">{reel.audioTrack}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => setActiveTikTokModal(reel)}
                      className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Preview Video</span>
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => copyToClipboard(reel.videoUrl || reel.url || '', reel.id)}
                        className="text-zinc-400 hover:text-white p-1 rounded hover:bg-zinc-800 transition-colors cursor-pointer"
                        title="Copy TikTok Link"
                      >
                        {copiedLink === reel.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                      </button>
                      <a
                        href={reel.videoUrl || reel.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-zinc-400 hover:text-cyan-300 text-xs font-semibold flex items-center gap-1 hover:underline"
                      >
                        <span>TikTok</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. INSTAGRAM SECTION */}
        {/* ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'instagram') && (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-pink-950/30 via-zinc-900 to-zinc-950 border border-pink-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-pink-600/30">
                  <Instagram className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl sm:text-2xl font-black text-white font-heading">
                      {INSTAGRAM_ACCOUNT.name}
                    </h3>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-pink-500/20 text-pink-400 border border-pink-500/40">
                      {INSTAGRAM_ACCOUNT.handle}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-pink-300">
                      {INSTAGRAM_ACCOUNT.followers}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-300 mt-2 max-w-2xl leading-relaxed">
                    {INSTAGRAM_ACCOUNT.bio}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={INSTAGRAM_ACCOUNT.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-heading font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-pink-600/20 cursor-pointer"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Follow on Instagram</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Instagram Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {instagramPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden hover:border-pink-500/50 transition-all group flex flex-col justify-between"
                >
                  <div className="relative aspect-square overflow-hidden bg-zinc-950">
                    <img
                      src={post.imageUrl}
                      alt={post.caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />

                    <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-md text-white p-1.5 rounded-full">
                      <Instagram className="w-3.5 h-3.5 text-pink-400" />
                    </div>

                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs text-white font-mono bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-zinc-800">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-pink-400 fill-pink-400" />
                        {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3 text-amber-400" />
                        {post.comments}
                      </span>
                      <span className="text-[10px] text-zinc-400">{post.date}</span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1">
                        {post.location}
                      </div>
                      <p className="text-xs text-zinc-300 line-clamp-3 leading-relaxed">
                        {post.caption}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-zinc-400 font-mono">
                        {post.tag}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => copyToClipboard(post.postUrl, post.id)}
                          className="text-zinc-400 hover:text-white p-1 rounded hover:bg-zinc-800 transition-colors cursor-pointer"
                          title="Copy Instagram Link"
                        >
                          {copiedLink === post.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                        </button>
                        <a
                          href={post.postUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-pink-400 hover:text-pink-300 text-xs font-semibold flex items-center gap-1 hover:underline"
                        >
                          <span>View Post</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: Uploaded Device Media Player & Lightbox */}
      {/* ========================================================================= */}
      {activeUploadedMediaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/95 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-zinc-950 border-2 border-amber-500/80 max-w-4xl w-full rounded-3xl overflow-hidden shadow-2xl relative text-zinc-100 flex flex-col max-h-[92vh]">
            <button
              onClick={() => setActiveUploadedMediaModal(null)}
              className="absolute top-4 right-4 z-20 p-2 text-zinc-400 hover:text-white rounded-full bg-black/80 hover:bg-black cursor-pointer shadow-lg transition-colors"
              aria-label="Close media modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Media Player / Image Viewer Container */}
            <div className="relative bg-black flex items-center justify-center max-h-[60vh] overflow-hidden">
              {(() => {
                const videoSource =
                  activeUploadedMediaModal.mediaUrl ||
                  activeUploadedMediaModal.videoUrl ||
                  activeUploadedMediaModal.url;
                const ytId =
                  activeUploadedMediaModal.youtubeId ||
                  extractYouTubeId(videoSource);

                if (ytId) {
                  return (
                    <div className="w-full aspect-video max-h-[60vh]">
                      <iframe
                        src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
                        title={activeUploadedMediaModal.title || 'YouTube Video'}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                  );
                }

                if (activeUploadedMediaModal.type === 'video' || activeUploadedMediaModal.videoUrl) {
                  return (
                    <video
                      src={videoSource}
                      controls
                      autoPlay
                      playsInline
                      poster={activeUploadedMediaModal.thumbnail}
                      className="max-h-[60vh] w-full object-contain mx-auto"
                    />
                  );
                }

                return (
                  <img
                    src={
                      activeUploadedMediaModal.imageUrl ||
                      activeUploadedMediaModal.thumbnail ||
                      activeUploadedMediaModal.mediaUrl
                    }
                    alt={activeUploadedMediaModal.title || 'Media Photo'}
                    referrerPolicy="no-referrer"
                    className="max-h-[60vh] w-auto object-contain mx-auto"
                  />
                );
              })()}
            </div>

            {/* Details Footer */}
            <div className="p-6 space-y-4 bg-zinc-900 overflow-y-auto">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase font-heading">
                      {activeUploadedMediaModal.category || 'TWC Media'}
                    </span>
                    <span className="text-xs font-mono text-zinc-400">
                      {activeUploadedMediaModal.type === 'video' ? 'Race Video' : 'Photo Gallery'}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-white font-heading mt-2">
                    {activeUploadedMediaModal.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  {(() => {
                    const videoSource =
                      activeUploadedMediaModal.mediaUrl ||
                      activeUploadedMediaModal.videoUrl ||
                      activeUploadedMediaModal.url;
                    const ytId =
                      activeUploadedMediaModal.youtubeId ||
                      extractYouTubeId(videoSource);

                    if (ytId) {
                      return (
                        <a
                          href={`https://www.youtube.com/watch?v=${ytId}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors shadow-lg shadow-red-600/20"
                        >
                          <Youtube className="w-3.5 h-3.5" />
                          <span>Watch on YouTube</span>
                          <ExternalLink className="w-3 h-3 ml-0.5" />
                        </a>
                      );
                    }
                    return null;
                  })()}

                  <button
                    onClick={() => setActiveUploadedMediaModal(null)}
                    className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {activeUploadedMediaModal.caption || activeUploadedMediaModal.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 font-mono pt-2 border-t border-zinc-800/80">
                {activeUploadedMediaModal.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    {activeUploadedMediaModal.location}
                  </span>
                )}
                {activeUploadedMediaModal.date && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    {activeUploadedMediaModal.date}
                  </span>
                )}
                {activeUploadedMediaModal.author && (
                  <span>By {activeUploadedMediaModal.author}</span>
                )}
                {activeUploadedMediaModal.fileName && (
                  <span className="text-zinc-500">File: {activeUploadedMediaModal.fileName}</span>
                )}
                {activeUploadedMediaModal.fileSize && (
                  <span className="text-zinc-500">({activeUploadedMediaModal.fileSize})</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: YouTube Video Player Modal */}
      {/* ========================================================================= */}
      {activeVideoModal && (() => {
        const activeVideoLink = getYouTubeLink(activeVideoModal);
        const ytId = extractYouTubeId(activeVideoLink) || activeVideoModal.youtubeId;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-zinc-900 border-2 border-red-500/80 max-w-3xl w-full rounded-3xl overflow-hidden shadow-2xl relative text-zinc-100">
              <button
                onClick={() => setActiveVideoModal(null)}
                className="absolute top-4 right-4 z-20 p-2 text-zinc-400 hover:text-white rounded-full bg-black/70 cursor-pointer shadow-lg hover:bg-black"
                aria-label="Close video player"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative aspect-video bg-black">
                {ytId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
                    title={activeVideoModal.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <img
                      src={activeVideoModal.thumbnail}
                      alt={activeVideoModal.title}
                      className="w-full h-full object-cover opacity-70"
                    />
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-6 text-center space-y-4">
                      <a
                        href={activeVideoLink}
                        target="_blank"
                        rel="noreferrer"
                        className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Play className="w-8 h-8 ml-1 fill-current" />
                      </a>
                      <div className="max-w-lg">
                        <h4 className="text-base sm:text-xl font-bold text-white font-heading">
                          {activeVideoModal.title}
                        </h4>
                        <p className="text-xs text-zinc-300 mt-1">
                          Click to launch content video link
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div>
                    <span className="text-xs font-bold text-amber-400 uppercase font-heading">
                      {activeVideoModal.category}
                    </span>
                    <div className="text-xs text-zinc-400 mt-0.5">
                      Link: <span className="font-mono text-zinc-300 truncate max-w-xs inline-block align-bottom">{activeVideoLink}</span>
                    </div>
                  </div>
                  <div className="text-xs font-mono text-zinc-400">
                    {activeVideoModal.views} • {activeVideoModal.duration}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {activeVideoModal.description}
                </p>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <a
                    href={activeVideoLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold font-heading uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Youtube className="w-4 h-4" />
                    <span>Open Video in YouTube / Browser</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={() => copyToClipboard(activeVideoLink, 'modal-link')}
                    className="px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold font-heading transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {copiedLink === 'modal-link' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                    <span>{copiedLink === 'modal-link' ? 'Copied' : 'Copy Link'}</span>
                  </button>

                  <button
                    onClick={() => setActiveVideoModal(null)}
                    className="px-5 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold font-heading transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* MODAL 3: TikTok Video Player & Live Preview Modal */}
      {/* ========================================================================= */}
      {activeTikTokModal && (() => {
        const rawUrl = activeTikTokModal.videoUrl || activeTikTokModal.url || '';
        const ttInfo = extractTikTokInfo(rawUrl);
        const videoId = activeTikTokModal.embedId || ttInfo.videoId;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/95 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-zinc-950 border-2 border-cyan-500/80 max-w-md w-full rounded-3xl overflow-hidden shadow-2xl relative text-zinc-100 flex flex-col max-h-[92vh]">
              <button
                onClick={() => setActiveTikTokModal(null)}
                className="absolute top-4 right-4 z-20 p-2 text-zinc-400 hover:text-white rounded-full bg-black/80 hover:bg-black cursor-pointer shadow-lg transition-colors"
                aria-label="Close TikTok player"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Player / Embedded View from the provided video link */}
              <div className="relative aspect-[9/16] bg-black max-h-[62vh] flex items-center justify-center overflow-hidden">
                {videoId ? (
                  <iframe
                    src={`https://www.tiktok.com/embed/v2/${videoId}`}
                    title={activeTikTokModal.caption || 'TikTok Video Player'}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="relative w-full h-full flex flex-col items-center justify-center">
                    <img
                      src={activeTikTokModal.thumbnail}
                      alt={activeTikTokModal.caption}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-6 text-center space-y-4">
                      <a
                        href={rawUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-16 h-16 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black flex items-center justify-center shadow-xl hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Play className="w-8 h-8 ml-1 fill-current" />
                      </a>
                      <div>
                        <h4 className="text-base font-bold text-white font-heading">
                          Watch on TikTok
                        </h4>
                        <p className="text-xs text-zinc-300 mt-1">
                          Click to play full reel directly on TikTok
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Details and Links */}
              <div className="p-5 space-y-3 bg-zinc-900 border-t border-zinc-800">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase font-heading">
                      {activeTikTokModal.category || 'TikTok Reel'}
                    </span>
                    {videoId && (
                      <span className="text-[10px] font-mono text-zinc-400">ID: {videoId}</span>
                    )}
                  </div>
                  <a
                    href={rawUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition-colors shadow-md"
                  >
                    <span>Open in TikTok</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <p className="text-xs text-zinc-200 leading-relaxed line-clamp-3">
                  {activeTikTokModal.caption || activeTikTokModal.title}
                </p>

                <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pt-1 border-t border-zinc-800/80">
                  <span className="flex items-center gap-1 text-cyan-300">
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    {activeTikTokModal.likes} likes
                  </span>
                  <span className="truncate max-w-[150px] text-zinc-300">
                    {activeTikTokModal.audioTrack || 'Original Sound'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </section>
  );
};
