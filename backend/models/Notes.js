const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotesSchema = new Schema({

    //koi dusra user kisi dusre user ke notes na dekhe, hence we have to associate a user with their notes
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'  //reference model iske liye user rahega
    },

    title:{
        type: String,
        required : true
    },
    description:{
        type: String,
        required : true
    },
    tag:{
        type: String,
        default: "General"
    },
    date:{
        type: Date,
        default: Date.now
    },
  });
  
//mongoose.model means mongoose se ke model banaunga, usme model ka (naam rahega, ek schema rahega)
// const Notes  = mongoose.model('notes', NotesSchema);
// module.exports = Notes;

module.exports = mongoose.model('notes', NotesSchema);