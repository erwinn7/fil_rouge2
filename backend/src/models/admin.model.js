const prisma = require("../config/prisma");

exports.listUsers = () => {
    return prisma.user.findMany({
        select: {
            id: true,
            email: true,
            role: true,
            isBlocked: true,
            createdAt: true,
        },
        orderBy: { id: "desc" },
    });
};

exports.changeUserRole = (userId, role) => {
    return prisma.user.update({
        where: { id: userId },
        data: { role },
        select: {
            id: true,
            email: true,
            role: true,
            isBlocked: true,
        },
    });
};

exports.setUserBlocked = (userId, isBlocked) => {
    return prisma.user.update({
        where: { id: userId },
        data: { isBlocked },
        select: {
            id: true,
            email: true,
            role: true,
            isBlocked: true,
        },
    });
};

exports.listOrders = () => {
    return prisma.order.findMany({
        orderBy: { id: "desc" },
        include: {
            user: { select: { id: true, email: true } },
            items: { include: { product: { select: { id: true, name: true } } } },
            payment: true,
        },
    });
};

exports.changeOrderStatus = (orderId, status) => {
    return prisma.order.update({
        where: { id: orderId },
        data: { status },
    });
};
