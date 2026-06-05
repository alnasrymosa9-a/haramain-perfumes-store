/**
 * ===== الصفحة الرئيسية =====
 */

import { motion } from 'framer-motion';
import { ArrowLeft, Star, MessageCircle, Sparkles, Loader2 } from 'lucide-react';
import { useApp } from '../context';
import { HeroSection } from '../components/HeroSection';
import { ProductCard } from '../components/ProductCard';
import { CATEGORIES } from '../types';

export function HomePage() {
  const { products, navigateTo, sendWhatsApp, loading } = useApp();
  const featuredProducts = products.filter((p) => p.featured && p.available).slice(0, 6);

  return (
    <div>
      <HeroSection />

      {/* ===== قسم الأقسام الرئيسية ===== */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-14"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-3">
              أقسامنا <span className="gold-gradient-text">الفاخرة</span>
            </h2>
            <p className="text-dark-300 text-sm sm:text-base max-w-lg mx-auto">
              اكتشف تشكيلتنا الواسعة من أرقى المنتجات
            </p>
            <div className="gold-line w-24 mx-auto mt-4" />
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {CATEGORIES.map((cat, index) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => navigateTo('products', { category: cat.id })}
                className="glass rounded-2xl p-5 sm:p-6 text-center cursor-pointer group hover:border-gold-400/30 transition-all duration-300"
              >
                <div className="text-4xl sm:text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {cat.icon}
                </div>
                <h3 className="text-white font-bold text-sm sm:text-base mb-1 group-hover:text-gold-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-dark-400 text-xs hidden sm:block">
                  {cat.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== المنتجات المميزة ===== */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-dark-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-14"
          >
            <div className="inline-flex items-center gap-2 text-gold-400 text-sm mb-2">
              <Star size={16} fill="currentColor" />
              <span>مختارة بعناية</span>
              <Star size={16} fill="currentColor" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-3">
              منتجات <span className="gold-gradient-text">مميزة</span>
            </h2>
            <div className="gold-line w-24 mx-auto mt-4" />
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={40} className="text-gold-400 animate-spin" />
            </div>
          ) : featuredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {featuredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
              <div className="text-center mt-8 sm:mt-10">
                <button
                  onClick={() => navigateTo('products')}
                  className="btn-gold-outline inline-flex items-center gap-2"
                >
                  <span>عرض جميع المنتجات</span>
                  <ArrowLeft size={18} />
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <div className="text-4xl mb-3">✨</div>
              <p className="text-dark-300">لا توجد منتجات مميزة حالياً</p>
              <button
                onClick={() => navigateTo('products')}
                className="btn-gold-outline mt-4 inline-flex items-center gap-2"
              >
                <span>استعرض جميع المنتجات</span>
                <ArrowLeft size={18} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ===== قسم لماذا نحن ===== */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-14"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-3">
              لماذا <span className="gold-gradient-text">الحرمين؟</span>
            </h2>
            <div className="gold-line w-24 mx-auto mt-4" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: '🏆', title: 'جودة عالية', desc: 'منتجات أصلية ومضمونة 100%' },
              { icon: '💰', title: 'أسعار منافسة', desc: 'أفضل الأسعار في السوق اليمني' },
              { icon: '🚚', title: 'توصيل سريع', desc: 'توصيل لجميع المحافظات اليمنية' },
              { icon: '🤝', title: 'خدمة متميزة', desc: 'دعم فني على مدار الساعة' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl p-6 text-center group hover:border-gold-400/30 transition-all"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-dark-300 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== دعوة للتواصل ===== */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-b from-dark-900/50 to-transparent">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-strong rounded-3xl p-8 sm:p-12"
          >
            <Sparkles size={40} className="text-gold-400 mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">
              تواصل معنا الآن
            </h2>
            <p className="text-dark-300 mb-6 text-sm sm:text-base">
              نحن هنا لمساعدتك في اختيار أفضل المنتجات. تواصل معنا عبر الواتساب
              وسنرد عليك في أسرع وقت ممكن.
            </p>
            <button
              onClick={() => sendWhatsApp('السلام عليكم، أريد الاستفسار عن المنتجات')}
              className="btn-gold inline-flex items-center gap-2 text-base sm:text-lg"
            >
              <MessageCircle size={22} />
              <span>تواصل عبر الواتساب</span>
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
