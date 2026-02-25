const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { validateSignupData } = require("../utils/helpers");
const User = require("../models/user");
const saltRounds = 10;

router.post("/signup", async (req, res) => {
  try {
    validateSignupData(req.body);
    const {
      firstName,
      lastName,
      emailId,
      password,
      age,
      gender,
      about,
      skills,
    } = req.body;
    //Encrypt the password
    const hashPassword = await bcrypt.hash(password, saltRounds);

    //   Creating new instance of User model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
      age,
      gender,
      about,
      skills,
    });
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Error saving the user: " + err.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    console.log(user);

    if (!user) {
      throw new Error("Incorrect credentials");
    }
    let isCorrectPassword = await user.validatePassword(password);

    if (isCorrectPassword) {
      // create a jwt token
      let token = await user.getJWT();

      // add the token to cookie and send the response back to the user
      res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 8 * 3600000), // cookie will be removed after 8 hours
      });
      res.send(user);
    } else {
      throw new Error("Incorrect credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

router.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout successful");
});

module.exports = router;
