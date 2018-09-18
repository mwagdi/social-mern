const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const multer = require('multer');
const getAllUrlParams = require('../../helper');

// Load input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// Load User Model
const User = require('../../models/User');
const Profile = require('../../models/Profile');

const keys = require('../../config/keys');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname + Date.now() + '.jpg');
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
}
const upload = multer({ storage: storage, fileFilter: fileFilter });

// @route   GET api/users/
// @desc    Get all users
// @access  Public
router.get('/', (req,res) => {
    User.find({ name: { "$regex": getAllUrlParams(req.url).search || '', "$options": "i" }}, function (err, users) {
        const userArray = users.map(user => {

            return {
                id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
            }
        })
        res.json({users: userArray});
    });
});

// @route   GET api/users/register
// @desc    Register user
// @access  Public
router.post('/register', upload.single('avatar'),(req,res) => {
    const { errors, isValid } = validateRegisterInput(req.body);
    if(!isValid){
        return res.status(400).json(errors);
    }

    User.findOne({email: req.body.email})
    .then(user => {
        if(user){
            return res.status(400).json({email: 'Email already exists'})
        }
        else{
            const avatar = gravatar.url(req.body.email,{
                s: '200', // Size
                r: 'pg', // Rating
                default: 'mm' // Default
            });
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar: req.file ? req.file.path : avatar,
                password: req.body.password
            });
            bcrypt.genSalt(10,(err,salt) => {
                bcrypt.hash(newUser.password,salt,(err,hash) => {
                    if(err) throw err;
                    newUser.password = hash;
                    newUser.save()
                    .then(user => res.json(user))
                    .catch(err => console.log(err));
                })
            });
        }
    })
})

// @route   GET api/users/login
// @desc    Login user / Returning JWT token
// @access  Public
router.post('/login', (req,res) => {
    const { errors, isValid } = validateLoginInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    // Find user by email
    User.findOne({email})
    .then(user => {
        // Check for user
        if(!user){
            return res.status(404).json({email: "User not found"});
        }

        // Check password
        bcrypt.compare(password,user.password)
        .then(isMatch => {
            if(isMatch){
                // User Matched
                // Create JWT payload
                const payload = {
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar
                }

                // Sign token
                jwt.sign(payload,keys.secret,{expiresIn: 3600},(err,token) => {
                    res.json({
                        success: true,
                        token,
                        expires_in: 3600000
                    })
                });
            }
            else{
                return res.status(400).json({password: "Password incorrect"});
            }
        })
    })
})

// @route   GET api/users/current
// @desc    Get current user
// @access  Private
router.get('/current',passport.authenticate('jwt',{ session: false }),(req,res) => {
    Profile.findOne({user: req.user.id})
    .then(profile => {
        res.json({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            avatar: req.user.avatar,
            date: req.user.date,
            followers: req.user.followers,
            following: req.user.following,
            profile: profile.handle
        });
    })
});

// @route   PUT api/users/follow
// @desc    Follow a user
// @access  Private
router.put('/follow',passport.authenticate('jwt',{ session: false }),(req,res) => {
    const followed = req.body.user;
    const follower = req.user.id;
    User.findByIdAndUpdate(follower, { $push: { following: followed } })
    .then(user => {
        User.findByIdAndUpdate(followed, { $push: { followers: follower } })
        .then(() => res.json(user))
    });
});

module.exports = router;