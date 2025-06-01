const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Order = require('../models/Order');

// POST /api/orders - Place an order
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { menuItemId, vendorId, hostel } = req.body;

    const newOrder = new Order({
      studentId: req.user._id,
      vendorId,
      menuItemId,
      hostel,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Order creation error:', error.message);
    res.status(500).json({ message: 'Failed to place order' });
  }
});

// GET /api/orders/vendor - Get all orders for a vendor
router.get('/vendor', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'vendor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const orders = await Order.find({ vendorId: req.user._id })
      .populate('studentId', 'username email')
      .populate('menuItemId', 'name price');

    res.json(orders);
  } catch (error) {
    console.error('Vendor order fetch error:', error.message);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// PUT /api/orders/:id/status - Update order status
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findOne({ _id: req.params.id, vendorId: req.user._id });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    console.error('Order status update error:', error.message);
    res.status(500).json({ message: 'Failed to update order status' });
  }
});


module.exports = router;
