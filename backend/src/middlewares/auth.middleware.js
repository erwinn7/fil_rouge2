const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");

exports.requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(new ApiError(401, "No token provided"));
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, email, role }
        next();
    } catch {
        next(new ApiError(401, "Invalid or expired token"));
    }
};

exports.requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "ADMIN") {
        return next(new ApiError(403, "Admin access required"));
    }
    next();
};