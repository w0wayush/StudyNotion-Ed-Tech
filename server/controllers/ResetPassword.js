const User = require("../models/User");
const jst = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

//restPasswordToken
exports.resetPasswordToken = async (req, res) => {
  try {
    //fetch email
    const email = req.body.email;

    //get the userDetails from db using email
    const user = await User.findOne({ email });

    //if no entry is found in email
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Your Email is not registered with us",
      });
    }

    //create random token
    const token = crypto.randomUUID();

    //update user by adding token and expiration time
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resentPasswordExpires: Date.now() + 5 * 60 * 1000,
      },
      { new: true }
    );

    //create url
    const url = `http://localhost:3000/update-password/${token}`;

    //send mail containing the reset password url
    await mailSender(
      email,
      "Password dReset Link",
      `Password Reset Link : ${url}`
    );

    //return response
    return res.status(200).json({
      success: true,
      message: "Email sent successfully, please check email and reset password",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while sending reset password mail",
    });
  }
};

//resetPassword
exports.resetPassword = async (req, res) => {
  try {
    //fetch data
    const { password, confirmPassword, token } = req.body;

    //check if password matching with confirmPassword
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password not matching",
      });
    }

    //get userDETAILS FROM DB USING TOKEN
    const userDetails = await User.findOne({ token: token });

    //IF user not present
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "Invalid Token",
      });
    }

    //token time check
    if (userDetails.resentPasswordExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Token is expired please regenerate token",
      });
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //update db with new password
    await User.findOneAndUpdate(
      { token: token },
      { password: hashedPassword },
      { new: true }
    );

    //return successful response
    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while reseting password",
    });
  }
};
