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
        if(err || !foundUser){
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

// USER PROFILE EDIT
router.get("/user/:id/edit", ownership, function(req, res) {
    User.findById(req.params.id, function(err, foundUser) {
        if(err || !foundUser) {
            req.flash("error", "Something goes wrong");
            return res.redirect("/campgrounds");
        } 
        res.render("users/edit", {user: foundUser});
    })
})

// USER PROFILE UPDATE
router.put("/user/:id", ownership, function(req, res) {
    User.findByIdAndUpdate(req.params.id, req.body.user, function(err){
        if(err) {
            req.flash("error", "Something go wrong")
            res.redirect("/user/" + req.params.id);
        } else {
            req.flash("success", "編輯完成");
            res.redirect("/user/" + req.params.id);
        }
    })
})

// Middleware for user profile check
function ownership(req, res, next){
    if(req.isAuthenticated()){
        if(req.params.id == req.user._id) {
            return next();
        } else {
            req.flash("error", "權限不足");
            res.redirect("/campgrounds");
        }
    } else {
        req.flash("error", "權限不足");
        res.redirect("/campgrounds");
    }
}

module.exports = router;