import React from 'react';
import { EmergencyContact, Language } from '../types';
import { translations } from '../translations';
import { PhoneCall, ShieldAlert, Clock, MapPin, CheckCircle2 } from 'lucide-react';

interface EmergencyContactsProps {
  contacts: EmergencyContact[];
  currentLang: Language;
}

export const EmergencyContacts: React.FC<EmergencyContactsProps> = ({ contacts, currentLang }) => {
  const t = translations[currentLang];

  return (
    <section id="emergency" className="py-12 bg-[#faf9f5] border-b border-amber-950/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="text-xs uppercase tracking-wider font-semibold text-rose-800 mb-1 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-rose-700" />
            <span>Essential Passenger Hotlines</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            {t.emergencyTitle}
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            {t.emergencySubtitle}
          </p>
        </div>

        {/* Contacts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contacts.map((contact) => {
            const name =
              currentLang === 'si' && contact.serviceNameSi ? contact.serviceNameSi :
              currentLang === 'ta' && contact.serviceNameTa ? contact.serviceNameTa :
              contact.serviceName;

            const isHighPriority =
              contact.phoneNumber === '1990' || contact.serviceName.includes('Station Master');

            return (
              <div
                key={contact.id}
                className={`p-5 rounded-xl border flex flex-col justify-between transition-all ${
                  isHighPriority
                    ? 'bg-white border-emerald-900/40 shadow-sm'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-serif font-bold text-slate-900 text-base leading-snug">
                      {name}
                    </h3>
                    {contact.badge && (
                      <span className="text-[11px] font-medium text-emerald-800 shrink-0">
                        {contact.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {contact.description}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-500 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{t.hours}: <strong className="text-slate-700">{contact.operatingHours}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{contact.location}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                  <a
                    href={`tel:${contact.phoneNumber.replace(/\s+/g, '')}`}
                    className="inline-flex items-center justify-center gap-2 py-2 px-4 rounded text-xs font-bold text-white bg-[#1b4332] hover:bg-[#143225] transition-colors shadow-xs"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>{contact.phoneNumber} ({t.callNow})</span>
                  </a>

                  {contact.alternateNumber && (
                    <div className="text-[11px] text-center text-slate-500">
                      Alt: <a href={`tel:${contact.alternateNumber.replace(/\s+/g, '')}`} className="underline font-medium text-slate-700">{contact.alternateNumber}</a>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>{t.verifiedOn}: {contact.lastVerified}</span>
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
