
import React from 'react';
import { Link } from 'react-router-dom';
import './Wishlist.css';

const Wishlist = ({ wishlistItems, removeFromWishlist, addToCart }) => {
    return (
        <div className="wishlist-container">
            <h2>❤️ قائمة أمنياتي ({wishlistItems.length})</h2>

            {wishlistItems.length === 0 ? (
                <div className="empty-wishlist">
                    <p>قائمة أمنياتك فارغة حالياً.</p>
                    <Link to="/" className="continue-shopping">تصفح الأزياء</Link>
                </div>
            ) : (
                <div className="wishlist-grid">
                    {wishlistItems.map(product => (
                        <div key={product.id} className="product-card wishlist-card">
                            <img src={product.image} alt={product.name} />
                            <h4>{product.name}</h4>
                            <p className="price">₹{product.price}</p>

                            <div className="wishlist-actions">
                                <button className="add-cart-btn" onClick={() => addToCart(product)}>
                                    إضافة للسلة 🛒
                                </button>
                                <button className="remove-btn" onClick={() => removeFromWishlist(product.id)}>
                                    حذف 🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
