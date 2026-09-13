import React from 'react';
import { AdminRole, AuditLogEntry } from '../../types';
import {
  ShieldCheck,
  Lock,
  UserCheck,
  Eye,
  Key,
  Clock,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Fingerprint,
} from 'lucide-react';

interface AdminSettingsSecurityProps {
  currentRole: AdminRole;
  onChangeRole: (role: AdminRole) => void;
  auditLogs: AuditLogEntry[];
  onResetData: () => void;
}

export const AdminSettingsSecurity: React.FC<AdminSettingsSecurityProps> = ({
  currentRole,
  onChangeRole,
  auditLogs,
  onResetData,
}) => {
  const isSuperAdmin = currentRole === 'super_admin';

  return (
    <div className="space-y-8">
      {/* 1. RBAC Matrix & Role Delegation */}
      <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
          <Fingerprint className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="text-sm font-extrabold text-white font-heading uppercase tracking-wide">
              Role-Based Access Control (RBAC) Architecture
            </h3>
            <p className="text-xs text-zinc-400">
              Control privileges across TWC Cycling Academy administrative staff and race commissaires.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Role 1: Super Admin */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              currentRole === 'super_admin'
                ? 'bg-amber-500/10 border-amber-500/60 shadow-lg'
                : 'bg-zinc-950 border-zinc-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 font-heading">
                Super Admin
              </span>
              {currentRole === 'super_admin' && (
                <span className="text-[10px] bg-amber-500 text-black font-bold px-2 py-0.5 rounded-full">
                  Active
                </span>
              )}
            </div>
            <h4 className="text-sm font-bold text-white mt-1">
              Director / Manager Solo
            </h4>
            <p className="text-xs text-zinc-400 mt-1">
              Solomon Ssebakaki
            </p>
            <div className="mt-3 pt-3 border-t border-zinc-800/80 text-xs text-zinc-300 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Full System Authority</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Financial Ledger & Payouts</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>CMS, Sponsors & Audits</span>
              </div>
            </div>
            <button
              onClick={() => onChangeRole('super_admin')}
              className="w-full mt-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-white font-medium cursor-pointer transition-colors"
            >
              Switch To Super Admin
            </button>
          </div>

          {/* Role 2: Race Coordinator */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              currentRole === 'race_coordinator'
                ? 'bg-cyan-500/10 border-cyan-500/60 shadow-lg'
                : 'bg-zinc-950 border-zinc-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 font-heading">
                Race Coordinator
              </span>
              {currentRole === 'race_coordinator' && (
                <span className="text-[10px] bg-cyan-500 text-black font-bold px-2 py-0.5 rounded-full">
                  Active
                </span>
              )}
            </div>
            <h4 className="text-sm font-bold text-white mt-1">
              Events & Timing Lead
            </h4>
            <p className="text-xs text-zinc-400 mt-1">
              David M. (Lubiri Commissaire)
            </p>
            <div className="mt-3 pt-3 border-t border-zinc-800/80 text-xs text-zinc-300 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Event & Route Deployments</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Leaderboard Chip Times</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-500">
                <Lock className="w-3.5 h-3.5" />
                <span>Financials Restricted (Read Only)</span>
              </div>
            </div>
            <button
              onClick={() => onChangeRole('race_coordinator')}
              className="w-full mt-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-white font-medium cursor-pointer transition-colors"
            >
              Switch To Race Coordinator
            </button>
          </div>

          {/* Role 3: Academy Trainer */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              currentRole === 'academy_trainer'
                ? 'bg-emerald-500/10 border-emerald-500/60 shadow-lg'
                : 'bg-zinc-950 border-zinc-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 font-heading">
                Academy Trainer
              </span>
              {currentRole === 'academy_trainer' && (
                <span className="text-[10px] bg-emerald-500 text-black font-bold px-2 py-0.5 rounded-full">
                  Active
                </span>
              )}
            </div>
            <h4 className="text-sm font-bold text-white mt-1">
              Cadet & Kit Coordinator
            </h4>
            <p className="text-xs text-zinc-400 mt-1">
              Coach Isaac Kisekka
            </p>
            <div className="mt-3 pt-3 border-t border-zinc-800/80 text-xs text-zinc-300 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Rider CRM & Student Records</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Equipment & Helmet Checks</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-500">
                <Lock className="w-3.5 h-3.5" />
                <span>Website CMS Restricted</span>
              </div>
            </div>
            <button
              onClick={() => onChangeRole('academy_trainer')}
              className="w-full mt-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-white font-medium cursor-pointer transition-colors"
            >
              Switch To Trainer
            </button>
          </div>
        </div>
      </div>

      {/* 2. Read-Only Security Audit Logs Timeline */}
      <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm font-extrabold text-white font-heading uppercase tracking-wide">
                Security Audit Logs (Read-Only Timeline)
              </h3>
              <p className="text-xs text-zinc-400">
                Immutable record tracking all administrative modifications across TWC systems.
              </p>
            </div>
          </div>
          <span className="text-[10px] px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-400 font-mono border border-zinc-700">
            {auditLogs.length} Total Logs
          </span>
        </div>

        <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{log.action}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-800 text-amber-300 font-mono uppercase">
                    {log.module}
                  </span>
                </div>
                <p className="text-zinc-400 text-[11px]">{log.details}</p>
                <p className="text-[10px] text-zinc-500 font-mono">
                  Account: <strong className="text-zinc-300">{log.adminName}</strong> ({log.adminRole})
                </p>
              </div>

              <span className="text-[10px] text-zinc-500 font-mono whitespace-nowrap self-end sm:self-center">
                {log.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. System Storage & Reset Controls (Super Admin Only) */}
      {isSuperAdmin && (
        <div className="p-6 rounded-2xl bg-zinc-900 border border-red-950/60 space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <h4 className="text-xs font-bold text-white font-heading uppercase tracking-wide">
              Danger Zone • Master Data Reset
            </h4>
          </div>
          <p className="text-xs text-zinc-400">
            Reset all admin modules (events, rider directory, transactions, and audit logs) back to initial factory baseline.
          </p>
          <button
            type="button"
            onClick={() => {
              if (
                confirm(
                  'Are you sure you want to restore the TWC admin database to initial factory defaults? This clears custom entries from local storage.'
                )
              ) {
                onResetData();
              }
            }}
            className="px-4 py-2 rounded-xl bg-red-950 hover:bg-red-900 text-red-200 border border-red-800/60 text-xs font-bold font-heading flex items-center gap-2 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Admin Database to Defaults</span>
          </button>
        </div>
      )}
    </div>
  );
};
