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
import { CLUB_INFO, extractYouTubeId } from './data/cyclingData';
import { SocialMediaItem } from './types';
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
      const parsedId = extractYouTubeId(updatedItem.videoUrl || '');
      const itemToSave = {
        ...updatedItem,
        id: updatedItem.id,
        title: updatedItem.title || 'TWC Race Video',
        videoUrl: updatedItem.videoUrl || '',
        youtubeId: parsedId || updatedItem.youtubeId || 'dQw4w9WgXcQ',
        category: updatedItem.category || 'Race Highlights',
        duration: updatedItem.duration || '10:00',
        views: updatedItem.views || '1.2K views',
        uploadDate: updatedItem.uploadDate || 'Recent',
        thumbnail:
          updatedItem.thumbnail ||
          (parsedId ? `https://img.youtube.com/vi/${parsedId}/hqdefault.jpg` : 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800&auto=format&fit=crop'),
        channelId: CLUB_INFO.socialLinks.youtube,
      };
      updateYouTubeVideo(itemToSave as any);
    } else if (platform === 'tiktok') {
      updateTikTokReel(updatedItem as any);
    } else if (platform === 'instagram') {
      updateInstagramPost(updatedItem as any);
    }

    academyAdmin.logAction(
      'cms',
      'Updated Social Media Link',
      `Saved updated ${platform.toUpperCase()} URL link: ${updatedItem.videoUrl || updatedItem.postUrl}`
    );
  };

  const handleAddMediaItem = (
    platform: 'youtube' | 'tiktok' | 'instagram',
    item: SocialMediaItem
  ) => {
    if (platform === 'youtube') {
      addYouTubeVideo(item as any);
    } else if (platform === 'tiktok') {
      addTikTokReel(item as any);
    } else if (platform === 'instagram') {
      addInstagramPost(item as any);
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

        {/* Media & Social Hub (YouTube, TikTok, Instagram with dynamic state & code5 admin access) */}
        <SocialMediaHub
          youtubeVideos={youtubeVideos}
          tiktokReels={tiktokReels}
          instagramPosts={instagramPosts}
          onOpenAdmin={() => setIsAdminOpen(true)}
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
        }}
        onSaveMediaLink={handleSaveMediaLink}
        onAddMediaItem={handleAddMediaItem}
        onDeleteMediaItem={handleDeleteMediaItem}
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
