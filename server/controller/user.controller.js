const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuid } = require("uuid");

const User = require("../models/user.model");
const UserCredential = require("../models/userCredential.model");
const {
  recordNotFound,
  validationError,
  unAuthorized,
} = require("../utils/response/errors");
const { success } = require("../utils/response/response");
const {
  generateAccessToken,
  generateRefreshToken,
  setRefreshTokenCookie,
} = require("../services/auth.service");

const {
  uploadSingle,
  uploadToCloudinary,
} = require("../services/file-upload.service");

exports.uploadProfileImage = uploadSingle("profileImage");

exports.resizeProfileImage = asyncHandler(async (req, res, next) => {
  const filename = `user-${uuid()}-${Date.now()}.jpeg`;

  if (req.file) {
    if (!req.file.mimetype.startsWith("image")) {
      return next(validationError({ message: "Only image files are allowed" }));
    }

    const img = await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 });

    const data = await uploadToCloudinary(
      await img.toBuffer(),
      filename,
      "users"
    );

    // Save image into our db
    req.body.profileImage = data.secure_url;
  }

  next();
});

/**
 * @description create new user
 * @route POST /api/v1/users
 * @access private [admin]
 */
exports.createUser = asyncHandler(async (req, res) => {
  // 1- create new user
  const user = await User.create(req.body);

  // 2- create user credentials
  await UserCredential.create({
    password: req.body.password,
    provider: "email",
    providerId: req.body.email,
    user: user._id,
  });

  // 3- send response with all users data
  const { statusCode, body } = success({
    message: "new user created",
    data: user,
  });
  res.status(statusCode).json(body);
});

/**
 * @description get all users
 * @route GET /api/v1/users
 * @access private [admin]
 */
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();

  const { body, statusCode } = success({ data: users });

  res.status(statusCode).json(body);
});

/**
 * @description get user by id
 * @route GET /api/v1/users/:id
 * @access private [admin]
 */
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      recordNotFound({ message: `user with id ${req.params.id} not found` })
    );
  }

  const { body, statusCode } = success({ data: user });

  res.status(statusCode).json(body);
});

/**
 * @description update user profile
 * @route PUT /api/v1/users/:id
 * @access private [admin]
 */
exports.updateUser = asyncHandler(async (req, res, next) => {
  // 1- update user by id
  if (req.body.email) {
    await UserCredential.findOneAndUpdate(
      { user: req.params.id },
      { providerId: req.body.email }
    );
  }

  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  // 2- check if user exists
  if (!user)
    next(
      recordNotFound({
        message: `user with id ${req.params.id} not found`,
      })
    );

  // 3- send response with new user profile
  const { statusCode, body } = success({ data: user });
  res.status(statusCode).json(body);
});

/**
 * @description update user password
 * @route PUT /api/v1/users/changePassword/:id
 * @access private [admin]
 */
exports.updateUserPassword = asyncHandler(async (req, res, next) => {
  // 1- update user password and set password changed at to the current date
  const user = await UserCredential.findOneAndUpdate(
    { user: req.params.id },
    {
      password: req.body.password,
      passwordChangedAt: Date.now(),
      tokens: [],
    }
  );

  // 2- check if user exists
  if (!user)
    next(
      recordNotFound({
        message: `user with id ${req.params.id} not found`,
      })
    );

  // 3- send response back
  const { statusCode, body } = success({
    message: "password updated successfully",
  });
  res.status(statusCode).json(body);
});

/**
 * @description delete user by id
 * @route DELETE /api/v1/users/:id
 * @access private [admin]
 */
exports.deleteUser = asyncHandler(async (req, res, next) => {
  // 1- delete user by id
  const user = await User.findByIdAndDelete(req.params.id);

  // 2- check if user exists
  if (!user) {
    next(
      recordNotFound({
        message: `user with id ${req.params.id} not found`,
      })
    );
  }

  // 3- delete user credentials
  await UserCredential.findOneAndDelete({ user: req.params.id });

  // 4- send response back
  const { statusCode, body } = success({
    message: "user deleted successfully",
  });
  res.status(statusCode).json(body);
});

/**
 * @description get logged user data
 * @route GET /api/v1/users/getMe
 * @access protected [user]
 */
exports.getLoggedUser = asyncHandler(async (req, res, next) => {
  // 1- set params.id to logged user id
  req.params.id = req.user._id;

  // 2- go to getUser
  next();
});

/**
 * @description update logged user data
 * @route PUT /api/v1/users/updateMe
 * @access protected [user]
 */
exports.updateLoggedUser = asyncHandler(async (req, res, next) => {
  // 1- set params.id to logged user id
  req.params.id = req.user._id;

  // 2- go to updateUser
  next();
});

/**
 * @description update logged user password
 * @route GET /api/v1/users/changeMyPassword
 * @access protected [user]
 */
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  // 1- get logged user
  const user = await UserCredential.findOne({ user: req.user._id });

  // 2- check if old password is correct
  if (!(await user.comparePassword(req.body.oldPassword))) next(unAuthorized());

  // 3- update user password and password changed at and empty all tokens
  user.password = req.body.newPassword;
  user.passwordChangedAt = Date.now();
  user.tokens = [];

  // 4- generate new access token and refresh token for the user
  const accessToken = generateAccessToken({ userId: req.user._id });
  const refreshToken = generateRefreshToken({ userId: req.user._id });

  // 5- save user with new refresh token
  user.tokens.push(refreshToken);
  await user.save();

  // 6- set refresh token as httpOnly cookie
  setRefreshTokenCookie(res, refreshToken);

  // 7- send access token as response
  const { statusCode, body } = success({
    message: "password updated successfully",
    data: { token: accessToken },
  });
  res.status(statusCode).json(body);
});

/**
 * @description delete logged user data
 * @route GET /api/v1/users/deleteMe
 * @access protected [user]
 */
exports.deleteLoggedUser = asyncHandler(async (req, res) => {
  // 1- set active state to false
  await UserCredential.findOneAndUpdate(
    { user: req.user._id },
    {
      active: false,
      tokens: [],
    }
  );

  // 2- send response back
  const { statusCode, body } = success({
    message: "account closed successfully",
  });
  res.status(statusCode).json(body);
});
