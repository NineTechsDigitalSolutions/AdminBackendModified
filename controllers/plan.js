const Plan = require("../models/Plan");

exports.getAllPlans = async (req, res) => {
  try {
    Plan.find()
      .populate("library")
      .then((plans) => {
        res.status(200).json(plans);
      });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};
exports.getPlansByLibrary = async (req, res) => {
  try {
    Plan.find({ library: { $in: req.body.libraries } })
      .populate("library")
      .then((plans) => {
        res.status(200).json(plans);
      });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};
exports.getPlan = async (req, res) => {
  try {
    Plan.findById(req.params.id)
      .populate("library")
      .then((plan) => {
        res.status(200).json(plan);
      });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.createPlan = (req, res, next) => {
  try {
    let payload = {
      ...req.body,
      duration: Number(req.body.duration),
      price: Number(req.body.price),
    };

    Plan.create(payload, (err, doc) => {
      if (err) res.status(400).json(err);
      res.status(200).json({
        message: "Plan Created",
        doc,
      });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};
exports.updatePlan = (req, res, next) => {
  try {
    Plan.findByIdAndUpdate(req.body.id, req.body, { new: true }, (err, doc) => {
      if (err) res.status(400).json(err);
      res.status(200).json({
        message: "Plan Updated",
        doc,
      });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

exports.changeStatus = (req, res, next) => {
  try {
    Plan.findById(req.params.id).then((plan) => {
      plan.status = !plan.status;
      plan.save();
      res.status(200).json({
        message: "Status Updated",
      });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

exports.search = async (req, res) => {
  try {
    // console.log(`req.body`, req.body);
    Plan.find({
      name: { $regex: req.body.name, $options: "i" },
      library: { $in: req.body.libraries },
    })
      .populate("library")
      .then((plans) => {
        res.status(200).json(plans);
      });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};
