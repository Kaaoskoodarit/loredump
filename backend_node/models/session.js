const mongoose = require("mongoose");

// Mongoose Schema: defines the shape of documents within a collection
// In this case, user will indexed (faster to search by user)
let Schema = mongoose.Schema({
    user:{type:String,index:true},
    ttl:Number,                         // Time when session expires
    token:String
})

module.exports = mongoose.model("Session",Schema);