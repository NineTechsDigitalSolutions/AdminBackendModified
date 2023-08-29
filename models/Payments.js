const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const salesSchema = new Schema({
  payment_status: String,
  payment_type: String, //COD,card
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: "order",
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "product",
  },
  CreatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("payment", salesSchema);
