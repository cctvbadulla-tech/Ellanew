import React from 'react';
import { Language } from '../types';
import { translations } from '../translations';
import { ShieldCheck, ExternalLink, Globe, FileText, Lock } from 'lucide-react';

interface AboutAndDisclaimerProps {
  currentLang: Language;
  officialRailwayUrl: string;
}

export const AboutAndDisclaimer: React.FC<AboutAndDisclaimerProps> = ({ currentLang, officialRailwayUrl }) => {
  const t = translations[currentLang];

  return (
    <section id="about" className="py-12 bg-[#faf8f5] border-b border-amber-950/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* About Information */}
          <div className="lg:col-span-7 space-y-4">
            <div className="text-xs uppercase tracking-wider font-semibold text-[#1b4332] flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-[#1b4332]" />
              <span>Independent Railway Portal</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              {t.aboutTitle}
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              {t.aboutParagraph1}
            </p>
            <p className="text-sm text-slate-700 leading-relaxed">
              {t.aboutParagraph2}
            </p>

            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-900 block mb-1">
                {t.aboutLinkToOfficial}
              </span>
              <a
                href={officialRailwayUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-900 bg-amber-200/80 hover:bg-amber-300 px-3 py-1.5 rounded transition-colors"
              >
                <span>Sri Lanka Railways e-Services Schedule System</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Legal, Disclaimer & Privacy Summary */}
          <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 text-xs text-slate-600">
            <div className="flex items-center gap-2 font-serif font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
              <ShieldCheck className="w-4 h-4 text-[#1b4332]" />
              <span>Service Disclaimer & Policies</span>
            </div>

            <div>
              <strong className="text-slate-800 block mb-0.5">Timetable Accuracy Disclaimer:</strong>
              <p className="leading-relaxed">
                Timetables and fares are manually audited from official working time cards. Sri Lanka Railways reserves the right to alter train services, adjust platforms, or implement speed restrictions without prior notice.
              </p>
            </div>

            <div>
              <strong className="text-slate-800 block mb-0.5">{t.privacyPolicy}:</strong>
              <p className="leading-relaxed">
                We respect your personal privacy. Feedback submissions, email addresses, and contact numbers are stored securely for passenger inquiries and are never sold or shared with commercial entities.
              </p>
            </div>

            <div>
              <strong className="text-slate-800 block mb-0.5">{t.termsOfUse}:</strong>
              <p className="leading-relaxed">
                This digital resource is provided free of charge for tourists and commuters. For government travel warrants and commercial cargo carriage, please consult the Station Master's booking office.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
