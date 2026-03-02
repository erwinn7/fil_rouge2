const Stripe = require("stripe");
const axios = require("axios");
const paymentModel = require("../models/payment.model");
const orderModel = require("../models/order.model");
const ApiError = require("../utils/ApiError");

// ─── Stripe ──────────────────────────────────────────────────────────────────

const getStripe = () => {
    if (!process.env.STRIPE_SECRET_KEY) throw new ApiError(500, "Stripe not configured");
    return new Stripe(process.env.STRIPE_SECRET_KEY);
};

exports.createStripeSession = async (orderId, userId) => {
    const order = await orderModel.findById(orderId);
    if (!order) throw new ApiError(404, "Order not found");
    if (order.userId !== userId) throw new ApiError(403, "Forbidden");
    if (order.payment) throw new ApiError(400, "Order already has a payment");

    const stripe = getStripe();

    const lineItems = order.items.map((item) => ({
        price_data: {
            currency: "eur",
            product_data: { name: item.product.name },
            unit_amount: Math.round(item.unitPrice * 100),
        },
        quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: process.env.STRIPE_SUCCESS_URL + `?orderId=${orderId}`,
        cancel_url: process.env.STRIPE_CANCEL_URL + `?orderId=${orderId}`,
        metadata: { orderId: String(orderId) },
    });

    // Create pending payment record
    await paymentModel.create(orderId, "STRIPE", order.total, session.id);

    return { url: session.url, sessionId: session.id };
};

exports.handleStripeWebhook = async (rawBody, signature) => {
    const stripe = getStripe();
    let event;

    try {
        event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
    } catch {
        throw new ApiError(400, "Invalid Stripe webhook signature");
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const orderId = Number(session.metadata.orderId);
        await paymentModel.updateStatusByOrderId(orderId, "completed");
        await orderModel.updateStatus(null, orderId, "validated");
    }

    if (event.type === "checkout.session.expired") {
        const session = event.data.object;
        const orderId = Number(session.metadata.orderId);
        await paymentModel.updateStatusByOrderId(orderId, "failed");
    }
};

// ─── PayPal ──────────────────────────────────────────────────────────────────

const getPaypalToken = async () => {
    const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_BASE_URL } = process.env;
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) throw new ApiError(500, "PayPal not configured");

    const credentials = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64");
    const { data } = await axios.post(
        `${PAYPAL_BASE_URL}/v1/oauth2/token`,
        "grant_type=client_credentials",
        { headers: { Authorization: `Basic ${credentials}`, "Content-Type": "application/x-www-form-urlencoded" } }
    );
    return data.access_token;
};

exports.createPaypalOrder = async (orderId, userId) => {
    const order = await orderModel.findById(orderId);
    if (!order) throw new ApiError(404, "Order not found");
    if (order.userId !== userId) throw new ApiError(403, "Forbidden");
    if (order.payment) throw new ApiError(400, "Order already has a payment");

    const token = await getPaypalToken();
    const baseUrl = process.env.PAYPAL_BASE_URL;

    const { data } = await axios.post(
        `${baseUrl}/v2/checkout/orders`,
        {
            intent: "CAPTURE",
            purchase_units: [
                {
                    reference_id: String(orderId),
                    amount: {
                        currency_code: "EUR",
                        value: order.total.toFixed(2),
                        breakdown: {
                            item_total: { currency_code: "EUR", value: order.total.toFixed(2) },
                        },
                    },
                    items: order.items.map((i) => ({
                        name: i.product.name,
                        quantity: String(i.quantity),
                        unit_amount: { currency_code: "EUR", value: i.unitPrice.toFixed(2) },
                    })),
                },
            ],
        },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
    );

    await paymentModel.create(orderId, "PAYPAL", order.total, data.id);

    const approvalLink = data.links.find((l) => l.rel === "payer-action")?.href || data.links.find((l) => l.rel === "approve")?.href;
    return { approvalUrl: approvalLink, paypalOrderId: data.id };
};

// ─── Cash on Delivery (simulated) ───────────────────────────────────────────

exports.createCodPayment = async (orderId, userId) => {
    const order = await orderModel.findById(orderId);
    if (!order) throw new ApiError(404, "Order not found");
    if (order.userId !== userId) throw new ApiError(403, "Forbidden");
    if (order.payment) throw new ApiError(400, "Order already has a payment");

    await paymentModel.create(orderId, "COD", order.total, `cod_${orderId}_${Date.now()}`);
    await paymentModel.updateStatusByOrderId(orderId, "completed");
    await orderModel.updateStatus(null, orderId, "processing");

    return { success: true, orderId };
};

exports.capturePaypalOrder = async (paypalOrderId, userId) => {
    const payment = await paymentModel.findByProviderPaymentId(paypalOrderId);
    if (!payment) throw new ApiError(404, "Payment not found");

    const order = await orderModel.findById(payment.orderId);
    if (order.userId !== userId) throw new ApiError(403, "Forbidden");

    const token = await getPaypalToken();
    const baseUrl = process.env.PAYPAL_BASE_URL;

    const { data } = await axios.post(
        `${baseUrl}/v2/checkout/orders/${paypalOrderId}/capture`,
        {},
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
    );

    const captureStatus = data.status === "COMPLETED" ? "completed" : "failed";
    await paymentModel.updateStatus(payment.id, captureStatus);

    if (captureStatus === "completed") {
        await orderModel.updateStatus(null, payment.orderId, "validated");
    }

    return paymentModel.findByProviderPaymentId(paypalOrderId);
};
