const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const morgan = require('morgan');
const CustomError = require('./public/utilities/CustomError');
const methodOverride = require('method-override');
const User = require('./models/user');
// const cors = require('cors');
const flash = require('connect-flash');
const session = require('express-session');
const mongoStore = require("connect-mongo");

if (process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const secret = process.env.SECRET || "s3c3ogh3yx1493";

// Store session in Mongo Atlas database
const databaseUrl = process.env.DATABASE_URL || "mongodb://localhost:27017/taskTrackerApp";
const store = mongoStore.create({
    mongoUrl: databaseUrl,
    touchAfter: 24 * 60 * 60, // refresh after 24 hours (seconds)
    crypto: {
        secret: secret
    }
})

store.on("error", (err) => {
    console.log("Session store error: ", err);
})

// Cookies and sessions
const sessionConfig = {
    store: store,
    secret: secret,
    resave: false,
    saveUninitialized: false,
    cookie:{
        expires: Date.now + 1000 * 60 * 60 *24 * 7, // one week (in milliseconds),
        maxAge: 1000 * 60 * 60 *24 * 7,
        httpOnly: true, // Prevent client-side scripts from accessing cookie (security purposes)
        secure: false
    },  
}

// Enable user logins
const passport = require('passport');
const localPassportStrategy = require('passport-local');

// Expression application 
const app = express();

// Connect to database
mongoose.connect(databaseUrl)
.then( () => {
    console.log("Connected to database");
} )
.catch( (error) => {
    console.log("Oh no - error occured: ");
    console.log(error);
    throw new CustomError(500, 'Could not connect to database');
} )

// Enable layouts (eg. boilerplate.ejs)
app.engine('ejs', ejsMate);

// Enable EJS (views)
app.set('view engine', 'ejs');

// Sets views directory location relative to index.js location
app.set('views', path.join(__dirname, '/views'));

// Parse express request body (req.body)
app.use(express.urlencoded({extended: true})); 

// Allow cross-origin requests (React)
//app.use(cors());

// Allow HTTP requests other than GET/POST
app.use(methodOverride('_method'));

// Log each request to console
app.use(morgan('tiny'));

// Sessions and passport (user logins)
app.use(session(sessionConfig)); 

// Flash messages to page
// This adds a req.flash() method to all the request objects
app.use(flash());

// Route handlers
const taskRoutes = require('./routes/tasks');
const projectRoutes = require('./routes/projects');
const userRoutes = require('./routes/users');

// User login middleware
app.use(passport.initialize());
app.use(passport.session()); // for persistent login sessions ( requires session() )

passport.use(new localPassportStrategy( User.authenticate() ));
passport.serializeUser( User.serializeUser() );
passport.deserializeUser( User.deserializeUser() );

// This must come after passport initialization
app.use(function (req, res, next) {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
});

// Handle routes defined externally
app.use('/tasks', taskRoutes);
app.use('/projects', projectRoutes);
app.use('/', userRoutes);

// Serve static files from public directory
app.use(express.static("public"));

app.get('/', (req, res, next) => {
    res.render('home');
})

app.get('/contact', (req, res, next) => {
    res.render('contact');
});

app.all('*', (req,res,next) => {
    return next(new CustomError(404, 'Page not found'));
})

// Error handling middleware (executes if no other routes matched)
// Default status and message in case express/JS error is thrown (not CustomError object)
app.use((err, req, res, next) => {
    const {statusCode = 500, message} = err;
    if (!err.message) // not a CustomError object (eg. Express error)
    {
        err.message = "Uh oh! Something went wrong." ;
    }
    console.log("err=", err);

    res.status(statusCode);
    res.render('error', { err });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`LISTENING ON PORT ${port}...`);
})