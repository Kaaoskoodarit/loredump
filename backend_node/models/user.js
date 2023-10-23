const mongoose = require("mongoose");

// Mongoose Schema: defines the shape of documents within a collection
// In this case, username & password are strings, usernames must be unique
let Schema = mongoose.Schema({
    username:{type:String,unique:true},
    password:String
})

// Create a virtual property "id" to data that is made from "_id"
// Can also define virtual "set" function
Schema.virtual("id").get(function() {
    return this._id;
})

module.exports = mongoose.model("User",Schema);