const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");
const ApiError = require("../utils/ApiError");

const SALT_ROUNDS = 10;

exports.register = async (email, password) => {
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) throw new ApiError(409, "Email already in use");

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await prisma.user.create({
        data: { email, password: hashed },
        select: { id: true, email: true, role: true, createdAt: true },
    });
    return user;
};

exports.login = async (email, password) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new ApiError(401, "Invalid credentials");
    if (user.isBlocked) throw new ApiError(403, "Account is blocked");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new ApiError(401, "Invalid credentials");

    const token = generateToken(user);
    return {
        token,
        user: { id: user.id, email: user.email, role: user.role },
    };
};

exports.getMe = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, role: true, createdAt: true },
    });
    if (!user) throw new ApiError(404, "User not found");
    return user;
};

function generateToken(user) {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );
}
