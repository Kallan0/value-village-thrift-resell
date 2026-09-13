const Product = require('../models/Product');

// GET /api/products
// Fetch products with search, category, condition, and sorting support
const getProducts = async (req, res) => {
  try {
    const { search, category, condition, sort } = req.query;

    const filter = { status: 'approved' };

    // Category filter (case-insensitive)
    if (category && category.toLowerCase() !== 'all') {
      filter.category = new RegExp(`^${category.trim()}$`, 'i');
    }

    // Condition filter
    if (condition) {
      filter.condition = condition;
    }

    // Keyword Search across title and description
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex }
      ];
    }

    // Sort order
    let sortOption = { createdAt: -1 }; // default newest
    if (sort === 'price-low') {
      sortOption = { price: 1 };
    } else if (sort === 'price-high') {
      sortOption = { price: -1 };
    }

    const products = await Product.find(filter).sort(sortOption);
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server Error fetching products' });
  }
};

// GET /api/products/:id
// Fetch a single product by its ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching product' });
  }
};

module.exports = {
  getProducts,
  getProductById
};