const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const librarianSchema = new Schema({
  firstName: String,
  lastName: String,
  nic: String,
  address: String,
  phone: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  type: String, //librarian,admin
  libraries: [
    {
      type: Schema.Types.ObjectId,
      ref: "library",
    },
  ],
  restrictions: Array, // we'll save rules as string and match on front end
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  passwordRecoveryToken: {
    type: String,
    required: false,
  },
  recoveryCode: {
    type: String,
    required: false,
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
  CreatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("librarian", librarianSchema);
