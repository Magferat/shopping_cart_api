const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderDate: { type: Date, default: Date.now },
    items: [
        {
            productId: String,
            productName: String,
            price: Number,
            quantity: Number
        }
    ],
    total: Number
});

module.exports = mongoose.model('Order', orderSchema);
