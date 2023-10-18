const Librarian = require("../models/Librarian");
const Admin = require("../models/Admin");

const bcrypt = require("bcryptjs");

const randomCode = () => {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
};

exports.forgetPassword = (req, res, next) => {
  const email = req.body.email.toLowerCase();
  let code;
  Librarian.findOne({ email })
    .then(async (user) => {
      if (!user) {
        const admin = await Admin.findOne({ email });
        if (admin) {
          code = admin.passwordRecoveryToken;
          admin.passwordRecoveryToken = randomCode();
          admin.recoveryCode = code;
          admin.save();
          return res.status(200).json({
            message: "Recovery Token has been sent to your email.",
            code,
          });
        } else {
          const error = new Error("No user found by this email");
          error.statusCode = 401;
          throw error;
        }
      }
      code = user.passwordRecoveryToken;
      user.passwordRecoveryToken = randomCode();
      user.recoveryCode = code;
      user.save();
      return res.status(200).json({
        message: "Recovery Token has been sent to your email.",
        code,
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
    const { newPass, ConfirmPass } = req.body;
    const email = req.body.email.toLowerCase();

    if (newPass !== ConfirmPass) {
      return res.status(400).json({
        message: "New & Confirm Password Doesn't Matched",
      });
    } else {
      Librarian.findOne({ email }).then(async (user) => {
        if (!user) {
          const admin = await Admin.findOne({ email });
          if (admin) {
            bcrypt.hash(newPass, 12).then((hashedPassword) => {
              admin.password = hashedPassword;
              admin.save();
              return res.status(200).json({
                message: "Password Changed!",
              });
            });
          } else {
            const error = new Error("No user found by this email");
            error.statusCode = 401;
            throw error;
          }
        } else {
          bcrypt.hash(newPass, 12).then((hashedPassword) => {
            user.password = hashedPassword;
            user.save();
            return res.status(200).json({
              message: "Password Changed!",
            });
          });
        }
      });
    }
  } catch (err) {
    console.log(err);
    if (err.statusCode === 401) {
      res.status(401).json({
        message: "No Librarian/Admin found by this email",
      });
    } else {
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }
};
exports.verifyCode = (req, res, next) => {
  try {
    const code = req.body.code?.toUpperCase();
    const email = req.body.email.toLowerCase();

    Librarian.findOne({ email })
      .then(async (user) => {
        if (!user) {
          const admin = await Admin.findOne({ email });
          if (admin) {
            if (admin.recoveryCode === code) {
              return res.status(200).json({
                message: "Code Verified",
              });
            } else {
              return res.status(400).json({
                message: "Invalid Code",
              });
            }
          } else {
            const error = new Error("No user found by this email");
            error.statusCode = 401;
            throw error;
          }
        } else {
          if (user.recoveryCode === code) {
            return res.status(200).json({
              message: "Code Verified",
            });
          } else {
            return res.status(400).json({
              message: "Invalid Code",
            });
          }
        }
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
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};


exports.sendResponse = async (req, res) => {
  try {
    let awsUrl;
    if (req.awsImages) {
        awsUrl = req.awsImages?.[0];
    }if(req.awsFiles){
        awsUrl = req.awsFiles?.[0];
    }

    if (awsUrl) {
      res.status(200).json({ awsUrl });
    } else {
      res.status(404).json({ message: 'AWS URL not found' });
    }

    
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};
