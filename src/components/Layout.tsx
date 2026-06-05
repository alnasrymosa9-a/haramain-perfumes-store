/**
 * ===== مكون التخطيط الرئيسي =====
 * الحرمين للعود والعطور
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, MessageCircle, Phone, MapPin, Gift, Home,
  Package, PhoneCall, LogIn, LogOut, Settings, ShoppingCart, Mail,
} from 'lucide-react';
import { useApp } from '../context';
import { CATEGORIES } from '../types';
import { STORE_INFO } from '../data';
import { CartDrawer } from './CartDrawer';

export function Navbar() {
  const { currentPage, navigateTo, isAdmin, logout, cartCount } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home' as const, label: 'الرئيسية', icon: Home },
    { id: 'products' as const, label: 'المنتجات', icon: Package },
    { id: 'offers' as const, label: 'العروض', icon: Gift },
    { id: 'contact' as const, label: 'تواصل معنا', icon: PhoneCall },
  ];

  return (
    <>
      <nav className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 ${
        isScrolled ? 'glass-dark shadow-lg shadow-black/30' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* الشعار */}
            <button onClick={() => navigateTo('home')} className="flex items-center gap-2 sm:gap-3 group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-gold-400/60 shadow-lg shadow-gold-400/20 group-hover:shadow-gold-400/40 transition-all bg-white flex items-center justify-center shrink-0">
                <img
                  src="/logo.png"
                  alt="الحرمين"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = '<span class="text-gold-600 font-black text-xl">ح</span>';
                    }
                  }}
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-gold-400 font-black text-base leading-tight">الحرمين</h1>
                <p className="text-amber-200/60 text-xs">للعود والعطور</p>
              </div>
            </button>

            {/* قائمة التنقل - سطح المكتب */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button key={item.id} onClick={() => navigateTo(item.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 text-sm font-medium ${
                      isActive ? 'bg-gold-400/15 text-gold-400' : 'text-amber-100/70 hover:text-gold-400 hover:bg-gold-400/5'
                    }`}>
                    <Icon size={16} />
                    {item.label}
                  </button>
                );
              })}
              {isAdmin ? (
                <div className="flex items-center gap-1 mr-2">
                  <button onClick={() => navigateTo('admin-dashboard')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all text-sm font-medium ${
                      currentPage.startsWith('admin') ? 'bg-gold-400/15 text-gold-400' : 'text-amber-100/70 hover:text-gold-400 hover:bg-gold-400/5'
                    }`}>
                    <Settings size={16} />
                    لوحة التحكم
                  </button>
                  <button onClick={logout} className="flex items-center gap-2 px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-all text-sm">
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <button onClick={() => navigateTo('login')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all text-sm font-medium ${
                    currentPage === 'login' ? 'bg-gold-400/15 text-gold-400' : 'text-amber-100/70 hover:text-gold-400 hover:bg-gold-400/5'
                  }`}>
                  <LogIn size={16} />
                  دخول
                </button>
              )}
            </div>

            {/* أيقونة السلة */}
            <button onClick={() => setCartOpen(true)} className="relative p-2 text-gold-400 hover:bg-gold-400/10 rounded-xl transition-all ml-2">
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            {/* زر القائمة - الجوال */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-gold-400 hover:bg-gold-400/10 rounded-xl transition-all">
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* القائمة المنسدلة - الجوال */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }} className="md:hidden glass-dark border-t border-gold-400/10 overflow-hidden">
              <div className="px-4 py-4 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <button key={item.id} onClick={() => { navigateTo(item.id); setIsMenuOpen(false); }}
                      className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all text-right ${
                        isActive ? 'bg-gold-400/15 text-gold-400' : 'text-amber-100/70 hover:text-gold-400 hover:bg-gold-400/5'
                      }`}>
                      <Icon size={18} />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
                <div className="border-t border-gold-400/10 my-2" />
                {isAdmin ? (
                  <>
                    <button onClick={() => { navigateTo('admin-dashboard'); setIsMenuOpen(false); }}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-amber-100/70 hover:text-gold-400 hover:bg-gold-400/5 transition-all">
                      <Settings size={18} /><span className="font-medium">لوحة التحكم</span>
                    </button>
                    <button onClick={() => { logout(); setIsMenuOpen(false); }}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all">
                      <LogOut size={18} /><span className="font-medium">تسجيل الخروج</span>
                    </button>
                  </>
                ) : (
                  <button onClick={() => { navigateTo('login'); setIsMenuOpen(false); }}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-amber-100/70 hover:text-gold-400 hover:bg-gold-400/5 transition-all">
                    <LogIn size={18} /><span className="font-medium">تسجيل الدخول</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

export function Footer() {
  const { navigateTo } = useApp();

  return (
    <footer className="bg-stone-950/90 border-t border-gold-400/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* معلومات المحل */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gold-400/50 shadow-md bg-white flex items-center justify-center shrink-0">
                <img
                  src="/logo.png"
                  alt="الحرمين"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = '<span class="text-gold-600 font-black text-2xl">ح</span>';
                    }
                  }}
                />
              </div>
              <div>
                <h3 className="text-gold-400 font-black text-lg">الحرمين</h3>
                <p className="text-amber-100/50 text-xs">للعود والعطور ومستلزمات البخور</p>
              </div>
            </div>
            <p className="text-amber-100/50 text-sm leading-relaxed">
              نقدم لكم أرقى وأجود أنواع العطور والعود ومستلزمات البخور في اليمن.
              جودة لا مثيل لها وأسعار تنافسية.
            </p>
          </div>

          {/* روابط سريعة */}
          <div>
            <h4 className="text-gold-400 font-bold mb-4">روابط سريعة</h4>
            <div className="space-y-2">
              {CATEGORIES.map((cat) => (
                <button key={cat.id} onClick={() => navigateTo('products', { category: cat.id })}
                  className="block text-amber-100/50 hover:text-gold-400 transition-colors text-sm">
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* تواصل معنا */}
          <div>
            <h4 className="text-gold-400 font-bold mb-4">تواصل معنا</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-amber-100/50 text-sm">
                <MapPin size={16} className="text-gold-400 mt-0.5 shrink-0" />
                <span>{STORE_INFO.address}</span>
              </div>
              <a href={`tel:${STORE_INFO.whatsapp}`} className="flex items-center gap-2 text-amber-100/50 hover:text-gold-400 text-sm transition-colors">
                <Phone size={16} className="text-gold-400 shrink-0" />
                <span dir="ltr">{STORE_INFO.whatsapp}</span>
              </a>
              <a href={`mailto:${STORE_INFO.email}`} className="flex items-center gap-2 text-amber-100/50 hover:text-gold-400 text-sm transition-colors">
                <Mail size={16} className="text-gold-400 shrink-0" />
                <span>{STORE_INFO.email}</span>
              </a>
              <div className="flex items-center gap-2 text-amber-100/50 text-sm">
                <MessageCircle size={16} className="text-gold-400 shrink-0" />
                <span>واتساب متاح 24/7</span>
              </div>
            </div>
          </div>
        </div>

        {/* حقوق النشر */}
        <div className="border-t border-gold-400/10 mt-8 pt-6">
          <p className="text-amber-100/30 text-sm text-center">
            © {new Date().getFullYear()} {STORE_INFO.name} - جميع الحقوق محفوظة
          </p>
          <p className="text-amber-100/20 text-xs text-center mt-2">
            تم التطوير بواسطة{' '}
            <a
              href="https://wa.me/967770909668"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold-400/60 transition-colors cursor-pointer"
            >
              {STORE_INFO.developer} · {STORE_INFO.developerPhone}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export function WhatsAppFloat() {
  const { sendWhatsApp } = useApp();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => sendWhatsApp('السلام عليكم، أريد الاستفسار عن المنتجات')}
      className="fixed bottom-6 left-6 z-50 w-14 h-14 sm:w-16 sm:h-16 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 animate-pulse-gold transition-colors"
      title="تواصل عبر الواتساب">
      <MessageCircle size={28} className="text-white" />
    </motion.button>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen luxury-bg font-cairo">
      <Navbar />
      <main className="pt-16 sm:pt-20">{children}</main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
