const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

router.post("/request/send/:status/:userId", userAuth, async (req, res) => {
  try {
    let fromUserId = req.user._id;
    let toUserId = req.params.userId;
    let status = req.params.status;

    let allowedStatus = ["ignored", "interested"];
    if (!allowedStatus.includes(status)) {
      throw new Error("Not a valid status");
    }

    let isConnectionPresent = await ConnectionRequest.findOne({
      $or: [
        {
          fromUserId,
          toUserId,
        },
        {
          fromUserId: toUserId,
          toUserId: fromUserId,
        },
      ],
    });

    if (isConnectionPresent) {
      return res.status(400).json({ message: "Request already exist" });
    }

    let isToUserPresentInDB = await User.findById(toUserId);
    if (!isToUserPresentInDB) {
      throw new Error("User not present");
    }

    let newConnectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    const data = await newConnectionRequest.save();

    res.json({ message: status, data });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

router.post(
  "/request/reveiw/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      let { status, requestId } = req.params;
      let loggedInUser = req.user;

      let allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      console.log("hello");
      

      let connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser,
        status: "interested"
      });

      if (!connectionRequest) {
        return res.status(404).json({ message: "Request not found" });
      }

      connectionRequest.status = status;

      let data = await connectionRequest.save();
      res.json({ message: `Request ${status}` }, data);
    } catch (err) {
      res.status(400).send("ERROR: ", err.message);
    }
  },
);

module.exports = router;
