/**
 * ===== نموذج الطلب =====
 * يسمح للعميل بتقديم طلب مع رفع سند التحويل
 * يحسب العربون تلقائياً (20%)
 */

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  Phone,
  MapPin,
  Upload,
  Check,
  CreditCard,
  Send,
  Loader2,
} from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context';
import { YEMEN_LOCATIONS, DELIVERY_FEES, PAYMENT_INFO } from '../data';

interface OrderFormProps {
  product: Product;
  quantity: number;
  onClose: () => void;
}

export function OrderForm({ product, quantity, onClose }: OrderFormProps) {
  const { addOrder, uploadImage, sendWhatsApp } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // حالة النموذج
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [governorate, setGovernorate] = useState('');
  const [district, setDistrict] = useState('');
  const [address, setAddress] = useState('');
  const [transferNumber, setTransferNumber] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  // حسابات مالية
  const totalPrice = product.price * quantity;
  const deposit = Math.round(totalPrice * 0.2);
  const deliveryFee = DELIVERY_FEES[governorate] || DELIVERY_FEES.default;
  const totalWithDelivery = totalPrice + deliveryFee;

  // المدن حسب المحافظة
  const districts = governorate ? YEMEN_LOCATIONS[governorate] || [] : [];

  // معالجة رفع الصورة
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      setReceiptPreview(URL.createObjectURL(file));
    }
  };

  // التحقق من صحة البيانات
  const validate = (): boolean => {
    if (!customerName.trim()) { setError('يرجى إدخال الاسم الكامل'); return false; }
    if (!phone.trim() || phone.length < 9) { setError('يرجى إدخال رقم هاتف صحيح'); return false; }
    if (!governorate) { setError('يرجى اختيار المحافظة'); return false; }
    if (!district) { setError('يرجى اختيار المديرية'); return false; }
    if (!address.trim()) { setError('يرجى إدخال العنوان بالتفصيل'); return false; }
    return true;
  };

  // إرسال الطلب
  const handleSubmit = async () => {
    setError('');
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      // رفع صورة السند
      let receiptUrl = '';
      if (receiptFile) {
        receiptUrl = await uploadImage(receiptFile, 'receipts', `${Date.now()}_${receiptFile.name}`);
      }

      // إنشاء الطلب
      const order = await addOrder({
        customerName: customerName.trim(),
        phone: phone.trim(),
        governorate,
        district,
        address: address.trim(),
        items: [{
          productId: product.id,
          productName: product.name,
          productImage: product.mainImage,
          quantity,
          unitPrice: product.price,
          subtotal: product.price * quantity,
        }],
        totalPrice: totalWithDelivery,
        deposit,
        transferReceipt: receiptUrl,
        transferNumber: transferNumber.trim(),
      });

      // إنشاء رسالة الواتساب
      const message = `🛍️ *طلب جديد من موقع الحرمين للعود والعطور*\n\n` +
        `👤 *الاسم:* ${customerName}\n` +
        `📱 *الهاتف:* ${phone}\n` +
        `📍 *المحافظة:* ${governorate}\n` +
        `🏘️ *المديرية:* ${district}\n` +
        `📝 *العنوان:* ${address}\n\n` +
        `📦 *تفاصيل الطلب:*\n` +
        `▪️ المنتج: ${product.name}\n` +
        `▪️ الكمية: ${quantity}\n` +
        `▪️ السعر الكلي: ${totalPrice.toLocaleString('ar-YE')} ر.ي\n` +
        `▪️ التوصيل: ${deliveryFee.toLocaleString('ar-YE')} ر.ي\n` +
        `▪️ الإجمالي: ${totalWithDelivery.toLocaleString('ar-YE')} ر.ي\n` +
        `▪️ العربون (20%): ${deposit.toLocaleString('ar-YE')} ر.ي\n` +
        `${transferNumber ? `▪️ رقم الحوالة: ${transferNumber}\n` : ''}` +
        `${receiptUrl ? `🧾 سند التحويل: ${receiptUrl}\n` : ''}` +
        `\n🆔 رقم الطلب: ${order.id}`;

      sendWhatsApp(message);
      setIsSuccess(true);
    } catch (err) {
      setError('حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] modal-overlay flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-dark-800 border border-gold-400/20 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* رأس النموذج */}
          <div className="sticky top-0 bg-dark-800/95 backdrop-blur-sm border-b border-gold-400/10 p-4 sm:p-6 flex items-center justify-between z-10">
            <h2 className="text-gold-400 font-bold text-lg sm:text-xl flex items-center gap-2">
              <Send size={22} />
              تأكيد الطلب
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl text-dark-300 hover:text-white transition-all">
              <X size={20} />
            </button>
          </div>

          {isSuccess ? (
            /* رسالة النجاح */
            <div className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Check size={40} className="text-green-400" />
              </motion.div>
              <h3 className="text-white text-2xl font-bold mb-3">تم إرسال طلبك بنجاح!</h3>
              <p className="text-dark-300 mb-6">
                سيتم التواصل معك عبر الواتساب لتأكيد الطلب. شكراً لثقتكم بنا.
              </p>
              <button onClick={onClose} className="btn-gold">
                إغلاق
              </button>
            </div>
          ) : (
            <div className="p-4 sm:p-6 space-y-5">
              {/* ملخص المنتج */}
              <div className="glass rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-lg bg-dark-700 shrink-0 overflow-hidden">
                    {product.mainImage ? (
                      <img src={product.mainImage} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full img-placeholder text-2xl">📦</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-bold">{product.name}</h4>
                    <p className="text-gold-400 font-bold">{product.price.toLocaleString('ar-YE')} ر.ي × {quantity}</p>
                  </div>
                </div>
              </div>

              {/* حسابات مالية */}
              <div className="glass rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-dark-300">السعر الكلي</span>
                  <span className="text-white">{totalPrice.toLocaleString('ar-YE')} ر.ي</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-dark-300">رسوم التوصيل ({governorate || 'المحافظة'})</span>
                  <span className="text-white">{deliveryFee.toLocaleString('ar-YE')} ر.ي</span>
                </div>
                <div className="border-t border-gold-400/10 pt-2 flex justify-between">
                  <span className="text-white font-bold">الإجمالي</span>
                  <span className="text-gold-400 font-bold text-lg">{totalWithDelivery.toLocaleString('ar-YE')} ر.ي</span>
                </div>
                <div className="flex justify-between text-sm bg-gold-400/10 rounded-lg p-2">
                  <span className="text-gold-300 font-medium">العربون المطلوب (20%)</span>
                  <span className="text-gold-400 font-bold">{deposit.toLocaleString('ar-YE')} ر.ي</span>
                </div>
              </div>

              {/* معلومات الحساب */}
              <div className="glass rounded-xl p-4">
                <h4 className="text-gold-400 font-bold text-sm flex items-center gap-2 mb-3">
                  <CreditCard size={16} />
                  معلومات الدفع - حساب الكريمي
                </h4>
                <div className="bg-dark-900 rounded-lg p-3 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-300">اسم الحساب</span>
                    <span className="text-white font-medium">{PAYMENT_INFO.kareemiName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-300">رقم الحساب</span>
                    <span className="text-gold-400 font-bold" dir="ltr">{PAYMENT_INFO.kareemiNumber}</span>
                  </div>
                </div>
              </div>

              {/* بيانات العميل */}
              <div className="space-y-3">
                <h4 className="text-white font-bold text-sm">بيانات العميل</h4>

                {/* الاسم */}
                <div className="relative">
                  <User size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gold-400" />
                  <input
                    type="text"
                    placeholder="الاسم الكامل"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-dark-900 border border-gold-400/10 rounded-xl pr-10 pl-4 py-3 text-white placeholder-dark-400 focus:border-gold-400/40 focus:outline-none transition-colors text-sm"
                  />
                </div>

                {/* الهاتف */}
                <div className="relative">
                  <Phone size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gold-400" />
                  <input
                    type="tel"
                    placeholder="رقم الهاتف"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    dir="ltr"
                    className="w-full bg-dark-900 border border-gold-400/10 rounded-xl pr-10 pl-4 py-3 text-white placeholder-dark-400 focus:border-gold-400/40 focus:outline-none transition-colors text-sm text-left"
                  />
                </div>

                {/* المحافظة */}
                <select
                  value={governorate}
                  onChange={(e) => {
                    setGovernorate(e.target.value);
                    setDistrict('');
                  }}
                  className="w-full bg-dark-900 border border-gold-400/10 rounded-xl px-4 py-3 text-white focus:border-gold-400/40 focus:outline-none transition-colors text-sm appearance-none"
                >
                  <option value="">اختر المحافظة</option>
                  {Object.keys(YEMEN_LOCATIONS).map((gov) => (
                    <option key={gov} value={gov}>{gov}</option>
                  ))}
                </select>

                {/* المديرية */}
                {districts.length > 0 && (
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-dark-900 border border-gold-400/10 rounded-xl px-4 py-3 text-white focus:border-gold-400/40 focus:outline-none transition-colors text-sm appearance-none"
                  >
                    <option value="">اختر المديرية</option>
                    {districts.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                )}

                {/* العنوان */}
                <div className="relative">
                  <MapPin size={18} className="absolute right-3 top-3 text-gold-400" />
                  <textarea
                    placeholder="العنوان بالتفصيل"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={2}
                    className="w-full bg-dark-900 border border-gold-400/10 rounded-xl pr-10 pl-4 py-3 text-white placeholder-dark-400 focus:border-gold-400/40 focus:outline-none transition-colors text-sm resize-none"
                  />
                </div>
              </div>

              {/* معلومات التحويل */}
              <div className="space-y-3">
                <h4 className="text-white font-bold text-sm">معلومات التحويل (اختياري)</h4>
                
                <input
                  type="text"
                  placeholder="رقم الحوالة / رقم العملية"
                  value={transferNumber}
                  onChange={(e) => setTransferNumber(e.target.value)}
                  className="w-full bg-dark-900 border border-gold-400/10 rounded-xl px-4 py-3 text-white placeholder-dark-400 focus:border-gold-400/40 focus:outline-none transition-colors text-sm"
                />

                {/* رفع صورة السند */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gold-400/20 rounded-xl p-4 text-center cursor-pointer hover:border-gold-400/40 transition-colors"
                >
                  {receiptPreview ? (
                    <div className="space-y-2">
                      <img src={receiptPreview} alt="سند التحويل" className="max-h-32 mx-auto rounded-lg" />
                      <p className="text-gold-400 text-xs">اضغط لتغيير الصورة</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload size={32} className="text-gold-400 mx-auto" />
                      <p className="text-dark-300 text-sm">اضغط لرفع صورة سند التحويل</p>
                      <p className="text-dark-400 text-xs">JPG, PNG - حد أقصى 5MB</p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* رسالة خطأ */}
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm text-center"
                >
                  {error}
                </motion.div>
              )}

              {/* أزرار الإجراء */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="btn-gold-outline flex-1"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="btn-gold flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      جارٍ الإرسال...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      تأكيد الطلب
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
