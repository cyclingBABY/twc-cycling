import React, { useState, useEffect } from 'react';
import { CLUB_INFO } from '../data/cyclingData';
import { Flag, ArrowRight, ShieldCheck, Trophy, Users, ChevronLeft, ChevronRight, MapPin, Zap } from 'lucide-react';

interface HeroProps {
  onRegisterClick: () => void;
  onJoinAcademyClick: () => void;
  onViewCircuitClick: () => void;
}

const HERO_SLIDES = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1920&auto=format&fit=crop',
    caption: 'High-speed peloton paceline racing on closed urban asphalt at Lubiri Ring Road',
    tag: 'Flagship Circuit • 105 KM Elite Contest',
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?q=80&w=1920&auto=format&fit=crop',
    caption: 'TWC Cycling Uganda Academy riders competing in regional milestone tours',
    tag: 'Youth Development • Senior One Program',
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=1920&auto=format&fit=crop',
    caption: 'Empowering self-funded Ugandan athletes with race equipment and mechanical grit',
    tag: 'Katwe, Kampala • Community Advocacy',
  },
];

export const Hero: React.FC<HeroProps> = ({
  onRegisterClick,
  onJoinAcademyClick,
  onViewCircuitClick,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  return (
    <div id="hero" className="relative bg-zinc-950 overflow-hidden min-h-[92vh] flex flex-col justify-between">
      {/* Background Image Carousel with athletic overlays */}
      <div className="absolute inset-0 z-0">
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <img
              src={slide.url}
              alt={slide.caption}
              className="w-full h-full object-cover object-center scale-105 transform motion-safe:transition-transform motion-safe:duration-10000"
            />
            {/* Gradients: deep highway asphalt overlay with directional lighting */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-zinc-950/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/70 to-transparent" />
            <div className="absolute inset-0 bg-radial from-transparent via-black/40 to-black/80" />
          </div>
        ))}
      </div>

      {/* Slide Navigation Controls */}
      <div className="absolute top-1/2 -translate-y-1/2 right-4 sm:right-8 z-20 hidden md:flex flex-col gap-2">
        <button
          onClick={prevSlide}
          className="p-2.5 rounded-full bg-zinc-900/80 hover:bg-amber-500 hover:text-black text-white border border-zinc-700/60 backdrop-blur-sm transition-all cursor-pointer"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="p-2.5 rounded-full bg-zinc-900/80 hover:bg-amber-500 hover:text-black text-white border border-zinc-700/60 backdrop-blur-sm transition-all cursor-pointer"
          aria-label="Next image"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-16 flex-1 flex flex-col justify-center">
        <div className="max-w-3xl space-y-6">
          {/* Badge indicator */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/90 border border-amber-500/40 backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-heading">
              Together We Can Cycling Uganda Ltd • Katwe, Kampala
            </span>
          </div>

          {/* Exact Required Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-heading leading-tight">
            Together We Can Cycling Academy:{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200">
              Empowering Talent, Building Community.
            </span>
          </h1>

          {/* Exact Required Subheadline */}
          <p className="text-lg sm:text-xl text-zinc-300 font-normal leading-relaxed max-w-2xl">
            Uganda's premier cycling club dedicated to nurturing youth riders, elite competitors, and bringing cycling enthusiasts together.
          </p>

          {/* Active slide badge info */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-300/90 bg-zinc-900/60 backdrop-blur-md px-3.5 py-2 rounded-lg border border-zinc-800 w-fit">
            <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>{HERO_SLIDES[currentSlide].caption}</span>
          </div>

          {/* Required CTA Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3.5 sm:gap-4">
            <button
              onClick={onRegisterClick}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-heading font-bold text-base text-black bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <Flag className="w-5 h-5 text-black" />
              <span>Register for Upcoming Races</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>

            <button
              onClick={onJoinAcademyClick}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-heading font-semibold text-base text-white bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 hover:border-amber-400/50 backdrop-blur-md transition-all cursor-pointer"
            >
              <Users className="w-5 h-5 text-emerald-400" />
              <span>Join the Academy</span>
            </button>

            <button
              onClick={onViewCircuitClick}
              className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-amber-400 px-3 py-2 transition-colors cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Explore Lubiri Circuit (105km / 30 Laps)</span>
            </button>
          </div>

          {/* Slide dots */}
          <div className="flex items-center gap-2 pt-2">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  idx === currentSlide ? 'w-8 bg-amber-400' : 'w-2 bg-zinc-600 hover:bg-zinc-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Live Stats Ribbon at bottom of Hero */}
      <div className="relative z-10 border-t border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 divide-y md:divide-y-0 md:divide-x divide-zinc-800/80">
            {CLUB_INFO.stats.map((stat, i) => (
              <div key={i} className={`flex items-center gap-3.5 ${i > 0 ? 'md:pl-6' : ''} ${i > 1 ? 'pt-3 md:pt-0' : ''}`}>
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
                  {i === 0 && <Users className="w-5 h-5" />}
                  {i === 1 && <Trophy className="w-5 h-5" />}
                  {i === 2 && <Flag className="w-5 h-5" />}
                  {i === 3 && <ShieldCheck className="w-5 h-5" />}
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold text-white font-heading tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs text-zinc-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
