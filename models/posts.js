const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema.Types;
const postSchema = new mongoose.Schema({
  title:{
    type:String,
    required: true
  },
  body:{
    type: String,
    required: true
  },
  photo:{
    type:String,
    default: true
  },
  likes:[{
    type: ObjectId,
    ref:"User",
  }],
  comments:[{
    text:String,
    postBy:{
      type:ObjectId,
      ref:"User"
    }
  }],
  postBy:{
    type: ObjectId,
    ref: "User"
  }
}, {timestamps:true});

mongoose.model("Post", postSchema);
