const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    username: "String",
    password: "String",
    firstName: "String",
    lastName: "String",
    avatar: {
        type:"String",
        default: "https://images.unsplash.com/photo-1552343204-09c57040d686?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1351&q=80"
    },
    email: "String",
    description: "String"
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);