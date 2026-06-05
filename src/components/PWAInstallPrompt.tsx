/**
 * ===== إشعار تثبيت PWA =====
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // لا تعرض مرة أخرى إذا تم رفضه
    const wasDismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (wasDismissed) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShowPrompt(true), 5000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
      setDismissed(true);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    try {
      localStorage.setItem('pwa-prompt-dismissed', '1');
    } catch {}
  };

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-24 right-4 left-4 sm:right-6 sm:left-auto sm:max-w-sm z-50"
        >
          <div className="glass-strong rounded-2xl p-4 border border-gold-400/30 shadow-2xl shadow-black/50">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white border border-gold-400/30 flex items-center justify-center shrink-0 shadow-lg">
                <img
                  src="/logo.png"
                  alt="الحرمين"
                  className="w-full h-full object-contain p-0.5"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const p = e.currentTarget.parentElement;
                    if (p) p.innerHTML = '<span class="text-gold-600 font-black text-xl">ح</span>';
                  }}
                />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-bold text-sm mb-1">
                  تثبيت تطبيق الحرمين
                </h4>
                <p className="text-amber-100/50 text-xs mb-3">
                  ثبّت التطبيق على شاشتك الرئيسية للوصول السريع
                </p>
                <div className="flex gap-2">
                  <button onClick={handleInstall}
                    className="flex items-center gap-1.5 bg-gold-500 hover:bg-gold-400 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all">
                    <Download size={14} />
                    تثبيت الآن
                  </button>
                  <button onClick={handleDismiss}
                    className="px-4 py-2 text-amber-100/50 hover:text-white text-sm rounded-xl hover:bg-white/5 transition-all">
                    لاحقاً
                  </button>
                </div>
              </div>
              <button onClick={handleDismiss}
                className="p-1 text-amber-100/30 hover:text-white transition-colors shrink-0">
                <X size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
