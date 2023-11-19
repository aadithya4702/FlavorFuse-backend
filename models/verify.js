const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const VerifyUser = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Verify", VerifyUser);
