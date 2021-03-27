const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../keys');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { username } = require('../keys');
const { password } = require('../keys');

// const transporter = nodemailer.createTransport(sendgridTransport({
//     auth:{
//         api_key: "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"
//     }
// }));

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: username,
        pass: password
    }
});

router.post('/signup', (req, res) => {
    // console.log(req.body);
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
        return res.status(422).json({errors: 'Please enter all field!'});
    }
    User.findOne({email: email})
        .then((saveUser) => {
            if(saveUser) {
                return res.status(422).json({ status: false, errors: "User already exists with that email!"})
            }
            bcrypt.hash(password, 12)
                .then(hashedpassword => {
                    const user = new User({
                        email,
                        password: hashedpassword,
                        name,
                        pic
                    })
        
                    user.save()
                    .then(user => {
                        transporter.sendMail({ //bug    
                            to:user.email,
                            from:"no-reply@insta.com",
                            subject:"SignUp success",
                            html:`<h1>Welcome to Instagram</h1>`
                        })
                        res.json({ status: 200, message: "Saved successfully!"})
                    })
                    .catch(err => {
                        console.log(err);
                    })
                }) 
                // .catch(err =>{
                //     console.log(err);
                // })
        })
        .catch(err => {
            console.log(err);
        })
});

router.post('/signin', (req, res) => {
    const { email, password } = req.body;
    if(!email || !password && email !== null && password !== null) {
        res.status(422).json({error: "Please add email or password"});
    }
    User.findOne({email: email})
        .then(savedUser => {
            if(!savedUser) {
                res.status(422).json({error: "Invalid Email or Password"});
            }
            bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if(doMatch) {
                        // res.json({message: "successfully signed in"});
                        const token = jwt.sign({_id: savedUser._id}, JWT_SECRET);
                        const {_id, name, email, followers, following, pic, description} = savedUser;
                        res.json({token, status: 200, message: "Login Successfully!", user: {_id, name, email, followers, following, pic, description}});
                    } else {
                        return res.status(422).json({error: "Invalid Email or Password"});
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        });
});

//Forgot Password (Gửi email veryfy -> check rồi nhập mật khẩu mới)
router.post('/reset-password', (req, res) => {
    crypto.randomBytes(32, (err, buffer) => {
        if(err) {
            console.log(err);
        }

        const token = buffer.toString("hex")
        User.findOne({email: req.body.email})
            .then(user => {
                if(!user) {
                    return res.status(422).json({error: "User dont exists with that email"})
                }
                user.resetToken = token
                user.expireToken = Date.now() + 3600000
                user.save()
                    .then((result) => {
                        transporter.sendMail({
                            to:user.email,
                            from: "no-reply@insta.com",
                            subject: "Reset password",
                            html: `
                            <p>You requested for password reset</p>
                            <h5>Click in this <a href="http://localhost:3000/reset/${token}">Link</a>to reset password</h5>
                            `
                        })
                        res.json({status: 200, message: "Check your email"})
                    })
            })
    })
});

module.exports = router;