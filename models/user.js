const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;
const userSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
  },
  email:{
    type:String,
    required:true
  },
  password: {
    type:String,
    required: true,
  },
  resetToken:String,
  expireToken: Date,
  pic:{
    type:String,
    url: "https://res.cloudinary.com/cooksheet/image/upload/v1629597878/PngItem_1503945_hilaho.png"
  }
});

mongoose.model("User", userSchema);
