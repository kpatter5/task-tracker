const express = require('express');
const router = express.Router();
const passport = require('passport');

const User = require('../models/user');
const catchAsync = require('../public/utilities/CatchAsync');
const CustomError = require('../public/utilities/CustomError');

const { userLoggedIn, saveReturnTo } = require('../public/utilities/middleware');
const {joiUserSchema} = require('../models/schemas');
const Project = require('../models/project');
const Task = require('../models/task');

router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register', catchAsync(async(req, res) => {
    try {
        const { email, username, password} = req.body;

        const validated = joiUserSchema.validate({email, username, password});
        if (!validated)
            return next(new CustomError(500, 'Failed to create account'));

        const user = new User({email, username});
        const newUser = await User.register(user, password);

        // Log the user in
        req.login( newUser, (err) => {
            if (err){
                return next(err);
            }
            req.flash("success", "Welcome to Task Tracker!");
            res.redirect('/');
        })

    } catch (err){
        req.flash("error", err.message);
        res.redirect("/register");
    }
}))

router.get('/login', catchAsync(async(req, res) => {
    res.render('users/login');
}))

router.post('/login', saveReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), catchAsync(async(req, res) => {
    req.flash("success", "Welcome back!");
    const returnUrl = res.locals.returnTo || "/";
    delete res.locals.returnTo;
    res.redirect(returnUrl);
}))

router.get('/logout', (req, res, next) => { 
    if (!req.isAuthenticated()){
        req.flash("error", "You are not logged in.");
        return res.redirect("/");
    }

    req.logout( (err) => {
        if (err){
            return next(err);
        }
        req.flash("success", "You successfully logged out.");
        res.redirect("/");
    });
})

router.get('/settings', userLoggedIn, (req, res) => {
   res.render('users/settings'); 
})

router.delete('/user', userLoggedIn, catchAsync(async(req, res, next) => {
    if (!req.user)
        return next(new CustomError(500, 'User does not exist'));

    const user = await User.findOne({username: req.user.username});
    if (!user)
        return next(new CustomError(500, 'Could not delete your account'));
    
    const tasks = await Task.find({user: user._id});
    const deletedTasks = await Task.deleteMany({user: user._id});
    if (!deletedTasks)
        return next(new CustomError(500, 'Could not delete your account'));

    const deletedProjects = await Project.deleteMany({user: user._id});
    if (!deletedProjects)
    {
        // Add the deleted tasks back before abandoning deleting user
        await Task.insertMany(tasks); 
        return next(new CustomError(500, 'Could not delete your account'));
    }

    const deletedUser = await User.findOneAndDelete({username: req.user.username});
    if (!deletedUser)
        return next(new CustomError(500, 'Could not delete your account'));

    res.redirect('/');
}))

router.patch('/email', userLoggedIn, catchAsync(async(req, res, next) => {
    if (!req.user)
        return next(new CustomError(500, 'Could not update your email'));
    
    const { email } = req.body;
    if (!email)
        return next(new CustomError(500, 'Email cannot be empty'));

    const user = await User.findOneAndUpdate({username: req.user.username}, {email: email});
    if (!user)
        return next(new CustomError(500, 'Could not update your email'));

   req.flash("success", "Email successfully changed");
   res.redirect('/');
}))

module.exports = router;