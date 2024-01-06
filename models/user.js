const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const { Schema } = mongoose;
const validator = require('validator');

const userSchema = mongoose.Schema({
    email:
    {
        type: String,
        required: true,
        min: 6,
        max: 75,
        validate: [validator.isEmail, "Invalid email"],
        unique: true
    },
    projects: 
    {
        type: [Schema.Types.ObjectId], 
        ref: 'Projects', 
        default: [],
        maxLength: 20,
        required: false
    },
    tasks:
    {
        type: [Schema.Types.ObjectId], 
        ref: 'Tasks', 
        default: [], 
        maxLength: 50,
        required: false
    }
});

// Adds to UserSchema a username (unique, required) and password (required) field
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema); 
module.exports = User;