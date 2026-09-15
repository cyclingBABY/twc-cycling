import React, { useState } from 'react';
import { DatabaseActionRecord } from '../../services/dbService';
import { firestoreDatabaseId } from '../../lib/firebase';
import {
  Database,
  Cloud,
  CloudCheck,
  RefreshCw,
  UploadCloud,
  DownloadCloud,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Layers,
  Activity,
  ArrowRight,
} from 'lucide-react';

interface DatabaseSyncCenterProps {
  dbStatus: 'connected' | 'offline' | 'connecting' | 'error';
  isSyncing: boolean;
  lastSyncTime: string | null;
  recentActions: DatabaseActionRecord[];
  onSyncAll: () => Promise<void>;
  onSeedCloud: () => Promise<void>;
  onReloadCloud: () => Promise<void>;
  onTestConnection: () => Promise<void>;
  counts: {
    events: number;
    notices: number;
    riders: number;
    results: number;
    sponsors: number;
    gallery: number;
  };
}

export const DatabaseSyncCenter: React.FC<DatabaseSyncCenterProps> = ({
  dbStatus,
  isSyncing,
  lastSyncTime,
  recentActions,
  onSyncAll,
  onSeedCloud,
  onReloadCloud,
  onTestConnection,
  counts,
}) => {
  const [activeMessage, setActiveMessage] = useState<string | null>(null);

  const handleAction = async (fn: () => Promise<void>, msg: string) => {
    setActiveMessage(msg);
    try {
      await fn();
      setTimeout(() => setActiveMessage(null), 3500);
    } catch (e: any) {
      setActiveMessage(`Error: ${e?.message || 'Operation failed'}`);
      setTimeout(() => setActiveMessage(null), 4000);
    }
  };

  const isConnected = dbStatus === 'connected';

  return (
    <div className="space-y-6">
      {/* Database Connection Status Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border border-emerald-500/30 p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-base font-bold text-white font-heading">
                  Cloud Firestore Database Engine
                </h3>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {isConnected ? 'Connected & Live' : dbStatus}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
                All posts, content edits, announcements, and deletions are automatically synchronized in real time to the Google Cloud Firestore database.
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-3 text-[11px] text-zinc-400 font-mono">
                <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                  DB ID: {firestoreDatabaseId}
                </span>
                {lastSyncTime && (
                  <span className="flex items-center gap-1 text-zinc-400">
                    <Clock className="w-3 h-3 text-amber-400" />
                    Last Synced: {lastSyncTime}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Cloud Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => handleAction(onSyncAll, 'Synchronizing all records to Firestore cloud...')}
              disabled={isSyncing}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              title="Push all in-memory events, notices, riders and settings to Cloud Firestore"
            >
              <UploadCloud className={`w-4 h-4 ${isSyncing ? 'animate-bounce' : ''}`} />
              <span>Save & Sync All to Cloud</span>
            </button>

            <button
              onClick={() => handleAction(onSeedCloud, 'Populating Cloud Firestore with baseline records...')}
              disabled={isSyncing}
              className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-zinc-200 text-xs font-semibold transition-all border border-zinc-700 flex items-center gap-1.5 cursor-pointer"
              title="Seed initial events, notices, and club content if Firestore is empty"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Seed Cloud DB</span>
            </button>

            <button
              onClick={() => handleAction(onReloadCloud, 'Pulling fresh documents from Firestore cloud...')}
              disabled={isSyncing}
              className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-zinc-300 text-xs font-medium transition-all border border-zinc-700 flex items-center gap-1.5 cursor-pointer"
              title="Reload fresh documents from Firestore"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-amber-400' : ''}`} />
              <span>Reload</span>
            </button>

            <button
              onClick={() => handleAction(onTestConnection, 'Verifying connection to Firestore cloud...')}
              disabled={isSyncing}
              className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 text-xs transition-all border border-zinc-800 flex items-center gap-1.5 cursor-pointer"
              title="Ping test Firestore connectivity"
            >
              <CloudCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Test Ping</span>
            </button>
          </div>
        </div>

        {/* Live Feedback Toast Banner */}
        {activeMessage && (
          <div className="mt-4 p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs text-amber-200 flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-medium">{activeMessage}</span>
          </div>
        )}
      </div>

      {/* Database Entity Counter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Notices & Press', count: counts.notices, col: 'notices', icon: AlertCircle },
          { label: 'Events & Races', count: counts.events, col: 'events', icon: Layers },
          { label: 'Riders Profile', count: counts.riders, col: 'riders', icon: Database },
          { label: 'Podium Results', count: counts.results, col: 'results', icon: Sparkles },
          { label: 'Sponsors & Brands', count: counts.sponsors, col: 'sponsors', icon: Cloud },
          { label: 'Gallery Photos', count: counts.gallery, col: 'gallery', icon: Activity },
        ].map((item, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-zinc-400 mb-1">
              <span className="text-[11px] font-medium">{item.label}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-xl font-extrabold text-white font-mono">{item.count}</span>
              <span className="text-[10px] text-zinc-400 font-mono">/{item.col}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Real-time Activity Stream: POST, EDIT, DELETE Log */}
      <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 font-heading">
              Live Database Capture Feed (POST, EDIT, DELETE Stream)
            </h4>
          </div>
          <span className="text-[11px] text-zinc-400 font-mono">
            {recentActions.length} Action{recentActions.length !== 1 ? 's' : ''} Captured
          </span>
        </div>

        {recentActions.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-zinc-950/50 border border-zinc-800/80 text-zinc-400 text-xs">
            <Database className="w-8 h-8 text-zinc-600 mx-auto mb-2 opacity-50" />
            <p className="font-medium text-zinc-300">Ready to capture changes in real time</p>
            <p className="text-zinc-400 mt-1">
              Any notice posted, race edited, rider profile updated, or photo deleted will appear here and persist immediately to Google Cloud Firestore.
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {recentActions.slice(0, 15).map((act) => {
              const badgeColors = {
                POST: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
                EDIT: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
                DELETE: 'bg-red-500/20 text-red-400 border-red-500/30',
              };

              return (
                <div
                  key={act.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/70 hover:border-zinc-700 transition-colors text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        badgeColors[act.type] || 'bg-zinc-800 text-zinc-300'
                      }`}
                    >
                      {act.type}
                    </span>
                    <div>
                      <div className="text-zinc-200 font-medium">{act.summary}</div>
                      <div className="text-[10px] text-zinc-400 font-mono">
                        Collection: <span className="text-zinc-400">{act.collectionName}</span> • Doc: {act.documentId}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-right">
                    <span className="text-[10px] text-zinc-400 font-mono">{act.timestamp}</span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Synced
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
