# 🚀 دليل التشغيل السريع - CELIA FASHION DESIGN

هذا الدليل يساعدك على تشغيل المشروع بالكامل على جهازك المحلي.

---

## 📋 المتطلبات الأساسية

قبل البدء، تأكد من تثبيت:
- **Node.js** (v16 أو أحدث)
- **Python** (v3.8 أو أحدث)
- **MongoDB Atlas** (حساب مجاني)
- **OpenAI API Key** (اختياري للميزات الذكية)

---

## ⚙️ الإعداد الأولي

### 1️⃣ استنساخ المشروع

```bash
git clone https://github.com/your-username/celia-fashion-store.git
cd celia-fashion-store
```

### 2️⃣ إعداد Backend (Node.js)

```bash
cd backend
npm install
cp .env.example .env
```

افتح ملف `.env` وأضف:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/EcommerceDB
PORT=5001
FRONTEND_URL=http://localhost:3006
```

**تشغيل Backend:**
```bash
node server.js
```
✅ السيرفر سيعمل على: `http://localhost:5001`

---

### 3️⃣ إعداد ML Backend (Python)

```bash
cd ../ml-backend
pip install -r requirements.txt
cp .env.example .env
```

افتح ملف `.env` وأضف:
```
OPENAI_API_KEY=sk-your-key-here
DATABASE_URL=sqlite:///./enhanced_store.db
FRONTEND_URL=http://localhost:3006
```

**تشغيل ML Backend:**
```bash
python app.py
```
✅ السيرفر سيعمل على: `http://localhost:8000`

---

### 4️⃣ إعداد Frontend (React)

```bash
cd ../frontend
npm install
cp .env.example .env
```

افتح ملف `.env` وأضف:
```
REACT_APP_API_BASE_URL=http://localhost:5001
REACT_APP_ML_BACKEND_URL=http://localhost:8000
```

**تشغيل Frontend:**
```bash
npm start
```
✅ التطبيق سيعمل على: `http://localhost:3000` أو `http://localhost:3006`

---

## 🎯 الوصول للتطبيق

افتح المتصفح على:
```
http://localhost:3000
```

**ميزات متاحة:**
- 🛍️ تصفح المنتجات
- 🤖 المساعد الذكي (Chatbot)
- ❤️ قائمة المفضلات
- 🛒 سلة التسوق
- 📊 مدونة AI
- 📏 دليل المقاسات الذكي

---

## 🐛 حل المشاكل الشائعة

### مشكلة: CORS Error
**الحل:** تأكد من تطابق `FRONTEND_URL` في ملفات `.env` للـ backends

### مشكلة: MongoDB Connection Failed
**الحل:** تحقق من صحة `MONGO_URI` في `backend/.env`

### مشكلة: AI Features لا تعمل
**الحل:** تحقق من صحة `OPENAI_API_KEY` أو استخدم النظام بدون OpenAI (سيعمل على Mock Data)

---

## 📝 ملاحظات هامة

1. **المنفذ 3006:** إذا كان منفذ 3000 مشغولاً، سيستخدم React منفذ آخر تلقائياً
2. **منافذ Backend:** 
   - Node.js Backend: `5001`
   - Python ML Backend: `8000`
3. **حذف المنتجات:** يمكن حذف منتجات MongoDB فقط، منتجات DummyJSON محمية

---

## 🚀 النشر على Vercel + Render

راجع ملف `DEPLOYMENT_GUIDE.md` للتفاصيل الكاملة.

---

**طوّره:** سيد العزامي ديزاين  
**للدعم:** 01126212452 | sayedelazameydesign@gmail.com
