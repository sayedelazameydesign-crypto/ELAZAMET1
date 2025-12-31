
import React, { useState } from 'react';
import './SizeGuide.css';

const SizeGuide = ({ productType = 't-shirt', onClose }) => {
    const [step, setStep] = useState(1);
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [fit, setFit] = useState('regular');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!height || !weight) return;
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8000/ai/size_guide', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    height: parseInt(height),
                    weight: parseInt(weight),
                    fit_preference: fit,
                    product_type: productType
                })
            });
            const data = await response.json();
            setResult(data);
            setStep(2);
        } catch (error) {
            console.error("Size guide error", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="size-guide-overlay">
            <div className="size-guide-modal">
                <button className="close-btn" onClick={onClose}>✕</button>

                <h3>📏 مساعد المقاسات الذكي</h3>

                {step === 1 && (
                    <div className="size-form">
                        <p>أدخل قياساتك وسنقترح عليك المقاس المثالي!</p>

                        <div className="input-row">
                            <label>الطول (سم)</label>
                            <input
                                type="number"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                placeholder="مثلاً 175"
                            />
                        </div>

                        <div className="input-row">
                            <label>الوزن (كجم)</label>
                            <input
                                type="number"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                placeholder="مثلاً 70"
                            />
                        </div>

                        <div className="input-row">
                            <label>كيف تحب لبسك؟</label>
                            <div className="fit-options">
                                <button className={fit === 'tight' ? 'selected' : ''} onClick={() => setFit('tight')}>ضيق</button>
                                <button className={fit === 'regular' ? 'selected' : ''} onClick={() => setFit('regular')}>عادي</button>
                                <button className={fit === 'loose' ? 'selected' : ''} onClick={() => setFit('loose')}>واسع</button>
                            </div>
                        </div>

                        <button className="analyze-btn" onClick={handleSubmit} disabled={loading}>
                            {loading ? 'جاري التحليل...' : 'تحليل مقاسي ✨'}
                        </button>
                    </div>
                )}

                {step === 2 && result && (
                    <div className="size-result">
                        <div className="result-circle">
                            <span>مقاسك هو</span>
                            <strong>{result.suggested_size}</strong>
                        </div>
                        <p className="ai-advice">💡 {result.reason}</p>
                        <button className="retry-btn" onClick={() => setStep(1)}>إعادة الكشف ↻</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SizeGuide;
