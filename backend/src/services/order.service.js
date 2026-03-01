const prisma = require("../config/prisma");
const orderModel = require("../models/order.model");
const cartModel = require("../models/cart.model");
const ApiError = require("../utils/ApiError");
const cartService = require("./cart.service");

exports.createFromCart = async (userId, shippingAddress) => {
    if (!shippingAddress) throw new ApiError(400, "Shipping address is required");

    const cart = await cartModel.findByUserId(userId);
    if (!cart || cart.items.length === 0) throw new ApiError(400, "Cart is empty");

    // Verify stock for all items
    for (const item of cart.items) {
        if (item.product.stock < item.quantity) {
            throw new ApiError(400, `Not enough stock for "${item.product.name}"`);
        }
    }

    const total = Math.round(cart.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0) * 100) / 100;
    const itemsData = cart.items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        unitPrice: i.product.price,
    }));

    // Create order + decrement stock in a transaction
    const order = await prisma.$transaction(async (tx) => {
        const newOrder = await orderModel.create(tx, userId, total, shippingAddress, itemsData);
        for (const item of cart.items) {
            await orderModel.decrementStock(tx, item.productId, item.quantity);
        }
        return newOrder;
    });

    await cartService.clearCart(userId);
    return order;
};

exports.getOrderById = async (id, userId, role) => {
    const order = await orderModel.findById(id);
    if (!order) throw new ApiError(404, "Order not found");
    if (role !== "ADMIN" && order.userId !== userId) throw new ApiError(403, "Forbidden");
    return order;
};

exports.listByUser = (userId) => orderModel.findByUserId(userId);

exports.cancelOrder = async (id, userId, role) => {
    const order = await exports.getOrderById(id, userId, role);

    if (!["created", "validated"].includes(order.status)) {
        throw new ApiError(400, "Order cannot be cancelled at this stage");
    }

    await prisma.$transaction(async (tx) => {
        for (const item of order.items) {
            await orderModel.incrementStock(tx, item.productId, item.quantity);
        }
        await orderModel.updateStatus(tx, id, "cancelled");
    });

    return orderModel.findById(id);
};
