const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const salesSchema = new Schema({
  name: String,
  TxnId: String,
  amount: Number,
  payment_status: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  plan: {
    type: Schema.Types.ObjectId,
    ref: "plan",
  },
  // plans: [
  //   {
  //     plan: {
  //       type: Schema.Types.ObjectId,
  //       ref: "plan",
  //     },
  //   },
  // ],
  CreatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("sale", salesSchema);
