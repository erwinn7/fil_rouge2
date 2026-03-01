const productService = require("../services/product.service");

exports.list = async (req, res, next) => {
    try {
        const { categoryId, search } = req.query;
        const products = await productService.listProducts({ categoryId, search });
        res.json(products);
    } catch (e) {
        next(e);
    }
};

exports.getOne = async (req, res, next) => {
    try {
        const product = await productService.getProductById(Number(req.params.id));
        res.json(product);
    } catch (e) {
        next(e);
    }
};

exports.create = async (req, res, next) => {
    try {
        const product = await productService.createProduct(req.body);
        res.status(201).json(product);
    } catch (e) {
        next(e);
    }
};

exports.update = async (req, res, next) => {
    try {
        const product = await productService.updateProduct(Number(req.params.id), req.body);
        res.json(product);
    } catch (e) {
        next(e);
    }
};

exports.remove = async (req, res, next) => {
    try {
        await productService.deleteProduct(Number(req.params.id));
        res.status(204).send();
    } catch (e) {
        next(e);
    }
};
