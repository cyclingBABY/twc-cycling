import React, { useState } from 'react';
import {
  CyclingEvent,
  LeaderboardResult,
  RaceCategory,
  AdminRole,
} from '../../types';
import {
  Calendar,
  Trophy,
  MapPin,
  Clock,
  Award,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  Sparkles,
  Layers,
  Flag,
  Shield,
  FileSpreadsheet,
} from 'lucide-react';

interface AdminEventsManagementProps {
  currentRole: AdminRole;
  events: CyclingEvent[];
  leaderboard: LeaderboardResult[];
  onAddEvent: (event: CyclingEvent) => void;
  onUpdateEvent: (event: CyclingEvent) => void;
  onDeleteEvent: (id: string) => void;
  onAddResult: (res: LeaderboardResult) => void;
  onDeleteResult: (id: string) => void;
}

export const AdminEventsManagement: React.FC<AdminEventsManagementProps> = ({
  currentRole,
  events,
  leaderboard,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  onAddResult,
  onDeleteResult,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'events' | 'categories' | 'results'>('events');
  const [showEventForm, setShowEventForm] = useState(false);
  const [showResultForm, setShowResultForm] = useState(false);

  const canEdit = currentRole === 'super_admin' || currentRole === 'race_coordinator';

  // Form states for New Event
  const [eventForm, setEventForm] = useState<Partial<CyclingEvent>>({
    title: '',
    tagline: '',
    date: 'Saturday, Oct 24, 2026 • 06:30 AM EAT',
    location: 'Lubiri Ring Road Circuit, Mengo, Kampala',
    circuit: 'Lubiri Ring Road (3.5 km Loop)',
    distanceSummary: '105 km (30 Laps) Elite • 21 km Schools',
    description: '',
    type: 'upcoming',
    isFlagship: true,
    registrationStatus: 'open',
    officialContacts: ['+256 706 770 872'],
    heroImage: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1600&auto=format&fit=crop',
    prizes: [
      {
        title: 'Documented Land Title Deed',
        description: 'Prime titled land plot for the 105km Elite Champion (sponsored by Century Properties).',
        icon: 'Award',
      },
      {
        title: 'UGX 10,000,000+ Prize Purse',
        description: 'Podium cash rewards for Elite, Youth, and Armed Forces.',
        icon: 'Banknote',
      },
    ],
  });

  // Form states for New Leaderboard Result
  const [resultForm, setResultForm] = useState<Partial<LeaderboardResult>>({
    eventId: events[0]?.id || 'inaugural-reconciliatory-race',
    eventTitle: events[0]?.title || 'Inaugural Reconciliatory Cycling Race',
    categoryName: 'Elite Field (105km)',
    position: 1,
    riderName: '',
    teamOrSchool: 'TWC Cycling Academy Elite',
    timeOrGap: '2h 34m 18s',
    lapsCompleted: '30 Laps (105 km)',
    averageSpeed: '40.8 km/h',
    prizeWon: 'Prime Land Title Certificate + Gold Trophy',
  });

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title) return;

    const newEvent: CyclingEvent = {
      id: eventForm.id || `event-${Date.now()}`,
      title: eventForm.title,
      tagline: eventForm.tagline || 'Together We Can Cycling Championship',
      type: eventForm.type || 'upcoming',
      isFlagship: Boolean(eventForm.isFlagship),
      date: eventForm.date || 'Upcoming Race Date',
      location: eventForm.location || 'Lubiri Ring Road Circuit, Kampala',
      circuit: eventForm.circuit || 'Lubiri Ring Road Circuit (3.5 km)',
      distanceSummary: eventForm.distanceSummary || '105 km Elite',
      description: eventForm.description || 'Championship race organized by Together We Can Cycling Uganda Ltd.',
      heroImage: eventForm.heroImage || 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1600&auto=format&fit=crop',
      registrationStatus: (eventForm.registrationStatus as any) || 'open',
      officialContacts: eventForm.officialContacts || ['+256 706 770 872'],
      categories: events[0]?.categories || [],
      prizes: eventForm.prizes || [],
    };

    onAddEvent(newEvent);
    setShowEventForm(false);
    setEventForm({
      title: '',
      tagline: '',
      date: 'Saturday, Oct 24, 2026 • 06:30 AM EAT',
      location: 'Lubiri Ring Road Circuit, Mengo, Kampala',
      circuit: 'Lubiri Ring Road (3.5 km Loop)',
      distanceSummary: '105 km (30 Laps) Elite • 21 km Schools',
      description: '',
      type: 'upcoming',
      isFlagship: false,
      registrationStatus: 'open',
      officialContacts: ['+256 706 770 872'],
      heroImage: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1600&auto=format&fit=crop',
      prizes: [
        {
          title: 'Documented Land Title Deed',
          description: 'Awarded to Elite 105km Winner',
          icon: 'Award',
        },
      ],
    });
  };

  const handleSaveResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resultForm.riderName) return;

    const matchedEvent = events.find((ev) => ev.id === resultForm.eventId);

    const newRes: LeaderboardResult = {
      id: `res-${Date.now()}`,
      eventId: resultForm.eventId || 'inaugural-reconciliatory-race',
      eventTitle: matchedEvent?.title || resultForm.eventTitle || 'Lubiri 105km',
      categoryName: resultForm.categoryName || 'Elite Field',
      position: Number(resultForm.position) || 1,
      riderName: resultForm.riderName,
      teamOrSchool: resultForm.teamOrSchool || 'TWC Cycling Academy',
      timeOrGap: resultForm.timeOrGap || '2h 35m 00s',
      lapsCompleted: resultForm.lapsCompleted || '30 Laps',
      averageSpeed: resultForm.averageSpeed || '40.2 km/h',
      prizeWon: resultForm.prizeWon || 'Finisher Trophy & Medal',
    };

    onAddResult(newRes);
    setShowResultForm(false);
    setResultForm({
      eventId: events[0]?.id || '',
      categoryName: 'Elite Field (105km)',
      position: 1,
      riderName: '',
      teamOrSchool: 'TWC Cycling Academy Elite',
      timeOrGap: '',
      lapsCompleted: '30 Laps (105 km)',
      averageSpeed: '',
      prizeWon: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Subnavigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2 bg-zinc-900 p-1 rounded-xl border border-zinc-800 self-start">
          <button
            onClick={() => setActiveSubTab('events')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'events'
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Races & Circuits ({events.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('categories')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'categories'
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Category Configurator</span>
          </button>

          <button
            onClick={() => setActiveSubTab('results')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'results'
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Results & Leaderboard ({leaderboard.length})</span>
          </button>
        </div>

        {canEdit ? (
          <div>
            {activeSubTab === 'events' && (
              <button
                onClick={() => setShowEventForm(!showEventForm)}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold font-heading flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>{showEventForm ? 'Close Form' : 'Create New Race'}</span>
              </button>
            )}

            {activeSubTab === 'results' && (
              <button
                onClick={() => setShowResultForm(!showResultForm)}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold font-heading flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>{showResultForm ? 'Close Upload' : 'Upload Chip Time / Result'}</span>
              </button>
            )}
          </div>
        ) : (
          <span className="text-[11px] text-amber-400/80 bg-amber-500/10 px-3 py-1 rounded-md border border-amber-500/20 font-mono">
            Read-only mode for current role
          </span>
        )}
      </div>

      {/* 1. SUBTAB: EVENTS LIST & RACE CREATOR */}
      {activeSubTab === 'events' && (
        <div className="space-y-6">
          {/* Create New Race Form */}
          {showEventForm && (
            <form
              onSubmit={handleSaveEvent}
              className="p-6 rounded-2xl bg-zinc-900 border border-amber-500/40 space-y-4 shadow-xl animate-in fade-in"
            >
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider font-heading">
                <Sparkles className="w-4 h-4" />
                <span>Race Creator • Deploy New Event</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Event Name *</label>
                  <input
                    type="text"
                    required
                    value={eventForm.title || ''}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    placeholder="e.g. Inaugural Reconciliatory Cycling Race"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Tagline / Motto</label>
                  <input
                    type="text"
                    value={eventForm.tagline || ''}
                    onChange={(e) => setEventForm({ ...eventForm, tagline: e.target.value })}
                    placeholder="e.g. Uniting Communities, Crowned with Land Title"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Date & Time *</label>
                  <input
                    type="text"
                    required
                    value={eventForm.date || ''}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    placeholder="e.g. Saturday, Oct 24, 2026 • 06:30 AM EAT"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Venue / Route *</label>
                  <input
                    type="text"
                    required
                    value={eventForm.location || ''}
                    onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                    placeholder="e.g. Lubiri Ring Road Circuit, Mengo, Kampala"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Circuit Details (Laps / km)</label>
                  <input
                    type="text"
                    value={eventForm.circuit || ''}
                    onChange={(e) => setEventForm({ ...eventForm, circuit: e.target.value })}
                    placeholder="e.g. Lubiri Ring Road (3.5 km Closed High-Speed Loop)"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Distance Summary</label>
                  <input
                    type="text"
                    value={eventForm.distanceSummary || ''}
                    onChange={(e) => setEventForm({ ...eventForm, distanceSummary: e.target.value })}
                    placeholder="e.g. 105 km (30 Laps) Elite • 21 km Schools"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-zinc-400 font-semibold block mb-1">Hero Cover Image URL</label>
                  <input
                    type="url"
                    value={eventForm.heroImage || ''}
                    onChange={(e) => setEventForm({ ...eventForm, heroImage: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white font-mono text-xs"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-zinc-400 font-semibold block mb-1">Description & Community Scope</label>
                  <textarea
                    rows={2}
                    value={eventForm.description || ''}
                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                    placeholder="Detailed explanation of the race, categories, and safety protocols..."
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEventForm(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold font-heading cursor-pointer shadow-lg"
                >
                  Save & Publish Race
                </button>
              </div>
            </form>
          )}

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3 relative overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {ev.heroImage && (
                    <div className="h-28 w-full rounded-xl overflow-hidden mb-3 bg-zinc-950 border border-zinc-800 relative">
                      <img
                        src={ev.heroImage}
                        alt={ev.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        ev.type === 'upcoming'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-zinc-800 text-zinc-300'
                      }`}
                    >
                      {ev.type}
                    </span>
                    {ev.isFlagship && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Flagship • Land Title Prize
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-extrabold text-white font-heading mt-2">
                    {ev.title}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 mt-1">{ev.tagline}</p>

                  <div className="mt-3 space-y-1 text-xs text-zinc-300 font-mono">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{ev.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{ev.location}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
                  <span className="text-zinc-500 font-mono text-[11px]">
                    Status: <strong className="text-emerald-400 uppercase">{ev.registrationStatus}</strong>
                  </span>

                  {canEdit && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete event "${ev.title}"?`)) {
                          onDeleteEvent(ev.id);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-red-950 text-zinc-400 hover:text-red-400 cursor-pointer"
                      title="Delete Event"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. SUBTAB: CATEGORY CONFIGURATOR */}
      {activeSubTab === 'categories' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-1 text-xs">
            <h4 className="font-bold text-white font-heading text-sm">
              TWC Race Strictures & Field Allocations
            </h4>
            <p className="text-zinc-400">
              Each TWC event supports 4 designated competitive divisions. Pacing laps, road clearance requirements, and prize tiers are configured below:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Division 1: Elite Field */}
            <div className="p-5 rounded-2xl bg-zinc-900 border border-amber-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-400 uppercase tracking-wider">
                  Division 1
                </span>
                <span className="text-xs font-mono font-bold text-white">105 Kilometers • 30 Laps</span>
              </div>
              <h4 className="font-extrabold text-white text-base font-heading">
                Elite Field (Senior Peloton & Pro Racers)
              </h4>
              <p className="text-xs text-zinc-300">
                The premier speed and drafting test on the Lubiri Ring Road closed circuit.
              </p>
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs space-y-1">
                <p className="font-bold text-amber-300 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  <span>Grand Prize: Prime Land Title Certificate + Cash Purse</span>
                </p>
                <p className="text-zinc-400 text-[11px]">
                  Requires UCI / UCF compliant road bike & certified helmet.
                </p>
              </div>
            </div>

            {/* Division 2: Schools & Youth */}
            <div className="p-5 rounded-2xl bg-zinc-900 border border-emerald-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 uppercase tracking-wider">
                  Division 2
                </span>
                <span className="text-xs font-mono font-bold text-white">14 km / 21 km • 4-6 Laps</span>
              </div>
              <h4 className="font-extrabold text-white text-base font-heading">
                Schools & Youth (Senior One Focus)
              </h4>
              <p className="text-xs text-zinc-300">
                Grassroots talent identification across secondary schools (e.g. Namilyango High School Gulama, Katwe SS).
              </p>
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs space-y-1">
                <p className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  <span>Prizes: Term Tuition Grants + Specialized Road Racing Bikes</span>
                </p>
                <p className="text-zinc-400 text-[11px]">
                  Requires valid student identity & parent/guardian clearance.
                </p>
              </div>
            </div>

            {/* Division 3: Armed Forces Field */}
            <div className="p-5 rounded-2xl bg-zinc-900 border border-cyan-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-400 uppercase tracking-wider">
                  Division 3
                </span>
                <span className="text-xs font-mono font-bold text-white">52.5 Kilometers • 15 Laps</span>
              </div>
              <h4 className="font-extrabold text-white text-base font-heading">
                Armed Forces Field (UPDF, Police & Prisons)
              </h4>
              <p className="text-xs text-zinc-300">
                Inter-agency security forces cycling championship celebrating fitness, discipline, and unity.
              </p>
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs space-y-1">
                <p className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  <span>Prizes: Commemorative Service Shield + Kit Grants</span>
                </p>
                <p className="text-zinc-400 text-[11px]">
                  Requires verification of agency affiliation.
                </p>
              </div>
            </div>

            {/* Division 4: Family & Fans Fun Run */}
            <div className="p-5 rounded-2xl bg-zinc-900 border border-orange-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-orange-500/20 text-orange-400 uppercase tracking-wider">
                  Division 4
                </span>
                <span className="text-xs font-mono font-bold text-white">7 Kilometers • 2 Fun Laps</span>
              </div>
              <h4 className="font-extrabold text-white text-base font-heading">
                Family & Fans Fun Run
              </h4>
              <p className="text-xs text-zinc-300">
                Non-competitive mass community ride celebrating healthy living, road safety, and cycling love.
              </p>
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs space-y-1">
                <p className="font-bold text-orange-300 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  <span>Prizes: Finisher Medals, TWC High-Vis Jerseys & Refreshments</span>
                </p>
                <p className="text-zinc-400 text-[11px]">
                  Open to all bike models and ages 7 to 70+.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. SUBTAB: LEADERBOARD & RESULTS MATRIX */}
      {activeSubTab === 'results' && (
        <div className="space-y-6">
          {/* Form to Upload Chip Times */}
          {showResultForm && (
            <form
              onSubmit={handleSaveResult}
              className="p-6 rounded-2xl bg-zinc-900 border border-amber-500/40 space-y-4 shadow-xl animate-in fade-in"
            >
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider font-heading">
                <FileSpreadsheet className="w-4 h-4" />
                <span>Upload Race Result / Chip Time Record</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Rider Name *</label>
                  <input
                    type="text"
                    required
                    value={resultForm.riderName || ''}
                    onChange={(e) => setResultForm({ ...resultForm, riderName: e.target.value })}
                    placeholder="e.g. Magunda Shafik"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Club / School</label>
                  <input
                    type="text"
                    value={resultForm.teamOrSchool || ''}
                    onChange={(e) => setResultForm({ ...resultForm, teamOrSchool: e.target.value })}
                    placeholder="e.g. TWC Academy Elite"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Podium Position *</label>
                  <select
                    value={resultForm.position || 1}
                    onChange={(e) => setResultForm({ ...resultForm, position: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white"
                  >
                    <option value={1}>1st Place (Winner / Gold)</option>
                    <option value={2}>2nd Place (Silver)</option>
                    <option value={3}>3rd Place (Bronze)</option>
                    <option value={4}>4th Place</option>
                    <option value={5}>5th Place</option>
                  </select>
                </div>

                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Category Field</label>
                  <select
                    value={resultForm.categoryName || 'Elite Field (105km)'}
                    onChange={(e) => setResultForm({ ...resultForm, categoryName: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white"
                  >
                    <option value="Elite Field (105km)">Elite Field (105km / 30 Laps)</option>
                    <option value="Schools & Youth (Senior One)">Schools & Youth (Senior One - 21km)</option>
                    <option value="Armed Forces Field">Armed Forces Field (52.5km)</option>
                    <option value="Family & Fans">Family & Fans (7km)</option>
                  </select>
                </div>

                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Chip Time / Time Gap</label>
                  <input
                    type="text"
                    value={resultForm.timeOrGap || ''}
                    onChange={(e) => setResultForm({ ...resultForm, timeOrGap: e.target.value })}
                    placeholder="e.g. 2h 34m 18s"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Average Speed</label>
                  <input
                    type="text"
                    value={resultForm.averageSpeed || ''}
                    onChange={(e) => setResultForm({ ...resultForm, averageSpeed: e.target.value })}
                    placeholder="e.g. 40.8 km/h"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="text-zinc-400 font-semibold block mb-1">Prize / Award Won</label>
                  <input
                    type="text"
                    value={resultForm.prizeWon || ''}
                    onChange={(e) => setResultForm({ ...resultForm, prizeWon: e.target.value })}
                    placeholder="e.g. Prime Land Title Deed + UGX 3,500,000"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResultForm(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold font-heading cursor-pointer shadow-lg"
                >
                  Save Result
                </button>
              </div>
            </form>
          )}

          {/* Results Table */}
          <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900 shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950 text-zinc-400 uppercase tracking-wider font-mono text-[10px] border-b border-zinc-800">
                <tr>
                  <th className="px-4 py-3">Pos</th>
                  <th className="px-4 py-3">Rider Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Club / School</th>
                  <th className="px-4 py-3">Chip Time</th>
                  <th className="px-4 py-3">Avg Speed</th>
                  <th className="px-4 py-3">Prize Awarded</th>
                  {canEdit && <th className="px-4 py-3 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-zinc-200">
                {leaderboard.map((res) => (
                  <tr key={res.id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <span
                        className={`font-bold px-2 py-0.5 rounded-full ${
                          res.position === 1
                            ? 'bg-amber-500 text-black'
                            : res.position === 2
                            ? 'bg-zinc-300 text-black'
                            : res.position === 3
                            ? 'bg-amber-700 text-white'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        #{res.position}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-white">{res.riderName}</td>
                    <td className="px-4 py-3 text-zinc-300">{res.categoryName}</td>
                    <td className="px-4 py-3 text-zinc-400">{res.teamOrSchool}</td>
                    <td className="px-4 py-3 font-mono font-bold text-emerald-400">{res.timeOrGap}</td>
                    <td className="px-4 py-3 font-mono text-zinc-400">{res.averageSpeed || '—'}</td>
                    <td className="px-4 py-3 text-amber-300 font-medium">{res.prizeWon || 'Medal'}</td>
                    {canEdit && (
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete result for ${res.riderName}?`)) {
                              onDeleteResult(res.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-red-950 text-zinc-400 hover:text-red-400 cursor-pointer"
                          title="Delete Result"
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
    </div>
  );
};
