const { body, param } = require("express-validator");
const slugify = require("slugify");
const Category = require("../../models/category.model");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.createCategoryValidator = [
  body("name")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .custom((val) =>
      Category.findOne({ name: val }).then((category) => {
        if (category) {
          return Promise.reject(new Error("Category already exists"));
        }
      })
    )
    .custom((input, { req }) => {
      req.body.slug = slugify(input);
      return true;
    }),
  validatorMiddleware,
];

exports.getCategoryValidator = [
  param("id").isMongoId().withMessage("invalid mongo id"),
  validatorMiddleware,
];

exports.updateCategoryValidator = [
  param("id").isMongoId().withMessage("invalid mongo id"),
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long")
    .trim()
    .custom((val) =>
      Category.findOne({ name: val }).then((category) => {
        if (category) {
          return Promise.reject(new Error("Category already exists"));
        }
      })
    )
    .custom((input, { req }) => {
      req.body.slug = slugify(input);
      return true;
    }),
  validatorMiddleware,
];

exports.deleteCategoryValidator = [
  param("id").isMongoId().withMessage("invalid mongo id"),
  validatorMiddleware,
];
