const mongoose = require("mongoose")

async function connectDB() {
    await mongoose.connect("mongodb+srv://shrungavs:GIKzj6bxoPxV1Nd4@namastenode.hgocblp.mongodb.net/devConnect")
}

module.exports = connectDB


