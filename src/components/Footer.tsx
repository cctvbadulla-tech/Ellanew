import React from 'react';
import { Language } from '../types';
import { translations } from '../translations';
import { Train, ExternalLink, Shield, Phone, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  currentLang: Language;
  onOpenAdmin: () => void;
  onNavigate: (sectionId: string) => void;
  officialRailwayUrl: string;
}

export const Footer: React.FC<FooterProps> = ({
  currentLang,
  onOpenAdmin,
  onNavigate,
  officialRailwayUrl
}) => {
  const t = translations[currentLang];

  return (
    <footer className="bg-[#091b14] text-emerald-100/80 text-xs border-t border-emerald-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand & Mission */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-serif font-bold text-base">
              <div className="w-7 h-7 rounded bg-emerald-800 flex items-center justify-center text-amber-300">
                <Train className="w-4 h-4" />
              </div>
              <span>{t.siteTitle}</span>
            </div>
            <p className="leading-relaxed text-emerald-300/70">
              Independent digital timetable, arrival & departure board, fare tariffs, and tourist guide for Ella Railway Station, Sri Lanka.
            </p>
            <div className="text-[11px] text-amber-300/80">
              Domain: ellatraintimes.com
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-serif font-bold text-white text-sm mb-3">
              Station Services
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('timetable')}
                  className="hover:text-amber-300 transition-colors"
                >
                  {t.navTimetable}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('fares')}
                  className="hover:text-amber-300 transition-colors"
                >
                  {t.navFares}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('station-guide')}
                  className="hover:text-amber-300 transition-colors"
                >
                  {t.navStationInfo}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('attractions')}
                  className="hover:text-amber-300 transition-colors"
                >
                  {t.navAttractions}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('emergency')}
                  className="hover:text-amber-300 transition-colors"
                >
                  {t.navEmergency}
                </button>
              </li>
            </ul>
          </div>

          {/* Verified Contacts */}
          <div>
            <h4 className="font-serif font-bold text-white text-sm mb-3">
              Station Location
            </h4>
            <div className="space-y-2 text-emerald-300/80 leading-relaxed">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>Ella Railway Station, Station Road, Ella, Uva Province, Sri Lanka</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <a href="tel:+94572228561" className="hover:text-white underline">+94 57 222 8561 (Station Desk)</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>ellastation.inquiries@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Official SLR Links & Admin Login */}
          <div>
            <h4 className="font-serif font-bold text-white text-sm mb-3">
              Official Links
            </h4>
            <div className="space-y-3">
              <a
                href={officialRailwayUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-amber-300 hover:text-white underline text-xs"
              >
                <span>Sri Lanka Railways Official e-Services</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-900/60 hover:bg-emerald-800 text-emerald-100 text-xs border border-emerald-700/60 transition-colors"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>Station Master Admin Portal</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Notice */}
        <div className="pt-8 border-t border-emerald-950/80 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-emerald-400/60">
          <div>
            © {new Date().getFullYear()} Ella Train Timetable (ellatraintimes.com). {t.allRightsReserved}
          </div>
          <div className="text-center md:text-right">
            Independent timetable resource. Not affiliated with the Ministry of Transport or Sri Lanka Railways.
          </div>
        </div>
      </div>
    </footer>
  );
};
