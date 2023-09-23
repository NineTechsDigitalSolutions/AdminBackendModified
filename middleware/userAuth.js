const jwt = require("jsonwebtoken");

//const Employee = require("../models/Employee");
const Admin = require("../models/Admin");
const Librarian = require("../models/Librarian");

module.exports = (req, res, next) => {
  //   console.log(token);

  let decodedToken = "";
  try {
    let token = req.get("Authorization");
    if (token) {
      token = token.split(" ")[1];
      decodedToken = jwt.verify(
        token,
        "4=?ADE56GJMC2%7&kF%HTqy8CfTZuj5e2aTKy2g!^F-W%7uP$cUqfuWcQxyVP*ez"
      );
    }
  } catch (err) {
    err.statusCode = 401;
    err.message = "login token not verified";
    res.status(401).json({
      message: err.message,
    });
    throw err.message;
  }

  if (!decodedToken) {
    const err = new Error("Not Authenticated");
    err.statusCode = 401;
    err.message = "User Not Authenticated";
    res.status(401).json({
      message: err.message,
    });
    throw err.message;
  } else {
    // Check if the user is an Admin
    Admin.findById(decodedToken.userId)
      .then((admin) => {
        if (admin) {
          // The user is an Admin
          req.userId = decodedToken.userId;
          req.type = decodedToken.type;
          req.department = decodedToken.department;
          req.departmentId = decodedToken.departmentId;
          req.isAdmin = true; // You can set a flag to indicate admin status
          next();
        } else {
          // If not an Admin, check if the user is a Librarian
          Librarian.findById(decodedToken.userId)
            .then((librarian) => {
              if (librarian) {
                // The user is a Librarian
                req.userId = decodedToken.userId;
                req.type = decodedToken.type;
                req.department = decodedToken.department;
                req.departmentId = decodedToken.departmentId;
                req.isLibrarian = true; // You can set a flag to indicate librarian status
                next();
              } else {
                // If neither Admin nor Librarian, respond with "Not Authenticated"
                res.status(401).json("Not Authenticated");
              }
            })
            .catch((err) => {
              res.status(401).json("Not Authenticated");
            });
        }
      })
      .catch((err) => {
        res.status(401).json("Not Authenticated");
      });
  }
  

  // if (!decodedToken) {
  //   const err = new Error("Not Authenticated");
  //   err.statusCode = 401;
  //   err.message = "User Not Authenticated";
  //   res.status(401).json({
  //     message: err.message,
  //   });
  //   throw err.message;
  // } else {
  //   Employee.findById(decodedToken.userId)
  //     .then((user) => {
  //       req.userId = decodedToken.userId;
  //       req.type = decodedToken.type;
  //       req.department = decodedToken.department;
  //       req.departmentId = decodedToken.departmentId;
  //       next();
  //     })
  //     .catch((err) => {
  //       res.status(401).json("Not Authenticated");
  //     });
  // }
};
