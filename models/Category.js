const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategoriesSchema = new Schema({
  name: String,
  material: {
    type: Schema.Types.ObjectId,
    ref: "material",
  },
  mainCat: {
    type: Schema.Types.ObjectId,
    ref: "category",
  },
  categoryType: {
    type: String,
    default: "main",
  },
  CreatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("category", CategoriesSchema);
