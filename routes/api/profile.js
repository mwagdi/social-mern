const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');


const validateProfileInput = require('../../validation/profile');
 
// Load Profile model
const Profile = require('../../models/Profile');
// Load User model
const User = require('../../models/User');

// @route  GET api/profile/all
// @desc   Get all profiles
// @access Public
router.get('/all', (req, res) => {
    const errors = {};
    Profile.find()
    .populate('user',['name','avatar'])
    .then(profiles => {
        if(!profiles){
            errors.no_profile = 'There are no profiles';
            res.status(400).json(errors);
        }
        else{
            res.json(profiles);
        }
    })
    .catch(err => res.status(404).json(err));
});

// @route  GET api/profile
// @desc   Get current user profile
// @access Private
router.get('/',passport.authenticate('jwt',{ session: false }),(req,res) => {
    const errors = {};
    Profile.findOne({user: req.user.id})
    .populate('user',['name','avatar'])
    .then(profile => {
        if(!profile){
            errors.no_profile = 'There is no profile for this user';
            res.status(404).json(errors)
        }
        else{
            res.json(profile);
        }
    })
    .catch(err => res.status(404).json(err));
});

// @route  GET api/profile/handle/:handle
// @desc   Fetch profile using handle
// @access Public
router.get('/handle/:handle', (req, res) => {
    const errors = {};
    const { handle } = req.params;
    Profile.findOne({ handle })
    .populate('user',['name','avatar'])
    .then(profile => {
        if(!profile){
            errors.no_profile = "Profile does not exist";
            res.status(404).json(errors);
        }
        else{
            res.json(profile);
        }
    })
    .catch(err => res.status(404).json(err));
});

// @route  POST api/profile
// @desc   Create profile
// @access Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors,isValid } = validateProfileInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    // Get fields
    const profileFields = {};

    profileFields.user = req.user.id;
    profileFields.handle = req.body.handle ? req.body.handle : req.user.id;
    profileFields.website = req.body.website ? req.body.website : "";
    profileFields.location = req.body.location ? req.body.location : "";
    profileFields.bio = req.body.bio ? req.body.bio : "";
    profileFields.occupation = req.body.occupation ? req.body.occupation : "";
    profileFields.organization = req.body.organization ? req.body.organization : "";
    
    Profile.findOne({user: req.user.id})
    .then(profile => {
        if(profile){
            // Update
            Profile.findOneAndUpdate({ user: req.user.id },{ $set: profileFields },{ new: true })
            .then(profile => res.json({ profile }));
        }
        else{
            // Create
            // Check if handle exists
            Profile.findOne({ handle: profileFields.handle })
            .then(profile => {
                if(profile){
                    res.status(400).json({ handle: "This is handle already exists" });
                }
                else{
                    const newProfile = new Profile(profileFields);
                    newProfile.save()
                    .then(profile => res.json(profile))
                    .catch(err => console.log(err));
                }
            });
        }
    })
});

module.exports = router;