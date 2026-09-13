import React, { useState } from 'react';
import {
  RiderProfile,
  TrainingSession,
  AdminRole,
} from '../../types';
import {
  Users,
  Search,
  Filter,
  Plus,
  Trash2,
  Edit3,
  GraduationCap,
  Bike,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Wrench,
  Sparkles,
  Phone,
  Mail,
  Award,
} from 'lucide-react';

interface AdminRiderCRMProps {
  currentRole: AdminRole;
  riders: RiderProfile[];
  trainingSessions: TrainingSession[];
  onAddRider: (rider: RiderProfile) => void;
  onUpdateRider: (rider: RiderProfile) => void;
  onDeleteRider: (id: string) => void;
  onAddTrainingSession: (session: TrainingSession) => void;
  onDeleteTrainingSession: (id: string) => void;
}

export const AdminRiderCRM: React.FC<AdminRiderCRMProps> = ({
  currentRole,
  riders,
  trainingSessions,
  onAddRider,
  onUpdateRider,
  onDeleteRider,
  onAddTrainingSession,
  onDeleteTrainingSession,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'directory' | 'training'>('directory');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [showRiderForm, setShowRiderForm] = useState(false);
  const [showTrainingForm, setShowTrainingForm] = useState(false);

  const canEdit = currentRole === 'super_admin' || currentRole === 'academy_trainer';

  // Rider Form State
  const [riderForm, setRiderForm] = useState<Partial<RiderProfile>>({
    name: '',
    category: 'Schools & Youth (Senior One)',
    age: 14,
    licensingLevel: 'School Competitor (Senior One)',
    contactPhone: '+256 ',
    email: '',
    schoolOrClub: '',
    bibNumber: '',
    paymentStatus: 'Pending Verification',
    status: 'Active',
  });

  // Training Session Form State
  const [trainingForm, setTrainingForm] = useState<Partial<TrainingSession>>({
    date: new Date().toLocaleDateString('en-GB', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    location: 'Lubiri Ring Road Circuit (Mengo)',
    focus: 'Echelon Drafting & Pack Pacing (30km)',
    trainerName: 'Manager Solo (Solomon Ssebakaki)',
    attendanceCount: 30,
    equipmentChecked: {
      helmets: 30,
      jerseys: 28,
      bikesInspected: 30,
    },
    notes: 'Safety checks complete. Zero mechanical DNFs during pack simulation.',
  });

  // Filter riders
  const filteredRiders = riders.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.bibNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.schoolOrClub.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.contactPhone.includes(searchQuery);

    if (!matchesSearch) return false;

    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'schools') return r.category.includes('Schools');
    if (selectedFilter === 'elite') return r.category.includes('Elite');
    if (selectedFilter === 'armed') return r.category.includes('Armed');
    if (selectedFilter === 'fans') return r.category.includes('Family');
    if (selectedFilter === 'pending') return r.paymentStatus === 'Pending Verification';

    return true;
  });

  const handleSaveRider = (e: React.FormEvent) => {
    e.preventDefault();
    if (!riderForm.name) return;

    const bib =
      riderForm.bibNumber ||
      `TWC-${riderForm.category?.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const newRider: RiderProfile = {
      id: `rdr-${Date.now()}`,
      name: riderForm.name,
      category: (riderForm.category as any) || 'Schools & Youth (Senior One)',
      age: Number(riderForm.age) || 14,
      licensingLevel: (riderForm.licensingLevel as any) || 'School Competitor (Senior One)',
      contactPhone: riderForm.contactPhone || '+256 706 770 872',
      email: riderForm.email || '',
      schoolOrClub: riderForm.schoolOrClub || 'Independent',
      bibNumber: bib,
      paymentStatus: (riderForm.paymentStatus as any) || 'Approved',
      dateJoined: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: (riderForm.status as any) || 'Active',
    };

    onAddRider(newRider);
    setShowRiderForm(false);
    setRiderForm({
      name: '',
      category: 'Schools & Youth (Senior One)',
      age: 14,
      licensingLevel: 'School Competitor (Senior One)',
      contactPhone: '+256 ',
      email: '',
      schoolOrClub: '',
      bibNumber: '',
      paymentStatus: 'Pending Verification',
      status: 'Active',
    });
  };

  const handleSaveTraining = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trainingForm.focus) return;

    const newSession: TrainingSession = {
      id: `trn-${Date.now()}`,
      date: trainingForm.date || 'Training Date',
      location: trainingForm.location || 'Lubiri Ring Road Circuit',
      focus: trainingForm.focus,
      trainerName: trainingForm.trainerName || 'Manager Solo',
      attendanceCount: Number(trainingForm.attendanceCount) || 25,
      equipmentChecked: {
        helmets: Number(trainingForm.equipmentChecked?.helmets) || 25,
        jerseys: Number(trainingForm.equipmentChecked?.jerseys) || 25,
        bikesInspected: Number(trainingForm.equipmentChecked?.bikesInspected) || 25,
      },
      notes: trainingForm.notes || 'Training completed in good order.',
    };

    onAddTrainingSession(newSession);
    setShowTrainingForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Subtab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2 bg-zinc-900 p-1 rounded-xl border border-zinc-800 self-start">
          <button
            onClick={() => setActiveSubTab('directory')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'directory'
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Rider Directory ({riders.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('training')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'training'
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Bike className="w-3.5 h-3.5" />
            <span>Attendance & Training Log ({trainingSessions.length})</span>
          </button>
        </div>

        {canEdit ? (
          <div>
            {activeSubTab === 'directory' && (
              <button
                onClick={() => setShowRiderForm(!showRiderForm)}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold font-heading flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>{showRiderForm ? 'Close Enrollment' : 'Enroll New Rider'}</span>
              </button>
            )}

            {activeSubTab === 'training' && (
              <button
                onClick={() => setShowTrainingForm(!showTrainingForm)}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold font-heading flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>{showTrainingForm ? 'Close Log Form' : 'Log Training Session'}</span>
              </button>
            )}
          </div>
        ) : (
          <span className="text-[11px] text-amber-400/80 bg-amber-500/10 px-3 py-1 rounded-md border border-amber-500/20 font-mono">
            Read-only mode for current role
          </span>
        )}
      </div>

      {/* 1. SUBTAB: RIDER DIRECTORY */}
      {activeSubTab === 'directory' && (
        <div className="space-y-4">
          {/* Search & Advanced Category Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search riders by name, bib number, club, phone..."
                className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  selectedFilter === 'all' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'
                }`}
              >
                All ({riders.length})
              </button>
              <button
                onClick={() => setSelectedFilter('schools')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  selectedFilter === 'schools' ? 'bg-emerald-500 text-black' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Senior One & Schools
              </button>
              <button
                onClick={() => setSelectedFilter('elite')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  selectedFilter === 'elite' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Elite Field
              </button>
              <button
                onClick={() => setSelectedFilter('armed')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  selectedFilter === 'armed' ? 'bg-cyan-500 text-black' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Armed Forces
              </button>
              <button
                onClick={() => setSelectedFilter('pending')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  selectedFilter === 'pending' ? 'bg-red-500 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Pending Verification
              </button>
            </div>
          </div>

          {/* Enroll Rider Form */}
          {showRiderForm && (
            <form
              onSubmit={handleSaveRider}
              className="p-6 rounded-2xl bg-zinc-900 border border-amber-500/40 space-y-4 shadow-xl animate-in fade-in"
            >
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider font-heading">
                <Users className="w-4 h-4" />
                <span>Enroll Rider Into Academy CRM</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Full Official Name *</label>
                  <input
                    type="text"
                    required
                    value={riderForm.name || ''}
                    onChange={(e) => setRiderForm({ ...riderForm, name: e.target.value })}
                    placeholder="e.g. Nalubega Prossy"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Assigned Division / Category *</label>
                  <select
                    value={riderForm.category || 'Schools & Youth (Senior One)'}
                    onChange={(e) => setRiderForm({ ...riderForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white"
                  >
                    <option value="Schools & Youth (Senior One)">Schools & Youth (Senior One)</option>
                    <option value="Elite Field">Elite Field (105km)</option>
                    <option value="Armed Forces Field">Armed Forces Field</option>
                    <option value="Family & Fans">Family & Fans</option>
                  </select>
                </div>

                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Age</label>
                  <input
                    type="number"
                    value={riderForm.age || 14}
                    onChange={(e) => setRiderForm({ ...riderForm, age: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Licensing Level</label>
                  <select
                    value={riderForm.licensingLevel || 'School Competitor (Senior One)'}
                    onChange={(e) => setRiderForm({ ...riderForm, licensingLevel: e.target.value as any })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white"
                  >
                    <option value="School Competitor (Senior One)">School Competitor (Senior One)</option>
                    <option value="Academy Cadet">Academy Cadet</option>
                    <option value="UCF / UCI Licensed">UCF / UCI Licensed Pro</option>
                    <option value="Club Veteran">Club Veteran</option>
                  </select>
                </div>

                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Primary Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={riderForm.contactPhone || '+256 '}
                    onChange={(e) => setRiderForm({ ...riderForm, contactPhone: e.target.value })}
                    placeholder="+256 706 770 872"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">School / Club Affiliation</label>
                  <input
                    type="text"
                    value={riderForm.schoolOrClub || ''}
                    onChange={(e) => setRiderForm({ ...riderForm, schoolOrClub: e.target.value })}
                    placeholder="e.g. Namilyango High School Gulama"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Custom Bib Number (Optional)</label>
                  <input
                    type="text"
                    value={riderForm.bibNumber || ''}
                    onChange={(e) => setRiderForm({ ...riderForm, bibNumber: e.target.value })}
                    placeholder="Auto-generated if blank (e.g. TWC-YOU-205)"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Payment / Registration Status</label>
                  <select
                    value={riderForm.paymentStatus || 'Pending Verification'}
                    onChange={(e) => setRiderForm({ ...riderForm, paymentStatus: e.target.value as any })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white"
                  >
                    <option value="Approved">Approved (Paid / Bib Issued)</option>
                    <option value="Pending Verification">Pending Verification (MoMo)</option>
                    <option value="Exempt / Scholarship">Exempt / Academy Scholarship</option>
                  </select>
                </div>

                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Academy Status</label>
                  <select
                    value={riderForm.status || 'Active'}
                    onChange={(e) => setRiderForm({ ...riderForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Under Training">Under Training</option>
                    <option value="Graduated">Graduated</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRiderForm(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold font-heading cursor-pointer shadow-lg"
                >
                  Save & Register Rider
                </button>
              </div>
            </form>
          )}

          {/* Riders Table */}
          <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900 shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950 text-zinc-400 uppercase tracking-wider font-mono text-[10px] border-b border-zinc-800">
                <tr>
                  <th className="px-4 py-3">Bib #</th>
                  <th className="px-4 py-3">Rider Profile</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">School / Club</th>
                  <th className="px-4 py-3">Licensing Level</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Payment</th>
                  {canEdit && <th className="px-4 py-3 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-zinc-200">
                {filteredRiders.map((r) => (
                  <tr key={r.id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-amber-400">
                      {r.bibNumber}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-white">{r.name}</div>
                      <div className="text-[11px] text-zinc-400 font-mono">Age: {r.age} yrs</div>
                    </td>
                    <td className="px-4 py-3 text-zinc-300">{r.category}</td>
                    <td className="px-4 py-3 text-zinc-400">{r.schoolOrClub}</td>
                    <td className="px-4 py-3">
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                        {r.licensingLevel}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-zinc-400">{r.contactPhone}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          r.paymentStatus === 'Approved'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : r.paymentStatus === 'Exempt / Scholarship'
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {r.paymentStatus}
                      </span>
                    </td>
                    {canEdit && (
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Remove ${r.name} from directory?`)) {
                              onDeleteRider(r.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-red-950 text-zinc-400 hover:text-red-400 cursor-pointer"
                          title="Delete Rider Profile"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. SUBTAB: ATTENDANCE & TRAINING LOG */}
      {activeSubTab === 'training' && (
        <div className="space-y-6">
          {/* Log Session Form */}
          {showTrainingForm && (
            <form
              onSubmit={handleSaveTraining}
              className="p-6 rounded-2xl bg-zinc-900 border border-amber-500/40 space-y-4 shadow-xl animate-in fade-in"
            >
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider font-heading">
                <Bike className="w-4 h-4" />
                <span>Log Academy Session & Equipment Checks</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Session Date *</label>
                  <input
                    type="text"
                    required
                    value={trainingForm.date || ''}
                    onChange={(e) => setTrainingForm({ ...trainingForm, date: e.target.value })}
                    placeholder="e.g. Tuesday, Sep 15, 2026"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Training Location *</label>
                  <input
                    type="text"
                    required
                    value={trainingForm.location || ''}
                    onChange={(e) => setTrainingForm({ ...trainingForm, location: e.target.value })}
                    placeholder="e.g. Lubiri Ring Road Circuit (Mengo)"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Trainer / Director in Charge</label>
                  <input
                    type="text"
                    value={trainingForm.trainerName || ''}
                    onChange={(e) => setTrainingForm({ ...trainingForm, trainerName: e.target.value })}
                    placeholder="e.g. Manager Solo (Solomon Ssebakaki)"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-zinc-400 font-semibold block mb-1">Training Focus / Curriculum *</label>
                  <input
                    type="text"
                    required
                    value={trainingForm.focus || ''}
                    onChange={(e) => setTrainingForm({ ...trainingForm, focus: e.target.value })}
                    placeholder="e.g. High-Speed Peloton Cornering & Echelon Drafting"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Riders Attended</label>
                  <input
                    type="number"
                    value={trainingForm.attendanceCount || 30}
                    onChange={(e) => setTrainingForm({ ...trainingForm, attendanceCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white"
                  />
                </div>

                {/* Equipment checks */}
                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Helmets Inspected</label>
                  <input
                    type="number"
                    value={trainingForm.equipmentChecked?.helmets || 30}
                    onChange={(e) =>
                      setTrainingForm({
                        ...trainingForm,
                        equipmentChecked: {
                          helmets: Number(e.target.value),
                          jerseys: trainingForm.equipmentChecked?.jerseys || 25,
                          bikesInspected: trainingForm.equipmentChecked?.bikesInspected || 25,
                        },
                      })
                    }
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Jerseys Issued / Worn</label>
                  <input
                    type="number"
                    value={trainingForm.equipmentChecked?.jerseys || 28}
                    onChange={(e) =>
                      setTrainingForm({
                        ...trainingForm,
                        equipmentChecked: {
                          helmets: trainingForm.equipmentChecked?.helmets || 30,
                          jerseys: Number(e.target.value),
                          bikesInspected: trainingForm.equipmentChecked?.bikesInspected || 25,
                        },
                      })
                    }
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Bicycles Inspected</label>
                  <input
                    type="number"
                    value={trainingForm.equipmentChecked?.bikesInspected || 30}
                    onChange={(e) =>
                      setTrainingForm({
                        ...trainingForm,
                        equipmentChecked: {
                          helmets: trainingForm.equipmentChecked?.helmets || 30,
                          jerseys: trainingForm.equipmentChecked?.jerseys || 28,
                          bikesInspected: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="text-zinc-400 font-semibold block mb-1">Student Performance Notes & Progress</label>
                  <textarea
                    rows={2}
                    value={trainingForm.notes || ''}
                    onChange={(e) => setTrainingForm({ ...trainingForm, notes: e.target.value })}
                    placeholder="Pacing observations, sprint clock times, mechanical repairs performed in Katwe..."
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTrainingForm(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold font-heading cursor-pointer shadow-lg"
                >
                  Save Training Log
                </button>
              </div>
            </form>
          )}

          {/* Training Sessions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trainingSessions.map((session) => (
              <div
                key={session.id}
                className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-amber-400 font-bold">
                      {session.date}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                      {session.attendanceCount} Riders Present
                    </span>
                  </div>

                  <h4 className="text-sm font-extrabold text-white font-heading">
                    {session.focus}
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Location: <strong className="text-zinc-300">{session.location}</strong> • Lead: <strong className="text-zinc-300">{session.trainerName}</strong>
                  </p>

                  <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[10px] font-mono">
                    <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800">
                      <span className="text-emerald-400 font-bold block text-xs">{session.equipmentChecked.helmets}</span>
                      <span className="text-zinc-500">Helmets</span>
                    </div>
                    <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800">
                      <span className="text-amber-400 font-bold block text-xs">{session.equipmentChecked.jerseys}</span>
                      <span className="text-zinc-500">Jerseys</span>
                    </div>
                    <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800">
                      <span className="text-cyan-400 font-bold block text-xs">{session.equipmentChecked.bikesInspected}</span>
                      <span className="text-zinc-500">Inspections</span>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-400 bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80 mt-2">
                    {session.notes}
                  </p>
                </div>

                {canEdit && (
                  <div className="pt-3 border-t border-zinc-800 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Delete this training record?')) {
                          onDeleteTrainingSession(session.id);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-red-950 text-zinc-400 hover:text-red-400 cursor-pointer text-xs flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Record</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
