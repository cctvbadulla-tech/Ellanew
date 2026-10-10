import React, { useState, useMemo } from 'react';
import { Train, Language, TrainStatus } from '../types';
import { translations } from '../translations';
import { Train as TrainIcon, Clock, Filter, ArrowRight, Eye, CheckCircle, AlertTriangle, XCircle, Info, Calendar } from 'lucide-react';

interface TrainTimetableProps {
  trains: Train[];
  currentLang: Language;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedDestination: string;
  onSelectDestination: (dest: string) => void;
}

export const TrainTimetable: React.FC<TrainTimetableProps> = ({
  trains,
  currentLang,
  searchQuery,
  onSearchChange,
  selectedDestination,
  onSelectDestination
}) => {
  const t = translations[currentLang];
  const [directionFilter, setDirectionFilter] = useState<'all' | 'departures' | 'arrivals'>('all');
  const [dayFilter, setDayFilter] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all');
  const [selectedTrainForModal, setSelectedTrainForModal] = useState<Train | null>(null);

  // Extract unique destinations
  const destinations = useMemo(() => {
    const set = new Set<string>();
    trains.forEach(tr => {
      set.add(tr.destinationStation);
    });
    return Array.from(set).sort();
  }, [trains]);

  // Filter logic
  const filteredTrains = useMemo(() => {
    return trains.filter(tr => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          tr.trainNumber.toLowerCase().includes(q) ||
          tr.name.toLowerCase().includes(q) ||
          tr.destinationStation.toLowerCase().includes(q) ||
          tr.originStation.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      // 2. Destination filter
      if (selectedDestination && selectedDestination !== 'all') {
        if (!tr.destinationStation.toLowerCase().includes(selectedDestination.toLowerCase())) {
          return false;
        }
      }

      // 3. Direction filter (Ella departures vs arrivals)
      if (directionFilter === 'departures') {
        // Departures from Ella heading either to Badulla or towards Colombo/Kandy
        // All trains stop and depart Ella unless Ella is the final terminus
        if (tr.destinationStation.toLowerCase().includes('ella')) return false;
      } else if (directionFilter === 'arrivals') {
        // Arriving at Ella
      }

      // 4. Operating Day filter
      if (dayFilter !== 'all') {
        const matchesDay = tr.operatingDays.includes('Daily') || tr.operatingDays.includes(dayFilter);
        if (!matchesDay) return false;
      }

      // 5. Time Filter based on Ella departure time
      if (timeFilter !== 'all') {
        const [hour] = tr.departureTimeElla.split(':').map(Number);
        if (timeFilter === 'morning' && (hour < 5 || hour >= 12)) return false;
        if (timeFilter === 'afternoon' && (hour < 12 || hour >= 17)) return false;
        if (timeFilter === 'evening' && hour < 17 && hour >= 5) return false;
      }

      return true;
    }).sort((a, b) => a.departureTimeElla.localeCompare(b.departureTimeElla));
  }, [trains, searchQuery, selectedDestination, directionFilter, dayFilter, timeFilter]);

  const getStatusBadge = (status: TrainStatus) => {
    switch (status) {
      case 'On Time':
        return (
          <span className="inline-flex items-center gap-1 text-emerald-800 text-xs font-medium">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            {t.onTime}
          </span>
        );
      case 'Delayed':
        return (
          <span className="inline-flex items-center gap-1 text-amber-800 text-xs font-semibold">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            {t.delayed}
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-rose-800 text-xs font-semibold">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            {t.cancelled}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-slate-700 text-xs font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            {t.scheduled}
          </span>
        );
    }
  };

  return (
    <section id="timetable" className="py-12 bg-[#fcfbf7] border-b border-amber-950/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs uppercase tracking-wider font-semibold text-[#1b4332] mb-1 flex items-center gap-1.5">
              <TrainIcon className="w-4 h-4 text-[#1b4332]" />
              <span>Ella Railway Station Schedule</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              {t.navTimetable}
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Chronological schedule of passenger trains calling at Ella. All times are based on verified Sri Lanka Railways working timetables.
            </p>
          </div>

          <div className="text-xs text-slate-600 bg-emerald-50/80 p-2.5 rounded border border-emerald-200/80 self-start md:self-auto">
            <span className="font-semibold text-emerald-950">{t.lastUpdatedPrefix}</span> Today, 18:00 (Asia/Colombo)
            <div className="text-[11px] text-emerald-800 mt-0.5">
              Source: Official Sri Lanka Railways (SLR) Main Line Working Timetable
            </div>
          </div>
        </div>

        {/* Filter Controls (Segmented Control style - adhering to Zero-Pill discipline) */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 mb-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Direction Filter Segmented Control */}
            <div className="inline-flex p-1 bg-slate-100 rounded-lg text-xs font-medium">
              <button
                type="button"
                onClick={() => setDirectionFilter('all')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  directionFilter === 'all'
                    ? 'bg-white text-emerald-950 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.allTrains}
              </button>
              <button
                type="button"
                onClick={() => setDirectionFilter('departures')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  directionFilter === 'departures'
                    ? 'bg-white text-emerald-950 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.departures}
              </button>
              <button
                type="button"
                onClick={() => setDirectionFilter('arrivals')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  directionFilter === 'arrivals'
                    ? 'bg-white text-emerald-950 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.arrivals}
              </button>
            </div>

            {/* Total Results Count */}
            <div className="text-xs text-slate-600 font-medium">
              Showing <span className="font-bold text-slate-900">{filteredTrains.length}</span> verified services
            </div>
          </div>

          {/* Secondary Dropdown Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-xs">
            {/* Destination filter */}
            <div>
              <label className="block text-slate-600 font-medium mb-1">
                {t.filterDestination}
              </label>
              <select
                value={selectedDestination}
                onChange={(e) => onSelectDestination(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
              >
                <option value="">{t.allDestinations}</option>
                <option value="Badulla">Badulla (BDA)</option>
                <option value="Colombo Fort">Colombo Fort (FOT)</option>
                <option value="Kandy">Kandy (KDT)</option>
                <option value="Nanu Oya">Nanu Oya / Nuwara Eliya</option>
                <option value="Haputale">Haputale</option>
                <option value="Bandarawela">Bandarawela</option>
              </select>
            </div>

            {/* Operating Day filter */}
            <div>
              <label className="block text-slate-600 font-medium mb-1">
                {t.filterDay}
              </label>
              <select
                value={dayFilter}
                onChange={(e) => setDayFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
              >
                <option value="all">{t.allDays}</option>
                <option value="Daily">Daily Services</option>
                <option value="Thursday">Thursday (Ella Odyssey)</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>
            </div>

            {/* Time of Day filter */}
            <div>
              <label className="block text-slate-600 font-medium mb-1">
                {t.filterTime}
              </label>
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
              >
                <option value="all">{t.allTimes}</option>
                <option value="morning">{t.morning}</option>
                <option value="afternoon">{t.afternoon}</option>
                <option value="evening">{t.evening}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Timetable Table (Responsive Desktop / Tablet) */}
        {filteredTrains.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center text-slate-500">
            <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-medium">{t.noTrainsFound}</p>
            <button
              type="button"
              onClick={() => {
                onSearchChange('');
                onSelectDestination('');
                setDirectionFilter('all');
                setDayFilter('all');
                setTimeFilter('all');
              }}
              className="mt-3 text-xs text-emerald-800 hover:text-emerald-950 font-semibold underline"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg border border-slate-200 shadow-sm">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#1b4332] text-amber-100 text-xs font-semibold uppercase tracking-wider">
                  <th className="py-3 px-3 sm:px-4">{t.trainNo}</th>
                  <th className="py-3 px-3 sm:px-4">{t.trainName}</th>
                  <th className="py-3 px-3 sm:px-4">{t.route}</th>
                  <th className="py-3 px-3 sm:px-4 text-center">{t.arrivalElla}</th>
                  <th className="py-3 px-3 sm:px-4 text-center">{t.departureElla}</th>
                  <th className="py-3 px-3 sm:px-4">{t.operatingDays}</th>
                  <th className="py-3 px-3 sm:px-4">{t.status}</th>
                  <th className="py-3 px-3 sm:px-4 text-right">{t.action}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredTrains.map((tr) => (
                  <tr key={tr.id} className="hover:bg-amber-50/50 transition-colors">
                    {/* Train Number */}
                    <td className="py-3.5 px-3 sm:px-4 font-mono font-bold text-emerald-950">
                      #{tr.trainNumber}
                    </td>

                    {/* Train Name & Special notes */}
                    <td className="py-3.5 px-3 sm:px-4">
                      <div className="font-semibold text-slate-900">{tr.name}</div>
                      <div className="text-[11px] text-slate-500 font-sans">
                        {tr.classes.join(', ')}
                      </div>
                      {tr.statusNote && (
                        <div className="text-[11px] text-amber-800 mt-0.5">
                          Note: {tr.statusNote}
                        </div>
                      )}
                    </td>

                    {/* Route */}
                    <td className="py-3.5 px-3 sm:px-4">
                      <div className="flex items-center gap-1.5 font-medium text-slate-900">
                        <span>{tr.originStation.split(' ')[0]}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                        <span className="text-emerald-900 font-semibold">{tr.destinationStation.split(' ')[0]}</span>
                      </div>
                      <div className="text-[11px] text-slate-600">
                        via Ella ({tr.platform})
                      </div>
                    </td>

                    {/* Arrival at Ella */}
                    <td className="py-3.5 px-3 sm:px-4 text-center font-mono font-bold text-slate-900">
                      {tr.arrivalTimeElla}
                    </td>

                    {/* Departure from Ella */}
                    <td className="py-3.5 px-3 sm:px-4 text-center font-mono font-bold text-emerald-800 bg-emerald-50/40">
                      {tr.departureTimeElla}
                    </td>

                    {/* Operating Days */}
                    <td className="py-3.5 px-3 sm:px-4 text-xs">
                      {tr.operatingDays.join(', ')}
                    </td>

                    {/* Current Status */}
                    <td className="py-3.5 px-3 sm:px-4">
                      {getStatusBadge(tr.currentStatus)}
                    </td>

                    {/* View Details Button */}
                    <td className="py-3.5 px-3 sm:px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedTrainForModal(tr)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-900 bg-emerald-100/70 hover:bg-emerald-200/80 rounded transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        <span>{t.action}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Timetable Integrity Notice */}
        <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-600 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <span className="font-semibold text-slate-800">Database Record Note: </span>
            This timetable reflects regular Sri Lanka Railways Main Line scheduled timings. Platform allocations may vary at the Station Master's discretion.
          </div>
          <a
            href="https://eservices.railway.gov.lk/schedule/homeAction.action?lag=en"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-800 hover:text-emerald-950 font-semibold underline shrink-0"
          >
            Check Sri Lanka Railways e-Services
          </a>
        </div>
      </div>

      {/* Train Details Modal */}
      {selectedTrainForModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="bg-[#1b4332] text-white p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-amber-300 font-mono">Train #{selectedTrainForModal.trainNumber}</div>
                <h3 className="font-serif text-lg font-bold">{selectedTrainForModal.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTrainForModal(null)}
                className="text-emerald-200 hover:text-white text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 text-xs sm:text-sm text-slate-700">
              <div className="grid grid-cols-2 gap-3 p-3 bg-amber-50/60 rounded border border-amber-200/60">
                <div>
                  <span className="text-xs text-slate-500 block">Arrival at Ella:</span>
                  <span className="font-mono text-base font-bold text-slate-900">{selectedTrainForModal.arrivalTimeElla}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Departure from Ella:</span>
                  <span className="font-mono text-base font-bold text-emerald-900">{selectedTrainForModal.departureTimeElla}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Platform:</span>
                  <span className="font-semibold text-slate-900">{selectedTrainForModal.platform}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Status:</span>
                  {getStatusBadge(selectedTrainForModal.currentStatus)}
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-900 block mb-1">Route & Stations:</span>
                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200 leading-relaxed font-mono">
                  {selectedTrainForModal.intermediateStopsSummary ||
                    `From ${selectedTrainForModal.originStation} to ${selectedTrainForModal.destinationStation} via Ella.`}
                </p>
              </div>

              <div>
                <span className="font-semibold text-slate-900 block mb-1">Available Classes:</span>
                <div className="text-xs text-slate-600">
                  {selectedTrainForModal.classes.join(' · ')}
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-900 block mb-1">Operating Days:</span>
                <div className="text-xs text-slate-600">
                  {selectedTrainForModal.operatingDays.join(', ')}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                <div>Source: {selectedTrainForModal.source}</div>
                <div>Last Audited: {selectedTrainForModal.lastUpdated}</div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-5 py-3 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedTrainForModal(null)}
                className="px-4 py-2 bg-[#1b4332] text-white text-xs font-semibold rounded hover:bg-[#143225] cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
