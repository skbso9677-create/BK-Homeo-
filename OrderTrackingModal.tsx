import React from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  Package, 
  Truck, 
  MapPin, 
  MessageCircle, 
  Phone, 
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';
import { Order, Language } from '../types';
import { t } from '../data/translations';
import { STORE_DETAILS } from '../data/mockData';

interface OrderTrackingModalProps {
  order: Order | null;
  onClose: () => void;
  language: Language;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  order,
  onClose,
  language,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!order) return null;

  const steps = [
    { key: 'placed', label: t(language, 'statusPlaced'), icon: <CheckCircle2 className="w-4 h-4" /> },
    { key: 'verified', label: t(language, 'statusVerified'), icon: <Clock className="w-4 h-4" /> },
    { key: 'packed', label: t(language, 'statusPacked'), icon: <Package className="w-4 h-4" /> },
    { key: 'out_for_delivery', label: t(language, 'statusOutForDelivery'), icon: <Truck className="w-4 h-4" /> },
    { key: 'delivered', label: t(language, 'statusDelivered'), icon: <CheckCircle2 className="w-4 h-4" /> },
  ];

  const statusOrderIndex = ['placed', 'verified', 'packed', 'out_for_delivery', 'delivered'].indexOf(order.status);

  const copyOrderId = () => {
    navigator.clipboard?.writeText(order.orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappOrderHelpUrl = `https://wa.me/91${STORE_DETAILS.phone}?text=${encodeURIComponent(
    `Hello Dr. Sonu Kumar, I am inquiring about my homeopathic order #${order.orderNumber} placed on BK Homeo.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-emerald-800 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-base sm:text-lg">
                {t(language, 'trackOrder')}
              </span>
              <button
                onClick={copyOrderId}
                className="bg-emerald-700 hover:bg-emerald-600 px-2 py-0.5 rounded-md text-[11px] font-mono font-bold flex items-center space-x-1 transition-colors"
                title="Copy Order ID"
              >
                <span>{order.orderNumber}</span>
                {copied ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
            <p className="text-xs text-emerald-200 mt-0.5">
              B K HOMEOPATHIC STORE, Saharanpur
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-emerald-700 text-emerald-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Tracker Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Tracking Stepper */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
              Live Order Status
            </h4>
            <div className="relative pl-6 space-y-5">
              {/* Vertical connector line */}
              <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-slate-200 -z-0" />

              {steps.map((st, idx) => {
                const isPassed = idx <= statusOrderIndex;
                const isCurrent = idx === statusOrderIndex;

                return (
                  <div key={st.key} className="relative z-10 flex items-start space-x-3">
                    <div
                      className={`-ml-6 w-5 h-5 rounded-full flex items-center justify-center text-xs transition-colors ring-4 ring-white ${
                        isCurrent
                          ? 'bg-emerald-600 text-white animate-pulse ring-emerald-100'
                          : isPassed
                          ? 'bg-emerald-700 text-white'
                          : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      {isPassed ? <Check className="w-3 h-3" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />}
                    </div>

                    <div className="flex-1 -mt-0.5">
                      <p className={`text-xs font-bold ${isCurrent ? 'text-emerald-900' : isPassed ? 'text-slate-800' : 'text-slate-400'}`}>
                        {st.label}
                      </p>
                      {isCurrent && (
                        <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                          {order.statusUpdates[order.statusUpdates.length - 1]?.description || 'In progress at store'}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Items Summary */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Prescribed Medicines ({order.items.length})
            </h4>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2.5 bg-white border border-slate-100 rounded-xl text-xs">
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg bg-slate-50 border border-slate-100 shrink-0" />
                    <div className="truncate">
                      <div className="font-bold text-slate-900 truncate">{item.name}</div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        {item.company} • {item.potency} (Qty: {item.quantity})
                      </div>
                    </div>
                  </div>
                  <div className="font-black text-slate-900 shrink-0 ml-2">
                    ₹{item.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment & Delivery Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="font-bold text-slate-700 block mb-1">Fulfillment</span>
              <p className="text-slate-600">
                {order.deliveryType === 'home_delivery' ? (
                  <>
                    <span className="font-semibold text-slate-800">Home Delivery:</span><br />
                    {order.address?.streetAddress}, {order.address?.city} - {order.address?.pincode}
                  </>
                ) : (
                  <>
                    <span className="font-semibold text-slate-800">Store Pickup:</span><br />
                    Kisanpura Nala Patri, Saharanpur
                  </>
                )}
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="font-bold text-slate-700 block mb-1">Payment Method</span>
              <p className="text-slate-600">
                <span className="font-semibold text-slate-800 uppercase">{order.paymentMethod}</span>
                {order.upiRefNumber && <span className="block text-[10px] font-mono text-emerald-800">{order.upiRefNumber}</span>}
                <span className="block mt-1 font-black text-slate-900 text-sm">Total: ₹{order.total}</span>
              </p>
            </div>
          </div>

          {/* Support Actions */}
          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-2">
            <a
              href={whatsappOrderHelpUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:flex-1 bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors shadow-xs"
            >
              <MessageCircle className="w-4 h-4 text-emerald-300" />
              <span>WhatsApp Dr. Sonu About Order</span>
            </a>
            <a
              href={`tel:${STORE_DETAILS.phone}`}
              className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Store ({STORE_DETAILS.phone})</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
