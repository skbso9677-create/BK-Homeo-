import React from 'react';
import { 
  ClipboardList, 
  Package, 
  ChevronRight, 
  ExternalLink, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  Truck 
} from 'lucide-react';
import { Order, Language } from '../types';
import { t } from '../data/translations';

interface OrdersViewProps {
  orders: Order[];
  language: Language;
  onSelectOrder: (order: Order) => void;
  onStartShopping: () => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  language,
  onSelectOrder,
  onStartShopping,
}) => {
  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'placed':
        return <span className="bg-sky-100 text-sky-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Placed</span>;
      case 'verified':
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Verified by Dr. Sonu</span>;
      case 'packed':
        return <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Packed in Store</span>;
      case 'out_for_delivery':
        return <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1"><Truck className="w-3 h-3 mr-1" />Out for Delivery</span>;
      case 'delivered':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1"><CheckCircle2 className="w-3 h-3 mr-1" />Delivered</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
            {t(language, 'myOrders')}
          </h2>
          <p className="text-xs text-slate-500">
            Track current and past homeopathic medicine deliveries
          </p>
        </div>
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
          {orders.length} {t(language, 'itemsCount')}
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <ClipboardList className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {t(language, 'noOrders')}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Order authentic German and Indian homeopathic remedies directly from B K HOMEOPATHIC STORE.
          </p>
          <button
            onClick={onStartShopping}
            className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-xs"
          >
            {t(language, 'startShopping')}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              onClick={() => onSelectOrder(order)}
              className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-2.5">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {order.orderNumber}
                    </span>
                    {getStatusBadge(order.status)}
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <div className="text-right">
                  <div className="text-sm font-black text-slate-900">
                    ₹{order.total}
                  </div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">
                    {order.paymentMethod}
                  </span>
                </div>
              </div>

              {/* Items previews */}
              <div className="flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center space-x-2 truncate pr-2">
                  <div className="flex -space-x-2 overflow-hidden shrink-0">
                    {order.items.slice(0, 3).map((item, idx) => (
                      <img
                        key={idx}
                        src={item.image}
                        alt={item.name}
                        className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover bg-slate-100"
                      />
                    ))}
                  </div>
                  <span className="truncate text-xs font-medium text-slate-700">
                    {order.items.map((i) => i.name).join(', ')}
                  </span>
                </div>

                <button className="text-xs font-bold text-emerald-700 group-hover:translate-x-0.5 transition-transform flex items-center space-x-1 shrink-0">
                  <span>{t(language, 'trackOrder')}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
