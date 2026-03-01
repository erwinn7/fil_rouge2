const prisma = require("../config/prisma");

const ORDER_INCLUDE = {
    items: { include: { product: { select: { id: true, name: true, imageUrl: true } } } },
    payment: true,
};

exports.findById = (id) => {
    return prisma.order.findUnique({ where: { id }, include: ORDER_INCLUDE });
};

exports.findByUserId = (userId) => {
    return prisma.order.findMany({
        where: { userId },
        include: ORDER_INCLUDE,
        orderBy: { createdAt: "desc" },
    });
};

exports.create = (tx, userId, total, shippingAddress, items) => {
    const db = tx || prisma;
    return db.order.create({
        data: {
            userId,
            total,
            shippingAddress,
            items: { create: items },
        },
        include: ORDER_INCLUDE,
    });
};

exports.updateStatus = (tx, id, status) => {
    const db = tx || prisma;
    return db.order.update({ where: { id }, data: { status } });
};

exports.decrementStock = (tx, productId, quantity) => {
    return tx.product.update({
        where: { id: productId },
        data: { stock: { decrement: quantity } },
    });
};

exports.incrementStock = (tx, productId, quantity) => {
    return tx.product.update({
        where: { id: productId },
        data: { stock: { increment: quantity } },
    });
};
