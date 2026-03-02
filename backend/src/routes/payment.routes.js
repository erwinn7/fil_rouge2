const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");
const { requireAuth } = require("../middlewares/auth.middleware");

// Stripe webhook — raw body handled globally in app.js before express.json()
router.post("/stripe/webhook", paymentController.stripeWebhook);

// Protected routes
router.post("/stripe/session", requireAuth, paymentController.stripeCheckout);
router.post("/cod", requireAuth, paymentController.codCheckout);
router.post("/paypal/create", requireAuth, paymentController.paypalCreate);
router.post("/paypal/capture/:paypalOrderId", requireAuth, paymentController.paypalCapture);

module.exports = router;
