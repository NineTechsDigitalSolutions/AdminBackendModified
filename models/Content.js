const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contentSchema = new Schema({
  name: {
    type: String, //3 types of content (Terms & Condition,About us,Contact us,privacy policy)
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  CreatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("content", contentSchema);
