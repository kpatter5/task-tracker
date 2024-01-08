const mongoose = require('mongoose');
const { Schema } = mongoose;
const validator = require('validator');

const commentSchema = new mongoose.Schema({
    firstName: 
    {
        type: String,
        maxLength: 30,
        required: true
    },
    lastName:
    {
        type: String,
        maxLength: 30,
        required: true
    },
    email: 
    {
        type: String,
        min: 6,
        max: 75,
        validate: [validator.isEmail, "Invalid email"],
        required: true
    },
    message: {
        type: String,
        minLength: 2,
        maxLength: 500,
        required: true
    }
})

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;