import React, { useState } from 'react';
import { 
  X, 
  Package, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  AlertCircle, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  FileText, 
  Tag, 
  Eye, 
  Truck,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Product, Order, PromoCoupon, PrescriptionSubmission, Language, ProductCategory } from '../types';
import { STORE_DETAILS } from '../data/mockData';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  coupons: PromoCoupon[];
  onAddCoupon: (coupon: PromoCoupon) => void;
  prescriptions: PrescriptionSubmission[];
  language: Language;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  orders,
  onUpdateOrderStatus,
  coupons,
  onAddCoupon,
  prescriptions,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'prescriptions' | 'coupons'>('inventory');

  // Add product form modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMedName, setNewMedName] = useState('');
  const [newMedHindi, setNewMedHindi] = useState('');
  const [newCompany, setNewCompany] = useState<Product['company']>('Dr. Reckeweg (Germany)');
  const [newCategory, setNewCategory] = useState<ProductCategory>('dilutions');
  const [newPotency, setNewPotency] = useState('30CH');
  const [newPackSize, setNewPackSize] = useState('30 ml');
  const [newPrice, setNewPrice] = useState('120');
  const [newMrp, setNewMrp] = useState('140');
  const [newDesc, setNewDesc] = useState('');
  const [newIndications, setNewIndications] = useState('');

  // Add coupon state
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('10');
  const [newCouponMin, setNewCouponMin] = useState('300');

  if (!isOpen) return null;

  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled').length;

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName) return;

    const created: Product = {
      id: `prod-${Date.now()}`,
      name: newMedName,
      hindiName: newMedHindi || undefined,
      company: newCompany,
      category: newCategory,
      potencies: [
        {
          potency: newPotency,
          price: Number(newPrice) || 120,
          mrp: Number(newMrp) || 140,
          packSize: newPackSize,
          inStock: true,
        }
      ],
      defaultPotencyIndex: 0,
      description: newDesc || 'Authentic homeopathic formulation prepared as per Homoeopathic Pharmacopoeia.',
      indications: newIndications ? newIndications.split(',').map((s) => s.trim()) : ['General homoeopathic care'],
      dosage: 'Take as directed by Dr. Sonu Kumar or 10-15 drops in water 3 times a day.',
      composition: 'Pure homeopathic potency in neutral dispensing vehicle.',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
      rating: 5.0,
      reviewsCount: 1,
    };

    onAddProduct(created);
    setShowAddModal(false);
    setNewMedName('');
    setNewMedHindi('');
    setNewDesc('');
    setNewIndications('');
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;

    const coupon: PromoCoupon = {
      code: newCouponCode.trim().toUpperCase(),
      discountPercent: Number(newCouponDiscount) || 10,
      minOrderAmount: Number(newCouponMin) || 300,
      maxDiscount: 200,
      description: `${newCouponDiscount}% discount coupon`,
      hindiDescription: `${newCouponDiscount}% छूट कूपन`,
    };

    onAddCoupon(coupon);
    setNewCouponCode('');
  };

  const toggleStock = (product: Product) => {
    const updated = {
      ...product,
      potencies: product.potencies.map((p) => ({
        ...p,
        inStock: !p.inStock,
      })),
    };
    onUpdateProduct(updated);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Admin Bar Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded-xl bg-amber-500 text-slate-900 font-black flex items-center justify-center text-xs">
              DR
            </span>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="font-extrabold text-sm sm:text-base">
                  Dr. Sonu Kumar • Admin Dashboard
                </h3>
                <span className="bg-amber-400 text-slate-900 text-[10px] font-bold px-2 py-0.2 rounded-full">
                  Owner Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {STORE_DETAILS.storeName}, Saharanpur (Contact: {STORE_DETAILS.phone})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Stats Ribbon */}
        <div className="grid grid-cols-3 bg-slate-800 text-white p-3 gap-2 text-center text-xs border-b border-slate-700">
          <div className="bg-slate-700/60 p-2 rounded-xl">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Sales</span>
            <span className="text-base font-black text-emerald-400">₹{totalSales}</span>
          </div>
          <div className="bg-slate-700/60 p-2 rounded-xl">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Active Orders</span>
            <span className="text-base font-black text-amber-400">{pendingOrders}</span>
          </div>
          <div className="bg-slate-700/60 p-2 rounded-xl">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Medicines In Stock</span>
            <span className="text-base font-black text-sky-400">{products.length}</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 text-xs font-bold space-x-4">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`py-3 border-b-2 transition-colors flex items-center space-x-1.5 ${
              activeTab === 'inventory' ? 'border-emerald-600 text-emerald-800' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Manage Inventory ({products.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 border-b-2 transition-colors flex items-center space-x-1.5 ${
              activeTab === 'orders' ? 'border-emerald-600 text-emerald-800' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Customer Orders ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`py-3 border-b-2 transition-colors flex items-center space-x-1.5 ${
              activeTab === 'prescriptions' ? 'border-emerald-600 text-emerald-800' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Prescriptions ({prescriptions.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`py-3 border-b-2 transition-colors flex items-center space-x-1.5 ${
              activeTab === 'coupons' ? 'border-emerald-600 text-emerald-800' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Offers & Coupons ({coupons.length})</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 text-xs">
          {/* TAB 1: INVENTORY MANAGEMENT */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">
                    Homeopathic Medicine Stock & Pricing
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Add new medicines, adjust prices, or toggle stock availability.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl font-bold flex items-center space-x-1 shadow-xs transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Medicine</span>
                </button>
              </div>

              {/* Product rows */}
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                {products.map((prod) => {
                  const opt = prod.potencies[0];
                  return (
                    <div key={prod.id} className="p-3 flex items-center justify-between hover:bg-slate-50/70 transition-colors gap-2">
                      <div className="flex items-center space-x-3 min-w-0">
                        <img src={prod.image} alt={prod.name} className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0" />
                        <div className="truncate">
                          <div className="flex items-center space-x-1.5">
                            <span className="font-bold text-slate-900 truncate">{prod.name}</span>
                            <span className="bg-slate-100 text-slate-700 text-[9px] font-bold px-1.5 py-0.2 rounded">
                              {prod.company}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center space-x-2 mt-0.5">
                            <span>{opt.packSize}</span>
                            <span>•</span>
                            <span className="font-bold text-emerald-800">₹{opt.price} (MRP: ₹{opt.mrp})</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <button
                          onClick={() => toggleStock(prod)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                            opt.inStock
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : 'bg-rose-50 text-rose-800 border-rose-300'
                          }`}
                        >
                          {opt.inStock ? 'In Stock' : 'Out of Stock'}
                        </button>

                        <button
                          onClick={() => onDeleteProduct(prod.id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Medicine"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: ORDER MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h4 className="font-extrabold text-sm text-slate-900">
                Customer Delivery & Order Management
              </h4>

              {orders.length === 0 ? (
                <div className="text-center py-8 text-slate-400">No orders received yet</div>
              ) : (
                <div className="space-y-3">
                  {orders.map((ord) => (
                    <div key={ord.id} className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-2xs">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <div>
                          <span className="font-black text-slate-900 text-sm">{ord.orderNumber}</span>
                          <span className="text-[11px] text-slate-400 ml-2">
                            {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className="font-black text-slate-900 text-sm">₹{ord.total}</span>
                          <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] uppercase font-bold text-slate-700">
                            {ord.paymentMethod} ({ord.paymentStatus})
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-600">
                        <strong>Customer:</strong> {ord.address ? `${ord.address.fullName} (${ord.address.phoneNumber}), ${ord.address.streetAddress}, Saharanpur` : 'Store Pickup at Kisanpura'}
                      </div>

                      <div className="text-xs text-slate-600">
                        <strong>Items:</strong> {ord.items.map((i) => `${i.name} (${i.potency}) x${i.quantity}`).join(', ')}
                      </div>

                      {/* Status Update Control */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
                        <span className="text-[11px] font-bold text-slate-700 mr-1">Update Status:</span>
                        {(['placed', 'verified', 'packed', 'out_for_delivery', 'delivered'] as Order['status'][]).map((st) => (
                          <button
                            key={st}
                            onClick={() => onUpdateOrderStatus(ord.id, st)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                              ord.status === st
                                ? 'bg-emerald-700 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {st.replace(/_/g, ' ').toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PRESCRIPTIONS */}
          {activeTab === 'prescriptions' && (
            <div className="space-y-3">
              <h4 className="font-extrabold text-sm text-slate-900">
                Uploaded Patient Prescriptions ({prescriptions.length})
              </h4>
              {prescriptions.length === 0 ? (
                <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-2xl">
                  No patient prescriptions submitted yet. Patients can upload them from the Prescription tab or send to 6395352618.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {prescriptions.map((presc) => (
                    <div key={presc.id} className="p-3 rounded-2xl border border-slate-200 bg-white space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{presc.patientName}</span>
                        <span className="text-[10px] text-slate-400">{presc.patientAge ? `${presc.patientAge} yrs` : ''}</span>
                      </div>
                      <div className="text-xs text-emerald-800 font-bold">
                        Phone: {presc.patientPhone}
                      </div>
                      {presc.symptoms && (
                        <p className="text-xs text-slate-600 italic bg-slate-50 p-2 rounded-lg">
                          "{presc.symptoms}"
                        </p>
                      )}
                      {presc.imageUrl && (
                        <a href={presc.imageUrl} target="_blank" rel="noopener noreferrer">
                          <img src={presc.imageUrl} alt="Prescription" className="h-32 w-full object-cover rounded-xl border border-slate-200 mt-1" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: OFFERS & COUPONS */}
          {activeTab === 'coupons' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">
                    Promo Codes & Discounts
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Create instant discounts for Saharanpur customers.
                  </p>
                </div>
              </div>

              {/* Add Coupon Form */}
              <form onSubmit={handleCreateCoupon} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  placeholder="Code (e.g. SAHARANPUR20)"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 uppercase font-bold text-xs"
                  required
                />
                <input
                  type="number"
                  placeholder="Discount % (e.g. 15)"
                  value={newCouponDiscount}
                  onChange={(e) => setNewCouponDiscount(e.target.value)}
                  className="w-24 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold"
                  required
                />
                <input
                  type="number"
                  placeholder="Min Order ₹"
                  value={newCouponMin}
                  onChange={(e) => setNewCouponMin(e.target.value)}
                  className="w-28 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold"
                  required
                />
                <button
                  type="submit"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-1.5 rounded-xl font-bold text-xs"
                >
                  Create Coupon
                </button>
              </form>

              <div className="space-y-2">
                {coupons.map((c) => (
                  <div key={c.code} className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-emerald-800 text-sm bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {c.code}
                      </span>
                      <span className="text-xs text-slate-600 ml-2 font-medium">
                        {c.discountPercent}% OFF (Min Order: ₹{c.minOrderAmount})
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">Active</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal for Adding New Product */}
        {showAddModal && (
          <div className="fixed inset-0 z-60 bg-slate-900/60 flex items-center justify-center p-3">
            <div className="bg-white rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl">
              <div className="flex justify-between items-center border-b pb-2">
                <h4 className="font-bold text-sm text-slate-900">Add New Homeopathic Medicine</h4>
                <button onClick={() => setShowAddModal(false)}><X className="w-5 h-5 text-slate-500" /></button>
              </div>

              <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold block mb-1">Medicine Name (English) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SBL Pulsatilla Nigricans"
                    value={newMedName}
                    onChange={(e) => setNewMedName(e.target.value)}
                    className="w-full border rounded-xl p-2"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Hindi Name (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. एसबीएल पल्सेटिला नाइग्रिकेंस"
                    value={newMedHindi}
                    onChange={(e) => setNewMedHindi(e.target.value)}
                    className="w-full border rounded-xl p-2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold block mb-1">Company / Brand</label>
                    <select
                      value={newCompany}
                      onChange={(e) => setNewCompany(e.target.value as any)}
                      className="w-full border rounded-xl p-2 bg-white"
                    >
                      <option value="Dr. Reckeweg (Germany)">Dr. Reckeweg (Germany)</option>
                      <option value="SBL (India)">SBL (India)</option>
                      <option value="Dr. Willmar Schwabe">Dr. Willmar Schwabe</option>
                      <option value="Bakson">Bakson</option>
                      <option value="Adel (Germany)">Adel (Germany)</option>
                      <option value="Wheezal">Wheezal</option>
                      <option value="Allen">Allen</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full border rounded-xl p-2 bg-white"
                    >
                      <option value="dilutions">Dilutions</option>
                      <option value="mother_tinctures">Mother Tinctures</option>
                      <option value="biochemic">Biochemic</option>
                      <option value="patents_drops">Patent Drops</option>
                      <option value="syrups_tonics">Syrups & Tonics</option>
                      <option value="ointments">Ointments</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="font-semibold block mb-1">Potency</label>
                    <input type="text" value={newPotency} onChange={(e) => setNewPotency(e.target.value)} className="w-full border rounded-xl p-2" />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Pack</label>
                    <input type="text" value={newPackSize} onChange={(e) => setNewPackSize(e.target.value)} className="w-full border rounded-xl p-2" />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Price ₹</label>
                    <input type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} className="w-full border rounded-xl p-2" />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">MRP ₹</label>
                    <input type="number" value={newMrp} onChange={(e) => setNewMrp(e.target.value)} className="w-full border rounded-xl p-2" />
                  </div>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Indications (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Gastric acidity, Headache, Cold"
                    value={newIndications}
                    onChange={(e) => setNewIndications(e.target.value)}
                    className="w-full border rounded-xl p-2"
                  />
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-3 py-1.5 text-slate-500">Cancel</button>
                  <button type="submit" className="bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl">Save Medicine</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
