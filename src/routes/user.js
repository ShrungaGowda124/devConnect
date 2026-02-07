const express = require("express");
let router = express.Router();
let userAuth = require("../middlewares/auth");
let ConnectionRequest = require("../models/connectionRequest");
let USER_FIELDS_TO_DISPLAY = "firstName lastName age gender about skills";
const User = require("../models/user")

router.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    let loggedInUser = req.user._id;

    let requestsReceived = await ConnectionRequest.find({
      toUserId: loggedInUser,
      status: "interested",
    }).populate("fromUserId", USER_FIELDS_TO_DISPLAY);
    // ["firstName", "lastName", "age", "gender", "about", "skills"])

    res.json({ requestsReceived });
  } catch (err) {
    res.status(400).send("ERROR: ", err.message);
  }
});

router.get("/user/connections", userAuth, async (req, res) => {
  try {
    let loggedInUser = req.user._id;

    const connectionsData = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser, status: "accepted" },
        { toUserId: loggedInUser, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_FIELDS_TO_DISPLAY)
      .populate("toUserId", USER_FIELDS_TO_DISPLAY);

    let data = connectionsData.map((connection) => {
      if (connection.fromUserId.equals(loggedInUser)) {
        return connection.toUserId;
      }
      return connection.fromUserId;
    });

    res.json({ data });
  } catch (err) {
    res.status(400).send("ERROR: ", err.message);
  }
});

router.get("/user/feed", userAuth, async (req, res) => {
  try {
    let loggedInUser = req.user._id;
    let page = Number(req.query.page) || 1
    let limit = Number(req.query.limit) || 10
    let skip = (page - 1) * limit

    const connections = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser }, { toUserId: loggedInUser }],
    }).select("fromUserId toUserId");

    const hideFeedFrom = new Set();
    connections.forEach((connection) => {
      hideFeedFrom.add(connection.fromUserId.toString());
      hideFeedFrom.add(connection.toUserId.toString());
    });

    const userToDisplay = await User.find({
      $and:[
        {_id: {$nin: Array.from(hideFeedFrom)}},
        {_id: {$ne: loggedInUser}}
      ]
    }).select(USER_FIELDS_TO_DISPLAY).skip(skip).limit(limit)

    res.json({ data: userToDisplay });
  } catch (err) {
    res.status(400).json({ ERROR: err.message });
  }
});

module.exports = router;
