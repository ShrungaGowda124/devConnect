const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/auth");
const User = require("../models/user");
const { validateEditData } = require("../utils/helpers");
const bcrypt = require("bcrypt");

router.get("/profile", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

router.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (validateEditData(req)) {
      let currentUser = req.user;
      console.log(currentUser);

      const keys = Object.keys(req.body);
      keys.forEach((field) => (currentUser[field] = req.body[field]));

      await currentUser.save();
      res.json({
        message: "Your profile updated successfuly",
        data: currentUser,
      });
    } else {
      throw new Error("Cannot edit the given fields");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

router.patch("/profile/password", userAuth, async (req, res) => {
  try {
    // TO DO: prevent users from setting the same password again.
    let loggedinUser = req.user;
    let loggInUserPassword = loggedinUser.password;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new Error("Both passwords are required");
    }

    let isCorrectPassword = await bcrypt.compare(
      currentPassword,
      loggInUserPassword,
    );
    if (isCorrectPassword) {
      loggedinUser.password = await bcrypt.hash(newPassword, 10);
      await loggedinUser.save();
      res.send("Password changed successfully");
    } else {
      throw new Error("Current password is incorrect");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = router;
