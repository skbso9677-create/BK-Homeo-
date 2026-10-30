import React from 'react';
import { ShieldAlert, AlertTriangle, Info } from 'lucide-react';
import { Language } from '../types';
import { t } from '../data/translations';
import { STORE_DETAILS } from '../data/mockData';

interface HealthDisclaimerBannerProps {
  language: Language;
}

export const HealthDisclaimerBanner: React.FC<HealthDisclaimerBannerProps> = ({ language }) => {
  return (
    <aside aria-label="Medical Disclaimer" className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-4 my-4 text-xs text-amber-950 shadow-xs">
      <div className="flex items-start space-x-3">
        <div className="p-1.5 rounded-xl bg-amber-100 text-amber-700 shrink-0 mt-0.5">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <div className="font-bold text-amber-900 text-xs sm:text-sm flex items-center space-x-1.5">
            <span>{t(language, 'disclaimerTitle')}</span>
          </div>
          <p className="text-[11px] sm:text-xs text-amber-900/80 leading-relaxed font-normal">
            {t(language, 'disclaimerText')}
          </p>
          <div className="pt-1 text-[10px] text-amber-800 font-semibold flex items-center space-x-1">
            <span>For individualized prescriptions, consult {STORE_DETAILS.owner} at {STORE_DETAILS.phone}.</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
