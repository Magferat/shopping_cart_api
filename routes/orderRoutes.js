const express = require('express');
const router = express.Router();
const CartItem = require('../models/cartItem');
const Order = require('../models/order');

// Place order (from cart)
router.post('/', async (req, res) => {
    const cartItems = await CartItem.find();
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = new Order({ items: cartItems, total });
    await order.save();

    await CartItem.deleteMany(); // Clear cart
    res.status(201).json(order);
});

// Get all orders
router.get('/', async (req, res) => {
    const orders = await Order.find();
    res.json(orders);
});

// Get order by ID
router.get('/:id', async (req, res) => {
    const order = await Order.findById(req.params.id);
    res.json(order);
});

// Reorder
router.post('/:id/reorder', async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).send('Order not found');

    // Add to cart again
    await CartItem.insertMany(order.items);
    res.status(201).send('Items re-added to cart');
});

module.exports = router;
