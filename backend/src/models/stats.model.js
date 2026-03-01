const prisma = require("../config/prisma");

exports.getStats = async () => {
    const [usersCount, productsCount, categoriesCount, ordersCount, revenueAgg, pendingOrders] = await Promise.all([
        prisma.user.count(),
        prisma.product.count(),
        prisma.category.count(),
        prisma.order.count(),
        prisma.payment.aggregate({
            _sum: { amount: true },
            where: { status: "completed" },
        }),
        prisma.order.count({ where: { status: "created" } }),
    ]);

    return {
        usersCount,
        productsCount,
        categoriesCount,
        ordersCount,
        pendingOrders,
        revenueTotal: revenueAgg._sum.amount || 0,
    };
};
