const productModel = require("../models/product.model");
const categoryModel = require("../models/category.model");
const ApiError = require("../utils/ApiError");

exports.listProducts = async ({ categoryId, search } = {}) => {
    const where = {};
    if (categoryId) where.categoryId = Number(categoryId);
    if (search) where.name = { contains: search, mode: "insensitive" };
    return productModel.findAll({ where });
};

exports.getProductById = async (id) => {
    const product = await productModel.findById(id);
    if (!product) throw new ApiError(404, "Product not found");
    return product;
};

exports.createProduct = async (data) => {
    const { categoryId, name, description, price, stock, imageUrl } = data;
    const category = await categoryModel.findById(Number(categoryId));
    if (!category) throw new ApiError(404, "Category not found");

    return productModel.create({
        categoryId: Number(categoryId),
        name,
        description: description || "",
        price: Number(price),
        stock: Number(stock) || 0,
        imageUrl: imageUrl || "",
    });
};

exports.updateProduct = async (id, data) => {
    await exports.getProductById(id);
    const { categoryId, name, description, price, stock, imageUrl } = data;

    const updateData = {};
    if (categoryId !== undefined) updateData.categoryId = Number(categoryId);
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = Number(price);
    if (stock !== undefined) updateData.stock = Number(stock);
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

    return productModel.update(id, updateData);
};

exports.deleteProduct = async (id) => {
    await exports.getProductById(id);
    return productModel.remove(id);
};
