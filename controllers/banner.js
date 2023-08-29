const Banners = require("../models/Banners");

exports.create = async (req, res) => {
  try {
    const image = req.awsImages?.[0];
    // console.log(image);
    Banners.create({ image }, (err, doc) => {
      if (err)
        return res.status(400).json({
          message: err,
        });
      return res.status(200).json({
        message: "Mobile Banner Added Successfully",
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
    Banners.find({}).then((banners) => {
      res.status(200).json(banners);
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.body;
    const image = req.awsImages?.[0];

    Banners.findByIdAndUpdate(id, { image }, { new: true }, (err, doc) => {
      res.status(200).json({
        message: "Banner Updated.",
      });
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    Banners.findByIdAndDelete(id).then(() => {
      res.status(200).json({
        message: "Banner Removed",
      });
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};
