const User = require("../models/User");
const Plan = require("../models/Plan");
const Sales = require("../models/Sales");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const randomCode = () => {
  // const randomString = (length, chars) => {
  //     var result = "";
  //     for (var i = length; i > 0; --i)
  //       result += chars[Math.floor(Math.random() * chars.length)];
  //     return result;
  //   };
  //   var rString = randomString(8, "0123456789ABC./DEF;'@!&*GHIJKLMNOPQRSTUVWXYZ");
  // Math.random().toString(36).substr(2, length)

  return Math.random().toString(36).substr(2, 8).toUpperCase();
};

exports.getUsers = async (req, res) => {
  try {
    User.find()
      .populate("libraries plans.plan oldPlans.plan")
      .select("-password -otpCode -emailCode -passwordRecoveryToken")
      //   .populate("plan libraries")
      .then((users) => {
        res.status(200).json(users);
      });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};
exports.getUsersByLibrary = async (req, res) => {
  try {
    User.find({ libraries: { $in: req.body.libraries } })
      .populate("libraries")
      .select("-password -otpCode -emailCode -passwordRecoveryToken")
      //   .populate("plan libraries")
      .then((users) => {
        res.status(200).json(users);
      });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};
exports.getUserById = async (req, res) => {
  try {
    User.findById(req.params.id)
      .populate("plans.plan oldPlans.plan libraries")
      //   .populate("plan libraries")
      .select("-password -otpCode -emailCode -passwordRecoveryToken")
      .then((user) => {
        res.status(200).json(user);
      });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.createUser = (req, res, next) => {
  try {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;

    User.findOne({ email }).then(async (user) => {
      if (user) {
        return res.status(400).json({
          message: "User with same email already exists",
        });
      } else {
        if (password.length >= 8) {
          bcrypt.hash(password, 12).then((hashedPassword) => {
            let payload = {
              ...req.body,
              email,
              password: hashedPassword,
              otpCode: randomCode(),
              emailCode: randomCode(),
              passwordRecoveryToken: randomCode(),
            };
            User.create(payload)
              .then(() => {
                return res.status(200).json({
                  message: "User Registered Succesfully",
                });
              })
              .catch((err) => {
                console.log(err);
                return res.status(500).json({
                  message: "Error Registering User",
                  err,
                });
              });
          });
        } else {
          return res.status(400).json({
            message: "Password must be greater than or equal to 8 characters",
          });
        }
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

exports.changeStatus = (req, res, next) => {
  try {
    User.findById(req.params.id)
      .then(async (user) => {
        user.blocked = !user.blocked;
        await user.save();
        res.status(200).json({
          message: "Status Updated",
        });
      })
      .catch((err) => {
        res.status(400).json({
          message: err,
        });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
exports.updateUser = (req, res, next) => {
  try {
    User.findByIdAndUpdate(req.body.id, req.body, { new: true })
      .then(async () => {
        res.status(200).json({
          message: "User Profile Updated",
        });
      })
      .catch((err) => {
        res.status(400).json({
          message: err,
        });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.login = (req, res, next) => {
  const email = req.body.email.toLowerCase();
  const password = req.body.password;
  let loadedUser = "";

  User.findOne({ email })
    .populate("libraries")
    .select("-otpCode -emailCode -passwordRecoveryToken")
    // .populate("plan libraries")
    .then((user) => {
      if (!user) {
        const error = new Error("No user found by this email");
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Invalid Password");
        error.statusCode = 400;
        throw error;
      }

      const token = jwt.sign(
        {
          // user: loadedUser,
          userId: loadedUser._id,
        },
        "4=?ADE56GJMC2%7&kF%HTqy8CfTZuj5e2aTKy2g!^F-W%7uP$cUqfuWcQxyVP*ez"
      );

      res.status(200).json({
        message: "Logged In Succesfully",
        token: token,
        user: loadedUser,
      });
    })
    .catch((err) => {
      console.log(err);
      if (err.statusCode === 401) {
        res.status(401).json({
          message: "No user found by this email",
        });
      } else if (err.statusCode === 400) {
        res.status(400).json({
          message: "Invalid Password",
        });
      } else {
        res.status(500).json({
          message: "Internal Server Error",
        });
      }
    });
};

exports.updatePassword = (req, res, next) => {
  try {
    const { newPass, ConfirmPass, user, oldPass } = req.body;
    if (newPass !== ConfirmPass) {
      return res.status(400).json({
        message: "New & Confirm Password Doesn't Matched",
      });
    }
    // else if (newPass === oldPass) {
    //   return res.status(400).json({
    //     message: "New & Old Password are same, password not updated",
    //   });
    // }
    else {
      User.findById(user, (err, doc) => {
        const validate = bcrypt.compareSync(oldPass, doc.password);
        if (!validate) {
          return res.status(400).json({ message: "Old Password is Incorrect" });
        }
        bcrypt.hash(newPass, 12).then((hashedPassword) => {
          doc.password = hashedPassword;
          doc.save();
          return res.status(200).json({
            message: "Password Updated!",
          });
        });
      });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};
exports.verifyOtp = (req, res, next) => {
  try {
    User.findById(req.body.user)
      .then(async (user) => {
        if (user.otpCode === req.body.code) {
          user.otpVerified = true;
          await user.save();
          return res.status(200).json({
            message: "OTP Verified",
          });
        } else {
          return res.status(400).json({
            message: "Wrong OTP Code Entered",
          });
        }
      })
      .catch((err) => {
        res.status(400).json({
          message: err,
        });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
exports.verifyEmail = (req, res, next) => {
  try {
    User.findById(req.body.user)
      .then(async (user) => {
        if (user.emailCode === req.body.code) {
          user.emailVerified = true;
          await user.save();
          return res.status(200).json({
            message: "Email Verified",
          });
        } else {
          return res.status(400).json({
            message: "Wrong Code Entered",
          });
        }
      })
      .catch((err) => {
        res.status(400).json({
          message: err,
        });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
exports.updatePlan = (req, res, next) => {
  try {
    const { userId, plans } = req.body;

    plans.map(async (obj) => {
      User.findById(userId)
        .populate("plans.plan")
        .then(async (user) => {
          if (user.plans.length > 0) {
            const dbPlan = await Plan.findById(obj.plan);
            const index = user.plans.findIndex((plan) =>
              plan.plan.library.equals(dbPlan.library)
            );
            if (index === -1) {
              user.plans = [...user.plans, obj];
            } else {
              let tempPlan = {
                plan: user.plans[index].plan._id,
                active: false,
              };
              user.oldPlans = [...user.oldPlans, tempPlan];
              user.plans[index] = obj;
            }
            Sales.create(
              {
                user: userId,
                plan: obj.plan,
                amount: dbPlan.price,
              },
              async (err, doc) => {
                await user.save();
              }
            );
          } else {
            user.plans = plans;
            await user.save();
            return res.status(200).json({
              message: "Plan Upgraded",
            });
          }
        })
        .catch((err) => {
          res.status(400).json({
            message: err,
          });
        });
    });

    // User.findById(userId)
    //   .populate("plans.plan")
    //   .then(async (user) => {
    //     if (user.plans.length > 0) {
    //       Promise.all(
    //         plans.map(async (obj) => {
    //           const dbPlan = await Plan.findById(obj.plan);
    //           const index = user.plans.findIndex((plan) =>
    //             plan?.plan.library
    //               ? plan?.plan?.library?.equals(dbPlan.library)
    //               : false
    //           );
    //           if (index === -1) {
    //             user.plans = [...user.plans, obj];
    //           } else {
    //             user.oldPlans = [
    //               ...user.oldPlans,
    //               { ...user.plans[index], active: false },
    //             ];
    //             user.plans[index] = obj;
    //           }
    //           await user.save();
    //         })
    //       ).then(() => {
    //         return res.status(200).json({
    //           message: "Plan Upgraded",
    //           user,
    //         });
    //       });
    //     } else {
    //       user.plans = plans;
    //       await user.save();
    //       return res.status(200).json({
    //         message: "Plan Upgraded",
    //       });
    //     }
    //   })
    //   .catch((err) => {
    //     res.status(400).json({
    //       message: err,
    //     });
    //   });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.searchUsers = async (req, res) => {
  try {
    // console.log(`req.body`, req.body);
    User.find({
      $or: [
        { firstName: { $regex: req.body.name, $options: "i" } },
        { lastName: { $regex: req.body.name, $options: "i" } },
      ],
      libraries: { $in: req.body.libraries },
    })
      .populate("libraries plans.plan oldPlans.plan")
      .select("-password -otpCode -emailCode -passwordRecoveryToken")
      .then((users) => {
        res.status(200).json(users);
      });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};
