const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const authorSchema = new Schema({
  name: String,
  designation: String,
  description: String,
  email: String,
  address: String,
  phone: String,
  profilePic: String,
  books: [
    {
      type: Schema.Types.ObjectId,
      ref: "book",
    },
  ],
  CreatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("author", authorSchema);
