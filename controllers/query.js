const Query = require("../models/Query");

exports.createQuery = async (req, res) => {
  try {
    Query.create(req.body, (err, doc) => {
      if (err)
        return res.status(400).json({
          message: err,
        });
      return res.status(200).json({
        message: "Query Submitted",
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
    Query.find({})
      .populate("user")
      .then((querries) => {
        res.status(200).json(querries);
      });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.replyQuery = async (req, res) => {
  try {
    const { id, reply } = req.body;
    Query.findByIdAndUpdate(id, { reply }, { new: true }, (err, doc) => {
      res.status(200).json({
        message: "Reply Submitted",
      });
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};
