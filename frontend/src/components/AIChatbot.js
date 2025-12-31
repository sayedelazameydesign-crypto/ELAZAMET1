import React, { useState, useEffect, useRef } from 'react';
import './AIChatbot.css';

const AIChatbot = ({ cartItems = [] }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { text: "مرحباً بك! أنا مساعدك الذكي، كيف يمكنني مساعدتك اليوم؟", sender: 'ai' }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef(null);

    // للتمرير التلقائي لأسفل عند وصول رسالة جديدة
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const hasSuggested = useRef(false);

    // Analyze cart when chat opens
    useEffect(() => {
        if (isOpen && cartItems.length > 0 && !hasSuggested.current) {
            const analyzeCart = async () => {
                try {
                    const response = await fetch('http://localhost:8000/ai/analyze_cart', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            items: cartItems,
                            user_query: "What do you suggest based on my cart?"
                        })
                    });
                    const data = await response.json();
                    if (data.suggestion) {
                        setMessages(prev => [...prev, { text: data.suggestion, sender: 'ai' }]);
                        hasSuggested.current = true;
                    }
                } catch (error) {
                    console.error("Cart analysis failed", error);
                }
            };
            analyzeCart();
        }
    }, [isOpen, cartItems]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8000/ai/assist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_query: input })
            });
            const data = await response.json();

            setMessages(prev => [...prev, { text: data.answer, sender: 'ai' }]);
        } catch (error) {
            setMessages(prev => [...prev, { text: "عذراً، واجهت مشكلة في الاتصال بالسيرفر.", sender: 'ai' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`ai-chatbot-container ${isOpen ? 'open' : ''}`}>
            {/* زر فتح الشات */}
            <button className="chat-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? '✕' : '💬'}
            </button>

            {/* نافذة المحادثة */}
            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <h4>المساعد الذكي ✨</h4>
                        <span>متصل حالياً</span>
                    </div>

                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message-bubble ${msg.sender}`}>
                                {msg.text}
                            </div>
                        ))}
                        {isLoading && <div className="message-bubble ai loading">جاري التفكير...</div>}
                        <div ref={scrollRef} />
                    </div>

                    <div className="chat-input-area">
                        <input
                            type="text"
                            placeholder="اسأل عن المنتجات..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button onClick={handleSend}>إرسال</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIChatbot;