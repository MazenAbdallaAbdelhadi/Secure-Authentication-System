const { body } = require("express-validator");
const slugify = require("slugify");
const { v4: uuid } = require("uuid");
const User = require("../../models/user.model");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.registerValidator = [
  body("name")
    .notEmpty()
    .withMessage("user name is required")
    .isLength({ min: 3 })
    .withMessage("Too short user name")
    .custom((input, { req }) => {
      req.body.slug = `${slugify(input)}-${uuid()}`;
      return true;
    }),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already in user"));
        }
      })
    ),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Too Short Password"),
  body("passwordConfirm")
    .notEmpty()
    .withMessage("confirm password is required")
    .custom((input, { req }) => {
      return req.body.password === input;
    }),
  body("profileImage").optional(),
  body("bio").optional(),
  validatorMiddleware,
];

exports.loginValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Too Short Password"),
  validatorMiddleware,
];

exports.forgetPasswordValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid"),
  validatorMiddleware,
];

exports.confirmResetValidator = [
  body("resetCode")
    .notEmpty()
    .withMessage("reset code is required")
    .isLength({ max: 6, min: 6 })
    .withMessage("reset code must be 6 numbers"),
  validatorMiddleware,
];

exports.resetPasswordValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Too Short Password"),
  body("passwordConfirm")
    .notEmpty()
    .withMessage("confirm password is required")
    .custom((input, { req }) => {
      return req.body.password === input;
    }),
  validatorMiddleware,
];
