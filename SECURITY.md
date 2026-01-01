# 🔒 دليل الأمان - CELIA FASHION DESIGN

هذا الدليل يوضح الإجراءات الأمنية المطبقة في المشروع وأفضل الممارسات.

---

## ✅ الإجراءات الأمنية المطبقة

### 1. **حماية متغيرات البيئة (.env)**
- ✅ جميع ملفات `.env` محمية بـ `.gitignore`
- ✅ تم إنشاء `.env.example` لكل مجلد كنموذج آمن
- ✅ لا يتم رفع أي مفاتيح API أو بيانات حساسة على GitHub

**ما يجب فعله:**
- احتفظ بـ API keys في ملفات `.env` فقط
- لا تشارك ملفات `.env` مع أي شخص
- استخدم Secrets Management في Production (مثل Vercel Environment Variables)

---

### 2. **CORS (Cross-Origin Resource Sharing)**

**Backend (Node.js):**
```javascript
// تحديد المصادر المسموح لها بالوصول فقط
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3006',
  process.env.FRONTEND_URL
];
```

**ML Backend (Python):**
```python
allowed_origins = [
    "http://localhost:3000",
    "http://localhost:3006",
    os.getenv("FRONTEND_URL")
]
```

✅ **لماذا؟** لمنع الطلبات من مواقع غير موثوقة

---

### 3. **التحقق من البيانات (Data Validation)**

تم إضافة validation في:
- ✅ Add Product endpoint
- ✅ Delete Product endpoint

**مثال:**
```javascript
if (!name || !price || !category) {
  return res.status(400).json({ error: "Required fields missing" });
}

if (name.trim().length < 3) {
  return res.status(400).json({ error: "Name too short" });
}
```

✅ **لماذا؟** لمنع SQL Injection وبيانات غير صحيحة

---

### 4. **حماية MongoDB**

- ✅ استخدام MongoDB Atlas مع IP Whitelist
- ✅ استخدام Connection String مشفر
- ✅ التحقق من ObjectId قبل العمليات

**نصائح:**
- استخدم Strong Password لحساب MongoDB
- فعّل Network Access Control في MongoDB Atlas
- استخدم Read/Write Roles المخصصة

---

### 5. **معالجة الأخطاء**

جميع endpoints تحتوي على:
```javascript
try {
  // code
} catch (err) {
  console.error('Error:', err.message);
  res.status(500).json({ error: "Action failed" });
}
```

✅ **لماذا؟** لمنع تسريب معلومات حساسة في رسائل الأخطاء

---

## ⚠️ إجراءات إضافية موصى بها

### للإنتاج (Production):

1. **Rate Limiting**
   - استخدم `express-rate-limit` لمنع Brute Force Attacks
   ```bash
   npm install express-rate-limit
   ```

2. **Helmet.js**
   - حماية من XSS و Clickjacking
   ```bash
   npm install helmet
   ```

3. **HTTPS فقط**
   - استخدم SSL Certificates في Production
   - فعّل HTTPS Redirect

4. **Authentication & Authorization**
   - فعّل Auth0 أو JWT
   - أضف Role-Based Access Control (RBAC)

5. **Database Backups**
   - جدولة نسخ احتياطية دورية لـ MongoDB
   - استخدم MongoDB Atlas Automated Backups

6. **Logging & Monitoring**
   - استخدم Winston أو Morgan للـ logging
   - راقب الطلبات المشبوهة

---

## 🔐 نصائح للمطورين

1. **لا تستخدم hardcoded secrets في الكود**
2. **راجع dependencies بانتظام:**
   ```bash
   npm audit
   pip list --outdated
   ```
3. **استخدم Strong Passwords لجميع الحسابات**
4. **فعّل Two-Factor Authentication (2FA) على GitHub**
5. **لا ترفع ملفات `.env` على GitHub أبداً**

---

## 📞 الإبلاغ عن ثغرات أمنية

إذا اكتشفت ثغرة أمنية، يرجى التواصل فوراً:
- **البريد الإلكتروني:** sayedelazameydesign@gmail.com
- **الهاتف:** 01126212452

**لا تنشر الثغرات علناً قبل إصلاحها!**

---

**آخر تحديث:** 2026-01-01  
**المسؤول عن الأمان:** Sayed El-Azamey Design
