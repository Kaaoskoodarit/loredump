const express = require("express");
const categoryModel = require("../models/categoryPage");

// Create a new Router object
const router = express.Router();

// REST API

// Function to get a list of categorypages belonging to a user 
router.get("/",function(req,res) {
    // Find categories belonging to a user
    let query = {"creator":req.session.user}
    // This is a PROMISE; so .then().catch()
    categoryModel.find(query).then(function(categories) {
        // Check if header contains "mode", if not, return list of name+id pairs
        if(!req.headers.mode) {
            // Return status code + items in JSON format
            const namelist = categories.map(category => {
                return {
                    title:category.title,
                    id:category.id
                }
            })
            return res.status(200).json(namelist);     
        } 
        // If "mode" exists, check value: "verbose" is a list of full categories
        if(req.headers.mode === "verbose") {
            return res.status(200).json(categories); 
        } else {
            return res.status(400).json({"Message":"Bad Request"})
        }
           
    }).catch(function(error) {
        console.log("Failed to find categories. Reason",error);
        return res.status(500).json({"Message":"Internal Server Error"});
    })
})

// Function to get all items belonging to a category
router.get("/:id",function(req,res) {
    // Find items belonging to a category NOTE! Use "_id" in backend, virtual for front!
    let query = {"_id":req.params.id}
    // This is a PROMISE; so .then().catch()
    categoryModel.findOne(query).then(function(category) {
        // Return status code + items in JSON format
        return res.status(200).json(category);
    }).catch(function(error) {
        console.log("Failed to find category. Reason",error);
        return res.status(500).json({"Message":"Internal Server Error"});
    })
})

// "Function" to add categories into database
router.post("/",function(req,res) {
    // Check if request has a "body"...so that we can check "body.title" without issues
    if(!req.body) {               
        return res.status(400).json({"Message":"Bad Request"})
    }
    // Check if request has a "body.title"...if no "body" at all, crashes, hence prev. test
    if(!req.body.title) {          
        return res.status(400).json({"Message":"Bad Request"})
    }
    // If we have a body, create a page, add it to database, and return it via json
    let category = new categoryModel({                  
        "creator":req.session.user,
        "title":req.body.title,
        "links":req.body.links,
        "image":req.body.image,            // image url
        "description":req.body.description,
        "notes":req.body.notes
    })
    category.save().then(function(category) {
        return res.status(201).json(category);
    }).catch(function(error) {
        console.log("Failed to add new page. Reason",error);
        return res.status(500).json({"Message":"Internal Server Error"});
    })
    
})

// "Function" to remove categories from database
router.delete("/:id",function(req,res) {
    categoryModel.deleteOne({"_id":req.params.id,"creator":req.session.user}).then(function() {
        return res.status(200).json({"Message":"Success"});
    }).catch(function(error) {
        console.log("Failed to remove item. Reason",error);
        return res.status(500).json({"Message":"Internal Server Error"});
    });
})

// "Function" to edit categories in database
router.put("/:id",function(req,res) {
    if(!req.body) {               
        return res.status(400).json({"Message":"Bad Request"})
    }
    if(!req.body.title) {          
        return res.status(400).json({"Message":"Bad Request"})
    }
    let category = {       
        "creator":req.session.user,
        "title":req.body.title,
        "links":req.body.links,
        "image":req.body.image,            // image url
        "description":req.body.description,
        "notes":req.body.notes
    }
    // Replace one category in the database with the edited one, note "category" after ID&user check
    // This is a promise, so.... .then().catch()!
    categoryModel.replaceOne({"_id":req.params.id,"creator":req.session.user},category).then(function() {
        return res.status(204).json({"Message":"Success"});
    }).catch(function(error) {
        console.log("Failed to edit Category. Reason",error);
        return res.status(500).json({"Message":"Internal Server Error"});
    });
})

// "Function" to edit selected properties of a category in database
router.put("/update/:id",function(req,res) {
    if(!req.body) {              
        return res.status(400).json({"Message":"Bad Request"})
    }
    if(!req.body.update) {          
        return res.status(400).json({"Message":"Bad Request"})
    }
    let update = req.body.update
    // Replace selected parameters in category in the database with the edited ones, note "category" after ID&user check
    // This is a promise, so.... .then().catch()!
    categoryModel.findOneAndUpdate({"_id":req.params.id,"creator":req.session.user},update).then(function() {
        return res.status(204).json({"Message":"Success"});
    }).catch(function(error) {
        console.log("Failed to edit category. Reason",error);
        return res.status(500).json({"Message":"Internal Server Error"});
    });
})

// Export "router" from module
module.exports = router;