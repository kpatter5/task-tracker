const userLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You must log in first.");
        return res.redirect("/login");
    }
    next();
}

// If a user is not logged in on a protected route, save the route the user was requesting from 
// so that it can be later redirected to. 
const saveReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports = {userLoggedIn, saveReturnTo};