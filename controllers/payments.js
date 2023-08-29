const Payments = require("../models/Payments");

exports.getAll = async (req, res) => {
  try {
    Payments.find({})
      .populate("user product order")
      .then((payments) => {
        res.status(200).json(payments);
      });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};
