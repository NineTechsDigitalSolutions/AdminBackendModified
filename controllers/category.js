const Category = require("../models/Category");

exports.createCategory = async (req, res) => {
  try {
    Category.findOne({ name: req.body.name }).then((categories) => {
      if (categories) {
        return res.status(400).json({
          message: "Cannot add another category with same name",
        });
      } else {
        Category.create(req.body, (err, doc) => {
          if (err)
            return res.status(400).json({
              message: err,
            });
          return res.status(200).json({
            message: req.body.mainCat
              ? "Sub Category Created"
              : "Category Created",
          });
        });
      }
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.addSubCategoryToCategory = async (req, res) => {
  try {
    const { id, subCategories } = req.body;
    //subcategroies is the array of names of subcateogries
    Category.findById(id).then(async (category) => {
      await subCategories.map((sub) => {
        let payload = {
          name: sub,
          mainCat: id,
          categoryType: "sub",
        };
        Category.create(payload);
      });
      res.status(200).json({
        message: "Sub-Category Added",
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
    Category.find({})
      .populate("material mainCat")
      .populate({
        path: "mainCat",
        populate: {
          path: "material",
          // model: 'Category'
        },
      })
      .then((category) => {
        res.status(200).json(category);
      });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.editCategory = async (req, res) => {
  try {
    const { id } = req.body;

    Category.findByIdAndUpdate(id, req.body, { new: true }, (err, doc) => {
      res.status(200).json({
        message: "Category Updated.",
      });
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.getSubcategories = async (req, res) => {
  try {
    Category.find({ mainCat: req.params.id }).then((category) => {
      res.status(200).json(category);
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};
exports.getAllCategories = async (req, res) => {
  try {
    Category.find({ categoryType: "main" }).then((category) => {
      res.status(200).json(category);
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.search = async (req, res) => {
  try {
    Category.find({ name: { $regex: req.body.name, $options: "i" } })
      .populate("material mainCat")
      .populate({
        path: "mainCat",
        populate: {
          path: "material",
        },
      })
      .then((categories) => {
        res.status(200).json(categories);
      });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};
