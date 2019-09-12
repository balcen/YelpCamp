require("dotenv").config();

const express      = require("express"),
app              = express(),
path             = require("path"),
mongoose         = require("mongoose"),
favicon          = require("serve-favicon"),
flash            = require("connect-flash"),
passport         = require("passport"),
LocalStrategy    = require("passport-local"),
methodOverride   = require("method-override"),
bodyParser       = require("body-parser"),
User             = require("./models/user"),
multer           = require("multer"),
seedDB           = require("./seeds"),
indexRoutes      = require("./routes/index"),
campgroundRoutes = require("./routes/campgrounds"),
commentRoutes    = require("./routes/comments");

app.locals.moment = require("moment");

let DATABASEURL = process.env.DATABASEURL || "mongodb://localhost/yelp_camp_v12";

mongoose.connect(DATABASEURL, { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); // seed the database

// FAVICON
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// PASSPORT CONFIGRATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, function () {
    console.log(`Server started on port ${PORT}`);
});