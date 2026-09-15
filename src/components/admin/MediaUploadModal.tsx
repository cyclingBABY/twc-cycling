import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Video as VideoIcon,
  CheckCircle2,
  AlertCircle,
  FileVideo,
  FileImage,
  Sparkles,
  Database,
  Loader2,
  Play,
  RotateCcw,
  Tag,
  MapPin,
  Calendar,
  Zap,
  Check,
} from 'lucide-react';
import { SocialMediaItem } from '../../types';
import { extractYouTubeId } from '../../data/cyclingData';
import {
  compressImageFile,
  captureVideoThumbnail,
  formatFileSize,
  formatDuration,
} from '../../services/mediaStorage';

interface MediaUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (item: SocialMediaItem, rawBlob?: Blob) => Promise<void> | void;
  onSaveMedia?: (item: SocialMediaItem, rawBlob?: Blob) => Promise<void> | void;
  editItem?: SocialMediaItem | null;
  defaultType?: 'photo' | 'video';
  autoSave?: boolean;
}

const PRESET_CATEGORIES = [
  'Race Highlights',
  'Memorial Race',
  'Lubiri Circuit',
  'Youth Training',
  'Academy Clinics',
  'Bike Tech & Mechanics',
  'Community Advocacy',
  'Press & Announcements',
];

export const MediaUploadModal: React.FC<MediaUploadModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onSaveMedia,
  editItem = null,
  defaultType = 'photo',
  autoSave = true,
}) => {
  const saveHandler = onSave || onSaveMedia;

  const [mediaType, setMediaType] = useState<'photo' | 'video'>(
    editItem?.type || defaultType
  );
  const [uploadSource, setUploadSource] = useState<'device' | 'url'>('device');

  // Form Fields
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('Race Highlights');
  const [location, setLocation] = useState('BMK House Katwe, Kampala');
  const [author, setAuthor] = useState('TWC Operations Desk');
  const [date, setDate] = useState(
    new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  );
  const [tag, setTag] = useState('TWC Cycling');
  const [externalUrl, setExternalUrl] = useState('');

  // Auto-Save State
  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState(autoSave);
  const [savedItemId, setSavedItemId] = useState<string | null>(null);
  const [isAutoSaved, setIsAutoSaved] = useState(false);
  const [autoCloseSeconds, setAutoCloseSeconds] = useState<number | null>(null);
  const autoCloseTimerRef = useRef<any>(null);

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [fileDetails, setFileDetails] = useState<{
    name: string;
    size: string;
    duration?: string;
  } | null>(null);

  // Processing & Submission States
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const cancelAutoClose = () => {
    if (autoCloseTimerRef.current) {
      clearInterval(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }
    setAutoCloseSeconds(null);
  };

  // Initialize form when editItem changes or modal opens
  useEffect(() => {
    cancelAutoClose();
    setIsAutoSaved(false);
    setSavedItemId(editItem?.id || null);

    if (editItem) {
      setTitle(editItem.title || '');
      setCaption(editItem.caption || editItem.description || '');
      setCategory(editItem.category || 'Race Highlights');
      setLocation(editItem.location || 'BMK House Katwe, Kampala');
      setAuthor(editItem.author || 'TWC Operations Desk');
      setDate(
        editItem.date ||
          editItem.uploadDate ||
          new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      );
      setTag(editItem.tag || 'TWC Cycling');
      setMediaType(editItem.type || (editItem.videoUrl ? 'video' : 'photo'));
      setThumbnailUrl(editItem.thumbnail || editItem.imageUrl || null);
      setPreviewUrl(editItem.mediaUrl || editItem.videoUrl || editItem.imageUrl || null);
      if (editItem.url && !editItem.mediaUrl?.startsWith('blob:') && !editItem.mediaUrl?.startsWith('data:')) {
        setExternalUrl(editItem.url || editItem.videoUrl || '');
        setUploadSource('url');
      } else {
        setUploadSource('device');
      }
      setSelectedFile(null);
      setFileDetails(
        editItem.fileName
          ? {
              name: editItem.fileName,
              size: editItem.fileSize || 'Stored in DB',
              duration: editItem.duration,
            }
          : null
      );
    } else {
      // Add mode defaults
      setTitle('');
      setCaption('');
      setCategory('Race Highlights');
      setLocation('BMK House Katwe, Kampala');
      setAuthor('TWC Operations Desk');
      setDate(
        new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      );
      setTag('TWC Cycling');
      setMediaType(defaultType);
      setUploadSource('device');
      setSelectedFile(null);
      setPreviewUrl(null);
      setThumbnailUrl(null);
      setFileDetails(null);
      setExternalUrl('');
    }
    setErrorMessage(null);
    setStatusMessage(null);

    return () => {
      cancelAutoClose();
    };
  }, [editItem, defaultType, isOpen]);

  if (!isOpen) return null;

  // Handle incoming file from input or drag-drop AND auto-save
  const handleProcessFile = async (file: File) => {
    cancelAutoClose();
    setErrorMessage(null);
    setIsProcessingFile(true);
    setIsAutoSaved(false);
    setStatusMessage(`Reading & processing ${file.name}...`);

    const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mov|m4v|mkv)$/i.test(file.name);
    const isImage = file.type.startsWith('image/') || /\.(jpe?g|png|webp|gif|svg)$/i.test(file.name);

    if (!isVideo && !isImage) {
      setErrorMessage('Unsupported file format. Please select an image (JPG, PNG, WebP) or video (MP4, WebM, MOV).');
      setIsProcessingFile(false);
      setStatusMessage(null);
      return;
    }

    try {
      setSelectedFile(file);

      // Clean file name to auto-title
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      const autoTitle = (title.trim() && title !== cleanName)
        ? title.trim()
        : cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
      setTitle(autoTitle);

      let processedPreviewUrl = '';
      let processedThumbnailUrl = '';
      const details = {
        name: file.name,
        size: formatFileSize(file.size),
        duration: undefined as string | undefined,
      };

      if (isVideo) {
        setMediaType('video');
        const objectUrl = URL.createObjectURL(file);
        processedPreviewUrl = objectUrl;
        setPreviewUrl(objectUrl);

        setStatusMessage('Extracting video thumbnail & duration...');
        const { thumbnailDataUrl, duration } = await captureVideoThumbnail(file, 1.0, 800);
        processedThumbnailUrl = thumbnailDataUrl;
        setThumbnailUrl(thumbnailDataUrl);
        details.duration = formatDuration(duration);
        setFileDetails(details);
      } else {
        setMediaType('photo');
        setStatusMessage('Optimizing photo for cloud storage...');
        const compressedDataUrl = await compressImageFile(file, 1280, 1280, 0.82);
        processedPreviewUrl = compressedDataUrl;
        processedThumbnailUrl = compressedDataUrl;
        setPreviewUrl(compressedDataUrl);
        setThumbnailUrl(compressedDataUrl);
        setFileDetails(details);
      }

      setIsProcessingFile(false);

      // AUTOMATIC SAVE:
      // Content uploaded must be saved automatically to Cloud Firestore!
      if (isAutoSaveEnabled && saveHandler) {
        setIsSaving(true);
        setStatusMessage('⚡ Auto-saving directly to Cloud Firestore database...');

        const itemId = editItem?.id || savedItemId || `media-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        setSavedItemId(itemId);

        const mediaPayload: SocialMediaItem = {
          id: itemId,
          title: autoTitle,
          caption: caption.trim() || `${isVideo ? 'Race Video' : 'Photo'} uploaded from device: ${file.name}`,
          description: caption.trim() || `${isVideo ? 'Race Video' : 'Photo'} uploaded from device: ${file.name}`,
          type: isVideo ? 'video' : 'photo',
          mediaType: 'upload',
          sourceType: 'local_upload',
          category: category || 'Race Highlights',
          location: location || 'BMK House Katwe, Kampala',
          author: author.trim() || 'TWC Operations Desk',
          date: date || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          tag: tag || 'TWC Cycling',
          thumbnail: processedThumbnailUrl,
          imageUrl: !isVideo ? processedThumbnailUrl : undefined,
          mediaUrl: processedPreviewUrl,
          videoUrl: isVideo ? processedPreviewUrl : undefined,
          fileName: file.name,
          fileSize: details.size,
          duration: details.duration,
          views: editItem?.views || '1 view',
          likes: editItem?.likes || '0',
        };

        await saveHandler(mediaPayload, file);
        setIsAutoSaved(true);
        setStatusMessage(`✓ "${autoTitle}" uploaded and saved automatically to Cloud Database!`);

        // Start 3-second auto-close countdown unless user decides to edit details
        let remaining = 3;
        setAutoCloseSeconds(remaining);
        autoCloseTimerRef.current = setInterval(() => {
          remaining -= 1;
          if (remaining <= 0) {
            cancelAutoClose();
            onClose();
          } else {
            setAutoCloseSeconds(remaining);
          }
        }, 1000);
      } else {
        setStatusMessage('File ready for database upload!');
      }
    } catch (err: any) {
      console.error('Error processing or auto-saving media file', err);
      setErrorMessage(err?.message || 'Could not process media file from device.');
    } finally {
      setIsProcessingFile(false);
      setIsSaving(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  // Submit Handler (Manual Save or Update Details)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    cancelAutoClose();
    setErrorMessage(null);

    if (!title.trim()) {
      setErrorMessage('Please provide a title for this media item.');
      return;
    }

    if (uploadSource === 'device' && !selectedFile && !previewUrl && !editItem && !savedItemId) {
      setErrorMessage('Please select a photo or video file from your device.');
      return;
    }

    if (uploadSource === 'url' && !externalUrl.trim()) {
      setErrorMessage('Please provide a valid video or image URL.');
      return;
    }

    if (!saveHandler) {
      setErrorMessage('Database connection not available.');
      return;
    }

    setIsSaving(true);
    setStatusMessage('Saving media record to Cloud Firestore database...');

    try {
      const id = editItem?.id || savedItemId || `media-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

      let finalThumbnail = thumbnailUrl || editItem?.thumbnail || '';
      let finalMediaUrl = previewUrl || editItem?.mediaUrl || '';
      let finalVideoUrl = editItem?.videoUrl;

      if (uploadSource === 'url') {
        finalMediaUrl = externalUrl.trim();
        if (mediaType === 'video') {
          finalVideoUrl = externalUrl.trim();
        } else {
          finalThumbnail = externalUrl.trim();
        }
      } else if (mediaType === 'photo' && previewUrl?.startsWith('data:')) {
        finalThumbnail = previewUrl;
      }

      // Check if this media item is a YouTube video
      const candidateUrl = finalVideoUrl || finalMediaUrl || (uploadSource === 'url' ? externalUrl.trim() : '');
      const detectedYtId = extractYouTubeId(candidateUrl);

      if (detectedYtId) {
        finalVideoUrl = `https://www.youtube.com/watch?v=${detectedYtId}`;
        finalMediaUrl = `https://www.youtube.com/watch?v=${detectedYtId}`;
        if (!finalThumbnail || finalThumbnail.includes('unsplash') || finalThumbnail.includes('placeholder')) {
          finalThumbnail = `https://i.ytimg.com/vi/${detectedYtId}/hqdefault.jpg`;
        }
      }

      const mediaPayload: SocialMediaItem = {
        ...editItem,
        id,
        title: title.trim(),
        caption: caption.trim(),
        description: caption.trim(),
        type: detectedYtId ? 'video' : mediaType,
        mediaType: 'upload',
        sourceType: uploadSource === 'device' ? 'local_upload' : 'social_link',
        category,
        location,
        author: author.trim() || 'TWC Operations Desk',
        date,
        tag,
        thumbnail: finalThumbnail,
        imageUrl: (mediaType === 'photo' && !detectedYtId) ? finalThumbnail : undefined,
        mediaUrl: finalMediaUrl,
        videoUrl: (mediaType === 'video' || detectedYtId) ? (finalVideoUrl || finalMediaUrl) : undefined,
        url: finalMediaUrl,
        youtubeId: detectedYtId || editItem?.youtubeId || undefined,
        embedId: detectedYtId || editItem?.embedId || undefined,
        fileName: fileDetails?.name || selectedFile?.name || editItem?.fileName,
        fileSize: fileDetails?.size || editItem?.fileSize,
        duration: fileDetails?.duration || editItem?.duration,
        views: editItem?.views || '1 view',
        likes: editItem?.likes || '0',
      };

      await saveHandler(mediaPayload, selectedFile || undefined);

      setIsAutoSaved(true);
      setStatusMessage('✓ Saved to database successfully!');
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err: any) {
      console.error('Error saving media item:', err);
      setErrorMessage(err?.message || 'Failed to save media to database.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {mediaType === 'video' ? (
                <VideoIcon className="w-5 h-5" />
              ) : (
                <ImageIcon className="w-5 h-5" />
              )}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-heading text-white flex items-center gap-2">
                <span>{editItem ? 'Edit Media Record' : 'Upload Media to Cloud Vault'}</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <Database className="w-2.5 h-2.5" />
                  Firestore Sync
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Direct device upload for photos & videos • Saved to TWC cloud database
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-sm">
          {/* Auto-Save Status Bar */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                <Zap className="w-4 h-4 fill-amber-400/40" />
              </span>
              <div>
                <span className="font-bold text-amber-300 font-heading block">
                  Automatic Cloud Database Saving
                </span>
                <span className="text-[11px] text-zinc-400">
                  Uploaded files are saved immediately to Cloud Firestore upon selection
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsAutoSaveEnabled(!isAutoSaveEnabled)}
              className={`px-3 py-1 rounded-xl text-[11px] font-mono font-bold transition-all cursor-pointer ${
                isAutoSaveEnabled
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
              }`}
            >
              {isAutoSaveEnabled ? '⚡ Auto-Save Active' : 'Manual Save'}
            </button>
          </div>

          {/* Auto-Saved Success Banner */}
          {isAutoSaved && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-500/60 text-emerald-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg animate-in fade-in">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-emerald-300">
                    Saved Automatically to Firestore Database!
                  </p>
                  <p className="text-[11px] text-emerald-400/80">
                    {autoCloseSeconds !== null
                      ? `Closing in ${autoCloseSeconds}s (or edit details below)...`
                      : 'Live in your TWC Cloud Vault & Media Gallery.'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {autoCloseSeconds !== null && (
                  <button
                    type="button"
                    onClick={cancelAutoClose}
                    className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-[11px] font-bold border border-zinc-700 cursor-pointer"
                  >
                    Keep Editing
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    cancelAutoClose();
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-[11px] font-bold cursor-pointer transition-colors"
                >
                  Done / Close
                </button>
              </div>
            </div>
          )}

          {/* Status & Error Alerts */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {statusMessage && !isAutoSaved && (
            <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-800/80 text-emerald-200 text-xs flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Toggle 1: Media Type (Photo vs Video) */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-900 rounded-2xl border border-zinc-800">
            <button
              type="button"
              onClick={() => {
                setMediaType('photo');
                if (!editItem) {
                  setPreviewUrl(null);
                  setSelectedFile(null);
                  setFileDetails(null);
                }
              }}
              className={`py-2 px-3 rounded-xl font-heading font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                mediaType === 'photo'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Photo (Image)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMediaType('video');
                if (!editItem) {
                  setPreviewUrl(null);
                  setSelectedFile(null);
                  setFileDetails(null);
                }
              }}
              className={`py-2 px-3 rounded-xl font-heading font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                mediaType === 'video'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <VideoIcon className="w-4 h-4" />
              <span>Video (Clip / Reel)</span>
            </button>
          </div>

          {/* Toggle 2: Source Type (Upload from PC/Device vs Web Link) */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
              Source Location:
            </span>
            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => setUploadSource('device')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  uploadSource === 'device'
                    ? 'bg-zinc-800 text-amber-400 border border-amber-500/40'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Upload from PC / Device
              </button>
              <button
                type="button"
                onClick={() => setUploadSource('url')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  uploadSource === 'url'
                    ? 'bg-zinc-800 text-amber-400 border border-amber-500/40'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Web / Cloud URL
              </button>
            </div>
          </div>

          {/* Device Upload Drag & Drop Area */}
          {uploadSource === 'device' ? (
            <div className="space-y-3">
              <div
                ref={dropZoneRef}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer relative overflow-hidden group ${
                  previewUrl
                    ? 'border-emerald-500/50 bg-emerald-950/10 hover:border-emerald-400'
                    : 'border-zinc-700 bg-zinc-900/60 hover:border-amber-500/70 hover:bg-zinc-900'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={mediaType === 'video' ? 'video/*' : 'image/*'}
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                {isProcessingFile ? (
                  <div className="py-6 flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
                    <p className="text-xs text-zinc-300 font-mono">
                      Reading & optimizing media from device...
                    </p>
                  </div>
                ) : previewUrl ? (
                  <div className="w-full flex flex-col items-center gap-4">
                    {/* Media Preview Box */}
                    <div className="max-h-56 max-w-full rounded-xl overflow-hidden border border-zinc-700 bg-zinc-950 relative shadow-inner">
                      {mediaType === 'video' ? (
                        <video
                          src={previewUrl}
                          controls
                          playsInline
                          poster={thumbnailUrl || undefined}
                          className="max-h-56 w-auto object-contain mx-auto"
                        />
                      ) : (
                        <img
                          src={previewUrl}
                          alt="Preview"
                          referrerPolicy="no-referrer"
                          className="max-h-56 w-auto object-contain mx-auto"
                        />
                      )}
                    </div>

                    {/* File Meta Pill */}
                    <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
                      <span className="px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-200 border border-zinc-700 flex items-center gap-1.5">
                        {mediaType === 'video' ? (
                          <FileVideo className="w-3.5 h-3.5 text-amber-400" />
                        ) : (
                          <FileImage className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                        {fileDetails?.name || 'Device File Loaded'}
                      </span>
                      {fileDetails?.size && (
                        <span className="px-2 py-1 rounded-md bg-zinc-800/80 text-zinc-400 border border-zinc-700">
                          {fileDetails.size}
                        </span>
                      )}
                      {fileDetails?.duration && (
                        <span className="px-2 py-1 rounded-md bg-zinc-800/80 text-zinc-400 border border-zinc-700">
                          {fileDetails.duration}
                        </span>
                      )}
                      <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        Ready for DB
                      </span>
                    </div>

                    <p className="text-[11px] text-zinc-400 group-hover:text-amber-300 transition-colors">
                      Click or drag a new file here to replace this {mediaType}.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-zinc-700 group-hover:border-amber-500 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-all">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white mb-1">
                        Click to choose a {mediaType} or drag & drop from your PC/device
                      </p>
                      <p className="text-xs text-zinc-400 font-mono">
                        {mediaType === 'video'
                          ? 'Supported: MP4, WebM, MOV, M4V (Auto-thumbnail generated)'
                          : 'Supported: JPG, PNG, WebP, GIF (Auto-compressed for database)'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* External URL Input Area */
            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-300 font-mono">
                {mediaType === 'video' ? 'Video URL / Stream Link (YouTube, Vimeo, or MP4)' : 'Image URL'}
              </label>
              <input
                type="url"
                value={externalUrl}
                onChange={(e) => {
                  const val = e.target.value;
                  setExternalUrl(val);
                  setPreviewUrl(val);
                  const parsedYt = extractYouTubeId(val);
                  if (parsedYt) {
                    setMediaType('video');
                    if (!thumbnailUrl || thumbnailUrl.includes('unsplash') || thumbnailUrl.includes('placeholder')) {
                      setThumbnailUrl(`https://i.ytimg.com/vi/${parsedYt}/hqdefault.jpg`);
                    }
                  }
                }}
                placeholder={
                  mediaType === 'video'
                    ? 'https://www.youtube.com/watch?v=... or https://youtu.be/...'
                    : 'https://images.unsplash.com/photo-example.jpg'
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-amber-500 font-mono text-xs"
              />
              {extractYouTubeId(externalUrl) && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>YouTube Video Detected (ID: <strong>{extractYouTubeId(externalUrl)}</strong>). Cover auto-synced!</span>
                </div>
              )}
            </div>
          )}

          {/* Form Fields: Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-bold text-zinc-300 font-mono">
                Title / Headline *
              </label>
              <input
                type="text"
                required
                value={title}
                onFocus={cancelAutoClose}
                onChange={(e) => {
                  cancelAutoClose();
                  setTitle(e.target.value);
                }}
                placeholder="e.g. Irene Gleeson Memorial Bicycle Race - Kitgum Finish"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-amber-500 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-zinc-300 font-mono flex items-center gap-1.5">
                <Tag className="w-3 h-3 text-amber-400" />
                Category
              </label>
              <select
                value={category}
                onFocus={cancelAutoClose}
                onChange={(e) => {
                  cancelAutoClose();
                  setCategory(e.target.value);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-amber-500 text-xs"
              >
                {PRESET_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-zinc-300 font-mono flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-amber-400" />
                Location
              </label>
              <input
                type="text"
                value={location}
                onFocus={cancelAutoClose}
                onChange={(e) => {
                  cancelAutoClose();
                  setLocation(e.target.value);
                }}
                placeholder="e.g. Lubiri Palace Circuit, Mengo"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-amber-500 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-zinc-300 font-mono flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-amber-400" />
                Date
              </label>
              <input
                type="text"
                value={date}
                onFocus={cancelAutoClose}
                onChange={(e) => {
                  cancelAutoClose();
                  setDate(e.target.value);
                }}
                placeholder="e.g. 14 Sep 2026"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-amber-500 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-zinc-300 font-mono">
                Author / Photo Credit
              </label>
              <input
                type="text"
                value={author}
                onFocus={cancelAutoClose}
                onChange={(e) => {
                  cancelAutoClose();
                  setAuthor(e.target.value);
                }}
                placeholder="e.g. Coach Solomon Ssebakaki"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-amber-500 text-xs"
              />
            </div>
          </div>

          {/* Caption / Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-zinc-300 font-mono">
              Caption / Context Description
            </label>
            <textarea
              rows={3}
              value={caption}
              onFocus={cancelAutoClose}
              onChange={(e) => {
                cancelAutoClose();
                setCaption(e.target.value);
              }}
              placeholder="Describe the race stage, training drill, riders pictured, or event highlights..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-amber-500 text-xs"
            />
          </div>
        </form>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px]">
              {isAutoSaved ? 'Auto-Saved to Database' : 'Direct Firestore Persistence'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                cancelAutoClose();
                onClose();
              }}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 font-heading font-bold text-xs transition-all cursor-pointer"
            >
              {isAutoSaved ? 'Close' : 'Cancel'}
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSaving || isProcessingFile}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-heading font-extrabold text-xs shadow-lg shadow-amber-500/20 hover:scale-105 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving to Database...</span>
                </>
              ) : isAutoSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Update Saved Record</span>
                </>
              ) : (
                <>
                  <Database className="w-4 h-4" />
                  <span>{editItem ? 'Save Changes' : 'Upload & Save to DB'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
