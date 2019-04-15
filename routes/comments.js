const express = require("express");
const router = express.Router({mergeParams: true});
const Campgrounds = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");

// Comment New
router.get("/new", middleware.isLoggedIn, function (req, res) {
    Campgrounds.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { campground: campground });
        }
    });
});

// Comment Create
router.post("/", middleware.isLoggedIn, function (req, res) {
    // lookup campground using ID
    Campgrounds.findById(req.params.id, function (err, foundCampground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            // create new comment
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save the comment
                    comment.save();
                    foundCampground.comments.push(comment);
                    foundCampground.save();
                    // redirect campground show page
                    req.flash("success", "Already create a comment success");
                    res.redirect("/campgrounds/" + foundCampground._id);
                }
            });
        }
    });
});

// Comment Edit
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Campgrounds.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
            res.redirect("back");
        } else{
            Comment.findById(req.params.comment_id, function(err, foundComment){
                if(err){
                    console.log(err);
                    res.redirect("back");
                }else {
                    res.render("comments/edit", {comment: foundComment, campground: foundCampground});
                }
            })
        }
    });
    // res.send("this is edit page")
});

// Comment Update
router.put("/:comment_id", middleware.checkCommentOwnership,function(req, res){
    Campgrounds.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment,function(err, commentUpdated){
                if(err){
                    console.log(err);
                    res.redirect("back");
                } else {
                    res.redirect("/campgrounds/" + req.params.id);
                }
            });
        }
    })
});

// Comment Destroy
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            console.log(err);
            res.redirect("back");
        }
        req.flash("success", "Comment deleted");
        res.redirect("/campgrounds/" + req.params.id);
    }) 
});


module.exports = router;