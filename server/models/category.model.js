const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minLength: 3,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
    },
    options: [
      {
        id: { type: mongoose.Types.ObjectId },
        key: { type: String, required: true },
        type: { type: String, required: true }, // Data type of the option (e.g., "String", "Number", "Boolean")
        required: { type: Boolean, default: false }, // Whether the option is required
        defaultValue: { type: mongoose.Schema.Types.Mixed }, // Default value for the option
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
