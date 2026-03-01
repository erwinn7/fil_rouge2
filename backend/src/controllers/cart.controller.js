const cartService = require("../services/cart.service");

exports.getCart = async (req, res, next) => {
    try {
        const cart = await cartService.getCart(req.user.id);
        res.json(cart);
    } catch (e) {
        next(e);
    }
};

exports.addItem = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;
        if (!productId) return res.status(400).json({ message: "productId is required" });
        const cart = await cartService.addItem(req.user.id, Number(productId), Number(quantity) || 1);
        res.json(cart);
    } catch (e) {
        next(e);
    }
};

exports.updateItem = async (req, res, next) => {
    try {
        const { quantity } = req.body;
        const cart = await cartService.updateItem(req.user.id, Number(req.params.productId), Number(quantity));
        res.json(cart);
    } catch (e) {
        next(e);
    }
};

exports.removeItem = async (req, res, next) => {
    try {
        const cart = await cartService.removeItem(req.user.id, Number(req.params.productId));
        res.json(cart);
    } catch (e) {
        next(e);
    }
};

exports.clear = async (req, res, next) => {
    try {
        await cartService.clearCart(req.user.id);
        res.json({ message: "Cart cleared" });
    } catch (e) {
        next(e);
    }
};
