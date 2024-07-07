const rateLimit = require("express-rate-limit");

exports.loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login requests per windowMs
  message:
    "Too many login attempts from this IP, please try again after 15 minutes",
});

exports.resendOtpLimiter = rateLimit({
  windowMs: 3 * 60 * 1000, // 3 minutes
  max: 1, // limit each IP to 1 otp requests per windowMs
  message: "please try again after 3 minutes",
});
