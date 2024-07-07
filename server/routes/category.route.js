/**
 * @route /api/v1/categories
 */

const { Router } = require("express");

const {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} = require("../controller/category.controller");

const { protect, allowedRoles } = require("../services/auth.service");

const {
  createCategoryValidator,
  deleteCategoryValidator,
  getCategoryValidator,
  updateCategoryValidator,
} = require("../utils/validations/categories.validation");

const categoryOptionRoute = require("./category-option.route");

const router = Router();

router.use("/:categoryId/category-options", categoryOptionRoute);

router
  .route("/")
  .get(getCategories)
  .post(
    protect,
    allowedRoles("admin"),
    createCategoryValidator,
    createCategory
  );

router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(protect, allowedRoles("admin"), updateCategoryValidator, updateCategory)
  .delete(
    protect,
    allowedRoles("admin"),
    deleteCategoryValidator,
    deleteCategory
  );

module.exports = router;
