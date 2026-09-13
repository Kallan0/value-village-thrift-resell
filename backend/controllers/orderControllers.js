// backend/controllers/orderControllers.js
const Order = require('../models/Order');
const Product = require('../models/Product');

// --- 1. CREATE NEW ORDER ---
const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod = 'COD' } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty. Please add items to checkout.' });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.street || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.phone) {
      return res.status(400).json({ message: 'Please provide complete delivery details (Name, Address, City, Postal Code, Phone).' });
    }

    // Verify products and compute subtotal securely from items/database
    let subtotal = 0;
    const formattedItems = [];

    for (const item of items) {
      const productId = item.product || item._id;
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({ message: `Product "${item.name}" not found.` });
      }

      if (product.status === 'sold') {
        return res.status(400).json({ message: `"${product.name}" has already been sold to another thrifter.` });
      }

      const qty = item.quantity && item.quantity > 0 ? Number(item.quantity) : 1;
      const itemPrice = Number(product.price);
      subtotal += itemPrice * qty;

      formattedItems.push({
        product: product._id,
        name: product.name,
        price: itemPrice,
        quantity: qty,
        imageUrl: product.imageUrl || []
      });

      // Mark unique thrift product as sold upon ordering
      product.status = 'sold';
      await product.save();
    }

    // Free shipping threshold
    const shippingFee = subtotal >= 2000 ? 0 : 150;
    const totalAmount = subtotal + shippingFee;

    const newOrder = new Order({
      user: req.user._id,
      items: formattedItems,
      shippingAddress: {
        fullName: shippingAddress.fullName.trim(),
        phone: shippingAddress.phone.trim(),
        street: shippingAddress.street.trim(),
        city: shippingAddress.city.trim(),
        state: (shippingAddress.state || '').trim(),
        postalCode: shippingAddress.postalCode.trim(),
        country: shippingAddress.country || 'India'
      },
      paymentMethod,
      paymentStatus: paymentMethod === 'Online' ? 'paid' : 'pending',
      orderStatus: 'placed',
      subtotal,
      shippingFee,
      totalAmount
    });

    await newOrder.save();

    res.status(201).json({
      message: 'Order placed successfully!',
      order: newOrder
    });
  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({ message: 'Failed to place order. Please try again.' });
  }
};

// --- 2. GET CURRENT USER ORDERS ---
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name price imageUrl')
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error('Fetch My Orders Error:', error);
    res.status(500).json({ message: 'Failed to fetch your orders.' });
  }
};

// --- 3. GET SINGLE ORDER BY ID ---
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    // Allow only owner or admin
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized access to this order.' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Fetch Order Error:', error);
    res.status(500).json({ message: 'Failed to fetch order details.' });
  }
};

// --- 4. ADMIN: GET ALL ORDERS ---
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error('Admin Fetch Orders Error:', error);
    res.status(500).json({ message: 'Failed to fetch platform orders.' });
  }
};

// --- 5. ADMIN: UPDATE ORDER STATUS ---
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();
    res.status(200).json({ message: 'Order updated successfully.', order });
  } catch (error) {
    console.error('Update Order Status Error:', error);
    res.status(500).json({ message: 'Failed to update order status.' });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
};
