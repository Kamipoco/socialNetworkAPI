const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { route } = require('./auth');
const requireLogin = require('../middleware/requireLogin');
const Post = mongoose.model("Post");

router.get('/messages', requireLogin, (req, res) => { 
  Post.find({postedBy: req.user._id})
  .populate("PostedBy", "_id name")
  .then((mypost) => {
    res.status(200).json({mypost});
  })
  .catch((err) => {
    console.log(err);
  });
});

module.exports = router;