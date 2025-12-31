
# 🚀 دليل نشر متجر CELIA FASHION DESIGN

هذا الدليل يشرح كيفية نشر المشروع كاملاً (Frontend + Backend + AI) مجاناً.

## 1️⃣ الخطوة الأولى: Vercel (للواجهة الأمامية)
1. سجل الدخول في [Vercel](https://vercel.com) بحساب GitHub.
2. اضغط **Add New Project**.
3. استورد المستودع `ELAZAMET1`.
4. في خانة **Root Directory**، اضغط Edit واختر مجلد `frontend`.
5. اضغط **Deploy**.
6. انسخ رابط الموقع الناتج (مثلاً `https://elazamet1.vercel.app`).

## 2️⃣ الخطوة الثانية: Render (للسيرفرات الخلفية)
سجل في [Render](https://render.com) بحساب GitHub.

### أ. سيرفر المنتجات (Node.js)
1. أنشئ **New Web Service**.
2. اربط المستودع، وفي الإعدادات:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Environment Variables:** أضف `MONGO_URI`.
3. انسخ رابط السيرفر (مثلاً `https://celia-node.onrender.com`).

### ب. سيرفر الذكاء الاصطناعي (Python)
1. أنشئ **New Web Service**.
2. اربط المستودع، وفي الإعدادات:
   - **Root Directory:** `ml-backend`
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command (Production):** `gunicorn -w 4 -k uvicorn.workers.UvicornWorker app:app`
   - *(Option 2 - Simple):* `uvicorn app:app --host 0.0.0.0 --port 10000`
   - **Environment Variables:** أضف `OPENAI_API_KEY`.
3. انسخ رابط السيرفر (مثلاً `https://celia-ai.onrender.com`).

## 3️⃣ الخطوة الثالثة: الربط
1. ارجع إلى Vercel > Settings > Environment Variables.
2. أضف المتغيرات التالية بروابط Render التي نسختها:
   - `REACT_APP_API_BASE_URL` -> رابط سيرفر المنتجات.
   - `REACT_APP_ML_BACKEND_URL` -> رابط سيرفر الذكاء الاصطناعي.
3. قم بعمل **Redeploy** في Vercel.

🎉 مبروك! متجرك يعمل الآن 100%.
