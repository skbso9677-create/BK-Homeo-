import React, { useState } from 'react';
import { Plus, Check, Star, ShieldCheck, Heart } from 'lucide-react';
import { Product, Language, CartItem } from '../types';
import { t } from '../data/translations';

interface ProductCardProps {
  product: Product;
  language: Language;
  onAddToCart: (item: CartItem) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  language,
  onAddToCart,
  onSelectProduct,
}) => {
  const [selectedPotencyIdx, setSelectedPotencyIdx] = useState(product.defaultPotencyIndex);
  const [justAdded, setJustAdded] = useState(false);

  const currentOption = product.potencies[selectedPotencyIdx] || product.potencies[0];
  const discountPercent = Math.round(((currentOption.mrp - currentOption.price) / currentOption.mrp) * 100);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentOption.inStock) return;

    const cartItem: CartItem = {
      id: `${product.id}-${currentOption.potency}`,
      productId: product.id,
      name: product.name,
      hindiName: product.hindiName,
      company: product.company,
      potency: currentOption.potency,
      packSize: currentOption.packSize,
      price: currentOption.price,
      mrp: currentOption.mrp,
      quantity: 1,
      image: product.image,
    };

    onAddToCart(cartItem);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <div
      onClick={() => onSelectProduct(product)}
      className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer group"
    >
      <div>
        {/* Image Container with Badges */}
        <div className="relative aspect-4/3 sm:aspect-square bg-slate-50 overflow-hidden flex items-center justify-center p-3">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Company Badge */}
          <div className="absolute top-2 left-2 bg-slate-900/85 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
            {product.company}
          </div>

          {/* Discount Pill */}
          {discountPercent > 0 && (
            <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-xs">
              {discountPercent}% OFF
            </div>
          )}

          {/* Stock Status Pill if not standard */}
          {!currentOption.inStock && (
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
              <span className="bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {t(language, 'outOfStock')}
              </span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="p-3">
          {/* Rating & Pack */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
              {currentOption.packSize}
            </span>
            <div className="flex items-center space-x-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-slate-700">{product.rating}</span>
              <span className="text-[10px]">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Medicine Title */}
          <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-1 group-hover:text-emerald-700 transition-colors">
            {product.name}
          </h4>
          {product.hindiName && (
            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
              {product.hindiName}
            </p>
          )}

          {/* Indications snippet */}
          <p className="text-[11px] text-slate-600 line-clamp-1 mt-1.5 font-normal">
            {product.indications.slice(0, 2).join(' • ')}
          </p>

          {/* Potency options selector chips */}
          {product.potencies.length > 1 && (
            <div className="mt-2.5 flex flex-wrap gap-1" onClick={(e) => e.stopPropagation()}>
              {product.potencies.map((opt, idx) => (
                <button
                  key={opt.potency}
                  onClick={() => setSelectedPotencyIdx(idx)}
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-md transition-colors ${
                    selectedPotencyIdx === idx
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-transparent'
                  }`}
                >
                  {opt.potency}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Price & Add to Cart Action */}
      <div className="p-3 pt-0 border-t border-slate-100/80 mt-2">
        <div className="flex items-center justify-between pt-2">
          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-base sm:text-lg font-black text-slate-900">
                ₹{currentOption.price}
              </span>
              {currentOption.mrp > currentOption.price && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{currentOption.mrp}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-700 font-medium block">
              {currentOption.inStock ? t(language, 'inStock') : t(language, 'outOfStock')}
            </span>
          </div>

          <button
            onClick={handleAdd}
            disabled={!currentOption.inStock}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 ${
              justAdded
                ? 'bg-emerald-800 text-white scale-105'
                : currentOption.inStock
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'Added' : 'जुड़ा'}</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>{t(language, 'addToCart')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
