var express = require("express");
var router = express.Router();
var Campgrounds = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// Geocoder

var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

// INDEX - show all campgrounds
router.get("/", function (req, res) {
    // Get all campgrounds from DB
    Campgrounds.find({}, function (err, campgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds: campgrounds});
        }
    });
});

// CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn,function (req, res) {
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    req.body.campground.author = author;

    geocoder.geocode(req.body.campground.location, function(err, data){
        if(err || !data.length) {
            req.flash("error", "Invalid address");
            return res.redirect("back");
        }
        req.body.campground.lat = data[0].latitude;
        req.body.campground.lng = data[0].longitude;
        req.body.campground.location = data[0].formattedAddress;
        
        // Create a new campground and save to DB
        Campgrounds.create(req.body.campground, function (err, campground) {
            if (err) {
                console.log(err);
            } else {
                res.redirect("/campgrounds");
            }
        });
    });
});

// NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn,function (req, res) {
    res.render("campgrounds/new");
});

// SHOW - shows more info about one campground
router.get("/:id", function (req, res) {
    // find the campground with provided ID
    Campgrounds.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err || !foundCampground) {
            req.flash("error", "Campground not found");
            res.redirect("back");
        } else {
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership,function(req, res){
    Campgrounds.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campground not found");
            res.redirect("back");
        } else{
            res.render("campgrounds/edit", {campground: foundCampground})
        }
    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    geocoder.geocode(req.body.campground.location, function(err, data){
        if(err || !data.length){
            req.flash("error", "Invalid Address");
            return res.redirect("back");
        } 
        req.body.campground.lat = data[0].latitude;
        req.body.campground.lng = data[0].longitude;
        req.body.campground.location = data[0].formmatedAddress;
        
        Campgrounds.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
            if(err){
                res.redirect("/campgrounds");
            }else{
                res.redirect("/campgrounds/" + req.params.id);
            }
        });
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership,function(req, res){
    Campgrounds.findByIdAndRemove(req.params.id, function(err, campgroundRemoved){
        if(err){
            console.log(err);
        }
        Comment.deleteMany({_id: {$in: campgroundRemoved.id}}, function(err){
            if(err){
                console.log(err);
            }
            res.redirect("/campgrounds");
        })
    });
});


module.exports = router;