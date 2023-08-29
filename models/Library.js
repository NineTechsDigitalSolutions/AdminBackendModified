const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const mongoosePaginate = require("mongoose-paginate-v2");

const librarySchema = new Schema({
  name: String,
  CreatedAt: {
    type: Date,
    default: Date.now,
  },
});

// ClientSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("library", librarySchema);
