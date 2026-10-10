import React from 'react';
import { Language } from '../types';
import { translations } from '../translations';
import { Building2, Luggage, Ticket, Coffee, Clock, Compass, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';

interface StationGuideProps {
  currentLang: Language;
  googleMapsUrl: string;
}

export const StationGuide: React.FC<StationGuideProps> = ({ currentLang, googleMapsUrl }) => {
  const t = translations[currentLang];

  return (
    <section id="station-guide" className="py-12 bg-[#faf9f5] border-b border-amber-950/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="text-xs uppercase tracking-wider font-semibold text-[#1b4332] mb-1 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-[#1b4332]" />
            <span>Passenger Facilities & Amenities</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            {t.stationInfoTitle}
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            {t.stationInfoSubtitle}
          </p>
        </div>

        {/* Key Station Metrics Bar (Unboxed text with separators per Zero-Pill rule) */}
        <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm mb-8 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-slate-700">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-800" />
            <span className="font-semibold text-slate-900">{t.stationCode}</span>
          </div>
          <span className="hidden sm:inline text-slate-300">·</span>
          <div>
            <span className="font-medium text-slate-900">{t.stationElevation}</span>
          </div>
          <span className="hidden sm:inline text-slate-300">·</span>
          <div>
            <span className="font-medium text-slate-900">{t.stationMilepost}</span>
          </div>
          <span className="hidden sm:inline text-slate-300">·</span>
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-emerald-800 hover:text-emerald-950 font-semibold"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Open in Google Maps</span>
          </a>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Cloakroom */}
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs hover:border-emerald-800/40 transition-colors">
            <div className="w-10 h-10 rounded bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4">
              <Luggage className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-slate-900 text-base mb-2">
              {t.facilityCloakroom}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              {t.facilityCloakroomDesc}
            </p>
            <div className="text-[11px] text-emerald-900 font-medium">
              Daily 06:00 - 19:30 · Fee ~LKR 150/bag
            </div>
          </div>

          {/* Ticket Counters */}
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs hover:border-emerald-800/40 transition-colors">
            <div className="w-10 h-10 rounded bg-amber-50 text-amber-800 flex items-center justify-center mb-4">
              <Ticket className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-slate-900 text-base mb-2">
              {t.facilityTickets}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              {t.facilityTicketsDesc}
            </p>
            <div className="text-[11px] text-amber-900 font-medium">
              Cash payments accepted · Counter 1 & 2
            </div>
          </div>

          {/* Waiting Area */}
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs hover:border-emerald-800/40 transition-colors">
            <div className="w-10 h-10 rounded bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-slate-900 text-base mb-2">
              {t.facilityWaiting}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              {t.facilityWaitingDesc}
            </p>
            <div className="text-[11px] text-emerald-900 font-medium">
              Platform 1 shaded benches & washrooms
            </div>
          </div>

          {/* Refreshments */}
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs hover:border-emerald-800/40 transition-colors">
            <div className="w-10 h-10 rounded bg-amber-50 text-amber-800 flex items-center justify-center mb-4">
              <Coffee className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-slate-900 text-base mb-2">
              {t.facilityRefreshment}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              {t.facilityRefreshmentDesc}
            </p>
            <div className="text-[11px] text-amber-900 font-medium">
              Ceylon tea, bottled water, snacks
            </div>
          </div>
        </div>

        {/* Practical Passenger Advice & Station History Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Tips for Travelers at Ella Station</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold">•</span>
                  <span><strong>Arrive 45–60 mins early:</strong> Platforms become crowded, especially for morning and midday trains to Kandy/Colombo.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold">•</span>
                  <span><strong>Unreserved tickets:</strong> Sri Lanka Railways does not cap unreserved tickets; buying a ticket guarantees station platform entry, but seating is first-come, first-served.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold">•</span>
                  <span><strong>Scenic views:</strong> When traveling towards Kandy from Ella, the right-hand side often offers dramatic valley drops, while the left showcases waterfalls and tea hills.</span>
                </li>
              </ul>
            </div>

            <div className="border-t md:border-t-0 md:border-l border-slate-100 md:pl-6">
              <div className="text-emerald-900 font-bold text-sm mb-2">
                Heritage & Architecture
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ella Station opened in the early 20th century as part of the Ceylon Government Railway's Main Line extension to transport high-grown Uva tea to Colombo harbour. Today, its pristine station master garden won the National Railway Gardening trophy multiple times.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <a
                  href="https://maps.google.com/?q=Ella+Railway+Station+Sri+Lanka"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-900 hover:text-emerald-950 underline"
                >
                  <span>View Ella Station on Google Satellite Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
