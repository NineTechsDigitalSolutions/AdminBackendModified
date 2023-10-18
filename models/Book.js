const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  name: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "author",
  },
  translatedBy: String,
  publisher: String,
  printYear: String,
  ISBN: String,
  series: String,
  description: String,
  category: {
    type: Schema.Types.ObjectId,
    ref: "category",
  },
  subCategory: [{
    type: Schema.Types.ObjectId,
    ref: "category",
  }],
  previousSeries: {
    type: Boolean,
    default: false,
  },
  viewInLibrary: {
    type: Boolean,
    default: true,
  },
  viewFrequency: {
    type: Number,
    default: 0,
  },
  previousSeriesLinks: Array,
  libraries: [
    {
      type: Schema.Types.ObjectId,
      ref: "library",
    },
  ],
  bookImages: Array, //first five pages of the book,back cover,front cover
  backCover: String,
  frontCover: String,
  bookUrl: String,
  epubBook: String,
  bookMp3UrlFemale: String,
  bookMp3UrlMale: String,
  CreatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("book", bookSchema);
