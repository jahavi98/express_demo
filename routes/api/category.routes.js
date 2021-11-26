const category = require("../../controllers/api/category.controller");
var express = require('express');
const {authJwt} = require("../../middleware");
var router = express.Router();


// Create a new category
router.post("/create", [authJwt.verifyToken], category.create);

// Retrieve all category
router.get("/list", [authJwt.verifyToken], category.findAll);

// Retrieve a single category with id
router.get("/:id", [authJwt.verifyToken], category.findOne);

// Update a category with id
router.put("/edit/:id", [authJwt.verifyToken], category.update);

// Delete a category with id
router.delete("/delete/:id", [authJwt.verifyToken], category.delete);

// Delete all category
router.delete("/", [authJwt.verifyToken], category.deleteAll);

module.exports = router;