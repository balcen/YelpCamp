require("dotenv").config();

var express      = require("express"),
app              = express(),
mongoose         = require("mongoose"),
flash            = require("connect-flash"),
passport         = require("passport"),
LocalStrategy    = require("passport-local"),
methodOverride   = require("method-override"),
bodyParser       = require("body-parser"),
User             = require("./models/user"),
seedDB           = require("./seeds"),
indexRoutes      = require("./routes/index"),
campgroundRoutes = require("./routes/campgrounds"),
commentRoutes    = require("./routes/comments");


mongoose.connect("mongodb+srv://guafei:Jl123789456$@clusterdemo-g0uuj.mongodb.net/yelp_camp_v11d?retryWrites=true", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); // seed the database

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

app.listen(3000, function () {
    console.log("listening on port 3000");
});