const router = require("express").Router();

router.get("/health", (req, res) => res.json({ ok: true }));

router.use("/auth", require("./auth.routes"));
router.use("/categories", require("./category.routes"));
router.use("/products", require("./product.routes"));
router.use("/cart", require("./cart.routes"));
router.use("/orders", require("./order.routes"));
router.use("/payment", require("./payment.routes"));
router.use("/admin", require("./admin.routes"));
router.use("/admin/stats", require("./stats.routes"));

module.exports = router;
