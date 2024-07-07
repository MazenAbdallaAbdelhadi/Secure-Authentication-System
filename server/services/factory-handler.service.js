// eslint-disable-next-line no-unused-vars
const { Model } = require("mongoose");
const asyncHandler = require("express-async-handler");
const { success } = require("../utils/response/response");
const { recordNotFound } = require("../utils/response/errors");
const ApiFeatures = require("./api-features.service");

/**
 *
 * @param {Model} Model
 */
exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const newDoc = await Model.create(req.body);
    const { body, statusCode } = success({ data: newDoc });
    console.log();
    res.status(statusCode).json(body);
  });

/**
 *
 * @param {Model} Model
 * @param {string} populationOpt
 */
exports.getOne = (Model, populationOpt) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    let query = Model.findById(id);

    if (populationOpt) {
      query.populate(populationOpt);
    }

    const document = await query;

    if (!document) {
      return next(recordNotFound());
    }

    const { body, statusCode } = success({ data: document });
    res.status(statusCode).json(body);
  });

/**
 *
 * @param {Model} Model
 * @param {Array<string>} searchFields
 */
exports.getAll = (Model, searchFields) =>
  asyncHandler(async (req, res) => {
    const { mongooseQuery: countQuery } = new ApiFeatures(
      Model.find({}),
      req.query
    )
      .filter()
      .search(searchFields);

    const countDocs = await countQuery.countDocuments();

    const { mongooseQuery, paginationResult } = new ApiFeatures(
      Model.find({}),
      req.query
    )
      .filter()
      .search(searchFields)
      .limitFields()
      .sort()
      .paginate(countDocs);

    const docs = await mongooseQuery;

    const { body, statusCode } = success({
      data: {
        paginationResult,
        docs,
      },
    });

    res.status(statusCode).json(body);
  });

/**
 *
 * @param {Model} Model
 */
exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!document) {
      next(recordNotFound());
    }

    const { body, statusCode } = success({ data: document });
    res.status(statusCode).json(body);
  });

/**
 *
 * @param {Model} Model
 */
exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      next(recordNotFound());
    }

    const { body, statusCode } = success();
    res.status(statusCode).json(body);
  });
