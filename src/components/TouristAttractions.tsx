import React from 'react';
import { TouristAttraction, Language } from '../types';
import { translations } from '../translations';
import { Mountain, MapPin, Footprints, Car, ExternalLink, Lightbulb } from 'lucide-react';

interface TouristAttractionsProps {
  attractions: TouristAttraction[];
  currentLang: Language;
}

export const TouristAttractions: React.FC<TouristAttractionsProps> = ({ attractions, currentLang }) => {
  const t = translations[currentLang];

  return (
    <section id="attractions" className="py-12 bg-white border-b border-amber-950/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="text-xs uppercase tracking-wider font-semibold text-[#1b4332] mb-1 flex items-center gap-1.5">
            <Mountain className="w-4 h-4 text-[#1b4332]" />
            <span>Discover Ella Hill Country</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            {t.attractionsTitle}
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            {t.attractionsSubtitle}
          </p>
        </div>

        {/* Attractions Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {attractions.map((attr) => {
            const name =
              currentLang === 'si' && attr.nameSi ? attr.nameSi :
              currentLang === 'ta' && attr.nameTa ? attr.nameTa :
              attr.name;

            const description =
              currentLang === 'si' && attr.descriptionSi ? attr.descriptionSi :
              currentLang === 'ta' && attr.descriptionTa ? attr.descriptionTa :
              attr.description;

            return (
              <div
                key={attr.id}
                className="bg-[#faf9f6] rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow"
              >
                {/* Photo with aspect ratio */}
                <div className="relative aspect-video bg-slate-200 overflow-hidden">
                  <img
                    src={attr.imageUrl}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1000&q=80';
                    }}
                  />
                  {/* Distance kicker (quiet top badge) */}
                  <div className="absolute bottom-2.5 left-2.5 bg-[#091b14]/85 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded font-medium flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{attr.distanceKm} km from Ella Station</span>
                  </div>
                </div>

                {/* Content body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-slate-900 mb-2">
                      {name}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {description}
                    </p>

                    {/* Time metrics (Zero-pill text format) */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-4 pb-3 border-b border-slate-200/80">
                      {attr.walkingTimeMinutes && (
                        <div className="flex items-center gap-1">
                          <Footprints className="w-3.5 h-3.5 text-emerald-800" />
                          <span>~{attr.walkingTimeMinutes} min walk</span>
                        </div>
                      )}
                      {attr.walkingTimeMinutes && attr.drivingTimeMinutes && (
                        <span>·</span>
                      )}
                      {attr.drivingTimeMinutes && (
                        <div className="flex items-center gap-1">
                          <Car className="w-3.5 h-3.5 text-emerald-800" />
                          <span>~{attr.drivingTimeMinutes} min tuk-tuk</span>
                        </div>
                      )}
                    </div>

                    {/* Tip box */}
                    {attr.tip && (
                      <div className="p-2.5 bg-amber-50 rounded border border-amber-200/60 text-xs text-amber-900 mb-4 flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold">{t.attractionTip}: </span>
                          <span>{attr.tip}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions & Attribution */}
                  <div className="space-y-2 pt-2">
                    <a
                      href={attr.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full py-2 px-3 text-xs font-semibold text-[#1b4332] bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200 transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{t.viewOnMap}</span>
                      <ExternalLink className="w-3 h-3 ml-auto opacity-70" />
                    </a>

                    <div className="text-[10px] text-slate-400 truncate">
                      {attr.imageAttribution}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
