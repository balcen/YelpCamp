var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: "String",
    password: "String",
    firstName: "String",
    lastName: "String",
    avatar: "String",
    email: "String"
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);