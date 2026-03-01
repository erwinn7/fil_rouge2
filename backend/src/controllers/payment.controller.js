const paymentService = require("../services/payment.service");

// ─── Stripe ──────────────────────────────────────────────────────────────────

exports.stripeCheckout = async (req, res, next) => {
    try {
        const { orderId } = req.body;
        if (!orderId) return res.status(400).json({ message: "orderId is required" });
        const session = await paymentService.createStripeSession(Number(orderId), req.user.id);
        res.json(session);
    } catch (e) {
        next(e);
    }
};

// Raw body required for Stripe signature verification (set in routes)
exports.stripeWebhook = async (req, res, next) => {
    try {
        const sig = req.headers["stripe-signature"];
        await paymentService.handleStripeWebhook(req.body, sig);
        res.json({ received: true });
    } catch (e) {
        next(e);
    }
};

// ─── PayPal ──────────────────────────────────────────────────────────────────

exports.paypalCreate = async (req, res, next) => {
    try {
        const { orderId } = req.body;
        if (!orderId) return res.status(400).json({ message: "orderId is required" });
        const result = await paymentService.createPaypalOrder(Number(orderId), req.user.id);
        res.json(result);
    } catch (e) {
        next(e);
    }
};

exports.paypalCapture = async (req, res, next) => {
    try {
        const { paypalOrderId } = req.params;
        const payment = await paymentService.capturePaypalOrder(paypalOrderId, req.user.id);
        res.json(payment);
    } catch (e) {
        next(e);
    }
};
