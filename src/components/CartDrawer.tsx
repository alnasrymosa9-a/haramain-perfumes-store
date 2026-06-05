/**
 * ===== درج السلة =====
 */

import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { useApp } from '../context';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, removeFromCart, updateCartQuantity, cartTotal, cartCount, navigateTo } = useApp();

  const handleCheckout = () => {
    onClose();
    // إذا كان في السلة منتج واحد، اذهب لصفحة تفاصيله مباشرة
    if (cart.length === 1) {
      navigateTo('product-detail', { product: cart[0].product, fromCart: true });
    } else {
      // صفحة طلب موحد - نفتح نموذج الطلب
      navigateTo('product-detail', { cartCheckout: true, cart });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* خلفية معتمة */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          {/* الدرج */}
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm bg-stone-950 border-l border-gold-400/20 z-50 flex flex-col shadow-2xl"
          >
            {/* رأس الدرج */}
            <div className="flex items-center justify-between p-5 border-b border-gold-400/10">
              <div className="flex items-center gap-3">
                <ShoppingCart size={20} className="text-gold-400" />
                <h2 className="text-white font-bold text-lg">السلة</h2>
                {cartCount > 0 && (
                  <span className="bg-gold-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </div>
              <button onClick={onClose} className="p-2 text-amber-100/50 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                <X size={20} />
              </button>
            </div>

            {/* محتوى السلة */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <div className="w-20 h-20 rounded-full bg-gold-400/10 flex items-center justify-center">
                    <ShoppingCart size={32} className="text-gold-400/50" />
                  </div>
                  <p className="text-amber-100/50">السلة فارغة</p>
                  <button onClick={onClose} className="text-gold-400 text-sm hover:underline">
                    تصفح المنتجات
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.product.id} className="flex gap-3 p-3 rounded-xl bg-white/5 border border-gold-400/10">
                    {/* صورة المنتج */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-amber-900/30 to-stone-800 shrink-0 flex items-center justify-center">
                      {item.product.mainImage ? (
                        <img src={item.product.mainImage} alt={item.product.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl">🧴</span>
                      )}
                    </div>
                    {/* معلومات المنتج */}
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{item.product.name}</p>
                      <p className="text-gold-400 text-sm font-bold mt-1">
                        {(item.product.price * item.quantity).toLocaleString()} ر.ي
                      </p>
                      {/* التحكم في الكمية */}
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all">
                          <Minus size={12} />
                        </button>
                        <span className="text-white text-sm font-bold w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all">
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                    {/* زر الحذف */}
                    <button onClick={() => removeFromCart(item.product.id)}
                      className="p-1 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all self-start">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* تذييل السلة */}
            {cart.length > 0 && (
              <div className="p-4 border-t border-gold-400/10 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-amber-100/60 text-sm">الإجمالي:</span>
                  <span className="text-gold-400 font-black text-lg">{cartTotal.toLocaleString()} ر.ي</span>
                </div>
                <button onClick={handleCheckout}
                  className="btn-gold w-full flex items-center justify-center gap-2 py-3">
                  <ArrowLeft size={18} />
                  إتمام الطلب
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
