const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
      trim: true,
    },
    lastName: String,
    emailId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email ID");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a strong password");
        }
      },
    },
    age: { type: Number, min: 18 },
    gender: {
      type: String,
      // validate: {
      //   validator: function(value){
      //     if (!["female", "male", "others"].includes(value)) {
      //     throw new error("Invalid gender");
      // }
      //   }
      // }
      validate(value) {
        if (!["female", "male", "others"].includes(value)) {
          throw new Error("Invalid gender");
        }
      },
    },
    about: { type: String, default: "This is about of this person" },
    skills: { type: [String] },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.getJWT = async function () {
  const user = this
  const token = jwt.sign({ userID: user._id }, "DEV@Connect", {
    expiresIn: "7d",
  });
  return token
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const passwordHash = this.password
  return await bcrypt.compare(passwordInputByUser, passwordHash);
}

const User = mongoose.model("User", userSchema);

module.exports = User;
