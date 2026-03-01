const prisma = require("../config/prisma");

const CART_INCLUDE = {
    items: {
        include: {
            product: { select: { id: true, name: true, price: true, stock: true, imageUrl: true } },
        },
    },
};

exports.findByUserId = (userId) => {
    return prisma.cart.findUnique({ where: { userId }, include: CART_INCLUDE });
};

exports.create = (userId) => {
    return prisma.cart.create({ data: { userId }, include: CART_INCLUDE });
};

exports.findItem = (cartId, productId) => {
    return prisma.cartItem.findUnique({ where: { cartId_productId: { cartId, productId } } });
};

exports.createItem = (cartId, productId, quantity) => {
    return prisma.cartItem.create({ data: { cartId, productId, quantity } });
};

exports.updateItem = (itemId, quantity) => {
    return prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });
};

exports.deleteItem = (itemId) => {
    return prisma.cartItem.delete({ where: { id: itemId } });
};

exports.clearItems = (cartId) => {
    return prisma.cartItem.deleteMany({ where: { cartId } });
};
