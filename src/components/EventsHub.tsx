import React, { useState } from 'react';
import { EVENTS_DATA, CLUB_INFO } from '../data/cyclingData';
import { CyclingEvent, LeaderboardResult, NoticeItem } from '../types';
import { LubiriCircuitInteractive } from './LubiriCircuitInteractive';
import {
  Calendar,
  MapPin,
  Trophy,
  Award,
  Users,
  Flag,
  Phone,
  Shield,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  Share2,
  Check,
  Medal,
  Bell,
  Pin,
  ExternalLink,
} from 'lucide-react';

interface EventsHubProps {
  onRegisterCategory: (categoryName: string, eventTitle?: string) => void;
  events?: CyclingEvent[];
  leaderboard?: LeaderboardResult[];
  notices?: NoticeItem[];
}

export const EventsHub: React.FC<EventsHubProps> = ({
  onRegisterCategory,
  events = EVENTS_DATA,
  leaderboard = [],
  notices = [],
}) => {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'milestone'>('upcoming');
  const [showCircuitSection, setShowCircuitSection] = useState(true);
  const [copiedContact, setCopiedContact] = useState(false);

  const filteredEvents = events.filter((e) => {
    if (filter === 'all') return true;
    return e.type === filter;
  });

  const flagshipEvent = events.find((e) => e.isFlagship) || events[0];

  const handleCopyHotline = () => {
    navigator.clipboard.writeText(CLUB_INFO.primaryPhone);
    setCopiedContact(true);
    setTimeout(() => setCopiedContact(false), 2500);
  };

  return (
    <section id="events" className="py-20 sm:py-28 bg-zinc-950 text-zinc-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header & Interactive Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-zinc-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase tracking-wider font-heading mb-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>Events & Race Registration Hub</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-heading tracking-tight">
              Championship Races & Milestones
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base mt-2 max-w-2xl">
              From closed-road criteriums on the Lubiri circuit to regional endurance tours across Uganda, experience premier road cycling with TWC Academy.
            </p>
          </div>

          {/* Interactive Filter Pills */}
          <div className="flex items-center bg-zinc-900 p-1.5 rounded-xl border border-zinc-800 self-start md:self-auto">
            <button
              onClick={() => setFilter('upcoming')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filter === 'upcoming'
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Flag className="w-3.5 h-3.5" />
              <span>Upcoming Races</span>
              <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-black/30">2</span>
            </button>

            <button
              onClick={() => setFilter('milestone')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filter === 'milestone'
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Past Milestones</span>
              <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-black/30">2</span>
            </button>

            <button
              onClick={() => setFilter('all')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>All</span>
            </button>
          </div>
        </div>

        {/* OFFICIAL NOTICES & COMMISSAIRE PRESS BRIEFS (Managed in Content Studio) */}
        {notices.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 font-heading">
                  Official Commissaire Bulletins & Press Releases
                </h3>
              </div>
              <span className="text-[11px] text-zinc-500 font-mono">
                {notices.length} Active Notice{notices.length > 1 ? 's' : ''}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notices.slice(0, 4).map((n) => (
                <div
                  key={n.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    n.pinned
                      ? 'bg-gradient-to-br from-amber-500/10 via-zinc-900 to-zinc-900 border-amber-500/40 shadow-lg'
                      : 'bg-zinc-900/90 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {n.badge}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-zinc-400 font-mono">{n.date}</span>
                      {n.pinned && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500 text-black flex items-center gap-1">
                          <Pin className="w-2.5 h-2.5" />
                          Pinned
                        </span>
                      )}
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-1.5 font-heading">
                    {n.title}
                  </h4>
                  <p className="text-xs text-zinc-300 line-clamp-3 leading-relaxed mb-3">
                    {n.content}
                  </p>

                  {n.actionText && (
                    <a
                      href={n.actionLink || '#registration'}
                      className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-bold transition-colors"
                    >
                      <span>{n.actionText}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FEATURED EVENT BOX: Flagship Race (Inaugural Reconciliatory Cycling Race) */}
        {flagshipEvent && (
          <div className="relative rounded-3xl bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 border-2 border-amber-500/40 p-6 sm:p-8 lg:p-10 shadow-2xl overflow-hidden">
            {/* Corner Decorative Ribbon */}
            <div className="absolute top-0 right-0">
              <div className="bg-gradient-to-l from-amber-500 to-orange-500 text-black font-extrabold text-[11px] font-heading uppercase tracking-widest px-6 py-1.5 shadow-md transform rotate-0 rounded-bl-xl flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-black" />
                <span>Featured Flagship Race</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>REGISTRATION ACTIVE NOW • LUBIRI RING ROAD</span>
                </div>

                <h3 className="text-2xl sm:text-4xl font-extrabold text-white font-heading leading-tight">
                  {flagshipEvent.title}
                </h3>

                <p className="text-amber-400 font-semibold text-base sm:text-lg">
                  {flagshipEvent.tagline}
                </p>

                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-3xl">
                  {flagshipEvent.description}
                </p>

                {/* Event Logistics Quick Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-amber-400 flex-shrink-0" />
                    <div>
                      <div className="text-[11px] text-zinc-400 uppercase">Race Date</div>
                      <div className="text-xs font-bold text-zinc-100">{flagshipEvent.date}</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <div>
                      <div className="text-[11px] text-zinc-400 uppercase">Venue Circuit</div>
                      <div className="text-xs font-bold text-zinc-100">{flagshipEvent.circuit}</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center gap-3">
                    <Clock className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                    <div>
                      <div className="text-[11px] text-zinc-400 uppercase">Flag-Off Time</div>
                      <div className="text-xs font-bold text-zinc-100">06:30 AM Sharp (EAT)</div>
                    </div>
                  </div>
                </div>

                {/* Featured Prizes Ribbon (Land Titles, UGX Cash, Scholarships) */}
                <div className="mt-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-400 font-heading mb-2 flex items-center gap-1.5">
                    <Trophy className="w-4 h-4" />
                    <span>Marquee Race Prizes & Honors</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-300">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span><strong>Documented Land Title:</strong> Grand Prize for 105km Elite Victor</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span><strong>UGX 10M+ Cash Purse:</strong> Spread across podium categories</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span><strong>Academic Grants:</strong> Scholarships for Senior One young stars</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span><strong>Custom Finisher Medals:</strong> Commemorative TWC high-vis gear</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Quick Action & Registration Desk */}
              <div className="lg:col-span-4 bg-zinc-950 p-6 rounded-2xl border border-zinc-800 space-y-5">
                <div className="text-center space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-heading">
                    Official Entries Open
                  </span>
                  <h4 className="text-lg font-bold text-white font-heading">
                    Select Division & Register
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Pre-register your bib number online. Verification at BMK House Katwe desk.
                  </p>
                </div>

                <div className="space-y-2">
                  {flagshipEvent.categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => onRegisterCategory(cat.name, flagshipEvent.title)}
                      className="w-full text-left p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/50 transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div>
                        <div className="text-xs font-bold text-white font-heading group-hover:text-amber-400">
                          {cat.name}
                        </div>
                        <div className="text-[11px] text-zinc-400">
                          {cat.distance} • {cat.laps}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </div>

                {/* Direct Query Contacts */}
                <div className="pt-3 border-t border-zinc-800 text-center space-y-2">
                  <div className="text-xs text-zinc-400 font-medium">Race Queries & Marshall Desk</div>
                  <div className="flex flex-col gap-1.5">
                    <a
                      href={`tel:${CLUB_INFO.primaryPhone}`}
                      className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{CLUB_INFO.primaryPhone} (Manager Solo)</span>
                    </a>
                    <a
                      href={`tel:${CLUB_INFO.secondaryPhone}`}
                      className="text-xs text-zinc-400 hover:text-zinc-200"
                    >
                      <span>Line 2: {CLUB_INFO.secondaryPhone}</span>
                    </a>
                  </div>

                  <button
                    onClick={handleCopyHotline}
                    className="inline-flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-300 mx-auto cursor-pointer"
                  >
                    {copiedContact ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Copied hotline to clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3 h-3" />
                        <span>Copy hotline number</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RACE INFO CARDS: Detailed 4-Category Breakdown */}
        <div id="categories" className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 font-heading">
                Four Official Divisions
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                Seamless Category Breakdown
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-md">
              Every rider from Junior S.1 students to seasoned national masters has a dedicated, verified division.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {flagshipEvent.categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-zinc-900/90 rounded-2xl border border-zinc-800 p-6 flex flex-col justify-between hover:border-zinc-700 transition-all hover:shadow-xl relative group"
              >
                <div>
                  {/* Category Badge & Distance */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${cat.badgeColor}`}>
                      {cat.name}
                    </span>
                    <span className="text-xs font-mono text-zinc-400 font-semibold">
                      {cat.laps?.split(' ')[0]} Laps
                    </span>
                  </div>

                  <div className="text-2xl font-black text-white font-heading tracking-tight mb-1">
                    {cat.distance}
                  </div>
                  <div className="text-xs text-amber-400 font-semibold mb-3 font-heading">
                    {cat.laps}
                  </div>

                  <div className="text-xs text-zinc-300 font-medium pb-3 mb-3 border-b border-zinc-800">
                    <strong className="text-zinc-200">Target Group:</strong> {cat.targetGroup}
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                    {cat.description}
                  </p>

                  {/* Requirements checklist */}
                  <div className="space-y-1.5 mb-4">
                    <div className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">
                      Requirements:
                    </div>
                    {cat.requirements.slice(0, 3).map((req, rIdx) => (
                      <div key={rIdx} className="flex items-start gap-1.5 text-[11px] text-zinc-400">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span>{req}</span>
                      </div>
                    ))}
                  </div>

                  {/* Prize Highlight */}
                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 mb-4">
                    <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wide flex items-center gap-1">
                      <Trophy className="w-3 h-3" />
                      <span>Prize Highlight</span>
                    </div>
                    <div className="text-xs font-medium text-zinc-200 mt-0.5">
                      {cat.prizeHighlight}
                    </div>
                  </div>
                </div>

                {/* Direct Register Action */}
                <button
                  onClick={() => onRegisterCategory(cat.name, flagshipEvent.title)}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 transition-all shadow-md shadow-amber-500/10 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Register for {cat.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* INTERACTIVE LUBIRI RING ROAD CIRCUIT SECTION */}
        <div className="pt-4">
          <LubiriCircuitInteractive onSelectCategory={(cat) => onRegisterCategory(cat, flagshipEvent.title)} />
        </div>

        {/* OTHER EVENTS / PAST MILESTONES (Filtered list) */}
        {filteredEvents.length > 1 && (
          <div className="space-y-6 pt-8 border-t border-zinc-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xl sm:text-2xl font-bold text-white font-heading">
                {filter === 'upcoming'
                  ? 'Other Upcoming Challenges'
                  : filter === 'milestone'
                  ? 'Historical Milestones & Solidarity Rides'
                  : 'All Academy Events'}
              </h3>
              <span className="text-xs text-zinc-400">
                Showing {filteredEvents.filter((e) => !e.isFlagship).length} events
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredEvents
                .filter((e) => !e.isFlagship)
                .map((event) => (
                  <div
                    key={event.id}
                    className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden flex flex-col justify-between hover:border-zinc-700 transition-all"
                  >
                    <div className="relative h-48 sm:h-56 overflow-hidden">
                      <img
                        src={event.heroImage}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span
                          className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                            event.type === 'upcoming'
                              ? 'bg-emerald-500/90 text-black'
                              : 'bg-zinc-800/90 text-amber-400 border border-zinc-700'
                          }`}
                        >
                          {event.type === 'upcoming' ? 'Upcoming Race' : 'Past Milestone'}
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 text-xs text-zinc-300 flex items-center justify-between bg-zinc-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-zinc-800">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-amber-400" />
                          {event.location}
                        </span>
                        <span className="font-mono text-amber-300 font-bold">{event.distanceSummary}</span>
                      </div>
                    </div>

                    <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-lg sm:text-xl font-bold text-white font-heading">
                          {event.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mt-2">
                          {event.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                        <div className="text-xs text-zinc-400">
                          {event.date}
                        </div>
                        {event.type === 'upcoming' ? (
                          <button
                            onClick={() => onRegisterCategory(event.categories[0]?.name || 'Junior', event.title)}
                            className="px-4 py-2 rounded-lg text-xs font-bold text-black bg-amber-500 hover:bg-amber-400 transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <span>Register</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Successfully Completed</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* OFFICIAL TWC LEADERBOARDS & PODIUM RESULTS MATRIX */}
        {leaderboard && leaderboard.length > 0 && (
          <div className="space-y-6 pt-10 border-t border-zinc-800" id="results">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 font-heading">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Verified Race Results & Chip Times</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-heading mt-1">
                  Official Championship Leaderboards
                </h3>
              </div>
              <span className="text-xs text-zinc-400 font-mono">
                Official records published by TWC Race Commissaires
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/80 shadow-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950 text-zinc-400 uppercase tracking-wider font-mono text-[10px] border-b border-zinc-800">
                  <tr>
                    <th className="px-5 py-3.5">Pos</th>
                    <th className="px-5 py-3.5">Rider</th>
                    <th className="px-5 py-3.5">Division / Event</th>
                    <th className="px-5 py-3.5">Affiliation</th>
                    <th className="px-5 py-3.5">Chip Time</th>
                    <th className="px-5 py-3.5">Avg Speed</th>
                    <th className="px-5 py-3.5">Prize Awarded</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80 text-zinc-200">
                  {leaderboard.map((res) => (
                    <tr key={res.id} className="hover:bg-zinc-800/40 transition-colors">
                      <td className="px-5 py-3.5">
                        <span
                          className={`font-mono font-bold px-2 py-0.5 rounded-full inline-block ${
                            res.position === 1
                              ? 'bg-amber-500 text-black font-extrabold'
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
                      <td className="px-5 py-3.5 font-bold text-white text-sm">
                        {res.riderName}
                      </td>
                      <td className="px-5 py-3.5 text-zinc-300">
                        <div>{res.categoryName}</div>
                        <div className="text-[11px] text-zinc-500 line-clamp-1 font-mono">{res.eventTitle}</div>
                      </td>
                      <td className="px-5 py-3.5 text-zinc-400">{res.teamOrSchool}</td>
                      <td className="px-5 py-3.5 font-mono font-bold text-emerald-400">
                        {res.timeOrGap}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-zinc-400">
                        {res.averageSpeed || '—'}
                      </td>
                      <td className="px-5 py-3.5 text-amber-300 font-semibold">
                        {res.prizeWon || 'Finisher Medal'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
