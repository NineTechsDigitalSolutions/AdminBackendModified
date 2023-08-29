const Content = require("../models/Content");

exports.get = async (req, res) => {
  try {
    const { name } = req.body;

    const content = await Content.findOne({
      name,
    });
    await res.status(200).json({
      content,
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    const content = await Content.find();
    await res.status(200).json({
      content,
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.post = async (req, res) => {
  try {
    const { name, content } = req.body;

    const contentDB = new Content({
      name,
      content,
    });
    await contentDB.save();
    await res.status(201).json({
      message: "Content Saved",
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { name, content } = req.body;

    const contentDB = await Content.findOne({
      name,
    });

    contentDB.content = content;

    await contentDB.save();
    await res.status(201).json({
      message: "Content Updated",
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};
