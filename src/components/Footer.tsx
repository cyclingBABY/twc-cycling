import React from 'react';
import { CLUB_INFO } from '../data/cyclingData';
import { TWCLogo } from './TWCLogo';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
  Facebook,
  Twitter,
  MessageSquare,
  ArrowUp,
  Shield,
  Heart,
  Lock,
} from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="bg-zinc-950 text-zinc-300 border-t border-zinc-800 relative">
      {/* Top Banner with Direct Registration Helplines */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 text-black py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2 font-heading font-black text-sm uppercase tracking-wide">
            <Phone className="w-4 h-4 text-black flex-shrink-0" />
            <span>Official TWC Race Registration Hotlines:</span>
            <span className="font-mono underline font-bold">+256 706 770 872</span>
            <span className="opacity-60">/</span>
            <span className="font-mono underline font-bold">+256 763 145 915</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`tel:${CLUB_INFO.primaryPhone}`}
              className="px-3.5 py-1.5 rounded-lg bg-black text-white text-xs font-bold font-heading hover:bg-zinc-800 transition-colors"
            >
              Call Manager Solo
            </a>
            <a
              href={CLUB_INFO.socialLinks.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-bold font-heading hover:bg-emerald-600 transition-colors flex items-center gap-1"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Column 1: Brand & Katwe Address (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <TWCLogo size="lg" />
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mt-2">
              Together We Can Cycling Uganda Limited (TWC Cycling Academy) is dedicated to nurturing youth riders, elite competitors, and bringing cycling enthusiasts together through premier racing and community solidarity.
            </p>

            <div className="space-y-2 pt-2 text-xs text-zinc-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-white block font-heading">Physical Head Office:</strong>
                  <span>BMK House, Katwe, Kampala, Uganda</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>+256 706 770 872 / +256 763 145 915</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>{CLUB_INFO.email}</span>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <a
                href={CLUB_INFO.socialLinks.youtube}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-zinc-900 hover:bg-red-600 hover:text-white border border-zinc-800 flex items-center justify-center transition-colors text-zinc-300"
                aria-label="YouTube Channel UCcyYTjupx6KfAfe-ON_Wqlg"
                title="YouTube: UCcyYTjupx6KfAfe-ON_Wqlg"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-red-500 hover:text-white">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a
                href={CLUB_INFO.socialLinks.tiktok}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-zinc-900 hover:bg-cyan-500 hover:text-black border border-zinc-800 flex items-center justify-center transition-colors text-zinc-300"
                aria-label="TikTok @togetherwecancyclingug"
                title="TikTok @togetherwecancyclingug"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-cyan-400">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.26 6.26 0 0 0 1.87-4.49V8.62a8.28 8.28 0 0 0 4.9 1.58V6.75a4.85 4.85 0 0 1-1-.06Z" />
                </svg>
              </a>
              <a
                href={CLUB_INFO.socialLinks.instagram}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-zinc-900 hover:bg-pink-600 hover:text-white border border-zinc-800 flex items-center justify-center transition-colors text-zinc-300"
                aria-label="Instagram @togetherwecancyclingug"
                title="Instagram @togetherwecancyclingug"
              >
                <Instagram className="w-4 h-4 text-pink-400" />
              </a>
              <a
                href={CLUB_INFO.socialLinks.facebook}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-zinc-900 hover:bg-blue-600 hover:text-white border border-zinc-800 flex items-center justify-center transition-colors text-zinc-300"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={CLUB_INFO.socialLinks.twitter}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-zinc-900 hover:bg-amber-500 hover:text-black border border-zinc-800 flex items-center justify-center transition-colors text-zinc-300"
                aria-label="Twitter / X"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href={CLUB_INFO.socialLinks.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-zinc-900 hover:bg-emerald-500 hover:text-white border border-zinc-800 flex items-center justify-center transition-colors text-zinc-300"
                aria-label="WhatsApp"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
              </a>
            </div>
          </div>

          {/* Column 2: Weekly Academy Training Schedule (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-heading flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Academy Training Schedule</span>
            </h4>
            <div className="space-y-3 text-xs">
              <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80">
                <div className="font-bold text-amber-300 font-heading">Tue & Thu (06:00 - 08:30 AM)</div>
                <div className="text-zinc-300 font-medium mt-0.5">Lubiri Ring Road Criterium Drills</div>
                <div className="text-[11px] text-zinc-500">Pacing, sprint shootouts & pack cornering</div>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80">
                <div className="font-bold text-emerald-300 font-heading">Saturdays (06:30 AM - 12:00 PM)</div>
                <div className="text-zinc-300 font-medium mt-0.5">Kampala - Masaka Road Endurance Paceline</div>
                <div className="text-[11px] text-zinc-500">80 - 120 km long distance base mileage</div>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80">
                <div className="font-bold text-cyan-300 font-heading">Sundays (02:00 - 05:00 PM)</div>
                <div className="text-zinc-300 font-medium mt-0.5">Senior One & Youth Skills Clinic</div>
                <div className="text-[11px] text-zinc-500">BMK House & Lubiri perimeter grounds</div>
              </div>
            </div>
          </div>

          {/* Column 3: Quick Navigation (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { label: 'About Club & Director', id: 'about' },
                { label: 'Upcoming Races', id: 'events' },
                { label: 'Lubiri 105km Circuit', id: 'circuit' },
                { label: 'Race Categories', id: 'categories' },
                { label: 'Media & Videos (YT / TikTok / IG)', id: 'media' },
                { label: 'Community & Advocacy', id: 'community' },
                { label: 'Registration Portal', id: 'registration' },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => onNavigate(link.id)}
                    className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
              {onOpenAdmin && (
                <li className="pt-2">
                  <button
                    id="footer-admin-panel-link"
                    onClick={onOpenAdmin}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/10 hover:from-amber-500/30 hover:to-amber-600/20 border border-amber-500/50 text-amber-300 hover:text-white transition-all cursor-pointer font-heading font-bold text-xs group shadow-sm"
                    title="Open TWC Admin Panel (Passcode: twc@code5)"
                  >
                    <span className="flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                      <span>Admin Panel</span>
                    </span>
                    <span className="text-[10px] bg-amber-500 text-black px-1.5 py-0.5 rounded font-mono font-black">
                      twc@code5
                    </span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Column 4: Official Verification & Seal (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-heading flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Official Registration</span>
            </h4>
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs space-y-2">
              <div className="font-bold text-white font-heading">
                Together We Can Cycling Uganda Ltd
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Registered sports and community cycling enterprise in the Republic of Uganda. Affiliated with regional cycling development networks.
              </p>
              <div className="pt-2 border-t border-zinc-800 text-[11px] text-amber-400 font-semibold">
                Executive Director: Solomon Ssebakaki
              </div>
            </div>

            <button
              onClick={() => onNavigate('registration')}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-bold text-xs font-heading text-center cursor-pointer transition-colors"
            >
              Online Race Registration Form
            </button>
          </div>
        </div>

        {/* Bottom copyright & back to top */}
        <div className="mt-14 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>
            © {new Date().getFullYear()} Together We Can Cycling Uganda Limited. Head Office: BMK House, Katwe, Kampala. All rights reserved.
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <span className="hidden sm:inline">Empowering Talent, Building Community.</span>
            {onOpenAdmin && (
              <button
                id="footer-bottom-admin-btn"
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-amber-500/60 hover:border-amber-400 text-amber-300 hover:text-white font-mono text-xs font-bold transition-all cursor-pointer shadow-md"
                title="TWC Operations Desk & Content Manager (twc@code5)"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Panel</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1 rounded font-normal">
                  twc@code5
                </span>
              </button>
            )}
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 flex items-center gap-1 cursor-pointer transition-colors"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
              <span className="text-[11px]">Top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
