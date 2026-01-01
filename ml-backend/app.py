from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Text, ForeignKey, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
import openai
import random
from collections import Counter, defaultdict
import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

# --- إعدادات قاعدة البيانات و AI ---
openai.api_key = os.getenv("OPENAI_API_KEY", "YOUR_OPENAI_API_KEY")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./enhanced_store.db")

# إعداد Gemini إذا توفر المفتاح
if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --- جداول قاعدة البيانات (تدمج بيانات المتجر والتحليلات) ---
class ProductDB(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    price = Column(Float)
    category = Column(String)
    description = Column(Text)
    image = Column(String)
    rating = Column(Float, default=4.0)
    views = Column(Integer, default=0)

class ReviewDB(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    content = Column(Text)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Smart AI & Recommendation System")

# --- إعدادات الـ CORS لربط المتجر (Vercel / Localhost) ---
# تحديد المصادر المسموحة بدقة للأمان
allowed_origins = [
    "http://localhost:3000",
    "http://localhost:3006",
    os.getenv("FRONTEND_URL", "https://e-commerce-website-orcin-xi.vercel.app")
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Mock AI response for testing safely without billing
def mock_ai_response(prompt):
    if "cart" in prompt.lower():
        return "أنصحك بإضافة سماعات بلوتوث عالية الجودة، فهي ستكمل تجربتك بشكل رائع!"
    if "offer" in prompt.lower():
        return "عرض خاص لك! أحصل على خصم 15% إذا أتممت الشراء خلال 10 دقائق."
    return "هذا رد تجريبي من المساعد الذكي (لأن مفتاح OpenAI غير مفعل). المنتج رائع ومناسب لك!"

def call_ai(prompt: str):
    # نظام الأولوية: Gemini أولاً (لأنه مجاني) ثم OpenAI
    
    # 1. محاولة استخدام Google Gemini
    if GOOGLE_API_KEY:
        try:
            model = genai.GenerativeModel('gemini-pro')
            system_instruction = "أنت مساعد ذكي لمتجر CELIA FASHION DESIGN المتخصص في بيع الملابس والأزياء العصرية. معلومات الاتصال: هاتف 01126212452 - إيميل sayedelazameydesign@gmail.com. رد دائماً باللغة العربية بأسلوب ودود ومحترف."
            chat = model.start_chat(history=[])
            response = chat.send_message(f"{system_instruction}\n\nUser Question: {prompt}")
            return response.text
        except Exception as e:
            print(f"Gemini Error: {str(e)}")
            # إذا فشل Gemini، ننتقل لـ OpenAI
            pass

    # 2. محاولة استخدام OpenAI
    if openai.api_key != "YOUR_OPENAI_API_KEY":
        try:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "system", "content": "أنت مساعد ذكي لمتجر CELIA FASHION DESIGN المتخصص في بيع الملابس والأزياء العصرية. معلومات الاتصال: هاتف 01126212452 - إيميل sayedelazameydesign@gmail.com"},
                          {"role": "user", "content": prompt}]
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"OpenAI Error: {str(e)}")
    
    # 3. الرد التجريبي كخيار أخير
    return mock_ai_response(prompt)

# الاعتمادية للحصول على جلسة DB
def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

# --- نماذج البيانات (Pydantic) ---
class ChatRequest(BaseModel):
    user_query: str
    history: list = []

# --- New Models for Advanced Features ---
class CartAnalysisRequest(BaseModel):
    items: list
    user_query: str

class UserRequest(BaseModel):
    query: str

class ProductSchema(BaseModel):
    name: str
    description: str

class CompareRequest(BaseModel):
    product1: ProductSchema
    product2: ProductSchema

class ArticleRequest(BaseModel):
    topic: str

class SizeRequest(BaseModel):
    height: int
    weight: int
    fit_preference: str # 'tight', 'regular', 'loose'
    product_type: str # 't-shirt', 'pants', etc.


# ==========================================
# الجزء الأول: خوارزميات التوصية (Logic)
# ==========================================

def calculate_similarity(p1, p2):
    score = 0
    if p1.category == p2.category: score += 0.5
    price_ratio = min(p1.price, p2.price) / max(p1.price, p2.price)
    if price_ratio > 0.7: score += 0.5
    return score

# ==========================================
# الجزء الثاني: مهام المساعد الذكي (OpenAI)
# ==========================================
# (تم دمج دالة call_ai في الأعلى - سطر 63)


# ==========================================
# الـ Endpoints (نقاط الاتصال)
# ==========================================

# 1. المساعد الشامل (دردشة + توصيات ذكية)
@app.post("/ai/assist")
async def store_assistant(req: ChatRequest, db: Session = Depends(get_db)):
    all_products = db.query(ProductDB).all()
    p_names = ", ".join([p.name for p in all_products[:10]]) # نرسل عينة فقط للـ AI
    
    prompt = f"""
    سؤال العميل: {req.user_query}
    المنتجات المتاحة: {p_names}
    ساعد العميل في الإجابة على سؤاله. إذا طلب توصية، اقترح عليه منتجات من القائمة المتاحة.
    """
    return {"answer": call_ai(prompt)}

# 2. نظام التوصيات الخوارزمي (بناءً على التاريخ والسعر)
@app.post("/recommendations")
async def get_recs(req: ChatRequest, db: Session = Depends(get_db)):
    # هنا ندمج المنطق الذي كان في Flask
    all_products = db.query(ProductDB).all()
    # منطق التوصية البسيط: اختر منتجات من نفس الفئات التي سأل عنها العميل
    recommendations = random.sample(all_products, min(len(all_products), 4))
    return {"recommendations": recommendations}

# 3. تحليل مراجعات المنتج
@app.get("/ai/analyze/{product_id}")
async def analyze_product(product_id: int, db: Session = Depends(get_db)):
    reviews = db.query(ReviewDB).filter(ReviewDB.product_id == product_id).all()
    if not reviews: return {"analysis": "لا توجد مراجعات كافية للتحليل."}
    
    text = " | ".join([r.content for r in reviews])
    prompt = f"حلل المراجعات التالية لهذا المنتج ولخص أهم النقاط: {text}"
    return {"analysis": call_ai(prompt)}

# 4. إضافة منتج وتوليد وصفه تلقائياً
@app.post("/products/add")
async def add_product(name: str, price: float, cat: str, db: Session = Depends(get_db)):
    # توليد وصف ذكي قبل الحفظ
    desc = call_ai(f"اكتب وصفاً تسويقياً قصيراً لمنتج {name} في قسم {cat}")
    new_p = ProductDB(name=name, price=price, category=cat, description=desc)
    db.add(new_p)
    db.commit()
    return {"message": "تمت إضافة المنتج بالوصف الذكي!", "product": new_p}

# 5. تحليل سلة التسوق (Cart Assistant)
@app.post("/ai/analyze_cart")
async def analyze_cart(req: CartAnalysisRequest):
    # Handle case where items might be empty
    if not req.items:
        return {"suggestion": "سلتك لا تزال فارغة! هل تبحث عن شيء محدد؟"}
    
    # We expect items to have 'name' and 'quantity'
    cart_description = ", ".join([f"{item.get('name', 'Unknown')} (Qty: {item.get('quantity', 1)})" for item in req.items])
    
    prompt = f"""
    العميل لديه المنتجات التالية في سلته: {cart_description}.
    بناءً على السلة وسؤال العميل: "{req.user_query}",
    قدم نصيحة أو اقترح منتجاً واحداً يكمل هذه المجموعة.
    """
    return {"suggestion": call_ai(prompt)}

# 6. صانع العروض المخصصة (Personalized Offers)
@app.post("/ai/generate_offer")
async def generate_offer(req: UserRequest):
    prompt = f"العميل متردد في الشراء. بناءً على اهتمامه بـ '{req.query}'، اكتب رسالة عرض مغرية جداً وقصيرة تشجعه على الدفع الآن مع خصم وهمي 'WELCOME20'."
    return {"offer_message": call_ai(prompt)}

# 7. مقارنة المنتجات الذكية (Smart Product Comparison)
@app.post("/ai/compare")
async def compare_products(req: CompareRequest):
    prompt = f"""
    قارن بين هذين المنتجين للمشتري:
    1. {req.product1.name}: {req.product1.description}
    2. {req.product2.name}: {req.product2.description}
    وضح الفرق الأساسي ومن هو الأنسب لميزانية متوسطة.
    """
    return {"comparison": call_ai(prompt)}

# 8. وكيل السيو (SEO Agent) - كاتب المقالات
@app.post("/ai/generate_seo_article")
async def generate_seo_article(req: ArticleRequest):
    prompt = f"""
    تصرف كخبير SEO ومسوق إلكتروني محترف. اكتب مقالاً للمدونة حول: "{req.topic}".
    يجب أن يكون المقال:
    1. متوافقاً مع SEO وبه كلمات مفتاحية قوية.
    2. مكتوباً بتنسيق HTML (استخدم <h2> للعناوين و <p> للفقرات).
    3. له عنوان جذاب جداً (Catchy Title).
    4. به قسم "نصيحة الخبير" في النهاية.
    
    أرجع النتيجة بصيغة JSON فقط:
    {{
        "title": "Title Here",
        "content": "HTML Content Here",
        "meta_description": "Short description for Google",
        "keywords": ["tag1", "tag2"]
    }}
    """
    # نستخدم prompt خاص لجعل الرد JSON صالح
    response_text = call_ai(prompt + " Only return valid JSON.")
    
    # محاولة تنظيف الرد إذا كان يحتوي على نص إضافي (بسيط)
    import json
    try:
        # البحث عن بداية ونهاية الـ JSON
        start = response_text.find('{')
        end = response_text.rfind('}') + 1
        json_str = response_text[start:end]
        article_data = json.loads(json_str)
        return article_data
    except:
        # في حالة الفشل، نرجع النص الخام
        return {
            "title": f"مقال عن {req.topic}", 
            "content": f"<p>{response_text}</p>", 
            "meta_description": "مقال تم توليده بواسطة الذكاء الاصطناعي",
            "keywords": ["AI", "Smart Store"]
        }

# 9. مساعد المقاسات الذكي (AI Size Guide)
@app.post("/ai/size_guide")
async def size_guide(req: SizeRequest):
    prompt = f"""
    تصرف كخبير قياسات ملابس (Tailor). العميل مواصفاته:
    الطول: {req.height} سم
    الوزن: {req.weight} كجم
    تفضيل القصة: {req.fit_preference} (يحب الملابس ضيقة، عادية، أو فضفاضة)
    نوع المنتج: {req.product_type}

    المطلوب:
    1. اقترح أفضل مقاس دولي (S, M, L, XL, XXL).
    2. قدم نصيحة قصيرة جداً (جملة واحدة) حول لماذا هذا المقاس هو الأنسب.
    
    أرجع النتيجة بصيغة JSON فقط:
    {{
        "suggested_size": "L",
        "reason": "بناءً على وزنك وطولك، مقاس L سيكون مريحاً ومناسباً لطولك."
    }}
    """
    
    # محاكاة سريعة في حالة عدم وجود مفتاح OpenAI (للتوفير والسرعة في العرض)
    if openai.api_key == "YOUR_OPENAI_API_KEY":
        # منطق بسيط للـ Demo
        size = "M"
        if req.weight > 80: size = "L"
        if req.weight > 95: size = "XL"
        if req.weight > 110: size = "XXL"
        if req.weight < 60: size = "S"
        
        return {
            "suggested_size": size,
            "reason": f"بناءً على وزن {req.weight} كجم، مقاس {size} هو الأنسب لراحة مثالية."
        }

    response_text = call_ai(prompt + " Only return valid JSON.")
    import json
    try:
        start = response_text.find('{')
        end = response_text.rfind('}') + 1
        return json.loads(response_text[start:end])
    except:
        return {"suggested_size": "L", "reason": "نقترح المقاس القياسي L."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)