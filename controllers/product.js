const Product = require("../models/Product");

exports.create = async (req, res) => {
  try {
    let images = [];
    if (req.awsImages) {
      const imagesMulter = req.awsImages;
      imagesMulter.map((image) => {
        images.push(image);
      });
    }

    Product.create(
      images.length > 0 ? { ...req.body, images } : req.body,
      (err, doc) => {
        if (err)
          res.status(400).json({
            message: err,
          });
        res.status(200).json({
          message: "Product Created",
        });
      }
    );
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category")
      .populate({
        path: "category",
        populate: {
          path: "material",
        },
      });
    await res.status(200).json({
      products,
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    Product.findById(req.params.id)
      .populate("category")
      .populate({
        path: "category",
        populate: {
          path: "material",
        },
      })
      .then((product) => {
        res.status(200).json(product);
      });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.changeStatus = async (req, res) => {
  try {
    Product.findById(req.params.id).then(async (product) => {
      product.status = !product.status;
      await product.save();
      res.status(200).json({
        message: "Status Updated",
      });
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { id, existingImages } = req.body;

    let images = [];
    console.log(`req.awsImages`, req.awsImages);
    if (req.awsImages?.length > 0) {
      const imagesMulter = req.awsImages;
      imagesMulter.map((image) => {
        images.push(image);
      });
    }

    const tempImages = JSON.parse(existingImages);
    let finalImages = [...tempImages, ...images];
    console.log(`finalImages`, finalImages);

    Product.findByIdAndUpdate(
      id,
      { ...req.body, images: finalImages },
      { new: true },
      (err, doc) => {
        if (err)
          res.status(400).json({
            message: err,
          });
        res.status(200).json({
          message: "Product Updated",
        });
      }
    );
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.test = async (req, res) => {
  try {
    res.status(200).json({
      link: req.awsImages[0],
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.search = async (req, res) => {
  try {
    Product.find({ name: { $regex: req.body.name, $options: "i" } })
      .populate("category")
      .populate({
        path: "category",
        populate: {
          path: "material",
        },
      })
      .then((books) => {
        res.status(200).json(books);
      });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};
