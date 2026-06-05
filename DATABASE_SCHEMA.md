# مخطط قاعدة البيانات 📊

## جداول Supabase

### products
| العمود | النوع | الوصف |
|--------|-------|-------|
| id | UUID | المعرف الفريد |
| name | TEXT | اسم المنتج |
| category | TEXT | الفئة (perfumes/oud/incense/beauty/offers) |
| description | TEXT | الوصف |
| price | NUMERIC | السعر بالريال اليمني |
| quantity | INTEGER | الكمية المتوفرة |
| main_image | TEXT | رابط الصورة الرئيسية |
| images | JSONB | قائمة صور إضافية |
| available | BOOLEAN | متوفر/غير متوفر |
| featured | BOOLEAN | مميز/عادي |
| created_at | TIMESTAMPTZ | تاريخ الإضافة |

### orders
| العمود | النوع | الوصف |
|--------|-------|-------|
| id | TEXT | رقم الطلب (ORD-xxx) |
| customer_name | TEXT | اسم العميل |
| phone | TEXT | رقم الهاتف |
| governorate | TEXT | المحافظة |
| district | TEXT | المديرية |
| address | TEXT | العنوان التفصيلي |
| items | JSONB | بنود الطلب |
| total_price | NUMERIC | المجموع الكلي |
| deposit | NUMERIC | مبلغ العربون |
| transfer_receipt | TEXT | رابط صورة سند التحويل |
| transfer_number | TEXT | رقم عملية التحويل |
| status | TEXT | حالة الطلب |
| created_at | TIMESTAMPTZ | تاريخ الطلب |
| updated_at | TIMESTAMPTZ | تاريخ آخر تحديث |

### حالات الطلب (status)
- `new` - طلب جديد
- `deposit_review` - تم مراجعة العربون
- `preparing` - جاري التجهيز
- `delivered` - تم التسليم
- `cancelled` - تم الإلغاء

## Supabase Storage Buckets

| Bucket | نوع | الاستخدام |
|--------|-----|-----------|
| products | عام | صور المنتجات |
| receipts | خاص | سندات التحويل |
| logos | عام | الشعار |
| banners | عام | البانرات |
| offers | عام | صور العروض |
