const express = require("express")
const router = express.Router()
const userAuth = require("../middlewares/auth");

router.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    res.send("Connetion request sent");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = router