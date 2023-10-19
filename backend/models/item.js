const mongoose = require("mongoose");

let Schema = mongoose.Schema({
	user:{type:String,index:true},
	type:String,
	count:Number,
	price:Number
})

Schema.virtual("id").get(function() {
	return this._id
})

module.exports = mongoose.model("Item",Schema);