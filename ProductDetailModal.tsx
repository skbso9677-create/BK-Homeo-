import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  MessageCircle, 
  Check, 
  Plus, 
  Minus, 
  Star, 
  Info, 
  HelpCircle,
  Truck
} from 'lucide-react';
import { Product, Language, CartItem } from '../types';
import { t } from '../data/translations';
import { STORE_DETAILS } from '../data/mockData';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  language: Language;
  onAddToCart: (item: CartItem) => void;
  onDirectCheckout: (item: CartItem) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  language,
  onAddToCart,
  onDirectCheckout,
}) => {
  if (!product) return null;

  const [selectedPotencyIdx, setSelectedPotencyIdx] = useState(product.defaultPotencyIndex);
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const currentOption = product.potencies[selectedPotencyIdx] || product.potencies[0];
  const discountPercent = Math.round(((currentOption.mrp - currentOption.price) / currentOption.mrp) * 100);

  const getCartItem = (): CartItem => ({
    id: `${product.id}-${currentOption.potency}`,
    productId: product.id,
    name: product.name,
    hindiName: product.hindiName,
    company: product.company,
    potency: currentOption.potency,
    packSize: currentOption.packSize,
    price: currentOption.price,
    mrp: currentOption.mrp,
    quantity: quantity,
    image: product.image,
  });

  const handleAddToCart = () => {
    onAddToCart(getCartItem());
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 1600);
  };

  const handleBuyNow = () => {
    onDirectCheckout(getCartItem());
  };

  const whatsappInquiryUrl = `https://wa.me/91${STORE_DETAILS.phone}?text=${encodeURIComponent(
    `Hello Dr. Sonu Kumar, I am looking at "${product.name} (${currentOption.potency})" on BK Homeo app. Can you guide me on its dosage and suitability for my condition?`
  )}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <span className="bg-emerald-700 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
              {product.company}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              B K HOMEOPATHIC STORE
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Top visual section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
            <div className="relative aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {discountPercent > 0 && (
                <div className="absolute top-3 right-3 bg-emerald-600 text-white text-xs font-black px-2 py-1 rounded-lg shadow-sm">
                  {discountPercent}% OFF
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {product.name}
                </h2>
                {product.hindiName && (
                  <p className="text-sm font-medium text-emerald-800 mt-0.5">
                    {product.hindiName}
                  </p>
                )}
              </div>

              {/* Rating & Reviews */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold text-slate-800">{product.rating}</span>
                </div>
                <span className="text-xs text-slate-500">
                  {product.reviewsCount} customer reviews
                </span>
                <span className="text-xs text-emerald-600 font-semibold">• 100% Genuine</span>
              </div>

              {/* Pricing Display */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900">
                    ₹{currentOption.price}
                  </span>
                  {currentOption.mrp > currentOption.price && (
                    <span className="text-sm text-slate-400 line-through">
                      MRP ₹{currentOption.mrp}
                    </span>
                  )}
                  <span className="text-xs text-emerald-700 font-bold ml-auto">
                    Save ₹{currentOption.mrp - currentOption.price}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1 flex items-center space-x-1">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Free delivery in Saharanpur on orders above ₹{STORE_DETAILS.freeDeliveryThreshold}</span>
                </div>
              </div>

              {/* Potency & Pack size choices */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  {t(language, 'selectPotency')} / {t(language, 'selectPackSize')}:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {product.potencies.map((opt, idx) => (
                    <button
                      key={opt.potency}
                      onClick={() => setSelectedPotencyIdx(idx)}
                      className={`text-left p-2 rounded-xl border text-xs transition-all ${
                        selectedPotencyIdx === idx
                          ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold shadow-xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="font-bold">{opt.potency}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 flex justify-between">
                        <span>{opt.packSize}</span>
                        <span className="font-bold text-emerald-700">₹{opt.price}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center space-x-3 pt-1">
                <span className="text-xs font-bold text-slate-700">Quantity:</span>
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-1.5 hover:bg-slate-200 text-slate-600 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-1.5 hover:bg-slate-200 text-slate-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Description & Indications */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                {language === 'en' ? 'Description' : 'दवा का विवरण'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'en' ? product.description : (product.hindiDescription || product.description)}
              </p>
            </div>

            {/* Indications */}
            <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-3.5">
              <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>{t(language, 'indications')}</span>
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-700">
                {product.indications.map((ind, i) => (
                  <li key={i} className="flex items-start space-x-1.5">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{ind}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Dosage & Directions */}
            <div className="bg-sky-50/60 border border-sky-100 rounded-2xl p-3.5">
              <h4 className="text-xs font-bold text-sky-950 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
                <Info className="w-4 h-4 text-sky-700" />
                <span>{t(language, 'directionsForUse')}</span>
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                {language === 'en' ? product.dosage : (product.hindiDosage || product.dosage)}
              </p>
            </div>

            {/* Composition */}
            {product.composition && (
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                  {t(language, 'composition')}
                </h4>
                <p className="text-xs text-slate-600 italic font-mono bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {product.composition}
                </p>
              </div>
            )}

            {/* WhatsApp Consultation with Dr. Sonu */}
            <div className="bg-emerald-700 text-white rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="space-y-0.5 text-center sm:text-left">
                <div className="text-xs font-bold flex items-center justify-center sm:justify-start space-x-1">
                  <MessageCircle className="w-4 h-4 text-emerald-300" />
                  <span>{t(language, 'askOnWhatsApp')}</span>
                </div>
                <p className="text-[11px] text-emerald-100">
                  Consult Dr. Sonu Kumar directly regarding exact potency and dosage.
                </p>
              </div>
              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-emerald-900 hover:bg-emerald-50 px-3.5 py-1.5 rounded-xl text-xs font-extrabold shadow-sm transition-all whitespace-nowrap active:scale-95"
              >
                Chat on WhatsApp
              </a>
            </div>

            {/* Mandatory Safe Health Disclaimer */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-start space-x-2.5 text-amber-900">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <strong className="font-bold block mb-0.5">
                  {t(language, 'disclaimerTitle')}
                </strong>
                {t(language, 'disclaimerText')}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer / Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
              {quantity} {t(language, 'itemsCount')}
            </span>
            <span className="text-lg font-black text-slate-900">
              ₹{currentOption.price * quantity}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleAddToCart}
              className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 ${
                addedSuccess
                  ? 'bg-emerald-800 text-white'
                  : 'bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300'
              }`}
            >
              {addedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>{t(language, 'addedToCart')}</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>{t(language, 'addToCart')}</span>
                </>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white px-5 py-2.5 rounded-xl text-xs font-extrabold shadow-md shadow-emerald-600/20 transition-all"
            >
              {t(language, 'buyNow')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
