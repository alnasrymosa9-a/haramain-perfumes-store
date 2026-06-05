/**
 * ===== صفحة تواصل معنا =====
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, MessageCircle, Clock, Send, Loader2, Check } from 'lucide-react';
import { useApp } from '../context';

export function ContactPage() {
  const { sendWhatsApp } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSend = () => {
    if (!name.trim() || !message.trim()) return;
    setIsSending(true);
    const whatsappMsg = `📩 *رسالة جديدة من الموقع*\n\n👤 الاسم: ${name}\n📱 الهاتف: ${phone || 'غير محدد'}\n\n💬 الرسالة:\n${message}`;
    
    setTimeout(() => {
      sendWhatsApp(whatsappMsg);
      setIsSending(false);
      setIsSent(true);
      setTimeout(() => {
        setIsSent(false);
        setName('');
        setPhone('');
        setMessage('');
      }, 3000);
    }, 800);
  };

  return (
    <div className="min-h-screen py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* رأس الصفحة */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
            تواصل <span className="gold-gradient-text">معنا</span>
          </h1>
          <p className="text-dark-300 text-sm sm:text-base">
            نحن سعداء بتواصلكم معنا. لا تتردد في الاتصال بنا
          </p>
          <div className="gold-line w-24 mx-auto mt-4" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* معلومات التواصل */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="glass rounded-2xl p-6">
              <h3 className="text-gold-400 font-bold text-lg mb-5">معلومات التواصل</h3>
              
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gold-400/10 flex items-center justify-center shrink-0">
                    <MapPin size={20} className="text-gold-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm mb-1">العنوان</h4>
                    <p className="text-dark-300 text-sm">اليمن - عدن - الشيخ عثمان - شارع دجلة</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gold-400/10 flex items-center justify-center shrink-0">
                    <Phone size={20} className="text-gold-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm mb-1">الهاتف</h4>
                    <p className="text-dark-300 text-sm" dir="ltr">+967 774 726 404</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gold-400/10 flex items-center justify-center shrink-0">
                    <MessageCircle size={20} className="text-gold-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm mb-1">واتساب</h4>
                    <p className="text-dark-300 text-sm">متاح 24 ساعة</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gold-400/10 flex items-center justify-center shrink-0">
                    <Clock size={20} className="text-gold-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm mb-1">ساعات العمل</h4>
                    <p className="text-dark-300 text-sm">السبت - الخميس: 9 صباحاً - 10 مساءً</p>
                    <p className="text-dark-400 text-xs">الجمعة: 4 عصراً - 10 مساءً</p>
                  </div>
                </div>
              </div>
            </div>

            {/* خريطة مبسطة */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-gold-400 font-bold text-lg mb-3">موقعنا</h3>
              <div className="bg-dark-700 rounded-xl aspect-video flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={40} className="text-gold-400 mx-auto mb-2" />
                  <p className="text-dark-300 text-sm">عدن - الشيخ عثمان - شارع دجلة</p>
                  <button
                    onClick={() => window.open('https://maps.google.com/?q=عدن+الشيخ+عثمان+شارع+دجلة', '_blank')}
                    className="text-gold-400 text-sm mt-2 hover:underline"
                  >
                    فتح في خرائط Google
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* نموذج الرسالة */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="glass rounded-2xl p-6">
              <h3 className="text-gold-400 font-bold text-lg mb-5">أرسل رسالة</h3>

              {isSent ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check size={32} className="text-green-400" />
                  </div>
                  <h4 className="text-white font-bold text-lg mb-2">تم فتح الواتساب!</h4>
                  <p className="text-dark-300 text-sm">أرسل الرسالة وسيتم الرد عليك قريباً</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-white text-sm font-medium block mb-1.5">الاسم *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="الاسم الكامل"
                      className="w-full bg-dark-900 border border-gold-400/10 rounded-xl px-4 py-3 text-white placeholder-dark-400 focus:border-gold-400/30 focus:outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-white text-sm font-medium block mb-1.5">رقم الهاتف</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="رقم الهاتف"
                      dir="ltr"
                      className="w-full bg-dark-900 border border-gold-400/10 rounded-xl px-4 py-3 text-white placeholder-dark-400 focus:border-gold-400/30 focus:outline-none text-sm text-left"
                    />
                  </div>

                  <div>
                    <label className="text-white text-sm font-medium block mb-1.5">الرسالة *</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="اكتب رسالتك هنا..."
                      rows={5}
                      className="w-full bg-dark-900 border border-gold-400/10 rounded-xl px-4 py-3 text-white placeholder-dark-400 focus:border-gold-400/30 focus:outline-none text-sm resize-none"
                    />
                  </div>

                  <button
                    onClick={handleSend}
                    disabled={isSending || !name.trim() || !message.trim()}
                    className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSending ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        جارٍ الإرسال...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        إرسال عبر الواتساب
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
