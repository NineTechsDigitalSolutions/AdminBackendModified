const Librarian = require("../models/Librarian");
const Admin = require("../models/Admin");

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

exports.createLibrarian = (req, res, next) => {
  try {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;

    Librarian.findOne({ email }).then(async (user) => {
      if (user) {
        return res.status(400).json({
          message: "Librarian with same email already exists",
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
            Librarian.create(payload)
              .then(() => {
                return res.status(200).json({
                  message: "Librarian Registered Succesfully",
                });
              })
              .catch((err) => {
                console.log(err);
                return res.status(500).json({
                  message: "Error Registering Librarian",
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

exports.getLibrarians = async (req, res) => {
  try {
    Librarian.find()
      .populate("libraries")
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
exports.getLibrariansByLibrary = async (req, res) => {
  try {
    Librarian.find({ libraries: { $in: req.body.libraries } })
      .populate("libraries")
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
exports.getLibrarianById = async (req, res) => {
  try {
    Librarian.findById(req.params.id)
      .populate("libraries")
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
exports.getLibrariansByStatus = async (req, res) => {
  try {
    Librarian.find({ status: req.body.status })
      .populate("libraries")
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
exports.changeStatus = (req, res, next) => {
  try {
    Librarian.findById(req.params.id)
      .then(async (user) => {
        user.status = !user.status;
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
exports.updateLibrarian = (req, res, next) => {
  try {
    Librarian.findByIdAndUpdate(req.body.id, req.body, { new: true })
      .then(async () => {
        res.status(200).json({
          message: "Librarian Profile Updated",
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
  let userType = "";

  Librarian.findOne({ email })
    .populate("libraries")
    .select("-otpCode -emailCode -passwordRecoveryToken")
    .then(async (user) => {
      if (!user) {
        const admin = await Admin.findOne({ email });
        if (admin) {
          loadedUser = admin;
          userType = "admin";
          return bcrypt.compare(password, admin.password);
        } else {
          const error = new Error("No user found by this email");
          error.statusCode = 401;
          throw error;
        }
      }
      loadedUser = user;
      userType = "librarian";
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
          type: userType,
        },
        "4=?ADE56GJMC2%7&kF%HTqy8CfTZuj5e2aTKy2g!^F-W%7uP$cUqfuWcQxyVP*ez"
      );

      res.status(200).json({
        message: "Logged In Succesfully",
        token: token,
        user: loadedUser,
        userType,
      });
    })
    .catch((err) => {
      console.log(err);
      if (err.statusCode === 401) {
        res.status(401).json({
          message: "No Librarian/Admin found by this email",
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
      Librarian.findById(user, (err, doc) => {
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
    Librarian.findById(req.body.user)
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
    Librarian.findById(req.body.user)
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

exports.searchLibrarians = async (req, res) => {
  try {
    Librarian.find({
      $or: [
        { firstName: { $regex: req.body.name, $options: "i" } },
        { lastName: { $regex: req.body.name, $options: "i" } },
      ],
      libraries: { $in: req.body.libraries },
    })
      .populate("libraries")
      .select("-password -otpCode -emailCode -passwordRecoveryToken")
      .then((librarians) => {
        res.status(200).json(librarians);
      });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};
