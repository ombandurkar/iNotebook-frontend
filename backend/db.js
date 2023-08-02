//database se connenct hone waala code hum yaha par likhege

const mongoose = require('mongoose');
// const mongoURI = "mongodb://localhost:27017/" -> by using this, youu app crashes within every 1 min if you leave it idle
const mongoURI = "mongodb://127.0.0.1:27017/iNotebooK"

const connectToMongo = () => {
    mongoose.connect(mongoURI);
    console.log("Conncted to Mongo sucessfully!");
}

module.exports = connectToMongo;