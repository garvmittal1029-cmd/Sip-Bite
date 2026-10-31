export type ShakeCategory =
  | 'Chocolate Shakes'
  | 'Oreo Shakes'
  | 'Strawberry Shakes'
  | 'Vanilla Shakes'
  | 'Mango Shakes'
  | 'Fruit Shakes'
  | 'Premium Thick Shakes'
  | 'Special Signature Shakes';

export interface ShakeProduct {
  id: string;
  name: string;
  slug: string;
  category: ShakeCategory;
  description: string;
  price: number; // in INR
  image: string;
  rating: number;
  reviewCount: number;
  calories: number;
  prepTime: string;
  isSignature?: boolean;
  isPopular?: boolean;
  inStock: boolean;
  ingredients: string[];
  tags: string[];
}

export type MilkBase =
  | 'Full Cream Milk'
  | 'Chocolate Milk'
  | 'Vanilla Base'
  | 'Plant-Based Milk';

export type ShakeFlavor =
  | 'Chocolate'
  | 'Oreo'
  | 'Strawberry'
  | 'Mango'
  | 'Vanilla'
  | 'Banana'
  | 'Butterscotch'
  | 'Coffee';

export type ShakeSize = 'Regular' | 'Large' | 'Extra Large';

export type SweetnessLevel = 'Low' | 'Medium' | 'Extra Sweet';

export interface ToppingOption {
  id: string;
  name: string;
  price: number; // in INR
  category?: string;
  icon?: string;
}

export interface CustomShakeConfig {
  base: MilkBase;
  basePrice: number;
  flavor: ShakeFlavor;
  flavorPrice: number;
  size: ShakeSize;
  sizeMultiplier: number;
  toppings: ToppingOption[];
  sweetness: SweetnessLevel;
  calculatedPrice: number;
  customName?: string;
}

export interface CartItem {
  id: string; // unique item id
  productId?: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  isCustom: boolean;
  customDetails?: CustomShakeConfig;
  category?: string;
  unitPrice: number;
  totalPrice: number;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
  instructions?: string;
}

export type OrderStatus = 'Placed' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
export type PaymentMethod = 'online' | 'whatsapp' | 'cod';
export type PaymentStatus = 'paid' | 'pending' | 'cod';

export interface Order {
  id: string; // e.g. SB-89241
  customer: CustomerDetails;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  promoCode?: string;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
  estimatedDelivery?: string;
}

export interface CustomerReview {
  id: string;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  shakeName: string;
  review: string;
  date: string;
  isVerified: boolean;
}

export interface SpecialOffer {
  id: string;
  title: string;
  code: string;
  discountPercent: number;
  minOrder: number;
  description: string;
  badge: string;
  active: boolean;
  validUntil: string;
}

export interface CustomerEnquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'new' | 'read' | 'replied';
}
