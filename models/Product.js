const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: String,
  price: Number,
  images: Array,
  category: {
    type: Schema.Types.ObjectId,
    ref: "category",
  },
  status: {
    type: Boolean,
    default: true,
  },
  description: String,
  CreatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("product", productSchema);
