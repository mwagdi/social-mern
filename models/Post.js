const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const fs = require('fs');
const multer = require('multer');

// Create Schema
const PostSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    profile: {
        type: Schema.Types.ObjectId,
        ref: 'profile'
    },
    text: {
        type: String
    },
    tagged: [
        {
            type: Schema.Types.ObjectId,
            ref: 'users'
        }
    ],
    media: [
        {type: String}
    ],
    img: {
        type: String
    },
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'users'
        }
    ],
    comments: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users'
            },
            text: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Post = mongoose.model('posts', PostSchema);