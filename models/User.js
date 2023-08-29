const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const mongoosePaginate = require("mongoose-paginate-v2");

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  phone: String,
  address: String,
  email: {
    type: String,
    required: true,
  },
  nic: String,
  blocked: {
    type: Boolean,
    default: false,
  },
  plans: [
    {
      plan: {
        type: Schema.Types.ObjectId,
        ref: "plan",
      },
      isActive: {
        type: Boolean,
        default: true,
      },
      subscriptionDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  oldPlans: [
    {
      plan: {
        type: Schema.Types.ObjectId,
        ref: "plan",
      },
      isActive: {
        type: Boolean,
        default: false,
      },
      expiredOn: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  libraries: [
    {
      type: Schema.Types.ObjectId,
      ref: "library",
    },
  ],
  CreatedAt: {
    type: Date,
    default: Date.now,
  },
  password: {
    type: String,
    required: true,
  },
  otpVerified: {
    type: Boolean,
    default: false,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  otpCode: {
    type: String,
    required: false,
  },
  emailCode: {
    type: String,
    required: false,
  },
  passwordRecoveryToken: {
    type: String,
    required: false,
  },
});

// EmployeeSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("user", UserSchema);
