import React, { useState, useEffect } from 'react';
import {
  AdminRole,
  CyclingEvent,
  LeaderboardResult,
  RiderProfile,
  TrainingSession,
  PaymentTransaction,
  NoticeItem,
  SponsorItem,
  GalleryPhotoItem,
  AuditLogEntry,
  SocialMediaItem,
  SiteContentSettings,
} from '../types';
import { AdminHeader } from './admin/AdminHeader';
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminEventsManagement } from './admin/AdminEventsManagement';
import { AdminRiderCRM } from './admin/AdminRiderCRM';
import { AdminFinancials } from './admin/AdminFinancials';
import { AdminCMS } from './admin/AdminCMS';
import { AdminSettingsSecurity } from './admin/AdminSettingsSecurity';
import { DatabaseSyncCenter } from './admin/DatabaseSyncCenter';
import { DatabaseActionRecord } from '../services/dbService';
import {
  LayoutDashboard,
  Calendar,
  Users,
  DollarSign,
  Globe,
  ShieldCheck,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  Database,
} from 'lucide-react';

const ACCESS_CODE = 'twc@code5';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  // Admin Data State & Handlers
  adminRole: AdminRole;
  onChangeRole: (role: AdminRole) => void;
  events: CyclingEvent[];
  onAddEvent: (event: CyclingEvent) => void;
  onUpdateEvent: (event: CyclingEvent) => void;
  onDeleteEvent: (id: string) => void;
  leaderboard: LeaderboardResult[];
  onAddResult: (res: LeaderboardResult) => void;
  onDeleteResult: (id: string) => void;
  riders: RiderProfile[];
  onAddRider: (rider: RiderProfile) => void;
  onUpdateRider: (rider: RiderProfile) => void;
  onDeleteRider: (id: string) => void;
  trainingSessions: TrainingSession[];
  onAddTrainingSession: (session: TrainingSession) => void;
  onDeleteTrainingSession: (id: string) => void;
  transactions: PaymentTransaction[];
  onVerifyPayment: (txId: string, status: 'Approved' | 'Rejected' | 'On Hold', bib?: string) => void;
  onAddTransaction: (tx: PaymentTransaction) => void;
  notices: NoticeItem[];
  onAddNotice: (notice: NoticeItem) => void;
  onUpdateNotice: (notice: NoticeItem) => void;
  onDeleteNotice: (id: string) => void;
  sponsors: SponsorItem[];
  onAddSponsor: (sponsor: SponsorItem) => void;
  onUpdateSponsor: (sponsor: SponsorItem) => void;
  onDeleteSponsor: (id: string) => void;
  onToggleSponsor: (id: string) => void;
  galleryPhotos: GalleryPhotoItem[];
  onAddPhoto: (photo: GalleryPhotoItem) => void;
  onUpdatePhoto?: (photo: GalleryPhotoItem) => void;
  onDeletePhoto: (id: string) => void;
  siteContent?: SiteContentSettings;
  onUpdateSiteContent?: (newSettings: Partial<SiteContentSettings>) => void;
  auditLogs: AuditLogEntry[];
  onResetAllAdminData: () => void;
  // Media Links State & Handlers
  mediaData: {
    youtube: SocialMediaItem[];
    tiktok: SocialMediaItem[];
    instagram: SocialMediaItem[];
    uploads?: SocialMediaItem[];
  };
  uploadedMedia?: SocialMediaItem[];
  onAddUploadedMedia?: (item: SocialMediaItem, blob?: Blob) => Promise<void> | void;
  onUpdateUploadedMedia?: (item: SocialMediaItem, blob?: Blob) => Promise<void> | void;
  onDeleteUploadedMedia?: (id: string) => Promise<void> | void;
  onSaveMediaLink: (platform: 'youtube' | 'tiktok' | 'instagram', index: number, updatedItem: SocialMediaItem) => void;
  onAddMediaItem: (platform: 'youtube' | 'tiktok' | 'instagram', item: SocialMediaItem) => void;
  onDeleteMediaItem: (platform: 'youtube' | 'tiktok' | 'instagram', id: string) => void;
  // Database State & Actions
  dbStatus?: 'connected' | 'offline' | 'connecting' | 'error';
  isSyncing?: boolean;
  lastSyncTime?: string | null;
  recentDbActions?: DatabaseActionRecord[];
  onSyncAll?: () => Promise<void>;
  onSeedCloud?: () => Promise<void>;
  onReloadCloud?: () => Promise<void>;
  onTestConnection?: () => Promise<void>;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  adminRole,
  onChangeRole,
  events,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  leaderboard,
  onAddResult,
  onDeleteResult,
  riders,
  onAddRider,
  onUpdateRider,
  onDeleteRider,
  trainingSessions,
  onAddTrainingSession,
  onDeleteTrainingSession,
  transactions,
  onVerifyPayment,
  onAddTransaction,
  notices,
  onAddNotice,
  onUpdateNotice,
  onDeleteNotice,
  sponsors,
  onAddSponsor,
  onUpdateSponsor,
  onDeleteSponsor,
  onToggleSponsor,
  galleryPhotos,
  onAddPhoto,
  onUpdatePhoto,
  onDeletePhoto,
  siteContent,
  onUpdateSiteContent,
  auditLogs,
  onResetAllAdminData,
  mediaData,
  uploadedMedia = [],
  onAddUploadedMedia,
  onUpdateUploadedMedia,
  onDeleteUploadedMedia,
  onSaveMediaLink,
  onAddMediaItem,
  onDeleteMediaItem,
  dbStatus = 'connected',
  isSyncing = false,
  lastSyncTime = null,
  recentDbActions = [],
  onSyncAll = async () => {},
  onSeedCloud = async () => {},
  onReloadCloud = async () => {},
  onTestConnection = async () => {},
}) => {
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem('twc_admin_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [authError, setAuthError] = useState('');
  const [activeModule, setActiveModule] = useState<
    'dashboard' | 'events' | 'crm' | 'financials' | 'cms' | 'database' | 'security'
  >('dashboard');

  if (!isOpen) return null;

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = passcode.trim().toLowerCase();
    if (clean === 'twc@code5' || clean === 'code5' || passcode.trim() === ACCESS_CODE) {
      setIsAuthenticated(true);
      setAuthError('');
      try {
        sessionStorage.setItem('twc_admin_auth', 'true');
      } catch {
        // Fallback gracefully
      }
    } else {
      setAuthError('Invalid administrator credentials. Passcode is "twc@code5"');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasscode('');
    try {
      sessionStorage.removeItem('twc_admin_auth');
    } catch {
      // Fallback
    }
  };

  const handleQuickAction = (action: string) => {
    if (action === 'create_event') {
      setActiveModule('events');
    } else if (action === 'verify_payment') {
      setActiveModule('financials');
    } else if (action === 'post_notice') {
      setActiveModule('cms');
    } else if (action === 'log_training') {
      setActiveModule('crm');
    }
  };

  // 1. LOCKED / AUTH SCREEN
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
        <div className="w-full max-w-md rounded-3xl bg-zinc-900 border border-zinc-800 p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center shadow-inner">
              <KeyRound className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black text-white font-heading tracking-wide uppercase">
              TWC Operations Desk
            </h3>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto">
              Together We Can Cycling Uganda Ltd. Authorized access for Manager Solo and commissaire personnel only.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1 font-mono">
                Administrator Passcode
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    setAuthError('');
                  }}
                  placeholder="Enter code (twc@code5)"
                  autoFocus
                  className="w-full pl-4 pr-10 py-3 bg-zinc-950 border border-zinc-700 rounded-xl text-white font-mono text-sm placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {authError && (
                <p className="text-xs text-red-400 mt-1.5 font-medium">{authError}</p>
              )}
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300">
              Passcode hint: <strong className="font-mono text-white">twc@code5</strong> (default security key)
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-extrabold font-heading tracking-wide flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/20 transition-all hover:scale-102"
              >
                <Unlock className="w-4 h-4" />
                <span>Unlock Desk</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Pending count for badge
  const pendingPaymentsCount = transactions.filter((t) => t.status === 'Pending').length;

  // 2. UNLOCKED ADMIN MODAL
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-7xl h-[94vh] rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header with RBAC Switcher */}
        <AdminHeader
          currentRole={adminRole}
          onChangeRole={onChangeRole}
          onClose={onClose}
          onLogout={handleLogout}
          activeModuleTitle={activeModule}
          dbStatus={dbStatus}
          onOpenDatabaseSync={() => setActiveModule('database')}
        />

        {/* 7-Module Primary Navigation Tabs */}
        <div className="bg-zinc-900 border-b border-zinc-800 px-4 sm:px-6 overflow-x-auto flex items-center gap-2 sm:gap-4 py-2 flex-shrink-0">
          {/* Module 1: Dashboard */}
          <button
            onClick={() => setActiveModule('dashboard')}
            className={`px-3 py-2 rounded-xl text-xs font-bold font-heading flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeModule === 'dashboard'
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>1. Dashboard (Overview)</span>
          </button>

          {/* Module 2: Event & Race Management */}
          <button
            onClick={() => setActiveModule('events')}
            className={`px-3 py-2 rounded-xl text-xs font-bold font-heading flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeModule === 'events'
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>2. Events & Races ({events.length})</span>
          </button>

          {/* Module 3: Rider & Academy CRM */}
          <button
            onClick={() => setActiveModule('crm')}
            className={`px-3 py-2 rounded-xl text-xs font-bold font-heading flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeModule === 'crm'
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>3. Rider Roster & CRM ({riders.length})</span>
          </button>

          {/* Module 4: Financials & Verification */}
          <button
            onClick={() => setActiveModule('financials')}
            className={`px-3 py-2 rounded-xl text-xs font-bold font-heading flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeModule === 'financials'
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>4. Financials & MoMo</span>
            {pendingPaymentsCount > 0 && (
              <span className="text-[10px] bg-red-500 text-white font-bold px-1.5 py-0.2 rounded-full">
                {pendingPaymentsCount}
              </span>
            )}
          </button>

          {/* Module 5: Website Content Manager & Editor */}
          <button
            id="admin-tab-content-manager"
            onClick={() => setActiveModule('cms')}
            className={`px-3 py-2 rounded-xl text-xs font-bold font-heading flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeModule === 'cms'
                ? 'bg-amber-500 text-black shadow-md font-extrabold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>5. Content Studio (Add / Edit / Delete)</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono">
              Live
            </span>
          </button>

          {/* Module 6: Cloud Database Sync & Activity Feed */}
          <button
            id="admin-tab-database"
            onClick={() => setActiveModule('database')}
            className={`px-3 py-2 rounded-xl text-xs font-bold font-heading flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeModule === 'database'
                ? 'bg-amber-500 text-black shadow-md font-extrabold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>6. Cloud Database & Sync</span>
            <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
          </button>

          {/* Module 7: Settings & Security Controls */}
          <button
            onClick={() => setActiveModule('security')}
            className={`px-3 py-2 rounded-xl text-xs font-bold font-heading flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeModule === 'security'
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>7. RBAC & Audits</span>
          </button>
        </div>

        {/* Scrollable Content Workspace */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {activeModule === 'dashboard' && (
            <AdminDashboard
              currentRole={adminRole}
              events={events}
              riders={riders}
              transactions={transactions}
              notices={notices}
              auditLogs={auditLogs}
              onNavigateTab={(tab) => setActiveModule(tab as any)}
              onOpenQuickAction={handleQuickAction}
            />
          )}

          {activeModule === 'events' && (
            <AdminEventsManagement
              currentRole={adminRole}
              events={events}
              leaderboard={leaderboard}
              onAddEvent={onAddEvent}
              onUpdateEvent={onUpdateEvent}
              onDeleteEvent={onDeleteEvent}
              onAddResult={onAddResult}
              onDeleteResult={onDeleteResult}
            />
          )}

          {activeModule === 'crm' && (
            <AdminRiderCRM
              currentRole={adminRole}
              riders={riders}
              trainingSessions={trainingSessions}
              onAddRider={onAddRider}
              onUpdateRider={onUpdateRider}
              onDeleteRider={onDeleteRider}
              onAddTrainingSession={onAddTrainingSession}
              onDeleteTrainingSession={onDeleteTrainingSession}
            />
          )}

          {activeModule === 'financials' && (
            <AdminFinancials
              currentRole={adminRole}
              transactions={transactions}
              onVerifyPayment={onVerifyPayment}
              onAddTransaction={onAddTransaction}
            />
          )}

          {activeModule === 'cms' && (
            <AdminCMS
              currentRole={adminRole}
              notices={notices}
              sponsors={sponsors}
              galleryPhotos={galleryPhotos}
              mediaData={mediaData}
              siteContent={siteContent}
              onUpdateSiteContent={onUpdateSiteContent}
              onAddNotice={onAddNotice}
              onUpdateNotice={onUpdateNotice}
              onDeleteNotice={onDeleteNotice}
              onAddSponsor={onAddSponsor}
              onUpdateSponsor={onUpdateSponsor}
              onDeleteSponsor={onDeleteSponsor}
              onToggleSponsor={onToggleSponsor}
              onAddPhoto={onAddPhoto}
              onUpdatePhoto={onUpdatePhoto}
              onDeletePhoto={onDeletePhoto}
              onSaveMediaLink={onSaveMediaLink}
              onAddMediaItem={onAddMediaItem}
              onDeleteMediaItem={onDeleteMediaItem}
              uploadedMedia={uploadedMedia}
              onAddUploadedMedia={onAddUploadedMedia}
              onUpdateUploadedMedia={onUpdateUploadedMedia}
              onDeleteUploadedMedia={onDeleteUploadedMedia}
            />
          )}

          {activeModule === 'database' && (
            <DatabaseSyncCenter
              dbStatus={dbStatus}
              isSyncing={isSyncing}
              lastSyncTime={lastSyncTime}
              recentActions={recentDbActions}
              onSyncAll={onSyncAll}
              onSeedCloud={onSeedCloud}
              onReloadCloud={onReloadCloud}
              onTestConnection={onTestConnection}
              counts={{
                events: events.length,
                notices: notices.length,
                riders: riders.length,
                results: leaderboard.length,
                sponsors: sponsors.length,
                gallery: galleryPhotos.length,
              }}
            />
          )}

          {activeModule === 'security' && (
            <AdminSettingsSecurity
              currentRole={adminRole}
              onChangeRole={onChangeRole}
              auditLogs={auditLogs}
              onResetData={onResetAllAdminData}
            />
          )}
        </div>
      </div>
    </div>
  );
};
