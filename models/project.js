const mongoose = require('mongoose');
const { Schema } = mongoose;

const projectSchema = new mongoose.Schema({
    projectName: 
    {
        type: String,
        /* Set a max length */
        maxLength: 50,
        required: true
    },
    members:
    {
        type: [String],
        maxLength: 30,
        required: true
    },
    finishDate: {
        type: String,
        pattern: "[0-9]{2}/[0-9]{2}/[0-9]{4}",
        minLength: 10,
        maxLength: 10,
        required: true
    },
    percentComplete:
    {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
        required: true
    },
    tasks: 
    {
        type: [Schema.Types.ObjectId], 
        ref: 'Tasks', 
        default: [], 
        minLength: 0,
        maxLength: 2,
        required: false
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;