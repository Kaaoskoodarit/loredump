const mongoose = require("mongoose");

// Mongoose Schema: defines the shape of documents within a collection
let Schema = mongoose.Schema({
    creator:{type:String,index:true},
    title:{type:String,index:true},
    links:{type:[String],index:true},  // List of page IDs
    image:String,            // image url
    description: String,
    notes: String
})

// Create a virtual property "id" to data that is made from "_id"
// Can also define virtual "set" function
Schema.virtual("id").get(function() {
    return this._id;
})

module.exports = mongoose.model("CategoryPage",Schema);