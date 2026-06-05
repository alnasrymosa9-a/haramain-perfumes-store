/**
 * ===== صفحة العروض الخاصة =====
 * تعرض المنتجات في قسم العروض بتصميم جذاب
 */

import { motion } from 'framer-motion';
import { Gift, Clock, Flame } from 'lucide-react';
import { useApp } from '../context';
import { ProductCard } from '../components/ProductCard';

export function OffersPage() {
  const { products } = useApp();
  const offerProducts = products.filter((p) => p.category === 'offers' && p.available);

  return (
    <div className="min-h-screen py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* رأس الصفحة */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 sm:mb-14"
        >
          <div className="inline-flex items-center gap-2 text-gold-400 text-sm mb-3">
            <Flame size={16} />
            <span>عروض لفترة محدودة</span>
            <Flame size={16} />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3">
            العروض <span className="gold-gradient-text">الخاصة</span>
          </h1>
          <p className="text-dark-300 text-sm sm:text-base max-w-lg mx-auto">
            استفد من عروضنا الحصرية وتخفيضاتنا المميزة. عروض لفترة محدودة لا تفوتك!
          </p>
          <div className="gold-line w-24 mx-auto mt-4" />
        </motion.div>

        {/* شريط العد التنازلي (وهمي للتصميم) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-strong rounded-2xl p-4 sm:p-6 mb-8 sm:mb-10 max-w-2xl mx-auto"
        >
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-gold-400" />
              <span className="text-white font-bold text-sm">العرض ينتهي قريباً!</span>
            </div>
            <div className="flex gap-2" dir="ltr">
              {[
                { value: '03', label: 'أيام' },
                { value: '12', label: 'ساعة' },
                { value: '45', label: 'دقيقة' },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="bg-dark-900 rounded-lg w-12 h-12 flex items-center justify-center text-gold-400 font-bold text-lg">
                    {item.value}
                  </div>
                  <span className="text-dark-400 text-[10px]">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* منتجات العروض */}
        {offerProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {offerProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Gift size={60} className="text-dark-500 mx-auto mb-4" />
            <h3 className="text-white text-xl font-bold mb-2">لا توجد عروض حالياً</h3>
            <p className="text-dark-400 text-sm">
              تابعونا قريباً لعروض وتخفيضات مميزة!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
