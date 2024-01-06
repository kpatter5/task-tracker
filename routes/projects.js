const express = require('express');
const router = express.Router();
const CustomError = require('../public/utilities/CustomError');
const catchAsync = require('../public/utilities/CatchAsync');

const Project = require('../models/project');
const User = require('../models/user');
const Task = require('../models/task');

const {joiProjectSchema} = require('../models/schemas');

const { userLoggedIn } = require('../public/utilities/middleware');

router.get('/', userLoggedIn, catchAsync(async(req, res, next) =>
{
    const projects = await Project.find();
    // For Testing Only:
    // await Project.deleteMany({});

    res.render('projects/projects', {projects});
}))

router.get('/new', userLoggedIn, (req, res, next) =>
{
    res.render('projects/new');
})

router.post('/new', userLoggedIn, catchAsync(async(req, res, next) =>
{
    const { projectName, finishDate, members, percentComplete, user: userId} = req.body; 
    var membersList = members.split(',');
    membersList.forEach(member => {
        member = member.trimStart();
        member = member.trimEnd();
    });

    // Validate form data
    const result = joiProjectSchema.validate({projectName: projectName, finishDate: finishDate, members: membersList, percentComplete: percentComplete, user: userId}, {abortEarly: false});
    if (result.error)
    {
        const errMsg = result.error;
        return next(new CustomError(400, errMsg));
    }

    const user = await User.findOne({_id: userId});
    if (!user)
        return next(new CustomError(500, 'Could not find user'));

    const newProject = new Project({projectName: projectName, finishDate: finishDate, members: membersList, percentComplete: percentComplete, user: userId})
    const saved = await newProject.save();
    if (!saved)
        return next(new CustomError(500, 'Could not create project'));
    
    // Save new project to current user
    var currentProjects = await user.projects;
    currentProjects.push(newProject._id);
    const updated = await User.updateOne({_id: user._id}, {projects: currentProjects});

    if (!updated)
        return next(new CustomError(500, 'Could not update projects'));

    res.redirect('/projects');
}))

router.get('/edit', userLoggedIn, catchAsync(async(req, res, next) => 
{
    const user = await User.findOne({username: req.user.username});
    const projects = await Project.find({user: user._id});
    if (!projects)
        console.log("No projects...");
     
    res.render('projects/edit', {projects});
}))

router.delete('/:id', userLoggedIn, catchAsync(async(req, res, next) =>
{
    const user = await User.findOne({username: req.user.username});

    if (!user)
        return next(new CustomError(500, 'Could not find user'));

    var projects = await Project.find({user: user._id});
    const {id} = req.params;
    if (!id)
        return next(new CustomError(500, 'Could not find project'));

    const deletedProjects = await Project.findOneAndDelete({_id: id, user: user._id});
    const deletedTasks = await Task.deleteMany({project: id, user: user._id });

    if (!deletedProjects || !deletedTasks )
        return next(new CustomError(500, 'Could not delete project'));

    projects = await Project.find({user: user._id});
    res.render('projects/edit', {projects});
}))

router.all('*', (req,res,next) => {
    return next(new CustomError('404', 'Page not found'));
})

router.use((err, req, res, next) => {
    const {statusCode = 500, message = "Something went wrong in tasks"} = err;
    return next(new CustomError(statusCode, message));
})

module.exports = router;
