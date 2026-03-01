const cartModel = require("../models/cart.model");
const productModel = require("../models/product.model");
const ApiError = require("../utils/ApiError");

const getOrCreateCart = async (userId) => {
    let cart = await cartModel.findByUserId(userId);
    if (!cart) cart = await cartModel.create(userId);
    return cart;
};

exports.getCart = (userId) => getOrCreateCart(userId);

exports.addItem = async (userId, productId, quantity = 1) => {
    const product = await productModel.findById(productId);
    if (!product) throw new ApiError(404, "Product not found");
    if (product.stock < quantity) throw new ApiError(400, "Not enough stock");

    const cart = await getOrCreateCart(userId);
    const existing = await cartModel.findItem(cart.id, productId);

    if (existing) {
        const newQty = existing.quantity + quantity;
        if (product.stock < newQty) throw new ApiError(400, "Not enough stock");
        await cartModel.updateItem(existing.id, newQty);
    } else {
        await cartModel.createItem(cart.id, productId, quantity);
    }

    return getOrCreateCart(userId);
};

exports.updateItem = async (userId, productId, quantity) => {
    if (quantity <= 0) return exports.removeItem(userId, productId);

    const product = await productModel.findById(productId);
    if (!product) throw new ApiError(404, "Product not found");
    if (product.stock < quantity) throw new ApiError(400, "Not enough stock");

    const cart = await cartModel.findByUserId(userId);
    if (!cart) throw new ApiError(404, "Cart not found");

    const item = await cartModel.findItem(cart.id, productId);
    if (!item) throw new ApiError(404, "Item not in cart");

    await cartModel.updateItem(item.id, quantity);
    return getOrCreateCart(userId);
};

exports.removeItem = async (userId, productId) => {
    const cart = await cartModel.findByUserId(userId);
    if (!cart) throw new ApiError(404, "Cart not found");

    const item = await cartModel.findItem(cart.id, productId);
    if (!item) throw new ApiError(404, "Item not in cart");

    await cartModel.deleteItem(item.id);
    return getOrCreateCart(userId);
};

exports.clearCart = async (userId) => {
    const cart = await cartModel.findByUserId(userId);
    if (cart) await cartModel.clearItems(cart.id);
};
