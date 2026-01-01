# ⚡ دليل النشر السريع - 5 دقائق

## 🎯 الخطة المختصرة

1. **Vercel** → Frontend (React)
2. **Koyeb** → Node.js Backend
3. **Koyeb** → Python ML Backend

---

## 📋 قائمة التحقق

### قبل البدء:
- [ ] المشروع مرفوع على GitHub ✅
- [ ] حساب MongoDB Atlas جاهز
- [ ] OpenAI API Key (اختياري)

---

## 🚀 الخطوات

### 1️⃣ Frontend (Vercel)

```bash
1. https://vercel.com/signup → Continue with GitHub
2. Import Project → ELAZAMET1
3. Root Directory → frontend
4. Environment Variables:
   REACT_APP_API_BASE_URL=https://temp.com
   REACT_APP_ML_BACKEND_URL=https://temp.com
5. Deploy → احفظ الرابط
```

### 2️⃣ Node Backend (Koyeb)

```bash
1. https://app.koyeb.com/auth/signup → GitHub
2. Create App → GitHub → ELAZAMET1
3. Settings:
   - Name: celia-node-backend
   - Source Directory: backend
   - Start: node server.js
   - Port: 8000
4. Environment:
   MONGO_URI=mongodb+srv://...
   FRONTEND_URL=https://elazamet1.vercel.app
   PORT=8000
5. Deploy → احفظ الرابط
```

### 3️⃣ ML Backend (Koyeb)

```bash
1. Create App → GitHub → ELAZAMET1
2. Settings:
   - Name: celia-ml-backend
   - Source Directory: ml-backend
   - Start: uvicorn app:app --host 0.0.0.0 --port 8000
   - Port: 8000
3. Environment:
   OPENAI_API_KEY=sk-...
   FRONTEND_URL=https://elazamet1.vercel.app
4. Deploy → احفظ الرابط
```

### 4️⃣ الربط

```bash
1. Vercel → Settings → Environment Variables
   - REACT_APP_API_BASE_URL → رابط Koyeb Node
   - REACT_APP_ML_BACKEND_URL → رابط Koyeb ML
2. Redeploy في Vercel
```

---

## ✅ التحقق

- Frontend: `https://elazamet1.vercel.app`
- Node API: `https://celia-node-backend.koyeb.app`
- ML API: `https://celia-ml-backend.koyeb.app/docs`

---

## 🔑 Commands المهمة

### Vercel:
- Build: `npm run build`
- Output: `build`

### Node Backend:
- Build: `npm install`
- Start: `node server.js`

### ML Backend:
- Build: `pip install -r requirements.txt`
- Start: `uvicorn app:app --host 0.0.0.0 --port 8000`

---

**الدليل الكامل:** `DEPLOYMENT_GUIDE_KOYEB.md`
