const Joi = require('joi')
Joi.objectId = require("joi-objectid")(Joi)

const joiTaskSchema = Joi.object({
    name: Joi.string().max(50).required(),
    owner: Joi.string().max(30).required(),
    percentComplete: Joi.number().min(0).max(100).required(),
    dueDate: Joi.string().min(10).max(10).required(),
    project: Joi.objectId().required(),
    user: Joi.objectId().required()
    
},  { abortEarly: false } );

const joiProjectSchema = Joi.object({
    projectName: Joi.string().max(50).required(),
    members: Joi.array().max(30).items(Joi.string()).required(),
    finishDate: Joi.string().min(10).max(10),
    percentComplete: Joi.number().min(0).max(100).required(),
    tasks: Joi.array().max(50).items(Joi.objectId()).optional(),
    user: Joi.objectId().required()
}).required(); 

const joiUserSchema = Joi.object({
    email: Joi.string().max(75).required(),
    username: Joi.string().max(50).required(),
    password: Joi.string().min(8).max(50).required(),
    projects: Joi.array().max(20).items(Joi.objectId()).optional(),
    tasks: Joi.array().max(50).items(Joi.objectId()).optional()
})

module.exports = {joiTaskSchema, joiProjectSchema, joiUserSchema};