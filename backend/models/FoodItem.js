const mongoose = require('mongoose');

const FoodItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String
});

module.exports = mongoose.model('FoodItem', FoodItemSchema);
