import React from 'react';
import { AdminRole } from '../../types';
import { ShieldCheck, UserCheck, KeyRound, Sparkles, X, ChevronDown, CheckCircle2 } from 'lucide-react';

interface AdminHeaderProps {
  currentRole: AdminRole;
  onChangeRole: (role: AdminRole) => void;
  onClose: () => void;
  onLogout: () => void;
  activeModuleTitle: string;
  dbStatus?: 'connected' | 'offline' | 'connecting' | 'error';
  onOpenDatabaseSync?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  currentRole,
  onChangeRole,
  onClose,
  onLogout,
  activeModuleTitle,
  dbStatus = 'connected',
  onOpenDatabaseSync,
}) => {
  const roleBadges: Record<
    AdminRole,
    { label: string; moniker: string; badgeClass: string; icon: string }
  > = {
    super_admin: {
      label: 'Super Admin',
      moniker: 'Director / Manager Solo',
      badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      icon: 'Crown',
    },
    race_coordinator: {
      label: 'Race Coordinator',
      moniker: 'Events & Results Lead',
      badgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      icon: 'Flag',
    },
    academy_trainer: {
      label: 'Academy Trainer',
      moniker: 'Roster & Training Lead',
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      icon: 'Bike',
    },
  };

  const badge = roleBadges[currentRole];

  return (
    <div className="bg-zinc-900/90 border-b border-zinc-800 px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Club & Panel Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500 text-black font-black flex items-center justify-center font-heading text-lg shadow-lg shadow-amber-500/20 flex-shrink-0">
          TWC
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-white font-heading text-base sm:text-lg tracking-wide uppercase">
              TWC Operations Control
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono">
              code5 v2.5
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Together We Can Cycling Uganda Ltd • Katwe & Lubiri Circuit Operations
          </p>
        </div>
      </div>

      {/* RBAC Role Switcher & Actions */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Cloud Firestore Status Indicator */}
        <button
          onClick={onOpenDatabaseSync}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:border-emerald-500/40 text-xs font-mono transition-all cursor-pointer"
          title="Open Cloud Database Hub"
        >
          <span className={`w-2 h-2 rounded-full ${dbStatus === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          <span className="text-zinc-300 text-[11px]">
            Cloud DB: <strong className={dbStatus === 'connected' ? 'text-emerald-400' : 'text-amber-400'}>{dbStatus === 'connected' ? 'Connected' : dbStatus}</strong>
          </span>
        </button>

        {/* Role Selector */}
        <div className="flex items-center gap-2 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800">
          <span className="text-[11px] text-zinc-400 pl-2 font-mono flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Active RBAC:</span>
          </span>
          <select
            value={currentRole}
            onChange={(e) => onChangeRole(e.target.value as AdminRole)}
            className="bg-zinc-900 text-xs font-semibold text-white px-2.5 py-1.5 rounded-lg border border-zinc-700 focus:outline-none focus:border-amber-500 cursor-pointer"
            aria-label="Select Active Administrator Role"
          >
            <option value="super_admin">Super Admin (Manager Solo)</option>
            <option value="race_coordinator">Race Coordinator</option>
            <option value="academy_trainer">Academy Trainer</option>
          </select>
          <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${badge.badgeClass}`}>
            {badge.label}
          </span>
        </div>

        {/* Lock / Sign Out */}
        <button
          onClick={onLogout}
          className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
          title="Lock Admin Session"
        >
          <KeyRound className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Lock</span>
        </button>

        {/* Close Modal */}
        <button
          onClick={onClose}
          className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white cursor-pointer transition-colors"
          title="Close Admin Panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
