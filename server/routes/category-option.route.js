/**
 * @route /api/v1/categories/:categoryId/category-options
 */

const { Router } = require("express");

const {
  addOption,
  getAllCategoryOptions,
  removeOption,
  updateCategoryOptions,
} = require("../controller/category-option.controller");

const {
  addOptionValidator,
  deleteOptionValidator,
  getOptionsValidator,
  updateOptionValidator,
} = require("../utils/validations/category-options.validator");

const { protect, allowedRoles } = require("../services/auth.service");

// mergeParams: Allow us to access parameters on other routers
// ex: We need to access categoryId from category router
const router = Router({ mergeParams: true });

router
  .route("/")
  .get(getOptionsValidator, getAllCategoryOptions)
  .post(protect, allowedRoles("admin"), addOptionValidator, addOption);

router
  .route("/:id")
  .put(
    protect,
    allowedRoles("admin"),
    updateOptionValidator,
    updateCategoryOptions
  )
  .delete(protect, allowedRoles("admin"), deleteOptionValidator, removeOption);

module.exports = router;
