import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../translations';
import { Train, Menu, X, Shield, Clock, ExternalLink } from 'lucide-react';

interface NavbarProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onLanguageChange,
  onOpenAdmin,
  isAdminLoggedIn,
  onNavigate
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[currentLang];

  const handleNavClick = (sectionId: string) => {
    onNavigate(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0f281e] text-amber-50 border-b border-emerald-900/60 shadow-md">
      {/* Top micro-bar: station elevation, date & language switcher */}
      <div className="bg-[#091b14] text-xs text-emerald-200/80 px-4 py-1.5 border-b border-emerald-950">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <span className="font-medium text-emerald-100 flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {t.stationLocation}
            </span>
            <span className="hidden sm:inline text-emerald-500">/</span>
            <span className="hidden sm:inline text-emerald-300/80">Station Code: ELA</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="flex items-center bg-emerald-950/90 rounded border border-emerald-800/60 p-0.5">
              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-0.5 text-xs font-medium rounded transition-colors ${
                  currentLang === 'en'
                    ? 'bg-amber-400 text-[#091b14] font-semibold'
                    : 'text-emerald-200 hover:text-white'
                }`}
                title="English"
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('si')}
                className={`px-2 py-0.5 text-xs font-medium rounded transition-colors ${
                  currentLang === 'si'
                    ? 'bg-amber-400 text-[#091b14] font-semibold'
                    : 'text-emerald-200 hover:text-white'
                }`}
                title="සිංහල"
              >
                සිංහල
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('ta')}
                className={`px-2 py-0.5 text-xs font-medium rounded transition-colors ${
                  currentLang === 'ta'
                    ? 'bg-amber-400 text-[#091b14] font-semibold'
                    : 'text-emerald-200 hover:text-white'
                }`}
                title="தமிழ்"
              >
                தமிழ்
              </button>
            </div>

            {/* Admin shortcut button */}
            <button
              type="button"
              onClick={onOpenAdmin}
              className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded transition-colors ${
                isAdminLoggedIn
                  ? 'bg-amber-500 text-slate-950 font-semibold'
                  : 'text-emerald-300 hover:text-white hover:bg-emerald-900/60'
              }`}
              title="Station Admin Portal"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{isAdminLoggedIn ? 'Dashboard' : t.navAdmin}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Brand identity */}
        <div
          onClick={() => handleNavClick('home')}
          className="cursor-pointer flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded bg-emerald-800 border border-amber-400/50 flex items-center justify-center text-amber-300 group-hover:scale-105 transition-transform">
            <Train className="w-6 h-6" />
          </div>
          <div>
            <div className="font-serif text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-amber-200 transition-colors">
              {t.siteTitle}
            </div>
            <div className="text-xs text-emerald-300/80 tracking-wide font-sans">
              ellatraintimes.com · Main Line Railway Sri Lanka
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links (Zero-pill text navigation with subtle hovers) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-emerald-100">
          <button
            onClick={() => handleNavClick('timetable')}
            className="hover:text-amber-300 transition-colors py-1 cursor-pointer"
          >
            {t.navTimetable}
          </button>
          <button
            onClick={() => handleNavClick('fares')}
            className="hover:text-amber-300 transition-colors py-1 cursor-pointer"
          >
            {t.navFares}
          </button>
          <button
            onClick={() => handleNavClick('station-guide')}
            className="hover:text-amber-300 transition-colors py-1 cursor-pointer"
          >
            {t.navStationInfo}
          </button>
          <button
            onClick={() => handleNavClick('attractions')}
            className="hover:text-amber-300 transition-colors py-1 cursor-pointer"
          >
            {t.navAttractions}
          </button>
          <button
            onClick={() => handleNavClick('emergency')}
            className="hover:text-amber-300 transition-colors py-1 cursor-pointer"
          >
            {t.navEmergency}
          </button>
          <button
            onClick={() => handleNavClick('feedback')}
            className="hover:text-amber-300 transition-colors py-1 cursor-pointer"
          >
            {t.navFeedback}
          </button>

          <a
            href="https://eservices.railway.gov.lk/schedule/homeAction.action?lag=en"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-amber-400 text-emerald-950 rounded hover:bg-amber-300 transition-colors shadow-sm"
          >
            <span>Official SLR Portal</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </nav>

        {/* Mobile menu trigger */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-emerald-200 hover:text-white rounded hover:bg-emerald-900"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0c2018] border-t border-emerald-900 px-4 py-4 space-y-3">
          <button
            onClick={() => handleNavClick('timetable')}
            className="block w-full text-left py-2 px-3 rounded text-sm text-emerald-100 hover:bg-emerald-900/60"
          >
            {t.navTimetable}
          </button>
          <button
            onClick={() => handleNavClick('fares')}
            className="block w-full text-left py-2 px-3 rounded text-sm text-emerald-100 hover:bg-emerald-900/60"
          >
            {t.navFares}
          </button>
          <button
            onClick={() => handleNavClick('station-guide')}
            className="block w-full text-left py-2 px-3 rounded text-sm text-emerald-100 hover:bg-emerald-900/60"
          >
            {t.navStationInfo}
          </button>
          <button
            onClick={() => handleNavClick('attractions')}
            className="block w-full text-left py-2 px-3 rounded text-sm text-emerald-100 hover:bg-emerald-900/60"
          >
            {t.navAttractions}
          </button>
          <button
            onClick={() => handleNavClick('emergency')}
            className="block w-full text-left py-2 px-3 rounded text-sm text-emerald-100 hover:bg-emerald-900/60"
          >
            {t.navEmergency}
          </button>
          <button
            onClick={() => handleNavClick('feedback')}
            className="block w-full text-left py-2 px-3 rounded text-sm text-emerald-100 hover:bg-emerald-900/60"
          >
            {t.navFeedback}
          </button>
          <button
            onClick={() => {
              onOpenAdmin();
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 px-3 rounded text-sm font-semibold text-amber-300 hover:bg-emerald-900/60"
          >
            {t.navAdmin} {isAdminLoggedIn && '(Logged In)'}
          </button>
          <a
            href="https://eservices.railway.gov.lk/schedule/homeAction.action?lag=en"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full py-2.5 px-3 rounded text-xs font-semibold bg-amber-400 text-emerald-950 mt-2"
          >
            <span>Sri Lanka Railways Official Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}
    </header>
  );
};
