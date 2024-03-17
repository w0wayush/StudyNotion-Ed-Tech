const User = require("../models/User");
require("dotenv").config();
const jwt = require("jsonwebtoken");

//auth
exports.auth = async (req, res, next) => {
  try {
    //fetch token from any of the 3 places
    const token =
      req.body.token ||
      req.cookie.token ||
      req.header("Authorisation").replace("Bearer ", "");

    //if token not found
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token is missing",
      });
    }

    //verify that token using JWT_SECRET
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decode);
      req.user = decode;
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Token is Invalid",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while validating token",
    });
  }
};

//isStudent
exports.isStudent = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Student") {
      return res.status(401).json({
        success: false,
        message: "This is protected rooute for Students only",
      });
    }
  } catch (error) {
    return (
      res.status(500),
      json({
        success: false,
        message: "User role cannot be verified please try again",
      })
    );
  }
};

//isInstructor
exports.isInstructor = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Instructor") {
      return res.status(401).json({
        success: false,
        message: "This is protected rooute for Instructor only",
      });
    }
  } catch (error) {
    return (
      res.status(500),
      json({
        success: false,
        message: "User role cannot be verified please try again",
      })
    );
  }
};

//isAdmin
exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "This is protected rooute for Admin only",
      });
    }
  } catch (error) {
    return (
      res.status(500),
      json({
        success: false,
        message: "User role cannot be verified please try again",
      })
    );
  }
};
