const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Campground = require("../models/campground");
const passport = require("passport");

// root route
router.get("/", function (req, res) {
    res.render("landing");
});

// show register form
router.get("/register", function (req, res) {
    res.render("register");
});
// handle sign up logic
router.post("/register", function (req, res) {
    var newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        avatar: req.body.avatar
    });
    User.register(newUser, req.body.password, function (err, user) {
        if(err){
            req.flash("error", err.message);
            return res.redirect('register');
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

// show login form
router.get("/login", function(req, res){
    res.render("login");
});
// handling login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    failureFlash: "Invalid username or password.",
    successFlash: "Welcome!"

}), function(req, res){});

// logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Already Logout");
    res.redirect("/campgrounds");
});

// USER PROFILE
router.get("/user/:id", function(req, res) {
    User.findById(req.params.id, function(err, foundUser) {
        if(err){
            req.flash("error", "Something goes wrong.")
            return res.redirect("/campgrounds");
        }
        Campground.find().where("author.id").equals(foundUser._id).exec(function(err, campgrounds){
            if(err){
                req.flash("error", "Something goes wrong.");
                return res.redirect("/campgrounds");
            }
            res.render("users/show", {user: foundUser, campgrounds: campgrounds});
        });
    });
});

module.exports = router;