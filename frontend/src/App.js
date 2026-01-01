import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';
import Cart from './components/Cart';
import PaymentGateway from './components/PaymentGateway';
import OrderConfirmation from './components/OrderConfirmation';
import AddProduct from './components/AddProduct';
import MyOrders from './components/MyOrders';
import OrderDetails from './components/OrderDetails';
import SidePanel from './components/SidePanel';
import AIChatbot from './components/AIChatbot';
import Blog from './components/Blog';
import Wishlist from './components/Wishlist';
import Footer from './components/Footer';
import { ToastContainer, toast } from 'react-toastify';
import { useAuth0 } from "@auth0/auth0-react";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);

  // نظام الحماية Auth0
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(savedCart);
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    setWishlistItems(savedWishlist);
  }, []);

  const toggleWishlist = (product) => {
    let updatedWishlist = [...wishlistItems];
    const index = updatedWishlist.findIndex(p => p.id === product.id);

    if (index >= 0) {
      updatedWishlist.splice(index, 1);
      toast.info(`${product.name} removed from wishlist.`);
    } else {
      updatedWishlist.push(product);
      toast.success(`${product.name} added to wishlist! ❤️`);
    }

    setWishlistItems(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
  };

  const addToCart = (product) => {
    const updatedCart = [...cartItems];
    const existingIndex = updatedCart.findIndex(p => p.id === product.id);

    if (existingIndex >= 0) {
      updatedCart[existingIndex].quantity += 1;
    } else {
      updatedCart.push({ ...product, quantity: 1 });
    }

    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    toast.success(`${product.name || product.title || "Product"} added to cart!`);
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const handleProductAdded = () => {
    setRefreshFlag(!refreshFlag);
    toast.success("✅ Product added successfully!");
  };

  // --- تعطيل شاشة الـ Loading والحماية مؤقتاً لرؤية الموقع ---
  /* if (isLoading) {
    return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</h2>;
  }

  if (!isAuthenticated) {
    loginWithRedirect();
    return null;
  } 
  */
  // ---------------------------------------------------------

  return (
    <Router>
      <Header
        cartItems={cartItems}
        wishlistItems={wishlistItems}
        setSearchTerm={setSearchTerm}
        togglePanel={() => setPanelOpen(!panelOpen)}
      />

      <SidePanel
        isOpen={panelOpen}
        onClose={() => setPanelOpen(false)}
      />

      <AIChatbot cartItems={cartItems} />

      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />

      <Routes>
        <Route
          path="/"
          element={
            <ProductList
              addToCart={addToCart}
              toggleWishlist={toggleWishlist}
              wishlistItems={wishlistItems}
              refreshFlag={refreshFlag}
              searchTerm={searchTerm}
            />
          }
        />

        <Route
          path="/product/:id"
          element={<ProductDetails addToCart={addToCart} toggleWishlist={toggleWishlist} wishlistItems={wishlistItems} />}
        />

        <Route
          path="/wishlist"
          element={
            <Wishlist
              wishlistItems={wishlistItems}
              removeFromWishlist={(id) => toggleWishlist({ id })} // Hacky but works for remove
              addToCart={addToCart}
            />
          }
        />

        <Route
          path="/cart"
          element={<Cart cartItems={cartItems} updateCartItems={setCartItems} />}
        />

        <Route
          path="/payment"
          element={
            <PaymentGateway
              cartItems={cartItems}
              updateCartItems={setCartItems}
              clearCart={clearCart}
            />
          }
        />

        <Route
          path="/order-confirmation"
          element={
            <OrderConfirmation
              addToCart={addToCart}
              clearCart={clearCart}
            />
          }
        />

        <Route
          path="/add-product"
          element={<AddProduct onProductAdded={handleProductAdded} />}
        />

        <Route path="/orders" element={<MyOrders />} />
        <Route path="/order/:id" element={<OrderDetails />} />
        <Route path="/blog" element={<Blog />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;