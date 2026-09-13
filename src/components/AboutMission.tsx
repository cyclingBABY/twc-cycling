import React from 'react';
import { CLUB_INFO } from '../data/cyclingData';
import { Heart, Bike, Video, Users, CheckCircle2, Award, ArrowUpRight, Phone, MessageSquare } from 'lucide-react';

interface AboutMissionProps {
  onRegisterClick: () => void;
  onJoinClick: () => void;
}

export const AboutMission: React.FC<AboutMissionProps> = ({ onRegisterClick, onJoinClick }) => {
  const pillars = [
    {
      icon: <Bike className="w-6 h-6 text-amber-400" />,
      title: 'Backing Self-Funded Athletes',
      description:
        'In Uganda, world-class potential often rides on second-hand frames. We provide race kits, mechanical support, nutritional guidance, and race logistics to athletes who otherwise lack corporate backing.',
    },
    {
      icon: <Users className="w-6 h-6 text-emerald-400" />,
      title: 'Inclusive Community & Grassroots',
      description:
        'From secondary school youth—with a devoted focus on Senior One students—to veterans and women riders, we democratize cycling so that anyone with the passion can train safely.',
    },
    {
      icon: <Video className="w-6 h-6 text-cyan-400" />,
      title: 'Media Representation & Promotion',
      description:
        'We elevate Ugandan riders by broadcasting races, telling grassroots athlete stories, documenting regional tours, and showcasing our peloton to national and international cycling networks.',
    },
    {
      icon: <Heart className="w-6 h-6 text-orange-400" />,
      title: 'Advocacy & Regional Solidarity',
      description:
        'Using the bicycle to inspire hope, traveling across the country—such as to Northern Uganda for the Irene Gleeson Memorial Bicycle Race—to advocate for peace, health, and youth dignity.',
    },
  ];

  return (
    <section id="about" className="py-20 sm:py-28 bg-zinc-950 text-zinc-100 relative overflow-hidden border-b border-zinc-800/80">
      {/* Subtle background glow */}
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider font-heading mb-3">
            About TWC Cycling Academy • Kampala, Uganda
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-heading tracking-tight">
            Rooted in Katwe, Racing for Uganda’s Future.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-300 leading-relaxed">
            Together We Can Cycling Uganda Limited (TWC Cycling Academy) was founded on a fearless principle:
            the bicycle is not merely a tool for sport—it is an engine for youth empowerment, social mobility, and national unity.
          </p>
        </div>

        {/* Two-Column Spotlight: Director & Mission Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-20">
          {/* Director & Academy Profile Card */}
          <div className="lg:col-span-5 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 sm:p-8 rounded-2xl border border-zinc-800 shadow-2xl relative">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-500/20 border-2 border-amber-500/50 flex items-center justify-center text-amber-400 font-heading font-black text-2xl flex-shrink-0">
                SS
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-amber-400 font-bold font-heading">
                  Leadership Spotlight
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-heading">
                  Solomon Ssebakaki
                </h3>
                <p className="text-sm text-zinc-400 font-medium">
                  Known widely across Ugandan Cycling as{' '}
                  <span className="text-amber-300 font-bold">"Manager Solo"</span>
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Founder & Executive Director, TWC Cycling Uganda
                </p>
              </div>
            </div>

            <blockquote className="italic text-zinc-300 text-sm sm:text-base border-l-2 border-amber-500 pl-4 py-1 mb-6">
              "We built Together We Can Cycling Academy because too many talented young boys and girls in Katwe and across Ugandan schools had the heart of a champion, but no bike to race. When we pool our passion and back self-funded riders, there is no peloton in Africa we cannot lead."
            </blockquote>

            <div className="space-y-2.5 pt-4 border-t border-zinc-800/80 text-xs sm:text-sm text-zinc-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Head Office: BMK House, Katwe, Kampala</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Home Circuit: Lubiri Ring Road (Mengo)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Focus: Senior One Students, Elite Racers & Veterans</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800 flex flex-wrap gap-2.5">
              <a
                href={`tel:${CLUB_INFO.primaryPhone}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Call Manager Solo</span>
              </a>
              <a
                href={CLUB_INFO.socialLinks.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp Desk</span>
              </a>
            </div>
          </div>

          {/* Core Mission Narrative & Vision */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-zinc-900/60 p-6 sm:p-8 rounded-2xl border border-zinc-800/80">
              <h3 className="text-xl sm:text-2xl font-bold text-white font-heading mb-3 flex items-center gap-2">
                <Award className="w-6 h-6 text-amber-400" />
                <span>Our Core Mission: The Power of the Bicycle</span>
              </h3>
              <p className="text-zinc-300 text-base leading-relaxed mb-4">
                Together We Can Cycling Uganda Limited is committed to using the power of the bicycle to build a more inclusive local cycling community, supporting self-funded athletes, and spreading the love for the sport through media representation and high-caliber racing events.
              </p>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Operating out of BMK House in Katwe, our academy serves as a central hub where aspiring riders find mechanical gear, certified coaching, road safety skills, and a transparent pathway into elite racing—including our marquee event, the <strong className="text-zinc-200">Inaugural Reconciliatory Cycling Race</strong> on the Lubiri Ring Road.
              </p>
            </div>

            {/* Target Audience Grid */}
            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/60">
              <h4 className="text-xs uppercase tracking-wider text-amber-400 font-bold font-heading mb-3">
                Who We Serve & Welcome
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { title: 'Elite Racers', note: 'Continental & National Level' },
                  { title: 'Senior One Youths', note: 'School Grassroots Program' },
                  { title: 'Cycling Fans', note: 'Cheering & Community Rides' },
                  { title: 'Community Veterans', note: 'Fitness & Mentorship' },
                  { title: 'Armed Forces Units', note: 'Inter-Agency Contests' },
                  { title: 'Sponsors & Media', note: 'Broadcasting & Partnerships' },
                ].map((aud, i) => (
                  <div key={i} className="bg-zinc-950/80 p-3 rounded-xl border border-zinc-800/80">
                    <div className="text-sm font-bold text-zinc-100 font-heading">{aud.title}</div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">{aud.note}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, index) => (
            <div
              key={index}
              className="bg-zinc-900/70 hover:bg-zinc-900 p-6 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  {pillar.icon}
                </div>
                <h4 className="text-lg font-bold text-white font-heading mb-2">
                  {pillar.title}
                </h4>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
