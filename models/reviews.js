const mongoose = require("mongoose");
const { Schema } = mongoose;
const User=require("./user");

const reviewSchema = new Schema({
    rating: String,
    comment: String,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    author:{
        type:Schema.Types.ObjectId,
        ref: 'User' 
    }
})

const Review= mongoose.model("Review", reviewSchema);

module.exports=Review;