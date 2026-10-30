import React, { useState, useEffect } from 'react';
import { Sparkles, Truck, HeartHandshake, ShieldCheck, ChevronRight, ChevronLeft, ArrowRight } from 'lucide-react';
import { Language } from '../types';
import { t } from '../data/translations';
import { STORE_DETAILS } from '../data/mockData';

interface BannerCarouselProps {
  language: Language;
  onUploadPrescriptionClick: () => void;
  onExploreCategory: (category: string) => void;
}

export const BannerCarousel: React.FC<BannerCarouselProps> = ({
  language,
  onUploadPrescriptionClick,
  onExploreCategory,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 0,
      title: t(language, 'banner1Title'),
      subtitle: t(language, 'banner1Subtitle'),
      tag: 'Dr. Reckeweg & SBL',
      cta: language === 'en' ? 'Shop German Drops' : 'जर्मन दवाएं देखें',
      action: () => onExploreCategory('patents_drops'),
      bgGradient: 'from-emerald-700 via-teal-800 to-slate-900',
      badgeBg: 'bg-emerald-400 text-emerald-950',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-300" />,
    },
    {
      id: 1,
      title: t(language, 'banner2Title'),
      subtitle: t(language, 'banner2Subtitle'),
      tag: 'Local Saharanpur Service',
      cta: language === 'en' ? 'Explore Dilutions' : 'डाइल्यूशन देखें',
      action: () => onExploreCategory('dilutions'),
      bgGradient: 'from-sky-700 via-teal-800 to-emerald-900',
      badgeBg: 'bg-sky-300 text-sky-950',
      icon: <Truck className="w-5 h-5 text-sky-300" />,
    },
    {
      id: 2,
      title: t(language, 'banner3Title'),
      subtitle: t(language, 'banner3Subtitle'),
      tag: 'Doctor Review Service',
      cta: t(language, 'uploadPrescriptionBtn'),
      action: onUploadPrescriptionClick,
      bgGradient: 'from-emerald-800 via-emerald-900 to-teal-950',
      badgeBg: 'bg-amber-300 text-amber-950',
      icon: <HeartHandshake className="w-5 h-5 text-amber-300" />,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-md my-3 select-none">
      <div 
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className={`w-full shrink-0 bg-gradient-to-r ${slide.bgGradient} p-4 sm:p-6 text-white min-h-[165px] flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${slide.badgeBg}`}>
                  {slide.tag}
                </span>
                <span className="flex items-center text-xs text-emerald-200">
                  {slide.icon}
                </span>
              </div>
              <h3 className="font-extrabold text-base sm:text-xl leading-snug tracking-tight text-white line-clamp-2">
                {slide.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 mt-1 line-clamp-2 font-normal opacity-90">
                {slide.subtitle}
              </p>
            </div>

            <div className="pt-3 flex items-center justify-between">
              <button
                onClick={slide.action}
                className="inline-flex items-center space-x-1.5 bg-white text-slate-900 hover:bg-emerald-50 active:scale-95 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm"
              >
                <span>{slide.cta}</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-700" />
              </button>

              <div className="text-[11px] text-emerald-200 font-medium">
                {STORE_DETAILS.owner}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-2 right-4 flex space-x-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`h-1.5 rounded-full transition-all ${
              currentSlide === i ? 'w-5 bg-white' : 'w-1.5 bg-white/40'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
