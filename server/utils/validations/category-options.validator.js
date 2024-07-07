const { body, param } = require("express-validator");
const Category = require("../../models/category.model");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.addOptionValidator = [
  param("categoryId")
    .isMongoId()
    .withMessage("invalide category id")
    .custom((val) =>
      Category.findById(val).then((category) => {
        if (!category) return Promise.reject(new Error("category not found"));
      })
    ),
  body("key").notEmpty().withMessage("option key is required"),
  body("type")
    .notEmpty()
    .withMessage("option type is required")
    .isIn(["number", "string", "boolean", "array"])
    .withMessage("type can be number, string, boolean or array"),
  body("required").optional(),
  body("defaultValue")
    .notEmpty()
    .withMessage("option default value is required"),
  validatorMiddleware,
];

exports.getOptionsValidator = [
  param("categoryId")
    .isMongoId()
    .withMessage("invalide category id")
    .custom((val) =>
      Category.findById(val).then((category) => {
        if (!category) return Promise.reject(new Error("category not found"));
      })
    ),
  validatorMiddleware,
];

exports.updateOptionValidator = [
  param("categoryId")
    .isMongoId()
    .withMessage("invalide category id")
    .custom((val) =>
      Category.findById(val).then((category) => {
        if (!category) return Promise.reject(new Error("category not found"));
      })
    ),
  param("id").isMongoId().withMessage("invalid mongo id"),
  body("key").optional(),
  body("type")
    .optional()
    .isIn(["number", "string", "boolean", "array"])
    .withMessage("type can be number, string, boolean or array"),
  body("required").optional(),
  body("defaultValue").optional(),
  validatorMiddleware,
];

exports.deleteOptionValidator = [
  param("categoryId")
    .isMongoId()
    .withMessage("invalide category id")
    .custom((val) =>
      Category.findById(val).then((category) => {
        if (!category) return Promise.reject(new Error("category not found"));
      })
    ),
  param("id").isMongoId().withMessage("invalid mongo id"),
  validatorMiddleware,
];
