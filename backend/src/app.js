const express = require("express");
const cors = require("cors");

const routes = require("./routes");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

app.use(cors({
    origin: [
        "http://localhost:4200",
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:3002",
        "http://localhost:58130"
    ],
    credentials: true,
}));

// Stripe webhook needs raw body — must be BEFORE express.json()
app.use("/api/payment/stripe/webhook", express.raw({ type: "application/json" }));

app.use(express.json());

// Force UTF-8 charset sur toutes les réponses JSON
app.use((_req, res, next) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next();
});

app.use("/api", routes);
app.use(errorMiddleware);

module.exports = app;
