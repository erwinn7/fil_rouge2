const authService = require("../services/auth.service");

exports.register = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "email and password are required" });
        }
        const user = await authService.register(email, password);
        res.status(201).json(user);
    } catch (e) {
        next(e);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "email and password are required" });
        }
        const result = await authService.login(email, password);
        res.json(result);
    } catch (e) {
        next(e);
    }
};

exports.me = async (req, res, next) => {
    try {
        const user = await authService.getMe(req.user.id);
        res.json(user);
    } catch (e) {
        next(e);
    }
};
