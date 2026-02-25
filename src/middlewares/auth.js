const User = require("../models/user");
var jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    let token = req.cookies.token;
    console.log(token);

    if (!token) {
      throw new Error("Invalid token");
    }
    let decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userID);

    if (!req.user) {
      throw new Error("User does not exist");
    }
    next()
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};

module.exports = userAuth
