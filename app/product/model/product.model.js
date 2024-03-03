const mongoose = require("mongoose");
const { CONST } = require("../../../middleware/constant");
const product = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
    },
    shippingcharge: {
      type: Number,
    },
    stock: {
      type: Number,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "auth",
    },
    stateId: {
      type: Number,
      enum: [CONST.ACTIVE, CONST.INACTIVE, CONST.OUTOFSTOCK], // 0 =>ACTIVE, 1 =>INACTIVE, 2 => OUTOFSTOCK
      default: CONST.ACTIVE,
    },
  },
  { timestamps: true }
);

module.exports.PRODUCT_MODEL = mongoose.model("product", product);
