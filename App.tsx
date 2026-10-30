/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Phone, 
  MessageCircle, 
  ShieldCheck, 
  Clock, 
  ExternalLink, 
  FileUp, 
  ShoppingBag, 
  Check, 
  Star, 
  Sparkles,
  Smartphone,
  Info
} from 'lucide-react';
import { 
  Product, 
  CartItem, 
  Order, 
  Language, 
  ProductCategory, 
  PromoCoupon, 
  PrescriptionSubmission 
} from './types';
import { 
  STORE_DETAILS, 
  INITIAL_PRODUCTS, 
  INITIAL_ORDERS, 
  INITIAL_COUPONS 
} from './data/mockData';
import { translations, t } from './data/translations';

// Components
import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { BannerCarousel } from './components/BannerCarousel';
import { CategoryBar } from './components/CategoryBar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { OrdersView } from './components/OrdersView';
import { PrescriptionUploadModal } from './components/PrescriptionUploadModal';
import { StoreInfoModal } from './components/StoreInfoModal';
import { AdminPanel } from './components/AdminPanel';
import { ApkGuideModal } from './components/ApkGuideModal';
import { HealthDisclaimerBanner } from './components/HealthDisclaimerBanner';

export default function App() {
  // App-level state
  const [language, setLanguage] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [isAdmin, setIsAdmin] = useState(false);

  // Data states
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('bk_homeo_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('bk_homeo_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('bk_homeo_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [coupons, setCoupons] = useState<PromoCoupon[]>(INITIAL_COUPONS);
  const [appliedCoupon, setAppliedCoupon] = useState<PromoCoupon | null>(null);

  const [prescriptions, setPrescriptions] = useState<PrescriptionSubmission[]>(() => {
    const saved = localStorage.getItem('bk_homeo_prescriptions');
    return saved ? JSON.parse(saved) : [];
  });

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');

  // Modal visibility states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [isStoreInfoModalOpen, setIsStoreInfoModalOpen] = useState(false);
  const [isApkGuideModalOpen, setIsApkGuideModalOpen] = useState(false);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('bk_homeo_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('bk_homeo_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('bk_homeo_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('bk_homeo_prescriptions', JSON.stringify(prescriptions));
  }, [prescriptions]);

  // Cart operations
  const handleAddToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, item];
    });
  };

  const handleUpdateQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const handleDirectCheckout = (item: CartItem) => {
    handleAddToCart(item);
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  // Order created callback
  const handleOrderPlaced = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    handleClearCart();
    setIsCheckoutOpen(false);
    setTrackingOrder(newOrder);
  };

  // Prescription uploaded callback
  const handlePrescriptionSuccess = (submission: PrescriptionSubmission) => {
    setPrescriptions((prev) => [submission, ...prev]);
  };

  // Admin handlers
  const handleAddProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
  };

  const handleUpdateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const nowFormatted = new Date().toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short',
          });
          return {
            ...ord,
            status,
            statusUpdates: [
              ...ord.statusUpdates,
              {
                status,
                title: `Status updated to ${status.replace(/_/g, ' ').toUpperCase()}`,
                description: `Updated by Dr. Sonu Kumar on ${nowFormatted}`,
                timestamp: nowFormatted,
              },
            ],
          };
        }
        return ord;
      })
    );
  };

  const handleAddCoupon = (newCoupon: PromoCoupon) => {
    setCoupons((prev) => [newCoupon, ...prev]);
  };

  // Brand options
  const brands = [
    { id: 'all', label: 'All Brands' },
    { id: 'Dr. Reckeweg (Germany)', label: 'Dr. Reckeweg (Germany)' },
    { id: 'SBL (India)', label: 'SBL' },
    { id: 'Dr. Willmar Schwabe', label: 'Schwabe' },
    { id: 'Bakson', label: 'Bakson' },
    { id: 'Adel (Germany)', label: 'Adel' },
  ];

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // Category match
      if (selectedCategory !== 'all' && prod.category !== selectedCategory) {
        return false;
      }
      // Brand match
      if (selectedBrand !== 'all' && prod.company !== selectedBrand) {
        return false;
      }
      // Search query match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = prod.name.toLowerCase().includes(q);
        const hindiMatch = prod.hindiName?.toLowerCase().includes(q) || false;
        const compMatch = prod.company.toLowerCase().includes(q);
        const indMatch = prod.indications.some((ind) => ind.toLowerCase().includes(q));
        const potMatch = prod.potencies.some((p) => p.potency.toLowerCase().includes(q));
        if (!nameMatch && !hindiMatch && !compMatch && !indMatch && !potMatch) {
          return false;
        }
      }
      return true;
    });
  }, [products, selectedCategory, selectedBrand, searchQuery]);

  // Handle Tab Switch
  const handleSelectTab = (tab: NavTab) => {
    if (tab === 'cart') {
      setIsCartOpen(true);
      return;
    }
    if (tab === 'prescription') {
      setIsPrescriptionModalOpen(true);
      return;
    }
    if (tab === 'store') {
      setIsStoreInfoModalOpen(true);
      return;
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 pb-20">
      {/* Top Header */}
      <Header
        language={language}
        onToggleLanguage={() => setLanguage((l) => (l === 'en' ? 'hi' : 'en'))}
        isAdmin={isAdmin}
        onToggleAdmin={() => setIsAdmin((prev) => !prev)}
        onOpenStoreInfo={() => setIsStoreInfoModalOpen(true)}
        onOpenApkGuide={() => setIsApkGuideModalOpen(true)}
      />

      {/* Main Body Content Container */}
      <main className="flex-1 max-w-7xl mx-auto px-3 sm:px-6 w-full">
        {/* VIEW 1: HOME & CATALOG */}
        {activeTab === 'home' || activeTab === 'categories' ? (
          <div className="space-y-3 sm:space-y-4">
            {/* Promotional Banner Carousel (on Home) */}
            {activeTab === 'home' && (
              <BannerCarousel
                language={language}
                onUploadPrescriptionClick={() => setIsPrescriptionModalOpen(true)}
                onExploreCategory={(cat) => {
                  setSelectedCategory(cat as ProductCategory);
                  setActiveTab('categories');
                }}
              />
            )}

            {/* Android Search Bar Container */}
            <div className="sticky top-[86px] sm:top-[92px] z-30 pt-1 pb-2 bg-slate-50/95 backdrop-blur-xs">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-emerald-700 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t(language, 'searchPlaceholder')}
                  className="w-full bg-white border border-slate-200/90 rounded-2xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-slate-900 shadow-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent placeholder:text-slate-400 font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 text-xs font-bold bg-slate-100 rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Category horizontal ribbon */}
              <CategoryBar
                selectedCategory={selectedCategory}
                onSelectCategory={(cat) => setSelectedCategory(cat)}
                language={language}
              />

              {/* Brand filter chips */}
              <div className="flex space-x-1.5 overflow-x-auto no-scrollbar py-1 text-xs">
                {brands.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBrand(b.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors ${
                      selectedBrand === b.id
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Section Heading & Result Count */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center space-x-1.5">
                  <span>
                    {selectedCategory === 'all'
                      ? language === 'en' ? 'Authentic Homeopathic Medicines' : 'प्रमाणित होम्योपैथिक दवाएं'
                      : t(language, `cat${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}` as any)}
                  </span>
                </h2>
                <p className="text-[11px] text-slate-500 font-medium">
                  Showing {filteredProducts.length} certified medicines from Saharanpur inventory
                </p>
              </div>

              {/* Quick Prescription Upload Button */}
              <button
                onClick={() => setIsPrescriptionModalOpen(true)}
                className="hidden sm:inline-flex items-center space-x-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
              >
                <FileUp className="w-3.5 h-3.5 text-teal-700" />
                <span>Upload Prescription</span>
              </button>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 my-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                  <Search className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm sm:text-base">
                  No medicines match "{searchQuery}"
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Can't find a specific dilution or German drop? Send your medicine name directly to Dr. Sonu Kumar on WhatsApp.
                </p>
                <div className="pt-2 flex justify-center space-x-2">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setSelectedBrand('all');
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl transition-colors"
                  >
                    Clear Filters
                  </button>
                  <a
                    href={STORE_DETAILS.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors flex items-center space-x-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Ask on WhatsApp</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    language={language}
                    onAddToCart={handleAddToCart}
                    onSelectProduct={(p) => setSelectedProduct(p)}
                  />
                ))}
              </div>
            )}

            {/* Health Disclaimer Banner */}
            <HealthDisclaimerBanner language={language} />

            {/* Store Information Footer Strip */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-6 my-6 shadow-xs space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                      BK
                    </span>
                    <h4 className="font-extrabold text-sm text-slate-900">
                      {STORE_DETAILS.storeName}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600">
                    Lead Homoeopathic Pharmacist & Consultant: <strong className="text-emerald-900">{STORE_DETAILS.owner}</strong>
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Kisanpura Nala Patri, Saharanpur, Uttar Pradesh - 247001
                  </p>
                </div>

                <div className="space-y-1 text-xs text-slate-600">
                  <span className="font-bold text-slate-900 block text-xs">Timings & Contact</span>
                  <div className="flex items-center space-x-1.5 text-emerald-800 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{STORE_DETAILS.hours}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 pt-1">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <a href={`tel:${STORE_DETAILS.phone}`} className="hover:underline font-bold text-slate-800">
                      {STORE_DETAILS.phone}
                    </a>
                  </div>
                </div>

                <div className="flex flex-col justify-center space-y-2">
                  <a
                    href={STORE_DETAILS.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{t(language, 'whatsappConsult')}</span>
                  </a>

                  <a
                    href={STORE_DETAILS.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{t(language, 'openInGoogleMaps')}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* VIEW 2: ORDERS HISTORY VIEW */
          <OrdersView
            orders={orders}
            language={language}
            onSelectOrder={(ord) => setTrackingOrder(ord)}
            onStartShopping={() => setActiveTab('home')}
          />
        )}
      </main>

      {/* Android Floating Cart Quick-Action Button (when items in cart) */}
      {totalCartCount > 0 && !isCartOpen && (
        <div className="fixed bottom-18 right-4 z-40 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <button
            onClick={() => setIsCartOpen(true)}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold px-4 py-3 rounded-2xl shadow-xl flex items-center space-x-2.5 active:scale-95 transition-all ring-2 ring-white"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1.5 -right-2 bg-amber-400 text-slate-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {totalCartCount}
              </span>
            </div>
            <span className="text-xs">
              View Cart (₹{cart.reduce((s, i) => s + i.price * i.quantity, 0)})
            </span>
          </button>
        </div>
      )}

      {/* Native Android Bottom Tab Navigation */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        cartCount={totalCartCount}
        ordersCount={orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled').length}
        language={language}
      />

      {/* ALL MODALS & DRAWERS */}
      {/* 1. Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        language={language}
        onAddToCart={handleAddToCart}
        onDirectCheckout={handleDirectCheckout}
      />

      {/* 2. Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={(c) => setAppliedCoupon(c)}
        language={language}
      />

      {/* 3. Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        appliedCoupon={appliedCoupon}
        onOrderPlaced={handleOrderPlaced}
        language={language}
      />

      {/* 4. Live Order Tracking Modal */}
      <OrderTrackingModal
        order={trackingOrder}
        onClose={() => setTrackingOrder(null)}
        language={language}
      />

      {/* 5. Prescription Upload Modal */}
      <PrescriptionUploadModal
        isOpen={isPrescriptionModalOpen}
        onClose={() => setIsPrescriptionModalOpen(false)}
        language={language}
        onUploadSuccess={handlePrescriptionSuccess}
      />

      {/* 6. Store Info Modal */}
      <StoreInfoModal
        isOpen={isStoreInfoModalOpen}
        onClose={() => setIsStoreInfoModalOpen(false)}
        language={language}
      />

      {/* 7. Android APK & Production Setup Modal */}
      <ApkGuideModal
        isOpen={isApkGuideModalOpen}
        onClose={() => setIsApkGuideModalOpen(false)}
        language={language}
      />

      {/* 8. Admin Management Panel for Dr. Sonu Kumar */}
      <AdminPanel
        isOpen={isAdmin}
        onClose={() => setIsAdmin(false)}
        products={products}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        coupons={coupons}
        onAddCoupon={handleAddCoupon}
        prescriptions={prescriptions}
        language={language}
      />
    </div>
  );
}
