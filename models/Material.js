const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const materialSchema = new Schema({
  name: String,
  CreatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("material", materialSchema);
