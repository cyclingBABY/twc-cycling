import { useState, useEffect, useCallback } from 'react';
import {
  CyclingEvent,
  RiderProfile,
  LeaderboardResult,
  TrainingSession,
  PaymentTransaction,
  NoticeItem,
  SponsorItem,
  GalleryPhotoItem,
  AuditLogEntry,
  AdminRole,
  SiteContentSettings,
} from '../types';
import {
  INITIAL_EVENTS,
  INITIAL_LEADERBOARD,
  INITIAL_RIDERS,
  INITIAL_TRAINING_SESSIONS,
  INITIAL_TRANSACTIONS,
  INITIAL_NOTICES,
  INITIAL_SPONSORS,
  INITIAL_GALLERY_PHOTOS,
  INITIAL_AUDIT_LOGS,
} from '../data/adminInitialData';
import {
  saveDocument,
  deleteDocument,
  fetchCollection,
  fetchSingleDoc,
  subscribeToDatabaseActions,
  seedCollectionIfEmpty,
  DatabaseActionRecord,
} from '../services/dbService';
import { testFirestoreConnection } from '../lib/firebase';

const INITIAL_SITE_CONTENT: SiteContentSettings = {
  announcementBanner: 'Official TWC Race Registration Hotlines: +256 706 770 872 / +256 763 145 915 — Register early for the Lubiri Grand Criterium!',
  hotline1: '+256 706 770 872',
  hotline2: '+256 763 145 915',
  headquartersAddress: 'BMK House, Katwe, Kampala, Uganda',
  heroHeadline: 'Together We Can Cycling Uganda Limited',
  heroSubtitle: 'Uganda’s premier competitive cycling academy and race organizers based at BMK House Katwe, Kampala. Championing youth development, Senior One grassroots clinics, elite racing at Lubiri Ring Road, and nationwide road safety.',
  contactEmail: 'twccyclinguganda@gmail.com',
};

const KEYS = {
  ROLE: 'twc_admin_role_v2',
  EVENTS: 'twc_admin_events_v2',
  RESULTS: 'twc_admin_results_v2',
  RIDERS: 'twc_admin_riders_v2',
  TRAINING: 'twc_admin_training_v2',
  TRANSACTIONS: 'twc_admin_transactions_v2',
  NOTICES: 'twc_admin_notices_v2',
  SPONSORS: 'twc_admin_sponsors_v2',
  GALLERY: 'twc_admin_gallery_v2',
  AUDIT: 'twc_admin_audit_v2',
  SETTINGS: 'twc_admin_site_settings_v2',
};

function safeGet<T>(key: string, fallback: T): T {
  try {
    const val = localStorage.getItem(key);
    if (val) return JSON.parse(val);
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
  }
  return fallback;
}

function safeSet<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err);
  }
}

export function useAcademyAdminData() {
  const [adminRole, setAdminRoleState] = useState<AdminRole>(() =>
    safeGet<AdminRole>(KEYS.ROLE, 'super_admin')
  );

  const [events, setEvents] = useState<CyclingEvent[]>(() => {
    const cached = safeGet<CyclingEvent[]>(KEYS.EVENTS, INITIAL_EVENTS);
    return cached.map((ev) => {
      if (ev.id === 'irene-gleeson-memorial' && !ev.heroImage?.includes('encrypted-tbn0')) {
        return {
          ...ev,
          heroImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7WBsfFNzFp04i3JTuiQCmIxNf9Y1L6-TeUcaewO_8mg&s',
        };
      }
      if ((ev.id === 'katwe-grassroots-crit' || ev.id === 'katwe-youth-crit' || ev.title?.includes('Katwe Grassroots')) && (!ev.heroImage || ev.heroImage.includes('unsplash'))) {
        return {
          ...ev,
          heroImage: '/images/katwe-grassroots-criterium.jpg',
        };
      }
      return ev;
    });
  });

  const [leaderboard, setLeaderboard] = useState<LeaderboardResult[]>(() =>
    safeGet<LeaderboardResult[]>(KEYS.RESULTS, INITIAL_LEADERBOARD)
  );

  const [riders, setRiders] = useState<RiderProfile[]>(() =>
    safeGet<RiderProfile[]>(KEYS.RIDERS, INITIAL_RIDERS)
  );

  const [trainingSessions, setTrainingSessions] = useState<TrainingSession[]>(() =>
    safeGet<TrainingSession[]>(KEYS.TRAINING, INITIAL_TRAINING_SESSIONS)
  );

  const [transactions, setTransactions] = useState<PaymentTransaction[]>(() =>
    safeGet<PaymentTransaction[]>(KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS)
  );

  const [notices, setNotices] = useState<NoticeItem[]>(() =>
    safeGet<NoticeItem[]>(KEYS.NOTICES, INITIAL_NOTICES)
  );

  const [sponsors, setSponsors] = useState<SponsorItem[]>(() =>
    safeGet<SponsorItem[]>(KEYS.SPONSORS, INITIAL_SPONSORS)
  );

  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhotoItem[]>(() =>
    safeGet<GalleryPhotoItem[]>(KEYS.GALLERY, INITIAL_GALLERY_PHOTOS)
  );

  const [siteContent, setSiteContent] = useState<SiteContentSettings>(() =>
    safeGet<SiteContentSettings>(KEYS.SETTINGS, INITIAL_SITE_CONTENT)
  );

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() =>
    safeGet<AuditLogEntry[]>(KEYS.AUDIT, INITIAL_AUDIT_LOGS)
  );

  // Real-time Database Status & Action Tracking
  const [dbStatus, setDbStatus] = useState<'connected' | 'offline' | 'connecting' | 'error'>('connecting');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [recentDbActions, setRecentDbActions] = useState<DatabaseActionRecord[]>([]);

  // Role names
  const roleNameMap: Record<AdminRole, string> = {
    super_admin: 'Manager Solo (Solomon Ssebakaki)',
    race_coordinator: 'Race Coordinator (David M.)',
    academy_trainer: 'Coach Isaac Kisekka (Academy Trainer)',
  };

  const setAdminRole = (role: AdminRole) => {
    setAdminRoleState(role);
    safeSet(KEYS.ROLE, role);
  };

  // Subscribe to live database actions (POST, EDIT, DELETE)
  useEffect(() => {
    const unsub = subscribeToDatabaseActions((action) => {
      setRecentDbActions((prev) => [action, ...prev.slice(0, 49)]);
    });
    return () => unsub();
  }, []);

  // Initialize and synchronize with Cloud Firestore
  useEffect(() => {
    let isMounted = true;

    async function initCloudSync() {
      try {
        const ping = await testFirestoreConnection();
        if (!isMounted) return;

        if (ping.success) {
          setDbStatus('connected');
        } else {
          setDbStatus('offline');
        }

        // 1. Notices & Bulletins
        const cloudNotices = await fetchCollection<NoticeItem>('notices');
        if (cloudNotices.length > 0 && isMounted) {
          setNotices(cloudNotices);
          safeSet(KEYS.NOTICES, cloudNotices);
        } else {
          await seedCollectionIfEmpty('notices', INITIAL_NOTICES);
        }

        // 2. Events & Races
        const cloudEvents = await fetchCollection<CyclingEvent>('events');
        if (cloudEvents.length > 0 && isMounted) {
          const updatedCloudEvents = cloudEvents.map((ev) => {
            if (ev.id === 'irene-gleeson-memorial' && !ev.heroImage?.includes('encrypted-tbn0')) {
              const fixed = {
                ...ev,
                heroImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7WBsfFNzFp04i3JTuiQCmIxNf9Y1L6-TeUcaewO_8mg&s',
              };
              saveDocument('events', fixed.id, fixed, true);
              return fixed;
            }
            if ((ev.id === 'katwe-grassroots-crit' || ev.id === 'katwe-youth-crit' || ev.title?.includes('Katwe Grassroots')) && (!ev.heroImage || ev.heroImage.includes('unsplash'))) {
              const fixed = {
                ...ev,
                heroImage: '/images/katwe-grassroots-criterium.jpg',
              };
              saveDocument('events', fixed.id, fixed, true);
              return fixed;
            }
            return ev;
          });
          setEvents(updatedCloudEvents);
          safeSet(KEYS.EVENTS, updatedCloudEvents);
        } else {
          await seedCollectionIfEmpty('events', INITIAL_EVENTS);
        }

        // 3. Site Content Settings
        const cloudSettings = await fetchSingleDoc<SiteContentSettings>('settings', 'siteContent');
        if (cloudSettings && isMounted) {
          setSiteContent(cloudSettings);
          safeSet(KEYS.SETTINGS, cloudSettings);
        } else {
          await saveDocument('settings', 'siteContent', INITIAL_SITE_CONTENT, false);
        }

        // 4. Riders CRM
        const cloudRiders = await fetchCollection<RiderProfile>('riders');
        if (cloudRiders.length > 0 && isMounted) {
          setRiders(cloudRiders);
          safeSet(KEYS.RIDERS, cloudRiders);
        } else {
          await seedCollectionIfEmpty('riders', INITIAL_RIDERS);
        }

        // 5. Results & Leaderboards
        const cloudResults = await fetchCollection<LeaderboardResult>('results');
        if (cloudResults.length > 0 && isMounted) {
          setLeaderboard(cloudResults);
          safeSet(KEYS.RESULTS, cloudResults);
        } else {
          await seedCollectionIfEmpty('results', INITIAL_LEADERBOARD);
        }

        // 6. Sponsors
        const cloudSponsors = await fetchCollection<SponsorItem>('sponsors');
        if (cloudSponsors.length > 0 && isMounted) {
          setSponsors(cloudSponsors);
          safeSet(KEYS.SPONSORS, cloudSponsors);
        } else {
          await seedCollectionIfEmpty('sponsors', INITIAL_SPONSORS);
        }

        // 7. Gallery
        const cloudGallery = await fetchCollection<GalleryPhotoItem>('gallery');
        if (cloudGallery.length > 0 && isMounted) {
          setGalleryPhotos(cloudGallery);
          safeSet(KEYS.GALLERY, cloudGallery);
        } else {
          await seedCollectionIfEmpty('gallery', INITIAL_GALLERY_PHOTOS);
        }

        if (isMounted) {
          setLastSyncTime(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
        }
      } catch (e) {
        console.warn('Firestore initial sync encountered notice:', e);
        if (isMounted) setDbStatus('offline');
      }
    }

    initCloudSync();

    return () => {
      isMounted = false;
    };
  }, []);

  // Audit Log internal trigger (persists to Firestore + local state)
  const logAction = useCallback(
    (first: string, second: string, third?: string) => {
      let module: AuditLogEntry['module'] = 'cms';
      let action = first;
      let details = second;

      const validModules: AuditLogEntry['module'][] = ['events', 'crm', 'financials', 'cms', 'media', 'security'];
      if (validModules.includes(first as any)) {
        module = first as AuditLogEntry['module'];
        action = second;
        details = third || '';
      } else if (third && validModules.includes(third as any)) {
        module = third as AuditLogEntry['module'];
      }

      const newEntry: AuditLogEntry = {
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        adminRole,
        adminName: roleNameMap[adminRole],
        action,
        details,
        timestamp: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' EAT, ' + new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
        module,
      };

      setAuditLogs((prev) => {
        const updated = [newEntry, ...prev.slice(0, 99)];
        safeSet(KEYS.AUDIT, updated);
        return updated;
      });

      // Capture in Firestore database
      saveDocument('auditLogs', newEntry.id, newEntry, false);
    },
    [adminRole]
  );

  // 1. EVENT ACTIONS (POST, EDIT, DELETE to Firestore)
  const addEvent = (event: CyclingEvent) => {
    setEvents((prev) => {
      const updated = [event, ...prev];
      safeSet(KEYS.EVENTS, updated);
      return updated;
    });
    saveDocument('events', event.id, event, false);
    logAction('Created New Event', `Added race "${event.title}" (${event.distanceSummary})`, 'events');
  };

  const updateEvent = (event: CyclingEvent) => {
    setEvents((prev) => {
      const updated = prev.map((e) => (e.id === event.id ? event : e));
      safeSet(KEYS.EVENTS, updated);
      return updated;
    });
    saveDocument('events', event.id, event, true);
    logAction('Updated Event Details', `Modified race setup for "${event.title}"`, 'events');
  };

  const deleteEvent = (id: string) => {
    const item = events.find((e) => e.id === id);
    setEvents((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      safeSet(KEYS.EVENTS, updated);
      return updated;
    });
    deleteDocument('events', id);
    logAction('Deleted Event', `Removed event ID ${id} (${item?.title || 'Unknown'})`, 'events');
  };

  // 2. LEADERBOARD / RESULTS (POST, DELETE to Firestore)
  const addResult = (result: LeaderboardResult) => {
    setLeaderboard((prev) => {
      const updated = [result, ...prev];
      safeSet(KEYS.RESULTS, updated);
      return updated;
    });
    saveDocument('results', result.id, result, false);
    logAction('Published Race Result', `Uploaded podium: #${result.position} ${result.riderName} (${result.categoryName})`, 'events');
  };

  const deleteResult = (id: string) => {
    setLeaderboard((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      safeSet(KEYS.RESULTS, updated);
      return updated;
    });
    deleteDocument('results', id);
    logAction('Deleted Result Entry', `Removed leaderboard result ID ${id}`, 'events');
  };

  // 3. RIDER CRM ACTIONS (POST, EDIT, DELETE to Firestore)
  const addRider = (rider: RiderProfile) => {
    setRiders((prev) => {
      const updated = [rider, ...prev];
      safeSet(KEYS.RIDERS, updated);
      return updated;
    });
    saveDocument('riders', rider.id, rider, false);
    logAction('Registered New Rider', `Enrolled ${rider.name} in ${rider.category} (Bib ${rider.bibNumber})`, 'crm');
  };

  const updateRider = (rider: RiderProfile) => {
    setRiders((prev) => {
      const updated = prev.map((r) => (r.id === rider.id ? rider : r));
      safeSet(KEYS.RIDERS, updated);
      return updated;
    });
    saveDocument('riders', rider.id, rider, true);
    logAction('Updated Rider Profile', `Modified details for rider ${rider.name}`, 'crm');
  };

  const deleteRider = (id: string) => {
    const r = riders.find((item) => item.id === id);
    setRiders((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      safeSet(KEYS.RIDERS, updated);
      return updated;
    });
    deleteDocument('riders', id);
    logAction('Removed Rider Record', `Archived rider profile for ${r?.name || id}`, 'crm');
  };

  // 4. TRAINING LOG ACTIONS (POST, DELETE to Firestore)
  const addTrainingSession = (session: TrainingSession) => {
    setTrainingSessions((prev) => {
      const updated = [session, ...prev];
      safeSet(KEYS.TRAINING, updated);
      return updated;
    });
    saveDocument('training', session.id, session, false);
    logAction('Logged Training Session', `Recorded academy session: "${session.focus}" (${session.attendanceCount} riders)`, 'crm');
  };

  const deleteTrainingSession = (id: string) => {
    setTrainingSessions((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      safeSet(KEYS.TRAINING, updated);
      return updated;
    });
    deleteDocument('training', id);
    logAction('Deleted Training Record', `Removed session record ID ${id}`, 'crm');
  };

  // 5. FINANCIALS & PAYMENT VERIFICATION (POST, EDIT to Firestore)
  const verifyPayment = (
    txId: string,
    newStatus: 'Approved' | 'Rejected' | 'On Hold',
    customBib?: string
  ) => {
    const tx = transactions.find((t) => t.id === txId);
    if (!tx) return;

    const assignedBib =
      customBib ||
      tx.bibAssigned ||
      `TWC-RAC-${Math.floor(100 + Math.random() * 900)}`;

    const updatedTx: PaymentTransaction = {
      ...tx,
      status: newStatus,
      bibAssigned: newStatus === 'Approved' ? assignedBib : tx.bibAssigned,
      verifiedBy: roleNameMap[adminRole],
    };

    setTransactions((prev) => {
      const updated = prev.map((t) => (t.id === txId ? updatedTx : t));
      safeSet(KEYS.TRANSACTIONS, updated);
      return updated;
    });

    saveDocument('transactions', txId, updatedTx, true);

    if (tx.riderId || tx.payerName) {
      setRiders((prev) => {
        const updated = prev.map((r) => {
          if (r.id === tx.riderId || r.name.toLowerCase() === tx.payerName.toLowerCase()) {
            const updatedRider = {
              ...r,
              paymentStatus: newStatus === 'Approved' ? 'Approved' : 'Pending Verification',
              bibNumber: newStatus === 'Approved' ? assignedBib : r.bibNumber,
            };
            saveDocument('riders', r.id, updatedRider, true);
            return updatedRider as RiderProfile;
          }
          return r;
        });
        safeSet(KEYS.RIDERS, updated);
        return updated;
      });
    }

    logAction(
      `Payment ${newStatus}`,
      `Ref: ${tx.referenceId} | Payer: ${tx.payerName} (UGX ${tx.amountUGX.toLocaleString()}) -> Bib: ${assignedBib}`,
      'financials'
    );
  };

  const addTransaction = (tx: PaymentTransaction) => {
    setTransactions((prev) => {
      const updated = [tx, ...prev];
      safeSet(KEYS.TRANSACTIONS, updated);
      return updated;
    });
    saveDocument('transactions', tx.id, tx, false);
    logAction('Added Transaction', `Recorded ${tx.paymentMethod} payment Ref: ${tx.referenceId} (${tx.payerName})`, 'financials');
  };

  // 6. CMS: NOTICES & PRESS (POST, EDIT, DELETE to Firestore)
  const addNotice = (notice: NoticeItem) => {
    setNotices((prev) => {
      const updated = [notice, ...prev];
      safeSet(KEYS.NOTICES, updated);
      return updated;
    });
    saveDocument('notices', notice.id, notice, false);
    logAction('Posted Official Notice', `Published: "${notice.title}"`, 'cms');
  };

  const updateNotice = (notice: NoticeItem) => {
    setNotices((prev) => {
      const updated = prev.map((n) => (n.id === notice.id ? notice : n));
      safeSet(KEYS.NOTICES, updated);
      return updated;
    });
    saveDocument('notices', notice.id, notice, true);
    logAction('Updated Notice', `Edited announcement "${notice.title}"`, 'cms');
  };

  const deleteNotice = (id: string) => {
    setNotices((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      safeSet(KEYS.NOTICES, updated);
      return updated;
    });
    deleteDocument('notices', id);
    logAction('Deleted Notice', `Removed notice ID ${id}`, 'cms');
  };

  // 7. CMS: SPONSOR HUB (POST, EDIT, DELETE to Firestore)
  const addSponsor = (sponsor: SponsorItem) => {
    const sorted = [...sponsors, sponsor].sort((a, b) => a.tierWeight - b.tierWeight);
    setSponsors(sorted);
    safeSet(KEYS.SPONSORS, sorted);
    saveDocument('sponsors', sponsor.id, sponsor, false);
    logAction('Added Sponsor Partner', `Registered ${sponsor.name} (${sponsor.tier})`, 'cms');
  };

  const updateSponsor = (sponsor: SponsorItem) => {
    const sorted = sponsors.map((s) => (s.id === sponsor.id ? sponsor : s)).sort((a, b) => a.tierWeight - b.tierWeight);
    setSponsors(sorted);
    safeSet(KEYS.SPONSORS, sorted);
    saveDocument('sponsors', sponsor.id, sponsor, true);
    logAction('Updated Sponsor Partner', `Modified sponsorship terms for ${sponsor.name}`, 'cms');
  };

  const deleteSponsor = (id: string) => {
    setSponsors((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      safeSet(KEYS.SPONSORS, updated);
      return updated;
    });
    deleteDocument('sponsors', id);
    logAction('Removed Sponsor Partner', `Deleted sponsor ID ${id}`, 'cms');
  };

  const toggleSponsorActive = (id: string) => {
    setSponsors((prev) => {
      const updated = prev.map((s) => {
        if (s.id === id) {
          const item = { ...s, active: !s.active };
          saveDocument('sponsors', id, item, true);
          return item;
        }
        return s;
      });
      safeSet(KEYS.SPONSORS, updated);
      return updated;
    });
  };

  // 8. CMS: GALLERY PHOTOS (POST, EDIT, DELETE to Firestore)
  const addGalleryPhoto = (photo: GalleryPhotoItem) => {
    setGalleryPhotos((prev) => {
      const updated = [photo, ...prev];
      safeSet(KEYS.GALLERY, updated);
      return updated;
    });
    saveDocument('gallery', photo.id, photo, false);
    logAction('Uploaded Photo', `Added gallery photo "${photo.title}"`, 'cms');
  };

  const updateGalleryPhoto = (photo: GalleryPhotoItem) => {
    setGalleryPhotos((prev) => {
      const updated = prev.map((p) => (p.id === photo.id ? photo : p));
      safeSet(KEYS.GALLERY, updated);
      return updated;
    });
    saveDocument('gallery', photo.id, photo, true);
    logAction('Updated Photo', `Modified gallery photo "${photo.title}"`, 'cms');
  };

  const deleteGalleryPhoto = (id: string) => {
    setGalleryPhotos((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      safeSet(KEYS.GALLERY, updated);
      return updated;
    });
    deleteDocument('gallery', id);
    logAction('Deleted Photo', `Removed photo ID ${id}`, 'cms');
  };

  // 9. SITE CONTENT SETTINGS (EDIT to Firestore)
  const updateSiteContent = (newSettings: Partial<SiteContentSettings>) => {
    setSiteContent((prev) => {
      const updated = { ...prev, ...newSettings };
      safeSet(KEYS.SETTINGS, updated);
      saveDocument('settings', 'siteContent', updated, true);
      return updated;
    });
    logAction('Updated Website Content', 'Modified core site banner/text settings', 'cms');
  };

  // 10. Public Registration Sync (POST to Firestore)
  const registerRiderFromPublic = (data: {
    fullName: string;
    ageCategory: string;
    phone: string;
    experienceLevel: string;
    schoolOrClub?: string;
    interestedRace?: string;
  }) => {
    const bibRandom = Math.floor(100 + Math.random() * 900);
    const catPrefix = data.ageCategory.substring(0, 3).toUpperCase();
    const bibNumber = `TWC-${catPrefix}-${bibRandom}`;

    let categoryGroup: RiderProfile['category'] = 'Schools & Youth (Senior One)';
    if (data.ageCategory.toLowerCase().includes('elite')) {
      categoryGroup = 'Elite Field';
    } else if (data.ageCategory.toLowerCase().includes('forces')) {
      categoryGroup = 'Armed Forces Field';
    } else if (data.ageCategory.toLowerCase().includes('fan') || data.ageCategory.toLowerCase().includes('family')) {
      categoryGroup = 'Family & Fans';
    }

    const newRider: RiderProfile = {
      id: `rdr-${Date.now()}`,
      name: data.fullName,
      category: categoryGroup,
      age: data.ageCategory === 'Youth' ? 14 : 22,
      licensingLevel:
        categoryGroup === 'Schools & Youth (Senior One)'
          ? 'School Competitor (Senior One)'
          : categoryGroup === 'Elite Field'
          ? 'UCF / UCI Licensed'
          : 'Club Veteran',
      contactPhone: data.phone,
      schoolOrClub: data.schoolOrClub || 'Independent Rider',
      bibNumber,
      paymentStatus: 'Pending Verification',
      dateJoined: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'Under Training',
    };

    const newTx: PaymentTransaction = {
      id: `txn-${Date.now()}`,
      referenceId: `MM-PENDING-${bibRandom}`,
      payerName: data.fullName,
      amountUGX: categoryGroup === 'Schools & Youth (Senior One)' ? 20000 : 50000,
      paymentMethod: 'MTN MoMo',
      purpose: 'Race Registration Fee',
      riderId: newRider.id,
      bibAssigned: bibNumber,
      timestamp: 'Just now',
      status: 'Pending',
    };

    setRiders((prev) => {
      const updated = [newRider, ...prev];
      safeSet(KEYS.RIDERS, updated);
      return updated;
    });

    setTransactions((prev) => {
      const updated = [newTx, ...prev];
      safeSet(KEYS.TRANSACTIONS, updated);
      return updated;
    });

    saveDocument('riders', newRider.id, newRider, false);
    saveDocument('transactions', newTx.id, newTx, false);

    logAction(
      'New Public Registration',
      `${data.fullName} registered for ${data.interestedRace || 'Academy'} (Bib: ${bibNumber}) - Payment Pending Verification`,
      'crm'
    );

    return { rider: newRider, transaction: newTx };
  };

  // 11. Built-in Database Action: Sync All Current Records to Cloud
  const syncAllToCloud = async (): Promise<void> => {
    setIsSyncing(true);
    try {
      // Save settings
      await saveDocument('settings', 'siteContent', siteContent, true);

      // Save all notices
      for (const n of notices) {
        await saveDocument('notices', n.id, n, true);
      }
      // Save all events
      for (const e of events) {
        await saveDocument('events', e.id, e, true);
      }
      // Save all riders
      for (const r of riders) {
        await saveDocument('riders', r.id, r, true);
      }
      // Save all results
      for (const res of leaderboard) {
        await saveDocument('results', res.id, res, true);
      }
      // Save all sponsors
      for (const s of sponsors) {
        await saveDocument('sponsors', s.id, s, true);
      }
      // Save all gallery photos
      for (const g of galleryPhotos) {
        await saveDocument('gallery', g.id, g, true);
      }

      setDbStatus('connected');
      setLastSyncTime(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
      logAction('Full Cloud Database Sync', 'Pushed all local records to Google Cloud Firestore', 'security');
    } catch (e: any) {
      console.error('syncAllToCloud error:', e);
      throw e;
    } finally {
      setIsSyncing(false);
    }
  };

  // 12. Built-in Database Action: Seed Cloud Baseline Records
  const seedCloudDatabase = async (): Promise<void> => {
    setIsSyncing(true);
    try {
      await seedCollectionIfEmpty('notices', INITIAL_NOTICES);
      await seedCollectionIfEmpty('events', INITIAL_EVENTS);
      await seedCollectionIfEmpty('riders', INITIAL_RIDERS);
      await seedCollectionIfEmpty('results', INITIAL_LEADERBOARD);
      await seedCollectionIfEmpty('sponsors', INITIAL_SPONSORS);
      await seedCollectionIfEmpty('gallery', INITIAL_GALLERY_PHOTOS);
      await saveDocument('settings', 'siteContent', INITIAL_SITE_CONTENT, false);

      setDbStatus('connected');
      setLastSyncTime(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
      logAction('Seeded Cloud Database', 'Populated baseline Firestore collections', 'security');
    } catch (e: any) {
      console.error('seedCloudDatabase error:', e);
      throw e;
    } finally {
      setIsSyncing(false);
    }
  };

  // 13. Built-in Database Action: Reload Fresh from Cloud
  const reloadFromCloud = async (): Promise<void> => {
    setIsSyncing(true);
    try {
      const [n, e, r, l, s, g, set] = await Promise.all([
        fetchCollection<NoticeItem>('notices'),
        fetchCollection<CyclingEvent>('events'),
        fetchCollection<RiderProfile>('riders'),
        fetchCollection<LeaderboardResult>('results'),
        fetchCollection<SponsorItem>('sponsors'),
        fetchCollection<GalleryPhotoItem>('gallery'),
        fetchSingleDoc<SiteContentSettings>('settings', 'siteContent'),
      ]);

      if (n.length > 0) {
        setNotices(n);
        safeSet(KEYS.NOTICES, n);
      }
      if (e.length > 0) {
        setEvents(e);
        safeSet(KEYS.EVENTS, e);
      }
      if (r.length > 0) {
        setRiders(r);
        safeSet(KEYS.RIDERS, r);
      }
      if (l.length > 0) {
        setLeaderboard(l);
        safeSet(KEYS.RESULTS, l);
      }
      if (s.length > 0) {
        setSponsors(s);
        safeSet(KEYS.SPONSORS, s);
      }
      if (g.length > 0) {
        setGalleryPhotos(g);
        safeSet(KEYS.GALLERY, g);
      }
      if (set) {
        setSiteContent(set);
        safeSet(KEYS.SETTINGS, set);
      }

      setDbStatus('connected');
      setLastSyncTime(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
      logAction('Reloaded from Cloud', 'Refreshed in-memory state from live Firestore documents', 'security');
    } catch (e: any) {
      console.error('reloadFromCloud error:', e);
      throw e;
    } finally {
      setIsSyncing(false);
    }
  };

  // 14. Ping Test Connection
  const testDbConnection = async (): Promise<void> => {
    setIsSyncing(true);
    try {
      const res = await testFirestoreConnection();
      if (res.success) {
        setDbStatus('connected');
      } else {
        setDbStatus('offline');
      }
    } finally {
      setIsSyncing(false);
    }
  };

  // Reset all to defaults
  const resetAllAdminData = () => {
    setEvents(INITIAL_EVENTS);
    setLeaderboard(INITIAL_LEADERBOARD);
    setRiders(INITIAL_RIDERS);
    setTrainingSessions(INITIAL_TRAINING_SESSIONS);
    setTransactions(INITIAL_TRANSACTIONS);
    setNotices(INITIAL_NOTICES);
    setSponsors(INITIAL_SPONSORS);
    setGalleryPhotos(INITIAL_GALLERY_PHOTOS);
    setAuditLogs(INITIAL_AUDIT_LOGS);

    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  };

  return {
    adminRole,
    setAdminRole,
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    leaderboard,
    addResult,
    deleteResult,
    riders,
    addRider,
    updateRider,
    deleteRider,
    trainingSessions,
    addTrainingSession,
    deleteTrainingSession,
    transactions,
    verifyPayment,
    addTransaction,
    notices,
    addNotice,
    updateNotice,
    deleteNotice,
    sponsors,
    addSponsor,
    updateSponsor,
    deleteSponsor,
    toggleSponsorActive,
    galleryPhotos,
    addGalleryPhoto,
    updateGalleryPhoto,
    deleteGalleryPhoto,
    siteContent,
    updateSiteContent,
    auditLogs,
    logAction,
    registerRiderFromPublic,
    resetAllAdminData,
    // Real-time Database state and built-in actions
    dbStatus,
    isSyncing,
    lastSyncTime,
    recentDbActions,
    syncAllToCloud,
    seedCloudDatabase,
    reloadFromCloud,
    testDbConnection,
  };
}
