const mongoose = require("mongoose");
const transaction = new mongoose.Schema(
  {
    transactionId: {
      type: String,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "auth",
    },

    orderId: {
      type: mongoose.Types.ObjectId,
      ref: "order",
    },
    totalAmount: {
      type: String,
    },
    status: {
      type: Number,
      enum: [1, 2], // 1 => SUCCESS, 2 => FAILED
    },
  },
  { timestamps: true }
);

module.exports.TRANSACTION_MODEL = mongoose.model("transaction", transaction);
