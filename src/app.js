const express = require("express")

const app = express()

app.use("/hello", (req, res) => {
    res.send("Hellooooo!!")
})

app.use("/", (req, res) => {
    res.send("Welcome!!")
})

app.listen(7777, (req,res) => {
    console.log("Server running at port 7777");
    
})