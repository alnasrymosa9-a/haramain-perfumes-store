# دليل النشر على Vercel 🚀

## المتطلبات

- حساب [Vercel](https://vercel.com) (مجاني)
- حساب [GitHub](https://github.com)
- مشروع Supabase جاهز

---

## الخطوات

### 1. رفع المشروع على GitHub

```bash
git init
git add .
git commit -m "Initial commit - الحرمين للعود والعطور"
git remote add origin https://github.com/USERNAME/haramain-perfumes.git
git push -u origin main
```

### 2. ربط Vercel بـ GitHub

1. اذهب إلى [vercel.com](https://vercel.com)
2. سجّل الدخول بحسابك
3. اضغط **New Project**
4. اختر Repository من GitHub
5. اضغط **Import**

### 3. إعداد متغيرات البيئة في Vercel

في صفحة المشروع → **Settings → Environment Variables**:

| Key | Value |
|-----|-------|
| `VITE_SUPABASE_URL` | `https://xxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOi...` |

### 4. نشر المشروع

اضغط **Deploy** - سيتم البناء والنشر تلقائياً.

---

## إعدادات Build

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

---

## النطاق المخصص (اختياري)

في **Settings → Domains**:
- أضف نطاقك الخاص مثل: `haramain.com`
- اتبع تعليمات DNS

---

## تحديثات تلقائية

كل مرة تدفع تغييرات إلى GitHub، سيُحدَّث الموقع تلقائياً على Vercel.

```bash
git add .
git commit -m "تحديث المحتوى"
git push
```
