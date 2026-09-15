import React, { useState } from 'react';
import { ADVOCACY_STORIES, CLUB_INFO } from '../data/cyclingData';
import { Heart, Users, Wrench, Shield, Sparkles, MapPin, ChevronRight, Check, Compass } from 'lucide-react';

export const CommunityImpact: React.FC = () => {
  const [selectedStoryId, setSelectedStoryId] = useState<string>(ADVOCACY_STORIES[0].id);

  const activeStory = ADVOCACY_STORIES.find((s) => s.id === selectedStoryId) || ADVOCACY_STORIES[0];

  return (
    <section id="community" className="py-20 sm:py-28 bg-zinc-950 text-zinc-100 relative overflow-hidden border-t border-zinc-800/80">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 -right-32 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider font-heading mb-3">
            <Heart className="w-3.5 h-3.5" />
            <span>Community Impact & Advocacy</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-heading tracking-tight">
            More Than Medals: Cycling as a Catalyst for Change
          </h2>
          <p className="mt-3 text-zinc-300 text-base sm:text-lg leading-relaxed">
            From Katwe’s bustling workshops to the rural roads of Northern Uganda, Together We Can Cycling Academy mobilizes athletes, equipment, and community spirit to uplift vulnerable communities.
          </p>
        </div>

        {/* Highlight Banner: Expedition to Northern Uganda for Irene Gleeson Memorial Bicycle Race */}
        <div className="relative rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[420px]">
            {/* Left Image & Overlay */}
            <div className="lg:col-span-6 relative min-h-[280px] lg:min-h-full">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7WBsfFNzFp04i3JTuiQCmIxNf9Y1L6-TeUcaewO_8mg&s"
                alt="TWC Cycling peloton racing for charity in Irene Gleeson Memorial Bicycle Race, Northern Uganda"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-zinc-950/90 via-zinc-950/40 to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 bg-zinc-950/90 backdrop-blur-md p-3.5 rounded-xl border border-zinc-800">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold font-heading uppercase">
                  <Compass className="w-4 h-4" />
                  <span>Northern Uganda Solidarity Caravan</span>
                </div>
                <div className="text-xs text-zinc-300 mt-1">
                  Over 450 km journey to Kitgum for the Irene Gleeson Memorial Bicycle Race.
                </div>
              </div>
            </div>

            {/* Right Story & Impact Metrics */}
            <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 text-[11px] font-bold uppercase tracking-wider mb-3">
                  Marquee Regional Milestone
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-heading leading-tight">
                  Irene Gleeson Memorial Bicycle Race
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 mt-3 leading-relaxed">
                  TWC Cycling Academy Director Solomon Ssebakaki mobilized riders to traverse the country to Kitgum in Northern Uganda. By participating in this memorial ride, our riders raised grassroots medical relief, supported orphans, and demonstrated that the bicycle is a tool for reconciliation, healing, and peace.
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                    <div className="text-xl sm:text-2xl font-black text-amber-400 font-heading">
                      450+ KM
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      Kampala to Kitgum Caravan
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                    <div className="text-xl sm:text-2xl font-black text-emerald-400 font-heading">
                      200+ Youth
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      Orphaned Children Supported
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-zinc-400">
                  Advocacy Coordinator: <strong className="text-white">Solomon Ssebakaki</strong>
                </span>
                <a
                  href={`tel:${CLUB_INFO.primaryPhone}`}
                  className="text-amber-400 hover:text-amber-300 font-semibold"
                >
                  Join Regional Caravans →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Core Micro-Initiatives & Inclusivity Pillars */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white font-heading">
                Grassroots Micro-Initiatives
              </h3>
              <p className="text-sm text-zinc-400 mt-1">
                Bridging the divide for women riders, Senior One school champions, and local mechanic apprentices.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ADVOCACY_STORIES.map((story) => (
              <div
                key={story.id}
                onClick={() => setSelectedStoryId(story.id)}
                className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedStoryId === story.id
                    ? 'bg-zinc-900 border-amber-500 shadow-xl'
                    : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900'
                }`}
              >
                <div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {story.tags.slice(0, 2).map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-zinc-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h4 className="text-lg font-bold text-white font-heading mb-2">
                    {story.title}
                  </h4>

                  <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                    {story.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-zinc-800/80">
                  <div className="text-[11px] font-mono text-emerald-400 font-medium">
                    {story.impactMetrics}
                  </div>
                  <div className="text-[11px] text-zinc-400 italic mt-1">
                    "{story.keyHighlight}"
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Community Testimony / Call for Sponsors & Partners */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h4 className="text-2xl font-bold text-white font-heading">
              Support an Aspiring Ugandan Athlete
            </h4>
            <p className="text-sm text-zinc-300 leading-relaxed">
              We welcome international cycling networks, corporate sponsors, and local well-wishers to partner with TWC Cycling Academy. Your support provides helmets, tires, mechanical tools, and race entries for youth riders who represent Uganda with grit.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <a
              href={`tel:${CLUB_INFO.primaryPhone}`}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-heading font-bold text-sm text-black bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-center transition-colors cursor-pointer"
            >
              Sponsor an Athlete
            </a>
            <a
              href={CLUB_INFO.socialLinks.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-5 py-3 rounded-xl font-heading font-semibold text-sm text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-center transition-colors"
            >
              Partner with Manager Solo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
