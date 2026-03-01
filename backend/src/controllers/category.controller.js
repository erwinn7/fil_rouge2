const categoryService = require("../services/category.service");

exports.list = async (req, res, next) => {
    try {
        const categories = await categoryService.listCategories();
        res.json(categories);
    } catch (e) {
        next(e);
    }
};

exports.create = async (req, res, next) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: "name is required" });
        const category = await categoryService.createCategory(name);
        res.status(201).json(category);
    } catch (e) {
        next(e);
    }
};

exports.update = async (req, res, next) => {
    try {
        const { name } = req.body;
        const category = await categoryService.updateCategory(Number(req.params.id), name);
        res.json(category);
    } catch (e) {
        next(e);
    }
};

exports.remove = async (req, res, next) => {
    try {
        await categoryService.deleteCategory(Number(req.params.id));
        res.status(204).send();
    } catch (e) {
        next(e);
    }
};
