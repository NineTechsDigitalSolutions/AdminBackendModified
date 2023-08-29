const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const mongoosePaginate = require("mongoose-paginate-v2");

const PlanSchema = new Schema({
  name: String,
  duration: Number,
  planType: String, //months,weeks,year
  price: Number,
  status: {
    type: Boolean,
    default: true,
  },
  library: {
    type: Schema.Types.ObjectId,
    ref: "library",
  },
  CreatedAt: {
    type: Date,
    default: Date.now,
  },
});

// EmployeeSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("plan", PlanSchema);
