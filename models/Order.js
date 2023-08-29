const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  status: {
    type: String,
    default: "Pending",
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "product",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  quantity: Number,
  totalAmount: Number,
  CreatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("order", orderSchema);
