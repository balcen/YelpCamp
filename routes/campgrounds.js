const express = require("express");
const multer = require("multer");
const router = express.Router();
const cloudinary = require("cloudinary");
const Campgrounds = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");

// Multer configuration
// multer - diskStorage
const storage = multer.diskStorage({
    filename: function(req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});

// filter config
const imageFilter = function(req, file, cb) {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
}

const upload = multer({ storage: storage, fileFilter: imageFilter });

// Cloudinary Configuration - option to use environment variable of CLOUDINARY_URL
cloudinary.config({
    cloud_name: "dhivb8oa7",
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRETE
})

// Geocoder

const NodeGeocoder = require('node-geocoder');
 
const options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
const geocoder = NodeGeocoder(options);

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
// upload.single can upload a file as name of image
router.post("/", middleware.isLoggedIn, upload.single("image"), function (req, res) {
    // ensure that file already been uploaded to cloudinary
    cloudinary.uploader.upload(req.file.path, function(result) {
        req.body.campground.image = result.url;

        req.body.campground.author = {
            id: req.user._id,
            username: req.user.username
        }
    
        // ensure that location has been founded
        geocoder.geocode(req.body.campground.location, function(err, data){
            if(err || !data.length) {
                req.flash("error", `Invalid address ${err}`);
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
    })
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