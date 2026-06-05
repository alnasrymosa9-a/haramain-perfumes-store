/**
 * ===== صفحة تفاصيل المنتج =====
 * تعرض تفاصيل المنتج الكاملة مع إمكانية الطلب
 */

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Minus,
  Plus,
  ShoppingBag,
  MessageCircle,
  Star,
  Share2,
  Check,
  Package,
} from 'lucide-react';
import { useApp } from '../context';
import { OrderForm } from '../components/OrderForm';
import { CATEGORIES } from '../types';

export function ProductDetailPage() {
  const { products, pageData, navigateTo, sendWhatsApp } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showOrderForm, setShowOrderForm] = useState(pageData?.showOrder || false);

  const product = useMemo(
    () => products.find((p) => p.id === pageData?.productId),
    [products, pageData]
  );

  // منتجات مشابهة
  const relatedProducts = useMemo(
    () =>
      product
        ? products
            .filter((p) => p.category === product.category && p.id !== product.id && p.available)
            .slice(0, 4)
        : [],
    [products, product]
  );

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-white text-2xl font-bold mb-3">المنتج غير موجود</h2>
          <button onClick={() => navigateTo('products')} className="btn-gold">
            العودة للمنتجات
          </button>
        </div>
      </div>
    );
  }

  const allImages = [product.mainImage, ...product.images].filter(Boolean);
  const categoryInfo = CATEGORIES.find((c) => c.id === product.category);

  // تنسيق السعر
  const formatPrice = (price: number) => price.toLocaleString('ar-YE') + ' ر.ي';

  // رسالة واتساب للمنتج
  const whatsappMessage = `السلام عليكم\nأريد الاستفسار عن المنتج:\n📦 ${product.name}\n💰 السعر: ${formatPrice(product.price)}\n\n${window.location.href}`;

  return (
    <div className="min-h-screen py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* مسار التنقل */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-sm mb-6 flex-wrap"
        >
          <button
            onClick={() => navigateTo('home')}
            className="text-dark-400 hover:text-gold-400 transition-colors"
          >
            الرئيسية
          </button>
          <span className="text-dark-500">/</span>
          <button
            onClick={() => navigateTo('products', { category: product.category })}
            className="text-dark-400 hover:text-gold-400 transition-colors"
          >
            {categoryInfo?.name}
          </button>
          <span className="text-dark-500">/</span>
          <span className="text-gold-400 truncate max-w-[200px]">{product.name}</span>
        </motion.div>

        {/* محتوى المنتج */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
          {/* معرض الصور */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* الصورة الرئيسية */}
            <div className="aspect-square rounded-2xl overflow-hidden bg-dark-800 border border-gold-400/10 mb-3">
              {allImages.length > 0 && allImages[selectedImage] ? (
                <img
                  src={allImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full img-placeholder">
                  <span className="text-8xl opacity-40">
                    {categoryInfo?.icon || '📦'}
                  </span>
                </div>
              )}
            </div>

            {/* الصور المصغرة */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                      selectedImage === i
                        ? 'border-gold-400'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* تفاصيل المنتج */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-5"
          >
            {/* شارة القسم */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="glass px-3 py-1 rounded-full text-xs text-gold-400 flex items-center gap-1">
                {categoryInfo?.icon} {categoryInfo?.name}
              </span>
              {product.featured && (
                <span className="bg-gold-400/15 text-gold-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <Star size={12} fill="currentColor" />
                  منتج مميز
                </span>
              )}
              {product.available ? (
                <span className="bg-green-500/15 text-green-400 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                  <Check size={12} />
                  متوفر
                </span>
              ) : (
                <span className="bg-red-500/15 text-red-400 px-3 py-1 rounded-full text-xs">
                  غير متوفر
                </span>
              )}
            </div>

            {/* اسم المنتج */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
              {product.name}
            </h1>

            {/* الوصف */}
            <p className="text-dark-300 text-sm sm:text-base leading-relaxed">
              {product.description}
            </p>

            {/* السعر */}
            <div className="glass rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-dark-300 text-sm">السعر</span>
                <span className="text-gold-400 font-black text-2xl sm:text-3xl">
                  {formatPrice(product.price)}
                </span>
              </div>
              {quantity > 1 && (
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gold-400/10">
                  <span className="text-dark-400 text-sm">الإجمالي ({quantity} قطع)</span>
                  <span className="text-white font-bold text-lg">
                    {formatPrice(product.price * quantity)}
                  </span>
                </div>
              )}
            </div>

            {/* اختيار الكمية */}
            {product.available && (
              <div className="flex items-center gap-4">
                <span className="text-dark-300 text-sm font-medium">الكمية:</span>
                <div className="flex items-center glass rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 text-gold-400 hover:bg-white/5 transition-colors"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="px-5 py-3 text-white font-bold text-lg min-w-[50px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                    className="px-4 py-3 text-gold-400 hover:bg-white/5 transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <span className="text-dark-400 text-xs">
                  (المتوفر: {product.quantity})
                </span>
              </div>
            )}

            {/* أزرار الإجراء */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {product.available && (
                <button
                  onClick={() => setShowOrderForm(true)}
                  className="btn-gold flex-1 flex items-center justify-center gap-2 text-base py-3.5"
                >
                  <ShoppingBag size={20} />
                  تأكيد الطلب
                </button>
              )}
              <button
                onClick={() => sendWhatsApp(whatsappMessage)}
                className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-base py-3.5 transition-colors"
              >
                <MessageCircle size={20} />
                استفسار واتساب
              </button>
            </div>

            {/* معلومات إضافية */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="glass rounded-xl p-3 text-center">
                <Package size={20} className="text-gold-400 mx-auto mb-1" />
                <span className="text-dark-300 text-xs">توصيل لجميع المحافظات</span>
              </div>
              <div className="glass rounded-xl p-3 text-center">
                <Star size={20} className="text-gold-400 mx-auto mb-1" />
                <span className="text-dark-300 text-xs">منتجات أصلية مضمونة</span>
              </div>
            </div>

            {/* زر المشاركة */}
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: product.name,
                    text: product.description,
                  });
                }
              }}
              className="flex items-center gap-2 text-dark-400 hover:text-gold-400 transition-colors text-sm"
            >
              <Share2 size={16} />
              مشاركة المنتج
            </button>
          </motion.div>
        </div>

        {/* منتجات مشابهة */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 sm:mt-16">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
              منتجات <span className="gold-gradient-text">مشابهة</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {relatedProducts.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass rounded-xl overflow-hidden cursor-pointer group product-card"
                  onClick={() => {
                    navigateTo('product-detail', { productId: p.id });
                    setQuantity(1);
                    setSelectedImage(0);
                  }}
                >
                  <div className="aspect-square bg-dark-700 overflow-hidden">
                    {p.mainImage ? (
                      <img src={p.mainImage} alt={p.name} className="w-full h-full object-cover product-image" loading="lazy" />
                    ) : (
                      <div className="w-full h-full img-placeholder text-3xl">
                        {categoryInfo?.icon || '📦'}
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="text-white font-bold text-sm truncate group-hover:text-gold-400 transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-gold-400 font-bold text-sm mt-1">
                      {formatPrice(p.price)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* نموذج الطلب */}
      {showOrderForm && product.available && (
        <OrderForm
          product={product}
          quantity={quantity}
          onClose={() => setShowOrderForm(false)}
        />
      )}
    </div>
  );
}
