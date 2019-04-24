const mongoose = require("mongoose");
const Comment = require("./comment");

const campgroundSchema = new mongoose.Schema({
    name: "String",
    image: "String",
    description: "String",
    price: "String",
    location: "String",
    lat: "Number",
    lng: "Number",
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: "String"
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    createAt: {
        type: Date,
        default: Date.now
    }
});

// campgroundSchema.pre("remove", async function(){
//     await Comment.remove({
//         _id:{
//             $in: this.comments
//         }
//     });
// });

module.exports = mongoose.model("Campgrounds", campgroundSchema);