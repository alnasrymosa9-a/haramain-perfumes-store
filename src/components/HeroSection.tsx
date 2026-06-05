/**
 * ===== مكون القسم الرئيسي (Hero) =====
 * القسم العلوي الفاخر من الصفحة الرئيسية
 */

import { motion } from 'framer-motion';
import { ArrowLeft, MessageCircle, Sparkles } from 'lucide-react';
import { useApp } from '../context';

export function HeroSection() {
  const { navigateTo, sendWhatsApp } = useApp();

  return (
    <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center overflow-hidden">
      {/* خلفية متحركة */}
      <div className="absolute inset-0">
        {/* تدرج أساسي فاخر */}
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-[#0f0f23] to-dark-900" />
        
        {/* تأثيرات ضوئية ذهبية */}
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-gold-400/[0.07] rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-gold-600/[0.05] rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gold-400/[0.03] rounded-full blur-[150px]" />
        
        {/* نمط هندسي */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* المحتوى */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="text-center max-w-4xl mx-auto">

          {/* شعار المتجر */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="flex justify-center mb-6 sm:mb-8"
          >
            <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full bg-white shadow-2xl shadow-gold-400/30 border-4 border-gold-400/40 overflow-hidden flex items-center justify-center">
              <img
                src="/logo.png"
                alt="الحرمين للعود والعطور"
                className="w-full h-full object-contain p-2"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = '<span class="text-gold-600 font-black text-5xl">ح</span>';
                  }
                }}
              />
            </div>
          </motion.div>

          {/* شارة */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 glass rounded-full px-5 py-2 mb-6 sm:mb-8"
          >
            <Sparkles size={16} className="text-gold-400" />
            <span className="text-gold-400 text-sm font-medium">
              منذ عام 1970م · Since 1970
            </span>
            <Sparkles size={16} className="text-gold-400" />
          </motion.div>

          {/* العنوان الرئيسي */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6 leading-tight font-amiri"
          >
            <span className="text-white">عالم </span>
            <span className="gold-gradient-text">الفخامة</span>
            <br />
            <span className="text-white">للعطور والعود</span>
          </motion.h1>

          {/* الوصف */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-dark-200 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed"
          >
            اكتشف أرقى وأجود أنواع العطور العربية والعود الكمبودي والهندي
            ومستلزمات البخور الفاخرة. جودة استثنائية وأسعار تنافسية في قلب عدن.
          </motion.p>

          {/* الأزرار */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => navigateTo('products')}
              className="btn-gold flex items-center gap-2 text-base sm:text-lg px-8 py-3.5 w-full sm:w-auto justify-center"
            >
              <span>استعرض المنتجات</span>
              <ArrowLeft size={20} />
            </button>

            <button
              onClick={() => sendWhatsApp('السلام عليكم، أريد الاستفسار عن المنتجات')}
              className="btn-gold-outline flex items-center gap-2 text-base sm:text-lg px-8 py-3.5 w-full sm:w-auto justify-center"
            >
              <MessageCircle size={20} />
              <span>تواصل واتساب</span>
            </button>
          </motion.div>

          {/* إحصائيات سريعة */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-12 sm:mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-lg mx-auto"
          >
            {[
              { value: '+100', label: 'منتج متنوع' },
              { value: '+50', label: 'عميل سعيد' },
              { value: '5', label: 'أقسام' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-gold-400 font-black text-2xl sm:text-3xl mb-1">
                  {stat.value}
                </div>
                <div className="text-dark-300 text-xs sm:text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* عنصر زخرفي سفلي */}
      <div className="absolute bottom-0 left-0 right-0 h-px gold-line" />
    </section>
  );
}
