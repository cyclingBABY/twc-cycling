import React, { useState } from 'react';
import { PaymentTransaction, AdminRole } from '../../types';
import {
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Plus,
  Filter,
  Check,
  Smartphone,
  CreditCard,
  FileCheck,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';

interface AdminFinancialsProps {
  currentRole: AdminRole;
  transactions: PaymentTransaction[];
  onVerifyPayment: (txId: string, status: 'Approved' | 'Rejected' | 'On Hold', bib?: string) => void;
  onAddTransaction: (tx: PaymentTransaction) => void;
}

export const AdminFinancials: React.FC<AdminFinancialsProps> = ({
  currentRole,
  transactions,
  onVerifyPayment,
  onAddTransaction,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [manualBibInputs, setManualBibInputs] = useState<Record<string, string>>({});
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const isSuperAdmin = currentRole === 'super_admin';

  // Manual payment entry state
  const [newTxForm, setNewTxForm] = useState<Partial<PaymentTransaction>>({
    referenceId: 'MTN-MM-',
    payerName: '',
    amountUGX: 50000,
    paymentMethod: 'MTN MoMo',
    purpose: 'Race Registration Fee',
    status: 'Approved',
  });

  const pendingQueue = transactions.filter((t) => t.status === 'Pending');
  const approvedTotal = transactions
    .filter((t) => t.status === 'Approved')
    .reduce((sum, t) => sum + t.amountUGX, 0);

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.payerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.referenceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.bibAssigned && t.bibAssigned.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (filterStatus === 'all') return true;
    return t.status.toLowerCase() === filterStatus.toLowerCase();
  });

  const handleVerify = (txId: string, status: 'Approved' | 'Rejected' | 'On Hold') => {
    const customBib = manualBibInputs[txId];
    onVerifyPayment(txId, status, customBib);

    const tx = transactions.find((t) => t.id === txId);
    setActionSuccessMsg(
      `Payment ${tx?.referenceId} marked as ${status}. ${
        status === 'Approved' ? `Bib confirmed for ${tx?.payerName}!` : ''
      }`
    );
    setTimeout(() => setActionSuccessMsg(null), 3500);
  };

  const handleCreateTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTxForm.payerName || !newTxForm.referenceId) return;

    const newTx: PaymentTransaction = {
      id: `txn-${Date.now()}`,
      referenceId: newTxForm.referenceId,
      payerName: newTxForm.payerName,
      amountUGX: Number(newTxForm.amountUGX) || 50000,
      paymentMethod: (newTxForm.paymentMethod as any) || 'MTN MoMo',
      purpose: (newTxForm.purpose as any) || 'Race Registration Fee',
      timestamp: 'Just now',
      status: (newTxForm.status as any) || 'Approved',
      bibAssigned: `TWC-REC-${Math.floor(100 + Math.random() * 900)}`,
      verifiedBy: 'Super Admin',
    };

    onAddTransaction(newTx);
    setShowAddForm(false);
    setActionSuccessMsg(`Transaction ${newTx.referenceId} saved to master ledger!`);
    setTimeout(() => setActionSuccessMsg(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Action Banner */}
      {actionSuccessMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold font-heading uppercase">
            <span>Verified Collections</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
            UGX {approvedTotal.toLocaleString()}
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">Race entries, kits & local sponsors</p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900 border border-amber-500/30">
          <div className="flex items-center justify-between text-xs text-amber-400 font-semibold font-heading uppercase">
            <span>Pending Verification Queue</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
            {pendingQueue.length} Transax
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">Waiting for mobile money clearance</p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold font-heading uppercase">
            <span>Payment Channels Active</span>
            <Smartphone className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xs text-zinc-300 space-y-1 mt-2 font-mono">
            <div>• MTN MoMo: <strong className="text-white">+256 706 770 872</strong></div>
            <div>• Airtel Money: <strong className="text-white">+256 763 145 915</strong></div>
          </div>
        </div>
      </div>

      {/* Verification Queue (Module 4 Priority Section) */}
      <div className="p-6 rounded-2xl bg-zinc-900 border border-amber-500/40 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-extrabold text-white font-heading uppercase tracking-wide">
              Payment Verification Queue ({pendingQueue.length})
            </h3>
          </div>
          <p className="text-xs text-zinc-400">
            Click to approve mobile money receipt and allocate official race bib number.
          </p>
        </div>

        {pendingQueue.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-500 space-y-1">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto opacity-70" />
            <p className="font-semibold text-zinc-300">All payment queues are clear!</p>
            <p>New mobile money race submissions will appear here instantly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingQueue.map((tx) => (
              <div
                key={tx.id}
                className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {tx.referenceId}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold uppercase">
                      {tx.paymentMethod}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mt-1.5">{tx.payerName}</h4>
                  <div className="flex items-center justify-between text-xs mt-1 text-zinc-400">
                    <span>Purpose: <strong className="text-zinc-300">{tx.purpose}</strong></span>
                    <span className="font-mono text-emerald-400 font-bold">
                      UGX {tx.amountUGX.toLocaleString()}
                    </span>
                  </div>

                  {/* Optional Custom Bib Input */}
                  <div className="mt-3 pt-2 border-t border-zinc-800/80">
                    <label className="text-[10px] text-zinc-400 block mb-1">
                      Assigned Bib # (Default: {tx.bibAssigned || 'Auto-generated'})
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. TWC-ELI-105"
                      value={manualBibInputs[tx.id] || ''}
                      onChange={(e) =>
                        setManualBibInputs({ ...manualBibInputs, [tx.id]: e.target.value })
                      }
                      className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-white font-mono"
                    />
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="pt-3 border-t border-zinc-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleVerify(tx.id, 'On Hold')}
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium cursor-pointer"
                      title="Hold for telephone verification"
                    >
                      Hold
                    </button>
                    <button
                      type="button"
                      onClick={() => handleVerify(tx.id, 'Rejected')}
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-red-950 text-red-400 text-xs font-medium cursor-pointer"
                      title="Reject Invalid Ref"
                    >
                      Reject
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleVerify(tx.id, 'Approved')}
                    className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-heading flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-950/40"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve & Issue Bib</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Transaction Master Ledger */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ledger by payer, ref code, bib..."
              className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  filterStatus === 'all' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('approved')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  filterStatus === 'approved' ? 'bg-emerald-500 text-black' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Approved
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  filterStatus === 'pending' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Pending
              </button>
            </div>

            {isSuperAdmin && (
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold font-heading flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Record Payment</span>
              </button>
            )}
          </div>
        </div>

        {/* Record Payment Form */}
        {showAddForm && (
          <form
            onSubmit={handleCreateTransaction}
            className="p-6 rounded-2xl bg-zinc-900 border border-amber-500/40 space-y-4 shadow-xl animate-in fade-in"
          >
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider font-heading">
              <DollarSign className="w-4 h-4" />
              <span>Record Manual Payment / Sponsor Donation</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Transaction Ref ID *</label>
                <input
                  type="text"
                  required
                  value={newTxForm.referenceId || ''}
                  onChange={(e) => setNewTxForm({ ...newTxForm, referenceId: e.target.value })}
                  placeholder="e.g. MTN-MM-94821034"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white font-mono"
                />
              </div>

              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Payer Name / Sponsor *</label>
                <input
                  type="text"
                  required
                  value={newTxForm.payerName || ''}
                  onChange={(e) => setNewTxForm({ ...newTxForm, payerName: e.target.value })}
                  placeholder="e.g. Century Properties Uganda"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Amount (UGX) *</label>
                <input
                  type="number"
                  required
                  value={newTxForm.amountUGX || 50000}
                  onChange={(e) => setNewTxForm({ ...newTxForm, amountUGX: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white font-mono"
                />
              </div>

              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Payment Method</label>
                <select
                  value={newTxForm.paymentMethod || 'MTN MoMo'}
                  onChange={(e) => setNewTxForm({ ...newTxForm, paymentMethod: e.target.value as any })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white"
                >
                  <option value="MTN MoMo">MTN MoMo (+256 706 770 872)</option>
                  <option value="Airtel Money">Airtel Money (+256 763 145 915)</option>
                  <option value="Bank Transfer">Bank Wire Transfer</option>
                  <option value="Cash Receipt">Cash Receipt (BMK House Desk)</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Payment Purpose</label>
                <select
                  value={newTxForm.purpose || 'Race Registration Fee'}
                  onChange={(e) => setNewTxForm({ ...newTxForm, purpose: e.target.value as any })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white"
                >
                  <option value="Race Registration Fee">Race Registration Fee (Lubiri)</option>
                  <option value="Academy Term Kit">Academy Term Kit / Jersey</option>
                  <option value="Sponsor Contribution">Sponsor Contribution / Donation</option>
                  <option value="Licensing Fee">Licensing Fee</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Initial Status</label>
                <select
                  value={newTxForm.status || 'Approved'}
                  onChange={(e) => setNewTxForm({ ...newTxForm, status: e.target.value as any })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white"
                >
                  <option value="Approved">Approved (Immediate Cleared)</option>
                  <option value="Pending">Pending Verification</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold font-heading cursor-pointer shadow-lg"
              >
                Post to Master Ledger
              </button>
            </div>
          </form>
        )}

        {/* Master Ledger Table */}
        <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900 shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950 text-zinc-400 uppercase tracking-wider font-mono text-[10px] border-b border-zinc-800">
              <tr>
                <th className="px-4 py-3">Reference ID</th>
                <th className="px-4 py-3">Payer Name</th>
                <th className="px-4 py-3">Amount (UGX)</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Purpose</th>
                <th className="px-4 py-3">Assigned Bib</th>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-zinc-200">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-amber-400">
                    {tx.referenceId}
                  </td>
                  <td className="px-4 py-3 font-bold text-white">{tx.payerName}</td>
                  <td className="px-4 py-3 font-mono font-bold text-emerald-400">
                    UGX {tx.amountUGX.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-zinc-300">{tx.paymentMethod}</td>
                  <td className="px-4 py-3 text-zinc-400">{tx.purpose}</td>
                  <td className="px-4 py-3 font-mono text-amber-300">
                    {tx.bibAssigned || '—'}
                  </td>
                  <td className="px-4 py-3 text-zinc-500 font-mono text-[11px]">{tx.timestamp}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        tx.status === 'Approved'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : tx.status === 'Pending'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : tx.status === 'On Hold'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
