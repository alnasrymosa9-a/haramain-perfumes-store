/* ===== أنواع البيانات الأساسية ===== */

// أقسام المنتجات
export type Category = 'perfumes' | 'oud' | 'incense' | 'beauty' | 'offers';

export interface CategoryInfo {
  id: Category;
  name: string;
  icon: string;
  description: string;
}

// واجهة المنتج
export interface Product {
  id: string;
  name: string;
  category: Category;
  description: string;
  price: number;
  quantity: number;
  mainImage: string;
  images: string[];
  available: boolean;
  featured: boolean;
  createdAt: string;
}

// واجهة بند السلة
export interface CartItem {
  product: Product;
  quantity: number;
}

// واجهة الطلب
export interface Order {
  id: string;
  customerName: string;
  phone: string;
  governorate: string;
  district: string;
  address: string;
  items: OrderItem[];
  // backward compat single-product orders
  productId?: string;
  productName?: string;
  productImage?: string;
  quantity?: number;
  unitPrice?: number;
  totalPrice: number;
  deposit: number;
  transferReceipt: string;
  transferNumber: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

// حالات الطلب
export type OrderStatus =
  | 'new'
  | 'deposit_review'
  | 'preparing'
  | 'delivered'
  | 'cancelled';

// معلومات الدفع
export interface PaymentInfo {
  kareemiName: string;
  kareemiNumber: string;
  additionalAccounts?: { name: string; number: string; bank: string }[];
}

// صفحات الموقع
export type Page =
  | 'home'
  | 'products'
  | 'product-detail'
  | 'contact'
  | 'offers'
  | 'login'
  | 'admin-dashboard'
  | 'admin-products'
  | 'admin-orders'
  | 'admin-add-product'
  | 'admin-edit-product'
  | 'admin-settings';

// خريطة حالات الطلب بالعربي
export const ORDER_STATUS_MAP: Record<OrderStatus, string> = {
  'new': 'طلب جديد',
  'deposit_review': 'تم مراجعة العربون',
  'preparing': 'جاري التجهيز',
  'delivered': 'تم التسليم',
  'cancelled': 'تم الإلغاء',
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  'new': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'deposit_review': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'preparing': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'delivered': 'bg-green-500/20 text-green-400 border-green-500/30',
  'cancelled': 'bg-red-500/20 text-red-400 border-red-500/30',
};

// معلومات الأقسام
export const CATEGORIES: CategoryInfo[] = [
  { id: 'perfumes', name: 'العطور', icon: '🧴', description: 'أرقى وأفخم العطور العربية والعالمية' },
  { id: 'oud', name: 'العود', icon: '🪵', description: 'أجود أنواع العود الكمبودي والهندي' },
  { id: 'incense', name: 'مستلزمات البخور', icon: '🔥', description: 'كل ما يخص البخور والدخون' },
  { id: 'beauty', name: 'أدوات التجميل', icon: '💄', description: 'مستحضرات تجميل وأدوات العناية بالبشرة' },
  { id: 'offers', name: 'العروض الخاصة', icon: '🎁', description: 'عروض حصرية وتخفيضات مميزة' },
];
