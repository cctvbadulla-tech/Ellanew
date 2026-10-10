import React, { useState } from 'react';
import { FareRecord, Language } from '../types';
import { translations } from '../translations';
import { Ticket, Info, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';

interface FareCalculatorProps {
  fares: FareRecord[];
  currentLang: Language;
}

export const FareCalculator: React.FC<FareCalculatorProps> = ({ fares, currentLang }) => {
  const t = translations[currentLang];

  const [fromStation, setFromStation] = useState<string>('Ella');
  const [toStation, setToStation] = useState<string>('Colombo Fort');
  const [selectedClass, setSelectedClass] = useState<'3rd' | '2nd' | '1st' | 'obs'>('2nd');

  // Find matching fare record
  const matchingRecord = fares.find(f => {
    const fromMatch = f.fromStation.toLowerCase().includes(fromStation.toLowerCase());
    const toMatch = f.toStation.toLowerCase().includes(toStation.toLowerCase());
    return fromMatch && toMatch;
  });

  const getFareForClass = (rec?: FareRecord, cls?: string) => {
    if (!rec) return null;
    if (cls === '3rd') return rec.thirdClassFare;
    if (cls === '2nd') return rec.secondClassFare;
    if (cls === '1st') return rec.firstClassFare ?? null;
    if (cls === 'obs') return rec.observationFare ?? null;
    return null;
  };

  const calculatedFare = getFareForClass(matchingRecord, selectedClass);

  return (
    <section id="fares" className="py-12 bg-white border-b border-amber-950/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-8">
          <div className="text-xs uppercase tracking-wider font-semibold text-[#1b4332] mb-1 flex items-center gap-1.5">
            <Ticket className="w-4 h-4 text-[#1b4332]" />
            <span>Sri Lanka Railways Tariff Schedule</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            {t.faresTitle}
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            {t.faresSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Fare Calculator Card */}
          <div className="lg:col-span-5 bg-[#faf8f5] rounded-xl border border-amber-900/20 p-5 sm:p-6 shadow-sm">
            <h3 className="font-serif text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-amber-900/10">
              Station Fare Inquiry
            </h3>

            <div className="space-y-4 text-xs sm:text-sm">
              {/* Origin Station */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {t.selectOrigin}
                </label>
                <select
                  value={fromStation}
                  onChange={(e) => setFromStation(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                >
                  <option value="Ella">Ella Railway Station (ELA)</option>
                </select>
              </div>

              {/* Destination Station */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {t.selectDestination}
                </label>
                <select
                  value={toStation}
                  onChange={(e) => setToStation(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                >
                  <option value="Bandarawela">Bandarawela (14 km)</option>
                  <option value="Badulla">Badulla (24 km)</option>
                  <option value="Haputale">Haputale (32 km)</option>
                  <option value="Nanu Oya">Nanu Oya / Nuwara Eliya (64 km)</option>
                  <option value="Hatton">Hatton (108 km)</option>
                  <option value="Kandy">Kandy (145 km)</option>
                  <option value="Colombo Fort">Colombo Fort (271 km)</option>
                </select>
              </div>

              {/* Travel Class Selector */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {t.selectClass}
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedClass('3rd')}
                    className={`p-2 rounded border text-left transition-colors ${
                      selectedClass === '3rd'
                        ? 'bg-[#1b4332] text-amber-300 border-[#1b4332] font-semibold'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    3rd Class
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedClass('2nd')}
                    className={`p-2 rounded border text-left transition-colors ${
                      selectedClass === '2nd'
                        ? 'bg-[#1b4332] text-amber-300 border-[#1b4332] font-semibold'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    2nd Class
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedClass('1st')}
                    className={`p-2 rounded border text-left transition-colors ${
                      selectedClass === '1st'
                        ? 'bg-[#1b4332] text-amber-300 border-[#1b4332] font-semibold'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    1st Class (AC / Res)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedClass('obs')}
                    className={`p-2 rounded border text-left transition-colors ${
                      selectedClass === 'obs'
                        ? 'bg-[#1b4332] text-amber-300 border-[#1b4332] font-semibold'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    Observation Saloon
                  </button>
                </div>
              </div>

              {/* Result Display Box */}
              {matchingRecord && calculatedFare !== null ? (
                <div className="mt-4 p-4 bg-emerald-900 text-white rounded-lg shadow-inner">
                  <div className="flex justify-between items-center text-xs text-emerald-200 mb-1">
                    <span>Official Verified Fare:</span>
                    <span>Distance: {matchingRecord.distanceKm} km</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
                    LKR {calculatedFare.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-emerald-200 mt-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Verified with {matchingRecord.source} (Audited: {matchingRecord.lastVerified})</span>
                  </div>
                </div>
              ) : (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">No direct tariff record in database.</span>
                      <p className="mt-1">
                        To obtain verified fares for intermediate unlisted stations, please check directly at the Ella Station Master ticket counter or consult the official Sri Lanka Railways passenger tariff table.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Ticket Counter Rules Notice */}
            <div className="mt-5 pt-4 border-t border-amber-900/10 text-xs text-slate-600 space-y-2">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-[#1b4332] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  {t.fareNotice}
                </p>
              </div>
            </div>
          </div>

          {/* Full Station Pairs Fare Table */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-[#1b4332] text-amber-100 flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-base">Key Station Fares from Ella (ELA)</h3>
                <p className="text-xs text-emerald-200">Standard distance-based tariffs</p>
              </div>
              <a
                href="https://eservices.railway.gov.lk/schedule/homeAction.action?lag=en"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-amber-300 hover:text-white flex items-center gap-1 font-medium"
              >
                <span>SLR e-Services</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                    <th className="py-2.5 px-3">Destination</th>
                    <th className="py-2.5 px-3 text-center">Distance</th>
                    <th className="py-2.5 px-3 text-right">3rd Class</th>
                    <th className="py-2.5 px-3 text-right">2nd Class</th>
                    <th className="py-2.5 px-3 text-right">1st Class</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {fares.map(fr => (
                    <tr key={fr.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3 font-semibold text-slate-900">
                        {fr.toStation}
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-slate-600">
                        {fr.distanceKm} km
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-medium text-slate-800">
                        LKR {fr.thirdClassFare}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-emerald-900">
                        LKR {fr.secondClassFare}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-medium text-slate-800">
                        {fr.firstClassFare ? `LKR ${fr.firstClassFare}` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-50 text-[11px] text-slate-500 border-t border-slate-200">
              {t.fareDisclaimer} Children under 3 travel free; children between 3-12 pay half fare on unreserved coaches.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
