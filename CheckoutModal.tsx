import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  CheckCircle, 
  CreditCard, 
  QrCode, 
  Banknote, 
  ShieldCheck, 
  Truck, 
  Store, 
  AlertCircle,
  Phone,
  User
} from 'lucide-react';
import { CartItem, Address, Order, Language, PromoCoupon } from '../types';
import { t } from '../data/translations';
import { STORE_DETAILS, INITIAL_SAVED_ADDRESS } from '../data/mockData';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  appliedCoupon: PromoCoupon | null;
  onOrderPlaced: (newOrder: Order) => void;
  language: Language;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  appliedCoupon,
  onOrderPlaced,
  language,
}) => {
  if (!isOpen || cart.length === 0) return null;

  const [deliveryType, setDeliveryType] = useState<'home_delivery' | 'store_pickup'>('home_delivery');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi'>('upi');
  const [upiSelectedApp, setUpiSelectedApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'qr'>('qr');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Address state
  const [address, setAddress] = useState<Address>(INITIAL_SAVED_ADDRESS);

  // Price calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const isFreeDelivery = subtotal >= STORE_DETAILS.freeDeliveryThreshold || deliveryType === 'store_pickup';
  const deliveryFee = isFreeDelivery ? 0 : STORE_DETAILS.standardShippingFee;

  let couponDiscount = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.minOrderAmount) {
    couponDiscount = Math.min(
      Math.round((subtotal * appliedCoupon.discountPercent) / 100),
      appliedCoupon.maxDiscount
    );
  }

  const grandTotal = Math.max(0, subtotal - couponDiscount + deliveryFee);

  const handleSubmitOrder = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      const orderNumber = `BK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const now = new Date().toISOString();
      const nowFormatted = new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });

      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber,
        createdAt: now,
        items: [...cart],
        subtotal,
        discount: couponDiscount,
        shippingFee: deliveryFee,
        total: grandTotal,
        deliveryType,
        address: deliveryType === 'home_delivery' ? address : undefined,
        paymentMethod,
        paymentStatus: paymentMethod === 'upi' ? 'completed' : 'pending',
        upiRefNumber: paymentMethod === 'upi' ? `UPI-BK-${Math.floor(100000 + Math.random() * 900000)}` : undefined,
        status: 'placed',
        statusUpdates: [
          {
            status: 'placed',
            title: 'Order Placed',
            description: 'Order received at B K HOMEOPATHIC STORE system.',
            timestamp: nowFormatted,
          },
          {
            status: 'verified',
            title: 'Prescription & Medicine Verification',
            description: 'Under review by Dr. Sonu Kumar at Saharanpur store.',
            timestamp: 'Scheduled soon',
          }
        ],
      };

      setIsSubmitting(false);
      onOrderPlaced(newOrder);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-emerald-800 text-white">
          <div>
            <h3 className="font-extrabold text-base sm:text-lg">
              {language === 'en' ? 'Checkout & Confirmation' : 'चेकआउट एवं पुष्टि'}
            </h3>
            <p className="text-xs text-emerald-200">
              {STORE_DETAILS.storeName} • {STORE_DETAILS.owner}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-emerald-700 text-emerald-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Demo Sandbox Alert */}
          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-3 flex items-start space-x-2 text-sky-900 text-xs">
            <AlertCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Prototype Demonstration Mode</span>
              {t(language, 'demoNotice')} Orders will be saved to your session and Dr. Sonu's Admin Panel.
            </div>
          </div>

          {/* Delivery Option Toggle */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              {t(language, 'deliveryOption')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDeliveryType('home_delivery')}
                className={`p-3 rounded-2xl border text-left flex items-start space-x-2.5 transition-all ${
                  deliveryType === 'home_delivery'
                    ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Truck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-bold">{language === 'en' ? 'Home Delivery' : 'घर पर डिलीवरी'}</div>
                  <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                    Saharanpur & surrounding areas
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryType('store_pickup')}
                className={`p-3 rounded-2xl border text-left flex items-start space-x-2.5 transition-all ${
                  deliveryType === 'store_pickup'
                    ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Store className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-bold">{language === 'en' ? 'Store Pickup' : 'दुकान से प्राप्त करें'}</div>
                  <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                    Kisanpura Nala Patri (Free)
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Delivery Address Details */}
          {deliveryType === 'home_delivery' ? (
            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                  <MapPin className="w-4 h-4 text-emerald-700" />
                  <span>{t(language, 'deliveryAddress')}</span>
                </span>
                <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-100 px-2 py-0.5 rounded-full">
                  Saharanpur PIN 247001
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    {t(language, 'fullName')} *
                  </label>
                  <input
                    type="text"
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-emerald-600 font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    {t(language, 'phoneNumber')} *
                  </label>
                  <input
                    type="tel"
                    value={address.phoneNumber}
                    onChange={(e) => setAddress({ ...address, phoneNumber: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-emerald-600 font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  {t(language, 'streetAddress')} *
                </label>
                <input
                  type="text"
                  value={address.streetAddress}
                  onChange={(e) => setAddress({ ...address, streetAddress: e.target.value })}
                  placeholder="e.g. House No. 24, Near Kisanpura Bridge"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-emerald-600 font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    {t(language, 'city')}
                  </label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    {t(language, 'state')}
                  </label>
                  <input
                    type="text"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    {t(language, 'pincode')}
                  </label>
                  <input
                    type="text"
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-950 space-y-1">
              <div className="font-bold flex items-center space-x-1.5 text-emerald-900">
                <Store className="w-4 h-4 text-emerald-700" />
                <span>Pickup Location: B K HOMEOPATHIC STORE</span>
              </div>
              <p className="text-slate-700">
                {STORE_DETAILS.address}
              </p>
              <p className="text-slate-600 font-medium">
                Store Hours: {STORE_DETAILS.hours} • Contact: {STORE_DETAILS.phone}
              </p>
            </div>
          )}

          {/* Payment Method Selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              {t(language, 'paymentMethod')}
            </label>
            <div className="space-y-2">
              {/* UPI Option */}
              <div
                onClick={() => setPaymentMethod('upi')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-emerald-600 bg-emerald-50/70 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs">
                      UPI
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900">
                        Instant UPI Payment (GPay, PhonePe, Paytm, QR)
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        Store VPA: <span className="font-mono text-emerald-800 font-bold">{STORE_DETAILS.upiId}</span>
                      </div>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    className="accent-emerald-600"
                  />
                </div>

                {/* Sub UPI Choices if selected */}
                {paymentMethod === 'upi' && (
                  <div className="mt-3 pt-3 border-t border-emerald-200/60 flex flex-col items-center p-2 bg-white rounded-xl border border-emerald-100">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-[11px] font-bold text-slate-700">Demo Store QR Code:</span>
                    </div>
                    {/* Visual QR representation */}
                    <div className="w-32 h-32 bg-slate-900 rounded-xl p-2 flex flex-col items-center justify-center text-white text-center shadow-inner relative group">
                      <QrCode className="w-20 h-20 text-emerald-400" />
                      <span className="text-[9px] font-mono tracking-widest text-emerald-300">
                        ₹{grandTotal}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 font-medium">
                      Simulated instant payment to Dr. Sonu Kumar
                    </span>
                  </div>
                )}
              </div>

              {/* COD Option */}
              <div
                onClick={() => setPaymentMethod('cod')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-emerald-600 bg-emerald-50/70 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
                      <Banknote className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900">
                        {t(language, 'cashOnDelivery')}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        Pay cash when you receive the sealed package
                      </div>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="accent-emerald-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary breakdown */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1.5">
            <div className="flex justify-between text-slate-600">
              <span>{cart.length} medicine item(s)</span>
              <span>₹{subtotal}</span>
            </div>
            {couponDiscount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Coupon discount</span>
                <span>-₹{couponDiscount}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Delivery Charges</span>
              <span>{deliveryFee === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${deliveryFee}`}</span>
            </div>
            <div className="flex justify-between text-sm font-black text-slate-900 pt-1.5 border-t border-slate-200">
              <span>Total Payable</span>
              <span className="text-emerald-800">₹{grandTotal}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmitOrder}
            disabled={isSubmitting}
            className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white px-6 py-2.5 rounded-xl text-xs font-black shadow-md shadow-emerald-600/25 transition-all flex items-center space-x-1.5"
          >
            {isSubmitting ? (
              <span>Placing Order...</span>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>{t(language, 'placeOrder')} (₹{grandTotal})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
