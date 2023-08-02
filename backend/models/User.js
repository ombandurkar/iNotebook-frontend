const mongoose = require('mongoose');
const { Schema } = mongoose;

//abhi hum user ke liye ke schema banayege

const userSchema = new Schema({
    name:{
        type: String,
        required : true
    },
    email:{
        type: String,
        required : true,
        unique: true
    },
    password:{
        type: String,
        required : true
    },
    date:{
        type: Date,
        default: Date.now
    },
  });

  //mongoose.model means mongoose se ke model banaunga, usme model ka (naam rahega, ek schema rahega)
const User = mongoose.model('user', userSchema);
module.exports = User