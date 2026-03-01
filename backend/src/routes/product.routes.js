const router = require("express").Router();
const productController = require("../controllers/product.controller");
const { requireAuth, requireAdmin } = require("../middlewares/auth.middleware");

// Public
router.get("/", productController.list);
router.get("/:id", productController.getOne);

// Admin only
router.post("/", requireAuth, requireAdmin, productController.create);
router.patch("/:id", requireAuth, requireAdmin, productController.update);
router.delete("/:id", requireAuth, requireAdmin, productController.remove);

module.exports = router;
