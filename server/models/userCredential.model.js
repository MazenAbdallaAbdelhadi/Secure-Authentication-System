const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userCredentialsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  provider: {
    type: String,
    enum: ["google", "email"],
    required: true,
  },
  providerId: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: function () {
      // Make password required only if the provider is "email"
      return this.provider === "email";
    },
  },
  active: {
    type: Boolean,
    default: true,
  },
  passwordChangedAt: Date,
  passwordResetSecret: String,
  passwordResetExpires: Date,
  passwordResetVerified: Boolean,
  tokens: [String],
});

//hash password before saving
userCredentialsSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Hash the updated password
userCredentialsSchema.pre(/update/i, async function (next) {
  if (this._update.password) {
    this._update.password = await bcrypt.hash(this._update.password, 10);
  }
  next();
});

userCredentialsSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const UserCredentials = mongoose.model(
  "UserCredentials",
  userCredentialsSchema
);

module.exports = UserCredentials;
