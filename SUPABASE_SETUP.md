# دليل إعداد Supabase 🗄️

## 1. إنشاء حساب Supabase

1. اذهب إلى [https://supabase.com](https://supabase.com)
2. اضغط **Start your project** وسجّل بحسابك
3. اضغط **New Project**

---

## 2. إنشاء مشروع جديد

- **Name:** haramain-perfumes
- **Database Password:** اختر كلمة مرور قوية (احتفظ بها)
- **Region:** اختر أقرب منطقة (Europe West موصى به)

---

## 3. الحصول على مفاتيح API

بعد إنشاء المشروع:
1. اذهب إلى **Settings → API**
2. انسخ **Project URL** → `VITE_SUPABASE_URL`
3. انسخ **anon / public** key → `VITE_SUPABASE_ANON_KEY`

ضعهما في ملف `.env`:
```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

---

## 4. إنشاء جداول قاعدة البيانات

اذهب إلى **SQL Editor** وشغّل هذا الكود:

```sql
-- جدول المنتجات
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  quantity INTEGER NOT NULL DEFAULT 0,
  main_image TEXT DEFAULT '',
  images JSONB DEFAULT '[]',
  available BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول الطلبات
CREATE TABLE orders (
  id TEXT PRIMARY KEY DEFAULT ('ORD-' || extract(epoch from now())::text),
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  governorate TEXT,
  district TEXT,
  address TEXT,
  items JSONB DEFAULT '[]',
  total_price NUMERIC NOT NULL DEFAULT 0,
  deposit NUMERIC DEFAULT 0,
  transfer_receipt TEXT DEFAULT '',
  transfer_number TEXT DEFAULT '',
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول الإعدادات
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول الفئات
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  description TEXT,
  sort_order INTEGER DEFAULT 0
);

-- جدول الإشعارات
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  body TEXT,
  type TEXT DEFAULT 'info',
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 5. إنشاء Buckets للتخزين

اذهب إلى **Storage → Buckets** وأنشئ:

| Bucket | Public |
|--------|--------|
| `products` | ✅ عام |
| `receipts` | ❌ خاص |
| `logos` | ✅ عام |
| `banners` | ✅ عام |
| `offers` | ✅ عام |

---

## 6. إعداد RLS (Row Level Security)

في **SQL Editor**:

```sql
-- تفعيل RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- السماح للجميع بقراءة المنتجات
CREATE POLICY "products_public_read" ON products
  FOR SELECT USING (true);

-- السماح للمسؤولين فقط بالتعديل
CREATE POLICY "products_admin_write" ON products
  FOR ALL USING (auth.role() = 'authenticated');

-- السماح للجميع بإنشاء طلبات
CREATE POLICY "orders_public_insert" ON orders
  FOR INSERT WITH CHECK (true);

-- السماح للمسؤولين بقراءة وتعديل الطلبات
CREATE POLICY "orders_admin_access" ON orders
  FOR ALL USING (auth.role() = 'authenticated');

-- صلاحيات Storage
CREATE POLICY "public_bucket_read" ON storage.objects
  FOR SELECT USING (bucket_id IN ('products', 'logos', 'banners', 'offers'));

CREATE POLICY "auth_bucket_write" ON storage.objects
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

---

## 7. تفعيل Authentication

1. اذهب إلى **Authentication → Settings**
2. فعّل **Email Provider**
3. أنشئ مستخدم المسؤول:
   - اذهب إلى **Authentication → Users**
   - اضغط **Add User**
   - Email: `adnankhaledaldby@gmail.com`
   - Password: كلمة مرور قوية

---

## 8. اختبار الاتصال

في المشروع، افتح المتصفح وتحقق من:
- Console لا يظهر أخطاء Supabase
- المنتجات تظهر في الصفحة الرئيسية
- تسجيل الدخول يعمل

---

## ✅ قائمة التحقق

- [ ] حساب Supabase مُنشأ
- [ ] مشروع جديد
- [ ] مفاتيح API في `.env`
- [ ] جداول قاعدة البيانات مُنشأة
- [ ] Buckets مُنشأة
- [ ] RLS مُفعّل
- [ ] مستخدم المسؤول مُنشأ
- [ ] اختبار تسجيل الدخول ✓
- [ ] اختبار رفع الصور ✓
- [ ] اختبار إضافة منتج ✓
- [ ] اختبار إرسال طلب ✓
