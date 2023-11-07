const express = require("express");
const loreModel = require("../models/lorePage");

// Create a new Router object
const router = express.Router();

// REST API

// Function to get pages belonging to a user: "GET" request to "/lorepage" 
router.get("/", function (req, res) {
    // Find items belonging to a user
    let query = { "creator": req.session.user }
    // This is a PROMISE; so .then().catch()
    loreModel.find(query).then(function (pages) {
        // Return status code + items in JSON format       
        return res.status(200).json(pages);
    }).catch(function (error) {
        console.log("Failed to find pages. Reason", error);
        return res.status(500).json({ "Message": "Internal Server Error" });
    })
})

// Function to get all items belonging to a page: "GET" request to "/lorePage/id" 
router.get("/:id", function (req, res) {
    // Find items belonging to a page NOTE! Use "_id" in backend, virtual for front!
    let query = { "_id": req.params.id }
    // This is a PROMISE; so .then().catch()
    loreModel.findOne(query).then(function (page) {
        // Return status code + items in JSON format
        return res.status(200).json(page);
    }).catch(function (error) {
        console.log("Failed to find page. Reason", error);
        return res.status(500).json({ "Message": "Internal Server Error" });
    })
})

// "Function" to add items into database: "POST" request to "/lorepage"
router.post("/", function (req, res) {
    // Check if request has a "body"...so that we can check "body.title" without issues
    if (!req.body) {
        return res.status(400).json({ "Message": "Bad Request" })
    }
    // Check if request has a "body.title"...if no "body" at all, crashes, hence prev. test
    if (!req.body.title) {
        return res.status(400).json({ "Message": "Bad Request" })
    }
    // If we have a body, create a page, add it to database, and return it via json
    let page = new loreModel({
        "creator": req.session.user,
        "title": req.body.title,
        "categories": req.body.categories,
        "image": req.body.image,            // image url
        "summary": req.body.summary,
        "description": req.body.description,
        "notes": req.body.notes,
        "relationships": req.body.relationships
    })
    page.save().then(function (page) {
        return res.status(201).json(page);
    }).catch(function (error) {
        console.log("Failed to add new page. Reason", error);
        return res.status(500).json({ "Message": "Internal Server Error" });
    })

})


// "Function" to remove pages from database: "DELETE" request to "/lorepage/id"
router.delete("/:id", function (req, res) {
    loreModel.deleteOne({ "_id": req.params.id, "creator": req.session.user }).then(function () {
        return res.status(200).json({ "Message": "Success" });
    }).catch(function (error) {
        console.log("Failed to remove item. Reason", error);
        return res.status(500).json({ "Message": "Internal Server Error" });
    });
})

// "Function" to edit pages in database: "PUT" request to "/shopping/id"
router.put("/:id", function (req, res) {
    if (!req.body) {
        return res.status(400).json({ "Message": "Bad Request" })
    }
    if (!req.body.title) {
        return res.status(400).json({ "Message": "Bad Request" })
    }
    let page = {
        "creator": req.session.user,
        "title": req.body.title,
        "categories": req.body.categories,
        "image": req.body.image,            // image url
        "summary": req.body.summary,
        "description": req.body.description,
        "notes": req.body.notes,
        "relationships": req.body.relationships
    }
    // Replace one page in the database with the edited one, note "page" after ID&user check
    // This is a promise, so.... .then().catch()!
    loreModel.replaceOne({ "_id": req.params.id, "creator": req.session.user }, page).then(function () {
        return res.status(204).json({ "Message": "Success" });
    }).catch(function (error) {
        console.log("Failed to edit page. Reason", error);
        return res.status(500).json({ "Message": "Internal Server Error" });
    });
})

// "Function" to edit selected properties of a page in database
router.put("/update/:id", function (req, res) {
    if (!req.body) {
        return res.status(400).json({ "Message": "Bad Request" })
    }
    if (!req.body.update) {
        return res.status(400).json({ "Message": "Bad Request" })
    }
    let update = req.body.update
    // Replace selected parameters in page in the database with the edited ones, note "category" after ID&user check
    // This is a promise, so.... .then().catch()!
    loreModel.findOneAndUpdate({ "_id": req.params.id, "creator": req.session.user }, update).then(function () {
        return res.status(204).json({ "Message": "Success" });
    }).catch(function (error) {
        console.log("Failed to edit category. Reason", error);
        return res.status(500).json({ "Message": "Internal Server Error" });
    });
})

// Export "router" from module
module.exports = router;