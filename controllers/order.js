const Order = require("../models/Order");
const Payments = require("../models/Payments");

exports.create = async (req, res) => {
  try {
    Order.create(req.body, (err, doc) => {
      if (err)
        res.status(400).json({
          message: err,
        });
      Payments.create(
        {
          user: req.body.user,
          product: req.body.product,
          order: doc._id,
          payment_status: "Pending",
          payment_type: "COD",
        },
        (err, result) => {
          res.status(200).json({
            message: "Order Placed",
          });
        }
      );
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    const orders = await Order.find().populate("product user");
    await res.status(200).json({
      orders,
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.getOrder = async (req, res) => {
  try {
    Order.findById(req.params.id).then((order) => {
      res.status(200).json(order);
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.changeStatus = async (req, res) => {
  try {
    Order.findById(req.body.id).then(async (order) => {
      order.status = req.body.status;
      await order.save();
      res.status(200).json({
        message: "Order Status Updated",
      });
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

// exports.update = async (req, res) => {
//   try {
//     const { id } = req.body;

//     Order.findByIdAndUpdate(id, req.body, { new: true }, (err, doc) => {
//       if (err)
//         res.status(400).json({
//           message: err,
//         });
//       res.status(200).json({
//         message: "Order Updated",
//       });
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: err.toString(),
//     });
//   }
// };
exports.search = async (req, res) => {
  try {
    Order.find({
      $or: [
        { "user.firstName": { $regex: req.body.name, $options: "i" } },
        { "user.lastName": { $regex: req.body.name, $options: "i" } },
      ],
    })
      .populate("product user")
      .then((orders) => {
        res.status(200).json(orders);
      });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};
