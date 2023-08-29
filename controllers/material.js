const Material = require("../models/Material");

exports.createMaterial = async (req, res) => {
  try {
    Material.create(req.body, (err, doc) => {
      if (err)
        res.status(400).json({
          message: err.toString(),
        });
      res.status(200).json({
        message: "Material Added",
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
    Material.find({}).then((materials) => {
      res.status(200).json(materials);
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};
