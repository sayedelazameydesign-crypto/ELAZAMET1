require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const axios = require('axios');

const app = express();

// CORS Configuration - إعدادات محسنة للأمان
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3006',
  process.env.FRONTEND_URL || 'https://e-commerce-website-orcin-xi.vercel.app'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // السماح للطلبات بدون origin (مثل Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// --- الرابط المصحح من متغيرات البيئة ---
const uri = process.env.MONGO_URI;
// -------------------------------------------------------------

const client = new MongoClient(uri);
let productsCollection;

async function connectDB() {
  try {
    await client.connect();
    // تأكد من أن اسم القاعدة هنا يطابق ما ستنشئه، افتراضياً EcommerceDB
    const db = client.db('EcommerceDB');
    productsCollection = db.collection('products');
    console.log('✅ Connected to MongoDB Atlas Successfully!');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
  }
}

connectDB();

// Health Check
app.get('/', (req, res) => {
  res.send("✅ API is Running (MongoDB + DummyJSON Products)");
});

// Fetch all products
app.get('/api/products', async (req, res) => {
  try {
    const category = req.query.category;
    const mongoFilter = category && category !== 'All' ? { category } : {};

    // التأكد من أن الاتصال بقاعدة البيانات جاهز
    const mongoProducts = productsCollection ? await productsCollection.find(mongoFilter).toArray() : [];

    const formattedMongo = mongoProducts.map(p => ({
      id: p._id.toString(),
      name: p.name,
      price: p.price,
      image: p.image,
      description: p.description,
      category: p.category || "Others",
      isMongo: true
    }));

    const dummyRes = await axios.get('https://dummyjson.com/products?limit=100');
    const dummyProducts = Array.isArray(dummyRes.data.products)
      ? dummyRes.data.products
        .filter(p => typeof p.id === 'number' && p.id > 0 && p.id <= 100)
        .map(p => ({
          id: (p.id + 1000).toString(),
          name: p.title,
          price: p.price,
          image: p.thumbnail,
          description: p.description,
          category: p.category || "Others",
          isMongo: false
        }))
      : [];

    const finalProducts = category && category !== 'All'
      ? [...formattedMongo, ...dummyProducts.filter(p => p.category === category)]
      : [...formattedMongo, ...dummyProducts];

    res.json(finalProducts);

  } catch (err) {
    console.error('Fetch products error:', err.message);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Get product by ID
app.get('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    if (ObjectId.isValid(id) && productsCollection) {
      const product = await productsCollection.findOne({ _id: new ObjectId(id) });
      if (product) {
        return res.json({
          id: product._id.toString(),
          name: product.name,
          price: product.price,
          image: product.image,
          description: product.description,
          category: product.category || "Others",
          isMongo: true
        });
      }
    }
    const numericId = parseInt(id);
    if (!isNaN(numericId) && numericId >= 1000) {
      const dummyId = numericId - 1000;
      const dummyRes = await axios.get(`https://dummyjson.com/products/${dummyId}`);
      const p = dummyRes.data;
      return res.json({
        id: id,
        name: p.title,
        price: p.price,
        image: p.thumbnail,
        description: p.description,
        category: p.category || "Others",
        isMongo: false
      });
    }
    return res.status(404).json({ error: "Product not found" });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// Get Unique Categories
app.get('/api/categories', async (req, res) => {
  try {
    const mongoCategories = productsCollection ? await productsCollection.distinct("category") : [];
    const dummyRes = await axios.get('https://dummyjson.com/products/categories');
    const dummyCategories = Array.isArray(dummyRes.data) ? dummyRes.data : [];
    const combined = Array.from(new Set([...mongoCategories, ...dummyCategories])).filter(Boolean);
    res.json(combined);
  } catch (err) {
    console.error('Fetch categories error:', err.message);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// Add Product (with validation)
app.post('/api/add-product', async (req, res) => {
  try {
    const { name, price, image, description, category } = req.body;

    // Validation
    if (!name || !price || !category) {
      return res.status(400).json({ error: "Name, price, and category are required" });
    }

    if (typeof name !== 'string' || name.trim().length < 3) {
      return res.status(400).json({ error: "Product name must be at least 3 characters" });
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return res.status(400).json({ error: "Price must be a positive number" });
    }

    if (!productsCollection) {
      return res.status(500).json({ error: "DB not connected" });
    }

    const newProduct = {
      name: name.trim(),
      price: parsedPrice,
      image: image || '',
      description: description || '',
      category: category.trim()
    };

    await productsCollection.insertOne(newProduct);
    res.json({ message: "Product added successfully", product: newProduct });
  } catch (err) {
    console.error('Add product error:', err.message);
    res.status(500).json({ error: "Failed to add product" });
  }
});

// Delete Product (MongoDB only - DummyJSON products cannot be deleted)
app.delete('/api/delete-product/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid product ID format" });
    }

    if (!productsCollection) {
      return res.status(500).json({ error: "DB not connected" });
    }

    const result = await productsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error('Delete error:', err.message);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// تشغيل السيرفر - يستخدم PORT من البيئة أو 5001 كافتراضي
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});