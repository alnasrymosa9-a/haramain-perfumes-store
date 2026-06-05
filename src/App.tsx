/**
 * ===== التطبيق الرئيسي - الحرمين للعود والعطور =====
 */

import { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppProvider, useApp } from './context';
import { Layout } from './components/Layout';
import { HomePage } from './pages/Home';
import { ProductsPage } from './pages/Products';
import { ProductDetailPage } from './pages/ProductDetail';
import { ContactPage } from './pages/Contact';
import { LoginPage } from './pages/Login';
import { OffersPage } from './pages/Offers';
import { AdminPanel } from './admin/AdminPanel';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const pageTransition = { type: 'tween', ease: 'easeInOut', duration: 0.3 } as const;

function PageRouter() {
  const { currentPage, isAdmin } = useApp();

  if (currentPage.startsWith('admin')) {
    if (!isAdmin) {
      return (
        <Layout>
          <motion.div key="login" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
            <LoginPage />
          </motion.div>
        </Layout>
      );
    }
    return <AdminPanel />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage />;
      case 'products': return <ProductsPage />;
      case 'product-detail': return <ProductDetailPage />;
      case 'contact': return <ContactPage />;
      case 'login': return <LoginPage />;
      case 'offers': return <OffersPage />;
      default: return <HomePage />;
    }
  };

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <motion.div key={currentPage} variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
          {renderPage()}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen luxury-bg flex items-center justify-center">
      <div className="text-center">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gold-400/60 mx-auto mb-4 bg-white shadow-lg shadow-gold-400/20 flex items-center justify-center">
          <img
            src="/logo.png"
            alt="الحرمين"
            className="w-full h-full object-contain p-1"
            onError={(e) => {
              const t = e.currentTarget;
              t.style.display = 'none';
              const p = t.parentElement;
              if (p) p.innerHTML = '<span class="text-gold-600 font-black text-3xl">ح</span>';
            }}
          />
        </div>
        <div className="gold-shimmer text-gold-400 font-bold text-lg animate-pulse">
          الحرمين للعود والعطور
        </div>
        <p className="text-amber-100/30 text-sm mt-2">جاري التحميل...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <AppProvider>
        <PageRouter />
        <PWAInstallPrompt />
      </AppProvider>
    </Suspense>
  );
}
