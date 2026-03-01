const categoryModel = require("../models/category.model");
const ApiError = require("../utils/ApiError");

exports.listCategories = () => categoryModel.findAll();

exports.getCategoryById = async (id) => {
    const cat = await categoryModel.findById(id);
    if (!cat) throw new ApiError(404, "Category not found");
    return cat;
};

exports.createCategory = async (name) => {
    const exists = await categoryModel.findByName(name);
    if (exists) throw new ApiError(409, "Category already exists");
    return categoryModel.create(name);
};

exports.updateCategory = async (id, name) => {
    await exports.getCategoryById(id);
    return categoryModel.update(id, name);
};

exports.deleteCategory = async (id) => {
    await exports.getCategoryById(id);
    const linked = await categoryModel.countProducts(id);
    if (linked > 0) throw new ApiError(409, "Cannot delete category with existing products");
    return categoryModel.remove(id);
};
