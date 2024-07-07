const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const UserCredential = require("../models/userCredential.model");
const {
  unAuthorized,
  failure,
  badRequest,
  recordNotFound,
} = require("../utils/response/errors");
const { success } = require("../utils/response/response");
const {
  generateAccessToken,
  generateRefreshToken,
  setRefreshTokenCookie,
} = require("../services/auth.service");
const sendEmail = require("../services/email.service");

/**
 * @description register new user
 * @route POST /api/v1/auth/register
 * @access public
 */
exports.register = asyncHandler(async function (req, res) {
  // 1- create new user
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    slug: req.body.slug,
    profileImage: req.body.profileImage,
    bio: req.body.bio,
  });

  // 2- create user credentials
  const credentials = new UserCredential({
    password: req.body.password,
    provider: "email",
    providerId: req.body.email,
    user: user._id,
  });

  // 3- generate access token and refresh token for new user
  const accessToken = generateAccessToken({ userId: user._id });
  const refreshToken = generateRefreshToken({ userId: user._id });

  // 4- save user credentials with new refresh token
  credentials.tokens.push(refreshToken);
  await credentials.save();

  // 5- set refresh token as httpOnly cookie
  setRefreshTokenCookie(res, refreshToken);

  // 6- send access token and user data as response
  const { statusCode, body } = success({
    message: `welcome ${user.name}. let's begin our journey`,
    data: { token: accessToken, user },
  });

  res.status(statusCode).json(body);
});

/**
 * @description login user by email
 * @route POST /api/v1/auth/login
 * @access public
 */
exports.login = asyncHandler(async function (req, res, next) {
  // 1- get user by his email address
  const credentials = await UserCredential.findOne({
    providerId: req.body.email,
    provider: "email",
  }).populate("user");

  // 2- check if user exists and password is correct
  if (!credentials || !(await credentials.comparePassword(req.body.password)))
    return next(unAuthorized({ message: "invalid email or password" }));

  // 3- generate access token and refresh token to the user
  const accessToken = generateAccessToken({ userId: credentials.user._id });
  const refreshToken = generateRefreshToken({ userId: credentials.user._id });

  // 4- check if user already has refresh token
  const jwtToken = req.cookies["jwt"];

  if (credentials.tokens.includes(jwtToken)) {
    const tokenIndex = credentials.tokens.indexOf(jwtToken);
    credentials.tokens.splice(tokenIndex, 1);
  }

  // 5- save user credentials with new refresh token
  credentials.tokens.push(refreshToken);
  await credentials.save();

  // 6- set refresh token as httpOnly cookie
  setRefreshTokenCookie(res, refreshToken);

  // 7- send access token as response
  const { statusCode, body } = success({
    message: `welcome back.`,
    data: { token: accessToken, user: credentials.user },
  });

  res.status(statusCode).json(body);
});

/**
 * @description generate new access token for user
 * @route GET /api/v1/auth/refresh
 * @access public
 */
exports.refresh = asyncHandler(async function (req, res, next) {
  // 1- get refresh token from cookie
  const jwtToken = req.cookies["jwt"];

  // 2- check if refresh token is valid
  let decoded;
  try {
    decoded = jwt.verify(jwtToken, process.env.REFRESH_TOKEN_SECRET, {
      algorithms: ["HS256"],
    });
  } catch (error) {
    return next(unAuthorized({ message: error.message }));
  }

  // 3- check if user exists
  const credentials = await UserCredential.findOne({
    user: decoded.userId,
  }).populate("user");

  if (!credentials) {
    return next(unAuthorized());
  }

  // 4- check if token stored in database
  const isTokenInUser = credentials.tokens.includes(jwtToken);

  // someone tries to hack user account
  if (!isTokenInUser) {
    return next(unAuthorized());
  }

  // 5- generate new access token and refresh
  const accessToken = generateAccessToken({ userId: credentials.user._id });
  const refreshToken = generateRefreshToken({ userId: credentials.user._id });

  // 6- replace old refresh with new refresh token in database
  const tokenIndex = credentials.tokens.indexOf(jwtToken);
  credentials.tokens.splice(tokenIndex, 1, refreshToken);

  await credentials.save();

  // 7- set new refresh token as httpOnly cookie
  setRefreshTokenCookie(res, refreshToken);

  // 8- send new access token
  const { statusCode, body } = success({
    data: { token: accessToken, user: credentials.user },
  });
  res.status(statusCode).json(body);
});

/**
 * @description delete refresh token for user
 * @route DELETE /api/v1/auth/logout
 * @access public
 */
exports.logout = asyncHandler(async function (req, res, next) {
  // 1- get refresh token from cookie
  const jwtToken = req.cookies["jwt"];

  // 2- check if token exists
  if (!jwtToken) {
    return next(failure({ message: "Token not found" }));
  }

  // 3- check if user exists
  const decoded = jwt.decode(jwtToken);

  const credentials = await UserCredential.findOne({ user: decoded.userId });

  if (!credentials) {
    return next(badRequest());
  }

  // 4- check if token exists in credentials
  if (!credentials.tokens.includes(jwtToken)) {
    return next(unAuthorized());
  }

  // 5- remove token from credentials
  const tokenIndex = credentials.tokens.indexOf(jwtToken);
  credentials.tokens.splice(tokenIndex, 1);
  await credentials.save();

  // 6- remove token from cookies
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  // 7- send response
  const { body, statusCode } = success();
  res.status(statusCode).json(body);
});

/**
 * @description send secret to user to reset password
 * @route POST /api/v1/auth/forget-password
 * @access public
 */
exports.forgetPassword = asyncHandler(async function (req, res, next) {
  // 1- find user with email
  const credentials = await UserCredential.findOne({
    providerId: req.body.email,
  }).populate("user");

  // 2- check if user exists
  if (!credentials) {
    return next(recordNotFound());
  }

  // 3- create reset code
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const resetCodeHash = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");
  // 4- hash reset code and store it in database
  credentials.passwordResetSecret = resetCodeHash;

  // 5- create expire time (20 min) and store it in database
  const expireTime = Date.now() + 20 * 60 * 1000;
  credentials.passwordResetExpires = expireTime;

  // 6- set password reset verified to false
  credentials.passwordResetVerified = false;

  // 7- save changes to database
  await credentials.save();

  // 8- send email to user with password reset code
  const mailOptions = {
    to: req.body.email,
    subject: "OTP forgot password",
    template: "/views/OTP.ejs",
    data: {
      username: credentials.user.name,
      otp: resetCode,
      expire: 20,
    },
  };
  await sendEmail(mailOptions);

  // 9- send response to user
  const { body, statusCode } = success({
    message: "Check your Email for reset code",
  });

  res.status(statusCode).json(body);
});

/**
 * @description confirm secret of user to reset password
 * @route POST /api/v1/auth/confirm-reset-password
 * @access public
 */
exports.confirmReset = asyncHandler(async function (req, res, next) {
  // 1- create hash for reset code
  const resetCodeHash = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  // 2- find user with hashed reset code and update reset secret and reset expire to null
  const credentials = await UserCredential.findOne({
    passwordResetSecret: resetCodeHash,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 3- check if user exists
  if (!credentials) {
    return next(badRequest());
  }

  // 4- set passwordResetVerified to true and save changes to database
  credentials.passwordResetVerified = true;
  credentials.passwordResetSecret = undefined;

  await credentials.save();

  // 5- send response back to user
  const { body, statusCode } = success();
  res.status(statusCode).json(body);
});

/**
 * @description reset password of user
 * @route POST /api/v1/auth/reset-password
 * @access public
 */
exports.resetPassword = asyncHandler(async function (req, res, next) {
  // 1- find user with email
  const credentials = await UserCredential.findOne({
    providerId: req.body.email,
  });

  // 2- check if user exists
  if (!credentials) {
    return next(recordNotFound());
  }

  // 3- check if password reset expire is more than current data
  if (credentials.passwordResetExpires.getTime() < Date.now()) {
    return next(badRequest({ message: "reset password expired" }));
  }

  // 4- check if reset code is verified
  if (!credentials.passwordResetVerified) {
    return next(badRequest({ message: "reset code is not verified" }));
  }

  // 5- reset user password
  credentials.password = req.body.password;
  credentials.passwordChangedAt = Date.now();
  credentials.passwordResetVerified = undefined;
  credentials.passwordResetExpires = undefined;

  // 6- check if refresh token already exists and delete it
  const jwtToken = req.cookies["jwt"];

  if (credentials.tokens.includes(jwtToken)) {
    const tokenIndex = credentials.tokens.indexOf(jwtToken);
    credentials.tokens.splice(tokenIndex, 1);
  }

  // 7- generate new access token and refresh for the user
  const accessToken = generateAccessToken({ userId: credentials.user._id });
  const refreshToken = generateRefreshToken({ userId: credentials.user._id });

  // 8- save user with new refresh token
  credentials.tokens.push(refreshToken);
  await credentials.save();

  // 9- set refresh token as httpOnly cookie
  setRefreshTokenCookie(res, refreshToken);

  // 10- send access token as response
  const { statusCode, body } = success({
    message: "Password reset successfully.",
    data: { token: accessToken },
  });
  res.status(statusCode).json(body);
});
