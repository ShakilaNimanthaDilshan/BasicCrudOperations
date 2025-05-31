const express = require('express');
const router = express.Router();
const Menu = require('../models/Menu');
const authMiddleware = require('../middleware/authMiddleware');

// Get all menu items for logged-in vendor
router.get('/', authMiddleware, async (req, res) => {
  try {
    const menu = await Menu.find({ vendorId: req.user._id });
    res.json(menu);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all menus - public for students
router.get('/menu/all', async (req, res) => {
  try {
    const menuItems = await Menu.find().populate('vendorId', 'username email');
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new menu item
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const newItem = new Menu({
      vendorId: req.user._id,
      name,
      description,
      price,
    });
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update menu item by ID
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const item = await Menu.findOne({ _id: req.params.id, vendorId: req.user._id });
    if (!item) return res.status(404).json({ message: 'Item not found' });

    const { name, description, price } = req.body;
    item.name = name || item.name;
    item.description = description || item.description;
    item.price = price !== undefined ? price : item.price;

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete menu item by ID
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await Menu.findOneAndDelete({ _id: req.params.id, vendorId: req.user._id });
    if (!deleted) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
