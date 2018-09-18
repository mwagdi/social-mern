const express = require('express');
const router = express.Router();
const multer = require('multer');
const passport = require('passport');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname + Date.now() + '.jpg');
    }
});
const fileFilter = (req,file,cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "video/mp4"){
        cb(null,true);
    }
    else{
        cb(null,false);
    }
}
const upload = multer({ storage: storage, fileFilter: fileFilter });

// @route  GET api/posts/
// @desc   Get all posts
// @access Private
router.get('/:page', passport.authenticate('jwt', { session: false }),(req, res) => {
    const errors = {};
    const perPage = 10;
    const page = req.params.page || 1;
    Post.find({user: {$in:[...req.user.following,req.user.id]}})
        .populate('user', ['name', 'avatar'])
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .sort({date: -1})
        .then(posts => {
            res.json(posts);
        })
        .catch(err => res.status(404).json(err));
});

// @route  POST api/posts/
// @desc   Create post
// @access Private
router.post('/', passport.authenticate('jwt', { session: false }),upload.array('media',12),(req, res,next) => {
    let media = [];
    for(let i=0;i<req.files.length;i++){
        media.push(req.files[i].path);
    }
   
    const newPost = new Post({
        user: req.user.id,
        text: req.body.text,
        tagged: req.body.tagged,
        media
    });
    newPost.save()
        .then(post => res.json(post))
        .catch(err => console.log(err));
});

// @route  PUT api/posts/like
// @desc   Like a post
// @access Private
router.put('/like', passport.authenticate('jwt', { session: false }),(req,res,next) => {
    Post.findByIdAndUpdate(req.body.post, { $push: { likes: req.user.id } })
    .then(post => res.json(post));
});

// @route  PUT api/posts/unlike
// @desc   Unlike a post
// @access Private
router.put('/unlike', passport.authenticate('jwt', { session: false }),(req,res,next) => {
    Post.findByIdAndUpdate(req.body.post, { $pull: { likes: req.user.id } })
    .then(post => res.json(post));
});

// @route  PUT api/posts/comment
// @desc   Comment on a post
// @access Private
router.put('/comment', passport.authenticate('jwt', { session: false }),(req,res,next) => {
    const { post,text,date } = req.body;
    Post.findByIdAndUpdate(post, { $push: { comment: {user: req.user.id,text,date} } })
    .then(post => res.json(post));
});

module.exports = router;