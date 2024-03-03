const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
        },
        productName: {
          type: String,
        },
      },
    ],
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "auth",
    },
    totalAmount: {
      type: String,
    },
    // Add other fields as needed
  },
  { timestamps: true }
);

module.exports.ORDER = mongoose.model("order", orderSchema);
