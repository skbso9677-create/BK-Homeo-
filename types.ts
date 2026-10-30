export type Language = 'en' | 'hi';

export type ProductCategory = 
  | 'all'
  | 'dilutions'
  | 'mother_tinctures'
  | 'biochemic'
  | 'patents_drops'
  | 'syrups_tonics'
  | 'ointments'
  | 'hair_skin'
  | 'veterinary';

export interface PotencyOption {
  potency: string; // e.g. "30CH", "200CH", "1M", "Q", "6X", "12X"
  price: number;
  mrp: number;
  packSize: string; // e.g. "30ml", "100ml", "25g"
  inStock: boolean;
}

export interface Product {
  id: string;
  name: string;
  hindiName?: string;
  company: 'Dr. Reckeweg (Germany)' | 'SBL (India)' | 'Dr. Willmar Schwabe' | 'Bakson' | 'Adel (Germany)' | 'Lords' | 'Wheezal' | 'Allen';
  category: ProductCategory;
  potencies: PotencyOption[];
  defaultPotencyIndex: number;
  description: string;
  hindiDescription?: string;
  indications: string[];
  dosage: string;
  hindiDosage?: string;
  composition: string;
  image: string;
  rating: number;
  reviewsCount: number;
  isPopular?: boolean;
  isBestSeller?: boolean;
  isPrescriptionRecommended?: boolean;
}

export interface CartItem {
  id: string; // product id + potency
  productId: string;
  name: string;
  hindiName?: string;
  company: string;
  potency: string;
  packSize: string;
  price: number;
  mrp: number;
  quantity: number;
  image: string;
}

export type OrderStatus = 
  | 'placed'
  | 'verified'
  | 'packed'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface Address {
  id: string;
  fullName: string;
  phoneNumber: string;
  streetAddress: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  deliveryType: 'home_delivery' | 'store_pickup';
  address?: Address;
  paymentMethod: 'cod' | 'upi';
  paymentStatus: 'pending' | 'completed' | 'failed';
  upiRefNumber?: string;
  status: OrderStatus;
  statusUpdates: {
    status: OrderStatus;
    title: string;
    description: string;
    timestamp: string;
  }[];
  prescriptionUrl?: string;
  notes?: string;
}

export interface PromoCoupon {
  code: string;
  discountPercent: number;
  minOrderAmount: number;
  maxDiscount: number;
  description: string;
  hindiDescription: string;
}

export interface PrescriptionSubmission {
  id: string;
  patientName: string;
  patientAge: string;
  patientPhone: string;
  symptoms: string;
  imageUrl: string;
  createdAt: string;
  status: 'pending' | 'reviewed' | 'medicines_prepared';
}
