const router = require("express").Router();
const categoryController = require("../controllers/category.controller");
const { requireAuth, requireAdmin } = require("../middlewares/auth.middleware");

// Public
router.get("/", categoryController.list);

// Admin only
router.post("/", requireAuth, requireAdmin, categoryController.create);
router.patch("/:id", requireAuth, requireAdmin, categoryController.update);
router.delete("/:id", requireAuth, requireAdmin, categoryController.remove);

module.exports = router;
