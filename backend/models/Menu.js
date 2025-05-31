const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // link menu to vendor
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
});

module.exports = mongoose.model('Menu', menuSchema);
