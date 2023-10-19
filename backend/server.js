const express = require("express");
const shoppingroute = require("./routes/shoppingroute");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const userModel = require("./models/user");
const sessionModel = require("./models/session");

let app = express();

//BODYPARSER JSON

app.use(express.json());

let port = process.env.PORT || 3001;

//MONGOOSE CONNECTION

const mongo_url = process.env.MONGODB_URL;
const mongo_user = process.env.MONGODB_USER;
const mongo_password = process.env.MONGODB_PASSWORD;

const url = "mongodb+srv://"+mongo_user+":"+mongo_password+"@"+mongo_url+"/shoppingdatabase?retryWrites=true&w=majority"

mongoose.connect(url).then(
() => console.log("Connected to Mongo Atlas"),
(error) => console.log("Failed to connect to Mongo Atlas. Reason",error)
)

mongoose.set("toJSON",{virtuals:true});

//LOGIN DATABASES
const time_to_live_diff = 3600000;

//LOGIN MIDDLEWARES

const createToken = () => {
	let token = crypto.randomBytes(64);
	return token.toString("hex");
}

const isUserLogged = (req,res,next) => {
	if(!req.headers.token) {
		return res.status(403).json({"Message":"Forbidden"});
	}
	sessionModel.findOne({"token":req.headers.token}).then(function(session) {
		if(!session) {
			return res.status(403).json({"Message":"Forbidden"});
		}
		let now = Date.now();
		if(now > session.ttl) {
			sessionModel.deleteOne({"_id":session._id}).then(function() {
				return res.status(403).json({"Message":"Forbidden"})
			}).catch(function(error) {
				console.log("Failed to remove session. Reason",error);
				return res.status(403).json({"Message":"Forbidden"})
			})
		} else {
			session.ttl = now + time_to_live_diff;
			req.session = {};
			req.session.user = session.user;
			session.save().then(function() {
				return next();
			}).catch(function(error) {
				console.log("Failed to resave session. Reason",error);
				return next();
			})
		}
	}).catch(function(error){
		console.log("Failed to find session. Reason",error);
		return res.status(403).json({"Message":"Forbidden"})
	})
}

//LOGIN API

app.post("/register",function(req,res) {
	if(!req.body) {
		return res.status(400).json({"Message":"Bad Request"});
	}
	if(!req.body.username || !req.body.password) {
		return res.status(400).json({"Message":"Bad Request"});
	}
	if(req.body.username.length < 4 || req.body.password.length < 8) {
		return res.status(400).json({"Message":"Bad Request"});
	}
	bcrypt.hash(req.body.password,14,function(err,hash) {
		if(err) {
			console.log(err);
			return res.status(500).json({"Message":"Internal server error"})
		}
		let user = new userModel({
			username:req.body.username,
			password:hash
		})
		user.save().then(function(user) {
			return res.status(201).json({"Message":"Register success"})
		}).catch(function(err) {
			if(err.code === 11000) {
				return res.status(409).json({"Message":"Username already in use"})
			}
			return res.status(500).json({"Message":"Internal Server Error"})
		})
	})
})

app.post("/login",function(req,res) {
	if(!req.body) {
		return res.status(400).json({"Message":"Bad Request"});
	}
	if(!req.body.username || !req.body.password) {
		return res.status(400).json({"Message":"Bad Request"});
	}
	if(req.body.username.length < 4 || req.body.password.length < 8) {
		return res.status(400).json({"Message":"Bad Request"});
	}
	userModel.findOne({"username":req.body.username}).then(function(user) {
		if(!user) {
			return res.status(401).json({"Message":"Unauthorized"});
		}
		bcrypt.compare(req.body.password,user.password,function(err,success) {
			if(err) {
				console.log(err);
				return res.status(500).json({"Message":"Internal server error"});
			}
			if(!success) {
				return res.status(401).json({"Message":"Unauthorized"});
			}
			let token = createToken();
			let now = Date.now();
			let session = new sessionModel({
				"token":token,
				"user":req.body.username,
				"ttl":now+time_to_live_diff
			})
			session.save().then(function() {
				return res.status(200).json({"token":token});
			}).catch(function(error) {
				console.log(error);
				return res.status(500).json({"Message":"Internal Server Error"});
			});
		})
	}).catch(function(error) {
		console.log(error);
		return res.status(500).json({"Message":"Internal Server Error"})
	})
})

app.post("/logout",function(req,res) {
	if(!req.headers.token) {
		return res.status(404).json({"Message":"Not found"});
	}
	sessionModel.deleteOne({"token":req.headers.token}).then(function() {
		return res.status(200).json({"Message":"Logged out"})
	}).catch(function(error) {
		console.log("Failed to remove session in logout. Reason",error);
		return res.status(500).json({"Message":"Internal Server Error"});
	})
})

app.use("/api",isUserLogged,shoppingroute);

console.log("Running in port",port);

app.listen(port);