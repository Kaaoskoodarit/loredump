const mongoose = require("mongoose");

let Schema = mongoose.Schema({
	user:{type:String,index:true},
	ttl:Number,
	token:String
})

module.exports = mongoose.model("Session",Schema);