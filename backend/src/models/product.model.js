const prisma = require("../config/prisma");

exports.findAll = ({ where } = {}) => {
    return prisma.product.findMany({
        where,
        include: { category: { select: { id: true, name: true } } },
        orderBy: { createdAt: "desc" },
    });
};

exports.findById = (id) => {
    return prisma.product.findUnique({
        where: { id },
        include: { category: { select: { id: true, name: true } } },
    });
};

exports.create = (data) => {
    return prisma.product.create({
        data,
        include: { category: { select: { id: true, name: true } } },
    });
};

exports.update = (id, data) => {
    return prisma.product.update({
        where: { id },
        data,
        include: { category: { select: { id: true, name: true } } },
    });
};

exports.remove = (id) => {
    return prisma.product.delete({ where: { id } });
};

exports.removeWithCascade = (id) => {
    return prisma.$transaction([
        prisma.cartItem.deleteMany({ where: { productId: id } }),
        prisma.orderItem.deleteMany({ where: { productId: id } }),
        prisma.product.delete({ where: { id } }),
    ]);
};
