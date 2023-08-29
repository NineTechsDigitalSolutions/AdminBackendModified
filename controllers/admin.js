const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");

const randomCode = () => {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
};

exports.create = (req, res, next) => {
  try {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;

    if (password.length >= 8) {
      bcrypt.hash(password, 12).then((hashedPassword) => {
        let payload = {
          ...req.body,
          email,
          passwordRecoveryToken: randomCode(),
          password: hashedPassword,
        };
        Admin.create(payload)
          .then(() => {
            return res.status(200).json({
              message: "Admin Registered Succesfully",
            });
          })
          .catch((err) => {
            console.log(err);
            return res.status(500).json({
              message: "Error Registering Admin",
              err,
            });
          });
      });
    } else {
      return res.status(400).json({
        message: "Password must be greater than or equal to 8 characters",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};
