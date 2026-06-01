var express = require("express");
var app = express();
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var FacebookStrategy = require('passport-facebook').Strategy;
const config = require('./config'); // load configurations file

var User = require("./models/user");

//var seedDB = require("./seeds");

var eventRoutes = require("./routes/events");
var commentRoutes = require("./routes/comments");
var indexRoutes = require("./routes/index");

//Passport configuration
app.use(require("express-session")({
    secret : "Some English words",
    resave: false,
    saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.use(flash());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(new LocalStrategy(User.authenticate()));

passport.use('facebook',new FacebookStrategy({
    clientID: config.facebookAuth.clientID,
    clientSecret: config.facebookAuth.clientSecret,
    callbackURL: config.facebookAuth.callbackURL,
    profileFields: ['public_profile', 'emails']
}, function (accessToken, refreshToken, profile, done) {
    console.log("callbackURL", callbackURL);
    return done(null, profile);
}
)); 

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


///////var URL = process.env.DATABASEURL || "mongodb://localhost/eventize";  /// This is defensive code
mongoose.connect('mongodb://127.0.0.1/eventize', { useCreateIndex: true, useUnifiedTopology: true, useNewUrlParser: true }) //Original code when localDB is used while developing
//mongoose.connect('mongodb://admin:xxxx/eventize', { useCreateIndex: true, useUnifiedTopology: true, useNewUrlParser: true })
.then(res=> {
    console.log("DB Connected!")
}).catch(err => {
    console.log("DB error", err.message);
    console.log(Error, err.message);
});
//////mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true });


//HEROKU DB LINK
//mongoose.connect("mongodb+srv://pranmis:AISH%40usa3@yelpcamp-qtqd8.mongodb.net/yelp_camp?retryWrites=true", { useNewUrlParser: true });

app.use(bodyparser.urlencoded({extended:true}));

app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));

app.use("/",indexRoutes); //nothing common in Index route but so as to match patter here we use "/"
app.use("/events",eventRoutes);
app.use("/events/:id/comments",commentRoutes);

app.use('/favicon.ico', express.static('images/favicon.ico'));
//For Brute force handling
var RateLimit = require('express-rate-limit');
 
app.set('trust proxy', 1); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc) 
 
var apiLimiter = new RateLimit({
  windowMs: 15*60*1000, // 15 minutes 
  max: 100,  //100
});
app.use('/api/', apiLimiter);
//Brute force ends


function terminator(sig){
  if (typeof sig === "string") {
    console.log('%s: Received %s - terminating sample app ...',
                 Date(Date.now()), sig);
    process.exit(1);
  }     
  console.log('%s: Node server stopped.', Date(Date.now()) );
};

process.on('exit', function() { terminator(); });

['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
 'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
].forEach(function(element, index, array) {
  process.on(element, function() { terminator(element); });
});

process.env.PORT = 8081;//comment this line for PRODUCTION
//app.listen(process.env.PORT, process.env.IP,function()
app.listen(process.env.PORT, "0.0.0.0", function ()
{
    console.log("eventize has started. On port ", process.env.PORT);
});