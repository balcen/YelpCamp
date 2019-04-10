var Campgrounds = require("../models/campground");
var Comment = require("../models/comment");

// all the middleware goes here

var middlewareObj = {
    
    checkCampgroundOwnership: function(req, res, next){
        if(req.isAuthenticated()){
            Campgrounds.findById(req.params.id, function(err, foundCampground){
                if(foundCampground.author.id.equals(req.user._id)){
                    return next();
                    
                } else if(err || !foundCampground){
                    req.flash("error", "Campground not found");
                    res.redirect("back");
                }
                req.flash("error", "You do not have permission to do that");
                res.redirect("back");
            });
        }else{
            req.flash("error", "You need to be logged in to do that");
            res.redirect("back");
        }
    },
    
    checkCommentOwnership: function(req, res, next){
        if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id, function(err, foundComment){
                if(foundComment.author.id.equals(req.user._id)){
                    return next();
                } else if(err || !foundComment){
                    req.flash("error", "Comment not found");
                }
                res.redirect("back");
            });
        }else{
            res.redirect("back");
        }
    },
    
    isLoggedIn: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/login");
    }
};




module.exports = middlewareObj;