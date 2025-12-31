import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './ProductList.css';

// --- التعديل هنا: وضع الروابط مباشرة ---
const backendURL = "http://localhost:5001";
const mlBackendURL = "http://localhost:5000"; // افترضنا أن محرك التوصيات على 5000
// ---------------------------------------

function ProductList({ addToCart, refreshFlag, searchTerm = '', toggleWishlist, wishlistItems = [] }) {
  const [allProducts, setAllProducts] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [minRating, setMinRating] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryCategory = new URLSearchParams(location.search).get('category');
    setActiveCategory(queryCategory || 'All');
  }, [location.search]);

  const fetchAllProductsAndCategories = async () => {
    try {
      // سحب البيانات من السيرفر الخاص بك ومن DummyJSON
      const [mongoRes, dummyRes] = await Promise.all([
        axios.get(`${backendURL}/api/products`),
        axios.get('https://dummyjson.com/products?limit=100')
      ]);

      const mongoProducts = Array.isArray(mongoRes.data) ? mongoRes.data.map(p => ({
        ...p,
        category: p.category || "Others"
      })) : [];

      const dummyProducts = dummyRes.data.products.map(p => ({
        id: p.id + 1000,
        name: p.title,
        price: p.price,
        image: p.thumbnail,
        description: p.description,
        category: p.category || "Others"
      }));

      const combinedProducts = [...mongoProducts, ...dummyProducts];
      setAllProducts(combinedProducts);

      const combinedCategories = ['All', ...new Set(combinedProducts.map(p => p.category))];
      setCategories(combinedCategories);

    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];

      // محاولة سحب التوصيات (إذا كان سيرفر ML يعمل)
      let combinedRecs = [];
      try {
        const recommendRes = await axios.post(`${mlBackendURL}/recommend`, { history: cart });
        combinedRecs = Array.isArray(recommendRes.data.recommendations)
          ? recommendRes.data.recommendations
          : recommendRes.data;
      } catch (e) {
        console.log("ML Server not reachable, showing dummy recommendations only.");
      }

      const dummyRes = await axios.get('https://dummyjson.com/products?limit=100');
      const dummyRecommendations = dummyRes.data.products
        .filter(p => !cart.some(c => c.id === p.id + 1000))
        .slice(0, 4)
        .map(p => ({
          id: p.id + 1000,
          name: p.title,
          price: p.price,
          image: p.thumbnail,
          description: p.description,
          category: p.category || "Others"
        }));

      setRecommended([...combinedRecs, ...dummyRecommendations]);

    } catch (err) {
      console.error("Recommendation fetch error:", err);
    }
  };

  useEffect(() => {
    fetchAllProductsAndCategories();
    fetchRecommendations();
  }, [refreshFlag, searchTerm]);

  const deleteProduct = (id) => {
    if (id >= 1000) return alert("❌ Cannot delete DummyJSON products.");
    if (!window.confirm("Delete this product?")) return;

    axios.delete(`${backendURL}/api/delete-product/${id}`)
      .then(() => {
        alert("✅ Product deleted successfully!");
        fetchAllProductsAndCategories();
      })
      .catch(err => console.error("Delete error:", err));
  };

  const filteredProducts = allProducts.filter(p => {
    const productName = p.name || "";
    const matchSearch = productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
    const matchRating = (p.rating || 0) >= minRating;
    return matchSearch && matchCategory && matchPrice && matchRating;
  });

  const handleCategoryClick = (cat) => {
    navigate(cat === 'All' ? '/' : `/?category=${cat}`);
  };

  return (
    <div className="product-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>Elegance Redefined.</h1>
          <p>Explore exclusive collections at CELIA FASHION DESIGN.</p>
          <button onClick={() => document.getElementById('products-grid').scrollIntoView({ behavior: 'smooth' })}>
            Shop Collection
          </button>
        </div>
      </div>

      <div className="filters-container">
        <div className="filter-group">
          <h3>Filtres (Category)</h3>
          <div className="category-filter">
            {categories.map(cat => (
              <button
                key={cat}
                className={activeCategory === cat ? 'active' : ''}
                onClick={() => handleCategoryClick(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <h3>Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}</h3>
          <input
            type="range"
            min="0"
            max="5000"
            step="100"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
          />
        </div>

        <div className="filter-group">
          <h3>Min Rating: {minRating} ★</h3>
          <div className="rating-filter-options">
            {[4, 3, 2, 1, 0].map(star => (
              <label key={star} className="rating-option">
                <input
                  type="radio"
                  name="rating"
                  checked={minRating === star}
                  onChange={() => setMinRating(star)}
                />
                {star === 0 ? "All" : `${star}★ & above`}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="product-section" id="products-grid">
        <h2>All Products</h2>
        <div className="product-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <button
                className={`wishlist-btn ${wishlistItems.some(i => i.id === product.id) ? 'active' : ''}`}
                onClick={() => toggleWishlist(product)}
              >
                {wishlistItems.some(i => i.id === product.id) ? '❤️' : '🤍'}
              </button>
              <img src={product.image} alt={product.name} />
              <h4>{product.name}</h4>
              <p>₹{product.price}</p>
              <p className="category-tag">{product.category}</p>
              <button onClick={() => addToCart(product)}>Add to Cart</button>
              <Link to={`/product/${product.id}`} className="details-link">View Details</Link>
              {product.id < 1000 && (
                <button className="delete-btn" onClick={() => deleteProduct(product.id)}>Delete</button>
              )}
            </div>
          ))}
        </div>
      </div>

      {recommended.length > 0 && (
        <div className="product-section">
          <h2>Recommended for You</h2>
          <div className="product-grid">
            {recommended.map(product => (
              <div key={product.id} className="product-card">
                <img src={product.image} alt={product.name} />
                <h4>{product.name}</h4>
                <p>₹{product.price}</p>
                <p className="category-tag">{product.category}</p>
                <button onClick={() => addToCart(product)}>Add to Cart</button>
                <Link to={`/product/${product.id}`} className="details-link">View Details</Link>
                {product.id < 1000 && (
                  <button className="delete-btn" onClick={() => deleteProduct(product.id)}>Delete</button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductList;