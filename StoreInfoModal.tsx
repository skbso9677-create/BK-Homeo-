import React from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Clock, 
  ShieldCheck, 
  ExternalLink, 
  CheckCircle2,
  Calendar,
  Sparkles,
  Award
} from 'lucide-react';
import { Language } from '../types';
import { t } from '../data/translations';
import { STORE_DETAILS } from '../data/mockData';

interface StoreInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const StoreInfoModal: React.FC<StoreInfoModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  if (!isOpen) return null;

  const today = new Date().getDay();
  const isTuesday = today === 2;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with store brand */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-white text-emerald-900 flex items-center justify-center font-black text-xl shadow-md">
              BK
            </div>
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-300">
                Authorized Homeopathic Dispensary
              </span>
              <h3 className="text-xl font-extrabold leading-tight">
                {STORE_DETAILS.storeName}
              </h3>
            </div>
          </div>
          <p className="text-xs text-emerald-100 font-medium">
            Directed by <strong className="text-white">{STORE_DETAILS.owner}</strong> • Saharanpur, UP
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-5 text-xs">
          {/* Tuesday Notice or Live Open Status */}
          <div className={`p-3.5 rounded-2xl border flex items-center space-x-3 ${
            isTuesday 
              ? 'bg-amber-50 border-amber-200 text-amber-900' 
              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}>
            <Clock className={`w-5 h-5 shrink-0 ${isTuesday ? 'text-amber-600' : 'text-emerald-700'}`} />
            <div>
              <div className="font-bold text-xs">
                {isTuesday ? 'Closed Today (Tuesday Routine)' : 'Store Open Today'}
              </div>
              <div className="text-[11px] opacity-80 mt-0.5">
                {STORE_DETAILS.hours}
              </div>
            </div>
          </div>

          {/* Address & Navigation */}
          <div className="space-y-2">
            <span className="font-bold text-slate-800 uppercase tracking-wider block text-[11px]">
              {t(language, 'storeAddressLabel')}
            </span>
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <div className="flex items-start space-x-2.5 text-slate-700">
                <MapPin className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900 text-xs">
                    {STORE_DETAILS.address}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    District: Saharanpur, Uttar Pradesh - PIN {STORE_DETAILS.pincode}
                  </p>
                </div>
              </div>

              <a
                href={STORE_DETAILS.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 py-2 rounded-xl font-bold flex items-center justify-center space-x-1.5 transition-colors shadow-2xs"
              >
                <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
                <span>{t(language, 'openInGoogleMaps')}</span>
              </a>
            </div>
          </div>

          {/* Doctor & Practitioner Profile */}
          <div className="space-y-2">
            <span className="font-bold text-slate-800 uppercase tracking-wider block text-[11px]">
              Homeopathic Practitioner Profile
            </span>
            <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100 flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0">
                Dr.
              </div>
              <div>
                <h4 className="font-bold text-sm text-emerald-950">
                  {STORE_DETAILS.owner}
                </h4>
                <p className="text-[11px] text-emerald-800">
                  Senior Homeopathic Consultant & Pharmacist
                </p>
                <p className="text-[10px] text-slate-600 mt-0.5">
                  Specialized in chronic allergies, digestive ailments, skin problems, and acute respiratory relief.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Actions */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href={`tel:${STORE_DETAILS.phone}`}
              className="bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-2xl font-bold flex items-center justify-center space-x-2 transition-all shadow-xs"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Call ({STORE_DETAILS.phone})</span>
            </a>

            <a
              href={STORE_DETAILS.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl font-bold flex items-center justify-center space-x-2 transition-all shadow-xs"
            >
              <MessageCircle className="w-4 h-4 text-white" />
              <span>WhatsApp Chat</span>
            </a>
          </div>

          {/* Authentic Pharmacy Trust Badges */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <span className="font-bold text-slate-800 uppercase tracking-wider block text-[11px]">
              Store Authenticity Guarantee
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-slate-700 font-medium">100% Sealed Factory Bottles</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-slate-700 font-medium">Dr. Reckeweg German Stock</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-slate-700 font-medium">Fast Saharanpur Delivery</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-slate-700 font-medium">Professional Guidance</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
