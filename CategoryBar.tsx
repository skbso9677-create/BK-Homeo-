import React from 'react';
import { 
  Sparkles, 
  FlaskConical, 
  Droplets, 
  Pill, 
  Activity, 
  Syringe, 
  ShieldAlert, 
  Smile, 
  Dog 
} from 'lucide-react';
import { ProductCategory, Language } from '../types';
import { t } from '../data/translations';

interface CategoryBarProps {
  selectedCategory: ProductCategory;
  onSelectCategory: (category: ProductCategory) => void;
  language: Language;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory,
  onSelectCategory,
  language,
}) => {
  const categories: { id: ProductCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: t(language, 'catAll'), icon: <Sparkles className="w-4 h-4" /> },
    { id: 'dilutions', label: t(language, 'catDilutions'), icon: <FlaskConical className="w-4 h-4" /> },
    { id: 'mother_tinctures', label: t(language, 'catMotherTinctures'), icon: <Droplets className="w-4 h-4" /> },
    { id: 'patents_drops', label: t(language, 'catPatentsDrops'), icon: <Activity className="w-4 h-4" /> },
    { id: 'biochemic', label: t(language, 'catBiochemic'), icon: <Pill className="w-4 h-4" /> },
    { id: 'syrups_tonics', label: t(language, 'catSyrupsTonics'), icon: <Syringe className="w-4 h-4" /> },
    { id: 'ointments', label: t(language, 'catOintments'), icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 'hair_skin', label: t(language, 'catHairSkin'), icon: <Smile className="w-4 h-4" /> },
    { id: 'veterinary', label: t(language, 'catVeterinary'), icon: <Dog className="w-4 h-4" /> },
  ];

  return (
    <div className="py-2 overflow-x-auto no-scrollbar -mx-3 px-3 sm:mx-0 sm:px-0">
      <div className="flex space-x-2">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all select-none shrink-0 ${
                isSelected
                  ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20 scale-[1.02]'
                  : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-emerald-50/50 hover:border-emerald-300'
              }`}
            >
              <span className={isSelected ? 'text-emerald-200' : 'text-emerald-600'}>
                {cat.icon}
              </span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
