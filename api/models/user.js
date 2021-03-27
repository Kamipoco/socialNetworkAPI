const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String

    },
    isVerified: {
        type: Boolean,
        default: false
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resetToken: String,
    expireToken: Date,
    avatarUrl: {
        type: String,
        default: "https://res.cloudinary.com/aloapp/image/upload/v1610380920/mlt0h7o7snls0mocswsu.jpg"
    },
    bio: {
        type: String,
        default: ""
    },
    followers: [{
        type: ObjectId,
        ref: "User"
    }],
    following: [{
        type: ObjectId,
        ref: "User"
    }]
});

mongoose.model('User', userSchema);