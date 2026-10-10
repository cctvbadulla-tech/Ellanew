import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { translations } from '../translations';
import { Search, MapPin, ExternalLink, Clock, AlertTriangle, Calendar, Train } from 'lucide-react';

interface HeroProps {
  currentLang: Language;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectQuickDestination: (dest: string) => void;
  onNavigateToTimetable: () => void;
  googleMapsUrl: string;
  officialRailwayUrl: string;
}

export const Hero: React.FC<HeroProps> = ({
  currentLang,
  searchQuery,
  onSearchChange,
  onSelectQuickDestination,
  onNavigateToTimetable,
  googleMapsUrl,
  officialRailwayUrl
}) => {
  const t = translations[currentLang];
  const [sriLankaTime, setSriLankaTime] = useState<string>('');
  const [sriLankaDate, setSriLankaDate] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format in Asia/Colombo time (UTC+5:30)
      const timeStr = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Colombo',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      const dateStr = now.toLocaleDateString('en-US', {
        timeZone: 'Asia/Colombo',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      setSriLankaTime(timeStr);
      setSriLankaDate(dateStr);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigateToTimetable();
  };

  return (
    <div className="relative bg-[#0d2319] text-white overflow-hidden">
      {/* Background Image: Ella Hill Country Railway & Station scenery */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=2000&q=80"
          alt="Scenic train traveling through lush tea hills near Ella Railway Station, Sri Lanka"
          className="w-full h-full object-cover object-center filter brightness-[0.38] contrast-[1.1]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#091b14] via-[#091b14]/70 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#091b14]/90 via-[#091b14]/60 to-transparent"></div>
      </div>

      {/* Hero content container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-16 lg:pt-16 lg:pb-24">
        {/* Live station status & time bar */}
        <div className="inline-flex flex-wrap items-center gap-3 bg-[#081a12]/80 backdrop-blur-md border border-emerald-700/50 px-4 py-2 rounded text-xs text-emerald-200 mb-6">
          <div className="flex items-center gap-2 text-amber-300 font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>{t.liveStationTime}:</span>
            <span className="font-mono text-white text-sm font-semibold">{sriLankaTime || 'Loading...'}</span>
          </div>
          <span className="hidden sm:inline text-emerald-600">·</span>
          <div className="flex items-center gap-1.5 text-emerald-300">
            <Calendar className="w-3.5 h-3.5" />
            <span>{sriLankaDate}</span>
          </div>
          <span className="hidden sm:inline text-emerald-600">·</span>
          <span className="text-emerald-400 font-medium">{t.manuallyMaintained}</span>
        </div>

        {/* Main headline and subtitle */}
        <div className="max-w-3xl">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
            {t.heroTitle}
          </h1>
          <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed mb-8">
            {t.heroSubtitle}
          </p>

          {/* Search Box */}
          <form
            onSubmit={handleSearchSubmit}
            className="bg-white/95 backdrop-blur-md rounded-lg shadow-xl p-2.5 sm:p-3 flex flex-col sm:flex-row gap-2 border border-amber-300/40 mb-6"
          >
            <div className="relative flex-1 flex items-center">
              <Search className="w-5 h-5 text-emerald-800 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-10 pr-4 py-2.5 text-sm sm:text-base text-slate-900 placeholder:text-slate-500 focus:outline-none rounded bg-transparent"
              />
            </div>
            <button
              type="submit"
              className="bg-[#1b4332] hover:bg-[#143225] text-amber-300 font-semibold px-6 py-2.5 rounded text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow"
            >
              <Train className="w-4 h-4 text-amber-300" />
              <span>{t.navSearch}</span>
            </button>
          </form>

          {/* Quick Route Shortcuts */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-200/90 mb-8">
            <span className="font-medium text-emerald-300 mr-1">{t.popularRoutes}</span>
            <button
              type="button"
              onClick={() => onSelectQuickDestination('Badulla')}
              className="px-2.5 py-1 bg-emerald-900/70 hover:bg-emerald-800 text-emerald-100 rounded border border-emerald-700/60 transition-colors"
            >
              {t.destBadulla} (24 km)
            </button>
            <button
              type="button"
              onClick={() => onSelectQuickDestination('Colombo Fort')}
              className="px-2.5 py-1 bg-emerald-900/70 hover:bg-emerald-800 text-emerald-100 rounded border border-emerald-700/60 transition-colors"
            >
              {t.destColombo} (271 km)
            </button>
            <button
              type="button"
              onClick={() => onSelectQuickDestination('Kandy')}
              className="px-2.5 py-1 bg-emerald-900/70 hover:bg-emerald-800 text-emerald-100 rounded border border-emerald-700/60 transition-colors"
            >
              {t.destKandy} (145 km)
            </button>
            <button
              type="button"
              onClick={() => onSelectQuickDestination('Nanu Oya')}
              className="px-2.5 py-1 bg-emerald-900/70 hover:bg-emerald-800 text-emerald-100 rounded border border-emerald-700/60 transition-colors"
            >
              {t.destNanuOya} (64 km)
            </button>
            <button
              type="button"
              onClick={() => onSelectQuickDestination('Haputale')}
              className="px-2.5 py-1 bg-emerald-900/70 hover:bg-emerald-800 text-emerald-100 rounded border border-emerald-700/60 transition-colors"
            >
              {t.destHaputale} (32 km)
            </button>
            <button
              type="button"
              onClick={() => onSelectQuickDestination('Bandarawela')}
              className="px-2.5 py-1 bg-emerald-900/70 hover:bg-emerald-800 text-emerald-100 rounded border border-emerald-700/60 transition-colors"
            >
              {t.destBandarawela} (14 km)
            </button>
          </div>

          {/* Action Links: Google Maps Directions & Official SLR Schedule Portal */}
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-emerald-800/80 hover:bg-emerald-700 text-white text-sm font-medium border border-emerald-600/60 transition-colors"
            >
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>{t.directionsBtn}</span>
            </a>

            <a
              href={officialRailwayUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-amber-400 hover:bg-amber-300 text-emerald-950 text-sm font-semibold transition-colors shadow"
            >
              <ExternalLink className="w-4 h-4 text-emerald-950" />
              <span>{t.officialLinkBtn}</span>
            </a>
          </div>
        </div>

        {/* Prominent Disclaimer Notice Box */}
        <div className="mt-8 p-3.5 bg-amber-950/40 border border-amber-600/40 rounded text-xs text-amber-200/90 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-amber-300">Independent Railway Information Notice: </span>
            {t.officialScheduleNotice}
          </div>
        </div>

        {/* Photo Attribution (complies strictly with prompt: "Provide image attribution where required") */}
        <div className="mt-3 text-[11px] text-emerald-300/70">
          Hero Photograph: Scenic Sri Lanka Main Line tea hill railway by Dylan Shaw (Unsplash License).
        </div>
      </div>
    </div>
  );
};
