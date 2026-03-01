const prisma = require("../config/prisma");

exports.findAll = () => {
    return prisma.category.findMany({ orderBy: { name: "asc" } });
};

exports.findById = (id) => {
    return prisma.category.findUnique({ where: { id } });
};

exports.findByName = (name) => {
    return prisma.category.findUnique({ where: { name } });
};

exports.create = (name) => {
    return prisma.category.create({ data: { name } });
};

exports.update = (id, name) => {
    return prisma.category.update({ where: { id }, data: { name } });
};

exports.remove = (id) => {
    return prisma.category.delete({ where: { id } });
};

exports.countProducts = (categoryId) => {
    return prisma.product.count({ where: { categoryId } });
};
