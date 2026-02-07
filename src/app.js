const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
var cookieParser = require("cookie-parser");
var jwt = require("jsonwebtoken");
const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request")
const userRouter = require("./routes/user")
const cors = require("cors")
const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/", userRouter)

connectDB()
  .then(() => {
    console.log("Connected to DB");
    app.listen(7777, (req, res) => {
      console.log("Server running at port 7777");
    });
  })
  .catch((err) => {
    console.error("Cannot connect to DB");
  });
