const express = require('express');
const router = express.Router();
const Project = require('../models/project');
const User = require('../models/user');
const Task = require('../models/task');
const {joiTaskSchema} = require('../models/schemas');

const CustomError = require('../public/utilities/CustomError');
const catchAsync = require('../public/utilities/CatchAsync');
const { userLoggedIn } = require('../public/utilities/middleware');

router.get('/', userLoggedIn, catchAsync(async(req, res, next) =>
{
    const tasks = await Task.find();
    // For Testing Only:
    // await Task.deleteMany({});

    res.render('tasks/all', {tasks});
}))

router.get('/:pid', userLoggedIn, catchAsync(async(req, res, next) =>
{
    const { pid } = req.params;

    const user = await User.findOne({username: req.user.username});
    if (!user)
        return next(new CustomError(500, 'Could not find user'));

    const project = await Project.findOne({_id: pid, user: user._id});
    const projects = await Project.find({user: user._id});

    if (!project || !projects)
        return next(new CustomError(500, 'Could not find project'));

    const tasks = await Task.find({project: project._id});
    if (!tasks)
        return next(new CustomError(500, 'Tasks not found'));

    res.render('tasks/tasks', {tasks, projects, projectId: pid});
}))

router.get('/:pid/new', userLoggedIn, catchAsync(async(req, res, next) =>
{
    const { pid } = req.params;
    res.render('tasks/new', {projectId: pid});
}))

router.post('/:pid/new', userLoggedIn, catchAsync(async(req, res, next) => {
    const { pid } = req.params;
    const { name, owner, percentComplete, dueDate, projectId, userId } = req.body;

    // Validate form data
    const result = joiTaskSchema.validate(req.body);
    if (result.error)
    {
        const errMsg = result.error;
        return next(new CustomError(400, errMsg));
    }

    // Locate project and insert it with task 
    const user = await User.findOne({username: req.user.username});
    if (!user)
        return next(new CustomError(500, 'Could not find user'));

    const project = await Project.findOne({_id: pid, user: user._id});
    if (!project)
        console.log("Could not find project");

    const newTask = new Task({name:name, owner:owner, percentComplete:percentComplete, dueDate:dueDate, project: project._id, user: user._id});
    const saved = await newTask.save();
    if (!saved)
        return next(new CustomError(500, 'Could not create task'));
        
    res.redirect('/tasks/' + pid);
}))

/* Edit a task from Project View page  */
router.get('/:tid/edit', userLoggedIn, catchAsync(async(req, res, next) => {
    const {tid} = req.params;
    console.log("task id = ", tid);
    const user = await User.findOne({username: req.user.username});
    if (!user)
        return next(new CustomError(500, 'Could not find user'));

    const task = await Task.findOne({_id: tid, user: user._id});
    console.log("task=", task);
    if (!task)
        return next(new CustomError(500, 'Could not find task'));
    res.render('tasks/edit-project', {task});
}))

/* Post route from Edit on Project View page */
router.post('/:tid/edit', userLoggedIn, async(req, res, next) => {
    const {tid} = req.params;
    // Ensure form data is valid + display any validation error
    const result = joiTaskSchema.validate(req.body);

    const { name, owner, percentComplete, dueDate, project: projectId, user: userId} = req.body;
    if (result.error)
    {
        const errMsg = result.error;
        return next(new CustomError(400, errMsg));
    }

    if (!userId)
        return next(new CustomError(500, 'Could not find user'));

    // Update task with req.body fields
    const updatedTask = await Task.findOneAndUpdate({_id: tid, user: userId}, {name: name, owner: owner, percentComplete: percentComplete, dueDate: dueDate});
    
    if (!updatedTask)
        return next(new CustomError(500, 'Could not find task'));

    const updated = await updatedTask.save();
    if (!updated)
        return next(new CustomError(500, 'Could not edit task'));

    // Find project ID for redirect 
    if (!projectId)
        return res.redirect('/tasks');

    res.redirect('/tasks/' + projectId);
})

/* Edit a task from View All page  */
router.get('/:tid/all/edit', userLoggedIn, catchAsync(async(req, res, next) => {
    const {tid} = req.params;
    const user = await User.findOne({username: req.user.username});
    if (!user)
        return next(new CustomError(500, 'Could not find user'));

    const task = await Task.findOne({_id: tid, user: user._id});
    res.render('tasks/edit-all', {task});
}))

/* Post route from Edit on View All page */
router.post('/:tid/all/edit', userLoggedIn, async(req, res, next) => {
    const {tid} = req.params;
    // Ensure form data is valid + display any validation error
    const result = joiTaskSchema.validate(req.body);

    const { name, owner, percentComplete, dueDate, project: projectId, user: userId} = req.body;
    if (result.error)
    {
        const errMsg = result.error;
        return next(new CustomError(400, errMsg));
    }

    // Update task with req.body fields
    //const user = await User.findOne({username: req.user.username});
    if (!userId)
        return next(new CustomError(500, 'Could not find user'));

    const updatedTask = await Task.findOneAndUpdate({_id: tid, user: userId}, {name: name, owner: owner, percentComplete: percentComplete, dueDate: dueDate});
    const updated = await updatedTask.save();
    if (!updated)
        return next(new CustomError(500, 'Could not edit task'));

    res.redirect('/tasks');
})

router.delete('/:tid', userLoggedIn, async(req, res, next) => {
    const {tid} = req.params;
    const user = await User.findOne({username: req.user.username});
    if (!user)
        return next(new CustomError(500, 'Could not find user'));

    const foundTask = await Task.findOneAndDelete({_id: tid, user: user._id});
    if (!foundTask)
        console.log("Could not find task");

    if (!foundTask)
        return next(new CustomError(500, 'Could not delete task'));

    // Find project ID for redirect 
    const project = await Project.findOne({task: foundTask._id});
    if (!project)
        return res.redirect('/tasks');

    res.redirect('/tasks/' + project._id);
})

router.delete('/:tid/all', userLoggedIn, async(req, res, next) => {
    const {tid} = req.params;
    const user = await User.findOne({username: req.user.username});
    if (!user)
        return next(new CustomError(500, 'Could not find user'));

    const foundTask = await Task.findOneAndDelete({_id: tid, user: user._id});

    if (!foundTask)
        return next(new CustomError(500, 'Could not delete task'));

    res.redirect('/tasks');
})


router.all('*', (req,res,next) => {
    return next(new CustomError(404, 'Page not found'));
})

router.use((err, req, res, next) => {
    const {statusCode = 500, message = "Something went wrong in tasks"} = err;
    return next(new CustomError(statusCode, message));
})

module.exports = router;
