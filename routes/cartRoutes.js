const express = require('express');
const router = express.Router();
const CartItem = require('../models/cartItem');

// ✅ Add to cart (prevent duplicate by productId)
router.post('/', async (req, res) => {
    const { productId, productName, price, quantity } = req.body;

    // Set quantity to 1 if not provided
    const validatedQuantity = quantity ? quantity : 1;

    // Check if product already exists
    const existingItem = await CartItem.findOne({ productId });

    if (existingItem) {
        existingItem.quantity += validatedQuantity;
        await existingItem.save();
        res.status(200).json({
            message: 'Product already in cart, quantity updated.',
            item: existingItem
        });
    } else {
        const item = new CartItem({ productId, productName, price, quantity: validatedQuantity });
        await item.save();
        res.status(201).json({
            message: 'New product added to cart.',
            item
        });
    }
});

// ✅ Get all cart items
router.get('/', async (req, res) => {
    const items = await CartItem.find();
    res.json(items);
});

// Update cart item quantity using productId
router.put('/:productId', async (req, res) => {
    let { quantity } = req.body;

    // Ensure quantity cannot be less than 1
    if (quantity < 1) {
        return res.status(400).json({ message: 'Quantity cannot be less than 1' });
    }

    const updated = await CartItem.findOneAndUpdate(
        { productId: req.params.productId },
        { $set: { quantity } },
        { new: true }
    );

    if (!updated) {
        return res.status(404).json({ message: 'Item not found' });
    }

    res.json(updated);
});

// Delete cart item by productId (safe now)
router.delete('/:productId', async (req, res) => {
    await CartItem.deleteOne({ productId: req.params.productId });
    res.sendStatus(204);
});

module.exports = router;
