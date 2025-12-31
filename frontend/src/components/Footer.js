
import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer-container">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>CELIA FASHION DESIGN</h3>
                    <p>وجهتك الأولى للأناقة والأزياء العصرية. نقدم أحدث صيحات الموضة بجودة عالية.</p>
                </div>

                <div className="footer-section">
                    <h4>تواصل معنا</h4>
                    <p>📞 01126212452</p>
                    <p>📧 sayedelazameydesign@gmail.com</p>
                </div>

                <div className="footer-section">
                    <h4>روابط سريعة</h4>
                    <ul>
                        <li><a href="/">الرئيسية</a></li>
                        <li><a href="/cart">السلة</a></li>
                        <li><a href="/blog">المدونة الذكية</a></li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} CELIA FASHION DESIGN. All rights reserved.</p>
                <p className="developer-credit">Developed by: Sayed El-Azamey Design</p>
            </div>
        </footer>
    );
};

export default Footer;
