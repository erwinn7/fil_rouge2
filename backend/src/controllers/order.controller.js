const orderService = require("../services/order.service");

exports.createOrder = async (req, res, next) => {
    try {
        const { shippingAddress } = req.body;
        const order = await orderService.createFromCart(req.user.id, shippingAddress);
        res.status(201).json(order);
    } catch (e) {
        next(e);
    }
};

exports.getOrder = async (req, res, next) => {
    try {
        const order = await orderService.getOrderById(Number(req.params.id), req.user.id, req.user.role);
        res.json(order);
    } catch (e) {
        next(e);
    }
};

exports.listOrders = async (req, res, next) => {
    try {
        const orders = await orderService.listByUser(req.user.id);
        res.json(orders);
    } catch (e) {
        next(e);
    }
};

exports.cancelOrder = async (req, res, next) => {
    try {
        const order = await orderService.cancelOrder(Number(req.params.id), req.user.id, req.user.role);
        res.json(order);
    } catch (e) {
        next(e);
    }
};
