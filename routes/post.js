const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require('../middleware/requireLogin');
const Post = mongoose.model("Post");

router.get('/allpost', requireLogin, function(req, res){
  Post.find()
  .populate("postBy", "_id name")
  .populate("comments.postBy", "_id name")
  .sort('-createdAt')
  .then(posts =>{
    res.json({posts});
  })
  .catch(err=>{
    console.log(err);
  })
})

router.post('/createpost', requireLogin, function(req,res){
  const{title, body, pic} = req.body;
  if(!title || !body || !pic){
    return res.status(422).json({error: "Please include all Fields"});
  }
  //req.user.password = undefined;
  const post = new Post({
    title,
    body,
    photo: pic,
    postBy: req.user
  })
  post.save().then(result => {
    res.json({post: result});
  })
  .catch(err => {
    console.log(err);
  })
})

router.get('/mypost',requireLogin,(req,res)=>{
    Post.find({postBy:req.user._id})
    .populate("PostBy","_id name")
    .then(mypost=>{
        res.json({mypost})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.put('/like', requireLogin, (req,res)=>{
  Post.findByIdAndUpdate(req.body.postId,{
    $push:{likes:req.user._id}
  },{
    new: true
  }).exec((err,result)=>{
    if(err){
      return res.status(422).json({error:err})
    }
    else{
      res.json(result)
    }
  })
})


router.put('/unlike', requireLogin, (req,res)=>{
  Post.findByIdAndUpdate(req.body.postId,{
    $pull:{likes:req.user._id}
  },{
    new: true
  }).exec((err,result)=>{
    if(err){
      return res.status(422).json({error:err})
    }
    else{
      res.json(result)
    }
  })
})


router.put('/comment', requireLogin, (req,res)=>{
  const comment = {
    text:req.body.text,
    postBy: req.user._id
  }
  Post.findByIdAndUpdate(req.body.postId,{
    $push:{comments:comment}
  },{
    new: true
  })
  .populate("comments.postBy", "_id name")
  .populate("postBy", "_id name")
  .exec((err,result)=>{
    if(err){
      return res.status(422).json({error:err})
    }
    else{
      res.json(result)
    }
  })
})

router.delete('/deletePost/:postId', requireLogin, (req,res)=>{
  Post.findOne({_id:req.params.postId})
  .populate("postBy", "_id")
  .exec((err,post)=>{
    if(err || !post){
      return res.status(422).json({error:err})
    }
    if(post.postBy._id.toString() == req.user._id.toString()){
      post.remove()
      .then(result =>{
        res.json(result)
      }).catch(err =>{
        console.log(err);
      })
    }
  })
})

module.exports = router;
