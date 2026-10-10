import React from 'react';
import { ServiceAlert, Language } from '../types';
import { AlertCircle, Clock, Info, XCircle } from 'lucide-react';

interface AlertBannerProps {
  alerts: ServiceAlert[];
  currentLang: Language;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ alerts, currentLang }) => {
  const activeAlerts = alerts.filter(a => a.active);

  if (activeAlerts.length === 0) return null;

  return (
    <div className="bg-[#122e22] border-b border-emerald-900 py-3 px-4">
      <div className="max-w-7xl mx-auto space-y-2">
        {activeAlerts.map(alert => {
          const title =
            currentLang === 'si' && alert.titleSi ? alert.titleSi :
            currentLang === 'ta' && alert.titleTa ? alert.titleTa :
            alert.title;

          const message =
            currentLang === 'si' && alert.messageSi ? alert.messageSi :
            currentLang === 'ta' && alert.messageTa ? alert.messageTa :
            alert.message;

          const isCancellation = alert.type === 'cancellation';
          const isDelay = alert.type === 'delay';

          const iconColor = isCancellation
            ? 'text-rose-400'
            : isDelay
            ? 'text-amber-400'
            : 'text-emerald-300';

          return (
            <div
              key={alert.id}
              className={`p-3 rounded border text-xs sm:text-sm flex flex-col md:flex-row md:items-center justify-between gap-2 ${
                isCancellation
                  ? 'bg-rose-950/30 border-rose-800/50 text-rose-100'
                  : isDelay
                  ? 'bg-amber-950/30 border-amber-800/50 text-amber-100'
                  : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-100'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <span className={`shrink-0 mt-0.5 ${iconColor}`}>
                  {isCancellation ? (
                    <XCircle className="w-4 h-4" />
                  ) : isDelay ? (
                    <AlertCircle className="w-4 h-4" />
                  ) : (
                    <Info className="w-4 h-4" />
                  )}
                </span>
                <div>
                  <div className="font-semibold text-white flex items-center gap-2">
                    <span>{title}</span>
                    {alert.affectedTrain && (
                      <span className="text-xs font-mono font-normal opacity-90">
                        [{alert.affectedTrain}]
                      </span>
                    )}
                  </div>
                  <div className="text-xs opacity-90 mt-0.5 leading-relaxed">
                    {message}
                  </div>
                </div>
              </div>

              {/* Source & verified timestamp */}
              <div className="shrink-0 flex items-center gap-2 text-[11px] opacity-75 self-end md:self-auto pl-6 md:pl-0">
                <Clock className="w-3 h-3" />
                <span>Verified: {alert.lastVerified}</span>
                <span>·</span>
                <span>{alert.source}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
