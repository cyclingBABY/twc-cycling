/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutMission } from './components/AboutMission';
import { EventsHub } from './components/EventsHub';
import { CommunityImpact } from './components/CommunityImpact';
import { SocialMediaHub } from './components/SocialMediaHub';
import { MembershipPortal } from './components/MembershipPortal';
import { Footer } from './components/Footer';
import { AdminPanel } from './components/AdminPanel';
import { useMediaData } from './hooks/useMediaData';
import { useAcademyAdminData } from './hooks/useAcademyAdminData';
import { CLUB_INFO, extractYouTubeId, extractTikTokInfo, extractInstagramInfo } from './data/cyclingData';
import { SocialMediaItem, TikTokItem, InstagramItem } from './types';
import { Phone, MessageSquare, Flag, Lock } from 'lucide-react';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Elite Category');
  const [selectedEvent, setSelectedEvent] = useState<string>(
    'Inaugural Reconciliatory Cycling Race (Lubiri Ring Road)'
  );
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Persistent Media Data Hook
  const {
    youtubeVideos,
    tiktokReels,
    instagramPosts,
    uploadedMedia,
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
  } = useMediaData();

  // Centralized Academy Operations Data Hook
  const academyAdmin = useAcademyAdminData();

  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRegisterCategory = (categoryName: string, eventTitle?: string) => {
    setSelectedCategory(categoryName);
    if (eventTitle) {
      setSelectedEvent(eventTitle);
    }
    handleNavigate('registration');
  };

  // Bridge Media Edit Links so they save immediately and update both UI and Audit Log
  const handleSaveMediaLink = (
    platform: 'youtube' | 'tiktok' | 'instagram',
    _index: number,
    updatedItem: SocialMediaItem
  ) => {
    if (platform === 'youtube') {
      const cleanUrl = (updatedItem.videoUrl || updatedItem.url || updatedItem.mediaUrl || '').trim();
      const parsedId = extractYouTubeId(cleanUrl) || updatedItem.youtubeId || updatedItem.embedId;
      const finalVideoUrl = cleanUrl || (parsedId ? `https://www.youtube.com/watch?v=${parsedId}` : '');
      const finalThumbnail =
        (updatedItem.thumbnail && !updatedItem.thumbnail.includes('unsplash'))
          ? updatedItem.thumbnail
          : (parsedId ? `https://i.ytimg.com/vi/${parsedId}/hqdefault.jpg` : updatedItem.thumbnail);

      const itemToSave = {
        ...updatedItem,
        id: updatedItem.id,
        title: updatedItem.title || 'TWC Race Video',
        videoUrl: finalVideoUrl,
        url: finalVideoUrl,
        mediaUrl: finalVideoUrl,
        youtubeId: parsedId || '',
        embedId: parsedId || '',
        category: updatedItem.category || 'Race Highlights',
        duration: updatedItem.duration || '10:00',
        views: updatedItem.views || '1.2K views',
        uploadDate: updatedItem.uploadDate || 'Recent',
        thumbnail: finalThumbnail,
        channelId: CLUB_INFO.socialLinks.youtube,
      };
      updateYouTubeVideo(itemToSave as any);

      // If this item was also mirrored in uploadedMedia, update it there too
      if (uploadedMedia.some((u) => u.id === updatedItem.id || u.title === updatedItem.title)) {
        updateUploadedMedia({
          ...updatedItem,
          videoUrl: finalVideoUrl,
          mediaUrl: finalVideoUrl,
          url: finalVideoUrl,
          youtubeId: parsedId || undefined,
          thumbnail: finalThumbnail,
          type: 'video',
          mediaType: 'video',
        });
      }
    } else if (platform === 'tiktok') {
      const cleanUrl = (updatedItem.videoUrl || updatedItem.url || updatedItem.mediaUrl || '').trim();
      const ttInfo = extractTikTokInfo(cleanUrl);
      const finalUrl = ttInfo.cleanUrl || cleanUrl || CLUB_INFO.socialLinks.tiktok;
      const finalCaption =
        updatedItem.caption ||
        updatedItem.title ||
        (ttInfo.videoId ? `TWC Cycling TikTok Sprint Reel #${ttInfo.videoId.slice(-4)}` : 'TWC Uganda TikTok Reel');
      const finalThumbnail =
        updatedItem.thumbnail ||
        updatedItem.imageUrl ||
        'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=600&auto=format&fit=crop';

      const itemToSave: TikTokItem = {
        id: updatedItem.id || `tt-${Date.now()}`,
        caption: finalCaption,
        title: updatedItem.title || finalCaption,
        videoUrl: finalUrl,
        url: finalUrl,
        mediaUrl: finalUrl,
        thumbnail: finalThumbnail,
        embedId: ttInfo.videoId || updatedItem.embedId,
        category: updatedItem.category || 'TikTok Reel',
        tag: updatedItem.tag || (ttInfo.videoId ? 'Race Finish' : 'Peloton Action'),
        views: updatedItem.views || '24.5K',
        likes: updatedItem.likes || '3.8K',
        comments: (updatedItem as any).comments || '120',
        audioTrack: (updatedItem as any).audioTrack || 'Original Sound - TWC Cycling UG',
      };
      updateTikTokReel(itemToSave);

      if (uploadedMedia.some((u) => u.id === updatedItem.id || u.title === updatedItem.title)) {
        updateUploadedMedia({
          ...updatedItem,
          videoUrl: finalUrl,
          mediaUrl: finalUrl,
          url: finalUrl,
          thumbnail: finalThumbnail,
          type: 'video',
          mediaType: 'video',
        });
      }
    } else if (platform === 'instagram') {
      const cleanUrl = (updatedItem.postUrl || updatedItem.url || updatedItem.videoUrl || updatedItem.mediaUrl || '').trim();
      const igInfo = extractInstagramInfo(cleanUrl);
      const finalUrl = igInfo.cleanUrl || cleanUrl || CLUB_INFO.socialLinks.instagram;
      const finalCaption =
        updatedItem.caption ||
        updatedItem.title ||
        (igInfo.isReel ? 'TWC Instagram Reel Highlight' : 'TWC Cycling Instagram Update');
      const finalThumbnail =
        updatedItem.imageUrl ||
        updatedItem.thumbnail ||
        'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800&auto=format&fit=crop';

      const itemToSave: InstagramItem = {
        id: updatedItem.id || `ig-${Date.now()}`,
        caption: finalCaption,
        title: updatedItem.title || finalCaption,
        postUrl: finalUrl,
        url: finalUrl,
        videoUrl: igInfo.isReel ? finalUrl : undefined,
        mediaUrl: finalUrl,
        imageUrl: finalThumbnail,
        thumbnail: finalThumbnail,
        shortcode: igInfo.shortcode || (updatedItem as any).shortcode,
        embedId: igInfo.shortcode || updatedItem.embedId,
        category: updatedItem.category || (igInfo.isReel ? 'Instagram Reel' : 'Instagram Post'),
        tag: updatedItem.tag || (igInfo.isReel ? 'Reel Highlight' : 'Peloton Action'),
        date: updatedItem.date || 'RECENT',
        location: (updatedItem as any).location || 'Lubiri Ring Road Circuit, Mengo',
        likes: updatedItem.likes || '1.5K',
        comments: (updatedItem as any).comments || '64',
      };
      updateInstagramPost(itemToSave);

      if (uploadedMedia.some((u) => u.id === updatedItem.id || u.title === updatedItem.title)) {
        updateUploadedMedia({
          ...updatedItem,
          videoUrl: igInfo.isReel ? finalUrl : undefined,
          mediaUrl: finalUrl,
          url: finalUrl,
          imageUrl: finalThumbnail,
          thumbnail: finalThumbnail,
          type: igInfo.isReel ? 'video' : 'photo',
          mediaType: igInfo.isReel ? 'video' : 'photo',
        });
      }
    }

    academyAdmin.logAction(
      'cms',
      'Updated Social Media Link',
      `Saved updated ${platform.toUpperCase()} URL link: ${updatedItem.videoUrl || updatedItem.url || updatedItem.postUrl || ''}`
    );
  };

  const handleAddMediaItem = (
    platform: 'youtube' | 'tiktok' | 'instagram',
    item: SocialMediaItem
  ) => {
    if (platform === 'youtube') {
      const cleanUrl = (item.videoUrl || item.url || item.mediaUrl || '').trim();
      const parsedId = extractYouTubeId(cleanUrl) || item.youtubeId || item.embedId;
      const finalVideoUrl = cleanUrl || (parsedId ? `https://www.youtube.com/watch?v=${parsedId}` : '');
      const finalThumbnail =
        (item.thumbnail && !item.thumbnail.includes('unsplash'))
          ? item.thumbnail
          : (parsedId ? `https://i.ytimg.com/vi/${parsedId}/hqdefault.jpg` : item.thumbnail);

      const itemToAdd = {
        ...item,
        id: item.id || `yt-${Date.now()}`,
        title: item.title || 'TWC Race Video',
        videoUrl: finalVideoUrl,
        url: finalVideoUrl,
        mediaUrl: finalVideoUrl,
        youtubeId: parsedId || '',
        embedId: parsedId || '',
        category: item.category || 'Race Highlights',
        duration: item.duration || '10:00',
        views: item.views || '1.2K views',
        uploadDate: item.uploadDate || 'Recent',
        thumbnail: finalThumbnail,
        channelId: CLUB_INFO.socialLinks.youtube,
      };
      addYouTubeVideo(itemToAdd as any);
    } else if (platform === 'tiktok') {
      const cleanUrl = (item.videoUrl || item.url || item.mediaUrl || '').trim();
      const ttInfo = extractTikTokInfo(cleanUrl);
      const finalUrl = ttInfo.cleanUrl || cleanUrl || CLUB_INFO.socialLinks.tiktok;
      const finalCaption =
        item.caption ||
        item.title ||
        (ttInfo.videoId ? `TWC Cycling TikTok Sprint Reel #${ttInfo.videoId.slice(-4)}` : 'TWC Uganda TikTok Reel');
      const finalThumbnail =
        item.thumbnail ||
        item.imageUrl ||
        'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=600&auto=format&fit=crop';

      const itemToAdd: TikTokItem = {
        id: item.id || `tt-${Date.now()}`,
        caption: finalCaption,
        title: item.title || finalCaption,
        videoUrl: finalUrl,
        url: finalUrl,
        mediaUrl: finalUrl,
        thumbnail: finalThumbnail,
        embedId: ttInfo.videoId || item.embedId,
        category: item.category || 'TikTok Reel',
        tag: item.tag || (ttInfo.videoId ? 'Race Finish' : 'Peloton Action'),
        views: item.views || '15.2K',
        likes: item.likes || '2.1K',
        comments: (item as any).comments || '88',
        audioTrack: (item as any).audioTrack || 'Original Sound - TWC Cycling UG',
      };
      addTikTokReel(itemToAdd);
    } else if (platform === 'instagram') {
      const cleanUrl = (item.postUrl || item.url || item.videoUrl || item.mediaUrl || '').trim();
      const igInfo = extractInstagramInfo(cleanUrl);
      const finalUrl = igInfo.cleanUrl || cleanUrl || CLUB_INFO.socialLinks.instagram;
      const finalCaption =
        item.caption ||
        item.title ||
        (igInfo.isReel ? 'TWC Instagram Reel Highlight' : 'TWC Cycling Instagram Update');
      const finalThumbnail =
        item.imageUrl ||
        item.thumbnail ||
        'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800&auto=format&fit=crop';

      const itemToAdd: InstagramItem = {
        id: item.id || `ig-${Date.now()}`,
        caption: finalCaption,
        title: item.title || finalCaption,
        postUrl: finalUrl,
        url: finalUrl,
        videoUrl: igInfo.isReel ? finalUrl : undefined,
        mediaUrl: finalUrl,
        imageUrl: finalThumbnail,
        thumbnail: finalThumbnail,
        shortcode: igInfo.shortcode || (item as any).shortcode,
        embedId: igInfo.shortcode || item.embedId,
        category: item.category || (igInfo.isReel ? 'Instagram Reel' : 'Instagram Post'),
        tag: item.tag || (igInfo.isReel ? 'Reel Highlight' : 'Peloton Action'),
        date: item.date || 'RECENT',
        location: (item as any).location || 'Lubiri Ring Road Circuit, Mengo',
        likes: item.likes || '1.1K',
        comments: (item as any).comments || '42',
      };
      addInstagramPost(itemToAdd);
    }

    academyAdmin.logAction(
      'cms',
      'Added Social Media Post',
      `Added new ${platform} item: ${item.title || item.caption}`
    );
  };

  const handleDeleteMediaItem = (
    platform: 'youtube' | 'tiktok' | 'instagram',
    id: string
  ) => {
    if (platform === 'youtube') {
      deleteYouTubeVideo(id);
    } else if (platform === 'tiktok') {
      deleteTikTokReel(id);
    } else if (platform === 'instagram') {
      deleteInstagramPost(id);
    }

    academyAdmin.logAction(
      'cms',
      'Deleted Social Media Post',
      `Removed ${platform} item ID: ${id}`
    );
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-amber-500 selection:text-black">
      {/* Sticky Header Navigation */}
      <Navbar
        onNavigate={handleNavigate}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenRegisterModal={(category) => {
          if (category) setSelectedCategory(category);
          handleNavigate('registration');
        }}
      />

      {/* Hero Section */}
      <main className="flex-1">
        <Hero
          onRegisterClick={() => handleNavigate('events')}
          onJoinAcademyClick={() => handleNavigate('registration')}
          onViewCircuitClick={() => handleNavigate('circuit')}
        />

        {/* About Us / Our Mission Section */}
        <AboutMission
          onRegisterClick={() => handleNavigate('events')}
          onJoinClick={() => handleNavigate('registration')}
        />

        {/* Events & Race Registration Hub (Synced with Admin Panel Races and Leaderboards) */}
        <EventsHub
          onRegisterCategory={handleRegisterCategory}
          events={academyAdmin.events}
          leaderboard={academyAdmin.leaderboard}
        />

        {/* Community Impact & Advocacy Section */}
        <CommunityImpact />

        {/* Media & Social Hub (YouTube, TikTok, Instagram, and Team Vault Gallery) */}
        <SocialMediaHub
          youtubeVideos={youtubeVideos}
          tiktokReels={tiktokReels}
          instagramPosts={instagramPosts}
          uploadedMedia={uploadedMedia}
        />

        {/* Membership & Registration Portal Form (Directly syncs to Admin CRM & MoMo Queue) */}
        <MembershipPortal
          initialCategory={selectedCategory}
          initialEvent={selectedEvent}
          onRegisterAthlete={academyAdmin.registerRiderFromPublic}
        />
      </main>

      {/* Contact & Footer Section with code5 admin link */}
      <Footer
        onNavigate={handleNavigate}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Code5 Operational Admin Panel Modal (Protected with access code twc@code5) */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        // Admin Roles & Module 1-6 State Handlers
        adminRole={academyAdmin.adminRole}
        onChangeRole={academyAdmin.setAdminRole}
        events={academyAdmin.events}
        onAddEvent={academyAdmin.addEvent}
        onUpdateEvent={academyAdmin.updateEvent}
        onDeleteEvent={academyAdmin.deleteEvent}
        leaderboard={academyAdmin.leaderboard}
        onAddResult={academyAdmin.addResult}
        onDeleteResult={academyAdmin.deleteResult}
        riders={academyAdmin.riders}
        onAddRider={academyAdmin.addRider}
        onUpdateRider={academyAdmin.updateRider}
        onDeleteRider={academyAdmin.deleteRider}
        trainingSessions={academyAdmin.trainingSessions}
        onAddTrainingSession={academyAdmin.addTrainingSession}
        onDeleteTrainingSession={academyAdmin.deleteTrainingSession}
        transactions={academyAdmin.transactions}
        onVerifyPayment={academyAdmin.verifyPayment}
        onAddTransaction={academyAdmin.addTransaction}
        notices={academyAdmin.notices}
        onAddNotice={academyAdmin.addNotice}
        onUpdateNotice={academyAdmin.updateNotice}
        onDeleteNotice={academyAdmin.deleteNotice}
        sponsors={academyAdmin.sponsors}
        onAddSponsor={academyAdmin.addSponsor}
        onUpdateSponsor={academyAdmin.updateSponsor}
        onDeleteSponsor={academyAdmin.deleteSponsor}
        onToggleSponsor={academyAdmin.toggleSponsorActive}
        galleryPhotos={academyAdmin.galleryPhotos}
        onAddPhoto={academyAdmin.addGalleryPhoto}
        onUpdatePhoto={academyAdmin.updateGalleryPhoto}
        onDeletePhoto={academyAdmin.deleteGalleryPhoto}
        siteContent={academyAdmin.siteContent}
        onUpdateSiteContent={academyAdmin.updateSiteContent}
        auditLogs={academyAdmin.auditLogs}
        onResetAllAdminData={academyAdmin.resetAllAdminData}
        // Media links state and handlers
        mediaData={{
          youtube: youtubeVideos as any,
          tiktok: tiktokReels as any,
          instagram: instagramPosts as any,
          uploads: uploadedMedia,
        }}
        uploadedMedia={uploadedMedia}
        onAddUploadedMedia={async (item, blob) => {
          await addUploadedMedia(item, blob);
          academyAdmin.logAction('cms', 'Added Uploaded Media', `Added ${item.type || 'file'}: "${item.title}"`);
        }}
        onUpdateUploadedMedia={async (item, blob) => {
          await updateUploadedMedia(item, blob);
          academyAdmin.logAction('cms', 'Updated Uploaded Media', `Updated ${item.type || 'file'}: "${item.title}"`);
        }}
        onDeleteUploadedMedia={async (id) => {
          await deleteUploadedMedia(id);
          academyAdmin.logAction('cms', 'Deleted Uploaded Media', `Deleted media ID: ${id}`);
        }}
        onSaveMediaLink={handleSaveMediaLink}
        onAddMediaItem={handleAddMediaItem}
        onDeleteMediaItem={handleDeleteMediaItem}
        // Cloud Database State & Handlers
        dbStatus={academyAdmin.dbStatus}
        isSyncing={academyAdmin.isSyncing}
        lastSyncTime={academyAdmin.lastSyncTime}
        recentDbActions={academyAdmin.recentDbActions}
        onSyncAll={academyAdmin.syncAllToCloud}
        onSeedCloud={academyAdmin.seedCloudDatabase}
        onReloadCloud={academyAdmin.reloadFromCloud}
        onTestConnection={academyAdmin.testDbConnection}
      />

      {/* Floating Quick Action Widget for Mobile / Responsive */}
      <div className="fixed bottom-5 right-4 sm:right-6 z-40 flex flex-col items-end gap-2.5">
        <button
          onClick={() => setIsAdminOpen(true)}
          className="px-3.5 py-2 rounded-full bg-zinc-900/95 hover:bg-zinc-800 text-amber-300 hover:text-white border border-amber-500/60 shadow-xl shadow-black/80 transition-all hover:scale-105 flex items-center gap-2 cursor-pointer backdrop-blur-md text-xs font-mono font-bold"
          title="Open TWC Operations Desk (Passcode: twc@code5)"
          aria-label="TWC Operations Desk"
        >
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          <span>TWC Admin</span>
          {academyAdmin.transactions.filter((t) => t.status === 'Pending').length > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          )}
        </button>

        <a
          href={CLUB_INFO.socialLinks.whatsapp}
          target="_blank"
          rel="noreferrer"
          className="p-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-950/60 transition-transform hover:scale-110 flex items-center justify-center border border-emerald-400/40"
          aria-label="Chat with Manager Solo on WhatsApp"
        >
          <MessageSquare className="w-5 h-5" />
        </a>

        <a
          href={`tel:${CLUB_INFO.primaryPhone}`}
          className="px-3.5 py-2 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-amber-400 text-xs font-bold font-heading shadow-xl border border-zinc-700/80 backdrop-blur-md flex items-center gap-2 hover:scale-105 transition-all"
        >
          <Phone className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Manager Solo:</span>
          <span>{CLUB_INFO.primaryPhone}</span>
        </a>
      </div>
    </div>
  );
}
