const  mongoose = require("mongoose");
const List =require("../models/listing.js");
let sampleListings =require("./data.js");


main().then((res)=>{
    console.log("connection successful");
}).catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}


async function insertData() {
sampleListings=sampleListings.map((obj)=>( {...obj,owner:'668162000951050a5aeb7856'}) );
const data=List.insertMany(sampleListings);
await data;
}

insertData() 