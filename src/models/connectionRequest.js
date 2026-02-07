const mongoose = require("mongoose");
const User = require("./user");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: User // reference to the user collection
    },
    toUserId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: User },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "rejected", "accepted"],
        message: "{VALUE} is incorrect status type",
      },
    },
  },
  { timestamps: true },
);

// index: data structure that improves query performance.
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre("save", function (next) {
  if (this.fromUserId.equals(this.toUserId)) {
    throw new Error("Cannot send request to self");
  }
  // next()
});

const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema,
);

module.exports = ConnectionRequest;
