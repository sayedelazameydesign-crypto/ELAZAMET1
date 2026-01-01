# 🚀 دليل النشر المجاني - Vercel + Koyeb

**ملاحظة هامة:** هذا الدليل للنشر المجاني 100% بدون الحاجة لبطاقة بنكية!

---

## 📋 الخطة

| الخدمة | المنصة | السبب |
|--------|--------|-------|
| Frontend (React) | **Vercel** | مجاني، سريع، بدون بطاقة |
| Backend (Node.js) | **Koyeb** | مجاني، بدون بطاقة، يدعم Docker |
| ML Backend (Python) | **Koyeb** | مجاني، بدون بطاقة، يدعم Python |

---

## 📦 المتطلبات الأساسية

- ✅ حساب GitHub (المشروع مرفوع عليه بالفعل)
- ✅ حساب MongoDB Atlas (مجاني)
- ✅ OpenAI API Key (اختياري - للميزات الذكية)

---

## 🎯 المرحلة 1: نشر Frontend على Vercel

### الخطوة 1: التسجيل في Vercel

1. اذهب إلى: https://vercel.com/signup
2. اختر **Continue with GitHub**
3. سجل دخول بحساب GitHub الخاص بك
4. ✅ **لا يطلب بطاقة بنكية!**

### الخطوة 2: استيراد المشروع

1. في لوحة Vercel، اضغط **Add New Project**
2. اختر المستودع: `ELAZAMET1`
3. في **Root Directory**:
   - اضغط **Edit**
   - اختر **`frontend`**
4. في **Framework Preset**: اختر **Create React App**

### الخطوة 3: إعدادات Build

Vercel سيكتشف الإعدادات تلقائياً من `vercel.json`:
- **Build Command:** `npm run build`
- **Output Directory:** `build`
- **Install Command:** `npm install`

### الخطوة 4: متغيرات البيئة (مؤقتاً)

في **Environment Variables**، أضف:
```
REACT_APP_API_BASE_URL=https://temp-placeholder.com
REACT_APP_ML_BACKEND_URL=https://temp-placeholder.com
```
⚠️ **سنحدثها بعد نشر الـ Backends**

### الخطوة 5: نشر!

1. اضغط **Deploy**
2. انتظر 2-3 دقائق
3. ستحصل على رابط مثل: `https://elazamet1.vercel.app`

✅ **احفظ هذا الرابط!**

---

## 🎯 المرحلة 2: نشر Node.js Backend على Koyeb

### الخطوة 1: التسجيل في Koyeb

1. اذهب إلى: https://app.koyeb.com/auth/signup
2. اختر **GitHub** للتسجيل
3. أكمل التسجيل
4. ✅ **لا يطلب بطاقة بنكية! - يعطيك $5 مجاناً شهرياً**

### الخطوة 2: إنشاء Web Service جديد

1. في لوحة Koyeb، اضغط **Create App**
2. اختر **GitHub** كمصدر
3. اربط حساب GitHub وامنح الصلاحيات للمستودع `ELAZAMET1`
4. اختر المستودع: `sayedelazameydesign-crypto/ELAZAMET1`

### الخطوة 3: إعدادات Node.js Backend

#### Build Settings:
- **Name:** `celia-node-backend`
- **Branch:** `main`
- **Source Directory:** `backend`
- **Builder:** `Dockerfile` (اختياري) أو `Buildpack`

#### إذا اخترت Buildpack:
- Koyeb سيكتشف Node.js تلقائياً
- Build command: `npm install`
- Start command: `node server.js`

#### Port:
- Port: `8000` (Koyeb يستخدم 8000 افتراضياً ويعيد التوجيه)

#### Environment Variables:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/EcommerceDB
FRONTEND_URL=https://elazamet1.vercel.app
PORT=8000
```

### الخطوة 4: نشر!

1. اضغط **Deploy**
2. انتظر 3-5 دقائق
3. ستحصل على رابط مثل: `https://celia-node-backend-your-app.koyeb.app`

✅ **احفظ هذا الرابط!**

---

## 🎯 المرحلة 3: نشر Python ML Backend على Koyeb

### الخطوة 1: إنشاء Web Service ثاني

1. في لوحة Koyeb، اضغط **Create App** مرة أخرى
2. اختر نفس المستودع: `ELAZAMET1`

### الخطوة 2: إعدادات Python Backend

#### Build Settings:
- **Name:** `celia-ml-backend`
- **Branch:** `main`
- **Source Directory:** `ml-backend`
- **Builder:** `Buildpack`

#### Commands:
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn app:app --host 0.0.0.0 --port 8000`

#### Port:
- Port: `8000`

#### Environment Variables:
```
OPENAI_API_KEY=sk-your-key-here
FRONTEND_URL=https://elazamet1.vercel.app
DATABASE_URL=sqlite:///./enhanced_store.db
```

### الخطوة 3: نشر!

1. اضغط **Deploy**
2. انتظر 3-5 دقائق
3. ستحصل على رابط مثل: `https://celia-ml-backend-your-app.koyeb.app`

✅ **احفظ هذا الرابط!**

---

## 🔗 المرحلة 4: ربط الخدمات ببعضها

### الخطوة 1: تحديث Frontend على Vercel

1. ارجع لـ Vercel Dashboard
2. اذهب إلى مشروعك → **Settings** → **Environment Variables**
3. عدّل المتغيرات:

```
REACT_APP_API_BASE_URL=https://celia-node-backend-your-app.koyeb.app
REACT_APP_ML_BACKEND_URL=https://celia-ml-backend-your-app.koyeb.app
```

4. اضغط **Save**
5. اذهب إلى **Deployments** → اضغط **Redeploy** على آخر نشر

### الخطوة 2: تحديث Backends على Koyeb

#### لـ Node.js Backend:
1. اذهب إلى App → **Settings** → **Environment**
2. تأكد أن `FRONTEND_URL` يشير إلى رابط Vercel الصحيح
3. اضغط **Redeploy** إذا لزم الأمر

#### لـ ML Backend:
1. اذهب إلى App → **Settings** → **Environment**
2. تأكد أن `FRONTEND_URL` يشير إلى رابط Vercel الصحيح
3. اضغط **Redeploy** إذا لزم الأمر

---

## ✅ المرحلة 5: التحقق من التشغيل

### اختبار Frontend:
1. افتح رابط Vercel: `https://elazamet1.vercel.app`
2. يجب أن ترى الصفحة الرئيسية

### اختبار Node.js Backend:
1. افتح: `https://celia-node-backend-your-app.koyeb.app`
2. يجب أن ترى: `✅ API is Running`

### اختبار ML Backend:
1. افتح: `https://celia-ml-backend-your-app.koyeb.app/docs`
2. يجب أن ترى صفحة FastAPI Documentation

### اختبار التكامل:
1. في الموقع، حاول:
   - تصفح المنتجات ✅
   - فتح Chatbot (يطلب من ML Backend) ✅
   - إضافة منتج للسلة ✅

---

## 🐛 حل المشاكل الشائعة

### مشكلة: Backend يعطي خطأ CORS
**الحل:**
1. تأكد أن `FRONTEND_URL` في Koyeb صحيح
2. تأكد أنه بدون `/` في النهاية
3. Redeploy Backend

### مشكلة: MongoDB Connection Failed
**الحل:**
1. في MongoDB Atlas → Network Access
2. أضف `0.0.0.0/0` للسماح لجميع IPs
3. تأكد من صحة `MONGO_URI`

### مشكلة: Koyeb يقول "Build Failed"
**الحل:**
1. تأكد من `Source Directory` صحيح
2. تحقق من أن `package.json` أو `requirements.txt` موجود
3. راجع Logs في Koyeb

### مشكلة: Frontend لا يتصل بـ Backend
**الحل:**
1. تأكد من Environment Variables في Vercel صحيحة
2. افتح Console في المتصفح وشاهد الأخطاء
3. Redeploy Frontend

---

## 💰 التكاليف (كلها مجانية!)

| الخدمة | المنصة | الحد المجاني |
|--------|--------|--------------|
| Frontend | Vercel | **غير محدود** للمشاريع الشخصية |
| Node Backend | Koyeb | **$5/شهر** رصيد مجاني (كافي لـ 1 app) |
| Python Backend | Koyeb | **$5/شهر** رصيد مجاني (كافي لـ 1 app) |
| MongoDB | Atlas | **512 MB** مجاني للأبد |

⚠️ **ملاحظة:** رصيد Koyeb المجاني ($5) يكفي لتشغيل تطبيق واحد. لتشغيل اثنين، قد تحتاج دمجهما أو البحث عن بديل ثانٍ.

---

## 🎯 بدائل إضافية (كلها مجانية بدون بطاقة)

### للـ Backends:
- **Railway** (كان مجاني، الآن يطلب بطاقة لكن لا يخصم)
- **Fly.io** (مجاني جزئياً)
- **Cyclic.sh** (مجاني للـ Node.js)

### إذا وجدت صعوبة في Koyeb:
جرّب **Render** - يعطيك 750 ساعة مجانية شهرياً بدون بطاقة.

---

## 📊 ملخص الروابط

بعد الانتهاء، سيكون لديك:

```
Frontend:  https://elazamet1.vercel.app
Node API:  https://celia-node-backend.koyeb.app
ML API:    https://celia-ml-backend.koyeb.app
```

---

## 🎉 مبروك!

**متجرك الآن حي على الإنترنت، مجاناً 100%، بدون بطاقة بنكية!** 🚀

---

## 📞 الدعم

إذا واجهت أي مشكلة:
- **WhatsApp:** 01126212452
- **Email:** sayedelazameydesign@gmail.com

---

**آخر تحديث:** 2026-01-01  
**بواسطة:** Antigravity AI Assistant
