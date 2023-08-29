const Library = require("../models/Library");

exports.getLibraries = async (req, res) => {
  try {
    Library.find().then((libraries) => {
      res.status(200).json(libraries);
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};
exports.createLibrary = async (req, res) => {
  try {
    Library.create(req.body, (err, doc) => {
      if (err) {
        return res.status(400).json({
          message: err,
        });
      }
      return res.status(200).json({
        message: "Library Created",
        doc,
      });
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};
