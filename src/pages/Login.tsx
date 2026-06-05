/**
 * ===== صفحة تسجيل الدخول - الحرمين للعود والعطور =====
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Loader2, Shield, AlertCircle } from 'lucide-react';
import { useApp } from '../context';

export function LoginPage() {
  const { login, navigateTo } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }
    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        navigateTo('admin-dashboard');
      } else {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      }
    } catch {
      setError('حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        {/* الشعار */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 rounded-full border-4 border-gold-400/60 bg-gradient-to-br from-gold-300 to-gold-600 flex items-center justify-center text-white font-black text-4xl mx-auto mb-5 shadow-2xl shadow-gold-400/20">
            ح
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">
            دخول <span className="gold-gradient-text">الإدارة</span>
          </h1>
          <p className="text-amber-100/40 text-sm">لوحة تحكم الحرمين للعود والعطور</p>
        </div>

        {/* نموذج الدخول */}
        <div className="glass-strong rounded-2xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-white text-sm font-medium block mb-2">البريد الإلكتروني</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@haramain.com" dir="ltr"
                className="w-full bg-stone-950 border border-gold-400/10 rounded-xl px-4 py-3 text-white placeholder-stone-600 focus:border-gold-400/40 focus:outline-none text-sm text-left" />
            </div>
            <div>
              <label className="text-white text-sm font-medium block mb-2">كلمة المرور</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" dir="ltr"
                className="w-full bg-stone-950 border border-gold-400/10 rounded-xl px-4 py-3 text-white placeholder-stone-600 focus:border-gold-400/40 focus:outline-none text-sm text-left" />
            </div>
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}
            <button type="submit" disabled={isLoading}
              className="btn-gold w-full flex items-center justify-center gap-2 py-3.5 disabled:opacity-50">
              {isLoading ? (
                <><Loader2 size={18} className="animate-spin" />جارٍ تسجيل الدخول...</>
              ) : (
                <><LogIn size={18} />تسجيل الدخول</>
              )}
            </button>
          </form>

          <div className="mt-5 bg-stone-950 rounded-xl p-3 flex items-start gap-2">
            <Shield size={16} className="text-gold-400 mt-0.5 shrink-0" />
            <div className="text-xs text-amber-100/30">
              <p className="font-medium text-amber-100/50 mb-1">بيانات الدخول التجريبية:</p>
              <p dir="ltr">admin@haramain.com / admin123</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <button onClick={() => navigateTo('home')} className="text-amber-100/40 hover:text-gold-400 transition-colors text-sm">
            العودة إلى الصفحة الرئيسية
          </button>
        </div>
      </motion.div>
    </div>
  );
}
