//database se connenct hone waala code hum yaha par likhege

const mongoose = require('mongoose');
// const mongoURI = "mongodb://localhost:27017/" -> by using this, youu app crashes within every 1 min if you leave it idle
// const mongoURI = "mongodb://127.0.0.1:27017/iNotebooK"

// const mongoURI = 'mongodb+srv://ombandurkar:%40OmB%237970@cluster0.knbdccl.mongodb.net/iNotebook?retryWrites=true&w=majority'

require('dotenv').config()
const mongoURI = process.env.MONGO_URL

const connectToMongo = () => {
    mongoose.connect(mongoURI);
    console.log("Conncted to Mongo sucessfully!");
}

module.exports = connectToMongo;