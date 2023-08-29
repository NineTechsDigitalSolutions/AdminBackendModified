const Sales = require("../models/Sales");

exports.createPurchase = async (req, res) => {
  try {
    const TxnId = Math.random().toString(36).substr(2, 10).toUpperCase();
    Sales.create({ ...req.body, TxnId }, (err, doc) => {
      if (err)
        return res.status(400).json({
          message: err,
        });
      return res.status(200).json({
        message: "Plan Purchase Successful",
      });
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    Sales.find({})
      .populate("user plan")
      .then((sales) => {
        res.status(200).json(sales);
      });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.getAllByLibrary = async (req, res) => {
  try {
    // Sales.aggregate([
    //   {
    //     $match: {
    //       "plan.library": { $in: req.body.libraries },
    //     },
    //   },
    // ])
    Sales.find({
      // "plan.library": { $in: req.body.libraries },
      "plan.library": "61b2540dd8877c2e3827ba45",
    })
      .populate("user plan")
      .then((sales) => {
        res.status(200).json(sales);
      });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};
