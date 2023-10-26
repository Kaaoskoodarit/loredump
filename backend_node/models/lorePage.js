const mongoose = require("mongoose");

// Mongoose Schema: defines the shape of documents within a collection
let Schema = mongoose.Schema({
    creator:{type:String,index:true},
    title:{type:String,index:true},
    categories:{type:[String],index:true},
    image:String,            // image url
    summary: String,
    description: String,
    notes: String,
    relationships: [{
        reltype: String,
        target: String,
        _id:false
    }]
})

// Create a virtual property "id" to data that is made from "_id"
// Can also define virtual "set" function
Schema.virtual("id").get(function() {
    return this._id;
})

module.exports = mongoose.model("LorePage",Schema);