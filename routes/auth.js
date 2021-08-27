const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = mongoose.model("User");
const {JWT_SECRET} = require("../config/keys");
const requireLogin = require("../middleware/requireLogin");
const nodemailer = require("nodemailer")
const sendGridTransport = require("nodemailer-sendgrid-transport")
const {SENDGRID_API,EMAIL} = require('../config/keys')

const transporter = nodemailer.createTransport(sendGridTransport({
  auth: {
    api_key: SENDGRID_API
  }
}))

router.post("/signup", function(req, res){
  const {name, email, password, pic} = req.body;
  if(!email || !password || !name){
    return res.status(422).json({error: "Please include all Fields"});
  }
  User.findOne({email:email})
  .then((savesUser) => {
    if(savesUser){
      return res.status(422).json({error: "User already exists"});
    }
    bcrypt.hash(password, 12)
    .then(hashedpassword => {
        const user = new User({
          email,
          password:hashedpassword,
          name,
          pic: pic
        })
        user.save()
        .then(user=>{
          transporter.sendMail({
            to:user.email,
            from: "anuskatitli2001@gmail.com",
            subject: "Signup Succesfully",
            html:`<h1>Welcome to CookSheet, Let's get Cooking!!</h1>
            <h5>Do not reply to this Email</h5>
            `
          })
          res.json({message: "Saved Success"});
        })
        .catch(err => {
          console.log(err);
        })

    })

  })
  .catch(err => {
    console.log(err);
  })
});

router.post("/signin", (req, res)=>{
  const {email, password} = req.body

  if(!email || !password){
    return res.status(422).json({
      error:"Please provide Email and Password"
    });
  }
  User.findOne({
    email:email})
    .then(savedUser => {
    if(!savedUser){
      return res.status(422).json({error: "Invalid Email or Password"});
    }
    bcrypt.compare(password,savedUser.password)
          .then(doMatch=>{
              if(doMatch){
                  // res.json({message:"successfully signed in"})
                 const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                 const {_id,name,email,pic} = savedUser
                 res.json({token,user:{_id,name,email,pic}})
              }
              else{
                  return res.status(422).json({error:"Invalid Email or password"})
              }
          })
          .catch(err=>{
              console.log(err)
          })
      })
    })

router.post('/reset-password', (req,res)=>{
  crypto.randomBytes(32,(err,buffer)=>{
    if(err){
      console.log(err);
    }
    const token = buffer.toString("hex")
    User.findOne({email: req.body.email})
    .then(user=>{
      if(!user){
        return res.status(422).json({error: "No User with that Email"})
      }
      user.resetToken = token
      user.expireToken = Date.now() + 3600000
      user.save().then((result)=>{
        transporter.sendMail({
          to:user.email,
          from:"anuskatitli2001@gmail.com",
          subject: "Password Reset",
          html: `
          <p>You requested for Password Reset</p>
          <h5>Click on this <a href="${EMAIL}/reset/${token}">Link</a> to reset Password</h5>
          `
        })
        res.json({message: "Check your Email"})
      })
    })
  })
})

router.post('/new-password', (req,res)=>{
  const newPassword = req.body.password
  const sentToken = req.body.token
  User.findOne({resetToken: sentToken, expireToken:{$gt:Date.now()}})
  .then(user =>{
    if(!user){
      return res.status(422).json({error: "Try Again, Session Expired!"})
    }
    bcrypt.hash(newPassword, 12).then(hashedpassword =>{
      user.password = hashedpassword
      user.resetToken = undefined
      user.expireToken = undefined
      user.save().then((savedUser)=>{
        res.json({message:"Password Updated Succesfully"})
      })
    })
  }).catch(err=>{
    console.log(err);
  })
})


module.exports = router;
