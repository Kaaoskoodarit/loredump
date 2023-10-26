const express = require("express");             // basically same as import
const mongoose = require("mongoose");           // "import" Mongoose
const loreroute = require("./routes/loreroute"); // "imports" shoppingroute.js
const crypto = require("crypto");               // "imports" crypto
const bcrypt = require("bcrypt");               // "imports" bcrypt
const userModel = require("./models/user");      // "import" user model
const sessionModel = require("./models/session");  // "import" session model
require("dotenv").config()                      // "import" and configure DOTENV

// Start express: express makes node work on the interwebs
let app = express();                            

// BODYPARSER JSON

// Makes sure application understands json
app.use(express.json());                        

// set port for server to 3001 if not given from environment
let port = process.env.PORT || 3001;            

// MONGOOSE CONNECTION
// Add mongodb constants from environmental variables (potentially DOTENV)
const mongodb_url = process.env.MONGODB_URL;
const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;

// Add name of database between "/" and "?" (after url); in this case, "shoppingdatabase"
const url = "mongodb+srv://"+mongodb_user+":"+mongodb_password+"@"+mongodb_url+"/LoreDump?retryWrites=true&w=majority";

// Allows use of virtual properties to data
mongoose.set("toJSON",{virtuals:true});

// Connect to mongodb with Mongoose
mongoose.connect(url).then(
    () => console.log("Connected to Mongo Atlas"),
    (error) => console.log("Failed to connect to Mongo Atlas. Reason",error)
)

// LOGIN CONSTANTS
// One hour in milliseconds = timeout
const time_to_live_diff = 3600000;
//const time_to_live_diff = 10000;

// LOGIN MIDDLEWARES

// Create a random token
const createToken = () => {
    // Create a random set of 64 bytes, which is then converted into a "hex" based string
    let token = crypto.randomBytes(64);
    return token.toString("hex");
}

// Check if user is logged in: this is actually Middleware!
// Must return either an error, or pass "next() forward
const isUserLogged = (req,res,next) => {
    // If header has no tokens, error
    if(!req.headers.token) {
        return res.status(403).json({"Message":"Forbidden"});
    }
    // Find session from database: look for ONE entry with correct token
    // this is a PROMISE, so resolve with ".then":
    sessionModel.findOne({"token":req.headers.token}).then(function(session) {
        // If can't find token, send error message
        if(!session) {
            return res.status(403).json({"Message":"Forbidden"});
        }
        // Get current time
        let now = Date.now();
        // Check if session expired: if so, delete one entry from database
        if(now>session.ttl) {
            // Deletes one entry from database, matching the session ID
            // This is also a promise, so .then().catch()
            sessionModel.deleteOne({"_id":session._id}).then(function() {
                return res.status(403).json({"Message":"Forbidden"});
            }).catch(function(error) {
                console.log("Failed to remove session. Reason",error);
                return res.status(403).json({"Message":"Forbidden"});
            })
        } else {
            // If session is NOT expired, add more time to session
            session.ttl = now+time_to_live_diff;
            req.session = {};
            req.session.user = session.user;
            // Save session to database: this is a promise, so .then().catch()
            session.save().then(function() {
                return next();
            }).catch(function(error) {
                console.log("Failed to resave session. Reason",error);
                return next();
            })
        }
    // This ia a catch for the "findOne" promise!
    }).catch(function(error) {
        console.log("Failed to find session. Reason",error);
        return res.status(403).json({"Message":"Forbidden"});
    });
}

// LOGIN API

// Function to create a new account: happends when requesting 
// "POST" to "/register"
app.post("/register",function(req,res) {
    // Start by checking req.body exists, and then username & password stuff
    if(!req.body) {
        return res.status(400).json({"Message":"Bad Request"});
    }
    if(!req.body.username || !req.body.password) {
        return res.status(400).json({"Message":"Bad Request"});
    }
    if(req.body.username.length < 4 || req.body.password.length < 8) {
        return res.status(400).json({"Message":"Bad Request"});
    }
    // Encrypt the password, and save it as a hash, 14 is number of encrypting "rounds"...higher number, takes longer to do -> safer
    // Point to make encrypting take about 1 second-ish....annoying for computers, but not for humans
    // After that, adds new account to registeredUsers
    bcrypt.hash(req.body.password,14,function(err,hash) {
        if(err) {
            console.log(err);
            return res.status(500).json({"Message":"Internal server error"});
        }
        // Create a new user using a user model, defined in a different file
        let user = new userModel({
            username: req.body.username,
            password: hash
        })
        // Other way of handling promises, then is success, catch is rejection
        // Save user to database
        user.save().then(function(user) {
            return res.status(201).json({"Message":"Registered Successfully"})
        }).catch(function(err) {
            if(err.code === 11000) {
                return res.status(409).json({"Message":"Username already in use"})
            }
            return res.status(500).json({"Message":"Internal Server Error"})
        })
    })
})

// Function to login to an account: Send "POST" request to "/login"
app.post("/login",function(req,res) {
    // Start by checking req.body exists, and then username & password stuff
    if(!req.body) {
        return res.status(400).json({"Message":"Bad Request"});
    }
    if(!req.body.username || !req.body.password) {
        return res.status(400).json({"Message":"Bad Request"});
    }
    if(req.body.username.length < 4 || req.body.password.length < 8) {
        return res.status(400).json({"Message":"Bad Request"});
    }
    // Search database for username, returns a promise which is handled by then and catch
    userModel.findOne({"username":req.body.username}).then(function(user) {
        if(!user) {
            return res.status(401).json({"Message":"Unauthorized"})
        }
        // Hashes the given password, and compares to saves hashed password
        bcrypt.compare(req.body.password,user.password,function(err,success) {
            // Actual error
            if(err) {
                console.log(err);
                return res.status(500).json({"Message":"Internal Server Error"});
            }
            // Wrong password
            if(!success) {
                return res.status(401).json({"Message":"Unauthorized"})
            }
            // If everything fine, create session
            let token = createToken();
            let now = Date.now();
            let session = new sessionModel({
                "token":token,
                "user":req.body.username,
                "ttl":now+time_to_live_diff
            })
            // Save new session to database
            session.save().then(function() {
                return res.status(200).json({"token":token});
            }).catch(function(error) {
                console.log(error);
                return res.status(500).json({"Message":"Internal Server Error"});
            });           
        })
    // Catch for findOne!
    }).catch(function(error) {
        console.log(error);
        return res.status(500).json({"Message":"Internal Server Error"});
    })
})

// Function to logout: send "POST" to "/logout"
app.post("/logout",function(req,res) {
    // Check that request has a token in the header
    if(!req.headers.token) {
        return res.status(404).json({"Message":"Not Found"});
    }
    // Delete one session, this is a promise, so .then().catch()
    sessionModel.deleteOne({"token":req.headers.token}).then(function() {
        return res.status(200).json({"Message":"Logged out"});
    }).catch(function(error) {
        console.log("Failed to remove session in logout. Reason",error);
        return res.status(500).json({"Message":"Internal Server Error"});
    })
})

// When trying to use app, first check isUserLogged (middleware), 
// if that return "next(), go to shoppingrote"
// This works on route "/api", the register, login and logout have their
// own routes!
app.use("/",isUserLogged,loreroute);                  

console.log("Running in port ",port);           // Just to see that we are running the server

app.listen(port);                               // Listening to port....