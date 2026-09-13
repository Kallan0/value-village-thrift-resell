// backend/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderControllers');

// Customer routes
router.post('/', requireAuth, createOrder);
router.get('/my-orders', requireAuth, getMyOrders);
router.get('/:id', requireAuth, getOrderById);

// Admin routes
router.get('/admin/all', requireAuth, requireAdmin, getAllOrders);
router.patch('/admin/:id/status', requireAuth, requireAdmin, updateOrderStatus);

module.exports = router;
