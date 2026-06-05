# دليل إعداد PWA 📱

## ما هو PWA؟

تطبيق ويب تقدمي (Progressive Web App) يسمح لمستخدمي الهاتف بتثبيت الموقع كتطبيق مستقل.

## المميزات المُفعَّلة

- ✅ تثبيت على الشاشة الرئيسية
- ✅ فتح كتطبيق مستقل (بدون شريط المتصفح)
- ✅ دعم Offline للصفحات المحملة
- ✅ Splash Screen عند الفتح
- ✅ إشعار تثبيت احترافي
- ✅ اختصارات التطبيق

## إضافة أيقونات

أنشئ هذه الأحجام وضعها في `/public/icons/`:
- `icon-192.png` (192×192)
- `icon-512.png` (512×512)

**أداة مجانية لإنشاء الأيقونات:**  
[https://favicon.io](https://favicon.io) أو [https://maskable.app](https://maskable.app)

## اختبار PWA

في Chrome DevTools → Lighthouse → Generate report  
تحقق من قسم Progressive Web App.

## إشعار التثبيت

يظهر تلقائياً عند:
1. فتح الموقع من المتصفح
2. دعم الجهاز لـ `beforeinstallprompt`
3. مرور 3 ثوانٍ على فتح الصفحة
