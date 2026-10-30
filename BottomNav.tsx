import React from 'react';
import { 
  Home, 
  Grid, 
  FileUp, 
  ShoppingBag, 
  ClipboardList, 
  Store 
} from 'lucide-react';
import { Language } from '../types';
import { t } from '../data/translations';

export type NavTab = 'home' | 'categories' | 'prescription' | 'orders' | 'cart' | 'store';

interface BottomNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  cartCount: number;
  ordersCount: number;
  language: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  cartCount,
  ordersCount,
  language,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg safe-bottom">
      <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-1.5">
        {/* Home */}
        <button
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
            activeTab === 'home'
              ? 'text-emerald-700 font-bold scale-105'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <div className={`p-1 rounded-full ${activeTab === 'home' ? 'bg-emerald-100 text-emerald-800' : ''}`}>
            <Home className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5">{t(language, 'navHome')}</span>
        </button>

        {/* Categories / Catalog */}
        <button
          onClick={() => onSelectTab('categories')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
            activeTab === 'categories'
              ? 'text-emerald-700 font-bold scale-105'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <div className={`p-1 rounded-full ${activeTab === 'categories' ? 'bg-emerald-100 text-emerald-800' : ''}`}>
            <Grid className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5">{t(language, 'navCategories')}</span>
        </button>

        {/* Upload Prescription */}
        <button
          onClick={() => onSelectTab('prescription')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative ${
            activeTab === 'prescription'
              ? 'text-teal-700 font-bold scale-105'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <div className={`p-1 rounded-full ${activeTab === 'prescription' ? 'bg-teal-100 text-teal-800' : ''}`}>
            <FileUp className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5">{t(language, 'navPrescription')}</span>
        </button>

        {/* Orders */}
        <button
          onClick={() => onSelectTab('orders')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative ${
            activeTab === 'orders'
              ? 'text-emerald-700 font-bold scale-105'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <div className={`p-1 rounded-full relative ${activeTab === 'orders' ? 'bg-emerald-100 text-emerald-800' : ''}`}>
            <ClipboardList className="w-5 h-5" />
            {ordersCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-sky-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                {ordersCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5">{t(language, 'navOrders')}</span>
        </button>

        {/* Cart */}
        <button
          onClick={() => onSelectTab('cart')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative ${
            activeTab === 'cart'
              ? 'text-emerald-700 font-bold scale-105'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <div className={`p-1 rounded-full relative ${activeTab === 'cart' ? 'bg-emerald-100 text-emerald-800' : ''}`}>
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white animate-bounce">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5">{t(language, 'navCart')}</span>
        </button>

        {/* Store Info */}
        <button
          onClick={() => onSelectTab('store')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
            activeTab === 'store'
              ? 'text-emerald-700 font-bold scale-105'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <div className={`p-1 rounded-full ${activeTab === 'store' ? 'bg-emerald-100 text-emerald-800' : ''}`}>
            <Store className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5">{t(language, 'navStore')}</span>
        </button>
      </div>
    </nav>
  );
};
