import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Tag, 
  ArrowRight, 
  Check, 
  Sparkles, 
  Truck,
  Store
} from 'lucide-react';
import { CartItem, Language, PromoCoupon } from '../types';
import { t } from '../data/translations';
import { STORE_DETAILS, INITIAL_COUPONS } from '../data/mockData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  appliedCoupon: PromoCoupon | null;
  onApplyCoupon: (coupon: PromoCoupon | null) => void;
  language: Language;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  appliedCoupon,
  onApplyCoupon,
  language,
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const mrpTotal = cart.reduce((sum, item) => sum + item.mrp * item.quantity, 0);
  const storeDiscount = mrpTotal - subtotal;

  const isFreeDelivery = subtotal >= STORE_DETAILS.freeDeliveryThreshold;
  const deliveryFee = isFreeDelivery || subtotal === 0 ? 0 : STORE_DETAILS.standardShippingFee;

  let couponDiscount = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.minOrderAmount) {
    couponDiscount = Math.min(
      Math.round((subtotal * appliedCoupon.discountPercent) / 100),
      appliedCoupon.maxDiscount
    );
  }

  const grandTotal = Math.max(0, subtotal - couponDiscount + deliveryFee);
  const amountNeededForFreeShipping = Math.max(0, STORE_DETAILS.freeDeliveryThreshold - subtotal);

  const handleApplyCode = (code: string) => {
    const found = INITIAL_COUPONS.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!found) {
      setCouponError('Invalid coupon code');
      return;
    }
    if (subtotal < found.minOrderAmount) {
      setCouponError(`Min order amount ₹${found.minOrderAmount} required`);
      return;
    }
    onApplyCoupon(found);
    setCouponError('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-emerald-700" />
            <h3 className="font-extrabold text-slate-900 text-base">
              {t(language, 'myCart')} ({cart.reduce((s, i) => s + i.quantity, 0)})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress in Saharanpur */}
        {subtotal > 0 && (
          <div className="bg-emerald-50 px-4 py-2.5 border-b border-emerald-100 text-xs">
            {isFreeDelivery ? (
              <div className="flex items-center space-x-1.5 text-emerald-800 font-bold">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>{t(language, 'freeShippingUnlocked')}</span>
              </div>
            ) : (
              <div>
                <div className="flex justify-between text-slate-700 font-medium mb-1">
                  <span>Add ₹{amountNeededForFreeShipping} more for FREE Saharanpur Delivery</span>
                  <span className="font-bold text-emerald-800">{Math.round((subtotal / STORE_DETAILS.freeDeliveryThreshold) * 100)}%</span>
                </div>
                <div className="w-full bg-emerald-200/60 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (subtotal / STORE_DETAILS.freeDeliveryThreshold) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 opacity-60" />
              </div>
              <h4 className="font-bold text-slate-800 text-base">
                {t(language, 'cartEmpty')}
              </h4>
              <p className="text-xs text-slate-500 max-w-xs">
                {t(language, 'cartEmptySubtitle')}
              </p>
              <button
                onClick={onClose}
                className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all"
              >
                {t(language, 'startShopping')}
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-3 p-3 rounded-2xl border border-slate-100 bg-white hover:border-emerald-200 transition-all shadow-2xs"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 bg-slate-50 border border-slate-100"
                />

                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                    {item.company}
                  </span>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                    {item.name}
                  </h4>
                  <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-0.5">
                    <span className="bg-slate-100 px-1.5 py-0.2 rounded font-semibold text-slate-700">
                      {item.potency}
                    </span>
                    <span>•</span>
                    <span>{item.packSize}</span>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-baseline space-x-1.5">
                      <span className="font-black text-slate-900 text-sm">
                        ₹{item.price * item.quantity}
                      </span>
                      {item.mrp > item.price && (
                        <span className="text-[10px] text-slate-400 line-through">
                          ₹{item.mrp * item.quantity}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-slate-200 text-slate-600 transition-colors"
                      >
                        {item.quantity === 1 ? <Trash2 className="w-3.5 h-3.5 text-rose-500" /> : <Minus className="w-3.5 h-3.5" />}
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-slate-200 text-slate-600 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Coupons & Bill Summary (Only if cart not empty) */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-slate-200/80 bg-slate-50/70 space-y-3">
            {/* Promo Code section */}
            <div className="space-y-1.5">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder={t(language, 'enterCoupon')}
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 uppercase bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold tracking-wider focus:outline-hidden focus:border-emerald-600 uppercase"
                />
                <button
                  onClick={() => handleApplyCode(couponInput)}
                  className="bg-slate-800 hover:bg-slate-900 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                >
                  Apply
                </button>
              </div>

              {/* Coupon Suggestions Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {INITIAL_COUPONS.map((cpn) => (
                  <button
                    key={cpn.code}
                    onClick={() => {
                      setCouponInput(cpn.code);
                      handleApplyCode(cpn.code);
                    }}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center space-x-1 ${
                      appliedCoupon?.code === cpn.code
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    <Tag className="w-2.5 h-2.5 text-emerald-600" />
                    <span>{cpn.code} ({cpn.discountPercent}%)</span>
                  </button>
                ))}
              </div>

              {couponError && (
                <p className="text-[10px] text-rose-600 font-medium">{couponError}</p>
              )}

              {appliedCoupon && (
                <div className="flex items-center justify-between bg-emerald-100/70 border border-emerald-200 px-2.5 py-1 rounded-lg text-xs text-emerald-900">
                  <div className="flex items-center space-x-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                    <span className="font-bold">{appliedCoupon.code} applied</span>
                  </div>
                  <button
                    onClick={() => onApplyCoupon(null)}
                    className="text-[10px] font-bold text-rose-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Bill Details */}
            <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200">
              <div className="flex justify-between">
                <span>{t(language, 'itemTotal')}</span>
                <span>₹{mrpTotal}</span>
              </div>
              {storeDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>{t(language, 'storeDiscount')}</span>
                  <span>-₹{storeDiscount}</span>
                </div>
              )}
              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>{t(language, 'couponDiscount')} ({appliedCoupon?.code})</span>
                  <span>-₹{couponDiscount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>{t(language, 'shipping')} (Saharanpur)</span>
                <span>{deliveryFee === 0 ? <span className="font-bold text-emerald-700">FREE</span> : `₹${deliveryFee}`}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-1.5 border-t border-slate-200">
                <span>{t(language, 'grandTotal')}</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white py-3 rounded-2xl text-xs font-black shadow-md shadow-emerald-600/20 flex items-center justify-center space-x-2 transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
