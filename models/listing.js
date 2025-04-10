const mongoose = require("mongoose");
const { Schema } = mongoose;
const Review=require("./reviews.js");
const User=require("./user.js");

const listSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },

    image: {
        type: String,
        default: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set: (v) => v === "" ? "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v
    },
    price: {
        type: Number
    },
    location: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref: 'Review' 
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref: 'User' 
    }
})

listSchema.post("findOneAndDelete", async function(list) {
    if(list.reviews.length){
        await Review.deleteMany({_id:{$in:list.reviews}});
    }
});

const List =mongoose.model("List",listSchema);

module.exports=List;
