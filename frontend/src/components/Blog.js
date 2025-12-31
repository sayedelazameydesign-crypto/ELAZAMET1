
import React, { useState } from 'react';
import './Blog.css';

const Blog = () => {
    const [loading, setLoading] = useState(false);
    const [article, setArticle] = useState(null);
    const [topic, setTopic] = useState('');

    const trendingTopics = [
        "أفضل الساعات الذكية في 2024",
        "كيف تختار لابتوب مناسب للعمل؟",
        "نصائح لتصميم ديكور منزلي عصري",
        "مستقبل الهواتف القابلة للطي",
        "أسرار التسوق أونلاين بذكاء"
    ];

    const generateArticle = async (selectedTopic) => {
        setLoading(true);
        setTopic(selectedTopic || topic);
        setArticle(null);

        try {
            const response = await fetch('http://localhost:8000/ai/generate_seo_article', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic: selectedTopic || topic })
            });
            const data = await response.json();
            setArticle(data);
        } catch (error) {
            console.error("Failed to generate article", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="blog-container">
            <header className="blog-header">
                <h1>مدونة الذكاء الاصطناعي ✍️</h1>
                <p>مقالات حصرية يكتبها وكيل SEO المتخصص بناءً على اهتماماتك</p>
            </header>

            {!article && (
                <>
                    <div className="topics-grid">
                        <h2>اختر موضوعاً أو اكتب خاصاً بك:</h2>
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="اكتب أي موضوع (مثلاً: فوائد القهوة)"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                            />
                            <button onClick={() => generateArticle()}>✨ توليد مقال</button>
                        </div>

                        <div className="tags-container">
                            {trendingTopics.map(t => (
                                <button key={t} className="tag-btn" onClick={() => generateArticle(t)}>
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    {!loading && (
                        <div className="tech-specs-section">
                            <h2>🚀 التقنيات التي تدعم ذكاء المتجر (Antigravity System)</h2>
                            <table className="tech-table">
                                <thead>
                                    <tr>
                                        <th>الإضافة</th>
                                        <th>الوظيفة الأساسية</th>
                                        <th>الفائدة العملية</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>مركز التحكم</td>
                                        <td>إدارة الوكلاء الذكيين بشكل شامل</td>
                                        <td>تسريع سير العمل</td>
                                    </tr>
                                    <tr>
                                        <td>مدير الوكلاء</td>
                                        <td>فتح/إدارة الوكلاء داخل الـ Editor</td>
                                        <td>سهولة التنقل</td>
                                    </tr>
                                    <tr>
                                        <td>قواعد Antigravity</td>
                                        <td>تخصيص أسلوب وسلوك الوكلاء</td>
                                        <td>مرونة أكبر</td>
                                    </tr>
                                    <tr>
                                        <td>دعم الأنظمة</td>
                                        <td>تشغيل على macOS/Windows/Linux</td>
                                        <td>توافق واسع</td>
                                    </tr>
                                    <tr>
                                        <td>التحديثات التلقائية</td>
                                        <td>تنبيه وتثبيت تحديثات</td>
                                        <td>أمان واستقرار</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}

            {loading && (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>جاري كتابة المقال وتحسينه لمحركات البحث...</p>
                </div>
            )}

            {article && (
                <article className="generated-article">
                    <button className="back-btn" onClick={() => setArticle(null)}>← عودة للمواضيع</button>

                    <div className="article-meta">
                        <span className="badge">AI Generated</span>
                        <span className="date">{new Date().toLocaleDateString()}</span>
                    </div>

                    <h1 className="article-title">{article.title}</h1>

                    <div className="article-content" dangerouslySetInnerHTML={{ __html: article.content }} />

                    <div className="seo-box">
                        <h3>📊 تقرير الـ SEO (للمسؤولين)</h3>
                        <p><strong>الوصف (Meta):</strong> {article.meta_description}</p>
                        <p><strong>الكلمات المفتاحية:</strong> {article.keywords?.join(' - ')}</p>
                    </div>
                </article>
            )}
        </div>
    );
};

export default Blog;
