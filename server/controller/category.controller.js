const Category = require("../models/category.model");
const factory = require("../services/factory-handler.service");

/**
 * @description create new category
 * @route POST /api/v1/categories
 * @access private [admin]
 */
exports.createCategory = factory.createOne(Category);

/**
 * @description get category by id
 * @route GET /api/v1/categories/:id
 * @access public
 */
exports.getCategory = factory.getOne(Category);

/**
 * @description get all categories
 * @route GET /api/v1/categories
 * @access public
 */
exports.getCategories = factory.getAll(Category);

/**
 * @description update category by id
 * @route PUT /api/v1/categories/:id
 * @access private [admin]
 */
exports.updateCategory = factory.updateOne(Category);

/**
 * @description delete category by id
 * @route DELETE /api/v1/categories/:id
 * @access private [admin]
 */
exports.deleteCategory = factory.deleteOne(Category);
