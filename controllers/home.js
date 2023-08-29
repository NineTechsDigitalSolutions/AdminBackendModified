const Book = require("../models/Book");
const Author = require("../models/Author");
const User = require("../models/User");
const Order = require("../models/Order");
const Sales = require("../models/Sales");
const Product = require("../models/Product");

exports.getAll = async (req, res) => {
  try {
    const { libraries } = req.body;

    let authors = await Author.countDocuments({});
    let users = await User.countDocuments({ libraries: { $in: libraries } });
    let books = await Book.find({ libraries: { $in: libraries } })
      .sort("-_id")
      .limit(10)
      .populate("subCategory libraries author category");
    let sales = await Sales.find({})
      .sort("-_id")
      .limit(10)
      .populate("user plan");
    let netIncome = await Order.aggregate([
      { $match: { status: "Pending" } },
      {
        $group: {
          _id: "",
          totalAmount: { $sum: "$totalAmount" },
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      authors,
      users,
      netIncome: netIncome?.[0]?.totalAmount,
      latestBooks: books,
      latestSales: sales,
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.getMonthlyUsers = async (req, res) => {
  try {
    const { libraries } = req.body;

    const arr = [
      {
        month: "Jan",
        value: 0,
      },
      {
        month: "Feb",
        value: 0,
      },
      {
        month: "Mar",
        value: 0,
      },
      {
        month: "Apr",
        value: 0,
      },
      {
        month: "May",
        value: 0,
      },
      {
        month: "June",
        value: 0,
      },
      {
        month: "July",
        value: 0,
      },
      {
        month: "Aug",
        value: 0,
      },
      {
        month: "Sept",
        value: 0,
      },
      {
        month: "Oct",
        value: 0,
      },
      {
        month: "Nov",
        value: 0,
      },
      {
        month: "Dec",
        value: 0,
      },
    ];
    const query = [
      // {
      //   $match: {
      //     libraries: { $in: libraries },
      //   },
      // },
      {
        $addFields: {
          date: {
            $month: "$CreatedAt",
          },
        },
      },
      {
        $group: {
          _id: "$date",
          count: { $sum: 1 },
        },
      },
      {
        $addFields: {
          month: "$_id",
        },
      },
      {
        $project: {
          _id: 0,
          month: 1,
          count: 1,
        },
      },
    ];
    const data = await User.aggregate(query);
    console.log(`data`, data);
    data.forEach((data) => {
      if (data) {
        arr[data.month - 1] = {
          // month: arr[data.month - 1].month,
          ...arr[data.month - 1],
          value: data.count,
        };
      }
    });
    res.status(200).json({
      monthlyUsers: arr,
    });
  } catch (err) {
    throw new Error(err.toString());
  }
};

exports.getSalesValues = async (req, res) => {
  try {
    const query = [
      {
        $match: {},
      },
      // {
      //   $project: {
      //     // year: { $year: "$CreatedAt" },
      //     // month: { $month: "$CreatedAt" },
      //     day: { $dayOfMonth: "$CreatedAt" },
      //     value: "$amount",
      //   },
      // },
      // {
      //   $group: {
      //     // year: "$year",
      //     // month: "$month",
      //     // day: "$day",
      //     _id: "$CreatedAt",

      //     total: { $sum: "$amount" },
      //   },
      // },

      // {
      //   $addFields: {
      //     date: "$CreatedAt",
      //   },
      // },
      {
        $group: {
          // _id: "$CreatedAt",
          _id: { $dayOfMonth: "$CreatedAt" },
          count: { $sum: "$amount" },
        },
      },
      {
        $addFields: {
          date: "$createdAt",
        },
      },
      {
        $project: {
          _id: 1,
          CreatedAt: 1,
          count: 1,
        },
      },
    ];
    const data = await Sales.aggregate(query);

    res.status(200).json({
      sales: data,
    });
  } catch (err) {
    throw new Error(err.toString());
  }
};

exports.getProductValues = async (req, res) => {
  try {
    const query = [
      {
        $match: {},
      },
      {
        $group: {
          // _id: "$CreatedAt",
          _id: { $dayOfMonth: "$CreatedAt" },
          count: { $sum: 1 },
        },
      },
      {
        $addFields: {
          date: "$createdAt",
        },
      },
      {
        $project: {
          _id: 1,
          CreatedAt: 1,
          count: 1,
        },
      },
    ];
    const data = await Product.aggregate(query);

    res.status(200).json({
      sales: data,
    });
  } catch (err) {
    throw new Error(err.toString());
  }
};

//stats apis

exports.getUserStats = async (req, res) => {
  try {
    const { libraries } = req.body;

    let activeUsers = await User.countDocuments({
      blocked: false,
      libraries: { $in: libraries },
    });
    let inactiveUsers = await User.countDocuments({
      blocked: true,
      libraries: { $in: libraries },
    });
    let books = await Book.find({ libraries: { $in: libraries } })
      .sort("-viewFrequency")
      .limit(5)
      .select("name viewFrequency");
    // let sales = await Sales.find({})
    //   .sort("-_id")
    //   .limit(10)
    //   .populate("user plan");
    // let netIncome = await Order.aggregate([
    //   { $match: { status: "Pending" } },
    //   {
    //     $group: {
    //       _id: "",
    //       totalAmount: { $sum: "$totalAmount" },
    //       count: { $sum: 1 },
    //     },
    //   },
    // ]);

    res.status(200).json({
      activeUsers,
      inactiveUsers,
      highestReadingBooks: books,
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.getMonthlyAuthors = async (req, res) => {
  try {
    const arr = [
      {
        month: "Jan",
        value: 0,
      },
      {
        month: "Feb",
        value: 0,
      },
      {
        month: "Mar",
        value: 0,
      },
      {
        month: "Apr",
        value: 0,
      },
      {
        month: "May",
        value: 0,
      },
      {
        month: "June",
        value: 0,
      },
      {
        month: "July",
        value: 0,
      },
      {
        month: "Aug",
        value: 0,
      },
      {
        month: "Sept",
        value: 0,
      },
      {
        month: "Oct",
        value: 0,
      },
      {
        month: "Nov",
        value: 0,
      },
      {
        month: "Dec",
        value: 0,
      },
    ];
    const query = [
      // {
      //   $match: {
      //     libraries: { $in: libraries },
      //   },
      // },
      {
        $addFields: {
          date: {
            $month: "$CreatedAt",
          },
        },
      },
      {
        $group: {
          _id: "$date",
          count: { $sum: 1 },
        },
      },
      {
        $addFields: {
          month: "$_id",
        },
      },
      {
        $project: {
          _id: 0,
          month: 1,
          count: 1,
        },
      },
    ];
    const data = await Author.aggregate(query);
    console.log(`data`, data);
    data.forEach((data) => {
      if (data) {
        arr[data.month - 1] = {
          // month: arr[data.month - 1].month,
          ...arr[data.month - 1],
          value: data.count,
        };
      }
    });
    res.status(200).json({
      monthlyAuthors: arr,
    });
  } catch (err) {
    throw new Error(err.toString());
  }
};
exports.getMonthlyOrders = async (req, res) => {
  try {
    const arr = [
      {
        month: "Jan",
        value: 0,
      },
      {
        month: "Feb",
        value: 0,
      },
      {
        month: "Mar",
        value: 0,
      },
      {
        month: "Apr",
        value: 0,
      },
      {
        month: "May",
        value: 0,
      },
      {
        month: "June",
        value: 0,
      },
      {
        month: "July",
        value: 0,
      },
      {
        month: "Aug",
        value: 0,
      },
      {
        month: "Sept",
        value: 0,
      },
      {
        month: "Oct",
        value: 0,
      },
      {
        month: "Nov",
        value: 0,
      },
      {
        month: "Dec",
        value: 0,
      },
    ];
    const query = [
      // {
      //   $match: {
      //     libraries: { $in: libraries },
      //   },
      // },
      {
        $addFields: {
          date: {
            $month: "$CreatedAt",
          },
        },
      },
      {
        $group: {
          _id: "$date",
          count: { $sum: 1 },
        },
      },
      {
        $addFields: {
          month: "$_id",
        },
      },
      {
        $project: {
          _id: 0,
          month: 1,
          count: 1,
        },
      },
    ];
    const data = await Order.aggregate(query);
    console.log(`data`, data);
    data.forEach((data) => {
      if (data) {
        arr[data.month - 1] = {
          // month: arr[data.month - 1].month,
          ...arr[data.month - 1],
          value: data.count,
        };
      }
    });
    res.status(200).json({
      monthlyOrders: arr,
    });
  } catch (err) {
    throw new Error(err.toString());
  }
};
