import React, { useState, useEffect } from 'react';
import { TWCLogo } from './TWCLogo';
import { CLUB_INFO } from '../data/cyclingData';
import { SiteContentSettings } from '../types';
import { Phone, Menu, X, Calendar, UserPlus, MapPin, ChevronRight, Award, Lock } from 'lucide-react';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  onOpenRegisterModal?: (category?: string) => void;
  onOpenAdmin?: () => void;
  siteContent?: SiteContentSettings;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigate,
  onOpenRegisterModal,
  onOpenAdmin,
  siteContent,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const phone1 = siteContent?.hotline1 || CLUB_INFO.primaryPhone;
  const phone2 = siteContent?.hotline2 || CLUB_INFO.secondaryPhone;
  const address = siteContent?.headquartersAddress || 'BMK House, Katwe, Kampala, Uganda';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'About Club', id: 'about' },
    { label: 'Events & Races', id: 'events', badge: 'Featured' },
    { label: 'Race Categories', id: 'categories' },
    { label: 'Lubiri Circuit', id: 'circuit' },
    { label: 'Community & Advocacy', id: 'community' },
    { label: 'Media & Videos', id: 'media' },
    { label: 'Contact', id: 'contact' },
  ];

  const handleLinkClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  return (
    <>
      {/* Top micro-bar with Katwe Kampala HQ and Official Hotline */}
      <div className="bg-zinc-950/90 text-zinc-400 text-xs border-b border-zinc-800/80 px-4 py-1.5 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              <span>{address}</span>
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-400">
              Executive Director: <strong className="text-zinc-200">Solomon Ssebakaki (Manager Solo)</strong>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={`tel:${phone1}`}
              className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Hotline 1: {phone1}</span>
            </a>
            <span className="text-zinc-600">|</span>
            <a
              href={`tel:${phone2}`}
              className="hover:text-amber-400 transition-colors"
            >
              Hotline 2: {phone2}
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-200 ${
          isScrolled
            ? 'bg-zinc-950/95 backdrop-blur-md shadow-xl border-b border-zinc-800/80 py-2.5'
            : 'bg-zinc-950/80 backdrop-blur-sm border-b border-zinc-800/40 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Emblem */}
          <button
            onClick={() => handleLinkClick('hero')}
            className="flex items-center text-left focus:outline-none group cursor-pointer"
            aria-label="TWC Cycling Uganda Home"
          >
            <TWCLogo size="md" />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleLinkClick(item.id)}
                className="relative px-3 py-1.5 text-sm font-medium text-zinc-300 hover:text-white rounded-md hover:bg-zinc-900/80 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.2 text-[10px] uppercase font-bold tracking-wider rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2">
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono font-bold text-amber-300 bg-zinc-900 hover:bg-zinc-800 border border-amber-500/50 hover:border-amber-400 transition-colors cursor-pointer shadow-sm"
                title="Code5 Admin Access (twc@code5)"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>code5</span>
              </button>
            )}

            <button
              onClick={() => handleLinkClick('registration')}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs md:text-sm font-semibold text-zinc-200 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-600 transition-colors cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-emerald-400" />
              <span>Join Academy</span>
            </button>

            <button
              onClick={() => {
                if (onOpenRegisterModal) {
                  onOpenRegisterModal('Elite Category');
                } else {
                  handleLinkClick('events');
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-bold text-black bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 shadow-md shadow-amber-500/20 hover:shadow-amber-500/30 transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-black" />
              <span>Race Registration</span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => handleLinkClick('registration')}
              className="sm:hidden px-2.5 py-1.5 rounded-md text-xs font-bold bg-amber-500 text-black flex items-center gap-1 cursor-pointer"
            >
              <span>Register</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800 cursor-pointer focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-zinc-950 border-b border-zinc-800 px-4 pt-3 pb-6 mt-2 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="text-xs text-zinc-400 pb-2 border-b border-zinc-900 flex flex-col gap-1">
              <span className="font-semibold text-zinc-200">BMK House, Katwe, Kampala</span>
              <span>Manager Solo: {CLUB_INFO.primaryPhone}</span>
            </div>

            <div className="grid grid-cols-1 gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleLinkClick(item.id)}
                  className="w-full text-left px-3 py-2.5 rounded-md text-sm font-medium text-zinc-200 hover:bg-zinc-900 flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-amber-500" />
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-zinc-900 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenRegisterModal) {
                    onOpenRegisterModal('Elite Category');
                  } else {
                    handleLinkClick('events');
                  }
                }}
                className="w-full py-2.5 rounded-lg text-sm font-bold text-black bg-gradient-to-r from-amber-400 to-orange-500 text-center flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Register for Upcoming Races</span>
              </button>

              <button
                onClick={() => handleLinkClick('registration')}
                className="w-full py-2.5 rounded-lg text-sm font-semibold text-zinc-200 bg-zinc-900 border border-zinc-800 text-center flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-emerald-400" />
                <span>Join TWC Academy</span>
              </button>

              <a
                href={`tel:${CLUB_INFO.primaryPhone}`}
                className="w-full py-2 rounded-lg text-xs font-medium text-zinc-400 text-center flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Call Manager Solo: {CLUB_INFO.primaryPhone}</span>
              </a>

              {onOpenAdmin && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className="w-full py-2.5 rounded-lg text-xs font-mono font-bold text-amber-300 bg-zinc-900 border border-amber-500/40 flex items-center justify-center gap-2 cursor-pointer hover:bg-zinc-800 transition-colors"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Open code5 Admin Panel (twc@code5)</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};
