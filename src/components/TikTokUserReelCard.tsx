import React, { useState, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  ExternalLink,
  Share2,
  Check,
  Heart,
  Sparkles,
  RefreshCw,
  Maximize2,
} from 'lucide-react';
import {
  TikTokItem,
  extractTikTokInfo,
  fetchTikTokMediaPreview,
  TikTokPreviewData,
} from '../data/cyclingData';

// Custom TikTok icon
const TikTokIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.26 6.26 0 0 0 1.87-4.49V8.62a8.28 8.28 0 0 0 4.9 1.58V6.75a4.85 4.85 0 0 1-1-.06Z" />
  </svg>
);

export interface TikTokUserReelCardProps {
  reel: TikTokItem;
  onOpenModal: (reel: TikTokItem) => void;
  onUpdateReel?: (updated: TikTokItem) => void;
  copiedLinkId: string | null;
  onCopyLink: (text: string, id: string) => void;
}

export const TikTokUserReelCard: React.FC<TikTokUserReelCardProps> = ({
  reel,
  onOpenModal,
  onUpdateReel,
  copiedLinkId,
  onCopyLink,
}) => {
  const [previewData, setPreviewData] = useState<TikTokPreviewData | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [inlinePlaying, setInlinePlaying] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'synced' | 'failed'>('idle');

  const rawUrl = (reel.videoUrl || reel.url || reel.mediaUrl || '').trim();
  const ttInfo = extractTikTokInfo(rawUrl);
  const effectiveVideoId = previewData?.videoId || reel.embedId || ttInfo.videoId;

  // Auto-resolve live preview from the video link provided
  const syncFromVideoLink = useCallback(async (force = false) => {
    if (!rawUrl || !ttInfo.isTikTok) return;

    // If we already have a synced non-unsplash thumbnail and not forcing, skip
    const isPlaceholderThumbnail = !reel.thumbnail || reel.thumbnail.includes('unsplash');
    if (!force && !isPlaceholderThumbnail && previewData?.thumbnailUrl) {
      return;
    }

    setIsLoadingPreview(true);
    try {
      const data = await fetchTikTokMediaPreview(rawUrl);
      if (data && (data.thumbnailUrl || data.title || data.videoId)) {
        setPreviewData(data);
        setSyncStatus('synced');

        // Propagate update to parent state & persistence if new metadata was retrieved
        if (
          onUpdateReel &&
          data.thumbnailUrl &&
          (data.thumbnailUrl !== reel.thumbnail || data.title !== reel.caption || data.videoId !== reel.embedId)
        ) {
          onUpdateReel({
            ...reel,
            thumbnail: data.thumbnailUrl,
            caption: data.title || reel.caption,
            title: data.title || reel.title || reel.caption,
            embedId: data.videoId || reel.embedId,
          });
        }
      } else {
        setSyncStatus('failed');
      }
    } catch {
      setSyncStatus('failed');
    } finally {
      setIsLoadingPreview(false);
    }
  }, [rawUrl, ttInfo.isTikTok, reel, previewData?.thumbnailUrl, onUpdateReel]);

  // Initial and reactive sync whenever the video link changes
  useEffect(() => {
    syncFromVideoLink(false);
  }, [rawUrl]);

  // Effective display thumbnail (prefers live fetched cover from link)
  const displayThumbnail =
    previewData?.thumbnailUrl ||
    (reel.thumbnail && !reel.thumbnail.includes('unsplash') ? reel.thumbnail : null) ||
    previewData?.thumbnailUrl ||
    reel.thumbnail ||
    'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=600&auto=format&fit=crop';

  const displayTitle = previewData?.title || reel.caption || reel.title || 'TikTok Reel';
  const authorHandle = previewData?.authorUniqueId
    ? `@${previewData.authorUniqueId}`
    : ttInfo.username
    ? `@${ttInfo.username}`
    : '@togetherwecancyclingug';

  return (
    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden hover:border-cyan-500/60 transition-all group flex flex-col justify-between shadow-xl">
      {/* 9:16 Vertical Video / Cover Container */}
      <div className="relative aspect-[9/16] overflow-hidden bg-black flex items-center justify-center">
        {inlinePlaying && effectiveVideoId ? (
          // Inline Live Video Player Sourced Directly from the TikTok link
          <div className="relative w-full h-full bg-black">
            <iframe
              src={`https://www.tiktok.com/embed/v2/${effectiveVideoId}`}
              title={displayTitle}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            {/* Overlay button to collapse back to preview cover */}
            <button
              type="button"
              onClick={() => setInlinePlaying(false)}
              className="absolute top-2 right-2 z-20 px-2.5 py-1 rounded-full bg-black/80 hover:bg-black text-white text-[10px] font-bold font-mono uppercase tracking-wider backdrop-blur-md border border-white/20 shadow-lg cursor-pointer"
            >
              Close Player
            </button>
          </div>
        ) : (
          // Video Cover Thumbnail Sourced Directly from Video Link
          <>
            <img
              src={displayThumbnail}
              alt={displayTitle}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />

            {/* Top Badges & Video Link Indicator */}
            <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 z-10">
              <div className="flex items-center gap-1.5">
                <div className="bg-black/70 backdrop-blur-md text-white text-[10px] font-mono px-2 py-0.5 rounded border border-zinc-800 flex items-center gap-1">
                  <TikTokIcon className="w-3 h-3 text-cyan-400" />
                  <span>{reel.views}</span>
                </div>

                {/* Sourced from link badge */}
                {(previewData?.thumbnailUrl || syncStatus === 'synced') && (
                  <span
                    className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 backdrop-blur-md flex items-center gap-0.5"
                    title="Live preview confirmed from video link"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span>Live Link Preview</span>
                  </span>
                )}
              </div>

              {/* Quick Sync Button */}
              <button
                type="button"
                onClick={() => syncFromVideoLink(true)}
                disabled={isLoadingPreview}
                className="p-1 rounded-md bg-black/70 hover:bg-zinc-800 text-zinc-300 hover:text-cyan-400 border border-zinc-700/80 transition-colors cursor-pointer"
                title="Refresh preview directly from TikTok video link"
                aria-label="Refresh video preview"
              >
                <RefreshCw className={`w-3 h-3 ${isLoadingPreview ? 'animate-spin text-cyan-400' : ''}`} />
              </button>
            </div>

            {/* Hover overlay with dual actions: Play Inline or Expand Modal */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
              <div className="flex items-center gap-3">
                {effectiveVideoId && (
                  <button
                    type="button"
                    onClick={() => setInlinePlaying(true)}
                    className="w-12 h-12 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black flex items-center justify-center shadow-xl shadow-cyan-500/50 transform scale-90 group-hover:scale-100 transition-all cursor-pointer"
                    title="Play Video Inline"
                    aria-label="Play video inline"
                  >
                    <Play className="w-5 h-5 ml-0.5 fill-current" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onOpenModal({ ...reel, thumbnail: displayThumbnail, caption: displayTitle, embedId: effectiveVideoId })}
                  className="w-10 h-10 rounded-full bg-zinc-900/90 hover:bg-black text-white border border-white/20 flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-all cursor-pointer"
                  title="Expand to Full Player"
                  aria-label="Expand player modal"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
              <span className="text-[11px] font-bold text-white tracking-wide bg-black/80 px-2.5 py-0.5 rounded-full border border-white/10 font-heading">
                {effectiveVideoId ? 'Play Reel' : 'Watch Reel'}
              </span>
            </div>

            {/* Caption & Metadata Overlay at Bottom */}
            <div className="absolute bottom-3 left-3 right-3 space-y-2 z-10 pointer-events-none">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-cyan-300 font-heading">
                <span>{authorHandle}</span>
              </div>
              <p className="text-xs text-white font-medium line-clamp-3 leading-snug drop-shadow-sm">
                {displayTitle}
              </p>
              <div className="text-[10px] text-zinc-300 font-mono flex items-center justify-between pt-1 border-t border-white/10">
                <span className="flex items-center gap-1 text-cyan-300">
                  <Heart className="w-3 h-3 fill-current" />
                  {reel.likes}
                </span>
                <span className="truncate max-w-[120px] text-zinc-400">
                  {reel.audioTrack || 'Original Sound'}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Card Action Footer */}
      <div className="p-3 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          {effectiveVideoId ? (
            <button
              type="button"
              onClick={() => setInlinePlaying(!inlinePlaying)}
              className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
            >
              {inlinePlaying ? (
                <>
                  <Pause className="w-3 h-3 fill-current" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 fill-current" />
                  <span>Preview Video</span>
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onOpenModal({ ...reel, thumbnail: displayThumbnail, caption: displayTitle })}
              className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Preview</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onOpenModal({ ...reel, thumbnail: displayThumbnail, caption: displayTitle, embedId: effectiveVideoId })}
            className="text-zinc-500 hover:text-zinc-200 p-0.5 rounded transition-colors"
            title="Open in Popup Modal"
          >
            <Maximize2 className="w-3 h-3" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onCopyLink(rawUrl, reel.id)}
            className="text-zinc-400 hover:text-white p-1 rounded hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Copy TikTok Link"
          >
            {copiedLinkId === reel.id ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Share2 className="w-3.5 h-3.5" />
            )}
          </button>
          <a
            href={rawUrl || 'https://www.tiktok.com/@togetherwecancyclingug'}
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
  );
};
