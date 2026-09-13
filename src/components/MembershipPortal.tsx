import React, { useState, useEffect } from 'react';
import { AgeCategory, ExperienceLevel, MemberRegistration } from '../types';
import { CLUB_INFO } from '../data/cyclingData';
import confetti from 'canvas-confetti';
import {
  User,
  Phone,
  Bike,
  Calendar,
  CheckCircle2,
  Award,
  Sparkles,
  Printer,
  Copy,
  Check,
  MessageSquare,
  ShieldCheck,
  AlertCircle,
  X,
} from 'lucide-react';

interface MembershipPortalProps {
  initialCategory?: string;
  initialEvent?: string;
  onRegisterAthlete?: (data: {
    fullName: string;
    ageCategory: string;
    phone: string;
    experienceLevel: string;
    schoolOrClub?: string;
    interestedRace?: string;
  }) => void;
}

const STORAGE_KEY = 'twc_cycling_registrations';

export const MembershipPortal: React.FC<MembershipPortalProps> = ({
  initialCategory,
  initialEvent,
  onRegisterAthlete,
}) => {
  const [name, setName] = useState('');
  const [ageCategory, setAgeCategory] = useState<AgeCategory>('Youth');
  const [phone, setPhone] = useState('+256 ');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('Junior School Competitor (e.g. Senior One)');
  const [schoolOrClub, setSchoolOrClub] = useState('');
  const [selectedRace, setSelectedRace] = useState(
    initialEvent || 'Inaugural Reconciliatory Cycling Race (Lubiri Ring Road)'
  );
  const [submitting, setSubmitting] = useState(false);
  const [confirmedRegistration, setConfirmedRegistration] = useState<MemberRegistration | null>(null);
  const [pastRegistrations, setPastRegistrations] = useState<MemberRegistration[]>([]);
  const [copiedCode, setCopiedCode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Update category when prop changes
  useEffect(() => {
    if (initialCategory) {
      if (initialCategory.toLowerCase().includes('elite')) setAgeCategory('Elite');
      else if (initialCategory.toLowerCase().includes('youth') || initialCategory.toLowerCase().includes('school')) {
        setAgeCategory('Youth');
        setExperienceLevel('Junior School Competitor (e.g. Senior One)');
      } else if (initialCategory.toLowerCase().includes('forces')) {
        setAgeCategory('Veteran');
      } else if (initialCategory.toLowerCase().includes('fan') || initialCategory.toLowerCase().includes('family')) {
        setAgeCategory('Fan');
      }
    }
  }, [initialCategory]);

  // Load existing registrations from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setPastRegistrations(JSON.parse(stored));
      }
    } catch {
      // Ignore JSON error
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Form validation
    if (!name.trim() || name.trim().length < 3) {
      setErrorMsg('Please enter your full official name (e.g., Mukasa Brian).');
      return;
    }

    const cleanPhone = phone.replace(/\s+/g, '');
    if (cleanPhone.length < 9) {
      setErrorMsg('Please enter a valid phone number (e.g. +256 706 770 872).');
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      // Generate unique bib ticket code
      const randomBib = Math.floor(100 + Math.random() * 900);
      const categoryPrefix = ageCategory.substring(0, 3).toUpperCase();
      const ticketCode = `TWC-${categoryPrefix}-${randomBib}`;

      const newRegistration: MemberRegistration = {
        id: `reg-${Date.now()}`,
        fullName: name.trim(),
        ageCategory,
        phone: phone.trim(),
        experienceLevel,
        interestedRace: selectedRace,
        schoolOrClub: schoolOrClub.trim() || 'Independent Athlete',
        registrationDate: new Date().toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        status: 'Confirmed',
        ticketCode,
      };

      const updated = [newRegistration, ...pastRegistrations];
      setPastRegistrations(updated);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error('Storage error:', err);
      }

      setConfirmedRegistration(newRegistration);
      setSubmitting(false);

      // Sync with Admin Roster & MoMo Payment Verification Queue
      if (onRegisterAthlete) {
        onRegisterAthlete({
          fullName: name.trim(),
          ageCategory,
          phone: phone.trim(),
          experienceLevel,
          schoolOrClub: schoolOrClub.trim() || 'Independent Athlete',
          interestedRace: selectedRace,
        });
      }

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#10B981', '#FF6D00', '#FFFFFF'],
        });
      } catch {
        // Fallback gracefully
      }
    }, 600);
  };

  const copyTicketCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <section id="registration" className="py-20 sm:py-28 bg-zinc-950 text-zinc-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Context, Benefits & Director Desk */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase tracking-wider font-heading">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Athlete & Member Portal</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-heading tracking-tight leading-tight">
              Join the Academy. Claim Your Race Bib.
            </h2>

            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              Whether you are an aspiring Senior One school champion, a self-funded road sprinter gearing up for the 105km Lubiri circuit, or a weekend community veteran, Together We Can Cycling Academy welcomes you.
            </p>

            {/* Registration perks */}
            <div className="space-y-3.5 pt-2">
              {[
                {
                  title: 'Official Transponder & Bib Number',
                  desc: 'Pick up your race chip & bib at BMK House Katwe verification desk.',
                },
                {
                  title: 'Direct Access to Morning Training Pacelines',
                  desc: 'Join weekly tactical loops at Lubiri Ring Road (Tue/Thu 6:00 AM).',
                },
                {
                  title: 'Equipment & Mechanical Assistance',
                  desc: 'Specialized bike tuning, safety checks, and loaner helmets for youths.',
                },
                {
                  title: 'Podium & Prize Eligibility',
                  desc: 'Official ranking for documented land titles, trophies, and academic grants.',
                },
              ].map((perk, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-white font-heading">{perk.title}</div>
                    <div className="text-xs text-zinc-400 mt-0.5">{perk.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Manager Solo Verification note */}
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-400 font-heading">
                  Have Questions Before Registering?
                </span>
                <span className="text-[11px] text-zinc-500 font-mono">BMK House Desk</span>
              </div>
              <p className="text-zinc-400">
                Call or WhatsApp Executive Director Solomon Ssebakaki ("Manager Solo") directly for team registrations, school delegations, or race rules.
              </p>
              <div className="pt-2 flex items-center gap-3">
                <a
                  href={`tel:${CLUB_INFO.primaryPhone}`}
                  className="text-white font-semibold hover:text-amber-400 transition-colors"
                >
                  {CLUB_INFO.primaryPhone}
                </a>
                <span className="text-zinc-600">•</span>
                <a
                  href={`tel:${CLUB_INFO.secondaryPhone}`}
                  className="text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  {CLUB_INFO.secondaryPhone}
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Portal Form */}
          <div className="lg:col-span-7 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 sm:p-8 lg:p-10 rounded-3xl border-2 border-zinc-800 shadow-2xl relative">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white font-heading">
                Registration & Membership Portal
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Please complete all required fields below. Official confirmation slip will be generated instantly.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-6 p-3.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Field 1: Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 font-heading mb-1.5">
                  Full Name (Required) <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Solomon Mukasa or Grace Namubiru"
                    className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
              </div>

              {/* Field 2: Age Category (Elite / Youth / Veteran / Fan) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 font-heading mb-1.5">
                  Age Category (Required) <span className="text-amber-400">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(['Elite', 'Youth', 'Veteran', 'Fan'] as AgeCategory[]).map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => {
                        setAgeCategory(cat);
                        if (cat === 'Youth') setExperienceLevel('Junior School Competitor (e.g. Senior One)');
                        if (cat === 'Elite') setExperienceLevel('Competitive Elite / Racer');
                      }}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold text-center border transition-all cursor-pointer ${
                        ageCategory === cat
                          ? 'bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/20'
                          : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      {cat}
                      {cat === 'Youth' && <span className="block text-[10px] opacity-80">S.1 / Schools</span>}
                      {cat === 'Elite' && <span className="block text-[10px] opacity-80">105 KM Pro</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Field 3: Phone Number */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 font-heading mb-1.5">
                  Phone Number (Uganda Hotline / WhatsApp) <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+256 706 770 872"
                    className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-mono transition-colors"
                  />
                </div>
                <div className="text-[11px] text-zinc-500 mt-1">
                  We use SMS/WhatsApp for bib assignment notifications & race morning briefings.
                </div>
              </div>

              {/* Field 4: Cycling Experience Level */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 font-heading mb-1.5">
                  Cycling Experience Level <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <Bike className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value as ExperienceLevel)}
                    className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 appearance-none cursor-pointer"
                  >
                    <option value="Junior School Competitor (e.g. Senior One)">
                      Junior School Competitor (e.g. Senior One / Youth)
                    </option>
                    <option value="Competitive Elite / Racer">
                      Competitive Elite / Racer (Road, Criterium, Stage Races)
                    </option>
                    <option value="Intermediate Club Rider">
                      Intermediate Club Rider (Weekend Pacelines, Group Rides)
                    </option>
                    <option value="Beginner / First-Time Rider">
                      Beginner / First-Time Rider (Learning Road Etiquette & Safety)
                    </option>
                  </select>
                </div>
              </div>

              {/* Additional Context Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">
                    School / Club / Institution (Optional)
                  </label>
                  <input
                    type="text"
                    value={schoolOrClub}
                    onChange={(e) => setSchoolOrClub(e.target.value)}
                    placeholder="e.g. Mengo SS / Katwe Cyclists"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">
                    Marquee Race / Program
                  </label>
                  <select
                    value={selectedRace}
                    onChange={(e) => setSelectedRace(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-zinc-600 cursor-pointer"
                  >
                    <option value="Inaugural Reconciliatory Cycling Race (Lubiri Ring Road)">
                      Inaugural Reconciliatory Cycling Race (Lubiri)
                    </option>
                    <option value="TWC Academy Youth Mentorship Program (Senior One)">
                      TWC Academy Youth Mentorship (Senior One)
                    </option>
                    <option value="Katwe Grassroots Youth Criterium">
                      Katwe Grassroots Youth Criterium
                    </option>
                    <option value="General TWC Cycling Club Membership">
                      General Club Membership & Pacelines
                    </option>
                  </select>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-xl font-heading font-bold text-base text-black bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {submitting ? (
                    <span>Assigning Official Race Bib...</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5 text-black" />
                      <span>Submit Application & Claim Official Bib</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Confirmation Modal / Bib Pass */}
        {confirmedRegistration && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-zinc-900 border-2 border-amber-500 max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-2xl relative text-zinc-100 space-y-6">
              <button
                onClick={() => setConfirmedRegistration(null)}
                className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-lg bg-zinc-800/80 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-white font-heading">
                  Registration Confirmed!
                </h3>
                <p className="text-xs text-zinc-400">
                  Together We Can Cycling Uganda Limited • Katwe, Kampala
                </p>
              </div>

              {/* Digital Bib Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-zinc-950 to-zinc-900 border border-amber-500/40 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 font-heading">
                      Official Bib Number
                    </span>
                    <div className="text-3xl font-black font-mono text-white tracking-wider">
                      {confirmedRegistration.ticketCode}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-zinc-400">Category</span>
                    <div className="text-sm font-bold text-amber-300 font-heading">
                      {confirmedRegistration.ageCategory} Division
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-zinc-500">Athlete Name:</span>
                    <div className="font-bold text-zinc-200">{confirmedRegistration.fullName}</div>
                  </div>
                  <div>
                    <span className="text-zinc-500">Contact:</span>
                    <div className="font-mono text-zinc-200">{confirmedRegistration.phone}</div>
                  </div>
                  <div className="col-span-2 pt-1">
                    <span className="text-zinc-500">Selected Race:</span>
                    <div className="text-zinc-200 font-medium">{confirmedRegistration.interestedRace}</div>
                  </div>
                  <div className="col-span-2">
                    <span className="text-zinc-500">Level:</span>
                    <div className="text-zinc-300">{confirmedRegistration.experienceLevel}</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-400 flex items-center justify-between">
                  <span>Desk: BMK House Katwe</span>
                  <span className="text-emerald-400 font-bold">Status: Active & Verified</span>
                </div>
              </div>

              {/* Actions: Copy Code & WhatsApp confirmation */}
              <div className="space-y-2.5">
                <div className="flex gap-2">
                  <button
                    onClick={() => copyTicketCode(confirmedRegistration.ticketCode)}
                    className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedCode ? 'Bib Code Copied' : 'Copy Bib Code'}</span>
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Slip</span>
                  </button>
                </div>

                <a
                  href={`https://wa.me/256706770872?text=Hello%20Manager%20Solo,%20I%20have%20registered%20for%20TWC%20Cycling%20Academy.%20My%20Name:%20${encodeURIComponent(
                    confirmedRegistration.fullName
                  )}%20|%20Bib:%20${confirmedRegistration.ticketCode}%20|%20Category:%20${confirmedRegistration.ageCategory}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-emerald-600/20"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Notify Manager Solo on WhatsApp (+256706770872)</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
