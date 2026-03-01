const router = require("express").Router();
const orderController = require("../controllers/order.controller");
const { requireAuth } = require("../middlewares/auth.middleware");

router.use(requireAuth);

router.post("/", orderController.createOrder);
router.get("/", orderController.listOrders);
router.get("/:id", orderController.getOrder);
router.patch("/:id/cancel", orderController.cancelOrder);

module.exports = router;
