import React from 'react';
import { 
  Phone, 
  MessageCircle, 
  Languages, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Smartphone,
  SlidersHorizontal
} from 'lucide-react';
import { Language } from '../types';
import { translations, t } from '../data/translations';
import { STORE_DETAILS } from '../data/mockData';

interface HeaderProps {
  language: Language;
  onToggleLanguage: () => void;
  isAdmin: boolean;
  onToggleAdmin: () => void;
  onOpenStoreInfo: () => void;
  onOpenApkGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onToggleLanguage,
  isAdmin,
  onToggleAdmin,
  onOpenStoreInfo,
  onOpenApkGuide,
}) => {
  // Check if today is Tuesday
  const today = new Date().getDay();
  const isTuesday = today === 2; // 2 is Tuesday in JS Date

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      {/* Top micro-bar: Store alert & Quick Contacts */}
      <div className="bg-emerald-800 text-white text-xs px-3 py-1.5 flex items-center justify-between">
        <div className="flex items-center space-x-2 truncate">
          <span className="flex h-2 w-2 relative">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isTuesday ? 'bg-amber-400 opacity-75' : 'bg-emerald-400 opacity-75'}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isTuesday ? 'bg-amber-500' : 'bg-emerald-400'}`}></span>
          </span>
          <span className="truncate font-medium text-[11px] sm:text-xs">
            {isTuesday ? t(language, 'closedTuesday') : t(language, 'openStatus')} • {STORE_DETAILS.address}
          </span>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <a
            href={`tel:${STORE_DETAILS.phone}`}
            className="hidden sm:inline-flex items-center space-x-1 hover:text-emerald-200 transition-colors"
          >
            <Phone className="w-3 h-3" />
            <span>{STORE_DETAILS.phone}</span>
          </a>
          <button
            onClick={onToggleLanguage}
            className="inline-flex items-center space-x-1 bg-emerald-700/80 hover:bg-emerald-700 px-2 py-0.5 rounded text-[11px] font-semibold transition-colors"
            title="Switch Language"
          >
            <Languages className="w-3 h-3" />
            <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
          </button>
        </div>
      </div>

      {/* Main App Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2">
        {/* Logo & Store Identity */}
        <div 
          onClick={onOpenStoreInfo} 
          className="flex items-center space-x-2.5 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-sky-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
            <span className="font-extrabold text-base tracking-tighter">BK</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg leading-tight">
                {language === 'en' ? STORE_DETAILS.appName : 'बीके होमियो'}
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-emerald-200">
                HOMEO
              </span>
            </div>
            <div className="flex items-center text-[11px] text-slate-500 font-medium space-x-1">
              <span className="truncate max-w-[170px] sm:max-w-none text-emerald-700 font-semibold">
                {language === 'en' ? STORE_DETAILS.storeName : STORE_DETAILS.hindiStoreName}
              </span>
              <span>•</span>
              <span className="text-slate-600">{STORE_DETAILS.owner}</span>
            </div>
          </div>
        </div>

        {/* Action icons / shortcuts */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {/* WhatsApp Direct Consultation */}
          <a
            href={STORE_DETAILS.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-2.5 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-colors"
            title="Chat on WhatsApp"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-600/10" />
            <span className="hidden md:inline">{t(language, 'whatsappConsult')}</span>
            <span className="md:hidden">WhatsApp</span>
          </a>

          {/* Android APK & Dev Guide button */}
          <button
            onClick={onOpenApkGuide}
            className="flex items-center space-x-1 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 px-2 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-colors"
            title="Android APK & Architecture Guide"
          >
            <Smartphone className="w-4 h-4 text-sky-600" />
            <span className="hidden sm:inline">APK Guide</span>
          </button>

          {/* Admin Switcher */}
          <button
            onClick={onToggleAdmin}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs ${
              isAdmin 
                ? 'bg-amber-600 text-white shadow-amber-600/30 ring-2 ring-amber-400' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
            }`}
            title="Dr. Sonu Admin Panel"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isAdmin ? 'Admin Active' : 'Admin'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
