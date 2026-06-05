/**
 * ===== بطاقة المنتج =====
 */

import { motion } from 'framer-motion';
import { ShoppingCart, Star, Package, Eye } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { navigateTo, addToCart } = useApp();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="product-card glass rounded-2xl overflow-hidden cursor-pointer group"
      onClick={() => navigateTo('product-detail', { product })}
    >
      {/* صورة المنتج */}
      <div className="relative overflow-hidden h-48 sm:h-56 bg-gradient-to-br from-amber-900/20 to-stone-800/40">
        {product.mainImage ? (
          <img
            src={product.mainImage}
            alt={product.name}
            className="w-full h-full object-cover product-image"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl opacity-30">
              {product.category === 'perfumes' ? '🧴' :
               product.category === 'oud' ? '🪵' :
               product.category === 'incense' ? '🔥' :
               product.category === 'beauty' ? '💄' : '🎁'}
            </span>
          </div>
        )}

        {/* شارات */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          {product.featured && (
            <span className="flex items-center gap-1 bg-gold-500/90 text-white text-xs font-bold px-2 py-1 rounded-lg">
              <Star size={10} fill="white" />
              مميز
            </span>
          )}
          {!product.available && (
            <span className="bg-red-500/90 text-white text-xs font-bold px-2 py-1 rounded-lg">
              نفد
            </span>
          )}
        </div>

        {/* زر السلة عند التحويم */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button
            onClick={handleAddToCart}
            disabled={!product.available}
            className="flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-white px-4 py-2 rounded-xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            <ShoppingCart size={16} />
            أضف للسلة
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); navigateTo('product-detail', { product }); }}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl font-medium text-sm transition-all"
          >
            <Eye size={16} />
            عرض
          </button>
        </div>
      </div>

      {/* معلومات المنتج */}
      <div className="p-4">
        <h3 className="text-white font-bold text-sm sm:text-base line-clamp-2 mb-1 group-hover:text-gold-300 transition-colors">
          {product.name}
        </h3>
        <p className="text-amber-100/40 text-xs line-clamp-2 mb-3">{product.description}</p>

        <div className="flex items-center justify-between">
          <span className="text-gold-400 font-black text-base sm:text-lg">
            {product.price.toLocaleString()}<span className="text-xs font-normal text-amber-100/40 mr-1">ر.ي</span>
          </span>
          <div className="flex items-center gap-1 text-amber-100/40 text-xs">
            <Package size={12} />
            <span>{product.quantity}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
