const asyncHandler = require("express-async-handler");
const Category = require("../models/category.model");
const { success } = require("../utils/response/response");

/**
 * @description create new option for category
 * @route POST /api/v1/categories/:categoryId/category-options
 * @access private [admin]
 */
exports.addOption = asyncHandler(async (req, res) => {
  //$addToSet => add new option to category options
  const category = await Category.findByIdAndUpdate(
    req.params.categoryId,
    {
      $addToSet: { options: req.body },
    },
    {
      new: true,
    }
  );

  const { body, statusCode } = success({
    data: category.options,
    message: "Option Added Successfully.",
  });

  res.status(statusCode).json(body);
});

/**
 * @description get all options of category
 * @route GET /api/v1/categories/:categoryId/category-options
 * @access public
 */
exports.getAllCategoryOptions = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.categoryId).populate(
    "options"
  );

  const { body, statusCode } = success({ data: category.options });

  res.status(statusCode).json(body);
});

/**
 * @description update option of category by id
 * @route PUT /api/v1/categories/:categoryId/category-options/:id
 * @access private [admin]
 */
exports.updateCategoryOptions = asyncHandler(async (req, res) => {
  const updateObject = {};

  if (req.body.key) {
    updateObject["options.$.key"] = req.body.key;
  }

  if (req.body.type) {
    updateObject["options.$.type"] = req.body.type;
  }

  if (req.body.defaultValue !== undefined) {
    updateObject["options.$.defaultValue"] = req.body.defaultValue;
  }

  if (typeof req.body?.required === "boolean") {
    updateObject["options.$.defaultValue"] = req.body.defaultValue;
  }

  // $set => update option form category options
  const category = await Category.findOneAndUpdate(
    { _id: req.params.categoryId, "options._id": req.params.id },
    { $set: updateObject },
    { new: true }
  );

  const { body, statusCode } = success({
    data: category.options,
    message: "Option updated Successfully.",
  });

  res.status(statusCode).json(body);
});

/**
 * @description remove option from category by id
 * @route DELETE /api/v1/categories/:categoryId/category-options/:id
 * @access private [admin]
 */
exports.removeOption = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.categoryId,
    {
      $pull: { options: { _id: req.params.id } },
    },
    {
      new: true,
    }
  );

  const { body, statusCode } = success({
    data: category.options,
    message: "Option deleted Successfully.",
  });

  res.status(statusCode).json(body);
});
