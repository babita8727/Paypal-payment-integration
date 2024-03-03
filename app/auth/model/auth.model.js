const mongoose = require("mongoose");
const { CONST } = require("../../../middleware/constant");
const auth = new mongoose.Schema(
  {
    username: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    mobile: {
      type: String,
      default: "",
    },
    countryCode: {
      type: String,
      default: "",
    },
    profileImg: {
      type: String,
      default: "",
    },
    otp: {
      type: String,
    },
    expireIn: {
      type: Number,
    },
    otpVerify: {
      type: Number,
      enum: [CONST.NO, CONST.YES], // 0 => NO, 1 = > YES
      default: CONST.NO,
    },
    role: {
      type: Number,
      enum: [CONST.ADMIN, CONST.CUSTOMER], // 6 => ADMIN , 1 => CUSTOMER
      default: CONST.CUSTOMER,
    },
    stateId: {
      type: Number,
      enum: [CONST.ACTIVE, CONST.DELETED, CONST.BAN], // 0 =>ACTIVE, 1 => INACTIVE, 2 => DELETED, 3 => BAN
      default: CONST.ACTIVE,
    },
  },
  { timestamps: true }
);

module.exports.AUTH_MODEL = mongoose.model("auth", auth);
