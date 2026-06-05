/**
 * ===== لوحة التحكم الكاملة =====
 * تحتوي على:
 * - لوحة المعلومات (الإحصائيات)
 * - إدارة المنتجات (إضافة، تعديل، حذف)
 * - إدارة الطلبات (مراجعة، تغيير الحالة)
 */

import { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  Package,
  ShoppingCart,
  Plus,
  Pencil,
  Trash2,
  Search,
  Star,
  Save,
  Loader2,
  DollarSign,
  Image as ImageIcon,
  ChevronDown,
  LogOut,
  Home,
} from 'lucide-react';
import { useApp } from '../context';
import { Product, OrderStatus, ORDER_STATUS_MAP, ORDER_STATUS_COLORS, CATEGORIES, Category } from '../types';

// ===== تبويبات لوحة التحكم =====
type AdminTab = 'dashboard' | 'products' | 'add-product' | 'edit-product' | 'orders';

export function AdminPanel() {
  const { navigateTo, logout } = useApp();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setActiveTab('edit-product');
  };

  const tabs: { id: AdminTab; label: string; icon: any }[] = [
    { id: 'dashboard', label: 'الرئيسية', icon: BarChart3 },
    { id: 'products', label: 'المنتجات', icon: Package },
    { id: 'add-product', label: 'إضافة منتج', icon: Plus },
    { id: 'orders', label: 'الطلبات', icon: ShoppingCart },
  ];

  return (
    <div className="min-h-screen bg-dark-900">
      {/* رأس لوحة التحكم */}
      <div className="bg-dark-800 border-b border-gold-400/10 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg overflow-hidden bg-white flex items-center justify-center border border-gold-400/30">
              <img src="/logo.png" alt="الحرمين" className="w-full h-full object-contain p-0.5"
                onError={(e) => { e.currentTarget.style.display='none'; e.currentTarget.parentElement!.innerHTML='<span class="text-gold-600 font-bold text-sm">ح</span>'; }} />
            </div>
            <div>
              <h1 className="text-white font-bold text-sm">لوحة التحكم</h1>
              <p className="text-dark-400 text-xs">الحرمين للعود والعطور</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateTo('home')}
              className="p-2 text-dark-400 hover:text-gold-400 transition-colors rounded-lg hover:bg-white/5"
              title="الموقع"
            >
              <Home size={18} />
            </button>
            <button
              onClick={logout}
              className="p-2 text-red-400 hover:bg-red-500/10 transition-colors rounded-lg"
              title="خروج"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* التبويبات */}
      <div className="bg-dark-800/50 border-b border-gold-400/5 px-4 sm:px-6 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-gold-400 border-gold-400'
                    : 'text-dark-400 border-transparent hover:text-white hover:border-dark-500'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* محتوى التبويب */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <Dashboard key="dashboard" onNavigate={setActiveTab} />
          )}
          {activeTab === 'products' && (
            <ProductsManager key="products" onEdit={handleEditProduct} onAdd={() => setActiveTab('add-product')} />
          )}
          {activeTab === 'add-product' && (
            <ProductForm key="add-product" onSave={() => setActiveTab('products')} />
          )}
          {activeTab === 'edit-product' && editingProduct && (
            <ProductForm key="edit-product" product={editingProduct} onSave={() => setActiveTab('products')} />
          )}
          {activeTab === 'orders' && (
            <OrdersManager key="orders" />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ===== لوحة المعلومات =====
function Dashboard({ onNavigate }: { onNavigate: (tab: AdminTab) => void }) {
  const { products, orders } = useApp();

  const stats = useMemo(() => ({
    totalProducts: products.length,
    availableProducts: products.filter((p) => p.available).length,
    featuredProducts: products.filter((p) => p.featured).length,
    totalOrders: orders.length,
    newOrders: orders.filter((o) => o.status === 'new').length,
    totalRevenue: orders.reduce((sum, o) => sum + o.totalPrice, 0),
  }), [products, orders]);

  const recentOrders = orders.slice(0, 5);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="text-white text-xl font-bold">لوحة المعلومات</h2>

      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'إجمالي المنتجات', value: stats.totalProducts, icon: Package, color: 'text-blue-400 bg-blue-500/10' },
          { label: 'الطلبات الجديدة', value: stats.newOrders, icon: ShoppingCart, color: 'text-green-400 bg-green-500/10' },
          { label: 'إجمالي الطلبات', value: stats.totalOrders, icon: BarChart3, color: 'text-purple-400 bg-purple-500/10' },
          { label: 'الإيرادات', value: stats.totalRevenue.toLocaleString('ar-YE') + ' ر.ي', icon: DollarSign, color: 'text-gold-400 bg-gold-400/10' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-xl p-4"
            >
              <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
                <Icon size={20} />
              </div>
              <p className="text-dark-400 text-xs mb-1">{stat.label}</p>
              <p className="text-white font-bold text-lg">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* آخر الطلبات */}
        <div className="glass rounded-xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold flex items-center gap-2">
              <ShoppingCart size={18} className="text-gold-400" />
              آخر الطلبات
            </h3>
            <button
              onClick={() => onNavigate('orders')}
              className="text-gold-400 text-xs hover:underline"
            >
              عرض الكل
            </button>
          </div>
          
          {recentOrders.length > 0 ? (
            <div className="space-y-2">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-dark-900 rounded-lg">
                  <div>
                    <p className="text-white text-sm font-medium">{order.customerName}</p>
                    <p className="text-dark-400 text-xs">{order.productName || (order.items && order.items[0]?.productName) || ""}</p>
                  </div>
                  <div className="text-left">
                    <span className={`text-xs px-2 py-1 rounded-full border ${ORDER_STATUS_COLORS[order.status]}`}>
                      {ORDER_STATUS_MAP[order.status]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-dark-400 text-sm text-center py-4">لا توجد طلبات بعد</p>
          )}
        </div>

        {/* المنتجات المميزة */}
        <div className="glass rounded-xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold flex items-center gap-2">
              <Star size={18} className="text-gold-400" />
              المنتجات المميزة
            </h3>
            <button
              onClick={() => onNavigate('products')}
              className="text-gold-400 text-xs hover:underline"
            >
              عرض الكل
            </button>
          </div>

          <div className="space-y-2">
            {products.filter((p) => p.featured).slice(0, 5).map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-dark-900 rounded-lg">
                <div>
                  <p className="text-white text-sm font-medium">{product.name}</p>
                  <p className="text-dark-400 text-xs">{product.price.toLocaleString('ar-YE')} ر.ي</p>
                </div>
                <span className={`text-xs ${product.available ? 'text-green-400' : 'text-red-400'}`}>
                  {product.available ? 'متوفر' : 'غير متوفر'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ===== إدارة المنتجات =====
function ProductsManager({ onEdit, onAdd }: { onEdit: (p: Product) => void; onAdd: () => void }) {
  const { products, deleteProduct, updateProduct } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<Category | 'all'>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = [...products];
    if (filterCategory !== 'all') result = result.filter((p) => p.category === filterCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }
    return result;
  }, [products, filterCategory, searchQuery]);

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
    setDeleteConfirm(null);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-white text-xl font-bold">إدارة المنتجات</h2>
        <button onClick={onAdd} className="btn-gold flex items-center gap-2 text-sm py-2 px-4">
          <Plus size={16} />
          إضافة منتج
        </button>
      </div>

      {/* البحث والفلترة */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400" />
          <input
            type="text"
            placeholder="بحث عن منتج..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-dark-800 border border-gold-400/10 rounded-lg pr-9 pl-3 py-2 text-white text-sm placeholder-dark-400 focus:outline-none focus:border-gold-400/30"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value as Category | 'all')}
          className="bg-dark-800 border border-gold-400/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none appearance-none"
        >
          <option value="all">جميع الأقسام</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* جدول المنتجات */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold-400/10">
                <th className="text-right text-dark-400 font-medium p-3">المنتج</th>
                <th className="text-right text-dark-400 font-medium p-3">القسم</th>
                <th className="text-right text-dark-400 font-medium p-3">السعر</th>
                <th className="text-right text-dark-400 font-medium p-3">الكمية</th>
                <th className="text-right text-dark-400 font-medium p-3">الحالة</th>
                <th className="text-right text-dark-400 font-medium p-3">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-b border-gold-400/5 hover:bg-white/[0.02]">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-dark-700 shrink-0 overflow-hidden">
                        {product.mainImage ? (
                          <img src={product.mainImage} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full img-placeholder text-sm">📦</div>
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium truncate max-w-[150px]">{product.name}</p>
                        {product.featured && <Star size={12} className="text-gold-400 fill-gold-400" />}
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-dark-300">{CATEGORIES.find((c) => c.id === product.category)?.name}</td>
                  <td className="p-3 text-gold-400 font-medium">{product.price.toLocaleString('ar-YE')}</td>
                  <td className="p-3 text-white">{product.quantity}</td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${product.available ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                      {product.available ? 'متوفر' : 'غير متوفر'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEdit(product)}
                        className="p-1.5 hover:bg-blue-500/10 text-blue-400 rounded-lg transition-colors"
                        title="تعديل"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => updateProduct(product.id, { featured: !product.featured })}
                        className={`p-1.5 rounded-lg transition-colors ${product.featured ? 'text-gold-400 hover:bg-gold-400/10' : 'text-dark-400 hover:bg-white/5'}`}
                        title="مميز"
                      >
                        <Star size={14} fill={product.featured ? 'currentColor' : 'none'} />
                      </button>
                      {deleteConfirm === product.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-xs text-red-400 px-2 py-1 bg-red-500/10 rounded"
                          >
                            تأكيد
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="text-xs text-dark-400 px-2 py-1 bg-white/5 rounded"
                          >
                            إلغاء
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(product.id)}
                          className="p-1.5 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors"
                          title="حذف"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-8 text-dark-400 text-sm">لا توجد منتجات</div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ===== نموذج إضافة/تعديل المنتج =====
function ProductForm({ product, onSave }: { product?: Product; onSave: () => void }) {
  const { addProduct, updateProduct, uploadImage } = useApp();
  const isEdit = !!product;

  const [name, setName] = useState(product?.name || '');
  const [category, setCategory] = useState<Category>(product?.category || 'perfumes');
  const [description, setDescription] = useState(product?.description || '');
  const [price, setPrice] = useState(product?.price?.toString() || '');
  const [quantity, setQuantity] = useState(product?.quantity?.toString() || '');
  const [available, setAvailable] = useState(product?.available ?? true);
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [mainImage, setMainImage] = useState(product?.mainImage || '');
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsSaving(true);
      try {
        const url = await uploadImage(file, 'products', `${Date.now()}_${file.name}`);
        setMainImage(url);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim() || !price || !quantity) return;

    setIsSaving(true);
    try {
      const data = {
        name: name.trim(),
        category,
        description: description.trim(),
        price: Number(price),
        quantity: Number(quantity),
        mainImage,
        images: [] as string[],
        available,
        featured,
      };

      if (isEdit && product) {
        await updateProduct(product.id, data);
      } else {
        await addProduct(data);
      }
      onSave();
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto space-y-5">
      <h2 className="text-white text-xl font-bold">
        {isEdit ? 'تعديل المنتج' : 'إضافة منتج جديد'}
      </h2>

      <div className="glass rounded-xl p-5 space-y-4">
        {/* اسم المنتج */}
        <div>
          <label className="text-white text-sm font-medium block mb-1.5">اسم المنتج *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="مثال: عطر المسك الأبيض الفاخر"
            className="w-full bg-dark-900 border border-gold-400/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-dark-400 focus:outline-none focus:border-gold-400/30"
          />
        </div>

        {/* القسم */}
        <div>
          <label className="text-white text-sm font-medium block mb-1.5">القسم *</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="w-full bg-dark-900 border border-gold-400/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold-400/30 appearance-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
            ))}
          </select>
        </div>

        {/* الوصف */}
        <div>
          <label className="text-white text-sm font-medium block mb-1.5">الوصف</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="وصف المنتج..."
            rows={3}
            className="w-full bg-dark-900 border border-gold-400/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-dark-400 focus:outline-none focus:border-gold-400/30 resize-none"
          />
        </div>

        {/* السعر والكمية */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-white text-sm font-medium block mb-1.5">السعر (ر.ي) *</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0"
              dir="ltr"
              className="w-full bg-dark-900 border border-gold-400/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-dark-400 focus:outline-none focus:border-gold-400/30 text-left"
            />
          </div>
          <div>
            <label className="text-white text-sm font-medium block mb-1.5">الكمية *</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0"
              dir="ltr"
              className="w-full bg-dark-900 border border-gold-400/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-dark-400 focus:outline-none focus:border-gold-400/30 text-left"
            />
          </div>
        </div>

        {/* رفع الصورة */}
        <div>
          <label className="text-white text-sm font-medium block mb-1.5">صورة المنتج</label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gold-400/15 rounded-xl p-4 text-center cursor-pointer hover:border-gold-400/30 transition-colors"
          >
            {mainImage ? (
              <div className="space-y-2">
                <img src={mainImage} alt="الصورة" className="max-h-40 mx-auto rounded-lg" />
                <p className="text-gold-400 text-xs">اضغط لتغيير الصورة</p>
              </div>
            ) : (
              <div className="space-y-2">
                {isSaving ? (
                  <Loader2 size={32} className="text-gold-400 mx-auto animate-spin" />
                ) : (
                  <ImageIcon size={32} className="text-gold-400 mx-auto" />
                )}
                <p className="text-dark-300 text-sm">اضغط لرفع صورة المنتج</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* خيارات */}
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
              className="w-4 h-4 rounded border-gold-400/30 text-gold-400 focus:ring-gold-400"
            />
            <span className="text-white text-sm">متوفر</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 rounded border-gold-400/30 text-gold-400 focus:ring-gold-400"
            />
            <span className="text-white text-sm">منتج مميز</span>
          </label>
        </div>

        {/* أزرار */}
        <div className="flex gap-3 pt-2">
          <button onClick={onSave} className="btn-gold-outline flex-1">إلغاء</button>
          <button
            onClick={handleSubmit}
            disabled={isSaving || !name.trim() || !price || !quantity}
            className="btn-gold flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {isEdit ? 'حفظ التعديلات' : 'إضافة المنتج'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ===== إدارة الطلبات =====
function OrdersManager() {
  const { orders, updateOrderStatus } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = [...orders];
    if (filterStatus !== 'all') result = result.filter((o) => o.status === filterStatus);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (o) =>
          o.customerName.toLowerCase().includes(q) ||
          (o.productName || (o.items && o.items[0]?.productName) || "").toLowerCase().includes(q) ||
          o.id.toLowerCase().includes(q) ||
          o.phone.includes(q)
      );
    }
    return result;
  }, [orders, filterStatus, searchQuery]);

  const statuses: (OrderStatus | 'all')[] = ['all', 'new', 'deposit_review', 'preparing', 'delivered', 'cancelled'];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <h2 className="text-white text-xl font-bold">إدارة الطلبات</h2>

      {/* البحث والفلترة */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400" />
          <input
            type="text"
            placeholder="بحث بالاسم أو رقم الطلب..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-dark-800 border border-gold-400/10 rounded-lg pr-9 pl-3 py-2 text-white text-sm placeholder-dark-400 focus:outline-none focus:border-gold-400/30"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as OrderStatus | 'all')}
          className="bg-dark-800 border border-gold-400/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none appearance-none"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s === 'all' ? 'جميع الحالات' : ORDER_STATUS_MAP[s]}
            </option>
          ))}
        </select>
      </div>

      {/* قائمة الطلبات */}
      <div className="space-y-3">
        {filtered.map((order) => (
          <div key={order.id} className="glass rounded-xl overflow-hidden">
            {/* رأس الطلب */}
            <div
              className="p-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
              onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-white font-bold text-sm">{order.customerName}</p>
                    <p className="text-dark-400 text-xs">#{order.id} • {order.productName || (order.items && order.items[0]?.productName) || ""}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gold-400 font-bold text-sm">
                    {order.totalPrice.toLocaleString('ar-YE')} ر.ي
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full border ${ORDER_STATUS_COLORS[order.status]}`}>
                    {ORDER_STATUS_MAP[order.status]}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-dark-400 transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`}
                  />
                </div>
              </div>
            </div>

            {/* تفاصيل الطلب */}
            <AnimatePresence>
              {expandedOrder === order.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-gold-400/10 overflow-hidden"
                >
                  <div className="p-4 space-y-4">
                    {/* بيانات العميل */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-dark-900 rounded-lg p-3">
                        <p className="text-dark-400 text-xs mb-1">الاسم</p>
                        <p className="text-white text-sm">{order.customerName}</p>
                      </div>
                      <div className="bg-dark-900 rounded-lg p-3">
                        <p className="text-dark-400 text-xs mb-1">الهاتف</p>
                        <p className="text-white text-sm" dir="ltr">{order.phone}</p>
                      </div>
                      <div className="bg-dark-900 rounded-lg p-3">
                        <p className="text-dark-400 text-xs mb-1">المحافظة / المديرية</p>
                        <p className="text-white text-sm">{order.governorate} - {order.district}</p>
                      </div>
                      <div className="bg-dark-900 rounded-lg p-3">
                        <p className="text-dark-400 text-xs mb-1">العنوان</p>
                        <p className="text-white text-sm">{order.address}</p>
                      </div>
                    </div>

                    {/* تفاصيل الطلب */}
                    <div className="bg-dark-900 rounded-lg p-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-dark-400">المنتج</span>
                        <span className="text-white">{order.productName || (order.items && order.items.map((i:any)=>i.productName).join(", ")) || ""}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-dark-400">الكمية</span>
                        <span className="text-white">{order.quantity}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-dark-400">سعر الوحدة</span>
                        <span className="text-white">{order.unitPrice.toLocaleString('ar-YE')} ر.ي</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-dark-400">الإجمالي</span>
                        <span className="text-gold-400 font-bold">{order.totalPrice.toLocaleString('ar-YE')} ر.ي</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-dark-400">العربون (20%)</span>
                        <span className="text-green-400">{order.deposit.toLocaleString('ar-YE')} ر.ي</span>
                      </div>
                      {order.transferNumber && (
                        <div className="flex justify-between text-sm">
                          <span className="text-dark-400">رقم الحوالة</span>
                          <span className="text-white" dir="ltr">{order.transferNumber}</span>
                        </div>
                      )}
                      {order.transferReceipt && (
                        <div className="pt-2">
                          <p className="text-dark-400 text-xs mb-1">سند التحويل:</p>
                          <a
                            href={order.transferReceipt}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gold-400 text-xs hover:underline"
                          >
                            عرض الصورة
                          </a>
                        </div>
                      )}
                    </div>

                    {/* تغيير حالة الطلب */}
                    <div className="bg-dark-900 rounded-lg p-3">
                      <p className="text-dark-400 text-xs mb-2">تغيير حالة الطلب:</p>
                      <div className="flex flex-wrap gap-2">
                        {(Object.keys(ORDER_STATUS_MAP) as OrderStatus[]).map((status) => (
                          <button
                            key={status}
                            onClick={() => updateOrderStatus(order.id, status)}
                            className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                              order.status === status
                                ? ORDER_STATUS_COLORS[status]
                                : 'border-dark-500 text-dark-400 hover:text-white hover:border-dark-400'
                            }`}
                          >
                            {ORDER_STATUS_MAP[status]}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* التاريخ */}
                    <div className="text-dark-500 text-xs text-left" dir="ltr">
                      {new Date(order.createdAt).toLocaleString('ar-YE')}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <ShoppingCart size={40} className="text-dark-500 mx-auto mb-3" />
            <p className="text-dark-400 text-sm">لا توجد طلبات</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
