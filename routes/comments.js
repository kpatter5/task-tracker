const express = require('express');
const router = express.Router();

const catchAsync = require('../public/utilities/CatchAsync');
const CustomError = require('../public/utilities/CustomError');

const { userLoggedIn, saveReturnTo } = require('../public/utilities/middleware');
const Comment = require('../models/comment');

router.post('/', userLoggedIn, catchAsync(async(req, res) => {
    req.flash("success", "Feedback submitted!");
    res.redirect('/');
}))

router.all('*', (req,res,next) => {
    return next(new CustomError(404, 'Page not found'));
})

router.use((err, req, res, next) => {
    const {statusCode = 500, message = "Something went wrong in tasks"} = err;
    return next(new CustomError(statusCode, message));
})


module.exports = router;