import React from 'react';
import {
  CyclingEvent,
  RiderProfile,
  PaymentTransaction,
  NoticeItem,
  AuditLogEntry,
  AdminRole,
} from '../../types';
import {
  Users,
  GraduationCap,
  Calendar,
  AlertCircle,
  TrendingUp,
  PlusCircle,
  ShieldCheck,
  BellRing,
  Award,
  DollarSign,
  Bike,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  ExternalLink,
} from 'lucide-react';

interface AdminDashboardProps {
  currentRole: AdminRole;
  events: CyclingEvent[];
  riders: RiderProfile[];
  transactions: PaymentTransaction[];
  notices: NoticeItem[];
  auditLogs: AuditLogEntry[];
  onNavigateTab: (tabId: string) => void;
  onOpenQuickAction: (action: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentRole,
  events,
  riders,
  transactions,
  notices,
  auditLogs,
  onNavigateTab,
  onOpenQuickAction,
}) => {
  // Metric calculations
  const totalRiders = riders.length;
  const activeAcademyStudents = riders.filter(
    (r) => r.category === 'Schools & Youth (Senior One)' || r.status === 'Active'
  ).length;
  const upcomingEventsCount = events.filter((e) => e.type === 'upcoming').length;
  const pendingPayments = transactions.filter((t) => t.status === 'Pending');
  const totalVerifiedRevenue = transactions
    .filter((t) => t.status === 'Approved')
    .reduce((sum, t) => sum + t.amountUGX, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner for Manager Solo & Admin Team */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-amber-950/40 border border-zinc-800 p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold font-mono uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Academy Pulse & Executive Command Hub</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
            Together We Can Cycling Uganda Ltd • Operations
          </h2>
          <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
            Welcome, <strong className="text-amber-400">Manager Solo</strong> and Administrative Team.
            Monitor race registrations, verify mobile money transfers for bib numbers, and deploy upcoming circuits from this central command desk.
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-zinc-800/80 flex flex-wrap items-center gap-4 text-xs text-zinc-400">
          <div className="flex items-center gap-1.5 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-300 font-semibold">Live System Operational</span>
          </div>
          <span>•</span>
          <div>Katwe HQ: <strong className="text-white">BMK House, Kampala</strong></div>
          <span>•</span>
          <div>Flagship Circuit: <strong className="text-white">Lubiri Ring Road (105km)</strong></div>
        </div>
      </div>

      {/* 1. Quick Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Registered Riders */}
        <div
          onClick={() => onNavigateTab('crm')}
          className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-amber-500/60 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 font-heading uppercase tracking-wider">
              Total Registered Riders
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-heading">
              {totalRiders}
            </span>
            <span className="text-[11px] text-emerald-400 font-semibold">+12 this month</span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">Across 4 competitive divisions</p>
        </div>

        {/* Active Academy Students */}
        <div
          onClick={() => onNavigateTab('crm')}
          className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-emerald-500/60 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 font-heading uppercase tracking-wider">
              Active Academy Students
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-heading">
              {activeAcademyStudents}
            </span>
            <span className="text-[11px] text-emerald-400 font-semibold">Senior One Focus</span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">Secondary school development riders</p>
        </div>

        {/* Upcoming Events */}
        <div
          onClick={() => onNavigateTab('events')}
          className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-cyan-500/60 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 font-heading uppercase tracking-wider">
              Upcoming Races
            </span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-heading">
              {upcomingEventsCount}
            </span>
            <span className="text-[11px] text-amber-400 font-semibold">Lubiri & Katwe</span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">Flagship with Prime Land Title Prize</p>
        </div>

        {/* Pending Payment Verifications */}
        <div
          onClick={() => onNavigateTab('financials')}
          className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-red-500/60 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 font-heading uppercase tracking-wider">
              Pending Payments
            </span>
            <div className="p-2 rounded-xl bg-red-500/10 text-red-400 group-hover:scale-110 transition-transform">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-400 font-heading">
              {pendingPayments.length}
            </span>
            <span className="text-[11px] text-amber-300 font-semibold font-mono">
              Action Required
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">
            Mobile money transfers waiting for bib approval
          </p>
        </div>
      </div>

      {/* 2. Quick Actions Floating Shortcut Panel */}
      <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-extrabold text-white font-heading uppercase tracking-wider">
              Quick Action Shortcuts
            </h4>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">Instant operational workflows</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => onOpenQuickAction('create_event')}
            className="p-3.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500 text-left transition-all cursor-pointer group"
          >
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 w-fit mb-2 group-hover:scale-105 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-white font-heading group-hover:text-amber-400">
              Deploy New Race
            </p>
            <p className="text-[11px] text-zinc-500 line-clamp-1">Lubiri or regional circuit</p>
          </button>

          <button
            onClick={() => onOpenQuickAction('verify_payment')}
            className="p-3.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:border-emerald-500 text-left transition-all cursor-pointer group"
          >
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 w-fit mb-2 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-white font-heading group-hover:text-emerald-400">
              Verify Rider Payment
            </p>
            <p className="text-[11px] text-zinc-500 line-clamp-1">Approve MoMo & issue bib</p>
          </button>

          <button
            onClick={() => onOpenQuickAction('post_notice')}
            className="p-3.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:border-cyan-500 text-left transition-all cursor-pointer group"
          >
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 w-fit mb-2 group-hover:scale-105 transition-transform">
              <BellRing className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-white font-heading group-hover:text-cyan-400">
              Post Official Notice
            </p>
            <p className="text-[11px] text-zinc-500 line-clamp-1">Press briefs & tour updates</p>
          </button>

          <button
            onClick={() => onOpenQuickAction('log_training')}
            className="p-3.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:border-orange-500 text-left transition-all cursor-pointer group"
          >
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400 w-fit mb-2 group-hover:scale-105 transition-transform">
              <Bike className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-white font-heading group-hover:text-orange-400">
              Log Training Session
            </p>
            <p className="text-[11px] text-zinc-500 line-clamp-1">Track helmets, kits & laps</p>
          </button>
        </div>
      </div>

      {/* 3. Split Layout: Recent Activity Feed + Financial Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Activity Feed */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white font-heading uppercase tracking-wide">
                Recent Activity & Registration Feed
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('security')}
              className="text-xs text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View Audit Logs</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {auditLogs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{log.action}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-amber-400 border border-zinc-700 font-mono">
                      {log.module}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-[11px]">{log.details}</p>
                  <p className="text-[10px] text-zinc-500 font-mono">
                    By: {log.adminName}
                  </p>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono whitespace-nowrap">
                  {log.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Financials & Payment Verification Queue Snapshot */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white font-heading uppercase tracking-wide">
                Verification Queue ({pendingPayments.length})
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('financials')}
              className="text-xs text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Manage Ledger</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="text-xs text-zinc-400">Total Verified Collections:</span>
              <span className="text-sm font-extrabold text-emerald-400 font-mono">
                UGX {totalVerifiedRevenue.toLocaleString()}
              </span>
            </div>

            {pendingPayments.length === 0 ? (
              <div className="py-6 text-center text-xs text-zinc-500 space-y-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto" />
                <p>All mobile money transactions verified and cleared.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {pendingPayments.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <p className="font-bold text-white">{item.payerName}</p>
                      <p className="text-[11px] text-zinc-400 font-mono">
                        {item.referenceId} • {item.paymentMethod}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-amber-400 font-mono">
                        UGX {item.amountUGX.toLocaleString()}
                      </span>
                      <button
                        onClick={() => onNavigateTab('financials')}
                        className="block mt-1 text-[10px] text-emerald-400 hover:underline cursor-pointer"
                      >
                        Verify & Issue Bib →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
