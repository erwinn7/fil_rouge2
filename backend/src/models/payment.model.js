const prisma = require("../config/prisma");

exports.create = (orderId, provider, amount, providerPaymentId) => {
    return prisma.payment.create({
        data: { orderId, provider, status: "pending", amount, providerPaymentId },
    });
};

exports.findByOrderId = (orderId) => {
    return prisma.payment.findUnique({ where: { orderId } });
};

exports.findByProviderPaymentId = (providerPaymentId) => {
    return prisma.payment.findFirst({ where: { providerPaymentId } });
};

exports.updateStatus = (id, status) => {
    return prisma.payment.update({ where: { id }, data: { status } });
};

exports.updateStatusByOrderId = (orderId, status) => {
    return prisma.payment.update({ where: { orderId }, data: { status } });
};
