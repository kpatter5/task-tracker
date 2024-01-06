const mongoose = require('mongoose');
const { Schema } = mongoose;

const taskSchema = new mongoose.Schema({
    name: 
    {
        type: String,
        /* Set a max length */
        maxLength: 50,
        required: true
    },
    owner:
    {
        type: String,
        maxLength: 30,
        required: true
    },
    percentComplete: 
    {
        type: Number,
        min: 0,
        max: 100,
        required: true
    },
    dueDate: {
        type: String,
        pattern: "[0-9]{2}/[0-9]{2}/[0-9]{4}",
        minLength: 10,
        maxLength: 10,
        required: true
    },
    project: 
    {
        type: Schema.Types.ObjectId, 
        ref: 'Project', 
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;